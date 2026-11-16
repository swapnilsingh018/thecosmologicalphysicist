import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const htmlFiles=[];
const visit=dir=>{for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.name.startsWith('.'))continue;const p=path.join(dir,ent.name);if(ent.isDirectory()&&ent.name!=='tools')visit(p);else if(ent.isFile()&&p.endsWith('.html'))htmlFiles.push(p);}};
visit(root);
for(const file of htmlFiles){
  const source=fs.readFileSync(file,'utf8');
  assert.match(source,/data-set-lang="en"/,`missing English switch: ${file}`);
  assert.match(source,/data-set-lang="it"/,`missing Italian switch: ${file}`);
  assert.match(source,/assets\/i18n-v28-content\.js/,`missing translations: ${file}`);
  assert.match(source,/assets\/i18n-v13\.js/,`missing runtime: ${file}`);
}
const dictionarySource=fs.readFileSync(path.join(root,'assets/i18n-v28-content.js'),'utf8');
const runtimeSource=fs.readFileSync(path.join(root,'assets/i18n-v13.js'),'utf8');
const defaults = new Map([['sks-language','it']]);
const buttons=[];
for(const code of ['en','it'])buttons.push({dataset:{setLang:code},attrs:{},classList:{toggle(){}}, addEventListener(name,fn){this.listeners??={};this.listeners[name]=fn;},setAttribute(k,v){this.attrs[k]=v;}});
const brandNode={dataset:{i18n:'nav_about'},textContent:'About'};
const arabicTitle={nodeValue:' Publications ',parentElement:{closest(){return false;}}};
const anchor={href:'publications.html',getAttribute(name){return name==='href'?this.href:null;},setAttribute(name,value){if(name==='href')this.href=value;}};
const rootEl={lang:'en'};
const elements={
  '[data-i18n]':[brandNode],
  '[data-i18n-aria]':[],
  '[data-i18n-placeholder]':[],
  '[data-set-lang]':buttons,
  'a[href]':[anchor]
};
const document={
  readyState:'complete',documentElement:rootEl,body:{classList:{contains(){return false;}}},title:'About — Swapnil Kumar Singh',
  querySelectorAll(selector){return elements[selector]||[];},
  querySelector(selector){return selector==='meta[name="description"]'?{content:'English description'}:null;},
  createTreeWalker(){let done=false;return{nextNode(){if(done)return null;done=true;return arabicTitle;}};},
  dispatchEvent(){},addEventListener(){},
};
const location=new URL('https://www.swapnilsingh.co.in/cv.html?lang=it');
let lastHistory='';
const ctx={document,location,history:{replaceState(_a,_b,url){lastHistory=url;}},URL,URLSearchParams,NodeFilter:{SHOW_TEXT:4},localStorage:{getItem(key){return defaults.get(key)??null;},setItem(k,v){defaults.set(k,v);}},CustomEvent:class{constructor(n,o){this.type=n;this.detail=o?.detail;}},window:{}};
vm.runInNewContext(dictionarySource,ctx,{filename:'i18n-v28-content.js'});
vm.runInNewContext(runtimeSource,ctx,{filename:'i18n-v13.js'});
assert.equal(rootEl.lang,'it');
assert.equal(brandNode.textContent,'Profilo');
assert.equal(arabicTitle.nodeValue.trim(),'Pubblicazioni');
assert.equal(document.title,'Profilo — Swapnil Kumar Singh');
assert.ok(anchor.href.includes('?lang=it'));
assert.equal(buttons[1].attrs['aria-pressed'],'true');
buttons[0].listeners.click();
assert.equal(rootEl.lang,'en');
assert.equal(brandNode.textContent,'About');
assert.equal(arabicTitle.nodeValue,' Publications ');
assert.equal(anchor.href,'/publications.html');
assert.equal(defaults.get('sks-language'),'en');
assert.equal(lastHistory,'/cv.html');
buttons[1].listeners.click();
assert.equal(rootEl.lang,'it');
assert.equal(brandNode.textContent,'Profilo');
assert.ok(anchor.href.includes('lang=it'));
const facts=JSON.parse(fs.readFileSync(path.join(root,'assets/profile-facts-v28.json'),'utf8'));
assert.equal(facts.projects,fs.readdirSync(path.join(root,'projects')).filter(x=>x.endsWith('.html')).length);
assert.equal(facts.papers.minimum,25);
assert.equal(facts.countries.total,7);
assert.equal(facts.firstAppointment,'2022-07-01');
assert.match(fs.readFileSync(path.join(root,'cv.html'),'utf8'),/data-profile-stats/);
console.log(`PASS: 33-page bilingual controls, real EN/IT switching, persistent URL language, and CV-sourced editorial figures.`);
