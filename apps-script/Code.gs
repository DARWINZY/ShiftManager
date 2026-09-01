// ─────────────────────────────────────────────────────────────────
// Code.gs — Google Apps Script สำหรับ Web App
// 
// วิธีใช้:
// 1. เปิด Google Sheets → Extensions → Apps Script
// 2. ลบโค้ดเดิม แล้ว copy โค้ดนี้วางแทน
// 3. กด Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy URL ไปใส่ใน js/config.js
// ─────────────────────────────────────────────────────────────────

// ชื่อ sheet ที่จะเก็บข้อมูล
const SHEET_NAME = "บันทึกเวร";

// ────── POST: รับข้อมูลจากฟอร์ม ──────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // ถ้ายังไม่มี sheet ให้สร้างพร้อม header
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp", "วันที่ปฏิบัติงาน", "ชื่อ-นามสกุล", "ตำแหน่ง",
        "หน้าที่/จุดเวร", "สถานะ", "หมายเหตุ", "รูปภาพ", "ลงย้อนหลัง"
      ]);
    }

    const timestamp = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
    const newRow = [
      timestamp,
      data.workDate || "",
      data.fullName || "",
      data.position || "",
      data.duty || "",
      data.status || "",
      data.note || "",
      data.photo || "",
      data.isRetroactive ? "ใช่" : "ไม่"
    ];

    if (data.isRetroactive && data.workDate) {
      // ── ลงย้อนหลัง: แทรกตามลำดับวันที่ ──
      insertByDate(sheet, newRow, data.workDate);
    } else {
      // ── ลงปกติ: append ต่อท้าย ──
      sheet.appendRow(newRow);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "บันทึกเรียบร้อย" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ────── GET: ดึงประวัติเวร ──────
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === "getHistory") {
      const name = e.parameter.name || "";
      const month = e.parameter.month || ""; // format: "2026-09"
      const records = getHistoryRecords(name, month);
      return ContentService.createTextOutput(
        JSON.stringify({ result: "success", records: records })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: "Unknown action" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ────── Helper: แทรก row ตามลำดับวันที่ ──────
function insertByDate(sheet, newRow, targetDate) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    // ยังไม่มีข้อมูล
    sheet.appendRow(newRow);
    return;
  }

  // column B (index 2) = วันที่ปฏิบัติงาน
  const dates = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  let insertAt = -1;

  for (let i = dates.length - 1; i >= 0; i--) {
    const cellDate = String(dates[i][0]).trim();
    if (cellDate <= targetDate) {
      insertAt = i + 3; // +2 for header+0-index, +1 for "after this row"
      break;
    }
  }

  if (insertAt === -1) {
    // targetDate อยู่ก่อนข้อมูลแรก → แทรกที่ row 2
    insertAt = 2;
  }

  sheet.insertRowBefore(insertAt);
  const range = sheet.getRange(insertAt, 1, 1, newRow.length);
  range.setValues([newRow]);
}

// ────── Helper: ดึงประวัติของคนนี้ในเดือนที่ระบุ ──────
function getHistoryRecords(name, yearMonth) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  const records = [];

  for (let i = 0; i < data.length; i++) {
    const rowName = String(data[i][2]).trim(); // column C
    const rowDate = String(data[i][1]).trim(); // column B

    if (rowName === name && rowDate.startsWith(yearMonth)) {
      records.push({
        date: rowDate,
        status: String(data[i][5]).trim(),   // column F
        duty: String(data[i][4]).trim(),      // column E
        note: String(data[i][6]).trim(),      // column G
      });
    }
  }

  return records;
}
