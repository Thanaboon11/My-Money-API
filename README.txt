MY MONEY V2.2 FINAL

ไม่ต้องแก้โค้ดทีละจุด

1) Apps Script
- เปิด Code.gs
- เลือกทั้งหมด แล้วแทนด้วย Code.gs จาก ZIP
- Save
- Deploy > Manage deployments > Edit > New version > Deploy
- เปิด /exec และตรวจ apiVersion = 2.2.0

2) GitHub Pages
แทนไฟล์เดิม 7 ไฟล์:
index.html
style.css
app.js
manifest.json
sw.js
icon-192.png
icon-512.png

ไม่ต้องอัปโหลด Code.gs ไป GitHub

V2.2:
- รายจ่ายใช้ “จ่ายจากบัญชี”
- รายรับใช้ “รับเข้าไปที่บัญชี”
- จาก/ไปบัญชีใช้เฉพาะโอนเงิน
- ซ่อนรายละเอียดรอง ลดขั้นตอนบันทึก
- ป้องกันกดบันทึกซ้ำ
- UI เปลี่ยนก่อน แล้วซิงก์ Google Sheets เบื้องหลัง
- ตรวจ Sheet ทุกประมาณ 5 วินาที
- เพิ่ม/แก้ไข/ลบ(ซ่อน)หมวดหมู่ได้เอง
