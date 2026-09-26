/**
 * The status readout: the Fins/Pad rows, the note under them and its (i), the
 * grams receipt, and why a part got no fins.
 */
import { PAD } from '../fins.js';
import { el } from './dom.js';
import { removedIds } from './remove.js';
import { drawnWalls, drawMsg, selectedWall, selectedNote, drawShown, drawMaterial } from './walls.js';
import {
  finMode, finsVisible, activeAdded, materialDensity, analysisTiming, syncSectionSums,
  finMaterial, padMaterial,
} from '../app.js';

/**
 * Why did this part get no fins, in terms the user can act on?
 *
 * "No flat vertical face" is technically true and useless: it does not say
 * whether to rotate the part, accept it, or wait for draw mode. Each stage of
 * the search discards candidates for a different reason, so name the stage that
 * actually emptied out.
 */
function explainNoFins(b) {
  // A part balanced on a point cannot be rescued by ANY support UNLESS the
  // bed pad is on to seat it (the shelter hubs print exactly that way), so
  // saying "no flat face" or "part in the way" sends the user to tune
  // something that was never the problem. This outranks every mode-specific
  // reason below.
  if (b.seating?.kind === 'point' && !b.pad) {
    return 'деталь касается печатного стола в одной точке и не может '
         + 'стоять устойчиво. Включите опорную площадку или поверните деталь, чтобы она опиралась '
         + 'на грань или ребро';
  }
  if (b.mode === 'prop') {
    const s = b.skipped ?? {};
    if (!b.rejected.sites) return 'в этой ориентации нет нависаний, требующих подпорок';
    // Named in the order that tells the user the most. Each is a different
    // stage of the search, and lumping them into "blocked" is what let M5 be
    // recorded as working on a part where it built nothing.
    if (s.wanders) {
      const one = s.wanders === 1;
      return `Чашеобразных нависаний: ${s.wanders}${one ? '' : ''}. Их форма отличается от `
           + `выступа — ${one ? 'их' : 'их'} нижние точки образуют кольцо, а не `
           + 'линию, вдоль которой можно построить стенку. Поверните деталь или выберите '
           + '«Ручное размещение» и поставьте стенку вручную';
    }
    if (s.buried || s.weld) {
      return 'любая стенка, достигающая этих нависаний, сплавится с '
           + 'деталью — поверните её или выберите «Ручное размещение» и поставьте стенку вручную';
    }
    if (s.blocked) {
      return 'ни один участок нависаний не подходит по длине для стенки — '
           + 'мешает сама деталь или они слишком близко к печатному столу';
    }
    if (s.stub || s.noLine || s.sliver) {
      return 'нависания слишком малы или расположены слишком низко, чтобы им требовалась стенка';
    }
    if (s.degenerate) {
      return 'линии контакта вырождаются в точку — нет линии для построения стенки';
    }
    return 'в этой ориентации ни под одним нависанием нельзя поставить подпорку';
  }
  const st = b.patchStats ?? {};
  if (!b.patchCount) {
    // a cylinder or a mesh of small facets has no flat face wide enough
    return (st.tooNarrow ?? 0) > (st.notFlat ?? 0)
      ? 'нет достаточно широкой плоской поверхности для ребра — на изогнутых или '
        + 'мелкогранных поверхностях нет плоской грани для крепления'
      : 'в этой ориентации у детали нет плоской вертикальной грани';
  }
  if (!b.rejected.sites) {
    return st.tooHigh
      ? `Найдено плоских граней: ${st.tooHigh}${st.tooHigh === 1 ? '' : ''}, но все `
        + 'они начинаются слишком высоко — большая часть ребра останется без контакта с деталью. '
        + 'Поверните деталь так, чтобы плоская грань доходила до печатного стола'
      : 'в этой ориентации нет подходящей грани — попробуйте повернуть деталь';
  }
  if (b.rejected.blocked) {
    return 'деталь мешает поставить стенку во всех найденных местах '
         + '— поверните её или выберите «Ручное размещение» и поставьте стенку вручную';
  }
  return 'в подходящих местах ребро окажется внутри детали — попробуйте повернуть её';
}

// Grams use the selected material's density (materialDensity, set by applyMaterial),
// so the number is honest rather than pretending to be machine truth.

/** Signed volume of a closed triangle-soup, mm^3. Fins and pad are closed solids. */
function meshVolumeMM3(tris) {
  let v = 0;
  for (let i = 0; i < tris.length; i += 3) {
    const a = tris[i], b = tris[i + 1], c = tris[i + 2];
    v += a[0] * (b[1] * c[2] - b[2] * c[1])
       - a[1] * (b[0] * c[2] - b[2] * c[0])
       + a[2] * (b[0] * c[1] - b[1] * c[0]);
  }
  return Math.abs(v) / 6;
}

export const fmtGrams = (g) => (g < 9.95 ? g.toFixed(1) : String(Math.round(g)));

/**
 * The "what did this actually get me" receipt. The headline -- the mass of
 * breakaway support the tool adds -- is EXACT (we generate that geometry, and
 * this volume was cross-checked against buildFins' own wall volume). It ticks as
 * you re-orient, so a better pose visibly costs less support.
 *
 * The saving vs. the slicer's own supports is deliberately NOT computed per part:
 * we can't slice in the browser, and a made-up "you saved 5.2 g" is exactly what
 * loses trust on the first print. Instead the sub-line states the MEASURED result
 * from the test prints (see video notes), which is a claim we can stand behind.
 */
function updateReceipt() {
  const box = el('receipt');
  const added = activeAdded();
  if (!finsVisible || !added.length) { box.hidden = true; return; }
  const grams = meshVolumeMM3(added) * materialDensity / 1000;
  el('r-grams').textContent = `${fmtGrams(grams)} г`;
  box.hidden = false;
}

/** Route the readout to the active mode. */
export function updateReadout(built, ms) {
  if (finMode === 'draw') updateDrawReadout(built, ms);
  else updateFinReadout(built, ms);
  updateReceipt();
}

/**
 * Two audiences, two homes. `lead` is the short, must-see stuff -- a support that
 * couldn't build, a part balanced on a point -- and stays in the status panel.
 * `detail` is the how-it-works / how-to-fix text, which reads as a wall when it's
 * always on, so it's tucked behind the (i) on the Fins row where a curious user
 * can hover for it. Either can be empty.
 */
function setFinNote(lead, detail) {
  el('s-fin-note').textContent = lead.length ? lead.join('. ') + '.' : '';
  const info = el('s-fin-info');
  const text = detail.filter(Boolean).join(' ');
  if (text) { info.title = text; info.hidden = false; }
  else { info.title = ''; info.hidden = true; }
}

/**
 * Draw mode's readout. Reports the breakaway WALLS the user drew by hand (a wall
 * per line, straight onto the overhang), plus the pad/seating verdict from
 * buildFins. When a drawn wall can't build it says WHY -- silence-as-success is
 * the exact bug M5's scoreboard was built on.
 */
function updateDrawReadout(built, ms) {
  finMaterial.transparent = padMaterial.transparent = drawMaterial.transparent = false;
  finMaterial.opacity = padMaterial.opacity = drawMaterial.opacity = 1;
  const box = el('s-fins');
  el('s-pad').textContent = built ? padStatus(built) : '—';

  const ok = drawnWalls.filter((w) => w.ok);
  const bad = drawnWalls.length - ok.length;
  const tines = ok.reduce((a, w) => a + (w.info?.tines ?? 0), 0);
  const braces = ok.filter((w) => w.kind === 'sway').length;
  const walls = ok.length - braces;
  const parts = [];
  if (walls) parts.push(`стенок вручную: ${walls}${walls === 1 ? '' : ''}`);
  if (braces) parts.push(`стабилизирующих распорок: ${braces}${braces === 1 ? '' : ''}`);
  box.textContent = ok.length
    ? parts.join(' + ') + (tines ? ` · соединительных перемычек: ${tines}` : '')
    : 'пока нет';
  box.classList.toggle('warn', ok.length === 0);

  const lead = [];
  const help = [];
  if (!drawnWalls.length && !drawMsg) {
    lead.push('Укажите две точки поперёк нависания (линия пройдёт там, где вы её '
      + 'начертите, в том числе по красным граням), чтобы поставить под ним отламываемую стенку');
  }
  if (ok.length) {
    help.push(tines
      ? 'Соединительные перемычки держатся за деталь и отгибаются, когда вы отламываете стенку.'
      : 'Каждая стенка заканчивается чуть ниже детали (0.2 мм), чтобы легко отламываться. Включите '
        + 'соединительные перемычки, если нужно крепление к детали.');
  }
  // A brace you place by hand is built even where Auto would refuse to stand one,
  // so say what it is doing: below its first tine it holds nothing and nothing
  // holds it, which is worth knowing but is your call to make.
  const stilted = ok.filter((w) => w.kind === 'sway' && (w.info?.stilt ?? 0) > 20);
  if (stilted.length) {
    const tallest = Math.max(...stilted.map((w) => w.info.stilt));
    help.push(`${stilted.length === 1 ? 'Одна распорка поднимается' : `Распорок без контакта с деталью: ${stilted.length}, высота`} `
      + `до ${Math.round(tallest)} мм перед креплением к детали — этот участок печатается как `
      + 'отдельно стоящая стенка. Если она раскачивается при печати, поверните деталь так, чтобы эта сторона доходила до печатного стола.');
  }
  if (bad) {
    const one = drawnWalls.find((w) => !w.ok);
    lead.push(`Не удалось построить стенок: ${bad}${bad === 1 ? '' : ''}`
      + `${one?.info?.reason ? ` (${one.info.reason})` : ''}. Отмените действие или начертите заново`);
  }
  if (drawMsg) lead.push(drawMsg);
  if (selectedWall) lead.push(selectedNote());
  if (built?.seating?.kind === 'point') {
    lead.push(built.pad
      ? 'деталь опирается на одну точку, поэтому её держит опорная площадка. Печатайте с площадкой'
      : 'деталь опирается на одну точку. Включите опорную площадку или поверните деталь до устойчивого положения');
  }
  if (built && padNote(built)) lead.push(padNote(built));
  setFinNote(lead, help);
  if (ms != null) el('s-time').textContent = `${analysisTiming} · площадка ${ms.toFixed(0)} мс`;
}

/**
 * The Light pad grips by first-layer squish along the part's first-layer outline.
 * A part on a point or a small round foot has only a few mm of it, so fins.js
 * builds Sure hold there instead (pad.autoSure) -- say so, since the user picked
 * Light. A Custom pad with a gap on such a foot gets a warning instead of a swap.
 */
function padStatus(built) {
  syncAutoLabel(built);
  if (!built.pad) return 'не нужна';
  return built.pad.autoSure ? 'Надёжная фиксация (малая опора)' : 'добавлена';
}
// The Auto option names what it built, so the dropdown never claims Light while
// the pad on screen is Sure hold.
function syncAutoLabel(built) {
  const opt = el('bed-pad').querySelector('option[value="auto"]');
  const p = built?.pad;
  opt.textContent = !p || PAD.style !== 'auto' ? 'Автоматически'
    : p.style === 'sure' ? 'Автоматически (Надёжная фиксация)' : 'Автоматически (Лёгкая)';
  syncSectionSums();
}
function padNote(built) {
  const p = built.pad;
  if (!p?.smallFoot) return '';
  const mm = p.outline < 1 ? 'менее 1 мм' : `${p.outline.toFixed(0)} мм`;
  if (p.autoSure) {
    return `У детали малая площадь опоры на печатный стол (${mm} края первого слоя): этого недостаточно для `
         + 'сцепления площадки «Лёгкая», поэтому режим «Автоматически» выбрал «Надёжная фиксация» с контактом для удержания детали';
  }
  if (PAD.style === 'light') {
    return `У детали малая площадь опоры на печатный стол (${mm} края первого слоя); площадке «Лёгкая» `
         + 'почти не за что зацепиться. Выберите «Автоматически» или «Надёжная фиксация»';
  }
  if (PAD.style === 'custom' && PAD.custom.gap > 0) {
    return `У детали малая площадь опоры на печатный стол (${mm} края первого слоя); площадке с зазором `
         + 'почти не за что зацепиться. Выберите «Надёжная фиксация» или задайте зазор площадки 0';
  }
  return '';
}

function updateFinReadout(built, ms) {
  finMaterial.transparent = padMaterial.transparent = false;
  finMaterial.opacity = padMaterial.opacity = 1;
  const box = el('s-fins');
  if (!built) {
    box.textContent = '—';
    box.classList.remove('warn');
    el('s-pad').textContent = '—';
    setFinNote([], []);
    return;
  }
  el('s-pad').textContent = padStatus(built);
  const n = built.fins.length;
  const kind = built.mode === 'prop' ? 'prop' : 'fin';
  // Hand-added walls (Suggest + Draw mix) count toward the tally too.
  const drawnOk = drawShown() ? drawnWalls.filter((w) => w.ok).length : 0;
  let autoTxt;
  if (built.mode === 'auto') {
    // Named apart so the readout is honest: the support fins sit on the overhangs
    // (tined when the toggle is on), the props are the fallback under ledges too
    // flat to take a fin. "N fins" alone would hide which is which.
    const p = built.propCount, b = built.braceCount;
    const seg = [];
    if (b) seg.push(`рёбер: ${b}${b === 1 ? '' : ''}` + (built.tines ? ` · соединительных перемычек: ${built.tines}` : ''));
    if (p) seg.push(`подпорок: ${p}${p === 1 ? '' : ''}`);
    autoTxt = seg.join(' + ');
  } else {
    autoTxt = n
      ? `Всего: ${n} · ${kind === 'prop' ? 'подпорки' : 'рёбра поддержки'}${n === 1 ? '' : ''}`
        + (built.mode === 'prop' || !built.tines ? '' : ` · соединительных перемычек: ${built.tines}`)
      : '';
  }
  const drawnTxt = drawnOk ? `${autoTxt ? ' + ' : ''}вручную: ${drawnOk}` : '';
  const removedN = removedIds.size;
  const removedTxt = removedN ? ` (удалено: ${removedN})` : '';
  const sw = built.sway;
  const swayTxt = sw?.count
    ? `${autoTxt || drawnTxt ? ' + ' : ''}стабилизирующих распорок: ${sw.count}${sw.count === 1 ? '' : ''}`
      + (sw.tines ? ` · перемычек распорок: ${sw.tines}` : '')
    : '';
  box.textContent = (autoTxt + drawnTxt + swayTxt + removedTxt) || 'невозможно разместить';
  box.classList.toggle('warn', n === 0 && !drawnOk && !sw?.count);

  // `lead` = short + must-see, stays in the panel; `help` = how-it-works and
  // how-to-fix, goes behind the (i). Split so the panel doesn't read as a wall.
  const lead = [];
  const help = [];
  if (!n && !drawnOk) {
    // Nothing placed -- the box already says "none possible"; the why goes in the
    // (i), since it's a paragraph and the user can hover for it.
    help.push(explainNoFins(built));
  } else if (n) {
    if (built.mode === 'auto') {
      // Make "why no tines" legible: props never take tines, only the gripping
      // fins do, so a part that gets only props shows no tines and that's correct.
      const b = built.braceCount, p = built.propCount;
      if (b) {
        help.push(built.tines
          ? 'Соединительные перемычки держатся за деталь и отгибаются при отламывании поддержек.'
          : 'Рёбра стоят с небольшим зазором от детали (0.2 мм), чтобы легко отламываться. Включите соединительные перемычки для крепления к детали.');
      }
      if (p && !b) {
        help.push('Это простые подпорки без крепления к детали. Эти нависания '
          + 'слишком пологие или изогнутые для ребра, поэтому соединительные перемычки добавить нельзя.');
      } else if (p) {
        help.push(`Подпорок: ${p}${p === 1 ? '' : ''}. Они стоят под нависаниями, слишком пологими `
          + 'для крепления, поэтому соединительных перемычек у них нет.');
      }
    } else if (built.mode === 'prop') {
      help.push('Каждая заканчивается чуть ниже детали (0.2 мм), поэтому её можно отломить без срезания.');
    }
  }
  if (drawnOk) {
    lead.push(`также добавлено стенок вручную: ${drawnOk}${drawnOk === 1 ? '' : ''}`);
  }
  // Hand-placement feedback has to surface here too (Suggest + Draw mix), or a
  // rejected wall fails silently -- the same silence-as-success trap as M5. This
  // one is an interactive failure, so it stays visible, not behind the (i).
  if (drawShown()) {
    const bad = drawnWalls.length - drawnOk;
    if (bad) {
      const one = drawnWalls.find((w) => !w.ok);
      lead.push(`Не удалось прикрепить стенок, размещённых вручную: ${bad}${bad === 1 ? '' : ''}`
              + (one?.info?.reason ? ` (${one.info.reason})` : ''));
    }
    if (drawMsg) lead.push(drawMsg);
    if (selectedWall) lead.push(selectedNote());
  }
  // Worth saying even when something WAS placed: a point-balanced part is
  // standing on the added pad and nothing else, so the pad is load-bearing,
  // not cosmetic. Must-see -> stays visible.
  if (n && built.seating?.kind === 'point') {
    lead.push(built.pad
      ? 'деталь опирается на одну точку, поэтому её держит опорная площадка. Печатайте с площадкой'
      : 'деталь опирается на одну точку без поддержки снизу. Включите опорную площадку или поверните деталь до устойчивого положения');
  }
  if (padNote(built)) lead.push(padNote(built));
  if (built.sagRisk) {
    // The coverage slider is left of centre, so a broad flat overhang got rows
    // spaced wider than the 12mm anti-sag guide. That's allowed on purpose (fewer
    // supports), but the plate can bow between them -- must-see, so it's in the
    // panel, not behind the (i).
    lead.push('плотность поддержек ниже рекомендуемой для защиты от провисания, поэтому широкое нависание может прогнуться '
            + 'между поддержками — сдвиньте ползунок вправо, если поверхность прогибается');
  }
  if (built.unserved) {
    // An un-served ledge is a shallow overhang with no room for a prop and too
    // flat to stand a fin against. The fix (tilt steeper) is a sentence, so it
    // rides in the (i) rather than the panel.
    help.push(`Нависаний, слишком пологих для ребра: ${built.unserved}${built.unserved === 1 ? '' : ''}. `
            + 'Увеличьте наклон детали, чтобы ребро могло '
            + 'пройти вдоль них (попробуйте «Подобрать ориентацию»), или добавьте стенку вручную.');
  }
  if (built.skipped?.bore) {
    // A support standing INSIDE a bore or slot scars a surface you can't clean --
    // worse than a little sag. The tool refuses those on purpose; the honest fix
    // is to rotate the hole so it faces out and prints clean with no support.
    const b = built.skipped.bore;
    help.push(`Нависаний внутри отверстий или пазов: ${b}${b === 1 ? '' : ''}. `
            + `Поддержка там оставит след в недоступном месте. Приложение оставляет `
            + `${b === 1 ? 'их' : 'их'} без поддержек: поверните отверстия вверх, чтобы напечатать `
            + `${b === 1 ? 'их' : 'их'} без следов.`);
  }
  // Sway braces were asked for, so say what they did -- and why, if nothing.
  if (sw) {
    if (!sw.count) lead.push(`нет стабилизирующих распорок: ${sw.reason}`);
    else {
      help.push('Стабилизирующие распорки стоят торцом к высоким сторонам и крепятся '
        + 'соединительными перемычками по всей высоте, чтобы верх детали не смещался и не раскачивался при печати.');
      if (sw.skipped) {
        help.push(`Мест для распорок, перекрытых деталью: ${sw.skipped}${sw.skipped === 1 ? '' : ''}. Мешает `
          + 'сама деталь. Выберите «Ручное размещение» и нажмите на вертикальную сторону, чтобы поставить распорку вручную.');
      }
    }
  }
  setFinNote(lead, help);
  // ms is absent when a hand-drawn wall (Suggest + Draw mix) re-runs the readout
  // without rebuilding the auto fins -- don't touch the timing line then, and
  // never throw, or the updateReceipt() call after this one never happens.
  if (ms != null) el('s-time').textContent = `${analysisTiming} · рёбра ${ms.toFixed(0)} мс`;
}
