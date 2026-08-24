# 🔑 Supabase Configuration — SmartCheck Enterprise

> **บันทึกเมื่อ:** 3 สิงหาคม 2026, 14:11 น.

---

## ข้อมูลการเชื่อมต่อ (Connection Details)

| รายการ | ค่า |
|--------|-----|
| **Project URL** | `https://ewqzqwmarlmetuvndcxe.supabase.co` |
| **Anon (Public) Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXpxd21hcmxtZXR1dm5kY3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTkyMDQsImV4cCI6MjA5OTQ5NTIwNH0.FfemXB0Uvx8Q-WRxjUFaKbsgnmOdx05BVxRSqud0KNo` |
| **Project Ref** | `ewqzqwmarlmetuvndcxe` |

---

## ตัวอย่างการใช้งาน

### JavaScript (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://ewqzqwmarlmetuvndcxe.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXpxd21hcmxtZXR1dm5kY3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTkyMDQsImV4cCI6MjA5OTQ5NTIwNH0.FfemXB0Uvx8Q-WRxjUFaKbsgnmOdx05BVxRSqud0KNo';

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
```

### JavaScript (ES Module / npm)

```js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ewqzqwmarlmetuvndcxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXpxd21hcmxtZXR1dm5kY3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTkyMDQsImV4cCI6MjA5OTQ5NTIwNH0.FfemXB0Uvx8Q-WRxjUFaKbsgnmOdx05BVxRSqud0KNo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## API Endpoints อ้างอิง

| Endpoint | URL |
|----------|-----|
| REST API | `https://ewqzqwmarlmetuvndcxe.supabase.co/rest/v1/` |
| Auth | `https://ewqzqwmarlmetuvndcxe.supabase.co/auth/v1/` |
| Storage | `https://ewqzqwmarlmetuvndcxe.supabase.co/storage/v1/` |
| Realtime | `wss://ewqzqwmarlmetuvndcxe.supabase.co/realtime/v1/` |
| Dashboard | `https://supabase.com/dashboard/project/ewqzqwmarlmetuvndcxe` |

---

> [!CAUTION]
> **Anon Key** เป็น public key สำหรับฝั่ง client เท่านั้น — อย่าเผยแพร่ **Service Role Key** ใน code ที่ฝั่ง client เด็ดขาด
