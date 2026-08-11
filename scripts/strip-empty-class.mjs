import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dirs = ['.', 'es', 'fr', 'it', 'components'];

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walkHtml(path, out);
    } else if (extname(path) === '.html') {
      out.push(path);
    }
  }
  return out;
}

const files = dirs.flatMap((dir) => walkHtml(join(root, dir)));
let removed = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  const updated = original.replace(/\sclass=(["'])\1/g, () => {
    removed += 1;
    return '';
  });

  if (updated !== original) {
    writeFileSync(file, updated);
  }
}

console.log(`Stripped ${removed} empty class attribute(s) from ${files.length} HTML file(s).`);
