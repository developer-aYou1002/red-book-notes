const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const inputDir = path.join(root, 'final-images');
const output = path.join(__dirname, 'final-contact-sheet.png');

async function run() {
  const names = fs.readdirSync(inputDir).filter(name => name.endsWith('.png')).sort();
  if (names.length !== 8) throw new Error(`最终图片数量应为 8，实际为 ${names.length}`);

  const composites = [];
  for (let index = 0; index < names.length; index += 1) {
    const buffer = await sharp(path.join(inputDir, names[index]))
      .resize(360, 480, { fit: 'fill' })
      .png()
      .toBuffer();
    composites.push({ input: buffer, left: (index % 4) * 380, top: Math.floor(index / 4) * 500 });
  }

  await sharp({
    create: { width: 1500, height: 1000, channels: 4, background: '#d4d7d3' },
  }).composite(composites).png().toFile(output);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
