const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'images-v2');
const finalDir = path.join(root, 'final-images');
const expected = [
  '01-cover.png',
  '02-editing.png',
  '03-selection.png',
  '04-windows.png',
  '05-system.png',
  '06-capture-input.png',
  '07-files.png',
  '08-browser.png',
  '09-desktops.png',
  '10-top12.png'
];

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function main() {
  const sourceFiles = fs.readdirSync(sourceDir).filter((name)=>name.toLowerCase().endsWith('.png')).sort();
  if (JSON.stringify(sourceFiles) !== JSON.stringify(expected)) {
    throw new Error(`images-v2 文件集合异常：${sourceFiles.join(', ')}`);
  }
  fs.mkdirSync(finalDir, {recursive:true});
  const existing = fs.readdirSync(finalDir);
  if (existing.some((name)=>!expected.includes(name))) {
    throw new Error(`final-images 存在非预期文件：${existing.filter((name)=>!expected.includes(name)).join(', ')}`);
  }

  const rows = [];
  for (const name of expected) {
    const source = path.join(sourceDir,name);
    const target = path.join(finalDir,name);
    const meta = await sharp(source).metadata();
    if (meta.width !== 1200 || meta.height !== 1600 || meta.format !== 'png') {
      throw new Error(`${name} 尺寸或格式异常：${meta.width}x${meta.height} ${meta.format}`);
    }
    fs.copyFileSync(source,target);
    const sourceHash = sha256(source);
    const targetHash = sha256(target);
    if (sourceHash !== targetHash) throw new Error(`${name} 复制后哈希不一致`);
    rows.push(`${name}  ${sourceHash}`);
  }
  const finalFiles = fs.readdirSync(finalDir).filter((name)=>name.toLowerCase().endsWith('.png')).sort();
  if (JSON.stringify(finalFiles) !== JSON.stringify(expected)) {
    throw new Error(`final-images 文件集合异常：${finalFiles.join(', ')}`);
  }
  console.log('最终包校验通过：10 张 PNG，全部 1200x1600，与 images-v2 SHA-256 一致');
  console.log(rows.join('\n'));
}

main().catch((error)=>{console.error(error);process.exitCode=1;});

