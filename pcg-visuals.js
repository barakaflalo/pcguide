/* PC Guide: native learning diagrams and attributed, unmodified Microsoft screenshots.
 * All displayed device names, percentages and states in diagrams are examples.
 * Nothing in this module reads or changes the operating system.
 */
window.PCG_VISUALS = (() => {
  'use strict';
  const L = (he, en) => ({ he, en });
  const tr = (value, lang) => typeof value === 'string' ? value : value[lang] || value.en;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  let sequence = 0;
  const scriptURL = document.currentScript && document.currentScript.src;
  const assetRoot = new URL('assets/windows-guides/', scriptURL || document.baseURI);
  const support = 'https://support.microsoft.com/en-us/windows/';
  const source = {
    network: support + 'experience/connectivity-networking/essential-network-settings-and-tasks-in-windows',
    device: support + 'hardware/drivers/error-codes-in-device-manager-in-windows',
    disk: support + 'experience/storage-filemanagement/disk-management-in-windows',
    sound: support + 'hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
    soundImages: support + 'hardware/audio/fix-sound-or-audio-problems-in-windows',
    update: support + 'deployment/updates-lifecycle/install-windows-updates',
    permissions: support + 'privacy/turn-on-app-permissions-for-your-microphone-in-windows',
    backup: support + 'experience/backup-recovery/back-up-and-restore-with-windows-backup',
    backupImage: support + 'experience/backup-recovery/windows-backup-settings-catalog',
    backupTypes: support + 'experience/backup-recovery/backup-restore-and-recovery-in-windows',
    bluetooth: support + 'hardware/bluetooth/turn-bluetooth-on-or-off-in-windows',
    task: support + 'experience/performance-optimization/tips-to-improve-pc-performance-in-windows'
  };
  const paths = {
    network: {
      win10: L('התחל ← הגדרות ← רשת ואינטרנט', 'Start → Settings → Network & Internet'),
      win11: L('התחל ← הגדרות ← רשת ואינטרנט', 'Start → Settings → Network & internet')
    },
    'device-manager': {
      all: L('בחיפוש של התחל: מנהל ההתקנים ← ההתקן ← מאפיינים', 'Start search: Device Manager → device → Properties')
    },
    'disk-management': {
      all: L('לחיצה ימנית על התחל ← ניהול דיסקים', 'Right-click Start → Disk Management')
    },
    sound: {
      win10: L('לחיצה ימנית על סמל הרמקול ← פתח מערבל עוצמה', 'Right-click the Volume icon → Open Volume mixer'),
      win11: L('התחל ← הגדרות ← מערכת ← צליל ← מערבל עוצמה', 'Start → Settings → System → Sound → Volume mixer')
    },
    update: {
      win10: L('התחל ← הגדרות ← עדכון ואבטחה ← Windows Update', 'Start → Settings → Update & Security → Windows Update'),
      win11: L('התחל ← הגדרות ← Windows Update', 'Start → Settings → Windows Update')
    },
    permissions: {
      win10: L('התחל ← הגדרות ← פרטיות ← מיקרופון', 'Start → Settings → Privacy → Microphone'),
      win11: L('התחל ← הגדרות ← פרטיות ואבטחה ← מיקרופון', 'Start → Settings → Privacy & security → Microphone')
    },
    backup: {
      win10: L('בחיפוש של התחל: Windows Backup', 'Start search: Windows Backup'),
      win11: L('התחל ← הגדרות ← חשבונות ← גיבוי Windows', 'Start → Settings → Accounts → Windows backup')
    },
    bluetooth: {
      win10: L('התחל ← הגדרות ← התקנים ← Bluetooth והתקנים אחרים', 'Start → Settings → Devices → Bluetooth & other devices'),
      win11: L('התחל ← הגדרות ← Bluetooth והתקנים', 'Start → Settings → Bluetooth & devices')
    },
    'task-manager': {
      all: L('Ctrl + Shift + Esc ← מנהל המשימות ← תהליכים', 'Ctrl + Shift + Esc → Task Manager → Processes')
    }
  };
  const defs = {
    network: {
      title: L('איפה החיבור נעצר?', 'Where does the connection stop?'), source: source.network, shape:'chain',
      intro: L('חיבור לנתב וגישה לאינטרנט הם שני דברים שונים.', 'A link to your router and internet access are separate checks.'),
      nodes: [
        [L('המחשב','This PC'), L('מתאם Wi-Fi או Ethernet','Wi-Fi or Ethernet adapter'), 'computer'],
        [L('הרשת המקומית','Local network'), L('הנתב שאליו התחברתם','Your connected router'), 'router'],
        [L('האינטרנט','Internet'), L('בודקים גישה לאתר מוכר','Test a familiar website'), 'globe']
      ],
      notes: [
        L('בודקים שהמתאם המתאים מופעל ושהרשת הנכונה נבחרה.', 'Check that the intended adapter is enabled and the correct network is selected.'),
        L('שם רשת או כבל מחובר מעידים על חיבור מקומי; הם אינם מבטיחים גישה לאינטרנט.', 'A network name or connected cable indicates a local link; it does not guarantee internet access.'),
        L('בודקים גם אתר נוסף ומכשיר נוסף. כך מפרידים תקלה במחשב מתקלה בנתב או בשירות.', 'Try a second website and another device to distinguish a PC issue from a router or service issue.')
      ],
      takeaway: L('מצב החיבור מופיע בראש מסך רשת ואינטרנט.', 'The connection status appears at the top of Network & internet.')
    },
    'device-manager': {
      title: L('מה ההתקן מספר לנו?', 'What is the device telling us?'), source: source.device, shape:'tree',
      intro: L('מזהים את ההתקן ואת הודעת המצב לפני שמשנים מנהל התקן.', 'Identify the device and its status message before changing a driver.'),
      nodes: [
        [L('קטגוריה: מתאמי רשת','Category: Network adapters'), L('פותחים את הקבוצה המתאימה','Expand the relevant group'), 'layers'],
        [L('מתאם לדוגמה','Example adapter'), L('סמל אזהרה? פותחים מאפיינים','Warning symbol? Open Properties'), 'chip'],
        [L('מצב התקן','Device status'), L('קוראים הודעה וקוד שגיאה','Read the message and error code'), 'info']
      ],
      notes: [
        L('הקבוצה היא סוג חומרה; השורה שמתחתיה היא ההתקן המסוים.', 'The group is a hardware category; the row beneath it is the individual device.'),
        L('רושמים את שם ההתקן המדויק. סמל אזהרה לבדו אינו מסביר מה נכשל.', 'Record the exact device name. A warning symbol alone does not explain the failure.'),
        L('במאפיינים קוראים את מצב ההתקן ואת קוד השגיאה, ומשווים להסבר הרשמי.', 'Read Device status and the error code in Properties, then compare them with the official explanation.')
      ],
      takeaway: L('דוגמה בלבד: אין כאן רשימת התקנים מהמחשב שלכם.', 'Example only: this is not an inventory of your computer.')
    },
    'disk-management': {
      title: L('דיסק מזוהה ≠ כונן נגיש', 'Detected disk ≠ accessible drive'), source: source.disk, shape:'disks',
      intro: L('מבדילים בין הדיסק הפיזי, אמצעי האחסון שבתוכו ואות הכונן.', 'Distinguish the physical disk, a volume on that disk and its drive letter.'),
      nodes: [
        [L('דיסק 1 — מקוון','Disk 1 — Online'), L('דוגמה: 500 GB','Example: 500 GB'), 'disk'],
        [L('אמצעי אחסון','Volume'), L('מערכת קבצים ומצב','File system and status'), 'folder'],
        [L('אות כונן: E:','Drive letter: E:'), L('הנתיב שמופיע בסייר','A path shown in File Explorer'), 'folder']
      ],
      notes: [
        L('מזהים את הדיסק לפי הקיבולת והדגם. מספר הדיסק לבדו אינו זיהוי בטוח.', 'Identify the disk by capacity and model. Its disk number alone is not reliable identification.'),
        L('בודקים אם יש אמצעי אחסון תקין, שטח שלא הוקצה או מערכת קבצים לא מוכרת.', 'Check whether the disk contains a healthy volume, unallocated space or an unrecognized file system.'),
        L('אמצעי אחסון יכול להופיע כאן בלי אות כונן. היעדר אות אינו הוכחה שהדיסק ריק.', 'A volume can appear here without a drive letter. A missing letter does not mean that the disk is empty.')
      ],
      takeaway: L('אם קבצים חשובים נעלמו, אין לאתחל, לפרמט או למחוק מחיצות רק כדי שיופיע כונן.', 'If important files are missing, do not initialize, format or delete partitions merely to make a drive appear.')
    },
    sound: {
      title: L('שלוש שכבות של צליל','Three layers of sound'), source: source.sound, shape:'sound',
      intro: L('בודקים את התקן הפלט, העוצמה הכללית והיישום שממנו מצפים לשמוע.', 'Check the output device, master volume and the app you expect to hear.'),
      nodes: [
        [L('התקן פלט','Output device'), L('דוגמה: אוזניות','Example: headphones'), 'speaker'],
        [L('עוצמה כללית','Master volume'), L('דוגמה: 65%','Example: 65%'), 'speaker'],
        [L('עוצמת היישום','App volume'), L('דוגמה: מושתק','Example: muted'), 'window']
      ],
      notes: [
        L('מוודאים שהצליל נשלח לרמקולים או לאוזניות שרוצים להשתמש בהם.', 'Confirm that sound is sent to the speakers or headphones you intend to use.'),
        L('עוצמה כללית גבוהה אינה מבטלת השתקה נפרדת של יישום.', 'A high master volume does not undo a separate app mute.'),
        L('אם צלילי Windows נשמעים ורק יישום אחד שקט, בודקים את העוצמה והפלט שלו במערבל.', 'If Windows sounds work but one app is silent, inspect that app’s volume and output in the mixer.')
      ],
      takeaway: L('בדקו שוב בעוצמה נוחה אחרי כל שינוי.', 'Test again at a comfortable volume after each change.')
    },
    update: {
      title: L('מבינים את שלב העדכון','Read the update stage'), source: source.update, shape:'chain',
      intro: L('הורדה, התקנה והפעלה מחדש הן תחנות שונות.', 'Downloading, installing and restarting are different stages.'),
      nodes: [
        [L('בדיקה והורדה','Check and download'), L('זמינות וחיבור לרשת','Availability and connection'), 'download'],
        [L('התקנה','Installation'), L('עוקבים אחרי המצב','Read the current status'), 'chip'],
        [L('הפעלה מחדש','Restart'), L('רק אם המערכת מבקשת','When Windows requests it'), 'refresh']
      ],
      notes: [
        L('קוראים את ההודעה המדויקת. עדכון זמין אינו בהכרח כבר מותקן.', 'Read the exact status. An available update is not necessarily installed.'),
        L('אם מוצגת שגיאה, רושמים את קוד השגיאה ושם העדכון כדי לחפש פתרון מתאים.', 'If an error appears, record its code and the update name to find relevant guidance.'),
        L('כשנדרשת הפעלה מחדש, שומרים עבודה לפני שממשיכים; אחריה חוזרים לבדוק את המצב.', 'When a restart is required, save your work first; check the status again afterward.')
      ],
      takeaway: L('מצבי הדוגמה אינם תוצאה של בדיקה במחשב שלכם.', 'These example stages are not results from your computer.')
    },
    permissions: {
      title: L('הרשאה נבדקת בכמה שכבות','Permission has several layers'), source: source.permissions, shape:'gates',
      intro: L('בדוגמה: מיקרופון מזוהה, אבל יישום עדיין אינו יכול להשתמש בו.', 'Example: the microphone is detected, but an app still cannot use it.'),
      nodes: [
        [L('גישה למיקרופון','Microphone access'), L('הרשאה במכשיר','Device access'), 'mic'],
        [L('גישה ליישומים','App access'), L('מתן גישה לקבוצת היישומים','Allow the app category'), 'layers'],
        [L('היישום הרצוי','The intended app'), L('הרשאה נפרדת, כשקיימת','Individual permission, where available'), 'window']
      ],
      notes: [
        L('בודקים שגישה למיקרופון מותרת ברמת המכשיר.', 'Check that microphone access is enabled for the device.'),
        L('בודקים את מתג הגישה ליישומים; ליישומי שולחן עבודה יש בקרה נפרדת.', 'Check the app access toggle; desktop apps have a separate access control.'),
        L('ליישומים שמופיעים ברשימה בודקים גם את המתג שלהם. בדפדפן ייתכן שצריך לאפשר גישה גם לאתר.', 'For apps listed individually, check their toggle too. A browser may also require permission for the website.')
      ],
      takeaway: L('יישום שלא מופיע ברשימה אינו בהכרח חסום; סוגי יישומים שונים משתמשים בבקרות שונות.', 'An app missing from the list is not necessarily blocked; different app types use different controls.')
    },
    backup: {
      title: L('מה מגבים, ולאן?','What is backed up, and where?'), source: source.backup, shape:'backup',
      intro: L('גיבוי תיקיות, העדפות ושחזור מערכת אינם אותו מנגנון.', 'Folder backup, preferences and System Restore serve different purposes.'),
      nodes: [
        [L('תיקיות נבחרות','Selected folders'), L('מסמכים, תמונות ועוד','Documents, pictures and more'), 'folder'],
        [L('OneDrive / חשבון','OneDrive / account'), L('סנכרון תיקיות והעדפות','Folder sync and preferences'), 'cloud'],
        [L('בדיקת שחזור','Restore check'), L('פותחים קובץ לדוגמה','Open a sample file'), 'check']
      ],
      notes: [
        L('בוחרים במפורש אילו תיקיות כלולות. גיבוי זה אינו צילום מלא של כל הדיסק.', 'Choose the included folders explicitly. This backup is not a complete disk image.'),
        L('Windows Backup לצרכנים משתמש בחשבון Microsoft אישי. בודקים חשבון, מקום זמין ומצב סנכרון.', 'Consumer Windows Backup uses a personal Microsoft account. Check the account, available space and sync status.'),
        L('מוודאים שקובץ מוכר קיים וניתן לפתיחה מהגיבוי. לקבצים חשובים שומרים גם עותק נפרד.', 'Confirm that a known file exists and opens from the backup. Keep an additional independent copy of important files.')
      ],
      takeaway: L('נקודת שחזור מערכת אינה גיבוי של המסמכים האישיים.', 'A System Restore point is not a backup of personal documents.'), extraSource: source.backupTypes
    },
    bluetooth: {
      title: L('מופעל, משויך או מחובר?','On, paired or connected?'), source: source.bluetooth, shape:'chain',
      intro: L('אלה שלושה מצבים שונים של Bluetooth.', 'These are three different Bluetooth states.'),
      nodes: [
        [L('Bluetooth מופעל','Bluetooth on'), L('המתאם זמין לפעולה','The radio is enabled'), 'bluetooth'],
        [L('המכשיר משויך','Device paired'), L('פרטי המכשיר נשמרו','The device has been remembered'), 'link'],
        [L('המכשיר מחובר','Device connected'), L('בודקים גם את הפעולה הרצויה','Also test the intended function'), 'check']
      ],
      notes: [
        L('אם מתג Bluetooth חסר, בודקים אם יש מתאם ומנהל התקן מתאים.', 'If the Bluetooth toggle is missing, check for a Bluetooth adapter and its driver.'),
        L('לשיוך ראשון צריך להפעיל מצב שיוך במכשיר לפי הוראות היצרן.', 'For first pairing, put the accessory in pairing mode using its manufacturer’s instructions.'),
        L('שיוך שמור אינו חיבור פעיל. באוזניות בודקים גם שהן נבחרו כהתקן פלט לצליל.', 'A saved pairing is not an active connection. For headphones, also check the selected sound output.')
      ],
      takeaway: L('מכשיר יכול להיות משויך אך כבוי, רחוק או מחובר למכשיר אחר.', 'A paired accessory may be powered off, out of range or connected elsewhere.')
    },
    'task-manager': {
      title: L('מזהים עומס לפני שסוגרים','Identify load before closing apps'), source: source.task, shape:'tasks',
      intro: L('המספרים בטבלה הם דוגמה לקריאה, לא מדידה חיה.', 'The table contains learning examples, not live measurements.'),
      nodes: [
        [L('מעבד — CPU','Processor — CPU'), L('שימוש נוכחי לדוגמה','Example current usage'), 'chip'],
        [L('זיכרון — Memory','Memory'), L('כמות זיכרון בשימוש','Amount of memory in use'), 'layers'],
        [L('תהליך — Process','Process'), L('היישום שמופיע בשורה','The app shown in a row'), 'window']
      ],
      notes: [
        L('ממיינים לפי CPU כדי לזהות שימוש גבוה ומתמשך; קפיצה קצרה לבדה אינה תקלה.', 'Sort by CPU to identify sustained high use; a brief spike alone is not a fault.'),
        L('בודקים גם זיכרון ודיסק. אחוז CPU לבדו אינו מסביר כל האטה.', 'Check memory and disk activity too. CPU percentage alone does not explain every slowdown.'),
        L('מזהים את היישום ושומרים עבודה לפני סגירה. סיום משימה עלול לאבד עבודה שלא נשמרה.', 'Identify the app and save your work before closing it. Ending a task can lose unsaved work.')
      ],
      takeaway: L('אין לסיים תהליך רק כי שמו אינו מוכר.', 'Do not end a process merely because its name is unfamiliar.')
    }
  };

  function icon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const shapes = {
      computer: 'M4 5h24v17H4z M11 27h10 M16 22v5',
      router: 'M4 17h24v10H4z M8 17V8 M24 17V8 M8 23h1 M13 23h1 M12 8q4-4 8 0',
      globe: 'M16 3a13 13 0 1 0 0 26a13 13 0 1 0 0-26 M3 16h26 M16 3c-8 8-8 18 0 26 M16 3c8 8 8 18 0 26',
      disk: 'M4 5h24v22H4z M4 20h24 M9 24h2 M22 24h2 M16 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
      folder: 'M3 8h10l3 4h13v15H3z',
      layers: 'M3 10l13-7 13 7-13 7z M3 16l13 7 13-7 M3 22l13 7 13-7',
      chip: 'M8 8h16v16H8z M12 12h8v8h-8z M12 3v5 M20 3v5 M12 24v5 M20 24v5 M3 12h5 M3 20h5 M24 12h5 M24 20h5',
      speaker: 'M3 12h6l8-7v22l-8-7H3z M22 10q7 6 0 12 M25 5q12 11 0 22',
      window: 'M3 5h26v22H3z M3 11h26 M8 8h1 M13 8h1',
      download: 'M16 3v18 M9 14l7 7 7-7 M5 22v6h22v-6',
      refresh: 'M26 11a11 11 0 1 0 0 11 M20 11h7V4',
      mic: 'M11 4h10v15a5 5 0 0 1-10 0z M6 16v3a10 10 0 0 0 20 0v-3 M16 29v-5 M10 29h12',
      cloud: 'M8 25a7 7 0 0 1-2-14 10 10 0 0 1 19-2 8 8 0 0 1-1 16z',
      check: 'M5 16l7 7L28 7',
      bluetooth: 'M16 2v28l10-9L7 6 M7 26L26 11 16 2',
      link: 'M13 8l3-3a7 7 0 0 1 10 10l-4 4 M19 24l-3 3A7 7 0 0 1 6 17l4-4 M11 21l10-10',
      info: 'M16 3a13 13 0 1 0 0 26a13 13 0 1 0 0-26 M16 14v9 M16 8v1'
    };
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', shapes[kind] || shapes.info);
    svg.append(path);
    return svg;
  }
  function marker(number) {
    const mark = el('span','pcgv-number',String(number));
    mark.setAttribute('aria-hidden','true');
    return mark;
  }
  function noteList(notes, lang) {
    const list = el('ol', 'pcgv-notes');
    notes.forEach(note => list.append(el('li','',tr(note,lang))));
    return list;
  }
  function link(url, text) {
    const a = el('a','',text);
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    return a;
  }
  function nodeCard(def, index, lang) {
    const card = el('div','pcgv-node');
    card.append(marker(index+1),icon(def[2]),el('strong','',tr(def[0],lang)),el('span','pcgv-node-detail',tr(def[1],lang)));
    return card;
  }
  function bars(label, value, muted, lang) {
    const row=el('div','pcgv-volume');
    row.append(el('span','',label),el('b','',muted ? tr(L('מושתק','Muted'),lang) : value+'%'));
    const track=el('span','pcgv-bar');
    const fill=el('span','pcgv-bar-fill');
    fill.style.width=value+'%'; track.append(fill); track.setAttribute('aria-hidden','true');
    row.append(track); return row;
  }
  function diagram(def, lang) {
    const board=el('div','pcgv-board pcgv-'+def.shape);
    def.nodes.forEach((node,index)=>board.append(nodeCard(node,index,lang)));
    if(def.shape==='sound') {
      board.children[1].append(bars(tr(L('כללי','Master'),lang),65,false,lang));
      board.children[2].append(bars(tr(L('יישום לדוגמה','Example app'),lang),0,true,lang));
    }
    if(def.shape==='gates') {
      [true,true,false].forEach((on,index)=>{
        const state=el('span','pcgv-state'+(on?'':' pcgv-state-off'),tr(on?L('מותר בדוגמה','Allowed in example'):L('חסום בדוגמה','Blocked in example'),lang));
        board.children[index].append(state);
      });
    }
    if(def.shape==='tasks') {
      const table=el('table','pcgv-process-table');
      table.append(el('caption','',tr(L('ערכים מומצאים לצורך לימוד','Invented values for learning'),lang)));
      const head=el('thead'), row=el('tr');
      [L('3 · תהליך','3 · Process'),L('1 · מעבד','1 · CPU'),L('2 · זיכרון','2 · Memory')].forEach(h=>{
        const th=el('th','',tr(h,lang));th.scope='col';row.append(th);
      });
      head.append(row);table.append(head);
      const body=el('tbody');
      [[tr(L('יישום לדוגמה A','Example app A'),lang),'38%','620 MB'],[tr(L('יישום לדוגמה B','Example app B'),lang),'2%','180 MB']].forEach(values=>{
        const r=el('tr'); values.forEach((value,i)=>{const cell=el(i?'td':'th','',value);if(!i)cell.scope='row';else cell.dir='ltr';r.append(cell);}); body.append(r);
      });
      table.append(body);board.append(table);
    }
    return board;
  }
  function route(kind, profile, lang) {
    const box=el('div','pcgv-route');
    box.append(el('strong','',tr(L('איפה מוצאים את זה','Where to find it'),lang)));
    const displayLang = profile.sysLang === 'he' || profile.sysLang === 'en' ? profile.sysLang : (profile.uiLang === 'he' || profile.uiLang === 'en' ? profile.uiLang : lang);
    const routes=paths[kind], version=profile.winVer;
    const entries=routes.all ? [['Windows 10 / 11',routes.all]] : version==='win10'||version==='win11' ? [[version==='win10'?'Windows 10':'Windows 11',routes[version]]] : [['Windows 10',routes.win10],['Windows 11',routes.win11]];
    entries.forEach(([ver,path])=>{
      const line=el('p','pcgv-route-line');
      line.append(el('bdi','pcgv-version',ver));
      const words=el('span','',tr(path,displayLang));words.lang=displayLang;words.dir=displayLang==='he'?'rtl':'ltr';
      line.append(words);box.append(line);
    });
    box.append(el('p','pcgv-fine',tr(L('שמות ותצוגה עשויים להשתנות לפי שפת Windows, הבנייה והגדרות הארגון.','Names and layout can vary with Windows display language, build and organization settings.'),lang)));
    return box;
  }

  const screenshots = [
    {
      id:'win11-volume-mixer', kind:'sound', version:'win11', file:'win11-volume-mixer.png',
      direct:support+'media/sound-settings-volume-mixer-png.png', source:source.soundImages,
      title:L('מערבל עוצמה — Windows 11','Volume mixer — Windows 11'),
      alt:L('צילום Microsoft של מערבל העוצמה ב-Windows 11, ובו עוצמה כללית והגדרות של יישומים.','Microsoft screenshot of the Windows 11 Volume mixer showing system volume and app controls.'),
      notes:[
        L('חלק המערכת: בודקים עוצמה והתקן פלט.', 'System area: check the volume and output device.'),
        L('חלק היישומים: לכל יישום עשויה להיות עוצמה משלו.', 'Apps area: an app can have its own volume.'),
        L('סמל השתקה: בודקים אותו בנפרד מהמספר שעל המחוון.', 'Mute icon: check it separately from the slider value.')
      ]
    },
    {
      id:'win10-volume-mixer', kind:'sound', version:'win10', file:'win10-volume-mixer.png',
      direct:support+'media/volume-mixer-with-mute-volume-png.png', source:source.soundImages,
      title:L('מערבל עוצמה — Windows 10','Volume mixer — Windows 10'),
      alt:L('צילום Microsoft של מערבל העוצמה ב-Windows 10 עם עמודות נפרדות להתקן וליישומים וכפתורי השתקה.','Microsoft screenshot of the Windows 10 Volume mixer with separate device and application columns and mute controls.'),
      notes:[
        L('עמודת Device: העוצמה של התקן ההשמעה.', 'Device column: volume for the playback device.'),
        L('עמודות Applications: עוצמה נפרדת לצלילי המערכת וליישומים.', 'Applications columns: separate volume for system sounds and apps.'),
        L('בתחתית העמודות: סמלי ההשתקה מראים מה מושתק.', 'Bottom of each column: mute icons identify muted channels.')
      ]
    },
    {
      id:'win10-sound-output', kind:'sound', version:'win10', file:'win10-sound-output.png',
      direct:support+'media/sound-output-device-properties-png.png', source:source.soundImages,
      title:L('התקן פלט — Windows 10','Output device — Windows 10'),
      alt:L('צילום Microsoft של מסך Sound ב-Windows 10 ובו בחירת התקן פלט וקישור Device properties.','Microsoft screenshot of Windows 10 Sound settings showing the output device selector and Device properties link.'),
      notes:[
        L('Output: מזהים את ההתקן שיקבל את הצליל.', 'Output: identify the device that will receive sound.'),
        L('Device properties: הקישור פותח פרטים על ההתקן שנבחר.', 'Device properties: the link opens details for the selected device.'),
        L('לפני שינוי משווים את שם ההתקן לרמקולים או לאוזניות שבשימוש.', 'Before changing anything, match the device name to the speakers or headphones in use.')
      ]
    },
    {
      id:'win11-backup', kind:'backup', version:'win11', file:'win11-backup.png',
      direct:support+'media/windows-backup-settings-1.png', source:source.backupImage,
      title:L('גיבוי Windows — Windows 11','Windows backup — Windows 11'),
      alt:L('צילום Microsoft של הגדרות Accounts, Windows backup ב-Windows 11.','Microsoft screenshot of Accounts, Windows backup settings in Windows 11.'),
      notes:[
        L('OneDrive: בודקים אילו תיקיות מסונכרנות.', 'OneDrive: check which folders are synced.'),
        L('Remember my apps: רשימת יישומים לשחזור אינה גיבוי מלא של תוכנות וקבצים.', 'Remember my apps: remembering apps is not a full backup of programs and files.'),
        L('Remember my preferences: בוחרים אילו העדפות יישמרו בחשבון.', 'Remember my preferences: choose the settings to remember in the account.')
      ]
    }
  ];
  function screenshotFigure(item,lang) {
    const figure=el('figure','pcgv-screenshot');
    const heading=el('h4','',tr(item.title,lang));heading.id='pcgv-screen-'+(++sequence);
    figure.setAttribute('aria-labelledby',heading.id);figure.append(heading);
    figure.append(el('p','pcgv-fine',tr(L('צילום מסך מקורי של Microsoft • ממשק באנגלית • ההסברים לצד התמונה','Original Microsoft screenshot • English interface • explanations alongside'),lang)));
    const layout=el('div','pcgv-screenshot-layout');
    const imageLink=link(new URL(item.file,assetRoot).href,'');imageLink.className='pcgv-image-link';
    imageLink.setAttribute('aria-label',tr(L('פתיחת הצילום בגודל מלא','Open the full-size screenshot'),lang));
    const img=el('img');img.src=new URL(item.file,assetRoot).href;img.alt=tr(item.alt,lang);img.loading='lazy';img.decoding='async';
    imageLink.append(img);
    const unavailable=el('p','pcgv-image-unavailable',tr(L('התמונה אינה זמינה כאן. אפשר לפתוח את המקור של Microsoft למטה.','The image is unavailable here. Open the Microsoft source below.'),lang));
    unavailable.hidden=true;
    img.addEventListener('error',()=>{imageLink.hidden=true;unavailable.hidden=false;});
    layout.append(imageLink,unavailable,noteList(item.notes,lang));figure.append(layout);
    const caption=el('figcaption','pcgv-source');
    caption.append(document.createTextNode(tr(L('מקור: ','Source: '),lang)),link(item.source,'Microsoft Support'),document.createTextNode(' · '),link(item.direct,tr(L('התמונה המקורית','Original image'),lang)),document.createTextNode(' · © Microsoft'));
    figure.append(caption);
    return figure;
  }
  function render(kind, profile = {}, lang = 'he') {
    profile=profile||{};lang=lang==='en'?'en':'he';
    const container=el('section','pcgv-guide');container.lang=lang;container.dir=lang==='he'?'rtl':'ltr';
    const def=defs[kind];
    if(!def) {container.append(el('p','pcgv-fine',tr(L('אין תרשים לנושא זה.','No diagram is available for this topic.'),lang)));return container;}
    const figure=el('figure','pcgv-figure');
    const heading=el('h3','pcgv-heading',tr(def.title,lang));heading.id='pcgv-diagram-'+(++sequence);
    figure.setAttribute('aria-labelledby',heading.id);
    figure.append(heading,el('p','pcgv-intro',tr(def.intro,lang)));
    const caption=el('figcaption','pcgv-schematic-label',tr(L('תרשים הדרכה סכמטי — לא צילום מסך של Windows','Schematic learning diagram — not a Windows screenshot'),lang));
    figure.append(caption,diagram(def,lang),noteList(def.notes,lang),el('p','pcgv-takeaway',tr(def.takeaway,lang)));
    container.append(figure,route(kind,profile,lang));
    const citations=el('p','pcgv-source');
    citations.append(link(def.source,tr(L('הוראות Microsoft לנושא','Microsoft instructions for this topic'),lang)));
    if(def.extraSource)citations.append(document.createTextNode(' · '),link(def.extraSource,tr(L('סוגי גיבוי ושחזור','Backup and recovery types'),lang)));
    container.append(citations);
    const matching=screenshots.filter(s=>s.kind===kind&&(!['win10','win11'].includes(profile.winVer)||s.version===profile.winVer));
    if(matching.length) {
      const details=el('details','pcgv-real-screens');details.open=true;
      details.append(el('summary','',tr(L('צילומי מסך אמיתיים עם הסברים','Real screenshots with explanations'),lang)));
      matching.forEach(s=>details.append(screenshotFigure(s,lang)));
      container.append(details);
    }
    return container;
  }
  function renderScreenshotGallery(profile={},lang='he') {
    profile=profile||{};lang=lang==='en'?'en':'he';
    const gallery=el('section','pcgv-guide pcgv-gallery');gallery.lang=lang;gallery.dir=lang==='he'?'rtl':'ltr';
    screenshots.filter(s=>!['win10','win11'].includes(profile.winVer)||s.version===profile.winVer).forEach(s=>gallery.append(screenshotFigure(s,lang)));
    return gallery;
  }
  return Object.freeze({ render, renderScreenshotGallery, kinds:Object.freeze(Object.keys(defs)), screenshots:Object.freeze(screenshots.map(({id,kind,version,file,direct,source})=>Object.freeze({id,kind,version,file,direct,source}))) });
})();
