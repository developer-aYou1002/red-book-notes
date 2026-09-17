const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 1600;
const out = path.resolve(__dirname, '..', 'images-v2');
const previews = path.resolve(__dirname, '..', 'preview-v2');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(previews, { recursive: true });

const c = {
  ink: '#193226', green: '#197653', soft: '#e7f3e9', cream: '#f8fbf5',
  orange: '#d9822b', paleOrange: '#fff0dd', muted: '#52665a', line: '#cfdfd3',
  white: '#ffffff', red: '#aa5446', paleRed: '#f9e9e5',
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const rect = (x, y, w, h, r = 30, fill = c.white, stroke = 'none', sw = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text = (x, y, value, size = 40, weight = 650, color = c.ink, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(value)}</text>`;
const lines = (x, y, values, size = 40, gap = 65, weight = 650, color = c.ink) =>
  values.map((v, i) => text(x, y + i * gap, v, size, weight, color)).join('');
const pill = (x, y, value, width = 440, color = c.green) =>
  rect(x, y, width, 74, 37, color === c.orange ? c.paleOrange : c.soft) + text(x + 30, y + 51, value, 31, 800, color);
const rule = (x1, y1, x2, y2, color = c.line, width = 3) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
const arrow = (x, y, color = c.green) =>
  `<path d="M${x} ${y}h90m-25-25 25 25-25 25" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;

function page(n, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fcfdf9"/><stop offset="1" stop-color="#eef6ee"/></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="13" stdDeviation="23" flood-color="#163a25" flood-opacity=".10"/></filter></defs>
  ${rect(0, 0, W, H, 0, 'url(#bg)')}
  <circle cx="1100" cy="110" r="250" fill="#dcefe0" opacity=".8"/>
  <circle cx="-25" cy="1490" r="210" fill="#e5f1df" opacity=".7"/>
  ${body}
  ${rule(88, 1465, 1112, 1465)}
  ${text(92, 1520, '效率研究所', 29, 700, c.muted)}
  ${text(1108, 1520, `${String(n).padStart(2, '0')} / 07`, 29, 700, c.muted, 'end')}
  </svg>`;
}
const card = (x, y, w, h, r = 38, fill = c.white) => `<g filter="url(#shadow)">${rect(x, y, w, h, r, fill)}</g>`;

const pages = [
  ['01-cover.png', page(1, `
    ${pill(92, 95, '效率研究所 · AI 查资料', 610)}
    ${text(90, 510, '查资料，', 105, 900)}
    ${text(90, 660, '先走这', 105, 900)}
    ${text(90, 810, '3 步', 134, 900, c.green)}
    ${card(92, 970, 1016, 190)}
    ${text(145, 1085, '找线索', 51, 800, c.green)}${arrow(370, 1068)}
    ${text(510, 1085, '核原文', 51, 800, c.green)}${arrow(737, 1068)}
    ${text(876, 1085, '再整理', 51, 800, c.green)}
  `)],
  ['01-cover-alt.png', page(1, `
    ${pill(92, 95, '效率研究所 · AI 查资料', 610)}
    ${text(90, 510, 'AI 查资料，', 99, 900)}
    ${text(90, 660, '别只看', 108, 900)}
    ${text(90, 810, '答案', 134, 900, c.green)}
    ${card(92, 970, 1016, 190)}
    ${text(145, 1085, '找线索', 51, 800, c.green)}${arrow(370, 1068)}
    ${text(510, 1085, '核原文', 51, 800, c.green)}${arrow(737, 1068)}
    ${text(876, 1085, '再整理', 51, 800, c.green)}
  `)],
  ['02-question.png', page(2, `
    ${pill(92, 90, '有答案，也要看出处', 530, c.orange)}
    ${text(92, 310, 'AI 回答了，', 78, 850)}
    ${text(92, 415, '就能直接转发吗？', 78, 850, c.orange)}
    ${card(92, 520, 1016, 420)}
    ${text(145, 610, '这次要查的问题', 37, 800, c.green)}
    ${lines(145, 710, ['Windows 11 怎么截局部屏幕？', '截图默认保存在哪里？'], 52, 90, 750)}
    ${card(92, 1000, 1016, 255)}
    ${text(145, 1090, '复制答案前，先核 3 件事', 45, 800)}
    ${text(145, 1180, '来源  ·  适用版本  ·  设置差异', 43, 750, c.green)}
  `)],
  ['03-ai-search.png', page(3, `
    ${pill(92, 90, '01  AI 找线索', 405)}
    ${text(92, 305, '先找线索，别急着抄', 72, 850)}
    ${card(92, 380, 1016, 305)}
    ${text(145, 455, '实际提问摘要｜Perplexity', 34, 800, c.green)}
    ${lines(145, 540, ['Windows 11 怎么截局部屏幕？', '默认存哪里？请给微软官方来源。'], 40, 73, 700)}
    ${card(92, 740, 1016, 480)}
    ${text(145, 825, '这次查询定位的线索', 45, 800)}
    ${lines(145, 910, ['① 微软支持页面', '② Win + Shift + S', '③ “屏幕截图”文件夹'], 43, 84, 700, c.ink)}
    ${rect(145, 1120, 900, 72, 24, c.soft)}
    ${text(175, 1168, '查询线索的编辑整理，非网页截图', 41, 750, c.green)}
    ${rect(92, 1250, 1016, 110, 30, c.paleOrange)}
    ${text(145, 1320, '下一步：点开微软页面，对照关键原文', 36, 750, c.orange)}
    ${text(92, 1410, '查询日期：2026-09-16', 29, 650, c.muted)}
  `)],
  ['04-source-check.png', page(4, `
    ${pill(92, 90, '从搜索线索回到出处', 590, c.orange)}
    ${text(92, 302, '找到来源，再看原文', 74, 850)}
    ${card(92, 390, 1016, 260)}
    ${text(145, 470, '本次查询定位到', 35, 750, c.green)}
    ${text(145, 545, '微软支持《使用截图工具捕获截图》', 41, 800)}
    ${text(145, 605, 'support.microsoft.com', 31, 650, c.muted)}
    ${text(92, 715, '↓  核对适用范围与对应段落', 40, 800, c.green)}
    ${card(92, 770, 1016, 550)}
    ${text(145, 850, '微软原文要点｜编辑转述', 40, 800, c.green)}
    ${rule(145, 895, 1050, 895)}
    ${lines(145, 980, ['Win + Shift + S 打开截图覆盖层；', '选取区域后捕获截图。截图默认保存', '到“屏幕截图”文件夹；保存设置可改。'], 38, 70, 680)}
    ${rect(145, 1200, 900, 80, 26, c.soft)}
    ${text(175, 1254, '编辑转述，非微软网页截图', 41, 750, c.green)}
    ${text(92, 1382, '页面未标发布日期 · 2026-09-16 核对', 29, 650, c.muted)}
    ${text(92, 1425, '适用：Windows 11 / Windows 10', 29, 650, c.muted)}
  `)],
  ['05-verify.png', page(5, `
    ${pill(92, 90, '02  核原文', 365)}
    ${text(92, 305, '快捷键不是全部步骤', 75, 850)}
    ${card(92, 390, 1016, 760)}
    ${rect(145, 465, 80, 80, 22, c.soft)}${text(169, 520, '1', 46, 850, c.green)}
    ${text(265, 520, 'Win + Shift + S', 53, 800)}
    ${text(265, 580, '打开截图覆盖层', 38, 650, c.muted)}
    ${rule(180, 615, 180, 715, c.green, 5)}
    ${rect(145, 740, 80, 80, 22, c.soft)}${text(169, 795, '2', 46, 850, c.green)}
    ${text(265, 795, '选取要截的区域', 49, 800)}
    ${text(265, 853, '完成捕获', 38, 650, c.muted)}
    ${rule(180, 885, 180, 965, c.green, 5)}
    ${rect(145, 985, 80, 80, 22, c.soft)}${text(169, 1040, '3', 46, 850, c.green)}
    ${text(265, 1040, '默认保存到“屏幕截图”', 43, 800)}
    ${rect(92, 1200, 1016, 148, 31, c.paleOrange)}
    ${text(145, 1260, '注意：自动保存行为与默认文件夹', 37, 750, c.orange)}
    ${text(145, 1310, '可以在设置中更改。', 37, 750, c.orange)}
    ${text(92, 1410, '微软支持页面要点（编辑转述），非逐字引用', 29, 650, c.muted)}
  `)],
  ['06-organize.png', page(6, `
    ${pill(92, 90, '03  按用途整理', 440)}
    ${text(92, 305, '先给材料，再让 AI 整理', 71, 850)}
    ${card(92, 385, 1016, 480)}
    ${text(145, 465, '已核对材料｜微软支持页面要点', 38, 800, c.green)}
    ${lines(145, 555, ['• Win + Shift + S 打开截图覆盖层', '• 选取区域后捕获截图', '• 默认保存到“屏幕截图”文件夹', '• 保存行为与文件夹可在设置更改'], 36, 68, 680)}
    ${text(92, 930, '↓  把上方材料交给 AI', 38, 800, c.green)}
    ${card(92, 985, 1016, 390)}
    ${text(145, 1050, '可复制的整理指令', 40, 800, c.green)}
    ${lines(145, 1120, ['请仅依据上面材料，整理成给同事', '看的 2 句话。保留 Windows 11 范围；', '不要补充未核实的细节。'], 35, 63, 680)}
    ${rect(145, 1285, 900, 70, 24, c.soft)}
    ${text(175, 1332, '编辑指令示例，非 AI 生成结果', 41, 750, c.green)}
  `)],
  ['07-checklist.png', page(7, `
    ${pill(92, 90, '收藏这张查资料清单', 600)}
    ${text(92, 310, '下次查资料，', 84, 850)}
    ${text(92, 425, '照这 3 步走', 84, 850, c.green)}
    ${card(92, 510, 1016, 760)}
    ${text(145, 620, '01  AI 找线索', 57, 850, c.green)}
    ${text(145, 680, '要能打开的来源，不只看摘要', 37, 650)}
    ${rule(145, 735, 1050, 735)}
    ${text(145, 850, '02  原文核实', 57, 850, c.green)}
    ${text(145, 910, '对事实、日期和适用范围', 37, 650)}
    ${rule(145, 965, 1050, 965)}
    ${text(145, 1080, '03  按需整理', 57, 850, c.green)}
    ${text(145, 1140, '留来源，不确定的标“待确认”', 37, 650)}
    ${text(92, 1370, '你查资料时，会点开 AI 给的来源吗？', 35, 680, c.muted)}
  `)],
];

Promise.all(pages.map(async ([name, svg]) => {
  const full = path.join(out, name);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(full);
  if (['01-cover.png', '01-cover-alt.png', '03-ai-search.png', '04-source-check.png', '06-organize.png'].includes(name)) {
    await sharp(full).resize({ width: 360 }).png().toFile(path.join(previews, name));
  }
}))
  .then(() => console.log(`已生成 ${pages.length} 张图片与手机宽度预览：${out}`))
  .catch((e) => { console.error(e); process.exitCode = 1; });
