// ─────────────────────────────────────────────
// calendar.js — ปฏิทินแสดงสถานะรายวัน
// ─────────────────────────────────────────────

const Calendar = {
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  records: [],

  dayNames: ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],

  monthNames: [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ],

  statusClass(status) {
    if (!status) return "none";
    const map = {
      "มาปฏิบัติงาน": "present",
      "ลาป่วย": "sick",
      "ลากิจ": "leave",
      "ไปทำกิจกรรมโรงเรียน": "activity",
      "อื่นๆ": "other",
    };
    return map[status] || "none";
  },

  getYearMonth() {
    return `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}`;
  },

  async loadRecords(fullName) {
    try {
      const res = await Api.getHistory(fullName, this.getYearMonth());
      this.records = (res && res.records) ? res.records : [];
    } catch { this.records = []; }
  },

  getRecordForDate(day) {
    const ds = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return this.records.find(r => r.date === ds) || null;
  },

  render(containerId, onDayClick) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const yr = this.currentYear;
    const mo = this.currentMonth;
    const today = new Date();
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();
    let firstIdx = new Date(yr, mo, 1).getDay() - 1;
    if (firstIdx < 0) firstIdx = 6;

    const thaiYear = yr + 543;
    let h = `
      <div class="cal-header">
        <button type="button" class="cal-nav" id="calPrev">${Icons.chevronLeft(16)}</button>
        <span class="cal-title">${this.monthNames[mo]} ${thaiYear}</span>
        <button type="button" class="cal-nav" id="calNext">${Icons.chevronRight(16)}</button>
      </div>
      <div class="cal-legend">
        <span class="cal-legend-item"><span class="cal-dot cal-dot--present"></span>มา</span>
        <span class="cal-legend-item"><span class="cal-dot cal-dot--sick"></span>ป่วย</span>
        <span class="cal-legend-item"><span class="cal-dot cal-dot--leave"></span>ลากิจ</span>
        <span class="cal-legend-item"><span class="cal-dot cal-dot--activity"></span>กิจกรรม</span>
        <span class="cal-legend-item"><span class="cal-dot cal-dot--none"></span>ไม่ลง</span>
      </div>
      <div class="cal-grid">
    `;

    this.dayNames.forEach(d => { h += `<div class="cal-day-name">${d}</div>`; });

    for (let i = 0; i < firstIdx; i++) h += `<div class="cal-cell cal-cell--empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yr, mo, d);
      const dow = dt.getDay();
      const isWknd = (dow === 0 || dow === 6);
      const isToday = (dt.toDateString() === today.toDateString());
      const isPast = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const rec = this.getRecordForDate(d);
      const sc = this.statusClass(rec ? rec.status : null);

      let cls = `cal-cell cal-cell--${sc}`;
      if (isToday) cls += " cal-cell--today";
      if (isWknd) cls += " cal-cell--weekend";
      const click = (!isWknd && (isPast || isToday)) ? " cal-cell--clickable" : "";

      const dateStr = `${yr}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      h += `<div class="${cls}${click}" data-day="${d}" data-date="${dateStr}">
        <span class="cal-day-num">${d}</span>
        ${!isWknd ? `<span class="cal-bar cal-bar--${sc}"></span>` : ""}
      </div>`;
    }

    h += `</div>`;
    el.innerHTML = h;

    document.getElementById("calPrev").addEventListener("click", () => {
      this.currentMonth--;
      if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
      this.refreshCalendar(containerId, onDayClick);
    });

    document.getElementById("calNext").addEventListener("click", () => {
      this.currentMonth++;
      if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
      this.refreshCalendar(containerId, onDayClick);
    });

    if (onDayClick) {
      el.querySelectorAll(".cal-cell--clickable").forEach(cell => {
        cell.addEventListener("click", () => {
          const date = cell.getAttribute("data-date");
          const day = parseInt(cell.getAttribute("data-day"));
          onDayClick(date, this.getRecordForDate(day));
        });
      });
    }
  },

  async refreshCalendar(containerId, onDayClick) {
    const user = Auth.getCurrentUser();
    if (user) await this.loadRecords(user.fullName);
    this.render(containerId, onDayClick);
  },
};
