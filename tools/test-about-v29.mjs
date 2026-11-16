import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'cv.html'),'utf8');
const italian=fs.readFileSync(path.join(root,'assets/i18n-v13.js'),'utf8');
const facts=fs.readFileSync(path.join(root,'assets/profile-facts-v28.json'),'utf8');
const dictSource=fs.readFileSync(path.join(root,'assets/i18n-v28-content.js'),'utf8');
const context={window:{}};
vm.runInNewContext(dictSource,context);
const data=context.window.SKS_TRANSLATIONS_V28.data;
assert.equal((html.match(/data-experience=/g)||[]).length,14);
assert.equal((html.match(/class="about-engagement"/g)||[]).length,5);
assert.equal((html.match(/class="about-project-group"/g)||[]).length,3);
assert.equal((html.match(/<li><a href="projects\//g)||[]).length,17);
assert.equal((html.match(/data-i18n="about_training_\d+"/g)||[]).length,8);
for(let i=0;i<14;i++){
 assert.ok(html.includes(`data-i18n="about_summary_${i}"`));
 assert.match(italian,new RegExp(`about_summary_${i}:`));
}
for(let i=0;i<5;i++)assert.ok(italian.includes(`about_engagement_${i}:`));
for(let i=0;i<8;i++)assert.ok(italian.includes(`about_training_${i}:`));
for(const name of ['inflation_act_desi','asteroid_search','orthotic_systems'])assert.ok(italian.includes(`about_project_${name}:`));
for(const expression of [/the 25\+ figure is my current estimate/i,/publication archive is being updated/i,/countries include remote collaborations/i,/appointments may overlap/i,/dates reflect the supplied curriculum vitae/i,/selected academic and research appointments/i,/original cv role titles/i]){
 assert.doesNotMatch(html,expression);
 assert.doesNotMatch(italian,expression);
 assert.doesNotMatch(dictSource,expression);
}
assert.equal(JSON.parse(facts).projects,17);
assert.equal(JSON.parse(facts).papers.minimum,25);
assert.equal((html.match(/data-stat=/g)||[]).length,4);
for(const a of [...html.matchAll(/<a href="(projects\/[^"#?]+\.html)"/g)])assert.ok(fs.existsSync(path.join(root,a[1])));
assert.doesNotMatch(fs.readFileSync(path.join(root,'research/kahler-stability-wall/index.html'),'utf8'),/journal-version button is reserved/);
console.log('PASS: 14 CV appointments/projects, five CV engagements, 17 linked research records, bilingual labels, and no editorial disclaimers.');
