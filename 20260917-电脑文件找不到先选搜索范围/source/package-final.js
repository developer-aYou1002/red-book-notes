const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'images-v2');
const output = path.join(root, 'final-images');
const files = [
  '01-cover.png',
  '02-problem.png',
  '03-choose.png',
  '04-folder.png',
  '05-taskbar.png',
  '06-this-pc.png',
  '07-checklist.png',
];
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

fs.mkdirSync(output, { recursive: true });
const extra = fs.readdirSync(output).filter((name) => name.toLowerCase().endsWith('.png') && !files.includes(name));
if (extra.length) throw new Error(`最终图片目录有额外 PNG，先核对：${extra.join(', ')}`);
for (const name of files) {
  const from = path.join(source, name);
  const to = path.join(output, name);
  if (!fs.existsSync(from)) throw new Error(`缺少 V2 图片：${from}`);
  fs.copyFileSync(from, to);
  if (sha256(from) !== sha256(to)) throw new Error(`复制校验失败：${name}`);
}
const actual = fs.readdirSync(output).filter((name) => name.toLowerCase().endsWith('.png')).sort();
if (JSON.stringify(actual) !== JSON.stringify([...files].sort())) {
  throw new Error(`最终图片目录不符合七图清单：${actual.join(', ')}`);
}
console.log(`最终七图已整理并逐张校验：${output}`);
