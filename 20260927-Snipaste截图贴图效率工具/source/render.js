const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200, H = 1600;
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'images-v1');
const PREVIEW = path.join(ROOT, 'preview-v1');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });

const C = {
  bg:'#f4f3ee', paper:'#fffdfa', ink:'#18312c', muted:'#61736e', line:'#d8e1dd',
  green:'#16a37f', mint:'#dff5ed', cyan:'#2e9db3', blue:'#dceff4', yellow:'#f3c54b',
  cream:'#fff1c7', coral:'#eb6a5b', coralBg:'#fde7e2', dark:'#123c34', white:'#ffffff'
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rect=(x,y,w,h,fill,rx=24,stroke='none',sw=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text=(x,y,s,size=34,weight=700,fill=C.ink,anchor='start')=>`<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,stroke=C.line,sw=3,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

function base(num, body, note='') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#24483b" flood-opacity=".15"/></filter></defs>
  ${rect(0,0,W,H,C.bg,0)}
  ${circle(1110,80,260,C.mint)}${circle(60,1510,190,C.blue)}
  ${body}
  ${note?text(70,1435,note,24,650,C.muted):''}
  ${line(70,1470,1130,1470,'#ccd8d3',2)}
  ${text(70,1525,'效率研究所',27,750,C.muted)}
  ${text(1130,1525,`${String(num).padStart(2,'0')} / 08`,27,750,C.muted,'end')}
  </svg>`;
}

function pill(x,y,w,label,fill=C.mint,color=C.green){return `${rect(x,y,w,48,fill,24)}${text(x+w/2,y+33,label,22,800,color,'middle')}`;}
function key(x,y,label,w=94){return `<g filter="url(#sh)">${rect(x,y,w,62,C.dark,14)}${text(x+w/2,y+42,label,28,850,C.white,'middle')}</g>`;}
function arrow(x1,y1,x2,y2,color=C.green){return `${line(x1,y1,x2,y2,color,6)}<path d="M ${x2-18} ${y2-12} L ${x2} ${y2} L ${x2-18} ${y2+12}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;}
function browser(x,y,w,h,title='资料窗口'){
  return `<g filter="url(#sh)">${rect(x,y,w,h,C.paper,22,C.line,2)}${rect(x,y,w,62,'#e9efec',22)}${circle(x+28,y+31,7,C.coral)}${circle(x+52,y+31,7,C.yellow)}${circle(x+76,y+31,7,C.green)}${text(x+104,y+40,title,22,750,C.muted)}${line(x,y+62,x+w,y+62,C.line,2)}</g>`;
}
function pinCard(x,y,w,h,title,rows){
  let r=`<g filter="url(#sh)">${rect(x,y,w,h,C.paper,22,C.green,4)}${rect(x,y,w,56,C.green,20)}${text(x+24,y+38,'●  已贴在屏幕',21,800,C.white)}${text(x+24,y+98,title,27,850,C.ink)}`;
  rows.forEach((s,i)=>{r+=`${circle(x+30,y+140+i*48,6,C.green)}${text(x+50,y+149+i*48,s,23,650,C.ink)}`;});
  return r+'</g>';
}

const pages=[];

pages.push(['01-cover.png', base(1, `
  ${pill(70,70,190,'SNIPASTE')}
  ${text(70,230,'截图还能',88,900,C.ink)}
  ${text(70,330,'钉在屏幕上？',88,900,C.green)}
  ${text(70,405,'少切窗口的 5 个用法',36,700,C.muted)}
  ${browser(95,555,700,600,'正在写文档')}
  ${text(135,670,'活动执行清单',35,850,C.ink)}
  ${line(135,725,720,725,C.line,3)}
  ${text(135,795,'活动日期：________',30,650,C.muted)}
  ${text(135,860,'报名截止：________',30,650,C.muted)}
  ${text(135,925,'目标人数：________',30,650,C.muted)}
  ${pinCard(650,650,455,360,'关键资料',['10 月 12 日','10 月 8 日 18:00','目标 80 人'])}
  ${arrow(560,520,730,610,C.coral)}
  ${pill(70,1280,500,'截图只是开始，贴图才是差异点',C.cream,'#8b6500')}
  `)]);

pages.push(['02-problem.png', base(2, `
  ${pill(70,70,190,'为什么省事')}
  ${text(70,210,'普通截图之后，',66,900,C.ink)}
  ${text(70,290,'你可能还在切窗口',66,900,C.coral)}
  ${rect(70,390,1060,260,C.paper,30,C.line,2)}
  ${text(150,485,'看资料',35,850,C.ink)}${arrow(300,475,420,475,C.muted)}
  ${text(455,485,'切到文档',35,850,C.ink)}${arrow(655,475,770,475,C.muted)}
  ${text(805,485,'忘了一处',35,850,C.ink)}
  ${pathLoop()}
  ${text(600,610,'再切回去',28,800,C.coral,'middle')}
  ${rect(70,735,1060,390,C.dark,32)}
  ${text(120,825,'普通截图',30,800,'#a9c4bd')}
  ${text(120,885,'解决“留下来”',48,900,C.white)}
  ${line(120,930,1080,930,'#38675d',2)}
  ${text(120,1010,'Snipaste 贴图',30,800,'#72e1bf')}
  ${text(120,1070,'解决“边看边做”',48,900,'#72e1bf')}
  ${rect(120,1190,960,120,C.mint,28)}
  ${text(600,1267,'需要一直对照 → 临时贴在屏幕上',37,850,C.green,'middle')}
  `)]);

function pathLoop(){return `<path d="M 910 525 C 900 650 300 680 250 545" fill="none" stroke="${C.coral}" stroke-width="5" stroke-dasharray="10 10"/><path d="M235 560 L250 540 L270 553" fill="none" stroke="${C.coral}" stroke-width="5"/>`;}

pages.push(['03-flow.png', base(3, `
  ${pill(70,70,180,'基础流程')}
  ${text(70,210,'F1 截图，F3 贴图',70,900,C.ink)}
  ${text(70,275,'本机 Snipaste 2.11.3 已人工确认',28,700,C.muted)}
  ${flowStep(1,100,390,'F1','开始截图','进入选区模式')}
  ${flowStep(2,640,390,'框选','确认区域','只保留要对照的内容')}
  ${flowStep(3,100,760,'F3','贴到屏幕','变成置顶浮动窗口')}
  ${flowStep(4,640,760,'关闭','用完收起','避免贴图越堆越多')}
  ${rect(100,1190,1000,125,C.cream,28)}
  ${text(600,1244,'默认快捷键可在设置中调整',28,800,'#8b6500','middle')}
  ${text(600,1288,'若 F1/F3 冲突，先检查其他软件占用',24,650,'#8b6500','middle')}
  `)]);

function flowStep(n,x,y,k,title,sub){const result=['','出现截图选区','只留下关键区域','生成置顶参考卡','桌面恢复整洁'][n];return `<g>${circle(x+54,y+45,34,C.green)}${text(x+54,y+56,String(n),27,900,C.white,'middle')}${key(x+115,y+8,k,k.length>3?130:96)}${text(x,y+135,title,40,900,C.ink)}${text(x,y+185,sub,25,650,C.muted)}${rect(x,y+225,450,90,n%2?C.mint:C.blue,20)}${text(x+225,y+280,result,23,750,n%2?C.green:C.cyan,'middle')}</g>`;}

pages.push(['04-writing.png', base(4, `
  ${pill(70,70,180,'场景 01')}
  ${text(70,210,'边看资料，边写文档',66,900,C.ink)}
  ${text(70,275,'优势不只是截得快，而是资料不会被盖住',28,700,C.muted)}
  ${rect(70,360,500,120,C.coralBg,24)}${text(110,410,'以前',24,850,C.coral)}${text(110,454,'网页 ↔ 文档反复切',34,850,C.ink)}
  ${rect(630,360,500,120,C.mint,24)}${text(670,410,'现在',24,850,C.green)}${text(670,454,'关键段贴在编辑区旁',34,850,C.ink)}
  ${browser(70,555,1060,610,'活动文案草稿')}
  ${text(120,680,'秋季阅读活动',36,900,C.ink)}
  ${text(120,750,'和喜欢阅读的人一起交换一本好书。',27,650,C.muted)}
  ${text(120,810,'活动日期：',27,650,C.muted)}${rect(285,770,290,62,'#f7f3ec',12,C.line,2)}
  ${text(120,885,'报名截止：',27,650,C.muted)}${rect(285,845,290,62,'#f7f3ec',12,C.line,2)}
  ${pinCard(650,670,410,330,'资料摘录',['10 月 12 日','截止 10 月 8 日','正文 ≤ 180 字'])}
  ${pill(70,1250,260,'场景演示｜虚构材料',C.blue,C.cyan)}
  `)]);

pages.push(['05-table.png', base(5, `
  ${pill(70,70,180,'场景 02')}
  ${text(70,210,'对照需求，填写表格',66,900,C.ink)}
  ${text(70,275,'日期、截止时间、数量：贴在旁边逐项核对',28,700,C.muted)}
  ${rect(70,365,1060,760,C.paper,28,C.line,2)}
  ${rect(105,420,650,80,'#e9efec',14)}
  ${text(135,470,'字段',25,850,C.muted)}${text(360,470,'填写内容',25,850,C.muted)}${text(640,470,'状态',25,850,C.muted)}
  ${tableRow(105,500,'活动日期','10 月 12 日','已核对')}
  ${tableRow(105,610,'报名截止','10 月 8 日 18:00','已核对')}
  ${tableRow(105,720,'目标人数','80 人','已核对')}
  ${tableRow(105,830,'场地确认','周三前','待完成')}
  ${pinCard(760,500,320,360,'需求摘要',['10 月 12 日','18:00 截止','80 人','周三前'])}
  ${rect(105,1000,975,85,C.coralBg,18)}${text(592,1055,'截图前先删除姓名、账号、客户和未公开信息',25,800,C.coral,'middle')}
  ${pill(70,1250,260,'场景演示｜虚构材料',C.blue,C.cyan)}
  `)]);
function tableRow(x,y,a,b,c){return `${line(x,y,x+650,y,C.line,2)}${text(x+25,y+72,a,25,700,C.ink)}${text(x+255,y+72,b,25,700,C.ink)}${text(x+535,y+72,c,22,800,c==='已核对'?C.green:C.coral)}`;}

pages.push(['06-more.png', base(6, `
  ${pill(70,70,190,'再试 3 个')}
  ${text(70,210,'贴图不只来自截图',66,900,C.ink)}
  ${text(70,275,'下面按官网说明整理，具体表现以版本和设置为准',27,700,C.muted)}
  ${featureCard(70,365,1060,245,'01','短文本贴图','复制一小段文字 → F3','临时对照地址、日期、任务要求',C.mint,C.green)}
  ${featureCard(70,650,1060,245,'02','降低遮挡','Ctrl + 鼠标滚轮','调整单个贴图透明度',C.blue,C.cyan)}
  ${featureCard(70,935,1060,245,'03','两图并排','贴出两个关键局部','临时比较两个版本或两处细节',C.cream,'#9a6c00')}
  ${rect(70,1245,1060,82,'#e9efec',20)}${text(600,1297,'官网功能说明｜本页不写成 A 的亲测结果',24,750,C.muted,'middle')}
  `)]);
function featureCard(x,y,w,h,n,title,action,sub,bg,accent){return `<g>${rect(x,y,w,h,C.paper,28,C.line,2)}${circle(x+78,y+78,46,bg)}${text(x+78,y+89,n,26,900,accent,'middle')}${text(x+155,y+73,title,38,900,C.ink)}${text(x+155,y+125,action,28,850,accent)}${text(x+155,y+180,sub,25,650,C.muted)}${rect(x+w-285,y+62,220,120,bg,22)}${text(x+w-175,y+115,title==='短文本贴图'?'文字 → 浮窗':title==='降低遮挡'?'100% → 60%':'A  ↔  B',27,900,accent,'middle')}</g>`;}

pages.push(['07-license.png', base(7, `
  ${pill(70,70,210,'版本与授权')}
  ${text(70,210,'免费能力够不够用？',66,900,C.ink)}
  ${text(70,275,'先把功能差异和使用许可分开看',28,700,C.muted)}
  ${rect(70,360,505,650,C.paper,30,C.green,3)}
  ${text(120,435,'免费基础能力',38,900,C.green)}
  ${bullet(120,515,'截图、贴图、剪贴板转浮窗',C.green)}
  ${bullet(120,590,'缩放、旋转、透明度、穿透',C.green)}
  ${bullet(120,665,'常用标注、马赛克与模糊',C.green)}
  ${rect(120,780,405,150,C.mint,24)}${text(322,840,'个人只用截图＋贴图',26,800,C.green,'middle')}${text(322,885,'可以先用基础能力',30,900,C.ink,'middle')}
  ${rect(625,360,505,650,C.paper,30,C.cyan,3)}
  ${text(675,435,'专业版代表能力',38,900,C.cyan)}
  ${bullet(675,515,'OCR／文字识别',C.cyan)}
  ${bullet(675,590,'自定义部分应用内快捷键',C.cyan)}
  ${bullet(675,665,'更多输出、批处理与自动化',C.cyan)}
  ${rect(675,780,405,150,C.blue,24)}${text(877,840,'需要高级能力或商业授权',25,800,C.cyan,'middle')}${text(877,885,'再看官方说明升级',30,900,C.ink,'middle')}
  ${rect(70,1060,1060,205,C.dark,28)}
  ${text(115,1128,'授权边界',28,850,'#8ae3ca')}
  ${text(115,1185,'Snipaste 2.x：个人、非商业用途免费',32,850,C.white)}
  ${text(115,1235,'商业／公司场景：需要专业版许可',32,850,'#ffd56b')}
  `, '根据官网文档整理｜未对专业版逐项实测')]);
function bullet(x,y,s,color){return `${circle(x+10,y-9,8,color)}${text(x+34,y,s,25,700,C.ink)}`;}

pages.push(['08-takeaway.png', base(8, `
  ${pill(70,70,180,'收藏这一页')}
  ${text(70,210,'先记住一个流程',72,900,C.ink)}
  ${stepBar(120,370,'F1','截图','截下要对照的部分',C.green)}
  ${text(600,655,'↓',58,900,C.muted,'middle')}
  ${stepBar(120,700,'F3','贴图','放在工作窗口旁',C.cyan)}
  ${text(600,985,'↓',58,900,C.muted,'middle')}
  ${rect(120,1030,960,170,C.dark,30)}
  ${text(600,1100,'真正的优势',26,800,'#8ae3ca','middle')}
  ${text(600,1160,'不是多截一张图，而是少切几次窗口',35,900,C.white,'middle')}
  ${rect(120,1265,960,90,C.mint,22)}${text(600,1322,'你最想把哪种内容钉在屏幕上对照？',28,850,C.green,'middle')}
  `)]);
function stepBar(x,y,k,title,sub,accent){return `<g filter="url(#sh)">${rect(x,y,960,230,C.paper,30,C.line,2)}${key(x+60,y+64,k,130)}${text(x+250,y+102,title,48,900,C.ink)}${text(x+250,y+158,sub,27,650,C.muted)}${circle(x+855,y+115,52,accent)}${text(x+855,y+129,'✓',38,900,C.white,'middle')}</g>`;}

async function render(){
  const previewBuffers=[];
  for(const [name,svg] of pages){
    const full=await sharp(Buffer.from(svg)).png().toBuffer();
    fs.writeFileSync(path.join(OUT,name),full);
    const small=await sharp(full).resize(360,480,{fit:'fill'}).png().toBuffer();
    fs.writeFileSync(path.join(PREVIEW,name),small);
    previewBuffers.push({input:small,left:(previewBuffers.length%4)*380,top:Math.floor(previewBuffers.length/4)*500});
  }
  const contact=await sharp({create:{width:1500,height:1000,channels:4,background:'#e7ebe8'}}).composite(previewBuffers).png().toBuffer();
  fs.writeFileSync(path.join(PREVIEW,'contact-sheet.png'),contact);
}
render().catch(e=>{console.error(e);process.exit(1);});
