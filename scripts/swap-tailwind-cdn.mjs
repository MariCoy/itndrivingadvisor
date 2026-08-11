import fs from 'node:fs';
import path from 'node:path';

const roots = ['.', 'es', 'fr', 'it'];
const cdnRe = /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/i;
const configRe = /<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\};\s*<\/script>\s*/i;

function walk(dir) {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(dir, f));
}

for (const root of roots) {
  for (const file of walk(root)) {
    let html = fs.readFileSync(file, 'utf8');
    if (!cdnRe.test(html) && !configRe.test(html)) continue;

    const cssHref = root === '.' ? 'dist/styles.css' : '../dist/styles.css';
    const link = `<link rel="stylesheet" href="${cssHref}">\n`;

    html = html.replace(cdnRe, '');
    html = html.replace(configRe, '');

    if (!html.includes(`href="${cssHref}"`)) {
      if (html.includes('</title>')) {
        html = html.replace('</title>', `</title>\n  ${link}`);
      } else {
        html = html.replace('</head>', `  ${link}</head>`);
      }
    }

    fs.writeFileSync(file, html);
    console.log('updated', file);
  }
}
