const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const dir = __dirname;
async function build() {
  await sharp(path.join(dir, 'planritning-clean.png')).webp({ quality: 88 })
    .toFile(path.join(dir, 'planritning-clean.webp'));
  const template = fs.readFileSync(path.join(dir, 'template.html'), 'utf8');
  const image = fs.readFileSync(path.join(dir, 'planritning-clean.webp')).toString('base64');
  const client = fs.readFileSync(path.join(dir, 'client.js'), 'utf8');
  fs.writeFileSync(path.join(dir, 'snippet.html'), template
    .replace('{{PLAN_IMAGE}}', `data:image/webp;base64,${image}`)
    .replace('{{CLIENT_SCRIPT}}', client));
  console.log('Built WordPress shortcode module.');
}
build().catch(error => { console.error(error); process.exitCode = 1; });
