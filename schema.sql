-- ====================================================================
-- 🔑 Supabase Database Schema — SmartCheck Enterprise & Direct Link Parsing
-- บันทึกเมื่อ: 10 สิงหาคม 2026
-- ====================================================================

-- 1. ตารางข้อมูลนักเรียน (Students Table)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    class_room VARCHAR(20) DEFAULT 'ม.4/1',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางประวัติการเช็คชื่อเข้าเรียน (Attendance Logs Table)
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code VARCHAR(20) REFERENCES public.students(student_code) ON DELETE CASCADE,
    attendance_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (status IN ('present', 'late', 'absent')) DEFAULT 'present',
    check_in_time VARCHAR(20),
    check_in_method VARCHAR(50) DEFAULT 'สแกน QR',
    teacher_name VARCHAR(100) DEFAULT 'ดร. สมศักดิ์',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางประวัติการสกัดลิงก์ดาวน์โหลด (Parsed Download Jobs Table)
CREATE TABLE IF NOT EXISTS public.parsed_download_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_data TEXT NOT NULL,
    parsed_urls JSONB DEFAULT '[]'::jsonb,
    total_urls INTEGER DEFAULT 0,
    auto_zip BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) CHECK (status IN ('completed', 'processing', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index เพื่อเพิ่มความเร็วในการสืบค้นข้อมูล
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_logs(attendance_date);
CREATE INDEX IF NOT EXISTS idx_student_code ON public.students(student_code);
CREATE INDEX IF NOT EXISTS idx_parsed_jobs_created ON public.parsed_download_jobs(created_at DESC);

-- การเปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parsed_download_jobs ENABLE ROW LEVEL SECURITY;

-- นโยบายการเข้าถึงข้อมูลสำหรับ Anon Public Key (ตามที่บันทึกไว้ใน supabase_config.md)
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public all attendance" ON public.attendance_logs FOR ALL USING (true);
CREATE POLICY "Allow public all parsed jobs" ON public.parsed_download_jobs FOR ALL USING (true);

-- ข้อมูลตัวอย่างเริ่มต้น (Initial Seed Data)
INSERT INTO public.students (student_code, full_name, class_room) VALUES
('64012345', 'อานันท์ มหิดล', 'ม.4/1'),
('64012346', 'ไชยา ศิริพงษ์', 'ม.4/1'),
('64012347', 'กัญญา วงศ์', 'ม.4/1'),
('64012348', 'ณเดชน์ คูกิมิยะ', 'ม.4/1'),
('64012349', 'ญาญ่า อุรัสยา', 'ม.4/1')
ON CONFLICT (student_code) DO NOTHING;
