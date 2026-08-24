# 📘 เอกสารข้อกำหนดและการออกแบบระบบ (System Architecture Document - SAD)
## ระบบเช็คชื่อและวิเคราะห์การเข้าเรียนอัจฉริยะองค์กร (SmartCheck Enterprise System)

**เวอร์ชัน:** 2.0 (Enterprise Production Ready)  
**สถานะ:** อนุมัติการพัฒนาและใช้งาน (Approved for Enterprise Deployment)  
**การเข้ารหัสภาษา:** UTF-8 100% (Thai & English Support)

---

### 1. ภาพรวมของระบบ (System Overview)

**SmartCheck Enterprise** เป็นระบบบริหารจัดการและวิเคราะห์การเข้าเรียนอัจฉริยะแบบเรียลไทม์ สำหรับสถานศึกษาและองค์กรระดับ Enterprise ออกแบบมาเพื่อทดแทนกระบวนการเช็คชื่อแบบดั้งเดิมด้วยการเชื่อมโยงระบบการบันทึก (QR Code, RFID, Manual Logging) เข้ากับฐานข้อมูล Cloud Realtime (Supabase) และระบบประมวลผลการขาดเรียนที่ผิดปกติด้วย AI Analytics

#### วัตถุประสงค์หลัก
1. **Realtime Attendance Tracking:** บันทึกและแสดงผลสถานะการเข้าเรียน (มาเรียน / สาย / ขาด) แบบเรียลไทม์พร้อม Timestamp
2. **Cross-Platform Responsive Experience:** รองรับการทำงานทั้งบน Desktop (Admin Dashboard) และ Mobile (Teacher Attendance Interface) ภายใต้ Single Page Application (SPA) เดียวกัน
3. **Enterprise Data Security (RLS):** ปกป้องข้อมูลนักเรียนและประวัติการเข้าเรียนด้วย Row Level Security (RLS) ระดับฐานข้อมูล
4. **Automated Analytics & Export:** สรุปแนวโน้มการเข้าเรียนประจำสัปดาห์/เดือน พร้อมระบบส่งออกข้อมูลรูปแบบ CSV ภาษาไทย (UTF-8 BOM) และการพิมพ์รายงาน

---

### 2. สถาปัตยกรรมระบบ (System Architecture)

ระบบใช้สถาปัตยกรรม **Decoupled Serverless Cloud Architecture** ร่วมกับ **Single Page Application (SPA)**

```mermaid
graph TD
    Client[Client Interface - index.html / UTF-8 SPA] -->|Material Design 3 / Kanit Font| UI[UI Components & Navigation]
    UI -->|State Management / JS| Core[App Core Logic - app.js]
    Core -->|Supabase JS SDK v2| Supabase[Supabase Cloud Platform]
    Supabase -->|REST API / Realtime| DB[(PostgreSQL Database)]
    Supabase -->|Row Level Security| RLS[RLS Security Policies]
    Core -->|Export Engine| CSV[CSV File Generator / UTF-8 BOM]
```

#### ส่วนประกอบสำคัญ
* **Frontend Layer:** HTML5, Vanilla JavaScript (ES6+), TailwindCSS (Custom Tokens)
* **Design System:** Luminous Enterprise (Material Design 3 Extension, Glassmorphic AI Overlay)
* **Database & Auth Layer:** Supabase Cloud (PostgreSQL with RLS Enabled)
* **API Protocol:** HTTPS REST API, WebSocket (Realtime Subscriptions)

---

### 3. ฟังก์ชันการทำงานหลัก (Core System Features)

1. **Smart Dashboard & KPI Analytics:**
   - คำนวณอัตราการเข้าเรียนเฉลี่ย (%) อัตโนมัติ
   - ตรวจจับและแจ้งเตือนจำนวนการขาดเรียน/สายที่ผิดปกติ
   - กราฟแท่งเปรียบเทียบแนวโน้มการเข้าเรียนประจำสัปดาห์ (Monday-Friday)

2. **Realtime Attendance Management (หน้าเช็คชื่อ):**
   - ปุ่มเช็คชื่อแบบ 3 สถานะ (มาเรียน / สาย / ขาด) พร้อมเปลี่ยนสี Indicator ทันที
   - ปุ่ม Quick Action: **"มาครบทุกคน" (Mark All Present)** และ **"รีเซ็ตทั้งหมด"**
   - ระบบค้นหาอัจฉริยะ (Smart Search) ค้นตามชื่อหรือรหัสนักเรียน
   - ตัวกรองสถานะ (Filter Chips): ทั้งหมด, มาเรียน, สาย, ขาด

3. **Data Export & Reporting:**
   - ส่งออกข้อมูลการเช็คชื่อเป็นไฟล์ CSV ภาษาไทย 100% พร้อมใส่ Byte Order Mark (`\uFEFF`) สำหรับเปิดใน MS Excel
   - สรุปสถิติประจำเดือน และฟังก์ชันสำหรับพิมพ์รายงาน (Print Layout)

4. **Security & System Status Monitor:**
   - ตัวแสดงสถานะความเร็วการเชื่อมต่อฐานข้อมูล (Supabase API Latency Monitor)
   - หน้าจอจัดการนโยบายความปลอดภัย RLS (Row Level Security Policy Viewer)

---

### 4. การออกแบบโครงสร้างข้อมูล (Database Schema & RLS Design)

#### 4.1 ตารางนักเรียน (`students`)
```sql
CREATE TABLE public.students (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id VARCHAR(50) NOT NULL DEFAULT 'CS-101',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.2 ตารางบันทึกการเข้าเรียน (`attendance_logs`)
```sql
CREATE TABLE public.attendance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES public.students(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('present', 'late', 'absent')) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recording_method VARCHAR(50) DEFAULT 'บันทึกโดยผู้ดูแล',
    date DATE DEFAULT CURRENT_DATE
);
```

#### 4.3 นโยบายความปลอดภัย (Row Level Security - RLS Policies)
```sql
-- เปิดใช้งาน RLS บนทุกตาราง
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

-- นโยบาย 1: ครูอ่านเฉพาะข้อมูลชั้นเรียนที่ตนเองดูแล
CREATE POLICY "Teachers view own classes"
ON public.students FOR SELECT
USING (auth.uid() IS NOT NULL);

-- นโยบาย 2: ผู้ดูแลระบบมีสิทธิ์เข้าถึงและแก้ไขบันทึกทั้งหมด
CREATE POLICY "Admins full access"
ON public.attendance_logs FOR ALL
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');
```

---

### 5. การตั้งค่าสภาพแวดล้อมและการเชื่อมต่อ (Supabase Config)

- **Project URL:** `https://ewqzqwmarlmetuvndcxe.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXpxd21hcmxtZXR1dm5kY3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTkyMDQsImV4cCI6MjA5OTQ5NTIwNH0.FfemXB0Uvx8Q-WRxjUFaKbsgnmOdx05BVxRSqud0KNo`
- **Encoding Standard:** UTF-8 Strict