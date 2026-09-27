const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200;
const H = 1600;
const ROOT = path.resolve(__dirname, '..');
const v2 = process.argv.includes('--v2');
const OUT = path.join(ROOT, v2 ? 'images-v2' : 'images-v1');
const PREVIEW = path.join(ROOT, v2 ? 'preview-v2' : 'preview-v1');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });

const C = {
  bg: '#09111f', panel: '#111c30', panel2: '#16243c', line: '#283954',
  text: '#f5f2e9', muted: '#9dadc5', cyan: '#44d7ff', yellow: '#ffd75a',
  coral: '#ff7b7b', violet: '#a98bff', green: '#66e3ad', blue: '#6ba7ff'
};
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const rect = (x,y,w,h,fill,rx=24,stroke='none',sw=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text = (x,y,s,size=36,weight=700,fill=C.text,anchor='start') => `<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

function base(num, accent, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101f"/><stop offset="1" stop-color="#0d1830"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity=".28"/></filter>
      <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#ffffff" stroke-opacity=".025"/></pattern>
    </defs>
    <rect width="1200" height="1600" fill="url(#bg)"/>
    <rect width="1200" height="1600" fill="url(#grid)"/>
    <circle cx="1080" cy="80" r="250" fill="${accent}" opacity=".08"/>
    ${body}
    <line x1="76" y1="1462" x2="1124" y2="1462" stroke="#2b3a55" stroke-width="2"/>
    ${text(76,1518,'效率研究所',27,700,C.muted)}
    ${text(1124,1518,`${String(num).padStart(2,'0')} / 10`,27,700,C.muted,'end')}
  </svg>`;
}

function keycaps(x, y, keys, accent) {
  let cur = x;
  let out = '';
  keys.forEach((key, i) => {
    const width = Math.max(58, 18 * String(key).length + 34);
    out += `<g filter="url(#shadow)">${rect(cur,y,width,56,C.panel2,12,accent,2)}${text(cur+width/2,y+38,key,25,800,C.text,'middle')}</g>`;
    cur += width;
    if (i < keys.length - 1) {
      out += text(cur+14,y+38,'+',25,800,C.muted,'middle');
      cur += 28;
    }
  });
  return out;
}

function keycapsWidth(keys) {
  return keys.reduce((sum,key)=>sum+Math.max(58,18*String(key).length+34),0)+Math.max(0,keys.length-1)*28;
}

function itemCard(x, y, w, h, item, accent) {
  const actionColor = item.warn ? C.coral : C.text;
  const badge = item.note ? `${rect(x+w-132,y+18,106,32,`${accent}22`,16)}${text(x+w-79,y+41,item.note,18,800,accent,'middle')}` : '';
  let keysSvg = keycaps(x+22,y+22,item.keys,accent);
  if (item.alternates) {
    const firstWidth = keycapsWidth(item.alternates[0]);
    const secondX = x+22+firstWidth+54;
    keysSvg = keycaps(x+22,y+22,item.alternates[0],accent)
      + text(x+22+firstWidth+27,y+60,'或',22,800,C.muted,'middle')
      + keycaps(secondX,y+22,item.alternates[1],accent);
  }
  return `<g>${rect(x,y,w,h,C.panel,20,C.line,2)}${keysSvg}${text(x+24,y+h-25,item.action,30,800,actionColor)}${badge}</g>`;
}

function listPage(num, title, subtitle, accent, items, note='') {
  const cols = 2;
  const rows = Math.ceil(items.length/cols);
  const startY = 350;
  const cardW = 496;
  const colGap = 56;
  const available = 1035;
  const gap = rows >= 6 ? 18 : 24;
  const cardH = Math.floor((available - gap*(rows-1))/rows);
  let cards = '';
  items.forEach((item,i) => {
    const col = Math.floor(i/rows);
    const row = i%rows;
    const x = 76 + col*(cardW+colGap);
    const y = startY + row*(cardH+gap);
    cards += itemCard(x,y,cardW,cardH,item,accent);
  });
  return base(num, accent, `
    ${rect(76,72,184,48,`${accent}22`,24)}${text(168,106,`分类 ${String(num-1).padStart(2,'0')}`,24,800,accent,'middle')}
    ${text(76,225,title,72,900,C.text)}
    ${text(76,290,subtitle,30,650,C.muted)}
    ${cards}
    ${note ? text(76,1428,note,25,700,note.includes('删除')?C.coral:C.muted) : ''}`);
}

const p2 = [
  {keys:['Ctrl','C'],action:'复制'}, {keys:['Ctrl','X'],action:'剪切'},
  {keys:['Ctrl','V'],action:'粘贴'}, {keys:['Ctrl','Shift','V'],action:'纯文本粘贴',note:'部分应用'},
  {keys:['Ctrl','Z'],action:'撤销'}, {keys:['Ctrl','Y'],action:'重做'},
  {keys:['Ctrl','A'],action:'全选'}, {keys:['Ctrl','F'],action:'查找'},
  {keys:['Ctrl','S'],action:'保存'}, {keys:['Ctrl','P'],action:'打印'}
];
const p3 = [
  {keys:['Home'],action:'行首'}, {keys:['End'],action:'行尾'},
  {keys:['Ctrl','← / →'],action:'按词移动'}, {keys:['Ctrl','Backspace'],action:'删前一词'},
  {keys:['Shift','方向键'],action:'扩展选择'}, {keys:['Ctrl','Shift','←→'],action:'按词选择'},
  {keys:['Ctrl','Home'],action:'文档开头'}, {keys:['Ctrl','End'],action:'文档末尾'},
  {keys:['Page Up'],action:'上一屏'}, {keys:['Page Down'],action:'下一屏'}
];
const p4 = [
  {keys:['Alt','Tab'],action:'切换窗口'}, {keys:['Alt','F4'],action:'关闭窗口'},
  {keys:['Win','D'],action:'显示 / 隐藏桌面'}, {keys:['Win','M'],action:'最小化全部'},
  {keys:['Win','Shift','M'],action:'恢复最小化窗口'}, {keys:['Win','← / →'],action:'左右贴靠'},
  {keys:['Win','↑'],action:'最大化'}, {keys:['Win','↓'],action:'还原 / 最小化'},
  {keys:['Win','Z'],action:'贴靠布局'}, {keys:['Win','Shift','←→'],action:'移到另一显示器'}
];
const p5 = [
  {keys:['Win','S'],action:'系统搜索'}, {keys:['Win','E'],action:'文件资源管理器'},
  {keys:['Win','I'],action:'系统设置'}, {keys:['Win','A'],action:'快速设置'},
  {keys:['Win','R'],action:'运行窗口'}, {keys:['Win','X'],action:'快速链接菜单'},
  {keys:['Win','L'],action:'锁屏'}, {keys:['Ctrl','Shift','Esc'],action:'任务管理器'},
  {keys:['Ctrl','Alt','Delete'],action:'安全选项'}, {keys:['Win','P'],action:'投影模式'}
];
const p6 = [
  {keys:['Win','Shift','S'],action:'区域截图'}, {keys:['Win','PrtScn'],action:'全屏截图存盘'},
  {keys:['Alt','PrtScn'],action:v2?'当前窗口→剪贴板':'当前窗口截图'}, {keys:['PrtScn'],action:'启动截图',note:'可设置'},
  {keys:['Win','V'],action:'剪贴板历史',note:'需开启'}, {keys:['Win','H'],action:'语音输入'},
  v2?{keys:['Win','.'],alternates:[['Win','.'],['Win',';']],action:'表情面板'}:{keys:['Win','. / ;'],action:'表情面板'}, {keys:['Win','Space'],action:'切换输入语言'}
];
const p7 = [
  {keys:['Ctrl','Shift','N'],action:'新建文件夹'}, {keys:['F2'],action:'重命名'},
  {keys:['Delete'],action:v2?'通常移到回收站':'移到回收站'}, {keys:['Shift','Delete'],action:'直接删除',warn:true},
  {keys:['Alt','Enter'],action:'查看属性'}, {keys:['Alt','D'],action:'定位地址栏'},
  {keys:['Ctrl','E'],action:'搜索文件'}, {keys:['Alt','↑'],action:'上一级'},
  {keys:['Alt','← / →'],action:'前进 / 后退'}, {keys:['F5'],action:'刷新'}
];
const p8 = [
  {keys:['Ctrl','T'],action:'新标签页'}, {keys:['Ctrl','W'],action:'关闭标签页'},
  {keys:['Ctrl','Shift','T'],action:'恢复误关标签'}, {keys:['Ctrl','Tab'],action:'下一标签'},
  {keys:['Ctrl','Shift','Tab'],action:'上一标签'}, {keys:['Ctrl','1–8'],action:'指定标签页'},
  {keys:['Ctrl','9'],action:'最后标签页'}, {keys:['Ctrl','L'],action:'定位地址栏'},
  {keys:['Ctrl','R'],action:'刷新页面'}, {keys:['Ctrl','D'],action:'收藏当前页'},
  {keys:['Ctrl','H'],action:'历史记录'}, {keys:['Ctrl','J'],action:'下载记录'}
];
const p9 = [
  {keys:['Win','Tab'],action:'任务视图'}, {keys:['Win','Ctrl','D'],action:'新建桌面'},
  {keys:['Win','Ctrl','←→'],action:'切换桌面'}, {keys:['Win','Ctrl','F4'],action:'关闭当前桌面'},
  {keys:['Win','数字'],action:v2?'打开 / 切换应用':'任务栏应用'}, {keys:['Win','Shift','数字'],action:'新开应用实例'},
  {keys:['Win','Ctrl','数字'],action:v2?'切到最后活动窗口':'最后活动窗口'}, {keys:['Win','T'],action:'浏览任务栏应用'}
];
const p10 = [
  {keys:['Ctrl','C'],action:'复制'}, {keys:['Ctrl','V'],action:'粘贴'},
  {keys:['Ctrl','Z'],action:'撤销'}, {keys:['Ctrl','F'],action:'查找'},
  {keys:['Ctrl','S'],action:'保存'}, {keys:['Alt','Tab'],action:'切换窗口'},
  {keys:['Win','Shift','S'],action:'区域截图'}, {keys:['Win','V'],action:'剪贴板历史'},
  {keys:['Win','E'],action:'文件管理'}, {keys:['Win','L'],action:'锁屏'},
  {keys:['Ctrl','Shift','Esc'],action:'任务管理器'}, {keys:['Ctrl','Shift','T'],action:'恢复误关标签'}
];
const uniquePages = [p2,p3,p4,p5,p6,p7,p8,p9];
const uniqueKeys = uniquePages.flat().map((item)=>item.alternates ? item.alternates.map((keys)=>keys.join('+')).join('|') : item.keys.join('+'));
if (uniqueKeys.length !== 78) throw new Error(`独立条目计数异常：${uniqueKeys.length}`);
if (new Set(uniqueKeys).size !== uniqueKeys.length) throw new Error('第 2～9 页存在重复快捷键');

const cover = base(1,C.cyan,`
  ${rect(76,78,390,52,`${C.cyan}22`,26)}${text(271,114,'效率研究所 · Windows 11',25,800,C.cyan,'middle')}
  ${text(76,310,'Windows',110,900,C.text)}
  ${text(76,430,'快捷键速查表',106,900,C.cyan)}
  ${text(76,510,'工作时直接查，不用一次背完',37,700,C.muted)}
  <g transform="translate(76 640)">
    ${rect(0,0,1048,560,C.panel,42,C.line,2)}
    ${keycaps(62,76,['Ctrl','C'],C.cyan)}${keycaps(410,76,['Alt','Tab'],C.yellow)}${keycaps(744,76,['Win','E'],C.green)}
    ${keycaps(62,200,['Win','Shift','S'],C.violet)}${keycaps(550,200,['Ctrl','Shift','T'],C.coral)}
    ${keycaps(62,324,['Win','V'],C.blue)}${keycaps(410,324,['Ctrl','Z'],C.yellow)}${keycaps(744,324,['Win','L'],C.green)}
    ${text(62,492,'编辑 · 窗口 · 截图 · 文件 · 浏览器',37,850,C.text)}
  </g>
  ${rect(76,1260,v2?410:380,76,`${C.yellow}18`,38,C.yellow,2)}${text(v2?281:266,1312,v2?'78 组 · 分类整理':'78 组 · 已去重',32,850,C.yellow,'middle')}
  ${text(76,1400,'最后一页：先记最常用的 12 组',30,700,C.muted)}
`);

const pages = [
  ['01-cover.png',cover],
  ['02-editing.png',listPage(2,'复制、保存、查找','10 组｜大多数编辑场景先从这里找',C.cyan,p2,'Ctrl + Shift + V 在部分应用中不可用')],
  ['03-selection.png',listPage(3,'光标与文字选择','10 组｜少拖鼠标，长文更好改',C.yellow,p3,'具体移动与选择行为可能随应用变化')],
  ['04-windows.png',listPage(4,'窗口切换与排列','10 组｜多任务和多屏办公',C.violet,p4,'跨显示器组合仅在多显示器环境下生效')],
  ['05-system.png',listPage(5,'系统入口','10 组｜设置、搜索和任务管理',C.green,p5,'锁屏与安全选项会立即切换当前界面')],
  ['06-capture-input.png',listPage(6,'截图、输入与剪贴板','8 组｜截图、语音、表情和历史记录',C.blue,p6,'PrtScn 行为可改；Win + V 默认可能未开启')],
  ['07-files.png',listPage(7,'文件管理','10 组｜资源管理器里少找菜单',C.coral,p7,'Shift + Delete 不经过回收站，操作前先确认文件')],
  ['08-browser.png',listPage(8,'浏览器标签页','12 组｜误关标签、切页和收藏',C.cyan,p8,'以 Windows 版 Microsoft Edge 默认行为为准')],
  ['09-desktops.png',listPage(9,'虚拟桌面与任务栏','8 组｜切桌面、开应用、找窗口',C.violet,p9,'数字对应任务栏中应用的固定位置')],
  ['10-top12.png',listPage(10,'先记这 12 个','高频精选｜前 8 页的复习卡，不重复计数',C.yellow,p10,'用到再查，不用一次背完')]
];

async function main() {
  for (const [name, svg] of pages) {
    const outFile = path.join(OUT,name);
    await sharp(Buffer.from(svg)).png({compressionLevel:9}).toFile(outFile);
    await sharp(outFile).resize({width:360}).png({compressionLevel:9}).toFile(path.join(PREVIEW,name));
  }
  const thumbs = await Promise.all(pages.map(async ([name]) => ({
    input: await sharp(path.join(PREVIEW,name)).resize({width:240}).png().toBuffer()
  })));
  await sharp({create:{width:1200,height:680,channels:4,background:'#07101f'}})
    .composite(thumbs.map((img,i)=>({...img,left:(i%5)*240,top:Math.floor(i/5)*340})))
    .png().toFile(path.join(PREVIEW,'contact-sheet.png'));
  console.log(`已生成 ${pages.length} 张 ${v2?'V2':'V1'} 图片、${pages.length} 张 360px 预览和联系表；独立快捷键 ${uniqueKeys.length} 组，无重复`);
}
main().catch((err)=>{console.error(err);process.exitCode=1;});
