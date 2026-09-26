const EXACT = new Map([
  ['generating supports…', 'создание поддержек…'], ['reading STEP…', 'чтение STEP…'],
  ['Import', 'Импорт'], ['Build volume', 'Область печати'], ['Overhang', 'Нависание'],
  ['Add fins', 'Добавить рёбра'], ['Fins on', 'Рёбра включены'],
  ['Export STL', 'Экспорт STL'], ['Export 3MF', 'Экспорт 3MF'],
  ['File', 'Файл'], ['Triangles', 'Треугольники'], ['Size', 'Размер'],
  ['Volume', 'Объём'], ['Overhangs', 'Нависания'], ['Area', 'Площадь'],
  ['Bed contact', 'Контакт со столом'], ['Fins', 'Рёбра'], ['Bed pad', 'Опорная площадка'],
  ['Analysis', 'Анализ'], ['Rotate 90°', 'Повернуть на 90°'], ['Reset', 'Сбросить'],
  ['Undo', 'Отменить'], ['Redo', 'Повторить'],
  ['Drag the rings to turn it, or:', 'Для поворота перетаскивайте кольца или:'],
  ['Lay a face flat', 'Уложить гранью на стол'], ['Show layers', 'Показать слои'],
  ['Suggest orientation', 'Подобрать ориентацию'], ['Ranking…', 'Подбор…'],
  ['Strength arrow', 'Стрелка нагрузки'], [': which way is it loaded?', ': куда направлена нагрузка?'],
  ['⊙ front', '⊙ к вам'], ['⊗ back', '⊗ от вас'], ['Clear', 'Сбросить'],
  ['Turn to the strongest printable pose', 'Повернуть для максимальной прочности при печати'],
  ['Setup', 'Настройки'], ['Material', 'Материал'], ['Placement', 'Размещение'],
  ['Auto — place supports for me', 'Автоматически — разместить поддержки'],
  ['Draw — place them by hand', 'Ручное размещение — расставить поддержки'],
  ['Tines', 'Перемычки'], ['grip the part', 'фиксируют деталь'],
  ['Tine grip', 'Фиксация перемычками'], ['light ⟶ firm', 'слабая ⟶ сильная'],
  ['Layer height', 'Высота слоя'], ['Clearances', 'Зазоры'],
  ['Support gap', 'Зазор поддержки'], ['Off', 'Выкл.'], ['Auto', 'Автоматически'],
  ['Light', 'Лёгкая'], ['Sure hold', 'Надёжная фиксация'],
  ['Custom', 'Свои настройки'], ['Custom…', 'Свои настройки…'],
  ['Pad thickness', 'Толщина площадки'], ['Pad gap', 'Зазор площадки'],
  ['Pad grip', 'Сцепление площадки'], ['Pad spread', 'Выступ площадки'],
  ['Sway braces', 'Распорки'], ['tall parts', 'высокие детали'],
  ['Brace grip from', 'Начало фиксации'], ['mm up', 'мм от стола'],
  ['Brace tine spacing', 'Шаг перемычек'], ['Brace depth', 'Глубина распорки'],
  ['% of height', '% высоты'], ['Walls', 'Стенки'], ['Cutouts', 'Вырезы'],
  ['None', 'Нет'], ['Diamond', 'Ромб'], ['Triangle', 'Треугольник'],
  ['Arch', 'Арка'], ['Lattice', 'Решётка'],
  ['Wide-face coverage', 'Поддержка широкой грани'], ['sparse ⟶ dense', 'реже ⟶ чаще'],
  ['+ Add walls by hand', '+ Добавить стенки вручную'],
  ['Done adding walls', 'Завершить добавление стенок'],
  ['Remove fins', 'Удалить рёбра'], ['Restore all', 'Восстановить все'],
  ['Click an', 'Нажмите на'], ['overhang face', 'нависающую грань'],
  ['— it lights up green when a fin can go there — to stand a support fin against it.',
    '— она подсвечивается зелёным, если здесь можно разместить ребро поддержки.'],
  ['Remove selected', 'Удалить выбранное'], ['Clear all', 'Удалить все'],
  ['not needed', 'не нужна'], ['added', 'добавлена'],
  ['Sure hold (small foot)', 'Надёжная фиксация (малая опора)'],
  ['Auto (Light)', 'Автоматически (Лёгкая)'],
  ['Auto (Sure hold)', 'Автоматически (Надёжная фиксация)'],
  ['none yet', 'пока нет'], ['none possible', 'невозможно разместить'],
  ['none', 'нет'], ['fits', 'помещается'],
  ['Best', 'Лучшая'], ['No support', 'Без поддержек'], ['Bores clean', 'Чистые отверстия'],
  ['off', 'выкл.'], ['solid', 'сплошные'],
  ['Click a fin — Esc done', 'Нажмите на ребро — Esc завершает режим'],
  ['The tines grab onto the part and bend away when you snap the supports off.',
    'Соединительные перемычки держатся за деталь и отгибаются при отламывании поддержек.'],
  ['The tines grab onto the part and bend away when you snap the wall off.',
    'Соединительные перемычки держатся за деталь и отгибаются при отламывании стенки.'],
  ['The fins stand a hair off the part (0.2mm) so they pop off. Turn Tines on if you want them to grip.',
    'Рёбра стоят с небольшим зазором от детали (0.2 мм), чтобы легко отламываться. Включите перемычки для крепления к детали.'],
  ['These are plain props, not gripping fins. The overhangs here are too shallow or curved to stand a fin against, so there are no tines to add.',
    'Это простые подпорки без крепления к детали. Нависания здесь слишком пологие или изогнутые для ребра, поэтому соединительные перемычки добавить нельзя.'],
  ['The sway braces stand edge-on against the tall sides and are tied on by tines all the way up, so the top can’t drift or wobble as it prints.',
    'Стабилизирующие распорки стоят торцом к высоким сторонам и крепятся перемычками по всей высоте, чтобы верх детали не смещался при печати.'],
  ['The load pulls straight across the layers — where prints split first.',
    'Нагрузка направлена поперёк слоёв — в направлении, где печатная деталь раскалывается первой.'],
  ['The load runs along the layers — the strong direction. Good.',
    'Нагрузка направлена вдоль слоёв — это прочное направление.'],
  ['This is about the strongest printable orientation for this load — a better-aligned pose wouldn’t sit on the bed.',
    'Это почти самая прочная пригодная для печати ориентация при такой нагрузке — более выгодное положение не удержится на столе.'],
  ['no flat upright face on this part in this orientation',
    'в этой ориентации у детали нет плоской вертикальной грани'],
  ['Click two points across an overhang (a line lands right where you draw it, red faces included) to lay a breakaway wall under it.',
    'Укажите две точки поперёк нависания, чтобы поставить под ним отламываемую стенку; линия пройдёт точно по нарисованному месту, включая красные грани.'],
  ['couldn’t place that brace: too little of this face lines up with the brace for its tines to grip — try a flatter part of the side.',
    'не удалось поставить распорку: с ней совмещается слишком малая часть грани для крепления перемычек — попробуйте более плоский участок стороны.'],
  ['of support material added', 'на поддержки'],
  ['Print it support-free, in any slicer', 'Печатайте без поддержек слайсера'],
  ['Rotate a part however it prints best, and Support Fins bakes the breakaway supports right into the STL. It prints the same on any machine, in any slicer, with supports turned off.',
    'Поверните деталь в удобную для печати ориентацию, и Support Fins добавит отламываемые поддержки прямо в STL. Результат одинаков на любом принтере и в любом слайсере с выключенными поддержками.'],
  ['Import an STL, 3MF or STEP.', 'Импортируйте STL, 3MF или STEP.'],
  ['Drop it anywhere on this page.', 'Перетащите файл в любое место этой страницы.'],
  ['Rotate it.', 'Поверните деталь.'],
  ['Red marks every surface that needs support.', 'Красным отмечены поверхности, которым нужна поддержка.'],
  ['Export.', 'Экспортируйте.'],
  ['Fins come baked in — no slicer supports needed.', 'Рёбра уже в модели — поддержки слайсера не нужны.'],
  ['Opening the 3MF, Bambu Studio and PrusaSlicer may note it has “no config” and load the geometry only — that’s expected. The file is pure geometry with no slicer profile baked in, so it opens the same in every slicer; your part comes in correctly oriented and sized. Just slice with supports off.',
    'При открытии 3MF Bambu Studio и PrusaSlicer могут сообщить об отсутствии настроек и загрузке только геометрии — это нормально. Файл содержит геометрию без профиля слайсера и открывается одинаково во всех слайсерах; ориентация и размеры детали сохраняются. Нарезайте с выключенными поддержками.'],
  ['Nothing is uploaded. The file is read inside this tab and never leaves your machine.',
    'Файлы никуда не отправляются. Обработка выполняется в этой вкладке, и файл не покидает ваш компьютер.'],
  ['Free and open source. If it ever saves you a print,',
    'Бесплатно и с открытым исходным кодом. Если проект спасёт вашу печать,'],
  ['buy me a coffee ☕', 'угостите автора кофе ☕'],
  ['This file has several objects', 'В файле несколько объектов'],
  ['Pick the one to add fins to. Check more than one to merge them into a single part.',
    'Выберите объект для добавления рёбер. Отметьте несколько, чтобы объединить их в одну деталь.'],
  ['Cancel', 'Отмена'], ['Load', 'Загрузить'],
  ['No supports needed this way up.', 'В этой ориентации поддержки не нужны.'],
  ['This prints clean lying flat. You only need fins if you’re tilting it for strength.',
    'В исходном положении плашмя деталь печатается без поддержек. Рёбра нужны, только если вы наклоняете её для повышения прочности.'],
  ['Click a pose to turn the part.', 'Нажмите на вариант, чтобы повернуть деталь.'],
  ['Nothing to suggest for this part.', 'Для этой детали нет подходящих вариантов.'],
  ['No printable orientation: this part balances on a point at every angle.',
    'Нет пригодной для печати ориентации: при любом повороте деталь опирается на точку.'],
  ['Collapse suggestions', 'Свернуть варианты'], ['Show suggestions', 'Показать варианты'],
  ['Collapse', 'Свернуть'], ['Show', 'Показать'],
  ['width', 'ширина'], ['depth', 'глубина'], ['height', 'высота'],
  ['Surface angle from the plate below which a face needs support.',
    'Угол поверхности относительно стола, ниже которого грани нужна поддержка.'],
  ["Opens oriented and support-free in Bambu Studio, OrcaSlicer, or PrusaSlicer. Bambu/PrusaSlicer may note 'no config, geometry only' — expected; the part still comes in correct.",
    'Открывается в заданной ориентации и не требует поддержек слайсера в Bambu Studio, OrcaSlicer или PrusaSlicer. Bambu/PrusaSlicer могут сообщить об отсутствии настроек и загрузке только геометрии — это нормально; деталь импортируется правильно.'],
  ['Source code on GitHub. Runs entirely in your browser; no file ever leaves your machine.',
    'Исходный код на GitHub. Всё работает в браузере; файлы не покидают ваш компьютер.'],
  ['Support Fins on GitHub', 'Support Fins на GitHub'],
  ['Support Fins is free and open source — buy me a coffee on Ko-fi.',
    'Support Fins — бесплатный проект с открытым исходным кодом. Поддержите автора чашкой кофе на Ko-fi.'],
  ['How these supports work, and what this pose leaves uncovered',
    'Как работают поддержки и какие участки остаются без поддержки в этой ориентации'],
  ['Rotate 90 degrees about X', 'Повернуть на 90 градусов вокруг X'],
  ['Rotate 90 degrees about Y', 'Повернуть на 90 градусов вокруг Y'],
  ['Rotate 90 degrees about Z', 'Повернуть на 90 градусов вокруг Z'],
  ['Undo (⌘/Ctrl+Z)', 'Отменить (⌘/Ctrl+Z)'],
  ['Redo (⇧⌘/Ctrl+Shift+Z)', 'Повторить (⇧⌘/Ctrl+Shift+Z)'],
  ["Click this, then click a face to set it flat on the bed. Off by default so a stray click can't re-lay the part.",
    'Нажмите эту кнопку, затем выберите грань, чтобы уложить её на стол. По умолчанию режим выключен, чтобы случайный щелчок не менял положение детали.'],
  ['Show the horizontal print layers around the part.', 'Показать горизонтальные слои печати вокруг детали.'],
  ['Load direction', 'Направление нагрузки'], ['Load points up', 'Нагрузка направлена вверх'],
  ['Load points down', 'Нагрузка направлена вниз'], ['Load points left', 'Нагрузка направлена влево'],
  ['Load points right', 'Нагрузка направлена вправо'],
  ['Load points toward you', 'Нагрузка направлена к вам'],
  ['Load points away from you', 'Нагрузка направлена от вас'],
  ['About this number', 'Об этом значении'],
  ['Interactive 3D preview of the loaded part. Orientation and support stats are reported as text in the panel on the left.',
    'Интерактивный 3D-просмотр загруженной детали. Ориентация и параметры поддержек показаны текстом на панели слева.'],
  ["The filament you'll print in. PETG fuses to supports much harder than PLA, so PETG loosens the gaps, shrinks the tine bite, and gives the bed pad a gap instead of a bite. PLA keeps the tighter grip.",
    'Материал для печати. PETG сильнее сплавляется с поддержками, чем PLA, поэтому для него увеличены зазоры, уменьшено заглубление перемычек, а опорная площадка отделена зазором. Для PLA сохраняется более плотное сцепление.'],
  ['Who places the support.', 'Способ размещения поддержек.'],
  ['Tines fuse the support to the part so it grips instead of just propping. Off = plain breakaway wall.',
    'Перемычки сплавляют поддержку с деталью, фиксируя её. Если выключены, остаётся обычная отламываемая стенка.'],
  ['How tightly to space the grip tines. Light = fewest marks (default), a per-wall floor keeps grip; Firm = dense comb / max grip for a tippy or tall part.',
    'Плотность соединительных перемычек. Слабая фиксация оставляет меньше следов; сильная даёт частые перемычки для неустойчивой или высокой детали.'],
  ["Set this to the layer height you slice at. The grip tines are one layer tall so they snap off clean; if this doesn't match your slicer, the tines tear and leave marks. Default 0.2mm.",
    'Укажите высоту слоя из слайсера. Перемычки имеют высоту одного слоя и легко отламываются; при несовпадении настроек они рвутся и оставляют следы. По умолчанию 0.2 мм.'],
  ['Clearance between a support top and the part. Bigger = cleaner surface / easier removal; too big stops holding the overhang. Default 0.2mm.',
    'Зазор между верхом поддержки и деталью. Больший зазор облегчает снятие и улучшает поверхность; слишком большой перестаёт удерживать нависание. По умолчанию 0.2 мм.'],
  ['A tilted part rests on an edge and peels off the plate without a pad. Auto: Light, or Sure hold when the part meets the plate on a point or a small round foot (it shows which). Light: one layer, 0.12mm off the part, peels off like a brim. Sure hold: thicker and tacked into the part, holds harder but is harder to remove. Custom: set every number yourself.',
    'Наклонённая деталь опирается на ребро и без площадки может оторваться от стола. Автоматический режим выбирает лёгкую или усиленную площадку по площади контакта. Свои настройки позволяют задать все параметры.'],
  ['How tall the pad is. Only the first layer grips the plate; more layers make it stiffer and harder to peel.',
    'Толщина площадки. Со столом сцепляется только первый слой; дополнительные слои увеличивают жёсткость и затрудняют снятие.'],
  ["Sideways clearance between the pad and the part's first layer. 0.12mm lets first-layer squish just close it, the way a slicer brim holds; bigger comes off easier and holds less. Under 0.1mm most slicers merge the gap and the pad welds on. 0 = no gap (Pad grip decides).",
    'Боковой зазор между площадкой и первым слоем детали. При 0.12 мм расплющивание первого слоя закрывает зазор, как у каймы; больший зазор облегчает снятие, но ослабляет фиксацию. 0 = без зазора.'],
  ["Where the pad meets the part's underside. Positive bites in to hold harder; 0 is flush; negative leaves a gap that snaps off cleaner.",
    'Контакт площадки с нижней поверхностью детали. Положительное значение заглубляет площадку; 0 — вровень; отрицательное оставляет зазор.'],
  ["How far the pad spreads past the part's contact with the plate. More spread = more plate grip.",
    'Насколько площадка выступает за область контакта детали со столом. Больший выступ улучшает сцепление со столом.'],
  ["Stand tapered buttress ribs against the upright sides of a tall part, tied on with tines all the way up, so it doesn't drift or wobble as it grows. In Draw, click an upright side to add one.",
    'Сужающиеся распорки у вертикальных сторон высокой детали предотвращают смещение и раскачивание. В ручном режиме нажмите на вертикальную сторону, чтобы добавить распорку.'],
  ['Height the brace tines start at. 0 = grip the whole height; raise it to tie on only above where the part starts to move.',
    'Высота начала перемычек распорки. 0 = фиксация по всей высоте; увеличьте значение для фиксации только выше места раскачивания.'],
  ['Vertical distance between brace tines. Smaller = held tighter, more marks on the side. Default 6mm.',
    'Расстояние по вертикали между перемычками распорки. Меньше — крепче фиксация и больше следов. По умолчанию 6 мм.'],
  ['How far the brace reaches out at the bed, as a share of its height. Deeper = stiffer, more plastic. Default 15%.',
    'Выступ распорки по столу в долях её высоты. Большая глубина повышает жёсткость и расход пластика. По умолчанию 15%.'],
  ["Cut holes through tall breakaway walls to save filament. The top edge that holds the part, the foot, and the wall's ends stay solid, and every hole has a pointed roof so it prints without bridging. Short walls stay solid.",
    'Отверстия в высоких отламываемых стенках экономят пластик. Верхняя кромка, основание и торцы остаются сплошными; короткие стенки также остаются сплошными.'],
  ['How densely to line a WIDE overhang face with fins. The middle is the anti-sag default; drag LEFT for fewer fins (a small part can go down to one — the readout warns if a broad face then risks sagging), RIGHT for more support. Narrow parts are unaffected.',
    'Частота рёбер под широкой нависающей гранью. Сдвиг влево уменьшает число рёбер, вправо — увеличивает. На узкие детали настройка не влияет.'],
  ['Place extra breakaway walls by hand, on top of the auto-placed ones.', 'Добавить отламываемые стенки вручную к автоматически размещённым.'],
  ['Click a fin to remove just that one. Esc or right-click cancels.', 'Нажмите на ребро, чтобы удалить его. Esc или правая кнопка мыши отменяет режим.'],
  ['Bring back every fin removed in this orientation.', 'Восстановить все рёбра, удалённые в этой ориентации.'],
  ['Remove the support you clicked (Delete or Backspace also works).', 'Удалить выбранную поддержку (также можно нажать Delete или Backspace).'],
  ["Grams assume PLA and count only the fins + pad the tool adds, printed near-solid, cross-checked against the builder's fin volume. In test prints, breakaway fins used 20–45% less plastic and printed ~30% faster than slicer supports.",
    'Масса рассчитана для PLA и учитывает добавленные рёбра и площадку при почти сплошной печати. В тестах отламываемые рёбра расходовали на 20–45% меньше пластика и печатались примерно на 30% быстрее поддержек слайсера.'],
]);

const TEMPLATES = [
  { pattern: /^Merge (\d+) & load$/, replace: ([, n]) => `Объединить ${n} и загрузить` },
  { pattern: /^(\d+) selected — merged into one part$/, replace: ([, n]) => `Выбрано: ${n} — будут объединены в одну деталь` },
  { pattern: /^Could not read (.+):\n([\s\S]+)$/, replace: ([, file, detail]) => `Не удалось прочитать ${file}:\n${detail}` },
  { pattern: /^Click a face to lay it flat — Esc cancels$/, replace: () => 'Выберите грань для укладки на стол — Esc отменяет' },
  { pattern: /^(\d+(?:\.\d+)?) mm²$/, replace: ([, n]) => `${n} мм²` },
  { pattern: /^(\d+(?:\.\d+)?) mm$/, replace: ([, n]) => `${n} мм` },
  { pattern: /^(\d+) fps$/, replace: ([, n]) => `${n} кадр/с` },
  { pattern: /^(\d+) region(?:s)?(?: \(\+(\d+) sliver(?:s)?\))?$/, replace: ([, n, small]) => `Участков: ${n}${small ? ` (мелких: +${small})` : ''}` },
  { pattern: /^imported “(.+)” of (\d+) objects$/, replace: ([, name, total]) => `Импортирован объект «${name}»; всего объектов: ${total}` },
  { pattern: /^STEP: merged (\d+) of (\d+) objects into one part; tessellated at (\d+(?:\.\d+)?) mm\.$/, replace: ([, count, total, tolerance]) =>
    `STEP: объединено объектов: ${count} из ${total}; точность тесселяции ${tolerance} мм.` },
  { pattern: /^3MF: imported “(.+)” of (\d+) objects\.$/, replace: ([, name, total]) =>
    `3MF: импортирован объект «${name}»; всего объектов: ${total}.` },
  { pattern: /^(\d+) drawn walls?(?: · (\d+) tines)?$/, replace: ([, walls, tines]) =>
    `Стенок вручную: ${walls}${tines ? ` · соединительных перемычек: ${tines}` : ''}` },
  { pattern: /^(?=\d+ (?:support fins?|props?|drawn|sway braces?))(.*)$/, replace: ([, value]) => value
    .replace(/(\d+) support fins?/g, 'рёбер поддержки: $1')
    .replace(/(\d+) props?/g, 'подпорок: $1')
    .replace(/(\d+) drawn/g, 'вручную: $1')
    .replace(/(\d+) sway braces?/g, 'стабилизирующих распорок: $1')
    .replace(/(\d+) brace tines/g, 'перемычек распорок: $1')
    .replace(/(\d+) tines/g, 'соединительных перемычек: $1')
    .replace(/\((\d+) removed\)/g, '(удалено: $1)') },
  { pattern: /^(light|medium|firm) grip · (\d+(?:\.\d+)?) mm$/, replace: ([, grip, mm]) =>
    `${({ light: 'слабая', medium: 'средняя', firm: 'сильная' })[grip]} фиксация · ${mm} мм` },
  { pattern: /^(\d+(?:\.\d+)?) mm gap · pad (.+)$/, replace: ([, mm, pad]) => {
    const names = { auto: 'автоматически', 'auto (light)': 'автоматически (лёгкая)',
      'auto (sure hold)': 'автоматически (надёжная фиксация)' };
    return `${mm} мм зазор · площадка ${names[pad] ?? pad}`;
  } },
  { pattern: /^(\d+(?:\.\d+)?) мм зазор · площадка (.+)$/, replace: ([, mm, pad]) => {
    const names = { auto: 'автоматически', 'auto (light)': 'автоматически (лёгкая)',
      'auto (sure hold)': 'автоматически (надёжная фиксация)' };
    return names[pad] ? `${mm} мм зазор · площадка ${names[pad]}` : `${mm} мм зазор · площадка ${pad}`;
  } },
  { pattern: /^(.+) cutouts$/, replace: ([, style]) => `${style} · вырезы` },
  { pattern: /^(\d+(?:\.\d+)?) mm tines · (\d+(?:\.\d+)?)% deep(?: · from (\d+(?:\.\d+)?) mm)?$/, replace: ([, spacing, depth, from]) =>
    `${spacing} мм между перемычками · глубина ${depth}%${from ? ` · от ${from} мм` : ''}` },
  { pattern: /^(\d+(?:\.\d+)?) mm · no fins(?: · (\d+) rough)?$/, replace: ([, mm, rough]) =>
    `${mm} мм · без рёбер${rough ? ` · шероховатых участков: ${rough}` : ''}` },
  { pattern: /^(\d+(?:\.\d+)?) mm · (\d+) fins?(?: · (\d+) rough)?$/, replace: ([, mm, fins, rough]) =>
    `${mm} мм · рёбер: ${fins}${rough ? ` · шероховатых участков: ${rough}` : ''}` },
];

const DYNAMIC_PHRASES = [
  { pattern: /This way up it needs no fins, 0 g\./g, replace: 'В этой ориентации рёбра не нужны, 0 г.' },
  { pattern: /It prints tall, though, the weaker direction, so check the Strength arrow if it bears a load\./g,
    replace: 'Но деталь печатается в высоту, в менее прочном направлении: если она будет под нагрузкой, проверьте стрелку нагрузки.' },
  { pattern: /plus (\d+) walls? you added by hand\./g, replace: 'Также добавлено стенок вручную: $1.' },
  { pattern: /(\d+) overhangs? (?:is|are) too shallow for a fin this way up\. Tilt the part steeper so a fin can follow it \(try Suggest orientation\), or add a wall by hand\./g,
    replace: 'Нависаний, слишком пологих для ребра в этой ориентации: $1. Увеличьте наклон детали, попробуйте «Подобрать ориентацию» или добавьте стенку вручную.' },
  { pattern: /(\d+) overhangs? (?:sits|sit) inside a bore or slot, where a support would leave a mark you can’t reach\. The tool leaves (?:it|them) alone, so turn the hole upward to print (?:it|them) clean\./g,
    replace: 'Нависаний внутри отверстия или паза: $1. Поддержка оставила бы там недоступный след, поэтому поверните отверстие вверх для чистой печати.' },
  { pattern: /this part meets the plate on a small foot \((under 1|\d+) mm of first-layer edge\), too little for a Light pad to grip, so Auto made it Sure hold, touching the part to hold it\./g,
    replace: (_, edge) => `У детали малая площадь опоры на стол (${edge === 'under 1' ? 'менее 1' : edge} мм края первого слоя): для лёгкой площадки этого недостаточно, поэтому автоматический режим выбрал надёжную фиксацию с контактом с деталью.` },
  { pattern: /this part meets the plate on a small foot \((under 1|\d+) mm of first-layer edge\); a pad with a gap has almost nothing to grip\. Sure hold, or Pad gap 0, holds it\./g,
    replace: (_, edge) => `У детали малая площадь опоры на стол (${edge === 'under 1' ? 'менее 1' : edge} мм края первого слоя); площадке с зазором почти не за что зацепиться. Выберите надёжную фиксацию или зазор площадки 0.` },
  { pattern: /this part balances on one point, so the bed pad is holding it\. Print with the pad on\./g,
    replace: 'Деталь опирается на одну точку, поэтому её держит опорная площадка. Печатайте с включённой площадкой.' },
  { pattern: /selected: wall (\d+)mm long, (\d+) tines\. Press Delete or Remove selected to take it out \(Esc to keep it\)\./g,
    replace: 'Выбрана стенка длиной $1 мм, перемычек: $2. Нажмите Delete или «Удалить выбранное» для удаления (Esc — оставить).' },
  { pattern: /(?:вручную: )?(\d+) walls? couldn’t attach here \(this overhang sits above another part of the model, so a wall standing on the plate can’t reach it — rotate so it faces the plate\)\./g,
    replace: 'Не удалось прикрепить стенок вручную: $1 (на пути от стола к нависанию находится другая часть модели — поверните нависание к столу).' },
];

const ALLOWED_ENGLISH = [
  /Support Fins/gi, /GitHub/gi, /Ko-fi/gi, /Bambu Studio/gi, /OrcaSlicer/gi,
  /PrusaSlicer/gi, /STL/gi, /3MF/gi, /STEP/gi, /PLA/gi, /PETG/gi,
  /ZIP64?/gi, /CAD/gi, /mm(?:²|³)?/gi, /fps/gi, /Ctrl/gi, /Shift/gi,
  /Esc/gi, /Delete/gi, /Backspace/gi, /X|Y|Z/g,
];

export const DOM_RULES = Object.freeze([
  { selector: '#s-name', ignoreText: true },
  { selector: '#picker-list .pick-name', ignoreText: true },
  { selector: '#picker-list input', ignoreText: true },
]);

function splitOuterWhitespace(value) {
  const match = String(value).match(/^(\s*)([\s\S]*?)(\s*)$/);
  return { before: match[1], core: match[2], after: match[3] };
}

export function translateText(value) {
  const { before, core, after } = splitOuterWhitespace(value);
  const fixed = EXACT.get(core.replace(/\s+/g, ' '));
  if (fixed != null) return `${before}${fixed}${after}`;
  for (const template of TEMPLATES) {
    const match = core.match(template.pattern);
    if (match) return `${before}${template.replace(match)}${after}`;
  }
  let dynamic = core;
  for (const phrase of DYNAMIC_PHRASES) dynamic = dynamic.replace(phrase.pattern, phrase.replace);
  for (const [source, target] of EXACT) {
    if (source.length >= 12 && dynamic.includes(source)) dynamic = dynamic.replaceAll(source, target);
  }
  if (dynamic !== core) return `${before}${dynamic}${after}`;
  return String(value);
}

export function hasTranslation(value) { return translateText(value) !== String(value); }

export function isAllowedEnglish(value) {
  let remainder = String(value).replace(/“[^”]+”|«[^»]+»/g, '');
  for (const allowed of ALLOWED_ENGLISH) remainder = remainder.replace(allowed, '');
  return !/[A-Za-z]{2,}/.test(remainder);
}

export const catalog = Object.freeze({ exact: EXACT, templates: TEMPLATES });
