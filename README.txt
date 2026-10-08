MY MONEY — แก้แอปและเพิ่มชีตอ่านภาษาไทย

สำรอง Google Sheets และรอรายการในมือถือซิงก์ให้หมดก่อน

GITHUB PAGES:
1. อัปโหลด index.html, app.js, style.css, sw.js, manifest.json, icon-192.png, icon-512.png ไปทับไฟล์เดิมใน repository My-Money-API
2. สำคัญ: ต้องใช้ชื่อ manifest.json และ index.html ตามนี้ ไม่ใช่ชื่อที่มีวงเล็บ
3. รอ GitHub Pages อัปเดต แล้วเปิด URL จริงใน Chrome Android
4. ตรวจ Chrome > เมนู > ติดตั้งแอป / เพิ่มไปยังหน้าจอหลัก

GOOGLE SHEETS:
1. ใน Apps Script เพิ่มไฟล์สคริปต์ใหม่ชื่อ ThaiView.gs และวางโค้ดจากไฟล์ ThaiView.gs ใน ZIP
2. บันทึก เลือกฟังก์ชัน createThaiReadableHistory แล้วกด Run
3. กลับไป Google Sheets จะเห็นแท็บ "ประวัติภาษาไทย" ซึ่งอ่านชื่อบัญชีและหมวดหมู่เป็นไทย
4. เมื่อมีรายการใหม่ ให้รัน createThaiReadableHistory อีกครั้งเพื่ออัปเดตแท็บอ่านง่าย

ห้ามแปลรหัส ACC-KTB / EXP-FOOD / LEGACY... ในแท็บ Transactions ต้นฉบับโดยตรง เพราะเป็น ID เชื่อมกับแอป
ฟังก์ชันนี้สร้างแท็บอ่านง่าย ไม่แตะข้อมูลเดิม

ข้อจำกัด Android: การเปลี่ยน id และแก้ manifest ไม่รับประกันว่า Chrome จะเลิกแสดง "ติดตั้งแล้ว" เพราะสถานะอาจถูกจัดการโดย Chrome/ระบบปฏิบัติการหรือมีแอปเดิมค้างอยู่ การตรวจสอบต้องทำจาก Chrome บนมือถือจริง
