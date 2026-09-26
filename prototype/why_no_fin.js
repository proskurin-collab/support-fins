/**
 * Walk the placement funnel for one part and print where the candidates die.
 *
 *   deno run --allow-read why_no_fin.js <model.stl> [tiltDeg]
 *
 * "0 fins" is the least useful thing the tool can say. Every stage here throws
 * candidates away for a different reason, and which stage is doing it decides
 * what to change -- a part rejected for flatness needs a different fix from one
 * rejected because every window is obstructed.
 */
const WEB = '/Users/matthewtrahan/projects/support-fins/web';
const { buildTopology, analyze } = await import(`${WEB}/overhangs.js`);
const { findWallPatches, MAX_LEAN_DEG, FLAT_TOL_IN, MIN_PATCH_H,
        MIN_PATCH_W, MIN_PATCH_AREA } = await import(`${WEB}/planes.js`);
const { buildFins, FIN } = await import(`${WEB}/fins.js`);

function readSTL(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const n = dv.getUint32(80, true);
  const pos = new Float32Array(n * 9);
  for (let f = 0; f < n; f++) {
    const o = 84 + f * 50 + 12;
    for (let i = 0; i < 9; i++) pos[f * 9 + i] = dv.getFloat32(o + i * 4, true);
  }
  return pos;
}

const path = Deno.args[0];
const tilt = Number(Deno.args[1] ?? 0);
const a = (tilt * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
const rot = [1, 0, 0, 0, c, s, 0, -s, c];

const pos = readSTL(Deno.readFileSync(path));
const topo = buildTopology({ getAttribute: () => ({ array: pos }) });
const res = analyze(topo, 45, rot);

const stats = {};
const patches = findWallPatches(topo, rot, res.offset, stats);

console.log(`${path.split('/').pop()}  наклон ${tilt}°  граней ${topo.nFaces}`);
console.log(`контакт со столом ${res.bedArea.toFixed(1)} мм2   областей нависаний ${res.regions.length}\n`);

console.log('ОТБОР УЧАСТКОВ');
console.log(`  сформировано групп кандидатов ${stats.grown ?? 0}`);
console.log(`  отклонено, площадь < ${MIN_PATCH_AREA} мм2      ${stats.tooSmall ?? 0}`);
console.log(`  отклонено, углубление > ${FLAT_TOL_IN} мм       ${stats.notFlat ?? 0}`);
console.log(`  отклонено, высота по грани < ${MIN_PATCH_H} мм  ${stats.tooShort ?? 0}`);
console.log(`  отклонено, ширина < ${MIN_PATCH_W} мм       ${stats.tooNarrow ?? 0}`);
console.log(`  ОСТАВШИЕСЯ УЧАСТКИ            ${patches.length}\n`);

if (patches.length) {
  console.log('КРУПНЕЙШИЕ УЧАСТКИ ПО ПЛОЩАДИ');
  for (const p of patches.slice(0, 8)) {
    const stilt = Math.max(0, p.z0 - FIN.baseH);
    const stiltOk = stilt <= FIN.stiltFrac * p.z1;
    console.log(`  площадь ${p.area.toFixed(0).padStart(6)} мм2  z ${p.z0.toFixed(1).padStart(6)}..${p.z1.toFixed(1).padStart(6)}` +
                `  длина ${(p.u1 - p.u0).toFixed(1).padStart(6)}  наклон ${p.lean.toFixed(0).padStart(2)}` +
                `  плоскостность ${p.flatness.toFixed(3)}  свободная высота ${stilt.toFixed(1).padStart(5)}` +
                `  ${stiltOk ? '' : '<- отклонено: свободная стойка слишком высокая'}`);
  }
  console.log();

  console.log('САМЫЕ НИЗКИЕ УЧАСТКИ (где можно поставить ребро)');
  const low = [...patches].sort((a, b) => a.z0 - b.z0).slice(0, 8);
  for (const p of low) {
    const stilt = Math.max(0, p.z0 - FIN.baseH);
    const stiltOk = stilt <= FIN.stiltFrac * p.z1;
    console.log(`  площадь ${p.area.toFixed(0).padStart(6)} мм2  z ${p.z0.toFixed(1).padStart(6)}..${p.z1.toFixed(1).padStart(6)}` +
                `  длина ${(p.u1 - p.u0).toFixed(1).padStart(6)}  наклон ${p.lean.toFixed(0).padStart(2)}` +
                `  свободная высота ${stilt.toFixed(1).padStart(5)}  ${stiltOk ? 'OK' : '<- отклонено: свободная стойка слишком высокая'}`);
  }
  console.log();
}

const built = buildFins(topo, res, rot, { mode: 'stabilize', bedPad: true });
console.log('РАЗМЕЩЕНИЕ');
console.log(`  ранжировано мест-кандидатов    ${built.rejected.sites}`);
console.log(`  фактических попыток            ${built.rejected.tried}`);
console.log(`  попыток без свободного окна    ${built.rejected.blocked}`);
console.log(`  построено и отклонено окон     ${built.rejected.tooFewTines}` +
            `   (стенка внутри детали или перемычек < ${FIN.minTines})`);
console.log(`  РЁБРА                          ${built.fins.length}` +
            `  (перемычек ${built.tines})`);
console.log(`\nограничения: наклон <= ${MAX_LEAN_DEG}°, длина стенки <= ${FIN.maxLen} мм, ` +
            `свободная стойка <= ${100 * FIN.stiltFrac}% высоты, расстояние между местами >= ${FIN.minSiteGap} мм`);
