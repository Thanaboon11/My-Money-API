MY MONEY — ตั้งค่า 5 บัญชี (ไฟล์คำแนะนำเดียว)

บัญชีที่ต้องการ: กรุงไทย, กรุงไทย 2, ออมสินฝาก, ออมสินออนไลน์, กสิกร
เงินสดและ TrueMoney จะถูกซ่อน ไม่ลบแถวหรือประวัติธุรกรรม

ก่อนทำ: สำเนา Google Sheet และตรวจว่ารายการที่รอซิงก์ส่งสำเร็จทั้งหมด
1. เปิด Apps Script เดิม นำ Code.gs จาก ZIP ไปแทนโค้ดเดิมทั้งหมด กด Save
2. ที่เมนูฟังก์ชันด้านบน เลือก setupFiveAccounts แล้วกด Run หนึ่งครั้ง อนุญาตสิทธิ์ถ้าระบบถาม
3. ตรวจแท็บ Accounts ใน Google Sheet ให้เห็นบัญชีใช้งาน 5 บัญชี
4. Deploy > Manage deployments > Edit > New version > Deploy
5. เปิดแอปใหม่ ตรวจรายชื่อบัญชีและยอดเงิน

ไม่ต้องอัปโหลดไฟล์เว็บขึ้น GitHub รอบนี้ เพราะเปลี่ยนเฉพาะข้อมูลบัญชีในชีต
ข้อควรระวัง: หากข้อมูลเก่ามีรายการผูกกับเงินสดหรือ TrueMoney จะยังคงอยู่ในประวัติ
และไม่ถูกย้ายเข้าบัญชีใหม่โดยอัตโนมัติ ห้ามลบแถวบัญชีเหล่านั้น
การนำเข้าประวัติจากไฟล์เก่ายังไม่รวมอยู่ในชุดนี้ เพราะต้องตรวจยอดตั้งต้นและรายการซ้ำก่อน

ANDROID INSTALL FIX:
1. Upload ALL web files (index.html, style.css, app.js, sw.js, manifest.json, icon-192.png, icon-512.png) to GitHub Pages repository root. Do NOT upload Code.gs to GitHub.
2. Wait for Pages deployment, then open https://thanaboon11.github.io/My-Money-API/index.html?app=my-money-20261008-v2 in Chrome Android.
3. Chrome menu > Install app / Add to Home screen.
4. If Android still says installed, check Android Settings > Apps > My Money and Chrome installed web apps. Existing PWA registration may remain on device.
5. Do not clear site data while unsynced entries remain.
NOTE: This updates manifest identity but cannot forcibly remove a device-side prior install.
