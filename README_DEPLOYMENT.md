# 📖 คู่มือการติดตั้งและ Deploy ระบบ SmartCheck Enterprise (GitHub Pages + Google Apps Script + Google Drive)

คู่มือฉบับนี้อธิบายขั้นตอนการนำระบบ **SmartCheck Enterprise & Direct Link Parser** ขึ้นใช้งานจริงด้วยสถาปัตยกรรมแบบ **Serverless** ( GitHub Pages + Google Apps Script + Google Drive )

---

## 🏗️ โครงสร้างระบบ (Architecture Overview)

* **Frontend (GitHub Pages):** ให้บริการไฟล์สแตติก `index.html`, `app.js`, `styles.css` ฟรี ไร้ค่าใช้จ่ายเซิร์ฟเวอร์
* **Backend (Google Apps Script - `Code.gs`):** ทำหน้าที่เป็น REST API Handler รับ Request `doPost` / `doGet` จากหน้าเว็บ สกัดลิงก์ และประมวลผลไฟล์
* **Storage (Google Drive & Google Sheets):** โฟลเดอร์สำหรับเก็บไฟล์มัดรวม (.zip) / ไฟล์ส่งงาน และชีตบันทึกประวัติ `SmartCheck_Database`

---

## 🚀 ขั้นตอนที่ 1: การนำ Frontend ขึ้นใช้งานบน GitHub Pages

1. ผลักดัน (Push) ซอร์สโค้ดโปรเจกต์นี้ไปยัง **GitHub Repository** ของคุณ
2. เข้าไปที่หน้า Repository บน GitHub -> เลือกเมนู **Settings**
3. ที่แถบเมนูด้านซ้าย เลือก **Pages**
4. ในหัวข้อ **Build and deployment**:
   * **Source:** เลือก `Deploy from a branch`
   * **Branch:** เลือก `main` / `master` แล้วเลือกโฟลเดอร์ `/ (root)`
   * กดปุ่ม **Save**
5. รอระบบ GitHub ประมวลผลประมาณ 1-2 นาที คุณจะได้ URL เว็บไซต์ของคุณ เช่น:  
   `https://<your-username>.github.io/<repository-name>/`

---

## ⚡ ขั้นตอนที่ 2: การตั้งค่า Google Apps Script (`Code.gs`)

1. เข้าไปที่ [Google Apps Script](https://script.google.com/) แล้วกดปุ่ม **+ New project**
2. ตั้งชื่อโปรเจกต์ เช่น `SmartCheck Backend API`
3. คัดลอกเนื้อหาทั้งหมดในไฟล์ [`gas/Code.gs`](file:///d:/antigravity_take/stitch_directlink_pro_enterprise/stitch_directlink_pro_enterprise/gas/Code.gs) ไปวางแทนที่ในตัวบรรณาธิการโค้ด (ใช้อยู่ในไฟล์ `Code.gs` เพียงไฟล์เดียว)
4. กดปุ่ม **Deploy** (มุมขวาบน) -> เลือก **New deployment**
5. เลือกประเภท (Gear icon) -> เลือก **Web app**
   * **Description:** `SmartCheck Production API v2.0`
   * **Execute as:** `Me (อีเมลของคุณ)`
   * **Who has access:** `Anyone` *(สำคัญมาก เพื่อให้ GitHub Pages เรียกใช้งาน API ได้)*
6. กดปุ่ม **Deploy** -> กดยืนยันสิทธิ์เข้าถึง (Authorize access) ให้สิทธิ์อ่าน/เขียน Google Drive
7. คัดลอก **Web App URL** ที่ได้ เช่น:  
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 🔗 ขั้นตอนที่ 3: การเชื่อมต่อ Frontend บน GitHub Pages กับ GAS

1. เปิดเว็บไซต์ของคุณบน GitHub Pages หรือเปิดไฟล์ [index.html](file:///d:/antigravity_take/stitch_directlink_pro_enterprise/stitch_directlink_pro_enterprise/index.html)
2. คลิกเข้าเมนู **"ตั้งค่าระบบ" (Settings)** ด้านซ้ายมือ
3. ในส่วน **"การเชื่อมต่อ Google Apps Script & Google Drive"**:
   * วาง **Web App URL** ที่คัดลอกจากขั้นตอนที่ 2 ลงในช่อง
   * กดปุ่ม **"บันทึก URL"**
4. ระบบจะทำการบันทึก URL ไว้ใน Local Storage และเชื่อมต่อกับ Google Apps Script / Google Drive ทันที!

---

## 💡 หมายเหตุและการใช้งาน:
* หากยังไม่ได้ใส่ Web App URL ระบบจะสลับไปใช้ **Client-side Engine (โหมดในตัวเบราว์เซอร์)** ให้อัตโนมัติ เพื่อให้ผู้ใช้ทดสอบสกัดลิงก์ได้ทันทีโดยไม่ต้องรอนำขึ้นคลาวด์
