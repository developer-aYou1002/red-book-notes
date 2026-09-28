const fs=require('fs');
const path=require('path');
const sharp=require('sharp');

const W=1200,H=1600,ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'images-v1'),PRE=path.join(ROOT,'preview-v1');
fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(PRE,{recursive:true});

const C={bg:'#eeeee9',paper:'#fffdf8',ink:'#202522',muted:'#69706b',blue:'#3974e8',mint:'#78d9b0',orange:'#ff8b42',yellow:'#ffd76a',line:'#c8ccc7',dark:'#27302c',red:'#e5564a'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rect=(x,y,w,h,fill,rx=0,stroke='none',sw=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text=(x,y,s,size=32,weight=700,fill=C.ink,anchor='start')=>`<text x="${x}" y="${y}" font-family="Microsoft YaHei,Noto Sans SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color=C.line,sw=3,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const shadow=(x,y,w,h,fill=C.paper,rx=18)=>`${rect(x+10,y+10,w,h,'#bbc0bb',rx)}${rect(x,y,w,h,fill,rx,C.ink,4)}`;
const chip=(x,y,s,fill=C.mint,w=220)=>`${rect(x,y,w,52,fill,8,C.ink,3)}${text(x+w/2,y+36,s,22,900,C.ink,'middle')}`;
const check=(x,y,fill=C.mint)=>`${rect(x,y,34,34,fill,7,C.ink,3)}<path d="M ${x+8} ${y+17} l 7 8 l 13 -16" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const warn=(x,y)=>`${rect(x,y,36,36,C.orange,18,C.ink,3)}${text(x+18,y+27,'!',23,900,C.ink,'middle')}`;

function base(n,body){return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#202522" stroke-width="1" opacity=".045"/></pattern></defs>
${rect(0,0,W,H,C.bg)}${rect(0,0,W,H,'url(#grid)')}
${rect(0,0,34,H,C.dark)}${rect(55,48,340,52,C.dark,8)}${text(225,83,'效率研究所  /  SYSTEM CARE',21,850,C.paper,'middle')}
${rect(1035,48,110,56,n%2?C.blue:C.orange,8,C.ink,3)}${text(1090,86,String(n).padStart(2,'0'),27,900,C.paper,'middle')}
${body}
${line(60,1490,1140,1490,C.ink,3)}${text(60,1536,'GEEK UNINSTALLER · 安全卸载检查单',22,800,C.muted)}${text(1140,1536,`${n} / 8`,22,900,C.ink,'end')}
</svg>`;}

const step=(x,y,n,title,sub,fill=C.blue)=>`${shadow(x,y,510,170)}${rect(x+24,y+27,70,70,fill,12,C.ink,3)}${text(x+59,y+76,n,26,900,C.paper,'middle')}${text(x+125,y+66,title,31,900,C.ink)}${text(x+125,y+112,sub,22,700,C.muted)}`;
const bullet=(x,y,s,fill=C.mint)=>`${check(x,y-27,fill)}${text(x+56,y,s,25,800,C.ink)}`;
const riskBullet=(x,y,s)=>`${warn(x,y-29)}${text(x+56,y,s,24,800,C.ink)}`;

const pages=[];

pages.push(['01-cover.png',base(1,`
${chip(60,150,'GEEK UNINSTALLER',C.mint,265)}
${text(60,315,'卸载完，',96,900,C.ink)}${text(60,430,'再检查一次',106,900,C.blue)}
${rect(60,490,820,76,C.orange,10,C.ink,4)}${text(470,542,'残留检查流程｜先卸载，再确认',34,900,C.paper,'middle')}
${shadow(80,680,1030,470)}${rect(80,680,1030,68,C.dark,16)}${text(120,725,'SOFTWARE REMOVAL CHECKLIST',24,900,C.paper)}
${check(130,805,C.mint)}${text(190,833,'01  核对目标软件',32,900,C.ink)}${line(190,858,1010,858,C.line,3)}
${check(130,900,C.blue)}${text(190,928,'02  优先正常卸载',32,900,C.ink)}${line(190,953,1010,953,C.line,3)}
${check(130,995,C.orange)}${text(190,1023,'03  查看残留再决定',32,900,C.ink)}
${rect(90,1250,740,95,C.yellow,12,C.ink,3)}${text(460,1310,'不承诺零残留，也不盲删',31,900,C.ink,'middle')}
`) ]);

pages.push(['02-why.png',base(2,`
${chip(60,150,'为什么还要检查',C.yellow,250)}
${text(60,295,'点了卸载',80,900,C.ink)}${text(60,385,'不等于不用再看',80,900,C.orange)}
${step(70,500,'1','找到软件','准备移除',C.blue)}${step(620,500,'2','点击卸载','原卸载器运行',C.blue)}
${step(70,730,'3','卸载结束','主体已经移除',C.mint)}${step(620,730,'4','再看一眼','检查可能的痕迹',C.orange)}
${rect(75,1035,1050,230,C.dark,18)}${text(120,1100,'Geek 的价值',27,900,C.mint)}${text(120,1160,'不是保证“零残留”',40,900,C.paper)}${text(120,1220,'而是把后续检查接到同一条流程里',34,900,C.orange)}
${text(75,1350,'文件夹、配置或注册表痕迹：先确认归属，再决定是否清理。',25,750,C.muted)}
`) ]);

pages.push(['03-download.png',base(3,`
${chip(60,150,'官方下载',C.mint,190)}
${text(60,295,'先认准官网',82,900,C.ink)}${text(60,380,'再拿便携版',82,900,C.blue)}
${shadow(70,470,1060,250)}${text(115,535,'geekuninstaller.com',44,900,C.blue)}${rect(115,575,650,12,C.mint,6)}${text(115,645,'免费版当前提供 ZIP / 7Z',29,850,C.ink)}${text(115,688,'解压后运行，不经过传统安装向导',25,750,C.muted)}
${bullet(90,840,'当前官网版本：1.5.5.185（2026-09-22）',C.blue)}
${bullet(90,930,'官网注明：运行需要管理员权限',C.orange)}
${bullet(90,1020,'Windows 11 / 10 / 7 / 8 / 8.1',C.mint)}
${rect(80,1145,1040,180,C.yellow,16,C.ink,3)}${text(600,1210,'版本会变化',30,900,C.ink,'middle')}${text(600,1260,'下载时以官网当前页面为准',34,900,C.ink,'middle')}
${text(60,1400,'官网资料整理｜本轮未重新下载或运行',23,800,C.muted)}
`) ]);

pages.push(['04-normal.png',base(4,`
${chip(60,150,'正确顺序',C.blue,185)}
${text(60,295,'先正常卸载',84,900,C.ink)}${text(60,380,'再检查残留',84,900,C.mint)}
${step(70,500,'1','搜索目标','先核对名称与发布者',C.blue)}${step(620,500,'2','正常卸载','优先调用原卸载程序',C.blue)}
${step(70,730,'3','等待结束','不要中途强关',C.mint)}${step(620,730,'4','检查残留','看到结果再判断',C.orange)}
${rect(80,1035,1040,170,C.mint,16,C.ink,4)}${text(600,1095,'用户已人工确认',28,900,C.ink,'middle')}${text(600,1148,'Geek 可卸载软件，并在卸载后检查残留',31,900,C.ink,'middle')}
${rect(80,1260,1040,90,C.dark,12)}${text(600,1318,'流程示意｜非软件截图｜本轮未重新执行卸载',25,850,C.paper,'middle')}
`) ]);

pages.push(['05-leftovers.png',base(5,`
${chip(60,150,'看到残留后',C.orange,215)}
${text(60,295,'先看三件事',82,900,C.ink)}${text(60,380,'再决定删不删',82,900,C.orange)}
${shadow(70,485,1060,560)}
${check(115,555,C.mint)}${text(175,585,'名称',30,900,C.ink)}${text(335,585,'是否明确对应目标软件？',27,750,C.muted)}${line(115,625,1080,625,C.line,3)}
${check(115,690,C.blue)}${text(175,720,'路径',30,900,C.ink)}${text(335,720,'是否属于它自己的目录？',27,750,C.muted)}${line(115,760,1080,760,C.line,3)}
${check(115,825,C.orange)}${text(175,855,'关联',30,900,C.ink)}${text(335,855,'是否位于共享目录或关联其他程序？',26,750,C.muted)}
${rect(105,925,990,80,C.yellow,10,C.ink,3)}${text(600,977,'看不懂的路径或注册表项，先保留',29,900,C.ink,'middle')}
${rect(80,1135,1040,160,C.dark,16)}${text(600,1195,'用户已人工确认：可以检查并清理残留',28,900,C.paper,'middle')}${text(600,1245,'本篇不展示具体扫描数量或路径',25,800,C.orange,'middle')}
`) ]);

pages.push(['06-force.png',base(6,`
${chip(60,150,'异常路径',C.orange,175)}
${text(60,295,'正常卸载打不开',76,900,C.ink)}${text(60,380,'再考虑强制移除',76,900,C.orange)}
${shadow(70,485,1060,260)}${text(115,550,'官网定位',27,900,C.blue)}${riskBullet(115,620,'顽固程序')}${riskBullet(520,620,'卸载项损坏的程序')}
${rect(75,825,1050,360,C.paper,18,C.ink,4)}${text(115,890,'这些对象不要随便处理',31,900,C.ink)}
${riskBullet(115,965,'驱动 / 安全软件')}${riskBullet(590,965,'数据库 / 系统组件')}${riskBullet(115,1060,'工作环境核心组件')}${riskBullet(590,1060,'不了解来源的条目')}
${rect(80,1260,1040,90,C.dark,12)}${text(600,1318,'官网功能说明｜本轮未执行强制移除',25,850,C.paper,'middle')}
`) ]);

pages.push(['07-boundary.png',base(7,`
${chip(60,150,'版本与边界',C.yellow,210)}
${text(60,285,'免费版、Pro',70,900,C.ink)}${text(60,365,'还有“捆绑”怎么判断',66,900,C.blue)}
${shadow(60,450,515,500)}${rect(60,450,515,76,C.mint,14,C.ink,4)}${text(318,500,'免费版',31,900,C.ink,'middle')}
${bullet(95,610,'仅限个人使用，无支持',C.mint)}${bullet(95,700,'卸载＋残留扫描',C.mint)}${bullet(95,790,'强制移除＋Store 应用',C.mint)}${bullet(95,880,'即时搜索＋便携运行',C.mint)}
${shadow(625,450,515,500)}${rect(625,450,515,76,C.blue,14,C.ink,4)}${text(883,500,'Pro = Uninstall Tool',28,900,C.paper,'middle')}
${bullet(660,610,'实时安装监控',C.blue)}${bullet(660,700,'启动项管理',C.blue)}${bullet(660,790,'批量移除',C.blue)}${bullet(660,880,'技术支持等',C.blue)}
${rect(70,1040,1060,255,C.dark,18)}${text(115,1100,'捆绑边界',27,900,C.yellow)}${text(115,1160,'“最近安装 / 修改”颜色只是排查线索',31,900,C.paper)}${text(115,1220,'不能证明两个软件存在捆绑关系',34,900,C.orange)}
${text(60,1390,'根据官网整理｜Pro 未亲测｜不展示易变化的价格',23,800,C.muted)}
`) ]);

pages.push(['08-checklist.png',base(8,`
${chip(60,150,'收藏检查单',C.mint,210)}
${text(60,295,'安全卸载',86,900,C.ink)}${text(60,385,'按这个顺序',86,900,C.blue)}
${shadow(75,480,1050,590)}
${check(120,545,C.blue)}${text(180,575,'01  核对目标软件',31,900,C.ink)}${line(180,610,1050,610,C.line,3)}
${check(120,650,C.blue)}${text(180,680,'02  优先正常卸载',31,900,C.ink)}${line(180,715,1050,715,C.line,3)}
${check(120,755,C.mint)}${text(180,785,'03  查看残留名称和路径',31,900,C.ink)}${line(180,820,1050,820,C.line,3)}
${check(120,860,C.orange)}${text(180,890,'04  不懂的条目先不删',31,900,C.ink)}${line(180,925,1050,925,C.line,3)}
${check(120,965,C.orange)}${text(180,995,'05  卸载失效才考虑强制移除',30,900,C.ink)}
${rect(80,1160,1040,170,C.dark,18)}${text(600,1220,'工具负责集中线索',31,900,C.mint,'middle')}${text(600,1275,'最后的删除判断仍要自己做',36,900,C.paper,'middle')}
${text(600,1400,'你更常遇到残留文件夹，还是卸载项打不开？',25,850,C.muted,'middle')}
`) ]);

async function run(){
  const comps=[];
  for(const [name,svg] of pages){
    const buf=await sharp(Buffer.from(svg)).png().toBuffer();
    fs.writeFileSync(path.join(OUT,name),buf);
    const small=await sharp(buf).resize(360,480,{fit:'fill'}).png().toBuffer();
    fs.writeFileSync(path.join(PRE,name),small);
    const i=comps.length;
    comps.push({input:small,left:(i%4)*380,top:Math.floor(i/4)*500});
  }
  const sheet=await sharp({create:{width:1500,height:1000,channels:4,background:'#d4d7d3'}}).composite(comps).png().toBuffer();
  fs.writeFileSync(path.join(PRE,'contact-sheet.png'),sheet);
}

run().catch(e=>{console.error(e);process.exit(1)});
