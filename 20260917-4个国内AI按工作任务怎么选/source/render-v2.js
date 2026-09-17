const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200, H = 1600;
const v3Qianwen = process.argv.includes('--v3-qianwen');
const out = path.resolve(__dirname, '..', v3Qianwen ? 'images-v3' : 'images-v2');
const previews = path.resolve(__dirname, '..', v3Qianwen ? 'preview-v3' : 'preview-v2');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(previews, { recursive: true });
const c = { ink:'#193226', green:'#197653', pale:'#e7f3e9', orange:'#bf6a22', paleOrange:'#fff0dd', muted:'#52665a', line:'#cfdfd3', white:'#ffffff', gray:'#f3f6f3' };
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const r = (x,y,w,h,fill=c.white,rx=30) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const t = (x,y,s,size=42,weight=700,color=c.ink,anchor='start') => `<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
const ls = (x,y,a,size=42,gap=58,weight=700,color=c.ink) => a.map((s,i)=>t(x,y+i*gap,s,size,weight,color)).join('');
const badge = s => r(92,90,850,74,c.pale,37)+t(125,140,s,31,800,c.green);
function page(n,body) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fcfdf9"/><stop offset="1" stop-color="#edf6ee"/></linearGradient></defs>${r(0,0,W,H,'url(#bg)',0)}<circle cx="1100" cy="92" r="245" fill="#dcefe0" opacity=".7"/>${body}<line x1="92" y1="1465" x2="1108" y2="1465" stroke="${c.line}" stroke-width="3"/>${t(92,1520,'效率研究所',29,700,c.muted)}${t(1108,1520,`${String(n).padStart(2,'0')} / 07`,29,700,c.muted,'end')}</svg>`; }
function evidencePage(n,product,title,input,output,benefit,limit,resultLabel='本次输出摘录｜2026.09.17',footer='真实文本摘录重新排版｜非产品界面截图') {
 return page(n,`${badge(`${product} · 单次虚构任务测试`)}${t(92,300,title,75,850)}${r(92,370,1016,230)}${t(135,435,'输入要点摘要｜虚构',34,800,c.green)}${ls(135,505,input,37,54,700)}${r(92,630,1016,355,c.pale)}${t(135,695,resultLabel,34,800,c.green)}${ls(135,770,output,42,62,800)}${r(92,1015,1016,145)}${t(135,1070,'省在哪一步',35,800,c.green)}${ls(135,1130,benefit,37,52,700)}${r(92,1190,1016,175,c.paleOrange)}${t(135,1245,'还要自己改／核对',35,800,c.orange)}${ls(135,1305,limit,37,50,700)}${t(92,1420,footer,30,650,c.muted)}`);
}
const pages = [
['01-cover.png',page(1,`${badge('效率研究所 · 工作任务选择卡')}${t(92,420,'4 个国内 AI',105,900,c.green)}${t(92,560,'按任务怎么选？',88,900)}${r(92,710,1016,415)}${ls(150,815,['改短文  ·  提资料','做汇报  ·  拆问题'],57,130,850)}${t(92,1285,'用四个虚构小任务，看实际结果和核对点',38,700,c.muted)}${t(92,1380,'单次试用，不是综合排名',35,750,c.orange)}`)],
['02-map.png',page(2,`${badge('四个任务，四个可先试的入口')}${t(92,305,'先想交付什么',79,850)}${r(92,405,1016,850)}${r(135,455,930,155,c.pale,24)}${t(170,515,'短文改写',47,800)}${t(1030,515,'豆包',52,850,c.green,'end')}${t(170,575,'保留原意，再调语气',35,700,c.muted)}${r(135,655,930,155,c.gray,24)}${t(170,715,'给定资料提炼',47,800)}${t(1030,715,'Kimi',52,850,c.green,'end')}${t(170,775,'待办别混入推导动作',35,700,c.muted)}${r(135,855,930,155,c.pale,24)}${t(170,915,'汇报初稿',47,800)}${t(1030,915,'千问 App',50,850,c.green,'end')}${t(170,975,'生成后逐条核对事实',35,700,c.muted)}${r(135,1055,930,155,c.gray,24)}${t(170,1115,'复杂问题拆解',47,800)}${t(1030,1115,'DeepSeek',50,850,c.green,'end')}${t(170,1175,'检查未经确认的前提',35,700,c.muted)}${t(92,1380,'只是单次小样本，不排他、不排名。',36,700,c.orange)}`)],
['03-doubao.png',evidencePage(3,'豆包','短通知，先改清楚',['周五 15:00，二楼会议室开分享会；','参会者提前 10 分钟到，有问题发群里。'],['周五下午 3 点，二楼会议室','召开产品分享会。参会人员请','提前十分钟到场，有问题可先发在群内。'],['要素整合成一条可修改的群消息。'],['“召开／到场”偏正式；群聊可调口吻。'])],
['04-kimi.png',evidencePage(4,'Kimi','材料提炼，查来源',['周四 18:00 报名截止；','周五 15:00 培训；预算待定。'],['关键信息：报名截止周四 18:00','待办：确保周四 18:00 报名截止','待确认：培训预算尚未确认'],['按信息／待办／待确认分组。'],['“确保截止”是推导动作，非原文待办。'])],
['05-qianwen.png',evidencePage(5,'千问 App','要点变汇报初稿',['20 人一周内熟悉流程；要求 4 页。','已完成目录与讲义初版；预算待定。'],['下周工作计划：实战检验与迭代','周三前组织面向3名种子用户','的内部试讲'],['要点变成 6 页汇报 PPT 初稿。'],['要求 4 页却生成 6 页；3 人无依据。'])],
['06-deepseek.png',evidencePage(6,'DeepSeek','复杂任务先拆开',['还剩 3 天，准备 40 分钟培训；','讲师、预算、人数都未确定。'],['第 1 天：定目标、受众、大纲','第 2 天：做内容、演示、练习','第 3 天：彩排、定稿、发通知'],['按天列任务、交付物、风险与问题。'],['预算未指定，却写成“默认零预算”。'])],
['07-checklist.png',page(7,`${badge('收藏：按任务选，也按证据核对')}${t(92,300,'结果能用，才算省事',78,850)}${r(92,395,1016,840)}${r(135,445,930,175,c.pale,24)}${t(170,510,'改短文 → 豆包',49,850,c.green)}${t(170,575,'核对原意与语气',38,700)}${r(135,645,930,175,c.gray,24)}${t(170,710,'提资料 → Kimi',49,850,c.green)}${t(170,775,'回原文分清事实与推导',38,700)}${r(135,845,930,175,c.pale,24)}${t(170,910,'做汇报 → 千问 App',49,850,c.green)}${t(170,975,'核对事实、数字、可编辑性',38,700)}${r(135,1045,930,175,c.gray,24)}${t(170,1110,'拆问题 → DeepSeek',49,850,c.green)}${t(170,1175,'把未经确认的前提删掉',38,700)}${t(92,1370,'四个单次测试，不代表固定优劣。',36,700,c.orange)}`)]
];
const v3Pages = [[
 '05-qianwen.png',
 evidencePage(5,'千问 App','汇报初稿要核对',
  ['我写明要 4 页内部汇报 PPT；','网页自动附带“1–10 页”。'],
  ['这次生成了 6 页 PPT；','还写出“周三前组织面向','3 名种子用户的内部试讲”'],
  ['项目要点进入汇报结构初稿。'],
  ['本次未达 4 页目标，交付前要压缩；','3 人不是原材料事实，必须删。'],
  '本次可见结果｜2026.09.17',
  '真实测试内容重新排版｜非产品界面截图')
]];
const selectedPages = v3Qianwen ? v3Pages : pages;
Promise.all(selectedPages.map(async ([name,svg])=>{
 const file=path.join(out,name);
 await sharp(Buffer.from(svg)).png({compressionLevel:9}).toFile(file);
 await sharp(file).resize({width:360}).png().toFile(path.join(previews,name));
})).then(()=>console.log(`已生成 ${selectedPages.length} 张 ${v3Qianwen ? '局部 V3' : 'V2'} 图片与手机宽度预览`)).catch(e=>{console.error(e);process.exitCode=1;});
