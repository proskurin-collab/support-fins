import { DOM_RULES, isAllowedEnglish, translateText } from './catalog.js';

const ATTRIBUTES = ['title', 'aria-label', 'placeholder'];
const untranslated = new Map();
let applying = false;

function ignored(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  if (!element || element.closest('script, style, noscript')) return true;
  return DOM_RULES.some((rule) => rule.ignoreText && element.closest(rule.selector));
}

function remember(value, location) {
  const text = String(value).trim().replace(/\s+/g, ' ');
  if (!text || isAllowedEnglish(text)) return;
  if (!untranslated.has(text)) untranslated.set(text, new Set());
  untranslated.get(text).add(location);
}

function translateValue(value, location, shouldDiagnose = true) {
  const translated = translateText(value);
  if (translated === value && shouldDiagnose) remember(value, location);
  else untranslated.delete(String(value).trim().replace(/\s+/g, ' '));
  return translated;
}

function translateNode(root) {
  if (ignored(root)) return;
  if (root.nodeType === Node.TEXT_NODE) {
    const location = root.parentElement?.id ? `#${root.parentElement.id}` : root.parentElement?.tagName;
    const translated = translateValue(root.nodeValue, location || 'text');
    if (translated !== root.nodeValue) root.nodeValue = translated;
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  for (const attr of ATTRIBUTES) {
    if (!root.hasAttribute(attr)) continue;
    const value = root.getAttribute(attr);
    const translated = translateValue(value, `${root.id ? `#${root.id}` : root.tagName}[${attr}]`);
    if (translated !== value) root.setAttribute(attr, translated);
  }
  for (const node of root.childNodes) translateNode(node);
}

function apply(root = document.body) {
  if (!root || applying) return;
  applying = true;
  try { translateNode(root); } finally { applying = false; }
}

document.documentElement.lang = 'ru';
apply();

const observer = new MutationObserver((records) => {
  if (applying) return;
  for (const record of records) {
    if (record.type === 'characterData') apply(record.target);
    else if (record.type === 'attributes') apply(record.target);
    else for (const node of record.addedNodes) apply(node);
  }
});
observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ATTRIBUTES,
});

const originalAlert = window.alert.bind(window);
window.alert = (message) => originalAlert(translateValue(String(message), 'window.alert'));

window.__supportFinsI18n = Object.freeze({
  apply,
  translate: translateText,
  getUntranslated: () => {
    untranslated.clear();
    apply();
    return [...untranslated].map(([text, locations]) => ({
      text, locations: [...locations].sort(),
    }));
  },
  clearUntranslated: () => untranslated.clear(),
});
