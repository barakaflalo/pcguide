/* PC Guide v3: bilingual, deterministic teaching paths.
   Commands are display-only instructions. This module never executes commands
   and never reads device information. Node IDs are stable for history/resume. */
window.PCG_PATHS = (() => {
  const d = (he, en) => ({ he, en });
  const c = (he, en, next) => ({ label: d(he, en), next });
  const n = (he, en, bh, be, choices = [], extra = {}) => ({ title: d(he, en), body: d(bh, be), choices, ...extra });
  const end = (he, en, bh, be, outcome) => n(he, en, bh, be, [], { outcome });
  const run = value => ({ type: 'run', value });
  const cmd = (value, admin = false) => ({ type: 'cmd', value, admin });
  const sources = {
    network: 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows',
    dns: 'https://learn.microsoft.com/en-us/windows-server/networking/dns/troubleshoot/troubleshoot-dns-client',
    performance: 'https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows',
    sfc: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc',
    update: 'https://support.microsoft.com/en-us/windows/deployment/updates-lifecycle/troubleshoot-problems-updating-windows',
    apps: 'https://support.microsoft.com/en-us/windows/apps/repair-apps-and-programs-in-windows',
    sound: 'https://support.microsoft.com/en-us/windows/hardware/audio/fix-sound-or-audio-problems-in-windows',
    printer: 'https://support.microsoft.com/en-us/windows/hardware/printer/fix-printer-connection-and-printing-problems-in-windows',
    usb: 'https://support.microsoft.com/en-us/windows/hardware/usb/fix-usb-c-problems-in-windows',
    disk: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/backup-and-storage/troubleshoot-disk-management',
    bluetooth: 'https://support.microsoft.com/en-us/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows',
    bluetoothAudio: 'https://support.microsoft.com/en-us/windows/hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows',
    permissions: 'https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control',
    icacls: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls',
    backup: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy',
    processes: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process?view=powershell-5.1'
  };
  const f = (id, em, he, en, ih, ie, source, nodes) => ({
    id, em, title: d(he,en), intro: d(ih,ie), compat: {win10:'yes',win11:'yes'}, start:'start', source, nodes
  });
  const flows = [
    f('t-net','🌐','אין אינטרנט או אתר לא נפתח','Internet or website trouble',
      'בדקו את אותה תקלה בכל צעד. השוו בין מכשירים ובין אתרים לפני שמסיקים מה מקור הבעיה.',
      'Retest the same symptom at each step. Compare devices and websites before locating the fault.', sources.network, {
      start:n('מה בדיוק אינו עובד?','What is failing?','נסו שני אתרים מוכרים במחשב ואת אותם האתרים במכשיר נוסף באותה רשת. במכשיר הנוסף ודאו שלא משתמשים בחיבור סלולרי.','Try two familiar websites on this PC and another device on the same network. Make sure the second device is not using cellular data.',[
        c('רק המחשב הזה אינו גולש','Only this PC cannot browse','local'), c('שני המכשירים אינם גולשים','Neither device can browse','shared'), c('רק אתר או יישום אחד נכשל','Only one site or app fails','site')],{visual:'network'}),
      local:n('בדיקת המתאם הפעיל','Inspect the active adapter','ב־ipconfig מצאו את המתאם שבשימוש, לא מתאם VPN או מתאם מנותק. בדקו מצב מדיה, IPv4 ושער ברירת מחדל. כתובת לבדה אינה מוכיחה גישה לאינטרנט.','In ipconfig find the adapter in use, not a VPN or disconnected adapter. Check media state, IPv4 and default gateway. An address alone does not establish internet access.',[
        c('המתאם מנותק או הכתובת מתחילה ב־169.254','Disconnected or address begins 169.254','link'), c('יש כתובת ושער במתאם הפעיל','The active adapter has an address and gateway','dns'), c('לא ברור איזה מתאם פעיל','I cannot identify the active adapter','help')],{command:cmd('ipconfig'),visual:'network'}),
      link:n('השוואה אחרי חיבור מחדש','Compare after reconnecting','בדקו שכבל הרשת מחובר או שהמחשב מחובר לרשת Wi‑Fi הנכונה. חברו מחדש את החיבור המתאים ובדקו שוב את אותם שני אתרים. אל תשנו הגדרות של רשת ארגונית.','Check the Ethernet cable or the selected Wi-Fi network. Reconnect the relevant connection and retest the same two websites. Leave managed network settings to your administrator.',[
        c('שני האתרים נטענים עכשיו','Both sites now load','resolved'), c('התקלה נשארה ויש כתובת ושער','Still failing; an address and gateway are present','dns'), c('עדיין אין חיבור מקומי ברור','A local connection is still missing','help')],{visual:'network'}),
      dns:n('הפרדת DNS מגלישה','Separate DNS from browsing','בדיקת שם מחזירה כתובת או שגיאה. תשובה תקינה מ־nslookup בודקת את השאילתה הזו בלבד; היא אינה בודקת דפדפן, HTTPS או כל אתר.','A name lookup returns an address or an error. A successful nslookup checks that lookup only; it does not test the browser, HTTPS or every website.',[
        c('התקבלה כתובת אבל האתרים לא נפתחים','An address returns but browsing fails','site'), c('יש timeout או כשל בתרגום השם','The lookup times out or fails','help'), c('האתרים נפתחים בבדיקה החוזרת','The websites now load on retest','resolved')],{command:cmd('nslookup microsoft.com'),visual:'network'}),
      shared:end('התקלה אינה מבודדת למחשב','The fault is not isolated to this PC','שמרו את תוצאת ההשוואה ואת מצב הנורות בנתב. פנו לבעל הרשת או לספק; עדיין לא נקבע אם מדובר בנתב, בחיבור לספק או בתקלה חיצונית.','Record the comparison and router indicator state. Contact the network owner or provider; the router, upstream connection and external service have not yet been distinguished.','escalate'),
      site:end('צמצום לאתר, ליישום או למסלול גלישה','Narrowed to a site, app or browsing path','תעדו את הכתובת, השעה והודעת השגיאה. השוו דפדפן נוסף ואתר נוסף. DNS תקין אינו שולל בעיית Proxy, תעודה, דפדפן או שרת.','Record the URL, time and exact error. Compare another browser and website. Successful DNS does not rule out a proxy, certificate, browser or server problem.','observe'),
      resolved:end('הגלישה חזרה בבדיקה','Browsing works on retest','אותם אתרים נפתחו. רשמו מה השתנה; אם התקלה חוזרת, המשיכו מהתוצאה שנצפתה במקום להניח שכל הרשת תקינה לצמיתות.','The same websites opened successfully. Record what changed; if the problem returns, resume from the observed result rather than assuming the whole network is permanently healthy.','resolved'),
      help:end('נדרש מידע נוסף על החיבור','More connection evidence is needed','שמרו את מצב המתאם ואת הודעת השגיאה. העבירו לתמיכה את ההבדל בין המחשב למכשיר השני; הסתירו פרטים אישיים לפני שיתוף פלט.','Keep the adapter state and exact error. Give support the comparison with the other device; remove personal details before sharing output.','escalate')
    }),
    f('t-slow','🐢','המחשב איטי','A slow PC',
      'מודדים בזמן שההאטה מורגשת ומשווים לאותה פעולה לאחר שינוי אחד.',
      'Measure while the slowdown is happening, then compare the same task after one change.', sources.performance, {
      start:n('מה רואים בזמן ההאטה?','What is visible during the slowdown?','פתחו את מנהל המשימות ב־Ctrl+Shift+Esc וצפו בתהליכים כחצי דקה. סדרו לפי CPU, זיכרון או דיסק. קפיצה קצרה אינה מספיקה לאבחנה.','Open Task Manager with Ctrl+Shift+Esc and watch Processes for about half a minute. Sort by CPU, memory or disk. A short spike is not a diagnosis.',[
        c('יישום מסוים נשאר בראש הרשימה','One app stays near the top','process'), c('הדיסק עמוס או המקום כמעט נגמר','Disk activity is high or space is nearly full','storage'), c('אין עומס מתמשך ברור','No sustained load stands out','timing')],{command:run('taskmgr'),visual:'task-manager'}),
      process:n('מזהים לפני שסוגרים','Identify before closing','רשמו את שם התהליך ואת המדד הגבוה. האם זה יישום שפתחתם וניתן לשמור ולסגור כרגיל? שם לא מוכר אינו הוכחה לנוזקה.','Record the process name and high metric. Is it an app you opened that can be saved and closed normally? An unfamiliar name does not prove malware.',[
        c('כן, זה יישום מוכר שאפשר לסגור','Yes, a familiar app can be closed','compare'), c('זה תהליך מערכת או שלא ברור מהו','It is a system process or unfamiliar','help')],{visual:'task-manager'}),
      compare:n('שינוי אחד והשוואה','Make one change and compare','שמרו את העבודה וסגרו את היישום מתוך התפריט שלו. חזרו על הפעולה שהייתה איטית וצפו שוב במדדים.','Save your work and close the app using its own menu. Repeat the previously slow task and observe the metrics again.',[
        c('התגובה השתפרה והעומס ירד','Responsiveness improved and load fell','resolved'), c('אין שיפור או שההאטה חוזרת','No improvement or the slowdown returns','help')],{visual:'task-manager'}),
      storage:n('קיבולת לעומת פעילות דיסק','Disk capacity versus activity','ב״מחשב זה״ בדקו מקום פנוי. במנהל המשימות בדקו פעילות. דיסק יכול להיות עמוס גם כשיש בו מקום; מקום פנוי אינו מבחן לתקינות חומרה.','Check free space in This PC and activity in Task Manager. A disk can be busy even with free space; free capacity is not a hardware health test.',[
        c('Windows מדווח על מחסור במקום','Windows reports low storage space','space'), c('יש מקום והפעילות נשארת גבוהה','Space is available but activity stays high','help'), c('הפעילות ירדה אבל עדיין איטי','Activity fell but the PC is still slow','timing')],{visual:'task-manager'}),
      timing:n('מתי ההאטה מופיעה?','When does the slowdown happen?','השוו פתיחת אותה תוכנה מיד אחרי כניסה ולכמה דקות אחר כך. רשמו את הזמנים ואת הפעולה שביצעתם.','Compare opening the same app just after sign-in and a few minutes later. Record the timings and the task performed.',[
        c('בעיקר מיד אחרי כניסה','Mainly just after sign-in','observe'), c('גם לאחר המתנה ובכמה יישומים','After waiting, in several apps too','help')]),
      space:end('קודם מתכננים פינוי מקום','Plan storage cleanup first','פתחו את הגדרות האחסון ובדקו מה תופס מקום. בחרו קבצים אישיים לפינוי רק לאחר בדיקה וגיבוי; אין להסיק שמחיקת תיקיות מערכת תפתור את ההאטה.','Review categories in Storage settings. Select personal files for cleanup only after reviewing and backing them up; deleting system folders is not a performance diagnosis.','observe'),
      observe:end('נמצא דפוס בזמן הכניסה','A sign-in pattern was observed','בדקו את רשימת יישומי האתחול ותעדו יישומים שאינכם צריכים מיד. שינוי של יישום מוכר אחד והפעלה מחדש מאפשרים השוואה; אל תשביתו שירותים לא מזוהים.','Review Startup apps and note apps not needed immediately. Changing one familiar app and restarting gives a useful comparison; do not disable unidentified services.','observe'),
      resolved:end('שיפור שנמדד','A measured improvement','הפעולה חזרה להגיב אחרי סגירת היישום. תעדו את המדד לפני ואחרי. זה מצביע על קשר לעומס היישום, ואינו מוכיח שהוא פגום.','The task became responsive after closing the app. Record before-and-after readings. This links the symptom to the app load but does not prove the app is defective.','resolved'),
      help:end('המדידה מוכנה להמשך בירור','The measurements are ready for review','שמרו שם תהליך, משך ההאטה, מדדים והפעולה האיטית. פנו לתמיכה עם הנתונים; אין צורך לסיים תהליכי מערכת כדי להשלים את האבחון.','Keep the process name, duration, metrics and slow task. Share them with support; ending system processes is not required to complete this diagnosis.','escalate')
    }),
    f('t-errors','🩺','שגיאות מערכת חוזרות','Repeated system errors',
      'מתעדים הודעה והקשר, ואז בוחרים בדיקה שמתאימה להיקף התקלה.',
      'Record the message and context, then choose a check that matches the scope.', sources.sfc, {
      start:n('האם אפשר להיכנס ל־Windows?','Can you sign in to Windows?','רשמו את נוסח השגיאה ואת השעה. האם שולחן העבודה נגיש או שהמחשב נתקע באתחול?','Record the exact error and time. Is the desktop accessible, or is the PC stuck during startup?',[
        c('אפשר להיכנס לשולחן העבודה','The desktop is accessible','scope'), c('לולאת אתחול או מסך שגיאה לפני הכניסה','A restart loop or error appears before sign-in','boot')]),
      scope:n('יישום אחד או כמה רכיבי Windows?','One app or several Windows components?','נסו פעולה פשוטה ביישום אחר. הבחינו בין קריסה של תוכנה אחת לבין שגיאות שחוזרות בכמה רכיבי מערכת.','Try a simple action in another app. Distinguish one crashing app from repeated errors across several Windows components.',[
        c('רק יישום אחד נכשל','Only one app fails','app'), c('כמה רכיבי Windows נכשלים','Several Windows components fail','verify'), c('ההודעה לא חזרה ואין דפוס ברור','The error has not returned; no clear pattern','observe')]),
      verify:n('בדיקת קובצי מערכת ללא תיקון','Check system files without repairing','בחלון CMD כמנהל ניתן להריץ sfc /verifyonly. המתינו לסיום ושמרו את ההודעה. הבדיקה אינה מתקנת קבצים ואינה בודקת את כל החומרה והיישומים.','In an administrator Command Prompt, sfc /verifyonly can check protected system files. Wait for completion and keep the message. It does not repair files or test all hardware and apps.',[
        c('דווחו הפרות תקינות','Integrity violations were reported','repair'), c('לא נמצאו הפרות תקינות','No integrity violations were found','observe'), c('הבדיקה לא הושלמה או אין הרשאת מנהל','The check did not complete or admin access is unavailable','help')],{command:cmd('sfc /verifyonly',true)}),
      repair:end('יש ממצא שדורש תיקון מתוכנן','A finding needs a planned repair','שמרו את תוצאת הבדיקה וגבו עבודה חשובה. המשך תיקון בעזרת DISM ו־SFC דורש בחירה מודעת; פנו לתיעוד או לתמיכה עם ההודעה המדויקת.','Keep the result and back up important work. Repair with DISM and SFC should be planned deliberately; use the documentation or support with the exact message.','escalate'),
      app:end('הבדיקה מצומצמת ליישום','The symptom is isolated to an app','עברו למסלול ״יישום קורס״ עם שם התוכנה, הגרסה והפעולה שגרמה לשגיאה. כשל ביישום אחד אינו מוכיח שקובצי Windows פגומים.','Use the app-crash path with the app name, version and triggering action. One failing app does not establish Windows file corruption.','observe'),
      boot:end('שומרים את קוד האתחול','Keep the startup error code','צלמו את הקוד ורשמו שינוי אחרון. לפני פעולת שחזור שמשנה נתונים, ודאו שיש גיבוי ומפתח שחזור BitLocker אם הוא נדרש; פנו לתמיכה אם המידע אינו זמין.','Capture the code and note recent changes. Before a recovery action that changes data, confirm a backup and any required BitLocker recovery key; contact support if these are unavailable.','escalate'),
      observe:end('הבדיקה אינה מסבירה את כל התקלה','The check does not explain every symptom','תעדו אם השגיאה חוזרת ובאיזו פעולה. תוצאה נקייה של SFC מוגבלת לקבצים שנבדקו; היא אינה אישור שכל המחשב תקין.','Record whether the error returns and during which action. A clean SFC result is limited to the files checked; it does not certify the entire PC.','observe'),
      help:end('ממשיכים עם ההודעה המדויקת','Continue with the exact message','שמרו את הודעת הכשל ואת סוג החלון שבו בוצעה הבדיקה. אל תחזרו שוב ושוב על אותה פקודה בלי לברר מדוע היא נעצרת.','Keep the failure message and the type of terminal used. Avoid repeatedly running the same check without establishing why it stops.','escalate')
    }),
    f('t-update','🔄','Windows Update תקוע או נכשל','Windows Update is stuck or failing',
      'מפרידים בין המתנה להפעלה מחדש, מדיניות ארגונית ושגיאת התקנה.',
      'Separate a pending restart, managed policy and an installation error.', sources.update, {
      start:n('איזה מצב מופיע ב־Windows Update?','What status does Windows Update show?','פתחו Windows Update ורשמו את שם העדכון, קוד השגיאה והמצב שמוצג כעת. אל תסיקו מהזמן שחלף בלבד שהעדכון תקוע.','Open Windows Update and note the update name, error code and current state. Elapsed time alone does not establish that an update is stuck.',[
        c('נדרשת הפעלה מחדש','Restart required','restart'), c('התקנה נכשלה או מופיע קוד שגיאה','Installation failed or an error code appears','details'), c('מושהה או מנוהל בידי הארגון','Paused or managed by the organization','policy')],{command:run('ms-settings:windowsupdate'),visual:'update'}),
      restart:n('מסיימים הפעלה ממתינה','Complete a pending restart','שמרו עבודה, חברו מחשב נייד לחשמל ובחרו בהפעלה מחדש בזמן מתאים. אחר כך חזרו ל־Windows Update ובדקו את אותו עדכון.','Save work, connect a laptop to power and restart at a suitable time. Then return to Windows Update and check the same update.',[
        c('העדכון הושלם ואינו מופיע כנכשל','The update completed and is not marked failed','resolved'), c('אותו עדכון עדיין נכשל','The same update still fails','details')],{visual:'update'}),
      details:n('קוראים את פרטי הכשל','Read the failure details','בדקו את ההודעה ליד העדכון ובהיסטוריית העדכונים. שימרו את קוד השגיאה; לא כל קוד מצביע על אותה סיבה.','Check the message beside the update and in update history. Keep the error code; different failures require different next steps.',[
        c('ההודעה מבקשת מקום פנוי','The message asks for more free space','space'), c('יש קוד אחר או כשל חוזר','There is another code or a repeated failure','helper')],{visual:'update'}),
      space:n('בודקים מקום לפני ניסיון נוסף','Check storage before retrying','פתחו את הגדרות האחסון והשוו לדרישת המקום בהודעה. בדקו קבצים לפני פינוי; אל תמחקו ידנית תיקיות Windows כדי לפנות מקום.','Open Storage settings and compare available space with the message requirement. Review files before cleanup; do not manually delete Windows folders to free space.',[
        c('יש כעת מספיק מקום לפי ההודעה','The requested space is now available','helper'), c('עדיין חסר מקום או לא בטוחים מה לפנות','Space is still low or cleanup choices are unclear','help')],{command:run('ms-settings:storagesense')}),
      helper:n('פותר הבעיות והבדיקה החוזרת','Troubleshooter and retest','פתחו Get Help וחפשו את פותר הבעיות של Windows Update. קראו כל הצעת שינוי, ואז בדקו שוב את העדכון ותעדו את התוצאה.','Open Get Help and find the Windows Update troubleshooter. Review any proposed changes, then recheck the update and record the result.',[
        c('העדכון הותקן בהצלחה','The update installed successfully','resolved'), c('נשאר כשל או שהכלי אינו זמין','The failure remains or the tool is unavailable','help')],{visual:'update'}),
      policy:end('המצב תלוי במדיניות או בהשהיה','The state depends on policy or pausing','בדקו מתי ההשהיה מסתיימת. במחשב ארגוני פנו ל־IT עם המצב שמופיע; אל תעקפו מדיניות עדכונים.','Check when the pause ends. On a managed PC, share the displayed state with IT; do not bypass update policy.','observe'),
      resolved:end('העדכון הושלם','The update completed','ודאו שהעדכון המסוים מופיע כהותקן ושאין הפעלה מחדש ממתינה. שמרו את שמו אם התקלה תחזור.','Confirm that this specific update is installed and no restart is pending. Keep its name in case the problem returns.','resolved'),
      help:end('הכשל דורש בירור ממוקד','The failure needs a targeted review','פנו לתמיכה עם שם העדכון, קוד השגיאה, מקום פנוי ותוצאת פותר הבעיות. במחשב Windows 10 בדקו גם את מצב הזכאות לעדכונים.','Contact support with the update name, code, free space and troubleshooter result. On Windows 10 also check the device’s update eligibility.','escalate')
    }),
    f('t-appcrash','🧩','יישום קורס או לא נפתח','An app crashes or will not open',
      'שומרים את שם היישום, הגרסה והפעולה המדויקת שנכשלת.',
      'Keep the app name, version and exact action that fails.', sources.apps, {
      start:n('האם כל קובץ גורם לקריסה?','Does every file trigger the crash?','פתחו את היישום בלי הקובץ הבעייתי, או צרו מסמך ריק. אל תדרסו את הקובץ המקורי בזמן הבדיקה.','Open the app without the problem file, or create a blank document. Keep the original file unchanged during the comparison.',[
        c('רק קובץ אחד גורם לקריסה','Only one file triggers it','file'), c('גם פתיחה ריקה נכשלת','A blank launch also fails','scope')]),
      file:end('התקלה קשורה לקובץ או לתוכן','The symptom follows a file or its content','שמרו עותק נפרד של המקור. השוו קובץ נוסף מאותו סוג ובדקו הוראות שחזור של היישום; עדיין לא הוכח שהיישום או הקובץ פגומים.','Keep a separate copy of the original. Compare another file of the same type and review the app’s recovery guidance; neither app nor file corruption has been established.','observe'),
      scope:n('יישומים אחרים מגיבים?','Do other apps respond?','נסו לפתוח יישום אחר ולבצע בו פעולה פשוטה. בדקו אם התקלה מוגבלת לתוכנה אחת.','Open another app and perform a simple action. Check whether the failure is limited to one program.',[
        c('יישומים אחרים עובדים','Other apps work','restart'), c('כמה יישומים או Windows נכשלים','Several apps or Windows components fail','system')]),
      restart:n('השוואה לאחר פתיחה מחדש','Compare after reopening','שמרו עבודה וסגרו את היישום כרגיל. אם נדרשת הפעלה מחדש של המחשב, שמרו גם עבודה ביישומים אחרים. נסו שוב את אותה פעולה.','Save work and close the app normally. If restarting the PC, save work in other apps too. Try the same action again.',[
        c('הפעולה מצליחה עכשיו','The action now succeeds','resolved'), c('אותה תקלה חוזרת','The same failure returns','repair')]),
      repair:n('האם קיימת אפשרות Repair?','Is Repair available?','Windows 11: הגדרות > יישומים > יישומים מותקנים. Windows 10: יישומים ותכונות. פתחו אפשרויות מתקדמות של היישום. לא לכל יישום יש Repair.','Windows 11: Settings > Apps > Installed apps. Windows 10: Apps & features. Inspect the app’s Advanced options. Repair is not available for every app.',[
        c('בוצע Repair והפעולה מצליחה','Repair was used and the action succeeds','resolved'), c('אין Repair או שהוא לא פתר','Repair is unavailable or did not help','help')],{command:run('ms-settings:appsfeatures')}),
      system:end('כדאי לבדוק את היקף המערכת','Check the wider system scope','עברו למסלול שגיאות מערכת עם שמות היישומים שנכשלו וההודעות המדויקות. קריסה משותפת עדיין אינה מצביעה על רכיב מסוים.','Use the system-errors path with the names of affected apps and exact messages. Shared failures still do not identify a specific component.','observe'),
      resolved:end('הפעולה נבדקה בהצלחה','The action passed the retest','נסו את הפעולה המקורית ושמרו את התוצאה. אם הקריסה חוזרת, צרפו לתמיכה גם את הצעד שהביא לשיפור זמני.','Retest the original action and keep the result. If the crash returns, include the step that produced temporary improvement when contacting support.','resolved'),
      help:end('שומרים נתונים לפני Reset או התקנה מחדש','Preserve data before Reset or reinstalling','רשמו גרסה והודעת שגיאה ופנו לתמיכת היישום. בדקו כיצד מגבים את הנתונים וההגדרות שלו לפני Reset או הסרה.','Record the version and error and contact the app’s support. Establish how to back up its data and settings before Reset or uninstalling.','escalate')
    }),
    f('t-sound','🔊','אין צליל','No sound',
      'מפרידים בין פלט Windows, עוצמת היישום והתקן השמע.',
      'Separate Windows output, app volume and the audio device.', sources.sound, {
      start:n('התקן הפלט הנכון נבחר?','Is the intended output selected?','פתחו הגדרות שמע. בדקו שהרמקול או האוזניות הרצויים נבחרו, שהעוצמה אינה אפס ושאין השתקה.','Open Sound settings. Check that the intended speaker or headphones are selected, volume is above zero and mute is off.',[
        c('שיניתי פלט או השתקה והצליל חזר','Changing output or mute restored sound','resolved'), c('הפלט נכון ועדיין אין צליל','The output is correct but silent','compare'), c('ההתקן אינו ברשימה','The device is not listed','device')],{command:run('ms-settings:sound'),visual:'sound'}),
      compare:n('יישום אחד לעומת צליל בדיקה','One app versus a test sound','נסו צליל בדיקה של Windows או קובץ שמע מוכר ביישום אחר. התחילו בעוצמה נמוכה ונוחה.','Try a Windows test sound or a familiar audio file in another app. Start at a comfortable low volume.',[
        c('רק היישום המקורי שקט','Only the original app is silent','app'), c('אין צליל גם ביישום נוסף','Another app is silent too','device')],{visual:'sound'}),
      app:n('מיקסר והגדרות היישום','Mixer and app settings','בדקו במיקסר עוצמה ובהגדרות היישום אם הוא מושתק או משתמש בפלט אחר. חזרו על אותו קטע שמע.','Check Volume mixer and the app’s settings for mute or a different output device. Retest the same audio clip.',[
        c('הצליל חזר באותו יישום','Sound returned in that app','resolved'), c('הוא עדיין שקט','It is still silent','help')],{visual:'sound'}),
      device:n('חיבור והתקן חלופי','Connection and another device','בדקו חשמל, תקע או חיבור Bluetooth. אם אפשר, נסו אוזניות או רמקול מוכרים אחרים. שינוי התקן הוא השוואה, לא הוכחה אוטומטית לתקלה בחומרה.','Check power, plug or Bluetooth connection. If available, try another known-working headset or speaker. A device swap is a comparison, not automatic proof of hardware failure.',[
        c('ההתקן החלופי עובד','The other device works','accessory'), c('אף התקן אינו עובד או שאין חלופי','Neither works or no comparison device is available','diagnostic')],{visual:'sound'}),
      diagnostic:n('מה מופיע במנהל ההתקנים?','What does Device Manager show?','בדקו את התקן השמע ואת שדה מצב ההתקן במאפיינים. רשמו קוד שגיאה אם יש. אין להסיר דרייבר כדי רק לבדוק מצב.','Inspect the audio device and Device status in Properties. Record any error code. A driver need not be uninstalled just to inspect its status.',[
        c('יש קוד שגיאה או שההתקן חסר','An error code appears or the device is missing','help'), c('אין שגיאה אבל הצליל עדיין חסר','No error appears, but sound is still missing','help')],{command:run('devmgmt.msc'),visual:'device-manager'}),
      accessory:end('ההבדל קשור להתקן או לחיבור שלו','The difference follows the device or connection','שמרו איזה התקן עבד ובאיזה חיבור. בדקו את הוראות היצרן; בהתקן אלחוטי המשיכו במסלול Bluetooth.','Keep a record of which device worked and on which connection. Check its manufacturer guidance; for wireless audio continue with the Bluetooth path.','observe'),
      resolved:end('נשמע צליל בבדיקה החוזרת','Sound is audible on retest','בדקו גם את היישום המקורי באותו התקן. תעדו איזה פלט והגדרת עוצמה פתרו את הסימפטום.','Check the original app on the same device too. Record which output and volume settings resolved the symptom.','resolved'),
      help:end('ממשיכים עם תוצאות ההשוואה','Continue with the comparison results','פתחו את פותר בעיות השמע ב־Get Help או פנו לתמיכה. צרפו שם התקן, היישומים שנבדקו וקוד התקן אם הופיע.','Use the audio troubleshooter in Get Help or contact support. Include the device name, apps tested and any device error code.','escalate')
    }),
    f('t-printer','🖨️','המדפסת אינה מדפיסה','The printer will not print',
      'בודקים מוכנות, חיבור ותוצאה של דף בדיקה.',
      'Check readiness, connection and a test-page result.', sources.printer, {
      start:n('מה המדפסת עצמה מציגה?','What does the printer itself show?','בדקו חשמל, נייר והודעת שגיאה בצג המדפסת. רשמו את ההודעה לפני בדיקה ב־Windows.','Check power, paper and the printer’s own error display. Record its message before inspecting Windows.',[
        c('יש שגיאת נייר, דיו או מכסה','There is a paper, ink or cover error','hardware'), c('המדפסת מוכנה ללא שגיאה','The printer is ready without an error','connection')]),
      hardware:n('בודקים לפי הוראות המדפסת','Check the printer’s own instructions','טפלו רק בהודעה המזוהה לפי הוראות היצרן. לאחר מכן בדקו שוב את צג המדפסת.','Address the identified message using the manufacturer’s instructions. Then check the printer display again.',[
        c('ההודעה נעלמה והמדפסת מוכנה','The message cleared and the printer is ready','connection'), c('ההודעה נשארה','The message remains','help')]),
      connection:n('האם Windows מציג את המדפסת הרצויה?','Does Windows list the intended printer?','פתחו מדפסות וסורקים. ב־USB בדקו כבל; בחיבור רשת בדקו שהמחשב והמדפסת ברשת המתאימה. שימו לב לשם מדפסת דומה או עותק ישן.','Open Printers & scanners. Check the cable for USB, or the intended network for a network printer. Watch for similar names or old duplicate entries.',[
        c('המדפסת הנכונה מופיעה','The correct printer is listed','test'), c('אינה מופיעה או מוצגת לא מקוונת','It is missing or shown offline','help')],{command:run('ms-settings:printers')}),
      test:n('תוצאה של דף בדיקה','Test-page result','מתוך מאפייני המדפסת ב־Windows הדפיסו דף בדיקה אחד. הסתכלו גם בתור ההדפסה והימנעו משליחת עותקים רבים.','Print one test page from the printer’s Windows properties. Inspect the print queue too, and avoid sending repeated copies.',[
        c('דף הבדיקה הודפס','The test page printed','app'), c('הדף נשאר בתור או התקבלה שגיאה','The page stays queued or an error appears','queue')]),
      queue:n('מה מופיע בתור?','What does the queue show?','רשמו שם משימה ומצב. אם זו מדפסת משותפת, אין לבטל עבודות של אחרים. השתמשו בפותר בעיות המדפסת ב־Get Help וקראו הצעות לפני החלתן.','Record the job name and state. On a shared printer, do not cancel other people’s jobs. Use the printer troubleshooter in Get Help and review suggestions before applying them.',[
        c('אותו דף בדיקה הודפס לאחר הטיפול','The same test page printed after troubleshooting','app'), c('התור עדיין תקוע','The queue is still stuck','help')]),
      app:n('אותה מדפסת מתוך היישום','Use the same printer from the app','בחרו במפורש באותה מדפסת מתוך היישום והדפיסו עמוד פשוט. דף בדיקה שהודפס מצמצם את החיפוש אך אינו בודק כל מסמך.','Explicitly select the same printer in the app and print a simple page. A successful test page narrows the search but does not test every document.',[
        c('העמוד מהיישום הודפס','The app’s page printed','resolved'), c('רק ההדפסה מהיישום נכשלת','Only printing from the app fails','document')]),
      document:end('הבדיקה מצומצמת ליישום או למסמך','The symptom is narrowed to an app or document','שמרו עותק של המסמך ונסו מסמך נוסף. פנו לתמיכת היישום עם ההבדל בין דף הבדיקה למסמך שנכשל.','Keep a copy of the document and try another document. Give app support the difference between the successful test page and the failed document.','observe'),
      resolved:end('ההדפסה הצליחה','Printing succeeded','דף הבדיקה והעמוד מתוך היישום הודפסו. תעדו את שם המדפסת ואת השינוי שבוצע.','Both the test page and the app’s page printed. Record the printer name and the change made.','resolved'),
      help:end('פונים עם מצב מדפסת ותור','Escalate with printer and queue state','שמרו את הודעת המדפסת, שיטת החיבור ומצב דף הבדיקה. צרפו אותם לתמיכת היצרן או למנהל המדפסת.','Keep the printer message, connection method and test-page state. Share them with the manufacturer or printer administrator.','escalate')
    }),
    f('t-usb','🔌','התקן USB אינו מזוהה','A USB device is not recognized',
      'מבדילים בין יציאה, כבל, זיהוי התקן וגישה לקבצים.',
      'Distinguish the port, cable, device detection and file access.', sources.usb, {
      start:n('האם חיבור ישיר משנה את התוצאה?','Does a direct connection change the result?','כאשר אין העברה פעילה, נסו יציאת USB אחרת ישירות במחשב. בדקו חשמל וכבל מתאים לנתונים; מחבר USB‑C לבדו אינו מבטיח שכל תכונה נתמכת.','When no transfer is active, try another USB port directly on the PC. Check power and a data-capable cable; a USB-C connector alone does not guarantee every feature.',[
        c('ההתקן עובד כעת','The device now works','resolved'), c('עדיין אינו עובד','It still does not work','manager')]),
      manager:n('האם Windows מזהה התקן?','Does Windows detect a device?','פתחו מנהל התקנים וחפשו שינוי בעת חיבור ההתקן. פתחו מאפיינים וקראו את מצב ההתקן. אל תסירו התקנים לא מזוהים.','Open Device Manager and look for a change when the device connects. Read Device status in Properties. Do not uninstall unidentified devices.',[
        c('מופיע שם התקן ללא שגיאה','A device name appears without an error','kind'), c('מופיע Unknown Device או קוד שגיאה','Unknown Device or an error code appears','code'), c('לא מופיע שינוי','No change appears','compare')],{command:run('devmgmt.msc'),visual:'device-manager'}),
      kind:n('איזה סוג התקן זה?','What kind of device is it?','זיהוי במנהל ההתקנים אינו מבטיח שכל תכונות ההתקן פועלות. בדקו את הפעולה הרלוונטית לסוג ההתקן.','Device Manager detection does not prove that all device functions work. Check the function relevant to this device.',[
        c('כונן אחסון שאינו מופיע במחשב זה','A storage drive missing from This PC','disk'), c('מקלדת, מצלמה או התקן אחר','A keyboard, camera or another device','function')]),
      code:end('יש קוד התקן לתיעוד','A device code is available','רשמו את הקוד, שם ההתקן והיציאה שנבדקה. בדקו תמיכה של יצרן ההתקן בדגם ובגרסת Windows לפני בחירת דרייבר.','Record the code, device name and tested port. Check the manufacturer’s support for the model and Windows version before selecting a driver.','escalate'),
      compare:n('השוואת כבל או מחשב נוסף','Compare another cable or PC','אם יש כבל נתונים מתאים או מחשב נוסף, נסו השוואה אחת. אל תחברו כונן שמשמיע רעשים חריגים שוב ושוב.','If a suitable data cable or another PC is available, make one comparison. Do not repeatedly reconnect a drive making unusual mechanical noises.',[
        c('ההתקן עובד במחשב האחר','The device works on the other PC','local'), c('נכשל גם שם או שאין דרך להשוות','It fails there too or comparison is unavailable','code')]),
      function:n('בודקים פעולה בפועל','Test the actual function','נסו פעולה פשוטה: הקלדה, תצוגת מצלמה או הפעולה המיועדת. בדקו גם הרשאות יישום אם ההתקן מזוהה אבל יישום מסוים אינו ניגש אליו.','Try a simple function: typing, camera preview or the intended task. Also check app permissions if the device is detected but one app cannot access it.',[
        c('הפעולה מצליחה','The function works','resolved'), c('הפעולה עדיין נכשלת','The function still fails','code')]),
      disk:end('ממשיכים בבדיקת הכונן','Continue with the drive check','עברו למסלול ״כונן חסר״. זיהוי התקן USB וגישה למחיצה הם שלבים שונים; אל תאתחלו או תפרמטו כונן כדי רק לגרום לו להופיע.','Continue with the missing-drive path. USB detection and access to a volume are separate stages; do not initialize or format a drive merely to make it appear.','observe'),
      local:end('ההבדל מצמצם למחשב או לחיבור המקומי','The difference narrows to this PC or connection','תעדו באיזה מחשב, כבל ויציאה ההתקן עבד. פנו לתמיכה עם ההשוואה; עדיין לא הוכח איזה רכיב מקומי אחראי.','Record which PC, cable and port worked. Share that comparison with support; it has not yet identified the responsible local component.','escalate'),
      resolved:end('ההתקן עובד בבדיקה','The device works on retest','בדקו את הפעולה המקורית ותעדו את היציאה והכבל שעבדו. שמרו את התוצאה אם ניתוקים חוזרים.','Check the original function and record the working port and cable. Keep the result if disconnections return.','resolved')
    }),
    f('t-bluetooth','📶','Bluetooth אינו מתחבר','Bluetooth will not connect',
      'בודקים זמינות, גילוי, חיבור ולבסוף את הפעולה שרוצים לבצע.',
      'Check availability, discovery, connection and finally the intended function.', sources.bluetooth, {
      start:n('האם מתג Bluetooth מופיע ופעיל?','Is the Bluetooth switch present and on?','פתחו הגדרות Bluetooth. בדקו מצב טיסה. אם המתג חסר, בדקו במפרט המחשב אם יש תמיכת Bluetooth.','Open Bluetooth settings and check Airplane mode. If the switch is missing, check the PC specifications for Bluetooth support.',[
        c('המתג קיים ופעיל','The switch is present and on','discover'), c('המתג חסר או שלא ניתן להפעילו','The switch is missing or cannot be enabled','adapter')],{command:run('ms-settings:bluetooth'),visual:'bluetooth'}),
      discover:n('האם האביזר מופיע ברשימת הגילוי?','Does the accessory appear during discovery?','טענו את האביזר והעבירו אותו למצב צימוד לפי הוראות היצרן. קרבו אותו למחשב ובדקו את רשימת הוספת ההתקנים.','Charge the accessory and put it in pairing mode following its instructions. Bring it near the PC and inspect Add device.',[
        c('האביזר מופיע','The accessory appears','pair'), c('הוא לא מופיע','It does not appear','comparison')],{visual:'bluetooth'}),
      pair:n('מה קורה בניסיון החיבור?','What happens when connecting?','בחרו את האביזר ובדקו התאמה של קוד צימוד אם מופיע. לאחר החיבור נסו את הפעולה המיועדת.','Select the accessory and compare pairing codes if shown. After connection, try the intended function.',[
        c('מחובר והפעולה עובדת','Connected and the function works','resolved'), c('אוזניות מחוברות אבל אין צליל','Headphones connect but have no sound','audio'), c('הצימוד נכשל או החיבור נופל','Pairing fails or the connection drops','help')],{visual:'bluetooth'}),
      audio:n('חיבור ופלט שמע הם בדיקות נפרדות','Connection and audio output are separate','בהגדרות שמע בחרו באוזניות כפלט ובדקו עוצמה והשתקה. נסו קטע שמע מוכר. סימון ״מחובר״ אינו קובע לאן היישום שולח צליל.','In Sound settings select the headphones as output and check volume and mute. Try a familiar clip. A connected label does not establish where an app sends audio.',[
        c('הצליל נשמע באוזניות','Sound plays through the headphones','resolved'), c('עדיין אין צליל','There is still no sound','help')],{command:run('ms-settings:sound'),visual:'sound'}),
      adapter:n('בודקים את מתאם המחשב','Inspect the PC adapter','במנהל ההתקנים בדקו אם יש מתאם Bluetooth וקראו את מצב ההתקן. התאימו את המידע למפרט; לא לכל מחשב יש Bluetooth מובנה.','In Device Manager check for a Bluetooth adapter and read its status. Compare this with the specifications; not every PC includes Bluetooth.',[
        c('המתאם קיים ללא שגיאה והמתג חזר','The adapter is present and the switch has returned','discover'), c('יש קוד שגיאה, אין מתאם או אין תמיכה','There is an error, no adapter or no Bluetooth support','help')],{command:run('devmgmt.msc'),visual:'device-manager'}),
      comparison:n('האם האביזר מתגלה במכשיר אחר?','Is the accessory discoverable on another device?','אם זמין מכשיר נוסף, בדקו גילוי במצב צימוד. שימו לב שחיבור קיים למכשיר אחר יכול להשפיע על האביזר.','If another device is available, compare discovery while the accessory is in pairing mode. An existing connection to another device can affect the accessory.',[
        c('מתגלה שם אך לא במחשב','Visible there but not on this PC','adapter'), c('לא מתגלה גם שם או שלא ניתן לבדוק','Not visible there either or comparison is unavailable','help')],{visual:'bluetooth'}),
      resolved:end('הפעולה האלחוטית נבדקה','The wireless function passed the test','נבדקה הפעולה עצמה, ולא רק מצב החיבור. רשמו את האביזר, הפלט שנבחר והשינוי שבוצע.','The actual function was tested, beyond the connection label. Record the accessory, selected output and change made.','resolved'),
      help:end('ממשיכים עם ההבדל שנצפה','Continue with the observed difference','פנו ל־Get Help או לתמיכה עם דגם האביזר, מצב המתאם ותוצאת גילוי וחיבור. באוזניות ציינו בנפרד אם החיבור הצליח ואם נשמע צליל.','Use Get Help or support with the accessory model, adapter status and discovery/connection results. For headphones, report connection success and sound playback separately.','escalate')
    }),
    f('t-drive','💽','כונן חסר או אינו נפתח','A drive is missing or will not open',
      'מתחילים בזיהוי הכונן ובחשיבות הנתונים. רק קוראים את מצב הדיסק.',
      'Start with drive identity and the importance of its data. Inspect disk state only.', sources.disk, {
      start:n('האם הכונן מופיע ב״מחשב זה״?','Does the drive appear in This PC?','זהו את הכונן לפי שם, קיבולת וסוג חיבור. אם יש בו קבצים חשובים ללא גיבוי או רעש מכני חריג, בחרו במסלול שמירת נתונים.','Identify the drive by label, capacity and connection. If it holds important unbacked-up files or makes unusual mechanical noises, choose the data-preservation path.',[
        c('יש קבצים חשובים שלא גובו או רעש חריג','Important files lack a backup or there is unusual noise','preserve'), c('מופיע אבל אינו נפתח','It appears but will not open','access'), c('אינו מופיע בסייר הקבצים','It is missing from File Explorer','manager')],{visual:'disk-management'}),
      manager:n('מה מופיע בניהול דיסקים?','What does Disk Management show?','פתחו ניהול דיסקים וזהו לפי קיבולת. קראו בלבד. סגרו בקשת אתחול או פרמוט בלי לאשר, ואל תשנו מחיצות EFI או Recovery.','Open Disk Management and identify the capacity. Inspect only. Dismiss initialization or format prompts without accepting; leave EFI and Recovery partitions unchanged.',[
        c('מחיצה Healthy עם מערכת קבצים, ללא אות','Healthy formatted volume without a drive letter','letter'), c('RAW, לא מוקצה או לא מאותחל','RAW, Unallocated or Not Initialized','preserve'), c('הדיסק לא מופיע כלל','The disk is not listed at all','connection')],{command:run('diskmgmt.msc'),visual:'disk-management'}),
      access:n('איזו הודעה מתקבלת?','Which message appears?','נסו לפתוח פעם אחת ורשמו את ההודעה. בקשת פרמוט, הרשאה או מפתח הצפנה הן מצבים שונים.','Try opening once and record the message. A format request, permission error and encryption-key prompt are different states.',[
        c('Access denied או נדרש מפתח BitLocker','Access denied or a BitLocker key is required','protected'), c('Windows מציע לפרמט או מציג שגיאת קריאה','Windows offers formatting or shows a read error','preserve'), c('הכונן נפתח והקבצים זמינים','The drive opens and files are accessible','resolved')]),
      letter:end('נראה שחסרה אות כונן','A drive letter appears to be missing','תעדו מספר דיסק, קיבולת, מערכת קבצים ומחיצה. לפני הקצאת אות, ודאו שזו מחיצת הנתונים הנכונה ושאינה מחיצת מערכת. היעזרו בתמיכה אם הזיהוי אינו חד־משמעי.','Record disk number, capacity, file system and partition. Before assigning a letter, verify it is the intended data volume and not a system partition. Get help if its identity is uncertain.','observe'),
      connection:n('השוואת החיבור החיצוני','Compare the external connection','בכונן חיצוני, כשאין העברה פעילה, בדקו חשמל, כבל ויציאה ישירה אחרת. בכונן פנימי פנו לטכנאי לפני פתיחת המחשב.','For an external drive with no active transfer, check power, cable and another direct port. For an internal drive, consult a technician before opening the PC.',[
        c('הכונן מופיע ונפתח כעת','The drive now appears and opens','resolved'), c('מופיע בניהול דיסקים אך לא נפתח','It appears in Disk Management but will not open','manager'), c('אינו מופיע גם לאחר השוואה','It remains absent after comparison','help')],{visual:'disk-management'}),
      preserve:end('שומרים את מצב הנתונים','Preserve the current data state','אל תאשרו פרמוט, אתחול דיסק או יצירת מחיצה. אם הקבצים חשובים, הפסיקו ניסיונות כתיבה ופנו לשחזור נתונים או לתמיכה עם המצב המדויק.','Do not approve formatting, disk initialization or partition creation. If the files matter, stop write attempts and seek data-recovery or support advice with the exact state.','escalate'),
      protected:end('נדרשת גישה מורשית','Authorized access is needed','בבקשת BitLocker חפשו את מפתח השחזור בחשבון או אצל מנהל המחשב. ב־Access denied המשיכו במסלול הרשאות. אל תפרמטו כדי לעקוף חסימת גישה.','For BitLocker, locate the recovery key in the appropriate account or with the administrator. For Access denied, use the permissions path. Do not format to bypass access restrictions.','observe'),
      resolved:end('גישה לקבצים נבדקה','File access was checked','בדקו פתיחה של קובץ מוכר בלי לשנות אותו וגבו נתונים חשובים. כונן שחזר להופיע עדיין עשוי לדרוש בירור אם הבעיה חוזרת.','Open a familiar file without changing it and back up important data. A drive that reappears may still need investigation if the problem returns.','resolved'),
      help:end('מוסרים זיהוי ומצב כונן','Provide drive identity and state','מסרו דגם, קיבולת, חיבור ותוצאת ההשוואה. ציינו אם יש גיבוי עדכני; נתונים אלה יקבעו את הצעד הבא.','Provide model, capacity, connection and comparison result. State whether a current backup exists; these details guide the next step.','escalate')
    }),
    f('t-permissions','🔐','אין הרשאה לקובץ או לתיקייה','File or folder access is denied',
      'מזהים את החשבון והיעד לפני בקשת הרשאה או שינוי שלה.',
      'Identify the account and destination before requesting or changing access.', sources.permissions, {
      start:n('איפה נמצא היעד?','Where is the destination?','רשמו את הנתיב המדויק ואת הפעולה שנחסמה: קריאה, כתיבה או מחיקה. אל תשתפו את תוכן הקובץ כדי רק להסביר את ההרשאה.','Record the exact path and blocked action: reading, writing or deletion. File contents are not needed to explain an access error.',[
        c('תיקייה אישית מקומית שלי','My own local personal folder','identity'), c('תיקיית מערכת, חשבון אחר או שיתוף ארגוני','System folder, another account or managed share','owner'), c('כונן מבקש מפתח הצפנה','A drive asks for an encryption key','encrypted')],{visual:'permissions'}),
      identity:n('באיזה חשבון מחוברים?','Which account is signed in?','whoami מציג את זהות החשבון הנוכחי. השוו לחשבון שאמור לקבל גישה. בחשבון ארגוני פנו למנהל אם הזהות אינה צפויה.','whoami displays the current account identity. Compare it with the account expected to have access. Ask your administrator if a managed account is unexpected.',[
        c('זה החשבון המתאים','It is the intended account','inspect'), c('זה חשבון אחר או שלא ברור','It is another account or unclear','owner')],{command:cmd('whoami'),visual:'permissions'}),
      inspect:n('קוראים הרשאות בלי לשנות','Read permissions without changing them','פתחו מאפייני התיקייה > אבטחה ובדקו את הרשומות. הפקודה לדוגמה מציגה ACL של תיקיית דוגמה בלבד; החליפו נתיב רק ביעד שאותו אתם מורשים לבדוק.','Open folder Properties > Security and inspect entries. The example command displays the ACL of an example folder; substitute only a destination you are authorized to inspect.',[
        c('נראית הרשאת קריאה אך כתיבה נחסמת','Read access is shown but writing is blocked','write'), c('יש Deny, זהות לא מוכרת או הרשאות לא ברורות','There is Deny, an unfamiliar identity or unclear rights','owner'), c('הגישה המיועדת מצליחה כעת','The intended access now works','resolved')],{command:cmd('icacls "C:\\Example-Folder"'),visual:'permissions'}),
      write:n('משווים יעד שמותר לכתוב אליו','Compare a writable destination','אם הבעיה היא שמירה, נסו ״שמירה בשם״ בשם חדש בתיקייה אישית שמותר לכם לכתוב אליה. אל תדרסו את המקור ואל תשנו הרשאות גורפות.','For a save failure, try Save As with a new name in an authorized personal folder. Keep the original intact and avoid broad permission changes.',[
        c('העותק נשמר בתיקייה האישית','The copy saves in the personal folder','limited'), c('שמירה נכשלת גם שם','Saving fails there too','help')],{visual:'permissions'}),
      owner:end('מבקשים גישה מבעל היעד','Request access from the owner','מסרו לבעל התיקייה או ל־IT את הנתיב, החשבון והפעולה הדרושה. חברות בקבוצה והרשאות שיתוף עשויות להשפיע; אל תעניקו Everyone:Full Control ואל תיקחו בעלות באופן גורף.','Give the owner or IT the path, account and required action. Group membership and share permissions may affect access; do not grant Everyone full control or take ownership broadly.','escalate'),
      encrypted:end('זהו עניין של הצפנה','This is an encryption requirement','הרשאות קבצים אינן מחליפות מפתח הצפנה. חפשו את מפתח השחזור אצל בעל החשבון או מנהל המחשב.','File permissions do not replace an encryption key. Locate the recovery key with the account owner or PC administrator.','escalate'),
      limited:end('נמצא הבדל בין היעדים','A difference between destinations was found','היישום הצליח לשמור ביעד המורשה. הדבר מצמצם את הבדיקה ליעד המקורי או למדיניות שלו; בקשו רק את ההרשאה הדרושה.','The app saved successfully to the authorized destination. This narrows the check to the original location or its policy; request only the access needed.','observe'),
      resolved:end('הפעולה המורשית הצליחה','The authorized action succeeded','בדקו רק את הפעולה שהתכוונתם לבצע. רשמו איזה חשבון ונתיב עבדו; אל תרחיבו הרשאות מעבר לצורך.','Verify only the action you intended. Record the working account and path; do not expand permissions beyond the need.','resolved'),
      help:end('הכשל אינו מוגבל ליעד הראשון','The failure is not limited to the first destination','שמרו את שתי הודעות השגיאה ואת היעדים שנבדקו. ייתכן שנדרש לבדוק גם את היישום, האחסון או מדיניות הגנה; פנו לתמיכה עם ההשוואה.','Keep both errors and the tested destinations. App behavior, storage or protection policy may also need inspection; give support the comparison.','escalate')
    }),
    f('t-backup','🗂️','בדיקת גיבוי לפני שסומכים עליו','Check a backup before relying on it',
      'מבדילים בין תכנון העתקה, העתקה בפועל ויכולת לפתוח קובץ מהעותק.',
      'Separate a copy plan, an actual copy and the ability to open a backed-up file.', sources.backup, {
      start:n('האם זוהו מקור ויעד נפרדים?','Are source and destination identified?','רשמו מה מגבים ולאן. היעד צריך להיות מקום מוכר ונגיש. תיקייה אחרת באותו כונן אינה מגינה מפני כשל של אותו כונן.','Record what is being backed up and where. Use a known accessible destination. Another folder on the same drive does not protect against that drive failing.',[
        c('המקור והיעד הנפרד ידועים','The source and separate destination are known','capacity'), c('לא ברור היכן העותק יישמר','The destination is unclear','plan')],{visual:'backup'}),
      capacity:n('האם יש מקום והנתיבים נכונים?','Is there space, and are the paths correct?','בדקו את גודל התיקיות ואת המקום הפנוי ביעד. ודאו שאות כונן חיצוני לא השתנתה ושאין היפוך בין מקור ליעד.','Compare folder size with destination free space. Check that the external drive letter has not changed and source/destination are not reversed.',[
        c('יש מקום והנתיבים נבדקו','Space and paths have been checked','preview'), c('אין מקום או שיש ספק בנתיבים','Space is insufficient or paths are uncertain','plan')],{visual:'backup'}),
      preview:n('תצוגה מקדימה בלבד','Preview only','הפקודה משתמשת בתיקיות דוגמה. לאחר התאמת נתיבים, ‎/L מציג מה היה נבחר בלי להעתיק, למחוק או לשנות חותמות זמן. קראו את שמות המקור והיעד בראש הפלט.','The command uses example folders. After adapting paths, /L lists what would be selected without copying, deleting or changing timestamps. Read source and destination at the top of the output.',[
        c('הרשימה תואמת לקבצים שרציתי לגבות','The list matches the intended files','copy'), c('המקור, היעד או הרשימה אינם נכונים','A path or the file list is wrong','plan'), c('הופיעה שגיאת גישה או קריאה','An access or read error appeared','help')],{command:cmd('robocopy "C:\\Example-Source" "E:\\Example-Backup" /E /L /R:0 /W:0'),visual:'backup'}),
      copy:n('האם כבר בוצעה העתקה בפועל?','Has an actual copy been completed?','תצוגה מקדימה אינה יוצרת גיבוי. בצעו העתקה רק לאחר בדיקת התוכנית ובשיטה שבחרתם, ואז בדקו את סיכום הפעולה. אל תוסיפו ‎/MIR או ‎/PURGE לצורך גיבוי בסיסי.','A preview creates no backup. Copy only after reviewing the plan using your chosen method, then inspect the result. Do not add /MIR or /PURGE for a basic backup.',[
        c('בוצעה העתקה והסיכום אינו מציג כשלים','Copying completed with no reported failures','verify'), c('בוצעה רק תצוגה מקדימה','Only a preview was performed','pending'), c('ההעתקה נכשלה או נותרו קבצים שלא הועתקו','Copying failed or some files were not copied','help')],{visual:'backup'}),
      verify:n('האם אפשר לפתוח קובץ מהעותק?','Can a file be opened from the backup?','נווטו ליעד עצמו ובדקו כמה קבצים מייצגים בלי לשנות אותם. ודאו שאלה העותקים ושיש בהם תוכן עדכני; בדיקת מדגם אינה מאמתת כל קובץ.','Browse to the destination and inspect several representative files without changing them. Confirm they are the copies and contain current content; a sample does not verify every file.',[
        c('הקבצים לדוגמה נפתחים ותוכנם עדכני','Sample files open and contain current content','resolved'), c('קובץ חסר, ישן או לא נפתח','A file is missing, old or unreadable','help')],{visual:'backup'}),
      plan:end('התוכנית עדיין צריכה השלמה','The plan still needs work','בחרו יעד מתאים וודאו קיבולת וזהות נתיבים. חזרו לתצוגה מקדימה לאחר תיקון התוכנית; עד אז אין להסתמך על עותק חדש.','Choose a suitable destination and confirm capacity and paths. Return to preview after correcting the plan; do not rely on a new copy yet.','observe'),
      pending:end('יש תוכנית; עדיין אין גיבוי חדש','A plan exists; no new backup yet','‎/L לא ביצע העתקה. השלב הבא הוא העתקה מודעת ובדיקת העותק, לא סימון הגיבוי כהושלם.','/L did not copy files. The next step is a deliberate copy and verification of the copy, not marking the backup complete.','observe'),
      resolved:end('העותק ובדיקת המדגם הושלמו','Copy and sample check completed','רשמו יעד ותאריך. בדקו מדי פעם שחזור ושמרו גם עותק נפרד לפי חשיבות הנתונים. ההצלחה כאן מתייחסת להעתקה ולמדגם שנבדקו.','Record the destination and date. Periodically test recovery and keep a separate copy appropriate to the data’s importance. This success covers the copy and sample checks performed.','resolved'),
      help:end('לא מסתמכים עדיין על הגיבוי','Do not rely on the backup yet','שמרו את פרטי הכשל ורשימת הקבצים שלא הועתקו. אל תמחקו את המקור; השלימו בירור, העתקה ובדיקת קריאה לפני הסתמכות על היעד.','Keep the failure details and uncopied-file list. Retain the source; resolve the issue, copy and check readability before relying on the destination.','escalate')
    })
  ];
  const answer = (he,en,correct,fh,fe) => ({label:d(he,en),correct,feedback:d(fh,fe)});
  const step = (he,en,output,qh,qe,choices) => ({title:d(he,en),output:'דוגמה מדומה בלבד — לא נתוני המחשב שלך\nSIMULATED EXAMPLE — NOT LIVE DEVICE DATA\n\n'+output,question:d(qh,qe),choices});
  const scenario = (id,he,en,ih,ie,steps) => ({id,title:d(he,en),intro:d(ih,ie),steps});
  const scenarios = [
    scenario('sc-dns','כתובת, DNS וגלישה','Address, DNS and browsing',
      'שלוש תמונות מצב של רשת דמיונית. בכל שלב קובעים רק מה הנתונים באמת מראים.',
      'Three snapshots of a fictional network. At each stage, conclude only what the evidence supports.',[
      step('1. מתחילים בתצורה','1. Start with configuration',
        'ipconfig\nIPv4 Address    : 192.0.2.25\nSubnet Mask     : 255.255.255.0\nDefault Gateway : 192.0.2.1',
        'מה הפלט הזה לבדו מוכיח?','What does this output alone establish?',[
        answer('יש תצורת IPv4 ושער במתאם','The adapter has IPv4 and gateway configuration',true,'נכון. אלה ערכי תצורה; עדיין לא נבדקה תקשורת לנתב או לאתר. הכתובות כאן מיועדות לתיעוד בלבד.','Correct. These are configuration values; communication with a router or website has not been checked. These addresses are for documentation only.'),
        answer('כל האתרים זמינים','Every website is reachable',false,'תצורת כתובת אינה בדיקת גלישה. צריך לבדוק גם תקשורת ותרגום שמות.','Address configuration is not a browsing test. Communication and name resolution still need checking.'),
        answer('שרת DNS בוודאות תקול','The DNS server is definitely broken',false,'אין כאן תוצאת שאילתת DNS. אי אפשר להסיק מהפלט הזה על תקלה בשרת DNS.','There is no DNS query result here, so this output cannot establish a DNS-server failure.')
      ]),
      step('2. שאילתת שם לא נענתה','2. A name query did not answer',
        'Simulated comparison:\nGateway responds on local network.\nnslookup example.test\nDNS request timed out.\nAnother device resolves the same test name.',
        'מהו המשך הבדיקה המדויק ביותר?','What is the most targeted next check?',[
        answer('לפרמט את המחשב כי האינטרנט נפל','Format the PC because the internet is down',false,'אין ראיה לתקלה שדורשת מחיקת נתונים. ההבדל בין המכשירים מאפשר בדיקה ממוקדת.','Nothing indicates a need to erase data. The difference between devices supports a targeted check.'),
        answer('לבדוק את הגדרות ונתיב DNS במחשב הזה','Inspect this PC’s DNS settings and DNS reachability',true,'נכון. ההשוואה מצמצמת לבדיקת תרגום שמות במחשב או במסלול שלו. timeout לבדו אינו מוכיח ששרת DNS מקולקל.','Correct. The comparison focuses on name resolution on this PC or its path. A timeout alone does not prove a broken DNS server.'),
        answer('לקבוע שהאתר מחק את החשבון','Conclude the website deleted the account',false,'שאילתת DNS אינה בודקת חשבונות באתר. השלב עדיין עוסק בתרגום השם.','A DNS query does not inspect website accounts. This stage concerns name resolution.')
      ]),
      step('3. שם נפתר, אתר עדיין נכשל','3. The name resolves but the site still fails',
        'nslookup example.test\nName: example.test\nAddress: 192.0.2.80\n\nBrowser: connection failed\nSecond website: loads normally',
        'איזו מסקנה נתמכת כעת?','Which conclusion is now supported?',[
        answer('תקינות DNS מבטיחה שהאתר פתוח','Successful DNS guarantees the website is open',false,'DNS מחזיר כתובת; הוא אינו מאמת חיבור HTTPS או את שירות האתר.','DNS returns an address; it does not verify the HTTPS connection or website service.'),
        answer('צריך לאפס מיד את כל הרשת','The entire network must be reset immediately',false,'אתר נוסף נטען ותרגום השם הצליח. קודם משווים דפדפן והודעת שגיאה של היעד.','Another site loads and the lookup succeeded. First compare the browser and the destination’s exact error.'),
        answer('השאילתה הצליחה; נותר לבדוק אתר או דפדפן','The lookup succeeded; inspect the site or browser next',true,'נכון. ממשיכים לפי היעד וההודעה, בלי להפוך בדיקת DNS מוצלחת לאישור שכל הגלישה תקינה.','Correct. Continue with the destination and error rather than treating one successful lookup as proof that all browsing works.')
      ])
    ]),
    scenario('sc-usb-disk','USB מזוהה, אבל איפה הכונן?','USB detected, but where is the drive?',
      'כונן דמיוני מופיע בכלי אחד ולא באחר. מחברים בין רמות הזיהוי בלי למחוק נתונים.',
      'A fictional drive appears in one tool but not another. Connect the detection stages while preserving data.',[
      step('1. זיהוי ההתקן','1. Device detection',
        'Device Manager\nDisk drives > Example USB Disk\nDevice status: This device is working properly.\n\nFile Explorer > This PC: no new drive shown',
        'מה אפשר להסיק?','What can be inferred?',[
        answer('Windows מזהה התקן; צריך לבדוק את המחיצה','Windows detects a device; inspect the volume next',true,'נכון. זיהוי התקן אינו זהה לגישה למחיצה עם מערכת קבצים ואות כונן.','Correct. Detecting a device is separate from accessing a formatted volume with a drive letter.'),
        answer('הקבצים בוודאות נמחקו','The files were definitely erased',false,'היעדר כונן בסייר אינו מוכיח מחיקה. נדרש לקרוא את מצב הדיסק והמחיצות.','An absent Explorer drive does not prove erasure. The disk and partition states still need inspection.'),
        answer('צריך להסיר את כל בקרי USB','All USB controllers must be uninstalled',false,'ההתקן כבר מזוהה. הסרה רחבה אינה הצעד הבא לבדיקת מחיצה חסרה.','The device is already detected. Broad removal is not the next check for a missing volume.')
      ]),
      step('2. קוראים את מצב הדיסק','2. Read disk state',
        'Disk Management — fictional drive\nDisk 2 | 120 GB | Online\nVolume | 120 GB | NTFS | Healthy\nDrive letter: none',
        'מה נכון לבדוק לפני כל שינוי?','What should be checked before any change?',[
        answer('לפרמט כי אין אות כונן','Format because no drive letter is assigned',false,'מחיצה קיימת עם מערכת קבצים אינה צריכה פרמוט רק כדי לקבל אות. פרמוט עלול לאבד נתונים.','An existing formatted volume does not need formatting just to receive a letter. Formatting risks data loss.'),
        answer('לוודא שזה כונן הנתונים הנכון לפני הקצאת אות','Verify this is the intended data volume before assigning a letter',true,'נכון. בודקים קיבולת וזהות, ומשאירים מחיצות מערכת ושחזור ללא שינוי.','Correct. Confirm capacity and identity, leaving system and recovery partitions unchanged.'),
        answer('ליצור מחיצה חדשה על כל הדיסק','Create a new partition across the whole disk',false,'כבר קיימת מחיצה. שינוי המבנה אינו נדרש כדי לברר מדוע אין לה אות.','A volume already exists. Restructuring the disk is unnecessary to investigate a missing letter.')
      ]),
      step('3. מצב אחר מחייב החלטה אחרת','3. A different state requires a different decision',
        'A different fictional disk:\nDisk 3 | 500 GB | Online\nVolume: RAW\nOwner reports: important photos, no backup',
        'מהו הצעד המתאים במקרה הזה?','What is appropriate in this case?',[
        answer('לאשר Format כדי לראות את התמונות','Approve Format to see the photos',false,'פרמוט אינו פעולה לשחזור תמונות. הוא משנה את הכונן ועלול לפגוע ביכולת השחזור.','Formatting is not a photo-recovery step. It changes the drive and can harm recovery.'),
        answer('להסיק שהכבל בהכרח פגום','Conclude the cable must be faulty',false,'RAW מתאר מצב מערכת קבצים שנראה ל־Windows, לא אבחנה ודאית של הכבל.','RAW describes the file-system state seen by Windows, not a definitive cable diagnosis.'),
        answer('להפסיק כתיבה ולפנות לשחזור או לתמיכה','Stop writes and seek recovery or support advice',true,'נכון. החשיבות והיעדר הגיבוי משנים את העדיפות: קודם שומרים על סיכויי השחזור.','Correct. Important data without a backup changes the priority: preserve the chance of recovery first.')
      ])
    ]),
    scenario('sc-backup-preview','מתוכנית העתקה לגיבוי שנבדק','From a copy plan to a checked backup',
      'עוקבים אחר גיבוי דמיוני ומבדילים בין רשימת פעולות, ביצוע ואימות מדגם.',
      'Follow a fictional backup and distinguish a plan, execution and sample verification.',[
      step('1. פלט שנראה כמו העתקה','1. Output that resembles copying',
        'robocopy "C:\\Example-Source" "E:\\Example-Backup" /E /L /R:0 /W:0\nOptions: /E /L /R:0 /W:0\nNew File    2400    lesson.txt\nNew File    8100    photo.jpg',
        'האם נוצרו כאן עותקים חדשים?','Were new copies created here?',[
        answer('כן, כל New File כבר נשמר ביעד','Yes, every New File was saved at the destination',false,'במצב ‎/L הרשימה מתארת מה היה נבחר לפעולה. אין כאן הוכחה להעתקה בפועל.','With /L, the list describes what would be selected. It does not demonstrate an actual copy.'),
        answer('לא; ‎/L מציג תצוגה מקדימה בלבד','No; /L produces a preview only',true,'נכון. ‎/L מציג קבצים בלי להעתיק, למחוק או לשנות חותמות זמן.','Correct. /L lists files without copying, deleting or changing timestamps.'),
        answer('הקבצים הועברו ונמחקו מהמקור','The files were moved and removed from the source',false,'לא בוצעה העתקה או מחיקה. תצוגה מקדימה אינה פעולת העברה.','Neither copying nor deletion occurred. A preview is not a move operation.')
      ]),
      step('2. קובץ נוסף ביעד','2. An extra destination file',
        'Source: lesson.txt, photo.jpg\nDestination: old-family-photo.jpg\nProposed change: replace /L with /MIR\nThe old family photo exists only at the destination.',
        'מה הסיכון בהצעה הזו?','What is the risk in this proposal?',[
        answer('‎/MIR עשוי למחוק קובץ שקיים רק ביעד','/MIR may delete a destination-only file',true,'נכון. Mirror כולל הסרת פריטים שאין במקור. אל תוסיפו אותו בלי להבין ולאשר את מדיניות המחיקה.','Correct. Mirroring includes removal of items absent from the source. Do not add it without understanding and accepting the deletion policy.'),
        answer('‎/MIR תמיד שומר כל קובץ ישן','/MIR always retains every old file',false,'Mirror אינו ארכיון ששומר כל היסטוריה. קובץ נוסף ביעד עלול להימחק.','Mirroring is not an archive that retains all history. An extra destination file may be removed.'),
        answer('הסיכון היחיד הוא שהפעולה תהיה איטית','The only risk is slower copying',false,'השינוי משפיע על הנתונים ביעד, לא רק על משך ההעתקה.','The change affects destination data, not just copy duration.')
      ]),
      step('3. אחרי העתקה בפועל','3. After a real copy',
        'Separate copy completed without reported failures.\nDestination opened: E:\\Example-Backup\nSamples checked: lesson.txt, photo.jpg\nBoth samples open and contain current content.',
        'איזה ניסוח מתאר נכון את התוצאה?','Which statement accurately describes the result?',[
        answer('כל קובץ עתידי מוגן לצמיתות','Every future file is protected forever',false,'בדיקה נוכחית אינה מגבה קבצים שעוד לא נוצרו. נדרשים עדכון גיבוי ובדיקות תקופתיות.','A present check does not back up files that do not yet exist. Backups need updating and periodic checking.'),
        answer('אפשר למחוק מיד את כל המקור','The entire source can now be deleted',false,'העתק ומדגם אינם סיבה למחוק את המקור. צריך לשמור על תוכנית הגיבוי והעותקים הנדרשים.','A copy and sample check do not justify deleting the source. Maintain the intended backup plan and copies.'),
        answer('ההעתקה הושלמה והמדגם נבדק; לא כל קובץ אומת','Copying completed and samples passed; not every file was verified',true,'נכון. מתעדים תאריך ויעד, ומבחינים בין מדגם מוצלח לבין אימות מלא או גיבוי עתידי.','Correct. Record the date and destination, distinguishing a successful sample from full verification or future backups.')
      ])
    ]),
    scenario('sc-permissions','למי מותר לקרוא ולכתוב?','Who can read and write?',
      'מזהים חשבון, סוג הרשאה והיקף תקלה באמצעות תיקייה דמיונית.',
      'Identify the account, permission and failure scope using a fictional folder.',[
      step('1. זהות החשבון','1. Account identity',
        'whoami\nexample-pc\\learner\n\nRequested action: save a report\nDestination: C:\\Example-Team',
        'מה whoami הוסיף לבדיקה?','What did whoami add to the investigation?',[
        answer('את זהות החשבון, לא את כל הרשאות היעד','The account identity, not all destination permissions',true,'נכון. אחרי זיהוי החשבון עדיין צריך לבדוק את יעד השמירה והפעולה המבוקשת.','Correct. Identifying the account still leaves destination rights and the requested action to be checked.'),
        answer('הרשאת כתיבה אוטומטית לכל תיקייה','Automatic write access to every folder',false,'הצגת זהות אינה משנה הרשאות ואינה מעניקה גישה.','Displaying identity neither changes permissions nor grants access.'),
        answer('הוכחה שהקובץ מושחת','Proof that the file is corrupt',false,'הפקודה מציגה את החשבון. היא אינה בודקת את תוכן הקובץ.','The command identifies the account; it does not inspect file contents.')
      ]),
      step('2. קריאה אינה כתיבה','2. Reading is not writing',
        'Simplified teaching ACL:\nC:\\Example-Team\nEXAMPLE-PC\\learner:(R)\n\nOpen existing report: succeeds\nSave new report here: Access is denied',
        'מה מלמדת ההשוואה?','What does the comparison indicate?',[
        answer('מי שיכול לקרוא תמיד יכול לשנות','Anyone who can read can always modify',false,'הרשאת קריאה אינה כוללת בהכרח יצירה או שינוי. הפעולות נבדקות בנפרד.','Read access does not necessarily include creation or modification. Check the actions separately.'),
        answer('הגישה לקריאה אינה מוכיחה הרשאת כתיבה','Read access does not establish write permission',true,'נכון. בדוגמה הפשוטה מופיעה R. במערכת אמיתית בודקים גם קבוצות, הרשאות נוספות והקשר שיתוף.','Correct. This simplified example shows R. Real access also requires considering groups, other entries and share context.'),
        answer('צריך להעניק Everyone:Full Control','Everyone must receive Full Control',false,'הרשאה רחבה מדי אינה נדרשת כדי לפתור צורך ממוקד. מבקשים רק את הפעולה הנחוצה מבעל היעד.','Broad access is unnecessary for a specific need. Request only the required action from the owner.')
      ]),
      step('3. שמירה ביעד מורשה','3. Save to an authorized destination',
        'Save As -> personal authorized folder: succeeds\nSave As -> C:\\Example-Team: denied\nOriginal report remains unchanged.',
        'מהו הצעד הבא המתאים?','What is the appropriate next step?',[
        answer('לקחת בעלות על כל C:','Take ownership of the whole C: drive',false,'ההשוואה ממוקדת ביעד אחד. שינוי בעלות גורף אינו נחוץ ועלול לשבש הרשאות.','The comparison focuses on one destination. Broad ownership changes are unnecessary and can disrupt permissions.'),
        answer('לקבוע שכל Windows אינו תקין','Conclude that all of Windows is broken',false,'השמירה הצליחה ביעד אחר. זה מידע שמצמצם את הבדיקה, לא תוצאה של כשל מערכת כללי.','Saving worked elsewhere. That narrows the investigation instead of demonstrating a system-wide failure.'),
        answer('לבקש מבעל התיקייה גישה לפעולה הדרושה','Ask the folder owner for the specific required access',true,'נכון. מצרפים חשבון, נתיב והפעולה שנחסמה. אין צורך לשתף את תוכן הדוח או לשנות את כל הרשאות הכונן.','Correct. Provide the account, path and blocked action. Report contents and drive-wide permission changes are unnecessary.')
      ])
    ]),
    scenario('sc-bluetooth-audio','מחובר אינו תמיד נשמע','Connected does not always mean audible',
      'אוזניות דמיוניות מתחברות, אך הצליל עדיין יוצא ממקום אחר.',
      'Fictional headphones connect while audio still goes somewhere else.',[
      step('1. החיבור הושלם','1. Connection completed',
        'Bluetooth devices\nExample Headset: Connected\n\nWindows Sound\nSelected output: Example HDMI Monitor\nHeadset volume: 55%',
        'מה כדאי לבדוק קודם?','What should be checked first?',[
        answer('לבחור את האוזניות כפלט ולבדוק קטע שמע','Select the headset as output and test a clip',true,'נכון. החיבור קיים, אך הפלט בדוגמה הוא מסך HDMI. חיבור ופלט הם מצבים שונים.','Correct. The connection exists, but the selected output is an HDMI monitor. Connection and output selection are separate states.'),
        answer('להסיק שהאוזניות מקולקלות','Conclude the headset is broken',false,'עדיין לא נבדק צליל שנשלח לאוזניות. פלט אחר נבחר כרגע.','Audio directed to the headset has not yet been tested. Another output is selected.'),
        answer('למחוק את כל מנהלי ההתקנים','Delete every device driver',false,'יש בדיקה ממוקדת של בחירת פלט לפני שינוי דרייברים.','Output selection provides a targeted check before changing drivers.')
      ]),
      step('2. צליל מערכת עובד','2. System audio works',
        'Selected output: Example Headset\nWindows test sound: audible\nExample Meeting App: silent\nVolume mixer -> Example Meeting App: muted',
        'מה תוצאות הבדיקה מצמצמות?','What do these results narrow down?',[
        answer('כל מערכת Bluetooth מושבתת','The entire Bluetooth system is disabled',false,'צליל הבדיקה נשמע באוזניות, ולכן המערכת מסוגלת להעביר לפחות את הצליל שנבדק.','The test sound reaches the headset, so at least that tested audio path works.'),
        answer('יש לבדוק את השתקת היישום ואת הפלט שלו','Check the app’s mute and output selection',true,'נכון. ההבדל בין צליל מערכת ליישום ממקד את הבדיקה בהגדרות היישום.','Correct. The difference between system audio and the app focuses the check on app settings.'),
        answer('צריך לפרמט את כונן המערכת','The system drive must be formatted',false,'אין כאן ראיה לתקלה בדיסק. מצב השתקה מפורש הוא רמז ישיר יותר.','Nothing here indicates a disk fault. The explicit mute state is a more direct clue.')
      ]),
      step('3. התוצאה לאחר שינוי אחד','3. Result after one change',
        'App mute: off\nApp output: Example Headset\nSame test clip: audible in headset\nMicrophone: not tested',
        'מה אפשר לסמן כהושלם?','What can be marked as verified?',[
        answer('גם המיקרופון נבדק בהצלחה','The microphone also passed',false,'לא הוצגה בדיקת קלט. הצלחה בהשמעה אינה בדיקה של המיקרופון.','No input test was performed. Successful playback does not test the microphone.'),
        answer('התקלה לא יכולה לחזור לעולם','The issue can never return',false,'זו תוצאה בזמן הבדיקה. כדאי לתעד פלט והשתקה למקרה שההגדרות משתנות שוב.','This is a result at test time. Record output and mute settings in case they change again.'),
        answer('השמעה מהיישום לאוזניות הצליחה בבדיקה','Playback from the app to the headset passed this test',true,'נכון. התוצאה מתייחסת ליישום, לפלט ולקטע שנבדקו. מיקרופון דורש בדיקה נפרדת.','Correct. The result covers the tested app, output and clip. The microphone needs a separate test.')
      ])
    ]),
    scenario('sc-process-measurement','זמן CPU לעומת עומס עכשיו','CPU time versus current load',
      'משווים שני יישומים דמיוניים באמצעות מדד נכון ומבחן חוזר.',
      'Compare two fictional apps using the right metric and a retest.',[
      step('1. רשימת תהליכים','1. A process list',
        'Get-Process\nCPU(s)     Id   ProcessName\n 920.50   410  ExampleLongRunningApp\n   8.20   520  ExampleNewApp',
        'האם אפשר לדעת מכאן מי מעמיס כרגע יותר?','Can this alone identify which app is busier right now?',[
        answer('כן, 920.50 הוא אחוז שימוש נוכחי','Yes, 920.50 is the current usage percentage',false,'CPU(s) נמדד בשניות מעבד מצטברות, לא באחוזים ברגע זה.','CPU(s) is cumulative processor seconds, not a current percentage.'),
        answer('לא; CPU(s) הוא זמן מעבד מצטבר','No; CPU(s) is accumulated processor time',true,'נכון. תהליך ותיק יכול לצבור הרבה זמן גם כשהוא כמעט לא פעיל כרגע. צריך מדידה בזמן ההאטה.','Correct. An older process can accumulate a large total while barely active now. Measure during the slowdown.'),
        answer('התהליך החדש בהכרח נוזקה','The new process must be malware',false,'גיל התהליך וזמן המעבד אינם מוכיחים נוזקה. נדרש מידע על זהותו והתנהגותו.','Process age and CPU time do not establish malware. Identity and behavior need investigation.')
      ]),
      step('2. מדידה בזמן הפעולה האיטית','2. Measure during the slow task',
        'Task Manager — illustrative observations\nTime      ExampleLongRunningApp   ExampleNewApp\n10:00:00       1% CPU                 72% CPU\n10:00:15       1% CPU                 76% CPU\n10:00:30       0% CPU                 73% CPU\nUser recognizes ExampleNewApp as an active export.',
        'מהי הבדיקה הבאה הסבירה?','What is a reasonable next check?',[
        answer('לשמור עבודה ולהשוות אחרי שהייצוא מסתיים','Save work and compare after the export finishes',true,'נכון. כעת יש הקשר לעומס מתמשך. משווים את אותה פעולה לאחר שהמשימה הידועה מסתיימת, בלי להרוג תהליך מערכת.','Correct. Sustained load now has context. Compare the same task after the known export finishes, without killing a system process.'),
        answer('לסיים מיד את כל תהליכי המערכת','Immediately end all system processes',false,'אין צורך לסיים תהליכי מערכת. הייצוא המזוהה מספק שינוי יחיד שאפשר למדוד.','System processes need not be ended. The identified export offers one change to compare.'),
        answer('להתעלם כי רק CPU(s) חשוב','Ignore this because only CPU(s) matters',false,'המדידה הנוכחית קשורה לזמן שבו ההאטה מופיעה. זמן מצטבר עונה על שאלה אחרת.','Current readings relate to when the slowdown occurs. Accumulated time answers a different question.')
      ]),
      step('3. אותה פעולה אחרי הייצוא','3. The same task after exporting',
        'Export: finished normally\nExampleNewApp CPU: 1–3%\nOpening the same document:\nBefore: 9 seconds\nAfter: 2 seconds\nOther hardware checks: not performed',
        'איזו מסקנה מוצדקת?','Which conclusion is justified?',[
        answer('כל רכיבי החומרה נבדקו ונמצאו תקינים','All hardware was tested and found healthy',false,'נמדדו תגובת יישום ועומס. לא בוצעה כאן בדיקת חומרה מקיפה.','App response and load were measured. No comprehensive hardware test was performed.'),
        answer('היישום פגום כי השתמש במעבד','The app is defective because it used CPU',false,'ייצוא עשוי להשתמש במעבד כחלק מעבודה תקינה. עומס כשלעצמו אינו תקלה.','Exporting can legitimately use CPU. Load alone is not a fault.'),
        answer('ההאטה הייתה קשורה לעומס הייצוא בדוגמה','The example links the slowdown to export load',true,'נכון. אותו מבחן השתפר לאחר שהעומס הסתיים. זו ראיה לקשר בתנאים שנמדדו, ולא אישור שכל המחשב תקין.','Correct. The same test improved after the load ended. This supports a relationship under the measured conditions, not a clean bill of health for the entire PC.')
      ])
    ])
  ];
  return { flows, scenarios, sources };
})();
