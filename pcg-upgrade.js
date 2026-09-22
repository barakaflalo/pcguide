/* PC Guide 2: browser-only learning, compatibility and reliable local state. */
(() => {
  'use strict';
  const content=window.PCG_CONTENT, learning=window.PCG_LEARNING;
  content.patches.forEach(p=>{const i=ITEMS.find(x=>x.id===p.id);if(i)Object.assign(i,p);});
  content.items.forEach(i=>{if(!ITEMS.some(x=>x.id===i.id))ITEMS.push(i);});
  window.PCG_DEPTH.patches.forEach(p=>{const i=ITEMS.find(x=>x.id===p.id);if(i)Object.assign(i,p);});
  window.PCG_DEPTH.items.forEach(i=>{if(!ITEMS.some(x=>x.id===i.id))ITEMS.push(i);});
  TREES.splice(0,TREES.length,...content.trees);
  const flowIntros={
    't-net':['בודקים את המכשיר, הנתב, DNS והאתר כדי לצמצם את מקור התקלה.','Check the device, router, DNS and website to narrow down the fault.'],
    't-slow':['מבחינים בין עומס רגעי, תוכנות בהפעלה ומחסור באחסון.','Distinguish current load, startup apps and low storage.'],
    't-errors':['מתי נכון לבדוק קובצי מערכת ואיך לקרוא את תוצאות DISM ו־SFC.','When to check system files and how to read DISM and SFC results.'],
    't-update':['בודקים חיבור, מקום פנוי וקוד שגיאה לפני שינוי רכיבי עדכון.','Check connectivity, free space and the error code before changing update components.'],
    't-appcrash':['מבודדים תקלה באפליקציה מסוימת ומנסים תיקון ששומר על הנתונים.','Isolate an app-specific problem and try a repair that preserves data.'],
    't-sound':['מתחילים ביציאה שנבחרה, עוצמה וחיבור — לפני דרייברים.','Start with output selection, volume and connections before drivers.'],
    't-printer':['בדיקות נייר, חיבור, תור הדפסה ועמוד בדיקה לפי הסדר.','Check paper, connections, the print queue and a test page in order.']
  };
  TREES.forEach(t=>{const intro=flowIntros[t.id];if(intro)t.intro={he:intro[0],en:intro[1]};});
  const tr=(he,en)=>P.uiLang==='he'?he:en;
  const defaults=window.PCG_STATE.defaults;
  const enums=window.PCG_STATE.enums;
  const json=(key,fallback)=>{try{return JSON.parse(store.get(key)||'null')??fallback;}catch{return fallback;}};
  const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
  const profile=window.PCG_STATE.profile;
  const validIds=(value,ids)=>Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&ids.includes(x)))]:[];
  const itemIds=ITEMS.map(i=>i.id),lessonIds=learning.lessons.map(l=>l.id);
  const completed=()=>validIds(json('pcg_learning',[]),lessonIds);
  function flowState(value){
    const result={};if(!plain(value))return result;
    TREES.forEach(t=>{if(Array.isArray(value[t.id]))result[t.id]=[...new Set(value[t.id].filter(n=>Number.isInteger(n)&&n>=0&&n<t.steps.length))];});
    return result;
  }
  function validateBackup(data){
    if(!plain(data)||data.app!=='pcguide'||typeof data.version!=='string'||!/^([123])\.\d+\.\d+$/.test(data.version))throw Error('format');
    const p=profile(data.profile,true);
    if(!THEMES.some(t=>t.id===data.theme)||!Array.isArray(data.favs)||data.favs.some(id=>!itemIds.includes(id)))throw Error('preferences');
    if(data.learning!==undefined&&(!Array.isArray(data.learning)||data.learning.some(id=>!lessonIds.includes(id))))throw Error('learning');
    if(data.flows!==undefined){
      if(!plain(data.flows))throw Error('flows');
      Object.entries(data.flows).forEach(([id,steps])=>{const tree=TREES.find(t=>t.id===id);if(!tree||!Array.isArray(steps)||steps.some(i=>!Number.isInteger(i)||i<0||i>=tree.steps.length))throw Error('flow');});
    }
    return {profile:p,theme:data.theme,favs:[...new Set(data.favs)],learning:validIds(data.learning,lessonIds),flows:flowState(data.flows),routes:window.PCG_STATE.routes(data.routes??{},true),scenarios:window.PCG_STATE.scenarioProgress(data.scenarios??{},true)};
  }
  function applyBackup(data){
    const d=validateBackup(data);
    const updates={pcg_profile:JSON.stringify(d.profile),pcg_theme:d.theme,pcg_favs:JSON.stringify(d.favs),pcg_learning:JSON.stringify(d.learning),pcg_flows:JSON.stringify(d.flows),pcg_routes:JSON.stringify(d.routes),pcg_scenarios:JSON.stringify(d.scenarios),pcg_setup:'1',pcg_onboarded:'1'};
    const old=Object.fromEntries(Object.keys(updates).map(k=>[k,store.get(k)]));
    try{Object.entries(updates).forEach(([k,v])=>store.set(k,v));}
    catch(e){Object.entries(old).forEach(([k,v])=>{try{v===null?store.del(k):store.set(k,v);}catch{}});throw e;}
    P=d.profile;applyDir();applyTheme(d.theme);
  }
  window.PCG={validateBackup,applyBackup,profile};
  loadProfile=()=>{P=profile(json('pcg_profile',{}));};
  favs=()=>validIds(json('pcg_favs',[]),itemIds);
  const oldTheme=applyTheme;
  applyTheme=id=>oldTheme(THEMES.some(t=>t.id===id)?id:'gold');
  const oldAI=getAI;
  getAI=()=>{const a=oldAI();return plain(a)&&AI_PROVIDERS.some(p=>p.id===a.provider)&&plain(a.keys)?a:null;};
  bestMethods=it=>itemSupported(it)?(it.methods||[]).filter(m=>!m.compat||compatState(m.compat)!=='no').sort((a,b)=>Number(!!b.best)-Number(!!a.best)):[];
  guiPath=m=>m.paths?.[P.winVer]?.[P.sysLang]||null;
  LANG.he.best='דרך מוצעת';LANG.en.best='Suggested method';
  LANG.he.riskGreen='סיכון נמוך · קריאה, פתיחת כלי או ניווט';LANG.en.riskGreen='Low risk · inspection, opening tools or navigation';
  LANG.he.riskRed='דורש זהירות רבה · קראו את ההשלכות לפני שינוי';LANG.en.riskRed='Use extra care · read the consequences before making changes';
  LANG.he.setupLead='בחר את הגרסה ושפת המערכת כדי לסנן הוראות מתאימות. שמות תפריטים עשויים להשתנות בין מהדורות ועדכונים.';
  LANG.en.setupLead='Choose your Windows version and language to filter relevant instructions. Menu labels may vary by edition and update.';
  OB_STEPS[0].body={he:'מדריך לפקודות, קיצורים ופתרון תקלות ב־Windows. התוכן המובנה זמין גם בלי חשבון; טעינה ראשונה דרך האתר נדרשת לשימוש אופליין.',en:'A guide to Windows commands, shortcuts and troubleshooting. Built-in content needs no account; load the website once for offline use.'};
  OB_STEPS[1].body={he:LANG.he.setupLead,en:LANG.en.setupLead};
  // Keep factual connection information without promising provider pricing or quality.
  AI_PROVIDERS.forEach(pr=>{
    if(['gemini','claude','openai'].includes(pr.id)){
      pr.tag='API';pr.help={he:'חיבור אופציונלי לחשבון API משלך. זמינות, מכסות ועלויות נקבעות אצל הספק. השאלה, הקשר המדריך וחלק מהשיחה נשלחים אליו.',en:'Optional connection to your own API account. Availability, limits and costs are set by the provider. Your question, guide context and recent conversation are sent to it.'};
      pr.linkTxt={he:'הגדרת מפתח אצל הספק ↗',en:'Set up a provider key ↗'};
    }
  });
  const msg=document.createElement('div');msg.className='pcg-toast';msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');document.body.appendChild(msg);
  let toastTimer;
  function notify(text){msg.textContent=text;msg.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>msg.classList.remove('show'),3600);}
  function persist(key,value){try{store.set(key,JSON.stringify(value));return true;}catch{notify(tr('הדפדפן לא הצליח לשמור. אפשר לייצא גיבוי בהגדרות.','The browser could not save. You can export a backup in Settings.'));return false;}}
  function button(label,fn,cls='btn'){const b=el('button',cls,esc(label));b.type='button';b.onclick=fn;return b;}
  function heading(c,title,description){const h=el('div','hero');h.append(el('h1',null,esc(title)));if(description)h.append(el('p',null,esc(description)));c.append(h);}
  function sourceLink(url){const a=el('a','src',esc(tr('תיעוד רשמי ↗','Official documentation ↗')));a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function riskText(r){return r==='red'?tr('זהירות רבה','Extra care'):r==='yellow'?tr('שינוי / תיקון','Change / repair'):tr('סיכון נמוך','Low risk');}
  function lifecycle(c){
    if(P.winVer!=='win10'&&!LEGACY.includes(P.winVer))return;
    const text=P.winVer==='win10'?tr('התמיכה הרגילה ב־Windows 10 Home/Pro הסתיימה ב־14.10.2025. חריגים כגון ESU ו־LTSC תלויים ברישוי ובמהדורה.','Standard Windows 10 Home/Pro support ended on October 14, 2025. Exceptions such as ESU and LTSC depend on licensing and edition.'):tr('בחרת גרסת Windows ישנה. הקטלוג משמש גם לעיון היסטורי; יש לבדוק זמינות כל כלי ועדכוני אבטחה בנפרד.','You selected an older Windows version. The catalog also serves as a historical reference; verify tool availability and security updates separately.');
    const note=el('div','pcg-notice',esc(text));note.append(document.createTextNode(' '),sourceLink('https://learn.microsoft.com/en-us/windows/release-health/release-information'));c.append(note);
  }
  function treeRow(t){const b=button('',()=>go('tree',t.id),'troublecard');b.innerHTML=`<span class="em" aria-hidden="true">${t.em}</span><span><strong>${esc(L(t.title))}</strong><span class="pcg-description">${esc(L(t.intro))}</span></span><span class="pcg-arrow" aria-hidden="true">↗</span>`;return b;}
  itemRow=it=>{
    const b=button('',()=>go('item',it.id),'item'+(itemSupported(it)?'':' dim'));
    b.innerHTML=`<span class="risk ${it.risk}" aria-hidden="true"></span><span class="body"><strong>${esc(L(it.title))}</strong><span class="pcg-description">${esc(L(it.desc))}</span><span class="tags"><span class="tag">${esc(riskText(it.risk))}</span>${it.admin?`<span class="tag admin">${esc(T('admin'))}</span>`:''}${!itemSupported(it)?`<span class="tag unsupported">${esc(tr('לא זמין לפרופיל הנבחר','Unavailable for selected profile'))}</span>`:''}</span></span>`;
    return b;
  };
  renderHome=c=>{
    const hero=el('section','pcg-hero');
    hero.innerHTML=`<div><div class="pcg-eyebrow">APPNEST / PC GUIDE 3</div><h1>${esc(tr('להבין את המחשב.\nלפתור צעד אחר צעד.','Understand your PC.\nOne step at a time.'))}</h1><p>${esc(tr('הסברים, פקודות ותרגול — במקום אחד. בוחרים מה לבדוק, מבינים את הפלט ורק אז מחליטים איך להמשיך.','Explanations, commands and practice in one place. Choose a check, understand its output, then decide what to do next.'))}</p><div class="pcg-stats"><span><b>${ITEMS.length}</b> ${esc(tr('נושאים','topics'))}</span><span><b>${TREES.length}</b> ${esc(tr('מסלולי פתרון','guided flows'))}</span><span><b>${learning.lessons.length+window.PCG_PATHS.scenarios.length}</b> ${esc(tr('תרגולים','exercises'))}</span></div></div><div class="pcg-blueprint" aria-hidden="true"><div class="pcg-screen"><span>PC GUIDE</span><i></i><i></i><i></i><div class="pcg-screen-footer">&gt;_ <b>✓</b></div></div><div class="pcg-stand"></div><div class="pcg-orbit orbit-one"></div><div class="pcg-orbit orbit-two"></div></div>`;
    c.append(hero);
    const search=el('form','pcg-search');search.innerHTML=`<label for="home-search">${esc(tr('מה תרצה למצוא?','What would you like to find?'))}</label><div><input id="home-search" type="search" placeholder="${esc(tr('לדוגמה: אינטרנט, מקום בדיסק, ipconfig','For example: internet, disk space, ipconfig'))}"><button class="btn primary" type="submit">${esc(tr('חיפוש','Search'))}</button></div>`;
    search.onsubmit=e=>{e.preventDefault();go('search',search.querySelector('input').value.trim());};c.append(search);
    const nav=el('div','pcg-paths');
    [[tr('01 · לומדים ומתרגלים','01 · Learn & practice'),tr('פלט לדוגמה, שאלות והסבר לכל תשובה','Example output, questions and explained answers'),'learn'],[tr('02 · מאתרים תקלה','02 · Troubleshoot'),tr('שאלות ותשובות שמובילות לבדיקה הבאה','Your answers guide the next check'),'category','troubleshoot'],[tr('03 · מחפשים פקודה','03 · Find a command'),tr('סינון לפי Windows, סוג הפעולה ורמת הסיכון','Filter by Windows, command type and risk'),'search','']].forEach(([label,sub,screen,param])=>{const b=button('',()=>go(screen,param),'pcg-path');b.innerHTML=`<strong>${esc(label)}</strong><span>${esc(sub)}</span><b aria-hidden="true">↗</b>`;nav.append(b);});c.append(nav);
    lifecycle(c);
    c.append(el('h2','sectitle',esc(T('troubleHead'))));
    const flows=el('div','pcg-flow-grid');TREES.forEach(t=>flows.append(treeRow(t)));c.append(flows);
    c.append(el('h2','sectitle',esc(T('catsHead'))));const grid=el('div','grid');
    CATS.filter(cat=>cat.id!=='troubleshoot').forEach(cat=>{const n=ITEMS.filter(i=>i.cat===cat.id&&itemSupported(i)).length;const b=button('',()=>go('category',cat.id),'cat');b.innerHTML=`<span class="em" aria-hidden="true">${cat.em}</span><strong>${esc(L(cat))}</strong><span>${n} ${esc(tr('לפרופיל שלך','for your profile'))}</span>`;grid.append(b);});
    const fav=button('⭐ '+T('favs')+' · '+favs().length,()=>go('favs'),'cat');grid.append(fav);c.append(grid);
    c.append(el('h2','sectitle',esc(tr('עיון לפי סוג','Browse by type'))));const types=el('div','pcg-actions');TYPE_CHIPS.forEach(t=>types.append(button(L(t),()=>go('type',t.type),'choice')));c.append(types);
    c.append(el('footer','footer',`AppNest · Barak Aflalo · v${APP_VERSION}<br>${esc(tr('מדריך לימודי בדפדפן. אינו מריץ פקודות או סורק את המחשב.','A browser learning guide. It does not execute commands or scan your PC.'))}`));
  };
  function filters(c,update,withKind=true){
    const bar=el('div','pcg-filters');
    bar.innerHTML=`<label class="pcg-check"><input type="checkbox" checked data-filter="compatible">${esc(tr('רק לפרופיל שלי','My profile only'))}</label><label>${esc(tr('רמת סיכון','Risk'))}<select data-filter="risk"><option value="all">${esc(tr('הכול','All'))}</option><option value="green">${esc(riskText('green'))}</option><option value="yellow">${esc(riskText('yellow'))}</option><option value="red">${esc(riskText('red'))}</option></select></label>${withKind?`<label>${esc(tr('סוג','Type'))}<select data-filter="kind"><option value="all">${esc(tr('הכול','All'))}</option>${TYPE_CHIPS.map(t=>`<option value="${t.type}">${esc(L(t))}</option>`).join('')}</select></label>`:''}`;
    bar.addEventListener('change',update);c.append(bar);
    return ()=>({compatible:bar.querySelector('[data-filter=compatible]').checked,risk:bar.querySelector('[data-filter=risk]').value,kind:bar.querySelector('[data-filter=kind]')?.value||'all'});
  }
  function filtered(items,f){return items.filter(i=>(!f.compatible||itemSupported(i))&&(f.risk==='all'||i.risk===f.risk)&&(f.kind==='all'||i.methods.some(m=>m.type===f.kind&&(!f.compatible||!m.compat||compatState(m.compat)!=='no'))));}
  function catalog(c,items,opts={}){
    let read;const results=el('div');results.id='results';
    const status=el('p','pcg-result-count');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const update=()=>{const list=filtered(typeof items==='function'?items():items,read());results.replaceChildren();status.textContent=list.length+' '+tr('נושאים מוצגים','topics shown');list.forEach(i=>results.append(itemRow(i)));if(!list.length)results.append(el('p','empty',esc(T('noResults'))));};
    read=filters(c,update,opts.kind!==false);c.append(status,results);update();return update;
  }
  renderSearch=(c,q='')=>{
    c.append(backBtn());heading(c,tr('חיפוש במדריך','Search the guide'),tr('חפש בעברית, באנגלית או לפי הפקודה עצמה.','Search in Hebrew, English or by command text.'));
    const form=el('form','pcg-search');form.innerHTML=`<label for="q">${esc(T('searchPh'))}</label><div><input id="q" type="search" value="${esc(q||'')}" autocomplete="off"><button type="submit" class="btn">${esc(tr('חיפוש','Search'))}</button></div>`;c.append(form);
    const input=form.querySelector('input');
    const hits=()=>{const term=input.value.trim();return term?ITEMS.map(i=>[i,searchScore(i,term)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).map(x=>x[0]):ITEMS;};
    const update=catalog(c,hits);
    function changed(){const current=stack[stack.length-1];if(current?.screen==='search')current.param=input.value;update();}
    input.oninput=changed;form.onsubmit=e=>{e.preventDefault();changed();};input.focus();input.setSelectionRange(input.value.length,input.value.length);
  };
  renderCategory=(c,id)=>{c.append(backBtn());const cat=CATS.find(x=>x.id===id);if(!cat)return;heading(c,L(cat));if(id==='troubleshoot'){lifecycle(c);TREES.forEach(t=>c.append(treeRow(t)));return;}catalog(c,ITEMS.filter(i=>i.cat===id));};
  renderType=(c,type)=>{c.append(backBtn());const tc=TYPE_CHIPS.find(t=>t.type===type);heading(c,tc?L(tc):type);catalog(c,ITEMS.filter(i=>i.methods.some(m=>m.type===type)),{kind:false});};
  fallbackCopy=(text,done)=>{
    const previous=document.activeElement,ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0';ta.setAttribute('aria-label',tr('טקסט להעתקה','Text to copy'));document.body.append(ta);ta.select();let ok=false;
    try{ok=document.execCommand('copy')===true;}catch{}finally{ta.remove();previous?.focus();}
    if(ok&&done)done();return ok;
  };
  copyText=async(text,btn)=>{
    let ok=false;try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(String(text));ok=true;}}catch{}
    if(!ok)ok=fallbackCopy(String(text));
    if(ok){if(btn){const old=btn.textContent;btn.textContent=T('copied');setTimeout(()=>{if(btn.isConnected)btn.textContent=old;},1400);}notify(T('copied'));}
    else notify(tr('ההעתקה נחסמה. סמן את הפקודה והעתק ידנית.','Copy was blocked. Select the command and copy it manually.'));
    return ok;
  };
  shareApp=async()=>{if(navigator.share){try{await navigator.share({title:T('brand'),url:location.href});}catch{}}else await copyText(location.href);};
  function impact(m){return !!m.dangerous||/\b(?:format|cipher\s+\/w|Clear-RecycleBin|Remove-Item|taskkill|shutdown|netsh\s+(?:winsock|int\s+ip)\s+reset|ipconfig\s+\/release|bcdedit\s+\/(?:set|delete)|vssadmin\s+delete)\b/i.test(m.value||'');}
  methodEl=(m,it)=>{
    const wrap=el('div','method'+(m.best?' best':''));
    wrap.innerHTML=`<div class="mhead"><span>${esc(L(METHOD_LABEL[m.type]||{en:m.type}))}${it?.admin?' · '+esc(T('admins')):''}</span>${m.best?`<span class="best-tag">${esc(T('best'))}</span>`:''}</div>`;
    if(m.type==='gui'){
      const p=guiPath(m);wrap.append(el('div',p?'gpath':'pcg-notice',p?String(p).split(/[←→]/).map(s=>`<span class="step">${esc(s.trim())}</span>`).join('<span aria-hidden="true"> › </span>'):esc(tr('לא תועד כאן מסלול תפריטים בגרסה ובשפת המערכת שנבחרו. אפשר לבדוק דרך אחרת למעלה או בתיעוד הרשמי.','No menu path is documented here for the selected version and system language. Use another listed method or the official documentation.'))));
    }else if(m.type==='shortcut'){
      const keys=el('div','pcg-keys');keys.innerHTML=String(m.value).split('+').map(k=>`<kbd>${esc(k.trim())}</kbd>`).join('<span>+</span>');wrap.append(keys);
    }else{
      const row=el('div','cmdrow');const code=el('code','cmd mono',esc(m.value));code.dir='ltr';const b=button(T('copy'),()=>copyText(m.value,b),'copybtn');
      row.append(code,b);
      if(impact(m)){
        const lab=el('label','pcg-check pcg-copy-review');lab.innerHTML=`<input type="checkbox">${esc(tr('קראתי את ההשלכות ואת ההכנות לפני העתקת הפקודה','I have read the consequences and preparation before copying'))}`;
        b.disabled=true;lab.querySelector('input').onchange=e=>{b.disabled=!e.target.checked;};wrap.append(lab);
      }
      wrap.append(row);
      wrap.append(el('p','pcg-caption',esc(m.type==='run'?tr('פותחים Win + R ומדביקים בשדה ההפעלה.','Open Win + R and paste into Run.'):tr('מעתיקים רק את הפקודה, בלי סימן ההנחיה. המדריך אינו מריץ אותה.','Copy only the command, without a prompt character. This guide does not run it.'))));
    }
    return wrap;
  };
  renderItem=(c,id)=>{
    const it=ITEMS.find(i=>i.id===id);if(!it)return;c.append(backBtn());
    const d=el('article','detail');const head=el('div','pcg-detail-head');head.append(el('h1',null,esc(L(it.title))));
    const favorite=button(isFav(id)?'★':'☆',()=>{toggleFav(id);favorite.textContent=isFav(id)?'★':'☆';favorite.setAttribute('aria-pressed',String(isFav(id)));},'favbtn');favorite.setAttribute('aria-label',T('favs'));favorite.setAttribute('aria-pressed',String(isFav(id)));head.append(favorite);d.append(head,el('p','sub',esc(L(it.desc))));
    d.append(el('div','risk-banner '+it.risk,esc(riskText(it.risk))+' · '+esc(verLabel(P.winVer))+(it.admin?' · '+esc(T('admins')):'')));
    const block=(label,text,cls='txt')=>{if(!text)return;const b=el('section','block');b.append(el('h2',null,esc(label)),el('div',cls,esc(text)));d.append(b);};
    block(T('before'),L(it.before),'warnbox txt');if(it.archNote)block(T('archNote'),L(it.archNote),'pcg-notice txt');
    block(tr('איפה מבצעים?','Where do you do this?'),tr('בדוק את סוג הכלי שמופיע מעל הפקודה. פקודת PowerShell אינה בהכרח מתאימה ל־CMD. פתיחת כלי ניהול לבדה אינה מבצעת את כל הפעולות המוצגות בתוכו.','Check the tool named above the command. A PowerShell command may not work in CMD. Opening a management tool does not perform the actions available inside it.'));
    const methods=bestMethods(it);if(!methods.length)d.append(el('div','warnbox',esc(tr('לא הוגדרה דרך מתאימה לפרטי הפרופיל שנבחרו. בחר פרופיל מתאים או עיין במקור הרשמי.','No method is listed for the selected profile details. Choose the appropriate profile or consult the official documentation.'))));
    methods.forEach(m=>d.append(methodEl(m,it)));
    block(T('expectedOk'),L(it.expectedOk),'okbox txt');
    if(it.onError?.length){const b=el('section','block');b.append(el('h2',null,esc(T('onError'))));it.onError.forEach(e=>b.append(el('div','errbox txt',`<b>${esc(L(e.when))}</b><br>${esc(L(e.fix))}`)));d.append(b);}
    block(T('undo'),L(it.undo));
    if(it.source)d.append(sourceLink(it.source));
    const lessons=learning.lessons.filter(l=>l.itemIds.includes(id));if(lessons.length){const related=el('div','pcg-actions');lessons.forEach(l=>related.append(button(tr('תרגול: ','Practice: ')+L(l.title),()=>go('lesson',l.id))));d.append(related);}
    c.append(d);
  };
  renderTree=(c,id)=>{
    const t=TREES.find(t=>t.id===id);if(!t)return;c.append(backBtn());heading(c,L(t.title),L(t.intro));
    if(compatState(t.compat)==='no'){
      c.append(el('div','warnbox',esc(tr('המסלול הזה נכתב ל־Windows 10/11. אין להשליך את מסלולי ההגדרות שבו על גרסאות ישנות. אפשר לעיין בפקודות המתאימות לפרופיל שלך.','This flow was written for Windows 10/11. Its Settings paths should not be assumed to work on older versions. You can browse commands for your selected profile.'))),button(tr('עיון בקטלוג','Browse catalog'),()=>go('search','')));return;
    }
    lifecycle(c);
    c.append(el('p','pcg-notice',esc(tr('השלבים הם מדריך לבדיקה ידנית. סימון השלמה מציין מה בדקת — הוא אינו אבחון של המחשב. אם הבעיה נפתרה, אין צורך לבצע את יתר השלבים.','These are manual checks. Completion marks record what you checked; they do not diagnose your computer. If the issue is resolved, stop without performing the remaining steps.'))));
    let state=flowState(json('pcg_flows',{}));let selected=state[id]||[];
    const summary=el('div','pcg-progress');const count=el('span');const meter=document.createElement('progress');meter.max=t.steps.length;meter.setAttribute('aria-label',tr('שלבים שבדקתי','Steps checked'));summary.append(count,meter);c.append(summary);
    const update=()=>{count.textContent=selected.length+' / '+t.steps.length+' '+tr('שלבים נבדקו','steps checked');meter.value=selected.length;};update();
    t.steps.forEach((s,index)=>{
      const d=el('section','tstep');d.append(el('div','pcg-eyebrow',tr('שלב ','STEP ')+String(index+1).padStart(2,'0')),el('h2','do',esc(L(s.do))));
      if(s.cmd)d.append(methodEl({type:s.shell||'cmd',value:s.cmd},s));
      d.append(el('p','check',esc(L(s.check))));
      const lab=el('label','pcg-check');lab.innerHTML=`<input type="checkbox" ${selected.includes(index)?'checked':''}>${esc(tr('בדקתי את השלב הזה','I checked this step'))}`;
      lab.querySelector('input').onchange=e=>{const next=e.target.checked?[...selected,index]:selected.filter(i=>i!==index);if(persist('pcg_flows',{...state,[id]:next})){selected=next;state[id]=next;update();}else e.target.checked=!e.target.checked;};d.append(lab);c.append(d);
    });
    c.append(button(tr('איפוס ההתקדמות במסלול','Reset this flow’s progress'),()=>{delete state[id];if(persist('pcg_flows',state))render('tree',id);},'btn ghost'),sourceLink(t.source));
  };
  function renderLearn(c){
    c.append(backBtn());heading(c,tr('לומדים דרך דוגמאות','Learn through examples'),tr('שישה תרגולים קצרים: להבין מה הפקודה עושה, מה הפלט אומר ומה עדיין לא ידוע.','Six short exercises: what the command does, what the output means and what remains unknown.'));
    const done=completed();const progress=el('div','pcg-progress');progress.innerHTML=`<strong>${done.length} / ${learning.lessons.length} ${esc(tr('תרגולים הושלמו','exercises completed'))}</strong><progress max="${learning.lessons.length}" value="${done.length}" aria-label="${esc(tr('התקדמות בלמידה','Learning progress'))}"></progress>`;c.append(progress);
    const grid=el('div','pcg-lesson-grid');learning.lessons.forEach((l,i)=>{const b=button('',()=>go('lesson',l.id),'pcg-lesson-card');b.innerHTML=`<span class="pcg-eyebrow">${String(i+1).padStart(2,'0')} ${done.includes(l.id)?'✓':''}</span><strong>${esc(L(l.title))}</strong><span>${esc(L(l.intro))}</span><b>${esc(tr('פתיחת התרגול','Open exercise'))} ↗</b>`;grid.append(b);});c.append(grid);
    c.append(el('h2','sectitle',esc(tr('מילון קצר','Quick glossary'))));
    const glossary=el('dl','pcg-glossary');learning.glossary.forEach(g=>{glossary.append(el('dt',null,esc(L(g.term))),el('dd',null,esc(L(g.definition))));});c.append(glossary);
  }
  function renderLesson(c,id){
    const lesson=learning.lessons.find(l=>l.id===id);if(!lesson)return;c.append(backBtn());heading(c,L(lesson.title),L(lesson.intro));
    const terminal=el('section','pcg-terminal');terminal.innerHTML=`<div class="pcg-terminal-bar"><span>● ● ●</span><strong>${esc(lesson.terminal.shell)}</strong><span>${esc(tr('פלט לדוגמה בלבד','Example output only'))}</span></div><div class="pcg-terminal-code"><code dir="ltr">&gt; ${esc(lesson.terminal.command)}</code><pre dir="ltr">${esc(L(lesson.terminal.output))}</pre></div>`;c.append(terminal);
    c.append(el('p','pcg-caption',esc(tr('הפלט הוכן מראש לצורך התרגול. לא נקרא מידע מהמחשב שלך ולא הופעלה פקודה.','This output was prepared for the exercise. No data was read from your PC and no command was executed.'))));
    if(['address','timeout'].includes(id)){
      const diagram=el('figure','pcg-network');diagram.setAttribute('aria-label',tr('מסלול תקשורת: מחשב, נתב, אינטרנט ושירות היעד','Communication path: computer, router, internet and destination service'));
      [[tr('המחשב','Your PC'),tr('תצורת המתאם','Adapter configuration')],[tr('הנתב','Router'),tr('שער ברירת מחדל','Default gateway')],[tr('האינטרנט','Internet'),tr('הדרך אל היעד','Route to destination')],[tr('השירות','Service'),tr('האתר או השרת','Website or server')]].forEach(([label,sub],i)=>{if(i)diagram.append(el('span','pcg-network-arrow','↔'));diagram.append(el('div','pcg-network-node',`<b>${esc(label)}</b><span>${esc(sub)}</span>`));});c.append(diagram);
    }
    const quiz=el('section','detail pcg-quiz');quiz.append(el('h2',null,esc(L(lesson.question))));const feedback=el('div','pcg-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
    const options=el('div','pcg-choices');lesson.choices.forEach((ch,index)=>{
      const b=button(L(ch.label),()=>{options.querySelectorAll('button').forEach(btn=>{btn.classList.remove('correct','incorrect');btn.setAttribute('aria-pressed','false');});b.classList.add(ch.correct?'correct':'incorrect');b.setAttribute('aria-pressed','true');feedback.className='pcg-feedback '+(ch.correct?'okbox':'warnbox');feedback.textContent=(ch.correct?'':tr('כדאי לנסות שוב. ','Try again. '))+L(ch.feedback);if(ch.correct){const done=completed();if(!done.includes(id))persist('pcg_learning',[...done,id]);}},'choice');b.setAttribute('aria-pressed','false');options.append(b);
    });quiz.append(options,feedback);c.append(quiz);
    const related=el('div','pcg-actions');lesson.itemIds.forEach(itemId=>{const it=ITEMS.find(i=>i.id===itemId);if(it)related.append(button(L(it.title),()=>go('item',it.id)));});c.append(related,sourceLink(lesson.source));
    const next=learning.lessons[learning.lessons.indexOf(lesson)+1];c.append(button(next?tr('לתרגול הבא ←','Next exercise →'):tr('בחזרה למרכז הלמידה','Back to learning'),()=>go(next?'lesson':'learn',next?.id),'btn primary'));
  }
  const originalRender=render;
  render=(screen,param)=>{
    if(['learn','lesson'].includes(screen)){app().replaceChildren();updateChip();document.getElementById('brandName').textContent=T('brand');screen==='learn'?renderLearn(app()):renderLesson(app(),param);}else originalRender(screen,param);
    if(screen!=='search'){const h=app().querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
    document.title=T('brand')+' · AppNest';
    const header=document.querySelector('header');if(header){const labels={"openThemes()":tr('ערכת צבע','Color theme'),"go('settings')":tr('הגדרות','Settings'),"go('about')":tr('אודות','About')};header.querySelectorAll('button[onclick]').forEach(b=>{const label=labels[b.getAttribute('onclick')];if(label){b.title=label;b.setAttribute('aria-label',label);}});}
    const assistantButton=document.getElementById('appnest-assistant-btn');if(assistantButton)assistantButton.textContent=tr('🪄 עוזר','🪄 Assistant');
  };
  const originalSettings=renderSettings;
  renderSettings=c=>{
    c.replaceChildren();originalSettings(c);
    c.querySelectorAll('input[id^=ai_]').forEach(i=>{const label=i.closest('div')?.previousElementSibling?.textContent;if(label)i.setAttribute('aria-label',label);});
    const notice=el('p','pcg-notice',esc(tr('הגיבוי כולל פרופיל, מועדפים והתקדמות. הוא אינו כולל מפתחות API או שיחות. ייבוא מחליף את הנתונים האלה בלבד.','Backups include your profile, favorites and progress. API keys and conversations are excluded. Import replaces only the included data.')));c.querySelector('#bkExport').parentElement.before(notice);
    c.querySelector('#bkExport').onclick=()=>{
      const data={app:'pcguide',version:APP_VERSION,exported:new Date().toISOString(),profile:profile(P),theme:document.documentElement.dataset.theme,favs:favs(),learning:completed(),flows:flowState(json('pcg_flows',{})),routes:window.PCG_STATE.routes(json('pcg_routes',{})),scenarios:window.PCG_STATE.scenarioProgress(json('pcg_scenarios',{}))};
      const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='pcguide-backup.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
    };
    c.querySelector('#bkImport').onclick=()=>{
      document.getElementById('backupFile')?.remove();const input=document.createElement('input');input.id='backupFile';input.type='file';input.accept='.json,application/json';input.hidden=true;document.body.append(input);
      input.onchange=async()=>{try{const file=input.files?.[0];if(!file)return;if(file.size>1048576)throw Error('size');const parsed=JSON.parse(await file.text());applyBackup(parsed);go('home');notify(tr('הגיבוי נטען בהצלחה','Backup restored'));}catch{notify(tr('הגיבוי אינו תקין או שלא ניתן לשמור אותו. הנתונים הקיימים נשמרו.','The backup is invalid or could not be saved. Existing data was preserved.'));}finally{input.remove();}};
      input.oncancel=()=>input.remove();input.click();
    };
    c.querySelector('#clearAll').onclick=()=>{
      if(!confirm(tr('למחוק את הפרופיל, המועדפים, ההתקדמות, מפתחות ה־API ושיחת העוזר השמורים בדפדפן הזה?','Delete the profile, favorites, progress, API keys and assistant conversation stored in this browser?')))return;
      window.AppNestAssistant?.clearHistory();
      ['pcg_profile','pcg_theme','pcg_favs','pcg_ai','pcg_setup','pcg_onboarded','pcg_learning','pcg_flows','pcg_routes','pcg_scenarios','appnest_asst_hist_מדריך המחשב'].forEach(k=>store.del(k));
      P={...defaults};aiSel=null;applyDir();applyTheme('gold');stack=[{screen:'home'}];render('home');openSetup();notify(tr('הנתונים המקומיים נמחקו','Local data cleared'));
    };
    const privacy=el('p','pcg-caption',esc(tr('העוזר שולח לספק הנבחר את השאלה, הקשר המדריך וחלק מהשיחה. הכתבה קולית תלויה בדפדפן ועשויה להשתמש בשירות זיהוי דיבור חיצוני.','The assistant sends your question, guide context and recent conversation to the selected provider. Voice input depends on the browser and may use an external speech service.')));privacy.append(document.createTextNode(' '));const link=el('a','src',esc(tr('פרטיות ונתונים','Privacy & data')));link.href='privacy_policy.html?lang='+P.uiLang;privacy.append(link);c.append(privacy);
  };
  const originalAbout=renderAbout;
  renderAbout=c=>{originalAbout(c);c.append(el('div','pcg-notice',esc(tr('גרסה 3 מוסיפה מסלולים מסתעפים, תרחישי תרגול, דוגמאות פלט ותנאי תאימות. ההוראות הן מדריך כללי: שמות תפריטים וזמינות כלים משתנים בין מהדורות, ארגונים ועדכונים. תכונות העוזר החכם דורשות חיבור נפרד ורשת.','Version 3 adds branching flows, practice scenarios, example output and compatibility conditions. These are general instructions: menu names and tool availability vary by edition, organization and update. The optional AI assistant requires a separate connection and network.'))));};
  const originalSetup=renderSetup;
  renderSetup=()=>{
    if(draft.winVer==='win11'&&draft.arch==='x86')draft.arch='x64';originalSetup();
    document.querySelectorAll('#modal button').forEach(b=>{if(b.textContent==='32-bit (x86)'){b.disabled=draft.winVer==='win11';if(b.disabled)b.title=tr('Windows 11 אינו זמין בגרסת x86 של 32 סיביות','Windows 11 is not available as 32-bit x86');}});
  };
  // Convert legacy clickable surfaces and dialogs into keyboard-accessible controls.
  function accessible(container){
    container.querySelectorAll('div[onclick],div.sw').forEach(e=>{e.setAttribute('role','button');e.tabIndex=0;e.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();e.click();}};});
    container.querySelectorAll('.sw').forEach(e=>e.setAttribute('aria-label',e.title));
  }
  accessible(document.querySelector('header')||document.body);
  let returnFocus=null;
  const modal=document.getElementById('modal');
  new MutationObserver(()=>{
    const sheet=modal.querySelector('.sheet');if(!sheet)return;
    if(!returnFocus||!returnFocus.isConnected)returnFocus=document.activeElement;
    sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');const h=sheet.querySelector('h2');if(h){h.id='dialogTitle';sheet.setAttribute('aria-labelledby',h.id);}accessible(sheet);
    sheet.tabIndex=-1;if(!sheet.contains(document.activeElement))sheet.focus();
  }).observe(modal,{childList:true});
  const originalClose=closeModal;
  closeModal=()=>{originalClose();if(returnFocus?.isConnected)returnFocus.focus();returnFocus=null;};
  modal.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeModal();return;}
    if(e.key!=='Tab')return;const list=[...modal.querySelectorAll('button:not(:disabled),input:not(:disabled),select,a[href],[tabindex="0"]')].filter(n=>n.offsetParent!==null);if(!list.length)return;
    const first=list[0],last=list[list.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement.classList.contains('sheet'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  window.APPNEST_ASSISTANT_CONFIG.tabs.push({name:'למידה ותרגול / Learn',screen:'learn'});
  window.PCG.ready=true;
})();
