MY MONEY — แก้หน้ากรอกและหัวตารางภาษาไทย

1. สำรอง Google Sheets ก่อน และรอรายการค้างซิงก์
2. อัปโหลดไฟล์เว็บจาก ZIP ไป GitHub Pages (ยกเว้น Code.gs และ README.txt)
3. Apps Script: แทน Code.gs เดิมด้วยไฟล์ Code.gs จาก ZIP แต่เก็บ ImportHistory.gs เดิมไว้
4. เลือกฟังก์ชัน setThaiSheetHeaders และ Run หนึ่งครั้ง เพื่อแปลหัวตาราง
5. เลือก inspectKrungthaiBalance และ Run จากนั้นดู Execution log เพื่อเช็กยอดและรายการ 118.25
6. Deploy > Manage deployments > Edit > New version > Deploy

เอาช่องผู้ให้/แหล่งรายรับออกจากแอปแล้ว ใช้ชื่อรายการแทน
รหัสบัญชีและรหัสหมวดหมู่ยังเป็นอังกฤษเพื่อไม่ให้การเชื่อมโยงพัง ชื่อหมวดหมู่ภาษาไทยอยู่ใน Categories
ไม่ได้ปรับยอดตั้งต้นหรือเพิ่มรายการ 118.25 ซ้ำ เพราะต้องตรวจว่าเหตุใดยอดไม่เปลี่ยนก่อน
