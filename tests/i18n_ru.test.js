import {
  hasTranslation,
  isAllowedEnglish,
  translateText,
} from '../web/locales/ru/catalog.js';
import { collectStaticHtmlEnglish, collectUnexpectedEnglish } from '../localization/ru/check-ui.js';
import { validateManifest } from '../localization/ru/check-docs.js';

function assertEquals(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\nexpected: ${JSON.stringify(expected)}\nactual:   ${JSON.stringify(actual)}`);
  }
}

Deno.test('ru catalog translates fixed interface text and preserves outer whitespace', () => {
  assertEquals(translateText('Import'), 'Импорт');
  assertEquals(translateText('  Add fins\n'), '  Добавить рёбра\n');
  assertEquals(translateText('  Import an STL, 3MF\n or STEP. '), '  Импортируйте STL, 3MF или STEP. ');
  assertEquals(hasTranslation('Suggest orientation'), true);
});

Deno.test('ru catalog translates parameterized messages without changing their values', () => {
  assertEquals(translateText('Merge 3 & load'), 'Объединить 3 и загрузить');
  assertEquals(
    translateText('Could not read bracket.step:\ninvalid mesh'),
    'Не удалось прочитать bracket.step:\ninvalid mesh',
  );
  assertEquals(translateText('5 support fins · 26 tines + 1 prop'),
    'рёбер поддержки: 5 · соединительных перемычек: 26 + подпорок: 1');
  assertEquals(translateText('0.2 mm gap · pad Автоматически (Лёгкая)'),
    '0.2 мм зазор · площадка Автоматически (Лёгкая)');
  assertEquals(translateText('20 mm · no fins'), '20 мм · без рёбер');
  assertEquals(translateText('0.2 mm gap · pad auto (sure hold)'),
    '0.2 мм зазор · площадка автоматически (надёжная фиксация)');
  assertEquals(
    translateText('This way up it needs no fins, 0 g. It prints tall, though, the weaker direction, so check the Strength arrow if it bears a load.'),
    'В этой ориентации рёбра не нужны, 0 г. Но деталь печатается в высоту, в менее прочном направлении: если она будет под нагрузкой, проверьте стрелку нагрузки.',
  );
  assertEquals(translateText('(1 removed)'), '(удалено: 1)');
  assertEquals(translateText('1 drawn wall + 1 sway brace · 8 tines'),
    'стенок вручную: 1 + стабилизирующих распорок: 1 · соединительных перемычек: 8');
  assertEquals(translateText('5 support fins · 26 tines + 1 drawn'),
    'рёбер поддержки: 5 · соединительных перемычек: 26 + стенок вручную: 1');
  assertEquals(isAllowedEnglish(translateText(
    '1 drawn wall couldn’t attach here (this overhang sits above another part of the model, so a wall standing on the plate can’t reach it — rotate so it faces the plate)',
  )), true);
  assertEquals(isAllowedEnglish(translateText(
    'this part balances on one point with nothing under it. Turn the bed pad on, or rotate until it sits down',
  )), true);
  assertEquals(isAllowedEnglish(translateText(
    'coverage is below the anti-sag guide, so a broad overhang may sag between supports — nudge the slider right if the surface bows',
  )), true);
  assertEquals(isAllowedEnglish(translateText(
    '⚠ 3 small overhangs (hole ceilings, slots, bore tops) print unsupported this way up and may come out rough. Try Suggest orientation to point them up.',
  )), true);
});

Deno.test('ru catalog leaves unknown text unchanged so upstream UI remains usable', () => {
  assertEquals(translateText('A brand new upstream message'), 'A brand new upstream message');
});

Deno.test('ru catalog is idempotent and preserves user object names', () => {
  const source = '3MF: imported “Suggest orientation” of 2 objects.';
  const once = translateText(source);
  assertEquals(once, '3MF: импортирован объект «Suggest orientation»; всего объектов: 2.');
  assertEquals(translateText(once), once);
});

Deno.test('ru allowlist accepts product terms but not untranslated prose', () => {
  assertEquals(isAllowedEnglish('Support Fins · STL · 3MF · STEP · PLA · PETG · 0.2 mm'), true);
  assertEquals(isAllowedEnglish('3MF: импортирован объект «Object 1»; всего объектов: 2.'), true);
  assertEquals(isAllowedEnglish('A brand new upstream message'), false);
});

Deno.test('UI snapshot check ignores user filenames and rejects untranslated controls', () => {
  const run = { steps: [{ name: 'loaded', dom: {
    's-name': { t: 'bracket.step' },
    export: { t: 'Экспорт STL', title: 'Save model' },
  } }] };
  assertEquals(collectUnexpectedEnglish(run), [
    { step: 'loaded', id: 'export', field: 'title', text: 'Save model' },
  ]);
});

Deno.test('Russian documentation manifest matches every English document', async () => {
  assertEquals(await validateManifest('.'), []);
});

Deno.test('every static HTML label, hint, and ARIA attribute has a translation or allowlist entry', async () => {
  assertEquals(collectStaticHtmlEnglish(await Deno.readTextFile('web/index.html')), []);
});
