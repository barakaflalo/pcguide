/* PC Guide 3. All observations are supplied by the reader; no OS commands execute. */
(()=>{
 'use strict';
 const S=window.PCG_STATE, paths=window.PCG_PATHS, visuals=window.PCG_VISUALS;
 const tr=(he,en)=>P.uiLang==='he'?he:en;
 const read=(key,fallback)=>{try{return JSON.parse(store.get(key)||'null')??fallback;}catch{return fallback;}};
 const notice=text=>{const n=document.querySelector('.pcg-toast');n.textContent=text;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),5000);};
 function save(key,value){try{store.set(key,JSON.stringify(value));return true;}catch{notice(tr('לא ניתן לשמור בדפדפן. פנה מקום או ייצא גיבוי בהגדרות.','Could not save in this browser. Free space or export a backup in Settings.'));return false;}}
 function button(label,fn,cls='btn'){const b=el('button',cls,esc(label));b.type='button';b.onclick=fn;return b;}
 function heading(c,title,description){const h=el('div','hero');h.append(el('h1',null,esc(title)));if(description)h.append(el('p',null,esc(description)));c.append(h);}
 function source(url){const a=el('a','src',esc(tr('תיעוד רשמי ↗','Official documentation ↗')));a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
 const archName=()=>P.arch==='arm64'?'ARM64':P.arch==='x86'?'32-bit (x86)':'64-bit (x64)';
 const profileLabel=()=>verLabel(P.winVer)+' · '+archName()+(P.edition!=='unknown'?' · '+P.edition:'')+(P.build?' · Build '+P.build:'');
 updateChip=()=>{const chip=document.getElementById('pcChip');chip.textContent='🖥️ '+profileLabel();chip.title=tr('המחשב שלי','My PC');chip.setAttribute('aria-label',tr('פרופיל המחשב: ','PC profile: ')+profileLabel());};
 itemSupported=it=>S.compatibility(it,P).status!=='blocked';
 const gpedit=ITEMS.find(i=>i.id==='sys-gpedit');gpedit.desc={he:'עריכת מדיניות מערכת מתקדמת במהדורות שתומכות בכך. הכלי אינו כלול ב־Windows Home.',en:'Edit advanced system policy in supported editions. This tool is not included in Windows Home.'};gpedit.source='https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows';
 const oldItemRow=itemRow;
 itemRow=it=>{const row=oldItemRow(it);if(S.compatibility(it,P).status==='conditional')row.querySelector('.tags').append(el('span','tag pcg-conditional',esc(tr('יש לבדוק תנאים','Check requirements'))));return row;};
 // Preserve old checklist lengths solely for importing older backup files.
 const oldTrees=new Map(TREES.map(t=>[t.id,t]));
 TREES.splice(0,TREES.length,...paths.flows.map(f=>({...f,cat:'troubleshoot',steps:oldTrees.get(f.id)?.steps||[]})));
 openSetup=()=>{draft=S.profile(P);renderSetup();};
 renderSetup=()=>{
  const modal=document.getElementById('modal');modal.innerHTML='<div class="overlay"><div class="sheet pcg-profile-sheet"></div></div>';
  const sheet=modal.querySelector('.sheet'),form=document.createElement('form');sheet.append(el('h2',null,esc(tr('פרופיל המחשב','Computer profile'))),el('p','lead',esc(tr('בחר רק מה שידוע לך. אפשר להשאיר פרטים לא ידועים ולעדכן אחר כך. הפרופיל מסנן הדרכה ואינו סורק את המחשב.','Choose only what you know. Leave other details unknown and update later. This profile filters guidance; it does not scan your PC.'))),form);
  const grid=el('div','pcg-profile-grid');form.append(grid);
  function select(key,label,options){const field=el('label','pcg-field',esc(label));const input=document.createElement('select');input.name=key;input.setAttribute('aria-label',label);input.id='profile-'+key;options.forEach(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;input.append(o);});input.value=draft[key];field.append(input);grid.append(field);return input;}
  const unknown=tr('לא ידוע / לא בדקתי','Unknown / not checked');
  select('uiLang',tr('שפת המדריך','Guide language'),[['he','עברית'],['en','English']]);
  const win=select('winVer',tr('גרסת Windows','Windows version'),VERS.map(([id,label])=>[id,'Windows '+label]));
  select('sysLang',tr('שפת Windows','Windows language'),[['he','עברית'],['en','English']]);
  const arch=select('arch',tr('סוג מערכת','System architecture'),[['x64','64-bit (x64)'],['arm64','ARM64'],['x86','32-bit (x86)']]);
  select('edition',tr('מהדורה (Windows 10/11)','Edition (Windows 10/11)'),[['unknown',unknown],['home','Home'],['pro','Pro'],['enterprise','Enterprise'],['education','Education']]);
  const buildLabel=el('label','pcg-field',esc(tr('מספר Build (לא חובה)','Build number (optional)')));const build=document.createElement('input');build.name='build';build.id='profile-build';build.inputMode='numeric';build.maxLength=6;build.value=draft.build;build.placeholder=tr('לדוגמה: 26100','For example: 26100');buildLabel.append(build);grid.append(buildLabel);
  select('ps','PowerShell',[['unknown',unknown],['winps51','Windows PowerShell 5.1'],['ps7','PowerShell 7.x'],['older',tr('גרסה ישנה יותר','Older version')]]);
  select('winget',tr('זמינות winget','Winget availability'),[['unknown',unknown],['yes',tr('בדקתי: זמין','Checked: available')],['no',tr('בדקתי: לא זמין','Checked: unavailable')]]);
  const explain=el('div','pcg-notice');explain.append(el('p',null,esc(tr('Win + R ואז winver מציגים גרסה ו־Build. בהגדרות › מערכת › אודות מופיעים מהדורה וסוג מערכת.','Win + R then winver displays the version and build. Settings › System › About lists the edition and system type.'))),el('p',null,esc(tr('לבדיקת גרסת PowerShell, אפשר לקרוא בחלון PowerShell:','To inspect the PowerShell version, read in a PowerShell window:'))),el('code','mono','$PSVersionTable.PSVersion'));form.append(explain);
  const advanced=el('details','pcg-disclosure');advanced.append(el('summary',null,esc(tr('בדיקת מודולים למשתמשים מתקדמים','Module checks for advanced users'))));
  const checked=el('label','pcg-check');checked.innerHTML='<input type="checkbox" name="modulesKnown">'+esc(tr('בדקתי את רשימת המודולים הזמינים בחלון PowerShell שבחרתי','I checked available modules in the selected PowerShell session'));checked.querySelector('input').checked=draft.modulesKnown;advanced.append(checked);
  const moduleLabel=el('label','pcg-field',esc(tr('שמות המודולים, מופרדים בפסיק','Module names, separated by commas')));const moduleInput=document.createElement('input');moduleInput.name='modules';moduleInput.value=draft.modules.join(', ');moduleInput.dir='ltr';moduleInput.placeholder='Microsoft.PowerShell.Management, NetTCPIP, Storage';moduleLabel.append(moduleInput);advanced.append(moduleLabel,el('p','pcg-caption',esc(tr('השתמש ברשימה מהפלט של Get-Module -ListAvailable. סימון הבדיקה עם רשימה חלקית עלול להסתיר פקודות שמודוליהן לא הוזנו.','Use the output of Get-Module -ListAvailable. Marking an incomplete list as checked may hide commands whose modules were omitted.'))));form.append(advanced);
  const err=el('p','pcg-form-error');err.setAttribute('role','alert');form.append(err);
  const actions=el('div','pcg-actions');const submit=button(T('save'),()=>{} ,'btn primary');submit.type='submit';actions.append(submit,button(tr('סגירה בלי שינוי','Close without changes'),closeModal,'btn ghost'));form.append(actions);
  const limit=()=>{[...arch.options].forEach(o=>o.disabled=(win.value==='win11'&&o.value==='x86')||(!['win10','win11'].includes(win.value)&&o.value==='arm64'));if(arch.selectedOptions[0]?.disabled)arch.value='x64';};limit();win.onchange=()=>{build.value='';limit();};
  form.onsubmit=e=>{e.preventDefault();try{const fields=Object.fromEntries(new FormData(form));fields.modulesKnown=form.elements.modulesKnown.checked;fields.modules=fields.modules.split(/[\s,]+/).filter(Boolean);const next=S.profile(fields,true);if(!save('pcg_profile',next))return;P=next;store.set('pcg_setup','1');applyDir();closeModal();const current=stack[stack.length-1]||{screen:'home'};render(current.screen,current.param);}catch{err.textContent=tr('בדוק את מספר ה־Build והתאמתו לגרסה, ואת שמות המודולים (אותיות באנגלית, ספרות, נקודה, קו תחתון או מקף).','Check the build number and Windows version, and module names (letters, digits, dots, underscores or hyphens).');}};
 };
 skipSetup=()=>closeModal();
 const oldSettings=renderSettings;
 renderSettings=c=>{oldSettings(c);const change=c.querySelector('button[onclick="openSetup()"]');if(change)change.parentElement.previousElementSibling.textContent=profileLabel()+' · '+(P.sysLang==='he'?'עברית':'English');};
 const oldHome=renderHome;
 renderHome=c=>{oldHome(c);const b=button(tr('04 · תרשימים וצילומי מסך','04 · Diagrams & screenshots'),()=>go('visuals'),'pcg-path');const sub=el('span',null,esc(tr('השוואת Windows 10/11 והסברים מסומנים','Compare Windows 10/11 with annotated explanations')));b.append(sub);c.querySelector('.pcg-paths').append(b);};
 const itemVisual={
  'net-ipconfig':'network','net-ping':'network','net-testconn':'network','net-nslookup':'network',
  'sys-devmgmt':'device-manager','sys-taskmgr':'task-manager','disk-mgmt':'disk-management',
  'sys-update-settings':'update','sys-sound':'sound','sec-file-permissions':'permissions','sys-usb-devices':'device-manager','sys-bluetooth-settings':'bluetooth','disk-backup-preview':'backup','disk-list':'disk-management'
 };
 function disclosure(kind){const d=el('details','pcg-disclosure');d.append(el('summary',null,esc(tr('המחשה: איפה מסתכלים ומה בודקים','Visual guide: where to look and what to check'))));d.append(visuals.render(kind,P,P.uiLang));return d;}
 const oldItem=renderItem;
 renderItem=(c,id)=>{
  oldItem(c,id);const it=ITEMS.find(i=>i.id===id),article=c.querySelector('article');if(!it||!article)return;
  const info=S.compatibility(it,P),box=el('section','pcg-compat '+info.status);box.append(el('h2',null,esc(tr('התאמה לפרופיל','Profile compatibility'))),el('p',null,esc(info.status==='blocked'?tr('לא מתאים לפרטים שנבחרו.','Not available for the selected details.'):info.status==='conditional'?tr('יש תנאים שעדיין צריך לבדוק.','Some requirements still need to be checked.'):tr('מופיע במדריך עבור הפרופיל שנבחר.','Listed in this guide for the selected profile.'))));
  if(info.needs.length||info.reasons.length){const list=document.createElement('ul');[...info.needs,...info.reasons].forEach(s=>list.append(el('li',null,esc(L(s)))));box.append(list);}
  box.append(el('p','pcg-caption',esc(tr('הסינון נשען על הפרטים שהזנת. הרשאות ארגון, התקנות ועדכונים עשויים להשפיע; זו אינה בדיקה במחשב עצמו.','Filtering uses the details you entered. Organization policy, installed components and updates can affect availability; this is not a check of your PC.'))),button(tr('עדכון פרטי המחשב','Update PC details'),openSetup,'btn ghost'));if(info.source)box.append(source(info.source));article.querySelector('.risk-banner').after(box);
  if(it.example){const x=it.example,section=el('section','block pcg-example');section.append(el('h2',null,esc(tr('דוגמת פלט ופירוש','Example output and interpretation'))));const terminal=el('div','pcg-terminal');terminal.append(el('div','pcg-terminal-bar',esc(tr('דוגמה לימודית בלבד · לא נתוני המחשב שלך','Illustrative example · not your PC data'))));const code=el('div','pcg-terminal-code');if(x.command){const cmd=el('code',null,esc('> '+x.command));cmd.dir='ltr';code.append(cmd);}const output=el('pre',null,esc(L(x.output)));output.dir='ltr';code.append(output);terminal.append(code);section.append(terminal,el('p','txt',esc(L(x.interpretation))));const expected=[...article.querySelectorAll('.block')].find(b=>b.querySelector('h2')?.textContent===T('expectedOk'));if(expected)expected.after(section);else article.append(section);}
  const kind=it.visual||itemVisual[id];if(kind)article.append(disclosure(kind));
 };
 renderTree=(c,id)=>{
  const f=paths.flows.find(f=>f.id===id);if(!f)return;c.append(backBtn());heading(c,L(f.title),L(f.intro));
  if(!f.compat[P.winVer]||f.compat[P.winVer]==='no'){c.append(el('p','warnbox',esc(tr('המסלול נכתב ל־Windows 10/11. בגרסאות אחרות יש לעיין בקטלוג המתאים ובתיעוד הכלי.','This flow targets Windows 10/11. For other versions, use the matching catalog and tool documentation.'))));return;}
  const routes=S.routes(read('pcg_routes',{})),history=routes[id]||[],nodeId=S.currentNode(f,history),n=f.nodes[nodeId];
  c.append(el('p','pcg-notice',esc(tr('זהו מסלול לבדיקה ידנית. בחר את התשובה שמתארת את מה שראית. המדריך לא בודק את המחשב ולא מבצע בו פעולות.','This is a manual troubleshooting flow. Choose what you actually observed. The guide does not inspect or modify your PC.'))));
  function move(next){if(next.length>50){notice(tr('המסלול הגיע ל־50 תשובות. אפשר לחזור לתשובה קודמת או להתחיל מחדש.','This flow reached 50 answers. Go back to an earlier answer or restart.'));return;}if(save('pcg_routes',{...routes,[id]:next}))render('tree',id);}
  if(history.length){const trail=el('details','pcg-disclosure');trail.append(el('summary',null,esc(tr('התשובות שלי במסלול','My answers in this flow')+' · '+history.length)));const list=document.createElement('ol');let nid=f.start;history.forEach((index,step)=>{const previous=f.nodes[nid],choice=previous.choices[index];const li=el('li',null,esc(L(previous.title)+' — '+L(choice.label))+' ');li.append(button(tr('שינוי תשובה','Change answer'),()=>move(history.slice(0,step)),'choice'));list.append(li);nid=choice.next;});trail.append(list);c.append(trail);}
  const card=el('section','detail pcg-route-question');card.dataset.node=nodeId;card.append(el('div','pcg-eyebrow',esc(n.outcome?tr('תוצאת המסלול','FLOW OUTCOME'):tr('בדיקה ','CHECK ')+(history.length+1))),el('h2',null,esc(L(n.title))),el('p','txt',esc(L(n.body))));
  if(n.command){if(n.command.admin)card.append(el('p','warnbox',esc(T('admins'))));card.append(methodEl(n.command,{admin:n.command.admin}));}
  const choices=el('div','pcg-choices');n.choices.forEach((ch,index)=>choices.append(button(L(ch.label),()=>move([...history,index]),'choice pcg-route-choice')));card.append(choices);c.append(card);
  if(n.visual)c.append(disclosure(n.visual));
  const actions=el('div','pcg-actions');if(history.length)actions.append(button(tr('חזרה לבדיקה הקודמת','Back to previous check'),()=>move(history.slice(0,-1))));actions.append(button(tr('התחלת המסלול מחדש','Restart this flow'),()=>move([]),'btn ghost'),button(tr('כל מסלולי התקלות','All troubleshooting flows'),()=>go('category','troubleshoot'),'btn ghost'));c.append(actions);if(f.source)c.append(source(f.source));
 };
 function renderLearn(c){
  c.append(backBtn());heading(c,tr('לומדים דרך מקרים אמיתיים','Learn through realistic situations'),tr('דוגמאות מדומות, בחירת הצעד הבא ומשוב על כל תשובה. אפשר לחזור בכל שלב ולהמשיך מאותה נקודה.','Simulated examples, next-step choices and feedback on each answer. Return any time to continue from your saved progress.'));
  const progress=S.scenarioProgress(read('pcg_scenarios',{}));c.append(el('h2','sectitle',esc(tr('תרחישים מעשיים · שלושה שלבים בכל תרחיש','Practical scenarios · three stages each'))));
  const grid=el('div','pcg-lesson-grid');paths.scenarios.forEach((s,i)=>{const b=button('',()=>go('scenario',s.id),'pcg-lesson-card');b.innerHTML='<span class="pcg-eyebrow">'+String(i+1).padStart(2,'0')+' · '+(progress[s.id]||0)+' / '+s.steps.length+'</span><strong>'+esc(L(s.title))+'</strong><span>'+esc(L(s.intro))+'</span><b>'+esc(tr('פתיחת התרחיש','Open scenario'))+' ↗</b>';grid.append(b);});c.append(grid);
  c.append(el('h2','sectitle',esc(tr('תרגול קצר של פלט פקודות','Short command-output exercises'))));const savedLessons=read('pcg_learning',[]),done=Array.isArray(savedLessons)?savedLessons:[],short=el('div','pcg-lesson-grid');window.PCG_LEARNING.lessons.forEach(l=>{const b=button('',()=>go('lesson',l.id),'pcg-lesson-card');b.append(el('strong',null,esc((done.includes(l.id)?'✓ ':'')+L(l.title))),el('span',null,esc(L(l.intro))));short.append(b);});c.append(short,button(tr('תרשימים וצילומי מסך','Diagrams & screenshots'),()=>go('visuals')));
  c.append(el('h2','sectitle',esc(tr('מילון קצר','Quick glossary'))));const glossary=el('dl','pcg-glossary');window.PCG_LEARNING.glossary.forEach(g=>glossary.append(el('dt',null,esc(L(g.term))),el('dd',null,esc(L(g.definition)))));c.append(glossary);
 }
 function renderScenario(c,param){
  const id=typeof param==='string'?param:param?.id,s=paths.scenarios.find(s=>s.id===id);if(!s)return;
  const progress=S.scenarioProgress(read('pcg_scenarios',{})),count=progress[id]||0,index=Math.min(typeof param==='object'?param.step:count,s.steps.length-1,count),step=s.steps[index];
  c.append(backBtn());heading(c,L(s.title),L(s.intro));const meter=el('div','pcg-progress');meter.innerHTML='<b>'+count+' / '+s.steps.length+' '+esc(tr('שלבים הושלמו','stages completed'))+'</b><progress max="'+s.steps.length+'" value="'+count+'" aria-label="'+esc(tr('התקדמות בתרחיש','Scenario progress'))+'"></progress>';c.append(meter);
  const card=el('section','detail');card.append(el('div','pcg-eyebrow',esc(tr('שלב ','STAGE ')+(index+1))),el('h2',null,esc(L(step.title))));const pre=el('pre','pcg-scenario-output',esc(step.output));pre.dir='ltr';card.append(pre,el('p','pcg-caption',esc(tr('דוגמה מדומה לתרגול בלבד. שום מידע לא נקרא מהמחשב.','Simulated practice output. No information was read from your PC.'))),el('h3',null,esc(L(step.question))));
  const feedback=el('div','pcg-feedback');feedback.setAttribute('role','status');const choices=el('div','pcg-choices');const next=button(index===s.steps.length-1?tr('סיום וחזרה ללמידה','Finish and return to learning'):tr('לשלב הבא','Next stage'),()=>go(index===s.steps.length-1?'learn':'scenario',index===s.steps.length-1?undefined:{id,step:index+1}),'btn primary');next.disabled=count<=index;
  step.choices.forEach(ch=>{const b=button(L(ch.label),()=>{choices.querySelectorAll('button').forEach(x=>{x.classList.remove('correct','incorrect');x.setAttribute('aria-pressed','false');});b.classList.add(ch.correct?'correct':'incorrect');b.setAttribute('aria-pressed','true');feedback.className='pcg-feedback '+(ch.correct?'okbox':'warnbox');feedback.textContent=L(ch.feedback);if(ch.correct){const nextCount=Math.max(count,index+1);if(save('pcg_scenarios',{...progress,[id]:nextCount})){next.disabled=false;meter.querySelector('b').textContent=nextCount+' / '+s.steps.length+' '+tr('שלבים הושלמו','stages completed');meter.querySelector('progress').value=nextCount;}}},'choice');b.setAttribute('aria-pressed','false');choices.append(b);});card.append(choices,feedback);c.append(card);
  const actions=el('div','pcg-actions');actions.append(next);if(index>0)actions.append(button(tr('סקירת השלב הקודם','Review previous stage'),()=>go('scenario',{id,step:index-1})));actions.append(button(tr('איפוס התרחיש','Reset scenario'),()=>{if(save('pcg_scenarios',{...progress,[id]:0}))render('scenario',id);},'btn ghost'));c.append(actions);if(s.source)c.append(source(s.source));
 }
 const kinds=[['network','רשת ואינטרנט','Network'],['device-manager','מנהל ההתקנים','Device Manager'],['disk-management','ניהול דיסקים','Disk Management'],['sound','שמע ועוצמה','Sound & volume'],['update','עדכוני Windows','Windows Update'],['permissions','הרשאות קבצים','File permissions'],['backup','גיבוי ושחזור','Backup'],['bluetooth','Bluetooth','Bluetooth'],['task-manager','מנהל המשימות','Task Manager']];
 function renderVisuals(c){
  c.append(backBtn());heading(c,tr('לראות ולהבין','See and understand'),tr('תרשימים מסומנים לצד צילומים רשמיים. שמות ופריסת התפריטים עשויים להשתנות לפי עדכון ושפת המערכת.','Annotated diagrams alongside official screenshots. Menu names and layout can change with updates and system language.'));
  const controls=el('div','pcg-filters');const versionLabel=el('label',null,esc(tr('גרסה להשוואה','Version to compare'))),version=document.createElement('select');version.innerHTML='<option value="win11">Windows 11</option><option value="win10">Windows 10</option>';version.value=['win10','win11'].includes(P.winVer)?P.winVer:'win11';versionLabel.append(version);const kindLabel=el('label',null,esc(tr('נושא ההמחשה','Visual topic'))),kind=document.createElement('select');kinds.forEach(([id,he,en])=>{const option=document.createElement('option');option.value=id;option.textContent=tr(he,en);kind.append(option);});kindLabel.append(kind);controls.append(versionLabel,kindLabel);c.append(controls,el('p','pcg-caption',esc(tr('הבחירה כאן משווה המחשות בלבד ואינה משנה את פרופיל המחשב.','These selectors compare visuals only and do not change your PC profile.'))));const canvas=el('div','pcg-visual-canvas');c.append(canvas);const update=()=>canvas.replaceChildren(visuals.render(kind.value,{...P,winVer:version.value},P.uiLang));version.onchange=update;kind.onchange=update;update();
 }
 const oldRender=render;
 render=(screen,param)=>{
  if(['learn','scenario','visuals'].includes(screen)){app().replaceChildren();updateChip();document.getElementById('brandName').textContent=T('brand');({learn:renderLearn,scenario:renderScenario,visuals:renderVisuals})[screen](app(),param);document.title=T('brand')+' · AppNest';const h=app().querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}else oldRender(screen,param);
  const labels={"openThemes()":tr('ערכת צבע','Color theme'),"go('settings')":tr('הגדרות','Settings'),"go('about')":tr('אודות','About')};document.querySelectorAll('header button[onclick]').forEach(b=>{const label=labels[b.getAttribute('onclick')];if(label){b.title=label;b.setAttribute('aria-label',label);}});const ab=document.getElementById('appnest-assistant-btn');if(ab)ab.textContent=tr('🪄 עוזר','🪄 Assistant');if(screen!=='search')window.scrollTo(0,0);
 };
 window.APPNEST_ASSISTANT_CONFIG.tabs.push({name:'תרשימים / Visual guides',screen:'visuals'});
 const oldAIState=window.APPNEST_ASSISTANT_CONFIG.readState;
 window.APPNEST_ASSISTANT_CONFIG.readState=()=>oldAIState()+'\nפרטי תאימות שהמשתמש הזין (אינם בדיקת מחשב): '+JSON.stringify(S.profile(P));
 window.PCG_PRO={ready:true};
})();
