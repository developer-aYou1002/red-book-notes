const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 1600;
const v2 = process.argv.includes('--v2');
const out = path.resolve(__dirname, '..', v2 ? 'images-v2' : 'images-v1');
const previews = path.resolve(__dirname, '..', 'preview-v2');
fs.mkdirSync(out, { recursive: true });
if (v2) fs.mkdirSync(previews, { recursive: true });

const c = {
  ink: '#193226', green: '#197653', pale: '#e7f3e9', cream: '#f8fbf5',
  orange: '#d9822b', paleOrange: '#fff0dd', muted: '#52665a',
  line: '#cfdfd3', white: '#ffffff', softGray: '#f3f6f3',
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const r = (x, y, w, h, radius = 30, fill = c.white, stroke = 'none', sw = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const t = (x, y, value, size = 42, weight = 700, color = c.ink, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(value)}</text>`;
const ls = (x, y, values, size = 42, gap = 70, weight = 700, color = c.ink) =>
  values.map((v, i) => t(x, y + i * gap, v, size, weight, color)).join('');
const line = (x1, y1, x2, y2, color = c.line, sw = 3) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"/>`;
const pill = (x, y, label, w = 540, orange = false) =>
  r(x, y, w, 76, 38, orange ? c.paleOrange : c.pale) + t(x + 30, y + 51, label, 32, 800, orange ? c.orange : c.green);
const card = (x, y, w, h, fill = c.white) => `<g filter="url(#shadow)">${r(x, y, w, h, 38, fill)}</g>`;
const arrow = (x, y) => `<path d="M${x} ${y}h95m-30-28 30 28-30 28" fill="none" stroke="${c.green}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
const folder = (x, y, color = c.orange) => `<path d="M${x} ${y+14}h58l16 18h92v92h-166z" fill="${color}" opacity=".22"/><path d="M${x} ${y+40}h166v84h-166z" fill="${color}"/>`;
const magnify = (x, y, size = 42) => `<circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="${c.green}" stroke-width="10"/><path d="M${x+size*.72} ${y+size*.72}l42 42" stroke="${c.green}" stroke-width="10" stroke-linecap="round"/>`;
const scope = (label, query, result = '') => `
  ${r(145, 620, 900, 108, 25, c.softGray, c.line, 2)}
  ${magnify(192, 672, 19)}${t(245, 690, label, 35, 650, c.muted)}
  ${r(145, 755, 900, 108, 25, c.white, c.green, 3)}
  ${magnify(192, 807, 19)}${t(245, 825, query, 43, 750)}
  ${result ? t(145, 940, result, 37, 750, c.green) : ''}`;

function page(n, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fcfdf9"/><stop offset="1" stop-color="#eef6ee"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="13" stdDeviation="23" flood-color="#163a25" flood-opacity=".10"/></filter></defs>
    ${r(0, 0, W, H, 0, 'url(#bg)')}
    <circle cx="1090" cy="95" r="245" fill="#dcefe0" opacity=".8"/>
    <circle cx="-20" cy="1500" r="220" fill="#e5f1df" opacity=".7"/>
    ${body}
    ${line(88, 1465, 1112, 1465)}
    ${t(92, 1520, '效率研究所', 29, 700, c.muted)}
    ${t(1108, 1520, `${String(n).padStart(2, '0')} / 07`, 29, 700, c.muted, 'end')}
  </svg>`;
}

const pages = [
  ['01-cover.png', page(1, `
    ${pill(92, 95, '效率研究所 · 电脑效率', 600)}
    ${t(90, 520, '文件找不到？', 105, 900)}
    ${t(90, 680, '先搜对', 120, 900, c.green)}
    ${t(90, 840, '地方', 138, 900, c.green)}
    ${card(92, 985, 1016, 188)}
    ${magnify(172, 1070, 36)}
    ${t(260, 1090, '按已知线索选入口', 55, 800)}
    ${t(92, 1295, '不知道存哪儿？先别乱翻文件夹', 38, 650, c.muted)}
  `)],
  ['02-problem.png', page(2, `
    ${pill(92, 90, '明明保存了，却找不到', 620, true)}
    ${t(92, 325, '先别一层层乱翻', 77, 850)}
    ${card(92, 440, 1016, 400)}
    ${folder(145, 520)}
    ${folder(355, 520)}
    ${folder(565, 520)}
    ${folder(775, 520)}
    ${t(145, 735, '下载？', 45, 750)}${t(355, 735, '桌面？', 45, 750)}
    ${t(565, 735, '文档？', 45, 750)}${t(775, 735, '别处？', 45, 750)}
    ${card(92, 905, 1016, 330, c.pale)}
    ${t(145, 1010, '先问自己：', 44, 800, c.green)}
    ${ls(145, 1100, ['我记得保存位置吗？', '还是只记得文件名？'], 50, 85, 800)}
    ${t(92, 1370, '线索不同，搜索入口也不同。', 38, 650, c.muted)}
  `)],
  ['03-choose.png', page(3, `
    ${pill(92, 90, '一张图选搜索范围', 540)}
    ${t(92, 305, '你现在记得什么？', 79, 850)}
    ${card(92, 395, 1016, 920)}
    ${r(145, 460, 905, 220, 30, c.pale)}
    ${t(185, 540, '知道大致文件夹', 52, 800)}
    ${t(185, 620, '→ 在那个文件夹里搜', 48, 800, c.green)}
    ${r(145, 715, 905, 220, 30, c.softGray)}
    ${t(185, 795, '只记得名称 / 关键词', 51, 800)}
    ${t(185, 875, '→ 试试任务栏搜索', 48, 800, c.green)}
    ${r(145, 970, 905, 220, 30, c.paleOrange)}
    ${t(185, 1050, '仍找不到', 52, 800)}
    ${t(185, 1130, '→ 到“此电脑”扩大范围', 46, 800, c.orange)}
    ${t(92, 1390, '按情况选，不必每次走完三个入口。', 36, 650, c.muted)}
  `)],
  ['04-folder.png', page(4, v2 ? `
    ${pill(92, 90, '入口 ①  知道大致位置', 620)}
    ${t(92, 305, '先在那个文件夹搜', 75, 850)}
    ${card(92, 400, 1016, 790)}
    ${t(145, 490, '例如：记得大概放在“下载”', 43, 750)}
    ${r(145, 535, 900, 91, 25, c.pale)}
    ${t(175, 595, '操作位置示意｜非 Windows 截图', 39, 800, c.green)}
    ${r(145, 675, 900, 130, 28, c.softGray, c.line, 2)}
    ${folder(180, 680, c.orange)}
    ${t(395, 763, '当前范围：下载', 48, 800)}
    ${r(145, 840, 900, 125, 28, c.white, c.green, 3)}
    ${magnify(200, 900, 22)}
    ${t(260, 918, '输入部分文件名：项目方案', 42, 750)}
    ${t(145, 1080, '只演示从哪里搜，不展示搜索结果。', 37, 750, c.orange)}
    ${t(92, 1320, '“下载”只是例子，先确认你的目标文件夹。', 35, 650, c.muted)}
  ` : `
    ${pill(92, 90, '入口 ①  知道大致位置', 620)}
    ${t(92, 305, '先在那个文件夹搜', 75, 850)}
    ${card(92, 400, 1016, 790)}
    ${t(145, 495, '例如：记得大概放在“下载”', 43, 750)}
    ${scope('在 演示文件夹 中搜索', '项目方案', '范围：当前打开的文件夹')}
    ${r(145, 1000, 900, 125, 26, c.pale)}
    ${t(185, 1080, '项目方案-演示.txt', 47, 800, c.green)}
    ${t(92, 1280, '演示文件为虚构材料；搜索框为位置示意', 32, 650, c.muted)}
    ${t(92, 1370, '要点：先确认窗口当前在哪个文件夹。', 35, 650, c.muted)}
  `)],
  ['05-taskbar.png', page(5, v2 ? `
    ${pill(92, 90, '入口 ②  不知道保存位置', 650)}
    ${t(92, 305, '只记得名字？', 75, 850)}
    ${t(92, 400, '试试任务栏搜索', 75, 850, c.green)}
    ${card(92, 480, 1016, 700)}
    ${r(145, 530, 900, 91, 25, c.pale)}
    ${t(175, 590, '操作位置示意｜非 Windows 截图', 39, 800, c.green)}
    ${r(145, 680, 900, 118, 50, c.softGray, c.line, 2)}
    ${magnify(200, 740, 23)}
    ${t(260, 760, '输入名称：项目方案', 47, 750)}
    ${t(145, 910, '结果太杂？', 44, 800)}
    ${t(145, 995, '可留意“文档”等筛选', 42, 750, c.green)}
    ${t(145, 1060, '具体位置视你的界面而定。', 37, 650, c.muted)}
    ${t(92, 1340, '结果取决于文件位置、索引和账户设置。', 34, 650, c.muted)}
  ` : `
    ${pill(92, 90, '入口 ②  不知道保存位置', 650)}
    ${t(92, 305, '只记得名字？', 75, 850)}
    ${t(92, 400, '试试任务栏搜索', 75, 850, c.green)}
    ${card(92, 480, 1016, 700)}
    ${r(145, 560, 900, 118, 50, c.softGray, c.line, 2)}
    ${magnify(200, 620, 23)}
    ${t(260, 640, '项目方案', 48, 750)}
    ${t(145, 790, '结果太杂？', 44, 800)}
    ${r(145, 845, 290, 92, 45, c.pale)}
    ${t(220, 905, '文档', 47, 800, c.green)}
    ${t(145, 1055, '可查看“文档”等筛选。', 40, 700)}
    ${t(92, 1260, '任务栏界面为操作位置示意，非搜索结果截图', 31, 650, c.muted)}
    ${t(92, 1360, '结果取决于文件位置、索引和账户设置。', 34, 650, c.muted)}
  `)],
  ['06-this-pc.png', page(6, v2 ? `
    ${pill(92, 90, '入口 ③  仍找不到', 505, true)}
    ${t(92, 305, '再扩大搜索范围', 78, 850)}
    ${card(92, 410, 1016, 760)}
    ${r(145, 465, 900, 91, 25, c.pale)}
    ${t(175, 525, '操作位置示意｜非 Windows 截图', 39, 800, c.green)}
    ${r(145, 625, 900, 155, 28, c.pale)}
    ${t(190, 720, '此电脑', 58, 850, c.green)}
    ${arrow(495, 705)}
    ${t(645, 720, '搜索文件名', 48, 800)}
    ${t(145, 865, '比只搜一个文件夹范围更大，', 41, 750)}
    ${t(145, 930, '也可能需要等更久。', 41, 750, c.orange)}
    ${line(145, 985, 1045, 985)}
    ${ls(145, 1060, ['仍没找到？再核对文件名、', '保存位置，或是否保存成功。'], 38, 60, 700)}
    ${t(92, 1360, '这里不讨论误删恢复，也不保证找回。', 34, 650, c.muted)}
  ` : `
    ${pill(92, 90, '入口 ③  仍找不到', 505, true)}
    ${t(92, 305, '再扩大搜索范围', 78, 850)}
    ${card(92, 410, 1016, 760)}
    ${r(145, 485, 900, 155, 28, c.pale)}
    ${t(190, 580, '此电脑', 58, 850, c.green)}
    ${arrow(495, 565)}
    ${t(645, 580, '搜索文件名', 48, 800)}
    ${t(145, 770, '比只搜一个文件夹范围更大。', 44, 750)}
    ${t(145, 860, '也可能需要等更久。', 44, 750, c.orange)}
    ${line(145, 930, 1045, 930)}
    ${ls(145, 1025, ['仍没找到？再核对文件名、', '保存位置，或是否保存成功。'], 40, 70, 700)}
    ${t(92, 1280, '入口位置为示意，非实际搜索结果截图', 32, 650, c.muted)}
    ${t(92, 1370, '这里不讨论误删恢复，也不保证找回。', 34, 650, c.muted)}
  `)],
  ['07-checklist.png', page(7, `
    ${pill(92, 90, '收藏这张找文件决策卡', 650)}
    ${t(92, 310, '找文件，先选范围', 82, 850)}
    ${card(92, 420, 1016, 850)}
    ${t(145, 555, '记得位置', 56, 850, c.green)}
    ${t(640, 555, '→  目标文件夹', 49, 800)}
    ${line(145, 630, 1050, 630)}
    ${t(145, 760, '只记得名字', 56, 850, c.green)}
    ${t(640, 760, '→  任务栏搜索', 49, 800)}
    ${line(145, 835, 1050, 835)}
    ${t(145, 965, '还是没找到', 56, 850, c.green)}
    ${t(640, 965, '→  “此电脑”', 49, 800)}
    ${r(145, 1080, 900, 120, 28, c.paleOrange)}
    ${t(190, 1158, '先缩小，再扩大；别承诺一定找到。', 39, 750, c.orange)}
    ${t(92, 1390, '你最常在哪个文件夹里找不到东西？', 35, 650, c.muted)}
  `)],
];

Promise.all(pages.map(async ([name, svg]) => {
  const file = path.join(out, name);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  if (v2 && ['04-folder.png', '05-taskbar.png', '06-this-pc.png'].includes(name)) {
    await sharp(file).resize({ width: 360 }).png().toFile(path.join(previews, name));
  }
})).then(() => console.log(`已生成 ${pages.length} 张 ${v2 ? 'V2' : 'V1'} 图片：${out}`))
  .catch((error) => { console.error(error); process.exitCode = 1; });
