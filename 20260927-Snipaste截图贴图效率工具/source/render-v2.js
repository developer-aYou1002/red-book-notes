const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const W=1200,H=1600,ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'images-v2'),PRE=path.join(ROOT,'preview-v2');
fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(PRE,{recursive:true});

const C={bg:'#f1efe8',ink:'#111512',white:'#fffdf7',blue:'#3155ff',orange:'#ff6b35',lime:'#c8f04b',pink:'#ffb7d5',cyan:'#65dce3',gray:'#d7d8d2',muted:'#5d625d'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rect=(x,y,w,h,fill,rx=0,stroke='none',sw=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text=(x,y,s,size=36,weight=800,fill=C.ink,anchor='start')=>`<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color=C.ink,sw=4,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const dot=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const shadow=(x,y,w,h,fill,rx=18,off=12)=>`${rect(x+off,y+off,w,h,C.ink,rx)}${rect(x,y,w,h,fill,rx,C.ink,4)}`;
const tape=(x,y,w,fill=C.lime,rot=-4)=>`<rect x="${x}" y="${y}" width="${w}" height="48" rx="4" fill="${fill}" transform="rotate(${rot} ${x+w/2} ${y+24})" opacity=".94"/>`;

function base(n,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
<defs><pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#111512" opacity=".07"/></pattern></defs>
${rect(0,0,W,H,C.bg)}${rect(0,0,W,H,'url(#dots)')}
${rect(54,48,360,52,C.ink,8)}${text(74,85,'效率研究所  //  DESKTOP LAB',23,800,C.white)}
${rect(1030,46,116,56,n%2?C.orange:C.blue,8,C.ink,4)}${text(1088,85,String(n).padStart(2,'0'),28,900,C.white,'middle')}
${body}
${line(55,1490,1145,1490,C.ink,4)}${text(55,1542,'SNIPASTE · 截图之后，继续工作',23,800,C.muted)}${text(1145,1542,`${n} / 8`,23,900,C.ink,'end')}
</svg>`;}
const label=(x,y,s,fill=C.lime,w=220)=>`${rect(x,y,w,52,fill,6,C.ink,3)}${text(x+w/2,y+36,s,23,900,C.ink,'middle')}`;
const key=(x,y,s,w=110,fill=C.ink)=>`${rect(x+7,y+7,w,68,C.blue,12)}${rect(x,y,w,68,fill,12,C.ink,4)}${text(x+w/2,y+47,s,31,900,C.white,'middle')}`;
const pin=(x,y,w,h,title,items,fill=C.orange)=>{let s=`<g>${shadow(x,y,w,h,C.white,16)}${rect(x,y,w,68,fill,14,C.ink,4)}${text(x+24,y+45,'●  PINNED / 置顶贴图',22,900,C.white)}${text(x+26,y+120,title,30,900,C.ink)}`;items.forEach((v,i)=>s+=`${rect(x+26,y+155+i*52,12,12,fill,2)}${text(x+52,y+168+i*52,v,24,750,C.ink)}`);return s+'</g>';};

const pages=[];

pages.push(['01-cover.png',base(1,`
${label(60,145,'SNIPASTE',C.lime,190)}
${text(60,290,'截图还能',102,900,C.ink)}
${text(60,405,'钉在屏幕上？',102,900,C.blue)}
${rect(60,460,850,76,C.orange,8,C.ink,4)}${text(485,512,'截图 → 贴图，少切窗口',36,900,C.white,'middle')}
${shadow(80,635,760,570,C.white,20)}${rect(80,635,760,72,C.ink,18)}${dot(115,671,8,C.orange)}${dot(145,671,8,C.lime)}${text(178,680,'正在填写活动清单',24,800,C.white)}
${text(130,790,'活动日期：__________',29,700,C.ink)}${text(130,860,'报名截止：__________',29,700,C.ink)}${text(130,930,'目标人数：__________',29,700,C.ink)}
${tape(725,590,260,C.pink,7)}${pin(690,720,420,360,'关键资料',['10 月 12 日','10 月 8 日 18:00','目标 80 人'],C.orange)}
${text(60,1330,'截图只是开始',34,900,C.muted)}${text(60,1390,'贴图才是差异点 →',48,900,C.ink)}
`)]);

pages.push(['02-problem.png',base(2,`
${label(60,145,'痛点不是截图',C.pink,250)}
${text(60,285,'你是不是还在',84,900,C.ink)}${text(60,380,'来回切窗口？',84,900,C.orange)}
${zig(95,505,'01','看资料',C.lime)}${zig(640,505,'02','切到文档',C.cyan)}${zig(95,760,'03','忘了一处',C.pink)}${zig(640,760,'04','再切回去',C.orange)}
<path d="M 510 620 L 655 620 M 870 720 L 870 770 M 635 875 L 515 875 M 305 760 L 305 700" fill="none" stroke="${C.ink}" stroke-width="8" stroke-dasharray="14 10"/>
${rect(70,1100,1060,240,C.ink,20)}${text(115,1170,'普通截图',28,900,C.lime)}${text(115,1228,'只是把内容“留下来”',40,900,C.white)}${text(115,1298,'贴回屏幕，才方便“边看边做”',40,900,C.orange)}
${tape(760,1055,300,C.lime,-5)}
`)]);
function zig(x,y,n,s,fill){return `<g>${shadow(x,y,470,180,C.white,16,9)}${rect(x+28,y+28,76,76,fill,8,C.ink,4)}${text(x+66,y+79,n,25,900,C.ink,'middle')}${text(x+135,y+82,s,38,900,C.ink)}${text(x+135,y+128,n==='04'?'重复找窗口':'工作被打断',23,700,C.muted)}</g>`;}

pages.push(['03-flow.png',base(3,`
${label(60,145,'一条流程就够',C.lime,245)}
${text(60,285,'F1 截图  →  F3 贴图',78,900,C.ink)}${text(60,350,'本机 Snipaste 2.11.3 已人工确认',26,800,C.muted)}
${step(70,485,'1','F1','开始截图','出现截图选区',C.blue)}
${step(620,485,'2','框选','留下关键区域','不截整个页面',C.orange)}
${step(70,810,'3','F3','贴到屏幕','生成置顶参考卡',C.orange)}
${step(620,810,'4','关闭','用完收起','桌面恢复整洁',C.blue)}
${rect(90,1245,1020,118,C.lime,12,C.ink,4)}${text(600,1295,'默认快捷键可以在设置中调整',29,900,C.ink,'middle')}${text(600,1338,'若冲突，先检查其他软件是否占用',23,750,C.ink,'middle')}
`)]);
function step(x,y,n,k,title,sub,accent){return `<g>${shadow(x,y,500,250,C.white,18,10)}${rect(x+28,y+28,64,64,accent,8,C.ink,4)}${text(x+60,y+72,n,25,900,C.white,'middle')}${key(x+120,y+25,k,k.length>3?145:100)}${text(x+30,y+150,title,35,900,C.ink)}${text(x+30,y+198,sub,25,700,C.muted)}</g>`;}

pages.push(['04-writing.png',base(4,`
${label(60,145,'场景 01',C.cyan,170)}
${text(60,285,'边看资料',78,900,C.ink)}${text(60,375,'边写文档',78,900,C.blue)}
${rect(60,430,430,86,C.pink,10,C.ink,4)}${text(275,485,'以前：网页 ↔ 文档',27,900,C.ink,'middle')}
${rect(530,430,610,86,C.lime,10,C.ink,4)}${text(835,485,'现在：关键段贴在编辑区旁',27,900,C.ink,'middle')}
${shadow(70,610,1020,560,C.white,20)}${rect(70,610,1020,68,C.ink,18)}${text(110,654,'秋季阅读活动｜文案草稿',24,850,C.white)}
${text(115,765,'和喜欢阅读的人一起交换一本好书。',27,750,C.ink)}${text(115,850,'活动日期：',27,750,C.ink)}${rect(280,812,300,58,C.bg,8,C.ink,3)}${text(115,930,'报名截止：',27,750,C.ink)}${rect(280,892,300,58,C.bg,8,C.ink,3)}
${tape(755,680,260,C.lime,-6)}${pin(680,755,360,330,'资料摘录',['10 月 12 日','截止 10 月 8 日','正文 ≤ 180 字'],C.orange)}
${rect(60,1275,330,60,C.cyan,8,C.ink,3)}${text(225,1317,'场景演示｜虚构材料',23,900,C.ink,'middle')}
`)]);

pages.push(['05-table.png',base(5,`
${label(60,145,'场景 02',C.pink,170)}
${text(60,285,'对照需求',78,900,C.ink)}${text(60,375,'逐项填表',78,900,C.orange)}
${shadow(65,475,1070,650,C.white,20)}${rect(95,530,700,74,C.ink,8)}${text(130,580,'字段',24,900,C.white)}${text(350,580,'填写内容',24,900,C.white)}${text(650,580,'状态',24,900,C.white)}
${row(95,615,'活动日期','10 月 12 日','✓')}${row(95,720,'报名截止','10 月 8 日 18:00','✓')}${row(95,825,'目标人数','80 人','✓')}${row(95,930,'场地确认','周三前','…')}
${pin(790,610,300,360,'需求摘要',['10 月 12 日','18:00 截止','80 人','周三前'],C.blue)}
${rect(95,1025,995,62,C.pink,7,C.ink,3)}${text(592,1068,'截图前先删除姓名、账号、客户和未公开信息',22,900,C.ink,'middle')}
${rect(60,1255,330,60,C.cyan,8,C.ink,3)}${text(225,1297,'场景演示｜虚构材料',23,900,C.ink,'middle')}
`)]);
function row(x,y,a,b,c){return `${line(x,y,x+700,y,C.gray,3)}${text(x+25,y+70,a,24,800,C.ink)}${text(x+255,y+70,b,24,800,C.ink)}${rect(x+545,y+28,110,52,c==='✓'?C.lime:C.pink,8,C.ink,3)}${text(x+600,y+65,c,24,900,C.ink,'middle')}`;}

pages.push(['06-more.png',base(6,`
${label(60,145,'官网补充功能',C.lime,250)}
${text(60,285,'还可以继续试这 3 个',70,900,C.ink)}${text(60,350,'本页均按官网说明整理｜本机未逐项验证',27,900,C.orange)}
${ticket(65,470,'01','短文本贴图','复制文字 → F3','临时对照一句日期或任务要求',C.lime,'官网说明')}
${ticket(65,745,'02','调透明度','Ctrl + 鼠标滚轮','贴图挡住内容时减少遮挡',C.cyan,'官网说明')}
${ticket(65,1020,'03','鼠标穿透','先在设置中配置快捷键','保留贴图，同时点击下方窗口',C.pink,'官网说明')}
${rect(65,1330,1070,58,C.ink,8)}${text(600,1370,'入口可能随版本和设置变化，请以当前软件为准',23,850,C.white,'middle')}
`)]);
function ticket(x,y,n,title,act,sub,fill,tag){return `<g>${shadow(x,y,1070,220,C.white,16,9)}${rect(x+25,y+28,95,95,fill,10,C.ink,4)}${text(x+72,y+90,n,27,900,C.ink,'middle')}${text(x+155,y+70,title,34,900,C.ink)}${text(x+155,y+118,act,26,900,C.blue)}${text(x+155,y+168,sub,23,700,C.muted)}${rect(x+780,y+60,245,90,fill,10,C.ink,4)}${text(x+902,y+116,tag,27,900,C.ink,'middle')}</g>`;}

pages.push(['07-license.png',base(7,`
${label(60,145,'版本与授权',C.pink,225)}
${text(60,285,'免费能力够不够用？',76,900,C.ink)}${text(60,350,'功能差异和使用许可，要分开看',27,800,C.muted)}
${shadow(60,455,515,640,C.white,18)}${rect(60,455,515,88,C.lime,16,C.ink,4)}${text(317,512,'免费基础能力',34,900,C.ink,'middle')}
${bullet(105,625,'截图、贴图、剪贴板转浮窗',C.blue)}${bullet(105,710,'缩放、旋转、透明度、穿透',C.blue)}${bullet(105,795,'常用标注、马赛克与模糊',C.blue)}
${rect(100,920,435,120,C.lime,10,C.ink,4)}${text(317,970,'个人只用截图＋贴图',25,900,C.ink,'middle')}${text(317,1010,'可以先用基础能力',28,900,C.ink,'middle')}
${shadow(625,455,515,640,C.white,18)}${rect(625,455,515,88,C.blue,16,C.ink,4)}${text(882,512,'专业版代表能力',34,900,C.white,'middle')}
${bullet(670,625,'OCR／文字识别',C.orange)}${bullet(670,710,'自定义部分应用内快捷键',C.orange)}${bullet(670,795,'批量导出所选贴图',C.orange)}
${rect(665,855,435,48,C.orange,8,C.ink,3)}${text(882,888,'官网文档｜专业版未亲测',21,900,C.ink,'middle')}
${rect(665,920,435,120,C.cyan,10,C.ink,4)}${text(882,970,'需要高级能力或商业授权',24,900,C.ink,'middle')}${text(882,1010,'再看官方说明升级',28,900,C.ink,'middle')}
${rect(60,1180,1080,190,C.ink,16)}${text(100,1235,'授权边界',26,900,C.lime)}${text(100,1290,'Snipaste 2.x：个人、非商业用途免费',31,900,C.white)}${text(100,1340,'商业／公司场景：需要专业版许可',31,900,C.orange)}
${text(60,1430,'功能入口可能随版本与平台变化｜授权以官网协议为准',22,800,C.muted)}
`)]);
function bullet(x,y,s,fill){return `${rect(x,y-28,22,22,fill,4,C.ink,3)}${text(x+42,y,s,24,800,C.ink)}`;}

pages.push(['08-takeaway.png',base(8,`
${label(60,145,'收藏这一页',C.lime,220)}
${text(60,285,'只记住两个键',82,900,C.ink)}
${rect(80,355,450,58,C.orange,8,C.ink,3)}${text(305,395,'前提：先启动 Snipaste',24,900,C.white,'middle')}
${shadow(80,430,440,300,C.white,20)}${key(140,505,'F1',145,C.ink)}${text(140,625,'截图',50,900,C.ink)}${text(140,675,'截下要对照的部分',24,750,C.muted)}
${text(600,605,'+',86,900,C.orange,'middle')}
${shadow(680,430,440,300,C.white,20)}${key(740,505,'F3',145,C.ink)}${text(740,625,'贴图',50,900,C.ink)}${text(740,675,'放在工作窗口旁',24,750,C.muted)}
${rect(80,850,1040,250,C.blue,20,C.ink,5)}${text(600,925,'真正的优势',28,900,C.lime,'middle')}${text(600,995,'不是多截一张图',46,900,C.white,'middle')}${text(600,1055,'而是少切几次窗口',46,900,C.orange,'middle')}
${tape(170,800,270,C.pink,-5)}${tape(770,795,260,C.lime,6)}
${rect(110,1225,980,105,C.lime,12,C.ink,4)}${text(600,1292,'你最想把哪种内容钉在屏幕上对照？',29,900,C.ink,'middle')}
`)]);

async function run(){const comps=[];for(const [name,svg] of pages){const buf=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(path.join(OUT,name),buf);const small=await sharp(buf).resize(360,480,{fit:'fill'}).png().toBuffer();fs.writeFileSync(path.join(PRE,name),small);const i=comps.length;comps.push({input:small,left:(i%4)*380,top:Math.floor(i/4)*500});}const sheet=await sharp({create:{width:1500,height:1000,channels:4,background:'#d9d8d1'}}).composite(comps).png().toBuffer();fs.writeFileSync(path.join(PRE,'contact-sheet.png'),sheet);}
run().catch(e=>{console.error(e);process.exit(1)});
