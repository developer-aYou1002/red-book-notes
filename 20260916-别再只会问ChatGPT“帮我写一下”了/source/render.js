const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 1600;
const OUT = path.resolve(__dirname, '..', 'images');
fs.mkdirSync(OUT, { recursive: true });
const ICON = `data:image/svg+xml;base64,${fs.readFileSync(path.join(__dirname, 'icons', 'chatgpt.svg')).toString('base64')}`;
const PREVIOUS_COVER = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, '..', '..', '20260915-ChatGPT新手最值得学的5种用法', 'images', '01-cover.png')).toString('base64')}`;

const esc = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const tx = (x, y, v, size, weight = 600, fill = '#19251d', anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(v)}</text>`;
const ls = (x, y, values, size, gap, weight = 600, fill = '#26342b') =>
  values.map((v, i) => tx(x, y + i * gap, v, size, weight, fill)).join('');
const box = (x, y, w, h, r, fill, stroke = 'none', sw = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const icon = (x, y, size) => `<g filter="url(#shadow)">${box(x, y, size, size, 30, '#ffffff')}</g><image x="${x + size * .17}" y="${y + size * .17}" width="${size * .66}" height="${size * .66}" href="${ICON}"/>`;
const pill = (x, y, label, width = 440, accent = '#1f8f64') =>
  `${box(x, y, width, 76, 38, `${accent}20`)}${tx(x + 32, y + 53, label, 34, 800, accent)}`;

function page(num, body, accent = '#1f8f64') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfdf9"/><stop offset="1" stop-color="#f1f7f1"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="26" flood-color="#1a3325" flood-opacity=".10"/></filter></defs>
    <rect width="1200" height="1600" fill="url(#bg)"/>
    <circle cx="1080" cy="100" r="250" fill="${accent}" opacity=".08"/>
    <circle cx="80" cy="1510" r="210" fill="${accent}" opacity=".06"/>
    ${body}
    ${tx(92, 1510, '效率研究所', 28, 650, '#56635b')}
    ${tx(1108, 1510, `${String(num).padStart(2, '0')} / 07`, 28, 650, '#56635b', 'end')}
    ${box(92, 1545, 1016, 5, 3, '#dbe5dd')}${box(92, 1545, 1016 * num / 7, 5, 3, accent)}
  </svg>`;
}

function comparePage(num, data) {
  return page(num, `
    ${pill(92, 92, `0${num}  ${data.label}`, 530, data.accent)}
    ${icon(92, 235, 130)}
    ${ls(255, 300, data.title, 62, 81, 850, '#17241b')}
    ${tx(92, 450, data.sub, 31, 650, '#5b6a60')}
    <g filter="url(#shadow)">${box(92, 520, 1016, 220, 38, '#ffffff')}</g>
    ${box(135, 560, 227, 58, 29, '#f8eceb')}${tx(162, 600, '❌ 普通问法', 30, 800, '#b45a52')}
    ${tx(145, 685, data.bad, 44, 700, '#29362f')}
    <g filter="url(#shadow)">${box(92, 790, 1016, 490, 38, '#ffffff')}</g>
    ${box(135, 830, 227, 58, 29, '#e4f3eb')}${tx(162, 870, '✅ 升级问法', 30, 800, data.accent)}
    ${ls(145, 960, data.good, 37, 70, 650, '#25362c')}
    ${tx(92, 1360, data.footer, 30, 600, '#637167')}
    ${tx(92, 1410, '通用复制模板在第 7 页和笔记正文。', 28, 650, data.accent)}
  `, data.accent);
}

const compares = [
  {
    file: '05-learn-sql.png', label: '学 SQL', accent: '#7657d6',
    title: ['从零学习 SQL', '别只要一个定义'], sub: '说明你的基础，再要求例子和练习',
    bad: '“给我讲一下 SQL。”',
    good: ['我没有数据库基础，请从零解释 SQL。', '少用术语；关键概念配生活例子。', '先讲入门重点，再给 3 道练习题。', '等我作答后再提示，不要先公布答案。'],
    footer: '按自己的基础和学习目标调整问法。'
  }
];

const outputs = [
  {
    file: '01-cover.png', svg: page(1, `
      ${pill(92, 92, '效率研究所 · 提示词入门', 620)}
      ${icon(92, 270, 166)}
      ${tx(92, 610, '别再只会问', 96, 900, '#17241b')}
      ${tx(92, 725, 'ChatGPT', 100, 900, '#17241b')}
      ${tx(92, 890, '“帮我写一下”了', 98, 900, '#1f8f64')}
      <g filter="url(#shadow)">${box(92, 1080, 1016, 270, 42, '#ffffff')}</g>
      ${tx(142, 1160, '新手提问清单', 63, 850, '#1f8f64')}
      ${tx(142, 1240, '把需求说清楚，回答更贴近任务', 39, 700, '#26392d')}
      ${tx(142, 1310, '新手也能直接套', 31, 650, '#617068')}
    `)
  },
  {
    file: '02-why-generic.png', svg: page(2, `
      ${pill(92, 92, '02  为什么回答总是普通', 670, '#db8e24')}
      ${tx(92, 330, '你是不是也这样问过？', 68, 850, '#17241b')}
      <g filter="url(#shadow)">${box(92, 430, 1016, 390, 42, '#ffffff')}</g>
      ${tx(145, 525, '“帮我写一份周报”', 43, 650, '#38443c')}
      ${tx(145, 630, '“帮我写个方案”', 43, 650, '#38443c')}
      ${tx(145, 735, '“帮我做个总结”', 43, 650, '#38443c')}
      ${tx(92, 950, '回答看着正确，', 69, 850, '#17241b')}
      ${tx(92, 1040, '却没贴近你的任务。', 69, 850, '#db8e24')}
      <g filter="url(#shadow)">${box(92, 1135, 1016, 225, 38, '#ffffff')}</g>
      ${tx(145, 1205, '❌ 少了工作记录', 37, 750, '#b45a52')}
      ${tx(145, 1285, 'AI 不知道你本周真正做了什么', 37, 750, '#26392d')}
      ${tx(92, 1430, '不是神奇咒语，而是把隐含条件说出来。', 30, 650, '#657268')}
    `, '#db8e24')
  },
  {
    file: '03-five-part-formula.png', svg: page(3, `
      ${pill(92, 92, '03  新手提问清单', 600)}
      ${tx(92, 315, '不会问时，先想这 5 项', 76, 850, '#17241b')}
      ${tx(92, 390, '五项是检查清单，不必每次写满', 36, 600, '#5f6c63')}
      <g filter="url(#shadow)">${box(92, 470, 1016, 710, 42, '#ffffff')}</g>
      ${ls(150, 585, ['① 角色：需要特定视角吗？（可选）', '② 任务：这次要完成什么？', '③ 背景：给谁看、已有资料？', '④ 要求：风格、范围和限制？', '⑤ 格式：最终怎么呈现？'], 43, 120, 750, '#26392d')}
      <g filter="url(#shadow)">${box(92, 1230, 1016, 160, 35, '#ffffff')}</g>
      ${tx(145, 1300, '角色（可选）＋任务＋背景＋要求＋格式', 40, 800, '#1f8f64')}
      ${tx(145, 1355, '缺少关键信息？让 AI 先问，别猜。', 30, 600, '#647268')}
    `)
  },
  {
    file: '04-weekly-report.png', svg: page(4, `
      ${pill(92, 92, '04  周报：给材料才好整理', 690)}
      ${tx(92, 315, '看一个具体的周报例子', 72, 850, '#17241b')}
      ${tx(92, 390, '匿名模拟材料 · 输出为编辑示意，非实测', 34, 650, '#637167')}
      <g filter="url(#shadow)">${box(92, 465, 1016, 390, 38, '#ffffff')}</g>
      ${box(135, 505, 240, 58, 29, '#e4f3eb')}${tx(161, 545, '输入前｜工作记录', 29, 800, '#1f8f64')}
      ${ls(145, 625, ['整理了 3 条用户反馈；', '完成首页按钮文案调整。', '搜索结果页尚未联调；', '下周确认联调时间。'], 39, 66, 650, '#26392d')}
      <g filter="url(#shadow)">${box(92, 900, 1016, 390, 38, '#ffffff')}</g>
      ${box(135, 940, 240, 58, 29, '#e4f3eb')}${tx(161, 980, '输出后｜示意周报', 29, 800, '#1f8f64')}
      ${ls(145, 1060, ['完成：整理 3 条反馈，调整按钮文案。', '问题：搜索结果页尚未联调。', '下周：确认搜索结果页联调时间。', '未提供负责人与具体日期，标待确认。'], 36, 65, 650, '#26392d')}
      ${tx(92, 1370, '提问重点：给材料、说明给谁看、别补事实。', 31, 650, '#5c6b60')}
      ${tx(92, 1420, '正文有可直接复制的提问框架。', 30, 700, '#1f8f64')}
    `)
  },
  { file: compares[0].file, svg: comparePage(5, compares[0]) },
  {
    file: '06-xiaohongshu.png', svg: page(6, `
      ${pill(92, 92, '06  做图文：参考自己的作品', 760, '#2877d5')}
      ${tx(92, 310, '做内容时，先说清楚', 70, 850, '#17241b')}
      ${tx(92, 390, '账号、读者、主题、页数', 63, 850, '#2877d5')}
      <g filter="url(#shadow)">${box(92, 470, 1016, 330, 38, '#ffffff')}</g>
      ${tx(145, 555, '❌ “帮我写一篇小红书。”', 39, 700, '#b45a52')}
      ${ls(145, 640, ['✅ 账号：AI／软件／电脑效率', '读者：学生与上班族；主题：ChatGPT 用法', '要求：7 页，每页一个重点，不像广告'], 32, 62, 650, '#26392d')}
      <g filter="url(#shadow)">${box(92, 850, 1016, 480, 38, '#ffffff')}</g>
      <image x="145" y="890" width="225" height="300" href="${PREVIOUS_COVER}"/>
      ${tx(420, 960, '系列笔记封面素材', 42, 800, '#2877d5')}
      ${ls(420, 1030, ['把它作为已有风格参考，', '比只说“写一篇”具体。', '这张是本地设计素材，', '不代表已发布或 AI 实测。'], 32, 55, 600, '#34433a')}
      ${tx(92, 1410, '让 AI 先出草稿，再人工核对与修改。', 30, 650, '#2877d5')}
    `, '#2877d5')
  },
  {
    file: '07-copy-template.png', svg: page(7, `
      ${pill(92, 92, '07  直接收藏这个模板', 650)}
      ${tx(92, 320, '不知道怎么问？', 77, 850, '#17241b')}
      ${tx(92, 420, '直接套这一段', 82, 900, '#1f8f64')}
      <g filter="url(#shadow)">${box(92, 490, 1016, 755, 42, '#ffffff')}</g>
      ${ls(145, 600, [
        '任务：请帮我完成【任务】。',
        '背景：【资料、给谁看、使用场景】。',
        '要求：【重点、限制、不编造什么】。',
        '格式：请按【输出格式】输出。',
        '缺信息先问：不要直接猜测。'
      ], 43, 124, 700, '#25382b')}
      ${tx(92, 1370, '可复制版在笔记正文；换成自己的材料再用。', 30, 650, '#5c6b60')}
      ${tx(92, 1420, '生成后，自己核对事实与数字。', 30, 700, '#1f8f64')}
    `)
  }
];

Promise.all(outputs.map(({ file, svg }) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file))))
  .then(() => console.log(`已生成 ${outputs.length} 张配图：${OUT}`))
  .catch((error) => { console.error(error); process.exitCode = 1; });
