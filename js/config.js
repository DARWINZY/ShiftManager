// ─────────────────────────────────────────────
// config.js — ค่าตั้งต่าง ๆ ของระบบ
// ─────────────────────────────────────────────

const CONFIG = {
  // Google Apps Script Web App URL (สำหรับ POST ส่งข้อมูล)
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxszGjIM5-zYLRYaSJ6-O5Ulv2xsdf_x7pDJ0MAOMXgUNDt4Idm7YtL1p14yOcmxAp4Lw/exec",

  // Google Sheet ID (สำหรับ GET ดึงข้อมูลผ่าน CSV export)
  SHEET_ID: "1u3nuYSwHyJOigNMjcDUqYCk3xvsNWi9dQlNURRLve-U",

  // GID ของ tab "บันทึกเวรประจำวัน" (ใช้ใน CSV export URL)
  SHEET_GID: "1803925258",

  // ขนาดรูปสูงสุด
  MAX_PHOTO_SIZE: 3 * 1024 * 1024,
  MAX_IMAGE_DIM: 1000,
  IMAGE_QUALITY: 0.7,

  // Session key
  SESSION_KEY: "duty_current_user",

  APP_VERSION: "2.1.0",
};
