/* Pure validation and compatibility functions. Never inspect or change the host OS. */
window.PCG_STATE=(()=>{
  'use strict';
  const D=(he,en)=>({he,en});
  const defaults={uiLang:'he',sysLang:'he',winVer:'win11',arch:'x64',edition:'unknown',build:'',ps:'unknown',winget:'unknown',modulesKnown:false,modules:[]};
  const enums={uiLang:['he','en'],sysLang:['he','en'],winVer:['xp','vista','win7','win8','win81','win10','win11'],arch:['x86','x64','arm64'],edition:['unknown','home','pro','enterprise','education'],ps:['unknown','winps51','ps7','older'],winget:['unknown','yes','no']};
  const isObject=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
  function profile(value,strict=false){
    if(!isObject(value)){if(strict)throw Error('profile');value={};}
    const result={...defaults,modules:[]};
    for(const [key,values] of Object.entries(enums)){
      if(values.includes(value[key]))result[key]=value[key];
      else if(strict&&(value[key]!==undefined||['uiLang','sysLang','winVer','arch'].includes(key)))throw Error('profile:'+key);
    }
    const build=value.build==null?'':String(value.build).trim();
    if(build===''||/^\d{4,6}$/.test(build))result.build=build;else if(strict)throw Error('build');
    if(value.modulesKnown!==undefined&&typeof value.modulesKnown!=='boolean'&&strict)throw Error('modulesKnown');
    result.modulesKnown=value.modulesKnown===true;
    if(value.modules!==undefined){
      if(!Array.isArray(value.modules)||value.modules.length>100||value.modules.some(m=>typeof m!=='string'||!/^[a-zA-Z0-9_.-]{1,80}$/.test(m))){if(strict)throw Error('modules');}
      else result.modules=[...new Set(value.modules.map(m=>m.toLowerCase()))];
    }
    if(result.winVer==='win11'&&result.arch==='x86'){if(strict)throw Error('architecture');result.arch='x64';}
    if(result.arch==='arm64'&&!['win10','win11'].includes(result.winVer)){if(strict)throw Error('architecture');result.arch='x64';}
    if(result.build&&((result.winVer==='win11'&&Number(result.build)<22000)||(result.winVer==='win10'&&(Number(result.build)<10240||Number(result.build)>=22000)))){if(strict)throw Error('build-version');result.build='';}
    return result;
  }
  const requirements={
    'sys-gpedit':{editions:['pro','enterprise','education'],source:'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows'},
    'sec-secpol':{editions:['pro','enterprise','education'],source:'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/security-policy-settings'},
    'sec-lusrmgr':{editions:['pro','enterprise','education'],source:'https://www.microsoftpressstore.com/articles/article.aspx?p=3128863'},
    'sys-winget':{minBuild:17763,features:['winget'],source:'https://learn.microsoft.com/en-us/windows/package-manager/winget/'},
    'sys-startup-settings':{note:D('זמינות דף אפליקציות האתחול תלויה בגרסת העדכון. אם אינו נפתח, השתמש בכרטיסיית האתחול במנהל המשימות.','Startup Settings availability depends on your Windows release. If it does not open, use Task Manager’s Startup tab.'),source:'https://learn.microsoft.com/en-us/windows/apps/develop/launch/launch-settings'},
    'net-testconn':{modules:['NetTCPIP'],source:'https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection'},
    'disk-getvolume':{modules:['Storage'],source:'https://learn.microsoft.com/en-us/powershell/module/storage/get-volume'},
    'disk-health':{modules:['Storage'],source:'https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk'},
    'sec-defstatus':{modules:['Defender'],source:'https://learn.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus'},
    'sec-quickscan':{modules:['Defender'],source:'https://learn.microsoft.com/en-us/powershell/module/defender/start-mpscan'},
    'sec-updatedefs':{modules:['Defender'],source:'https://learn.microsoft.com/en-us/powershell/module/defender/update-mpsignature'}
  };
  function compatibility(item,p){
    const reasons=[],needs=[],r={...(requirements[item.id]||{}),...(item.requirements||{})};
    let status='listed';
    const blocked=(he,en)=>{status='blocked';reasons.push(D(he,en));};
    const conditional=(he,en)=>{if(status!=='blocked')status='conditional';reasons.push(D(he,en));};
    if(!item.compat||!['yes','partial'].includes(item.compat[p.winVer]))blocked('הכלי אינו מתועד במדריך עבור גרסת Windows שבחרת.','This tool is not listed in the guide for your Windows version.');
    else if(item.compat[p.winVer]==='partial')conditional('קיימים הבדלים או תנאים בגרסה הזאת. עיין בהנחיות של הכלי.','This Windows version has differences or conditions. Read the tool’s instructions.');
    if(r.editions&&['win10','win11'].includes(p.winVer)){
      needs.push(D('מהדורות: '+r.editions.join(', '),'Editions: '+r.editions.join(', ')));
      if(p.edition==='unknown')conditional('מהדורת Windows לא נבחרה; הכלי תלוי במהדורה.','Windows edition is unknown; availability depends on the edition.');
      else if(!r.editions.includes(p.edition))blocked('הכלי הזה אינו כלול במהדורת Windows שבפרופיל.','This tool is not included in the selected Windows edition.');
    }
    if(r.minBuild&&['win10','win11'].includes(p.winVer)){
      needs.push(D('Build מינימלי: '+r.minBuild,'Minimum build: '+r.minBuild));
      if(!p.build)conditional('מספר Build לא הוזן. יש לבדוק אם גרסת העדכון עומדת בדרישה.','Build number is unknown. Check that the Windows release meets the requirement.');
      else if(Number(p.build)<r.minBuild)blocked('מספר ה־Build שנבחר מוקדם מהדרישה של הכלי.','The selected build is older than the tool requires.');
    }
    if(r.arches){needs.push(D('ארכיטקטורה: '+r.arches.join(', '),'Architecture: '+r.arches.join(', ')));if(!r.arches.includes(p.arch))blocked('הארכיטקטורה שנבחרה אינה כלולה בדרישות הכלי.','The selected architecture is not included in this tool’s requirements.');}
    if(r.ps){
      needs.push(D('PowerShell: '+r.ps.join(', '),'PowerShell: '+r.ps.join(', ')));
      if(p.ps==='unknown')conditional('גרסת PowerShell לא נבחרה; בדוק אותה לפני השימוש.','PowerShell version is unknown; check it before use.');
      else if(!r.ps.includes(p.ps))blocked('תחביר זה דורש גרסת PowerShell אחרת מזו שנבחרה.','This form requires a different PowerShell version from the one selected.');
    }
    if(r.modules?.length){
      const missing=r.modules.filter(m=>!p.modules.some(x=>x.toLowerCase()===m.toLowerCase()));
      needs.push(D('מודולים: '+r.modules.join(', '),'Modules: '+r.modules.join(', ')));
      if(!p.modulesKnown)conditional('זמינות המודולים לא נבדקה בפרופיל. אפשר לבדוק עם Get-Module -ListAvailable.','Module availability is unknown. You can inspect it with Get-Module -ListAvailable.');
      else if(missing.length)blocked('ברשימת המודולים שהזנת חסרים: '+missing.join(', '),'Your entered module list is missing: '+missing.join(', '));
    }
    if(r.features?.includes('winget')){
      needs.push(D('נדרש App Installer עם winget זמין','Requires App Installer with winget available'));
      if(p.winget==='unknown')conditional('זמינות winget לא ידועה; מספר Build מתאים לבדו אינו מספיק.','Winget availability is unknown; a compatible build alone is not sufficient.');
      else if(p.winget==='no')blocked('סימנת ש־winget אינו זמין במחשב.','You marked winget as unavailable on this PC.');
    }
    if(r.note)reasons.push(r.note);
    return {status,reasons,needs,source:r.source||item.source,requirements:r};
  }
  function routes(value,strict=false){
    if(!isObject(value)){if(strict)throw Error('routes');return {};}
    const result={};const flows=window.PCG_PATHS?.flows||[];
    for(const [id,history] of Object.entries(value)){
      const flow=flows.find(f=>f.id===id);
      if(!flow||!Array.isArray(history)||history.length>50){if(strict)throw Error('route');continue;}
      let node=flow.start;const valid=[];
      for(const choice of history){
        const next=flow.nodes[node]?.choices?.[choice]?.next;
        if(!Number.isInteger(choice)||choice<0||!next||!flow.nodes[next]){if(strict)throw Error('route-choice');break;}
        valid.push(choice);node=next;
      }
      result[id]=valid;
    }
    return result;
  }
  function currentNode(flow,history){let id=flow.start;for(const c of history||[]){const next=flow.nodes[id]?.choices?.[c]?.next;if(!next||!flow.nodes[next])break;id=next;}return id;}
  function scenarioProgress(value,strict=false){
    if(!isObject(value)){if(strict)throw Error('scenarios');return {};}
    const result={};
    for(const [id,count] of Object.entries(value)){
      const s=window.PCG_PATHS?.scenarios.find(s=>s.id===id);
      if(!s||!Number.isInteger(count)||count<0||count>s.steps.length){if(strict)throw Error('scenario-progress');continue;}
      result[id]=count;
    }
    return result;
  }
  return {defaults,enums,profile,compatibility,routes,currentNode,scenarioProgress,isObject};
})();
