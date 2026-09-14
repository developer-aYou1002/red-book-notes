const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 1600;
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'images');
fs.mkdirSync(OUT, { recursive: true });

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const text = (x, y, value, size, weight = 500, fill = '#17211b', anchor = 'start', opacity = 1) =>
  `<text x="${x}" y="${y}" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}">${esc(value)}</text>`;

const rounded = (x, y, w, h, r, fill, stroke = 'none', sw = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

function shell(page, accent, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8faf4"/>
        <stop offset="1" stop-color="#eef5ef"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="#1a3325" flood-opacity="0.10"/>
      </filter>
    </defs>
    <rect width="1200" height="1600" fill="url(#bg)"/>
    <circle cx="1080" cy="100" r="250" fill="${accent}" opacity="0.08"/>
    <circle cx="80" cy="1510" r="210" fill="${accent}" opacity="0.06"/>
    ${body}
    ${text(92, 1510, '阿建效率研究所', 28, 650, '#56635b')}
    ${text(1108, 1510, `${String(page).padStart(2, '0')} / 07`, 28, 650, '#56635b', 'end')}
    <rect x="92" y="1545" width="1016" height="5" rx="3" fill="#dbe5dd"/>
    <rect x="92" y="1545" width="${1016 * page / 7}" height="5" rx="3" fill="${accent}"/>
  </svg>`;
}

function pill(x, y, label, accent) {
  const width = label.length * 31 + 54;
  return `${rounded(x, y, width, 60, 30, `${accent}18`)}${text(x + 27, y + 41, label, 28, 700, accent)}`;
}

function toolIcon(x, y, size, label, accent) {
  return `<g filter="url(#shadow)">${rounded(x, y, size, size, 42, accent)}</g>${text(x + size / 2, y + size * 0.64, label, label.length > 2 ? 48 : 70, 800, '#ffffff', 'middle')}`;
}

function toolPage(page, data) {
  const bullets = data.bullets.map((item, i) =>
    `${rounded(112, 880 + i * 88, 14, 14, 7, data.accent)}${text(158, 900 + i * 88, item, 35, 520, '#29362f')}`
  ).join('');
  const body = `
    ${pill(92, 92, `0${page - 1}  ${data.name}`, data.accent)}
    ${toolIcon(92, 260, 220, data.icon, data.accent)}
    ${text(92, 590, data.kicker, 34, 700, data.accent)}
    ${text(92, 690, data.title, 72, 850, '#142019')}
    ${text(92, 772, data.title2, 72, 850, '#142019')}
    ${bullets}
    <g filter="url(#shadow)">${rounded(92, 1215, 1016, 170, 36, '#ffffff')}</g>
    ${text(140, 1280, '一句话记住', 27, 700, data.accent)}
    ${text(140, 1345, data.takeaway, 34, 620, '#233129')}
  `;
  return shell(page, data.accent, body);
}

const covers = [
  {
    file: '01-cover.png',
    svg: shell(1, '#2f7d52', `
      ${pill(92, 92, 'AI 工具入门', '#2f7d52')}
      ${text(92, 390, 'AI工具', 130, 900, '#142019')}
      ${text(92, 535, '别乱学！', 130, 900, '#2f7d52')}
      ${text(92, 665, '普通人先搞懂这 5 个', 58, 720, '#26342c')}
      ${text(92, 740, '先选对工具，再开始学习', 35, 500, '#627068')}
      <g filter="url(#shadow)">${rounded(92, 860, 1016, 350, 48, '#ffffff')}</g>
      ${toolIcon(140, 925, 130, 'GPT', '#1f8f64')}
      ${toolIcon(330, 925, 130, 'G', '#7657d6')}
      ${toolIcon(520, 925, 130, 'P', '#2877d5')}
      ${toolIcon(710, 925, 130, 'GN', '#db8e24')}
      ${toolIcon(900, 925, 130, 'C', '#1d9faa')}
      ${text(600, 1155, '综合 · 搜索 · 文档 · 设计', 33, 650, '#445149', 'middle')}
      ${rounded(92, 1280, 260, 76, 38, '#142019')}
      ${text(222, 1331, '收藏备用', 31, 700, '#ffffff', 'middle')}
    `)
  },
  {
    file: '02-chatgpt.png',
    svg: toolPage(2, {
      name: 'ChatGPT', icon: 'GPT', accent: '#1f8f64', kicker: '万能型 AI 助手',
      title: '不知道用什么 AI？', title2: '先从它开始',
      bullets: ['写作、总结与润色', '分析问题、辅助学习', '梳理思路、生成方案'],
      takeaway: '适合高频、综合、需要来回沟通的任务。'
    })
  },
  {
    file: '03-gemini.png',
    svg: toolPage(3, {
      name: 'Gemini', icon: 'G', accent: '#7657d6', kicker: 'Google 系 AI 助手',
      title: '用 Google 生态的人', title2: '可以重点关注',
      bullets: ['搜索与日常问答', '图片、文档与多模态', '连接 Google 使用场景'],
      takeaway: '适合已经在 Google 生态里工作和学习的人。'
    })
  },
  {
    file: '04-perplexity.png',
    svg: toolPage(4, {
      name: 'Perplexity', icon: 'P', accent: '#2877d5', kicker: 'AI 搜索／查资料',
      title: '想快速了解陌生领域', title2: '用它找资料',
      bullets: ['查资料、做调研', '快速建立主题框架', '回答后继续查看来源'],
      takeaway: '适合需要信息来源、又想快速入门的任务。'
    })
  },
  {
    file: '05-gemini-notebook.png',
    svg: toolPage(5, {
      name: 'Gemini Notebook', icon: 'GN', accent: '#db8e24', kicker: '原 NotebookLM',
      title: '围绕自己的资料', title2: '做学习与研究',
      bullets: ['整理 PDF 与文档', '学习资料、知识归纳', '围绕已有材料提问'],
      takeaway: '适合“资料已经在手里”的深度学习场景。'
    })
  },
  {
    file: '06-canva-ai.png',
    svg: toolPage(6, {
      name: 'Canva AI', icon: 'C', accent: '#1d9faa', kicker: '设计／图片／内容制作',
      title: '不太会设计？', title2: '先研究这类工具',
      bullets: ['海报、图片与演示文稿', '文档与社媒内容', '快速完成视觉初稿'],
      takeaway: '适合想把想法快速变成视觉内容的人。'
    })
  },
  {
    file: '07-summary.png',
    svg: shell(7, '#2f7d52', `
      ${pill(92, 92, '收藏总结', '#2f7d52')}
      ${text(92, 285, '不用一次学会', 76, 850, '#142019')}
      ${text(92, 380, '几十个 AI', 92, 900, '#2f7d52')}
      ${text(92, 458, '先根据需求选对工具', 38, 550, '#5e6b63')}
      <g filter="url(#shadow)">${rounded(92, 560, 1016, 700, 48, '#ffffff')}</g>
      ${toolIcon(138, 620, 96, 'GPT', '#1f8f64')}${text(280, 680, '综合处理', 35, 750, '#1f2923')}${text(1035, 680, 'ChatGPT', 34, 650, '#1f8f64', 'end')}
      <line x1="138" y1="745" x2="1062" y2="745" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 785, 96, 'P', '#2877d5')}${text(280, 845, '搜索资料', 35, 750, '#1f2923')}${text(1035, 845, 'Perplexity', 34, 650, '#2877d5', 'end')}
      <line x1="138" y1="910" x2="1062" y2="910" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 950, 96, 'GN', '#db8e24')}${text(280, 1010, '文档学习', 35, 750, '#1f2923')}${text(1035, 1010, 'Gemini Notebook', 34, 650, '#db8e24', 'end')}
      <line x1="138" y1="1075" x2="1062" y2="1075" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 1115, 96, 'C', '#1d9faa')}${text(280, 1175, '设计内容', 35, 750, '#1f2923')}${text(1035, 1175, 'Canva AI', 34, 650, '#1d9faa', 'end')}
      ${text(600, 1345, 'Google 生态 → Gemini', 34, 700, '#7657d6', 'middle')}
      ${text(600, 1405, '收藏起来，慢慢学。', 32, 550, '#536159', 'middle')}
    `)
  }
];

Promise.all(covers.map(({ file, svg }) =>
  sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, file))
)).then(() => {
  console.log(`已生成 ${covers.length} 张配图：${OUT}`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

