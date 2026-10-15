import { startServer, launchBrowser } from './lib/browser.mjs';
const S='/tmp/claude-0/-home-claude/49d778a2-8976-5cb7-a469-69161ee3aef3/scratchpad/';
const {server,base}=await startServer('/home/claude/santander-ar/web',8793);
const b=await launchBrowser();
const errs=[];
for (const [name,path,vp,full] of [['idx-m','/index.html',[390,844],true],['idx-d','/index.html',[1280,800],false],['lug-m','/lugar.html?l=chicamocha',[390,844],true],['v3d-bar','/vista3d.html?l=barichara',[390,844],false],['v3d-chi','/vista3d.html?l=chicamocha',[1280,800],false],['v3d-sg','/vista3d.html?l=sangil',[1280,800],false],['bro','/brochure.html',[900,1200],false]]) {
  const p=await b.newPage({viewport:{width:vp[0],height:vp[1]}});
  p.on('console',m=>{if(m.type()==='error')errs.push(name+': '+m.text())}); p.on('pageerror',e=>errs.push(name+' PE: '+e.message));
  await p.goto(base+path); await p.waitForTimeout(name.startsWith('v3d')?2500:800);
  await p.screenshot({path:S+name+'.png',fullPage:full}); await p.close();
}
console.log(errs.join('\n')||'sin errores');
await b.close();server.close();
