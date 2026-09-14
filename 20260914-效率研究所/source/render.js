const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 1600;
const BRAND = '效率研究所';
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'images');
const ICON_DIR = path.join(__dirname, 'icons');
fs.mkdirSync(OUT, { recursive: true });

const iconCache = new Map();

function iconData(name) {
  if (!iconCache.has(name)) {
    const svg = fs.readFileSync(path.join(ICON_DIR, `${name}.svg`));
    iconCache.set(name, `data:image/svg+xml;base64,${svg.toString('base64')}`);
  }
  return iconCache.get(name);
}

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
    ${text(92, 1510, BRAND, 28, 650, '#56635b')}
    ${text(1108, 1510, `${String(page).padStart(2, '0')} / 07`, 28, 650, '#56635b', 'end')}
    <rect x="92" y="1545" width="1016" height="5" rx="3" fill="#dbe5dd"/>
    <rect x="92" y="1545" width="${1016 * page / 7}" height="5" rx="3" fill="${accent}"/>
  </svg>`;
}

function pill(x, y, label, accent) {
  const width = label.length * 31 + 54;
  return `${rounded(x, y, width, 60, 30, `${accent}18`)}${text(x + 27, y + 41, label, 28, 700, accent)}`;
}

function toolPill(x, y, label, accent) {
  const width = label.length * 38 + 68;
  return `${rounded(x, y, width, 76, 38, `${accent}22`)}${text(x + 34, y + 53, label, 36, 800, accent)}`;
}

function toolIcon(x, y, size, iconName) {
  const padding = Math.round(size * 0.2);
  return `<g filter="url(#shadow)">${rounded(x, y, size, size, Math.round(size * 0.26), '#ffffff')}</g>
    <image x="${x + padding}" y="${y + padding}" width="${size - padding * 2}" height="${size - padding * 2}" href="${iconData(iconName)}" preserveAspectRatio="xMidYMid meet"/>`;
}

function toolPage(page, data) {
  const bullets = data.bullets.map((item, i) =>
    `${rounded(112, 880 + i * 88, 14, 14, 7, data.accent)}${text(158, 900 + i * 88, item, 35, 520, '#29362f')}`
  ).join('');
  const body = `
    ${toolPill(92, 92, `0${page - 1}  ${data.name}`, data.accent)}
    ${toolIcon(92, 260, 220, data.icon)}
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
      ${pill(92, 92, 'AI 工具选择指南', '#2f7d52')}
      ${text(92, 365, '别再乱收藏', 106, 900, '#142019')}
      ${text(92, 485, 'AI 工具', 118, 900, '#2f7d52')}
      ${text(92, 620, '普通人先认清这 5 类', 58, 760, '#26342c')}
      ${text(92, 700, '选对工具，比多学更重要', 37, 520, '#627068')}
      <g filter="url(#shadow)">${rounded(92, 820, 1016, 390, 48, '#ffffff')}</g>
      ${toolIcon(140, 885, 130, 'chatgpt')}
      ${toolIcon(330, 885, 130, 'gemini')}
      ${toolIcon(520, 885, 130, 'perplexity')}
      ${toolIcon(710, 885, 130, 'notebooklm')}
      ${toolIcon(900, 885, 130, 'canva')}
      ${text(205, 1068, 'ChatGPT', 23, 650, '#445149', 'middle')}
      ${text(395, 1068, 'Gemini', 23, 650, '#445149', 'middle')}
      ${text(585, 1068, 'Perplexity', 22, 650, '#445149', 'middle')}
      ${text(775, 1068, 'Notebook', 22, 650, '#445149', 'middle')}
      ${text(965, 1068, 'Canva', 23, 650, '#445149', 'middle')}
      ${text(600, 1160, '综合 · 生态 · 搜索 · 文档 · 设计', 31, 650, '#445149', 'middle')}
    `)
  },
  {
    file: '02-chatgpt.png',
    svg: toolPage(2, {
      name: 'ChatGPT', icon: 'chatgpt', accent: '#1f8f64', kicker: '综合型 AI 助手',
      title: '不知道用什么 AI？', title2: '先从它开始',
      bullets: ['把会议纪要整理成待办', '总结长文并提取重点', '梳理方案并反复修改'],
      takeaway: '适合综合处理、需要来回沟通的任务。'
    })
  },
  {
    file: '03-gemini.png',
    svg: toolPage(3, {
      name: 'Gemini', icon: 'gemini', accent: '#7657d6', kicker: 'Google 系 AI 助手',
      title: '用 Google 生态的人', title2: '可以重点关注',
      bullets: ['搜索与日常问答', '图片、文档与多模态', '联动 Google 应用场景'],
      takeaway: '具体能力会因账号、地区和订阅方案而变化。'
    })
  },
  {
    file: '04-perplexity.png',
    svg: toolPage(4, {
      name: 'Perplexity', icon: 'perplexity', accent: '#2877d5', kicker: '联网查资料',
      title: '想快速了解陌生领域', title2: '用它找资料',
      bullets: ['查资料、做调研', '快速建立主题框架', '回答带引用，可点回原文核对'],
      takeaway: '有来源不等于正确，重要结论仍要确认。'
    })
  },
  {
    file: '05-gemini-notebook.png',
    svg: toolPage(5, {
      name: 'Gemini Notebook', icon: 'notebooklm', accent: '#db8e24', kicker: '原 NotebookLM',
      title: '围绕自己的资料', title2: '做学习与研究',
      bullets: ['整理 PDF 与文档', '学习资料、知识归纳', '围绕已有材料提问'],
      takeaway: '重点不是搜全网，而是研究你提供的材料。'
    })
  },
  {
    file: '06-canva-ai.png',
    svg: toolPage(6, {
      name: 'Canva AI', icon: 'canva', accent: '#1d9faa', kicker: '设计／图片／内容制作',
      title: '做海报、PPT和社媒图', title2: '可以先用它出初稿',
      bullets: ['海报、图片与演示文稿', '文档与社媒内容', '快速完成视觉初稿'],
      takeaway: '最终排版和文字仍需人工检查。'
    })
  },
  {
    file: '07-summary.png',
    svg: shell(7, '#2f7d52', `
      ${pill(92, 92, '收藏总结', '#2f7d52')}
      ${text(92, 285, '不用一次学会', 76, 850, '#142019')}
      ${text(92, 380, '几十个 AI', 92, 900, '#2f7d52')}
      ${text(92, 458, '先根据需求选对工具', 38, 550, '#5e6b63')}
      <g filter="url(#shadow)">${rounded(92, 520, 1016, 745, 48, '#ffffff')}</g>
      ${toolIcon(138, 570, 84, 'chatgpt')}${text(260, 623, '综合沟通', 32, 750, '#1f2923')}${text(1035, 623, 'ChatGPT', 31, 650, '#1f8f64', 'end')}
      <line x1="138" y1="682" x2="1062" y2="682" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 705, 84, 'gemini')}${text(260, 758, 'Google 生态', 32, 750, '#1f2923')}${text(1035, 758, 'Gemini', 31, 650, '#7657d6', 'end')}
      <line x1="138" y1="817" x2="1062" y2="817" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 840, 84, 'perplexity')}${text(260, 893, '联网查资料', 32, 750, '#1f2923')}${text(1035, 893, 'Perplexity', 31, 650, '#2877d5', 'end')}
      <line x1="138" y1="952" x2="1062" y2="952" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 975, 84, 'notebooklm')}${text(260, 1028, '围绕资料学习', 32, 750, '#1f2923')}${text(1035, 1028, 'Gemini Notebook', 30, 650, '#db8e24', 'end')}
      <line x1="138" y1="1087" x2="1062" y2="1087" stroke="#e7ece8" stroke-width="2"/>
      ${toolIcon(138, 1110, 84, 'canva')}${text(260, 1163, '视觉内容初稿', 32, 750, '#1f2923')}${text(1035, 1163, 'Canva AI', 31, 650, '#1d9faa', 'end')}
      ${text(600, 1350, '后续按中文体验、上手难度', 31, 650, '#536159', 'middle')}
      ${text(600, 1400, '和真实任务效果逐个测试', 31, 650, '#536159', 'middle')}
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
