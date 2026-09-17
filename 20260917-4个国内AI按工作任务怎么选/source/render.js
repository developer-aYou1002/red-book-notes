const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 1200, H = 1600;
const out = path.resolve(__dirname, '..', 'images-v1');
fs.mkdirSync(out, { recursive: true });
const c = { ink:'#193226', green:'#197653', pale:'#e7f3e9', cream:'#f8fbf5', orange:'#c96f22', paleOrange:'#fff0dd', muted:'#52665a', line:'#cfdfd3', white:'#ffffff', gray:'#f3f6f3' };
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rect = (x,y,w,h,fill=c.white,rx=30,stroke='none',sw=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const txt = (x,y,s,size=42,weight=700,color=c.ink,anchor='start') => `<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
const lines = (x,y,arr,size=42,gap=65,weight=700,color=c.ink) => arr.map((s,i)=>txt(x,y+i*gap,s,size,weight,color)).join('');
const rule = y => `<line x1="92" y1="${y}" x2="1108" y2="${y}" stroke="${c.line}" stroke-width="3"/>`;
const badge = (label,w=600) => rect(92,90,w,78,c.pale,39)+txt(124,143,label,32,800,c.green);
const box = (x,y,w,h,fill=c.white) => rect(x,y,w,h,fill,36);
function page(n,body) {return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fcfdf9"/><stop offset="1" stop-color="#edf6ee"/></linearGradient></defs>${rect(0,0,W,H,'url(#bg)',0)}<circle cx="1100" cy="90" r="250" fill="#dcefe0" opacity=".7"/>${body}${rule(1465)}${txt(92,1520,'效率研究所',29,700,c.muted)}${txt(1108,1520,`${String(n).padStart(2,'0')} / 07`,29,700,c.muted,'end')}</svg>`;}
function status(y,text) {return `${rect(92,y,1016,78,c.paleOrange,24)}${txt(125,y+51,text,31,800,c.orange)}`;}
function taskPage(n,label,title,task,taskLines,tryLines,checkLines,state) {
 return page(n,`${badge(label,760)}${lines(92,300,title,76,100,850)}${box(92,440,1016,360)}${txt(135,515,'虚构任务输入',36,850,c.green)}${lines(135,590,taskLines,40,61,700)}${box(92,830,1016,290,c.pale)}${txt(135,905,'可以先试',36,850,c.green)}${lines(135,985,tryLines,44,67,800)}${box(92,1150,1016,200)}${txt(135,1205,'交付前要核对',36,850,c.orange)}${lines(135,1265,checkLines,37,55,700)}${status(1370,state)}`);
}
const pages = [
['01-cover.png',page(1,`${badge('效率研究所 · 任务选择卡',650)}${txt(92,400,'国内 AI 太多，',78,850)}${txt(92,505,'工作里先用哪个？',78,850)}${txt(92,705,'4 个国内 AI',108,900,c.green)}${txt(92,835,'按任务先试谁？',83,900,c.ink)}${box(92,960,1016,300)}${lines(145,1050,['短文改写   ·   给定资料提炼','汇报初稿   ·   复杂问题拆解'],45,105,800)}${txt(92,1370,'先选任务，再核对结果。',43,700,c.muted)}`)],
['02-map.png',page(2,`${badge('不是性能排名，也不是唯一答案',760)}${txt(92,305,'要做什么？先试谁？',76,850)}${box(92,405,1016,860)}${rect(130,450,940,165,c.pale,24)}${txt(170,515,'短文改写',48,850)}${txt(1000,515,'豆包',55,850,c.green,'end')}${txt(170,575,'把几句话说清楚',36,650,c.muted)}${rect(130,655,940,165,c.gray,24)}${txt(170,720,'给定资料提炼',48,850)}${txt(1000,720,'Kimi',55,850,c.green,'end')}${txt(170,780,'从材料里摘要点',36,650,c.muted)}${rect(130,860,940,165,c.pale,24)}${txt(170,925,'汇报初稿',48,850)}${txt(1000,925,'千问 App',52,850,c.green,'end')}${txt(170,985,'把要点排成 PPT',36,650,c.muted)}${rect(130,1065,940,165,c.gray,24)}${txt(170,1130,'复杂问题拆解',48,850)}${txt(1000,1130,'DeepSeek',52,850,c.green,'end')}${txt(170,1190,'先拆步骤、风险与待确认',35,650,c.muted)}${txt(92,1380,'以下是任务示意，尚无四款生成结果。',34,700,c.orange)}`)],
['03-doubao.png',taskPage(3,'豆包 · 短文改写',['把群通知','改清楚'],'群通知',['周五 15:00，二楼会议室','开产品分享会；提前 10 分钟到。'],['把口语化信息整理成','自然、简洁的群消息。'],['时间地点是否准确？','有无增加原文没有的承诺？'],'任务流程示意｜非实测界面；本轮未取得输出')],
['04-kimi.png',taskPage(4,'Kimi · 给定资料提炼',['从材料里','抓要点'],'培训记录',['周四 18:00 报名截止；','周五 15:00 线上培训；预算待定。'],['按“关键信息／待办／','待确认”提炼给定材料。'],['截止时间和数字是否准确？','预算待定有没有被误写为已定？'],'任务流程示意｜非实测界面；本轮未取得输出')],
['05-qianwen.png',taskPage(5,'千问 App · 汇报初稿',['要点变成','汇报结构'],'项目要点',['新人培训：目录与讲义初版已完成；','下周试讲；预算仍待确认。'],['官网可见“PPT 创作”入口；','可先尝试整理汇报初稿。'],['事实、逻辑、版式能否交付？','能否继续修改？尚未实测。'],'任务流程示意｜非实测界面；未生成 PPT')],
['06-deepseek.png',taskPage(6,'DeepSeek · 问题拆解',['复杂任务','先拆开'],'培训准备',['还有 3 天，要准备一场','40 分钟内部培训；信息不完整。'],['先列每天任务、风险、','需要补问的关键信息。'],['是否擅自假设讲师或预算？','推理不能代替事实调查。'],'任务流程示意｜非实测界面；本轮未取得输出')],
['07-checklist.png',page(7,`${badge('收藏：按任务选，再人工核对',760)}${txt(92,305,'4 类任务，一张选择卡',73,850)}${box(92,400,1016,870)}${rect(130,450,940,180,c.pale,24)}${txt(165,515,'改短文 → 豆包',49,850,c.green)}${txt(165,585,'核对原意、时间和承诺',37,700)}${rect(130,650,940,180,c.gray,24)}${txt(165,715,'提资料 → Kimi',49,850,c.green)}${txt(165,785,'回原文核对遗漏和数字',37,700)}${rect(130,850,940,180,c.pale,24)}${txt(165,915,'做汇报 → 千问 App',49,850,c.green)}${txt(165,985,'核对事实、版式与可编辑性',37,700)}${rect(130,1050,940,180,c.gray,24)}${txt(165,1115,'拆问题 → DeepSeek',49,850,c.green)}${txt(165,1185,'核对前提，别把推理当证据',37,700)}${txt(92,1385,'这不是唯一答案；本轮未比较输出效果。',34,700,c.orange)}`)]
];
Promise.all(pages.map(async ([name,svg])=>sharp(Buffer.from(svg)).png({compressionLevel:9}).toFile(path.join(out,name)))).then(()=>console.log(`已生成 ${pages.length} 张图片：${out}`)).catch(e=>{console.error(e);process.exitCode=1;});
