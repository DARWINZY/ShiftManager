// ─────────────────────────────────────────────
// auth.js — จัดการ session ผู้ใช้ (localStorage)
// ─────────────────────────────────────────────

const Auth = {
  // บันทึกผู้ใช้ที่เลือก
  login(member) {
    localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(member));
  },

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser() {
    const raw = localStorage.getItem(CONFIG.SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch { return null; }
  },

  // ออกจากระบบ
  logout() {
    localStorage.removeItem(CONFIG.SESSION_KEY);
  },

  // ตรวจว่า login อยู่ไหม — ถ้าไม่ให้ redirect ไปหน้า login
  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = "index.html";
      return null;
    }
    return user;
  },

  // ถ้า login อยู่แล้ว ให้ redirect ไปหน้า dashboard
  redirectIfLoggedIn() {
    const user = this.getCurrentUser();
    if (user) {
      window.location.href = "dashboard.html";
      return true;
    }
    return false;
  },
};
