// ─────────────────────────────────────────────
// api.js — สื่อสารกับ Google Sheets
// ─────────────────────────────────────────────

const Api = {
  // ────── Image Utilities ──────

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
      reader.readAsDataURL(file);
    });
  },

  resizeImage(file, maxDim, quality) {
    maxDim = maxDim || CONFIG.MAX_IMAGE_DIM;
    quality = quality || CONFIG.IMAGE_QUALITY;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          try {
            let { width, height } = img;
            if (!width || !height) return reject(new Error("อ่านขนาดรูปไม่ได้"));
            if (width > height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
            else if (height >= width && height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
            const c = document.createElement("canvas");
            c.width = width; c.height = height;
            c.getContext("2d").drawImage(img, 0, 0, width, height);
            resolve(c.toDataURL("image/jpeg", quality));
          } catch (err) { reject(err); }
        };
        img.onerror = () => reject(new Error("เปิดไฟล์รูปไม่ได้"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
      reader.readAsDataURL(file);
    });
  },

  async preparePhoto(file) {
    let data = "";
    try { data = await this.resizeImage(file); }
    catch {
      try { data = await this.fileToBase64(file); }
      catch { return { data: "", warning: "แนบรูปไม่สำเร็จ" }; }
    }
    if (data.length > CONFIG.MAX_PHOTO_SIZE) {
      return { data: "", warning: "รูปใหญ่เกินไป ไม่ได้แนบ" };
    }
    return { data, warning: "" };
  },

  // ────── POST: ส่งข้อมูลบันทึกเวร ──────

  async submitRecord(payload) {
    const body = JSON.stringify(payload);
    try {
      const res = await fetch(CONFIG.SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
      });
      const text = await res.text();
      try { return JSON.parse(text); }
      catch { return { result: "unknown", message: text.slice(0, 300) }; }
    } catch {
      await fetch(CONFIG.SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
      });
      return { result: "sent_no_cors", message: "ส่งแล้ว แต่ยืนยันผลไม่ได้" };
    }
  },

  // ────── GET: ดึงข้อมูลจาก Google Sheet (CSV export) ──────

  // parse CSV string → array of objects
  _parseCSV(csvText) {
    const lines = csvText.split("\n").filter(l => l.trim());
    if (lines.length < 2) return [];

    // parse header
    const headers = this._splitCSVLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = this._splitCSVLine(lines[i]);
      const row = {};
      headers.forEach((h, idx) => { row[h.trim()] = (cols[idx] || "").trim(); });
      records.push(row);
    }
    return records;
  },

  // split CSV line respecting quoted fields
  _splitCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        result.push(current); current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  },

  // normalize date format: "DD/MM/YYYY" or "M/D/YYYY" → "YYYY-MM-DD"
  _normalizeDate(dateStr) {
    if (!dateStr) return "";
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // DD/MM/YYYY or D/M/YYYY
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      let [d, m, y] = parts;
      // if year is 4 digits and > 2500, it's Buddhist Era
      if (parseInt(y) > 2500) y = String(parseInt(y) - 543);
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return dateStr;
  },

  // ดึงประวัติเวรจาก Google Sheet CSV
  async getHistory(fullName, yearMonth) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&gid=${CONFIG.SHEET_GID}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("ดึงข้อมูลไม่สำเร็จ");
      const csvText = await res.text();
      const allRows = this._parseCSV(csvText);

      const records = [];
      for (const row of allRows) {
        // Exact column headers from Google Sheet
        const rowName = row["ชื่อ-นามสกุล"] || "";
        const rawDate = row["วันที่ปฏิบัติงาน"] || "";
        const status = row["สถานะการมา/ลา"] || "";
        const duty = row["หน้าที่รับผิดชอบ"] || "";
        const note = row["หมายเหตุ"] || "";

        if (!rowName || !rawDate) continue;

        const normDate = this._normalizeDate(rawDate);
        if (rowName.trim() === fullName && normDate.startsWith(yearMonth)) {
          records.push({ date: normDate, status: status.trim(), duty: duty.trim(), note: note.trim() });
        }
      }

      return { result: "success", records };
    } catch (err) {
      console.warn("getHistory error:", err);
      return { result: "error", records: [] };
    }
  },

};
