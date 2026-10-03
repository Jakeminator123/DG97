import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SEARCH_DIRS = ['pages', 'components', 'styles', 'lib', 'config', 'content'];
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mdx', '.css', '.md']);
const IMAGE_REGEX = /\/images\/[A-Za-z0-9._\-\/]+\.(?:avif|gif|jpe?g|png|svg|webp)/gi;
const PUBLIC_DIR = path.join(ROOT, 'public');

const missing = new Map();

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');

const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }
    const ext = path.extname(entry.name);
    if (!EXTENSIONS.has(ext)) continue;
    const content = readFile(entryPath);
    const matches = content.match(IMAGE_REGEX) || [];
    for (const match of matches) {
      const publicPath = path.join(PUBLIC_DIR, match);
      if (!fs.existsSync(publicPath)) {
        const refList = missing.get(match) || new Set();
        refList.add(path.relative(ROOT, entryPath));
        missing.set(match, refList);
      }
    }
  }
};

for (const dir of SEARCH_DIRS) {
  walk(path.join(ROOT, dir));
}

if (missing.size > 0) {
  console.error('Missing image assets:');
  for (const [asset, refs] of missing.entries()) {
    console.error(`- ${asset}`);
    for (const ref of refs) {
      console.error(`  - ${ref}`);
    }
  }
  process.exitCode = 1;
} else {
  console.log('Image assets check passed.');
}
