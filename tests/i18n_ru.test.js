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
});

Deno.test('ru catalog leaves unknown text unchanged so upstream UI remains usable', () => {
  assertEquals(translateText('A brand new upstream message'), 'A brand new upstream message');
});

Deno.test('ru allowlist accepts product terms but not untranslated prose', () => {
  assertEquals(isAllowedEnglish('Support Fins · STL · 3MF · STEP · PLA · PETG · 0.2 mm'), true);
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
