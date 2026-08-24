/**
 * ====================================================================
 * 🌐 SmartCheck Enterprise — Frontend App Logic (GitHub Pages Ready)
 * ====================================================================
 * ทำหน้าที่:
 * 1. ควบคุม SPA View Navigation (Dashboard, Attendance, Reports, Parser, Settings)
 * 2. สกัดและแปลง Direct Link ผ่าน Google Apps Script API หรือ Client Engine
 * 3. บันทึกและซิงค์ข้อมูลการเช็คชื่อเข้าเรียน
 * 
 * @author SmartCheck Development Team
 */

// State Management
let gasWebAppUrl = localStorage.getItem('smartcheck_gas_url') || 'https://script.google.com/macros/s/AKfycbxIo-xYYqSrUX8p7QmCHOIOCwtfRsIXBnNcxhcb45p_wrp999IYJpXL_DdeJZAm7x80/exec';
let currentFilter = 'all';
let searchQuery = '';
let parsedLinkItems = [];

// Student Mock Data
let students = [
    { id: '64012345', name: 'อานันท์ มหิดล', status: 'present', method: 'สแกน QR', time: '08:15 น.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGOeJamZMxgM4DUMoEaCBzXomWb-ZBy7aBtoWnUZGfHRdynnpadvG40UUJDbCJ_WG1Km9GmucSIKS9R9ohf71D1FL_AAgpz09punyBpeRDsK6v3OcZYQFma4h-Lynp7gsqB1D8WiicI1FqKAIZ2oSsvBftpYDDEajF5ZJNxPwWIxMzd2zZ4va-0zAWReK5xcozs33t4DbMYxCjcVsSDxFXSneTs43qhg8YwDlLv-QPJ_2V5fY6MIAPSqCoB5evQ2HbsYXAd8ohQP4' },
    { id: '64012346', name: 'ไชยา ศิริพงษ์', status: 'late', method: 'บันทึกเอง', time: '08:42 น.', avatar: '' },
    { id: '64012347', name: 'กัญญา วงศ์', status: 'absent', method: '-', time: '-', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgqj1IZiL3XeyXImjFk4Ga3Kft868brt5XkK0TIekAO_B1rFfagO5daqIn1C0bilLKtEOCVGMIsAenHiwCoATN_4Rus9mbU4dhzFNHR9td9D5Ued8kZW2X7YHx7eZ1rVSjwTjJAF19wsQxiszM7PHvb5OPGOQ4OxvUPXz137wIbH4CBH9tStxef4CRM8NGNgL8ZXalaBk5Zp21U94M5oyQpDqtXr6ybJcj72f0oONX2weC08BzZMI3wwaO59YhvPrJisjcBYNx3RM' },
    { id: '64012348', name: 'ณเดชน์ คูกิมิยะ', status: 'present', method: 'สแกน QR', time: '08:12 น.', avatar: '' },
    { id: '64012349', name: 'ญาญ่า อุรัสยา', status: 'present', method: 'สแกน RFID', time: '08:10 น.', avatar: '' },
    { id: '64012350', name: 'มาริโอ้ เมาเร่อ', status: 'present', method: 'สแกน QR', time: '08:18 น.', avatar: '' },
    { id: '64012351', name: 'ธีรเดช วงศ์พัวพันธ์', status: 'absent', method: '-', time: '-', avatar: '' },
    { id: '64012352', name: 'พัชราภา ไชยเชื้อ', status: 'present', method: 'สแกน RFID', time: '08:05 น.', avatar: '' }
];

// Fill students to 32
for (let i = 9; i <= 32; i++) {
    students.push({
        id: '64012' + (345 + i),
        name: 'นักเรียน ตัวอย่าง ' + i,
        status: 'present',
        method: 'สแกน QR',
        time: '08:15 น.',
        avatar: ''
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateEl = document.getElementById('current-date-text');
    if (dateEl) dateEl.textContent = dateStr;

    // Load saved GAS URL if exists
    const gasInput = document.getElementById('gas-url-input');
    if (gasInput) gasInput.value = gasWebAppUrl;

    updateGasStatusUI();
    renderStudents();
    updateStatistics();
});

// SPA Navigation
function switchView(viewName) {
    ['dashboard', 'attendance', 'reports', 'parser', 'settings'].forEach(v => {
        const targetView = document.getElementById(`view-${v}`);
        if (targetView) targetView.classList.add('hidden');

        const navBtn = document.getElementById(`nav-${v}`);
        if (navBtn) {
            if (v === viewName) {
                navBtn.className = 'nav-item flex items-center gap-3 bg-primary/10 text-primary dark:text-blue-400 font-semibold rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 text-left w-full';
                navBtn.querySelector('.material-symbols-outlined')?.classList.add('icon-fill');
            } else {
                navBtn.className = 'nav-item flex items-center gap-3 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-gray-800 hover:text-on-surface dark:hover:text-white font-medium rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 text-left w-full';
                navBtn.querySelector('.material-symbols-outlined')?.classList.remove('icon-fill');
            }
        }

        const bnavBtn = document.getElementById(`bnav-${v}`);
        if (bnavBtn) {
            if (v === viewName) {
                bnavBtn.className = 'flex flex-col items-center justify-center text-primary dark:text-blue-400 px-3 py-1';
                bnavBtn.querySelector('.material-symbols-outlined')?.classList.add('icon-fill');
            } else {
                bnavBtn.className = 'flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 px-3 py-1';
                bnavBtn.querySelector('.material-symbols-outlined')?.classList.remove('icon-fill');
            }
        }
    });

    const currentView = document.getElementById(`view-${viewName}`);
    if (currentView) currentView.classList.remove('hidden');
    toggleSidebar(false);
}

function toggleSidebar(show) {
    const sidebar = document.getElementById('main-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar || !backdrop) return;
    if (show) {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const icon = document.getElementById('dark-mode-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        if (icon) icon.textContent = 'dark_mode';
        showToast('สลับไปยังโหมดสว่างเรียบร้อย');
    } else {
        html.classList.add('dark');
        if (icon) icon.textContent = 'light_mode';
        showToast('สลับไปยังโหมดมืดเรียบร้อย');
    }
}

// GAS Web App URL Config
function saveGasUrl() {
    const val = document.getElementById('gas-url-input').value.trim();
    gasWebAppUrl = val;
    localStorage.setItem('smartcheck_gas_url', val);
    updateGasStatusUI();
    showToast('บันทึก Google Apps Script Web App URL เรียบร้อย');
}

function updateGasStatusUI() {
    const statusText = document.getElementById('gas-status-text');
    const badgeText = document.getElementById('gas-badge');
    if (gasWebAppUrl) {
        if (statusText) statusText.textContent = 'เชื่อมต่อ Google Apps Script Web App แล้ว';
        if (badgeText) {
            badgeText.textContent = 'GAS Connected';
            badgeText.className = 'text-green-600 dark:text-green-400 font-semibold text-xs';
        }
    } else {
        if (statusText) statusText.textContent = 'โหมดทำงานอิสระในตัวเบราว์เซอร์ (Client-side Engine)';
        if (badgeText) {
            badgeText.textContent = 'Client Mode';
            badgeText.className = 'text-blue-600 dark:text-blue-400 font-semibold text-xs';
        }
    }
}

// --------------------------------------------------------------------
// ⚡ SMART DIRECT LINK PARSER & CONVERTER LOGIC
// --------------------------------------------------------------------

function loadSamplePasteData() {
    const sampleText = `ไฟล์งานส่งครูม.4/1 ครับ:\n1. การบ้านฟิสิกส์ อานันท์: https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing\n2. รายงานชีววิทยา กัญญา: https://www.dropbox.com/s/xyz123456789/report_biology.pdf?dl=0\n3. ไฟล์รูปการทดลอง: https://example.com/downloads/experiment_lab.jpg\n4. สไลด์นำเสนอ ญาญ่า: https://drive.google.com/file/d/9Z8Y7X6W5V4U3T2S1R/view`;
    
    document.getElementById('raw-paste-input').value = sampleText;
    parseRawText();
    showToast('โหลดข้อมูลตัวอย่างแล้ว!');
}

function clearPasteArea() {
    document.getElementById('raw-paste-input').value = '';
    parsedLinkItems = [];
    renderParsedResults();
    updateParserStats();
    showToast('ล้างข้อมูลเรียบร้อย');
}

function handleAutoParse() {
    const val = document.getElementById('raw-paste-input').value;
    if (val.trim()) {
        parseRawText(true);
    }
}

async function parseRawText(silent = false) {
    const rawText = document.getElementById('raw-paste-input').value;
    const isAutoZip = document.getElementById('auto-zip-toggle')?.checked || false;

    if (gasWebAppUrl) {
        try {
            const res = await fetch(gasWebAppUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'parse_links', rawText: rawText, autoZip: isAutoZip })
            });
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                parsedLinkItems = data.data.items.map(item => ({
                    id: item.id,
                    originalUrl: item.originalUrl,
                    directUrl: item.directUrl,
                    platform: item.platform,
                    fileType: item.fileType,
                    badgeColor: getBadgeColor(item.platform)
                }));
            }
        } catch (err) {
            console.warn('GAS Server Error, fallback to Client Engine', err);
            clientSideParse(rawText);
        }
    } else {
        clientSideParse(rawText);
    }

    renderParsedResults();
    updateParserStats();

    if (!silent && parsedLinkItems.length > 0) {
        showToast(`สกัดได้ทั้งหมด ${parsedLinkItems.length} ลิงก์เรียบร้อย`);
    }
}

function clientSideParse(rawText) {
    const urlRegex = /(https?:\/\/[^\s<>"'\)]+)/gi;
    const matches = rawText.match(urlRegex) || [];
    const uniqueUrls = [...new Set(matches)];

    parsedLinkItems = uniqueUrls.map((url, idx) => {
        const converted = convertUrlToDirect(url);
        return {
            id: idx + 1,
            originalUrl: url,
            directUrl: converted.directUrl,
            platform: converted.platform,
            fileType: converted.fileType,
            badgeColor: converted.badgeColor
        };
    });
}

function convertUrlToDirect(url) {
    let directUrl = url;
    let platform = 'Direct / Web';
    let fileType = 'ไฟล์ทั่วไป';
    let badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

    if (url.includes('drive.google.com')) {
        platform = 'Google Drive';
        badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
        const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            directUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
    } else if (url.includes('dropbox.com')) {
        platform = 'Dropbox';
        badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300';
        directUrl = url.replace('dl=0', 'dl=1');
        if (!directUrl.includes('dl=1')) {
            directUrl += (directUrl.includes('?') ? '&dl=1' : '?dl=1');
        }
    } else if (url.includes('1drv.ms') || url.includes('onedrive')) {
        platform = 'OneDrive';
        badgeColor = 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300';
    }

    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) fileType = 'รูปภาพ';
    else if (url.match(/\.(pdf)$/i)) fileType = 'เอกสาร PDF';
    else if (url.match(/\.(zip|rar|7z)$/i)) fileType = 'ไฟล์บีบอัด Zip';
    else if (url.match(/\.(docx?|pptx?|xlsx?)$/i)) fileType = 'เอกสาร Office';

    return { directUrl, platform, fileType, badgeColor };
}

function getBadgeColor(platform) {
    if (platform === 'Google Drive') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
    if (platform === 'Dropbox') return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300';
    if (platform === 'OneDrive') return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
}

function renderParsedResults() {
    const tbody = document.getElementById('parsed-results-list');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (parsedLinkItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center text-gray-400 text-xs font-sans">
                    ยังไม่มีข้อมูลลิงก์ที่ถูกสกัด — กรุณาวางข้อความในกล่อง Smart Paste Area ด้านบน
                </td>
            </tr>
        `;
        return;
    }

    parsedLinkItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-primary/5 dark:hover:bg-gray-700/50 transition-colors';
        tr.innerHTML = `
            <td class="p-3 pl-4 font-bold text-gray-500">${item.id}</td>
            <td class="p-3">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${item.badgeColor}">
                    ${item.platform}
                </span>
            </td>
            <td class="p-3 text-xs text-gray-600 dark:text-gray-300 max-w-[200px] truncate" title="${item.originalUrl}">
                ${item.originalUrl}
            </td>
            <td class="p-3 text-xs text-primary dark:text-blue-400 font-semibold max-w-[240px] truncate" title="${item.directUrl}">
                ${item.directUrl}
            </td>
            <td class="p-3 pr-4 text-right">
                <div class="flex items-center justify-end gap-1 font-sans">
                    <button onclick="copySingleLink('${item.directUrl}')" class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors" title="คัดลอกลิงก์ตรง">
                        <span class="material-symbols-outlined text-base">content_copy</span>
                    </button>
                    <a href="${item.directUrl}" target="_blank" class="p-1.5 hover:bg-primary/10 text-primary dark:text-blue-400 rounded-lg transition-colors" title="ทดสอบดาวน์โหลด">
                        <span class="material-symbols-outlined text-base">open_in_new</span>
                    </a>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateParserStats() {
    const total = parsedLinkItems.length;
    const foundEl = document.getElementById('stat-found-links');
    const convertedEl = document.getElementById('stat-converted-links');
    if (foundEl) foundEl.textContent = total;
    if (convertedEl) convertedEl.textContent = total;
}

function copyAllDirectLinks() {
    if (parsedLinkItems.length === 0) {
        showToast('ไม่มีลิงก์สำหรับคัดลอก');
        return;
    }
    const allLinksText = parsedLinkItems.map(i => i.directUrl).join('\n');
    navigator.clipboard.writeText(allLinksText).then(() => {
        showToast(`คัดลอกลิงก์ตรงทั้ง ${parsedLinkItems.length} รายการเรียบร้อย`);
    });
}

function copySingleLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('คัดลอก Direct Link เรียบร้อย');
    });
}

function downloadAllFiles() {
    if (parsedLinkItems.length === 0) {
        showToast('ไม่มีไฟล์สำหรับดาวน์โหลด');
        return;
    }
    const isZip = document.getElementById('auto-zip-toggle')?.checked;
    if (isZip) {
        showToast(`เริ่มต้นมัดรวมไฟล์ ${parsedLinkItems.length} รายการเป็น SmartCheck_Batch.zip...`);
    } else {
        showToast(`เริ่มดาวน์โหลดแบบกลุ่ม ${parsedLinkItems.length} ไฟล์...`);
        parsedLinkItems.forEach(item => {
            window.open(item.directUrl, '_blank');
        });
    }
}

// Attendance Logic
function renderStudents() {
    const grid = document.getElementById('students-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = students.filter(s => {
        const matchStatus = (currentFilter === 'all') || (s.status === currentFilter);
        const matchSearch = s.name.includes(searchQuery) || s.id.includes(searchQuery);
        return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400 text-sm">ไม่พบข้อมูลนักเรียนที่ค้นหา</div>';
        return;
    }

    filtered.forEach(s => {
        let statusBadgeColor = 'border-green-500 bg-green-500';
        let cardBorderColor = '';
        if (s.status === 'late') { statusBadgeColor = 'border-yellow-400 bg-yellow-400'; cardBorderColor = 'border-l-4 border-l-yellow-400'; }
        if (s.status === 'absent') { statusBadgeColor = 'border-red-500 bg-red-500'; cardBorderColor = 'border-l-4 border-l-red-500'; }

        const initials = s.name.substring(0, 2);
        const avatarHTML = s.avatar 
            ? `<img class="w-12 h-12 rounded-full object-cover shadow-sm" alt="รูปของ ${s.name}" src="${s.avatar}"/>`
            : `<div class="w-12 h-12 rounded-full bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-sm">${initials}</div>`;

        const card = document.createElement('div');
        card.className = `bg-white dark:bg-gray-800 p-4 rounded-2xl border border-outline-variant/30 dark:border-gray-700 shadow-sm flex items-center justify-between ${cardBorderColor}`;
        
        card.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="relative">
                    ${avatarHTML}
                    <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusBadgeColor} border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <div>
                    <h3 class="font-semibold text-sm text-on-surface dark:text-white">${s.name}</h3>
                    <p class="text-xs text-on-surface-variant dark:text-gray-400">รหัส: ${s.id}</p>
                </div>
            </div>
            <div class="flex gap-1 bg-surface-container-low dark:bg-gray-700/60 rounded-xl p-1">
                <button onclick="setStudentStatus('${s.id}', 'present')" title="มาเรียน" class="w-9 h-9 rounded-lg flex items-center justify-center transition-all ${s.status === 'present' ? 'bg-green-600 text-white font-bold shadow-sm' : 'text-gray-400 hover:text-green-600'}">
                    <span class="material-symbols-outlined text-lg">check</span>
                </button>
                <button onclick="setStudentStatus('${s.id}', 'late')" title="สาย" class="w-9 h-9 rounded-lg flex items-center justify-center transition-all ${s.status === 'late' ? 'bg-yellow-500 text-white font-bold shadow-sm' : 'text-gray-400 hover:text-yellow-600'}">
                    <span class="material-symbols-outlined text-lg">schedule</span>
                </button>
                <button onclick="setStudentStatus('${s.id}', 'absent')" title="ขาด" class="w-9 h-9 rounded-lg flex items-center justify-center transition-all ${s.status === 'absent' ? 'bg-red-600 text-white font-bold shadow-sm' : 'text-gray-400 hover:text-red-600'}">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setStudentStatus(id, newStatus) {
    const student = students.find(s => s.id === id);
    if (student) {
        student.status = newStatus;
        student.time = newStatus === 'absent' ? '-' : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
        student.method = 'บันทึกโดยผู้ดูแล';
        renderStudents();
        updateStatistics();

        // Sync to GAS if URL is configured
        if (gasWebAppUrl) {
            fetch(gasWebAppUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'log_attendance', studentCode: student.id, studentName: student.name, status: newStatus, method: 'เว็บแอป' })
            }).catch(e => console.warn('GAS Sync warning', e));
        }

        showToast(`อัพเดตสถานะของ ${student.name} เรียบร้อย`);
    }
}

function updateStatistics() {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const late = students.filter(s => s.status === 'late').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const rate = Math.round((present / total) * 100);

    const cntAll = document.getElementById('cnt-all'); if (cntAll) cntAll.textContent = total;
    const cntPresent = document.getElementById('cnt-present'); if (cntPresent) cntPresent.textContent = present;
    const cntLate = document.getElementById('cnt-late'); if (cntLate) cntLate.textContent = late;
    const cntAbsent = document.getElementById('cnt-absent'); if (cntAbsent) cntAbsent.textContent = absent;

    const rateEl = document.getElementById('kpi-attendance-rate'); if (rateEl) rateEl.textContent = rate + '%';
    const absentEl = document.getElementById('kpi-absent-count'); if (absentEl) absentEl.textContent = (late + absent) + ' คน';
    const chartVal = document.getElementById('chart-today-val'); if (chartVal) chartVal.textContent = rate + '%';
}

function exportCSV() {
    let csvContent = "\uFEFFรหัสนักเรียน,ชื่อ-นามสกุล,สถานะการเข้าเรียน,เวลาบันทึก,วิธีบันทึก\n";
    students.forEach(s => {
        let statusText = 'มาเรียน';
        if (s.status === 'late') statusText = 'สาย';
        if (s.status === 'absent') statusText = 'ขาด';
        csvContent += `"${s.id}","${s.name}","${statusText}","${s.time}","${s.method}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `smartcheck_attendance_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('ส่งออกไฟล์ CSV ภาษาไทย (UTF-8) เรียบร้อย');
}

function setFilter(filterType) {
    currentFilter = filterType;
    ['all', 'present', 'late', 'absent'].forEach(f => {
        const btn = document.getElementById(`filter-${f}`);
        if (btn) {
            if (f === filterType) {
                btn.className = 'filter-btn px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap';
            } else {
                btn.className = 'filter-btn px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 border border-outline-variant/50 text-xs font-medium hover:border-primary transition-all whitespace-nowrap';
            }
        }
    });
    renderStudents();
}

function filterStudents() {
    const input = document.getElementById('attendance-search');
    if (input) searchQuery = input.value.trim();
    renderStudents();
}

function handleGlobalSearch(val) {
    searchQuery = val.trim();
    if (val) {
        switchView('attendance');
        const input = document.getElementById('attendance-search');
        if (input) input.value = val;
        filterStudents();
    }
}

function markAllPresent() {
    students.forEach(s => {
        s.status = 'present';
        s.time = '08:15 น.';
        s.method = 'เช็คชื่อร่วม';
    });
    renderStudents();
    updateStatistics();
    showToast('บันทึก มาครบทุกคน เรียบร้อยแล้ว');
}

function resetAllAttendance() {
    students.forEach(s => {
        s.status = 'present';
    });
    renderStudents();
    updateStatistics();
    showToast('รีเซ็ตสถานะการเช็คชื่อแล้ว');
}

// Modal Handlers
function openAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) modal.style.display = 'flex';
}

function closeAddStudentModal() {
    const modal = document.getElementById('add-student-modal');
    if (modal) modal.style.display = 'none';
}

function handleAddStudentSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('modal-student-name');
    const idInput = document.getElementById('modal-student-id');
    
    if (!nameInput || !idInput) return;
    const name = nameInput.value.trim();
    const id = idInput.value.trim();

    if (!name || !id) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    students.unshift({
        id: id,
        name: name,
        status: 'present',
        method: 'เพิ่มในระบบ',
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
        avatar: ''
    });

    renderStudents();
    updateStatistics();
    closeAddStudentModal();
    nameInput.value = '';
    idInput.value = '';
    showToast(`เพิ่มนักเรียน ${name} เรียบร้อยแล้ว`);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'bg-gray-900/90 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2 animate-bounce';
    toast.innerHTML = `<span class="material-symbols-outlined text-green-400 text-sm">check_circle</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}
