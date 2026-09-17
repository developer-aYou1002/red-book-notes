const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'final-images');
const items = [
  ['01-cover.png', 'images-v2'],
  ['02-map.png', 'images-v2'],
  ['03-doubao.png', 'images-v2'],
  ['04-kimi.png', 'images-v2'],
  ['05-qianwen.png', 'images-v3'],
  ['06-deepseek.png', 'images-v2'],
  ['07-checklist.png', 'images-v2'],
];

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function dimensions(file) {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  try { fs.readSync(fd, header, 0, header.length, 0); }
  finally { fs.closeSync(fd); }
  if (header.toString('ascii', 1, 4) !== 'PNG') throw new Error(`不是 PNG：${file}`);
  return [header.readUInt32BE(16), header.readUInt32BE(20)];
}

const expected = items.map(([name]) => name).sort();
if (fs.existsSync(output)) {
  const present = fs.readdirSync(output).sort();
  if (present.some(name => !expected.includes(name))) {
    throw new Error(`最终图片目录有额外文件，请先核对：${present.join(', ')}`);
  }
} else fs.mkdirSync(output);

for (const [name, sourceDir] of items) {
  const from = path.join(root, sourceDir, name);
  const to = path.join(output, name);
  if (!fs.existsSync(from)) throw new Error(`缺少来源图：${from}`);
  const size = dimensions(from);
  if (size[0] !== 1200 || size[1] !== 1600) throw new Error(`尺寸不符：${name} ${size.join('×')}`);
  fs.copyFileSync(from, to);
  if (hash(from) !== hash(to)) throw new Error(`复制校验失败：${name}`);
  console.log(`${name} ← ${sourceDir}  ${hash(to).slice(0, 12)}`);
}
const actual = fs.readdirSync(output).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('最终目录不是唯一七图清单');
console.log(`最终七图已校验：${output}`);
