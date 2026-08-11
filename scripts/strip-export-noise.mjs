import fs from 'node:fs';
import path from 'node:path';

const files = [];
for (const root of ['.', 'es', 'fr', 'it', 'components']) {
  for (const name of fs.readdirSync(root)) {
    if (name.endsWith('.html')) files.push(path.join(root, name));
  }
}

function cleanClasses(classAttr) {
  let tokens = classAttr.split(/\s+/).filter(Boolean);
  tokens = tokens.filter((token) => {
    if (token === 'caret-transparent') return false;
    if (token === 'box-border') return false;
    if (token.startsWith('outline-[oklab')) return false;
    if (token.includes('oklab(')) return false;
    if (token.startsWith('shadow-[rgba(0,0,0,0)_')) return false;
    if (token === 'rounded-[3.35544e+07px]') return false;
    return true;
  });

  return tokens.join(' ');
}

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const next = html.replace(
    /class="([^"]*)"/g,
    (_, classes) => `class="${cleanClasses(classes)}"`,
  );
  const fixed = next.replace(/rounded-\[3\.35544e\+07px\]/g, 'rounded-full');

  if (fixed !== html) {
    fs.writeFileSync(file, fixed);
    console.log('cleaned', file);
  }
}
