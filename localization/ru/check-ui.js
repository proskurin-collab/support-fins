import { isAllowedEnglish, translateText } from '../../web/locales/ru/catalog.js';

const USER_TEXT_IDS = new Set(['s-name', 'picker-list']);
const TEXT_FIELDS = ['t', 'title', 'opts'];

function decodeHtml(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&rsaquo;', '›')
    .replaceAll('&times;', '×')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

export function collectStaticHtmlEnglish(html) {
  const source = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const candidates = [];
  for (const match of source.matchAll(/\b(title|aria-label|placeholder)="([^"]+)"/gi)) {
    candidates.push({ location: `@${match[1]}`, text: decodeHtml(match[2]) });
  }
  for (const text of source.split(/<[^>]+>/g)) {
    const value = decodeHtml(text).trim().replace(/\s+/g, ' ');
    if (value) candidates.push({ location: 'text', text: value });
  }
  return candidates.filter(({ text }) => translateText(text) === text && !isAllowedEnglish(text));
}

export function collectUnexpectedEnglish(run) {
  const found = [];
  for (const step of run.steps ?? []) {
    for (const [id, state] of Object.entries(step.dom ?? {})) {
      if (USER_TEXT_IDS.has(id)) continue;
      for (const field of TEXT_FIELDS) {
        const text = state[field];
        if (typeof text === 'string' && !isAllowedEnglish(text)) {
          found.push({ step: step.name, id, field, text });
        }
      }
    }
  }
  return found;
}

if (import.meta.main) {
  const path = Deno.args[0];
  if (!path) throw new Error('usage: deno run -A localization/ru/check-ui.js <ui-smoke.json>');
  const unexpected = collectUnexpectedEnglish(JSON.parse(await Deno.readTextFile(path)));
  unexpected.push(...collectStaticHtmlEnglish(await Deno.readTextFile('web/index.html')));
  if (unexpected.length) {
    console.error(JSON.stringify(unexpected, null, 2));
    Deno.exit(1);
  }
  console.log('localization-ui: no unexpected English interface text');
}
