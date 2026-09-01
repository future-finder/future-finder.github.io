import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('../dist/', import.meta.url);
const root = fileURLToPath(rootUrl);
const configuredBase = (process.env.BASE_PATH || '/').replace(/^\//, '').replace(/\/$/, '');
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}

walk(root);
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href) || href.includes('${')) continue;
    const clean = decodeURIComponent(href.split('#')[0].split('?')[0]);
    if (!clean) continue;
    let relative = clean.replace(/^\//, '');
    if (configuredBase && (relative === configuredBase || relative.startsWith(`${configuredBase}/`))) {
      relative = relative.slice(configuredBase.length).replace(/^\//, '');
    }
    const target = relative === ''
      ? new URL('index.html', rootUrl)
      : extname(relative)
        ? new URL(relative, rootUrl)
        : new URL(relative.endsWith('/') ? `${relative}index.html` : `${relative}/index.html`, rootUrl);
    if (!existsSync(target)) failures.push(`${file}: ${href}`);
  }
}

if (failures.length) {
  console.error(`发现 ${failures.length} 个无效内部链接：`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`构建验证通过：${htmlFiles.length} 个 HTML 页面，未发现无效内部链接。`);
