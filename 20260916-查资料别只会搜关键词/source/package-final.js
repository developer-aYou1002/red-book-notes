const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'images-v2');
const output = path.join(root, 'final-images');
const selected = [
  ['01-cover-alt.png', '01-cover.png'],
  ['02-question.png', '02-question.png'],
  ['03-ai-search.png', '03-ai-search.png'],
  ['04-source-check.png', '04-source-check.png'],
  ['05-verify.png', '05-verify.png'],
  ['06-organize.png', '06-organize.png'],
  ['07-checklist.png', '07-checklist.png'],
];

fs.mkdirSync(output, { recursive: true });
for (const [from, to] of selected) {
  const inputPath = path.join(source, from);
  if (!fs.existsSync(inputPath)) throw new Error(`缺少入选图片：${inputPath}`);
  fs.copyFileSync(inputPath, path.join(output, to));
}
const actual = fs.readdirSync(output).filter((name) => name.toLowerCase().endsWith('.png')).sort();
const expected = selected.map(([, to]) => to).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error(`最终图片目录存在额外或缺失的 PNG：${actual.join(', ')}`);
}
console.log(`最终发布包已整理：${output}（${actual.length} 张）`);
