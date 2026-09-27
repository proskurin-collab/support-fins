const DOCUMENT_ROOTS = ['docs', 'plugins', 'prototype', 'tests'];

function pathJoin(...parts) { return parts.filter(Boolean).join('/').replaceAll('//', '/'); }

async function markdownFiles(root, relative) {
  const directory = pathJoin(root, relative);
  const found = [];
  try {
    for await (const entry of Deno.readDir(directory)) {
      const path = pathJoin(relative, entry.name);
      if (entry.isDirectory) found.push(...await markdownFiles(root, path));
      else if (entry.isFile && entry.name.endsWith('.md')) found.push(path);
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }
  return found;
}

async function sha256(path) {
  const data = await Deno.readFile(path);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  return [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function validateManifest(root = '.') {
  const errors = [];
  const manifestPath = pathJoin(root, 'localization/ru/manifest.json');
  const manifest = JSON.parse(await Deno.readTextFile(manifestPath));
  const expected = ['README.md'];
  for (const directory of DOCUMENT_ROOTS) expected.push(...await markdownFiles(root, directory));
  expected.sort();

  const entries = new Map();
  for (const entry of manifest.documents ?? []) {
    if (entries.has(entry.source)) errors.push(`duplicate source: ${entry.source}`);
    entries.set(entry.source, entry);
  }
  for (const source of expected) {
    const entry = entries.get(source);
    if (!entry) { errors.push(`missing manifest entry: ${source}`); continue; }
    try { await Deno.stat(pathJoin(root, entry.translation)); }
    catch { errors.push(`missing translation: ${entry.translation}`); }
    const actual = await sha256(pathJoin(root, source));
    if (actual !== entry.sourceSha256) errors.push(`source changed: ${source}`);
  }
  for (const source of entries.keys()) {
    if (!expected.includes(source)) errors.push(`source no longer exists: ${source}`);
  }
  return errors.sort();
}

if (import.meta.main) {
  const errors = await validateManifest(Deno.args[0] ?? '.');
  if (errors.length) {
    for (const error of errors) console.error(error);
    Deno.exit(1);
  }
  console.log('localization-docs: manifest and source hashes are current');
}
