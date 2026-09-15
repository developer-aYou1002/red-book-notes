const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 1600;
const BRAND = '效率研究所';
const OUT = path.resolve(__dirname, '..', 'images');
fs.mkdirSync(OUT, { recursive: true });

const icon = `data:image/svg+xml;base64,${fs.readFileSync(path.join(__dirname, 'icons', 'chatgpt.svg')).toString('base64')}`;
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, value, size, weight = 500, fill = '#17211b', anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`;
const lines = (x, y, values, size, gap, weight = 500, fill = '#17211b') =>
  values.map((line, i) => text(x, y + i * gap, line, size, weight, fill)).join('');
const rect = (x, y, w, h, r, fill, stroke = 'none', sw = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const logo = (x, y, size) => `<g filter="url(#shadow)">${rect(x, y, size, size, 30, '#ffffff')}</g><image x="${x + size * .17}" y="${y + size * .17}" width="${size * .66}" height="${size * .66}" href="${icon}"/>`;

function shell(page, body, accent = '#1f8f64') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfdf9"/><stop offset="1" stop-color="#f1f7f1"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="15" stdDeviation="24" flood-color="#1a3325" flood-opacity=".10"/></filter></defs>
    <rect width="1200" height="1600" fill="url(#bg)"/>
    <circle cx="1080" cy="100" r="250" fill="${accent}" opacity=".08"/>
    <circle cx="80" cy="1510" r="210" fill="${accent}" opacity=".06"/>
    ${body}
    ${text(92, 1510, BRAND, 28, 650, '#56635b')}
    ${text(1108, 1510, `${String(page).padStart(2, '0')} / 07`, 28, 650, '#56635b', 'end')}
    ${rect(92, 1545, 1016, 5, 3, '#dbe5dd')}${rect(92, 1545, 1016 * page / 7, 5, 3, accent)}
  </svg>`;
}

function tag(x, y, label, accent = '#1f8f64', width = 475) {
  return `${rect(x, y, width, 76, 38, `${accent}20`)}${text(x + 33, y + 53, label, 36, 800, accent)}`;
}

const cases = [
  {
    file: '02-writing.png', name: '写作润色', accent: '#1f8f64',
    title: ['先给已有文字', '再让它改清楚'], case: '案例：把模糊的周报改成可读的进度说明',
    before: ['这周需求梳理差不多，接口', '还没联调；周五再同步。'],
    after: ['需求梳理：完成程度待确认。', '接口：尚未联调；周五同步进度。', '待确认：已完成的具体需求项。'],
    prompt: ['请依据原文润色周报；别新增事实。', '不明确的完成项，请单列“待确认”。'],
    check: '核对：别把没有发生的进展写进去。'
  },
  {
    file: '03-summary.png', name: '总结提炼', accent: '#2877d5',
    title: ['零散记录', '变成重点和待办'], case: '案例：会后整理三条散落的记录',
    before: ['周三交初稿；小李补数据；', '客户问上线进度。'],
    after: ['明确待办：小李补数据；周三交初稿。', '交初稿的负责人：待确认。', '建议跟进：确认进度后回复客户。'],
    prompt: ['请把会议记录分成待办、待确认', '和建议跟进；别猜责任人。'],
    check: '核对：负责人、截止时间回看原始记录。'
  },
  {
    file: '04-learning.png', name: '学习讲解', accent: '#7657d6',
    title: ['听懂概念之后', '再问自己会不会'], case: '案例：学习“边际成本”这个概念',
    before: ['课本里有定义，读完还是', '不知道怎么用。'],
    after: ['例子：多做一个杯子的新增成本。', '自测：多做一个杯子的材料涨价，', '边际成本会怎样变化？为什么？'],
    prompt: ['请用做杯子的例子解释边际成本，', '再出一道题；等我答完再点评。'],
    check: '核对：例子帮助理解，不代替教材定义。'
  },
  {
    file: '05-analysis.png', name: '分析拆解', accent: '#db8e24',
    title: ['复杂问题', '先拆原因和风险'], case: '案例：活动报名人数突然变少',
    before: ['报名少了，是不是马上', '增加广告预算？'],
    afterLabel: '分析路径示意',
    after: ['先算：曝光→点击率→报名转化率。', '定位：哪一环变了，再列可能原因。', '注意：没给数字，不能下原因结论。'],
    prompt: ['我有两周曝光、点击、报名数据。', '请先列分析路径，别把猜测当结论。'],
    check: '核对：原因要用数据验证，再做决定。'
  },
  {
    file: '06-planning.png', name: '方案规划', accent: '#1d9faa',
    title: ['说清目标与限制', '拿到可改的初稿'], case: '案例：只有三个晚上做个人作品集',
    before: ['想做作品集，但时间少，', '不知道从哪里开始。'],
    after: ['第1晚：选2案例 → 一页内容提纲。', '第2晚：写经历 → 两段案例初稿。', '第3晚：排版校对 → 可分享的一页。'],
    prompt: ['三晚做一页作品集，已有2个案例。', '请列每晚最小任务和可检查成果。'],
    check: '核对：按自己的时间与材料调整计划。'
  }
];

function casePage(page, data) {
  const body = `
    ${tag(92, 92, `0${page - 1}  ${data.name}`, data.accent, 430)}
    ${logo(92, 245, 130)}
    ${lines(255, 302, data.title, 60, 80, 850, '#142019')}
    ${text(92, 450, data.case, 31, 650, '#54645a')}
    <g filter="url(#shadow)">${rect(92, 515, 1016, 260, 38, '#ffffff')}</g>
    ${rect(132, 550, 168, 57, 28, '#f1f5f1')}${text(160, 590, '输入前', 30, 800, '#66746a')}
    ${lines(143, 665, data.before, 36, 54, 600, '#27342c')}
    <g filter="url(#shadow)">${rect(92, 810, 1016, 300, 38, '#ffffff')}</g>
    ${rect(132, 845, data.afterLabel ? 285 : 238, 57, 28, `${data.accent}20`)}${text(160, 885, data.afterLabel || '输出后 · 示意', 29, 800, data.accent)}
    ${lines(143, 956, data.after, 34, 55, 650, '#20312a')}
    <g filter="url(#shadow)">${rect(92, 1140, 1016, 240, 38, '#ffffff')}</g>
    ${text(140, 1200, '一句可以照着问', 30, 800, data.accent)}
    ${lines(140, 1270, data.prompt, 35, 57, 600, '#26352c')}
    ${text(92, 1435, data.check, 27, 600, '#617067')}
  `;
  return shell(page, body, data.accent);
}

const outputs = [
  {
    file: '01-cover.png', svg: shell(1, `
      ${tag(92, 92, 'ChatGPT 入门系列 · 第 2 篇', '#1f8f64', 675)}
      ${logo(92, 280, 170)}
      ${text(92, 590, 'ChatGPT 新手', 82, 850, '#142019')}
      ${text(92, 690, '最值得学的', 86, 850, '#142019')}
      ${text(92, 860, '5种用法', 154, 900, '#1f8f64')}
      ${text(92, 970, '从具体任务开始，别先背提示词', 40, 650, '#516157')}
      <g filter="url(#shadow)">${rect(92, 1080, 1016, 275, 42, '#ffffff')}</g>
      ${text(142, 1145, '周报整理 · 前后对照示意', 31, 800, '#1f8f64')}
      ${rect(142, 1175, 390, 113, 25, '#f1f5f1')}
      ${rect(665, 1175, 390, 113, 25, '#e5f4ec')}
      ${text(168, 1223, '输入前', 26, 750, '#6c7b70')}${text(168, 1263, '“这周差不多……”', 28, 650, '#2b3a30')}
      ${text(560, 1253, '→', 49, 800, '#1f8f64')}
      ${text(691, 1223, '输出后 · 示意', 26, 750, '#1f8f64')}${text(691, 1263, '“进度 + 待确认项”', 28, 650, '#2b3a30')}
      ${text(142, 1322, '写作 · 总结 · 学习 · 分析 · 规划', 27, 650, '#68756b')}
    `)
  },
  ...cases.map((data, i) => ({ file: data.file, svg: casePage(i + 2, data) })),
  {
    file: '07-takeaway.png', svg: shell(7, `
      ${tag(92, 92, '收藏总结', '#1f8f64', 300)}
      ${text(92, 355, '先做具体任务', 86, 850, '#142019')}
      ${text(92, 480, '别先背提示词', 90, 900, '#1f8f64')}
      ${text(92, 560, '一个顺序，就能开始练习', 37, 650, '#617067')}
      <g filter="url(#shadow)">${rect(92, 660, 1016, 580, 42, '#ffffff')}</g>
      ${text(150, 770, '01', 47, 850, '#1f8f64')}${text(275, 770, '先给背景和材料', 43, 750, '#243329')}
      <line x1="150" y1="820" x2="1050" y2="820" stroke="#e4ece6" stroke-width="2"/>
      ${text(150, 895, '02', 47, 850, '#1f8f64')}${text(275, 895, '说清这次的目标', 43, 750, '#243329')}
      <line x1="150" y1="945" x2="1050" y2="945" stroke="#e4ece6" stroke-width="2"/>
      ${text(150, 1020, '03', 47, 850, '#1f8f64')}${text(275, 1020, '指定想要的格式', 43, 750, '#243329')}
      <line x1="150" y1="1070" x2="1050" y2="1070" stroke="#e4ece6" stroke-width="2"/>
      ${text(150, 1145, '04', 47, 850, '#1f8f64')}${text(275, 1145, '自己核对并修改', 43, 750, '#243329')}
      ${text(600, 1345, '涉及事实、数字和决策，回到原始资料确认', 31, 650, '#5f6d62', 'middle')}
      ${text(600, 1395, '下一篇继续拆一个真实任务', 31, 650, '#5f6d62', 'middle')}
    `)
  }
];

Promise.all(outputs.map(({ file, svg }) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file))))
  .then(() => console.log(`已生成 ${outputs.length} 张配图：${OUT}`))
  .catch((error) => { console.error(error); process.exitCode = 1; });
