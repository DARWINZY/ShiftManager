// ─────────────────────────────────────────────
// app.js — Logic หลักหน้า Dashboard
// ─────────────────────────────────────────────

(function () {
  const user = Auth.requireAuth();
  if (!user) return;

  // Header
  document.getElementById("headerNickname").textContent = user.nickname;
  document.getElementById("userPosition").textContent = user.position;
  document.getElementById("userName").textContent = user.fullName;

  // ────── Duty checkboxes ──────
  const dutyGrid = document.getElementById("dutyGrid");
  DUTY_STATIONS.forEach((s, i) => {
    const lbl = document.createElement("label");
    lbl.className = "duty-checkbox";
    lbl.innerHTML = `<input type="checkbox" name="duty" value="${s}" id="duty_${i}"><span class="duty-label">${s}</span>`;
    dutyGrid.appendChild(lbl);
  });

  // ────── Status radios ──────
  const statusGroup = document.getElementById("statusGroup");
  STATUSES.forEach((s, i) => {
    const lbl = document.createElement("label");
    lbl.className = "status-radio";
    const icon = Icons[s.iconFn] ? Icons[s.iconFn](16) : "";
    lbl.innerHTML = `<input type="radio" name="status" value="${s.value}" id="status_${i}" ${i === 0 ? "checked" : ""}><span class="status-label">${icon} ${s.value}</span>`;
    statusGroup.appendChild(lbl);
  });

  // ────── Photo ──────
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const photoInfo = document.getElementById("photoInfo");

  photoInput.addEventListener("change", () => {
    const f = photoInput.files[0];
    if (!f) { photoPreview.classList.add("hidden"); photoInfo.textContent = ""; return; }
    photoPreview.src = URL.createObjectURL(f);
    photoPreview.classList.remove("hidden");
    photoInfo.textContent = `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`;
    photoPreview.onerror = () => { photoPreview.classList.add("hidden"); photoInfo.textContent = `${f.name} (แสดงตัวอย่างไม่ได้)`; };
  });

  // ────── Submit ──────
  const form = document.getElementById("checkInForm");
  const submitBtn = document.getElementById("submitBtn");
  const msgBox = document.getElementById("message");

  function showMsg(text, type) {
    const iconMap = { ok: Icons.circleCheck(16), err: Icons.alertCircle(16), warn: Icons.alertTriangle(16) };
    msgBox.innerHTML = `<span class="msg-icon">${iconMap[type] || ""}</span> ${text}`;
    msgBox.className = `msg msg--${type}`;
    msgBox.classList.remove("hidden");
    setTimeout(() => msgBox.classList.add("hidden"), 5000);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const duties = Array.from(document.querySelectorAll('input[name="duty"]:checked')).map(el => el.value).join(", ");
    if (!duties) {
      showMsg("กรุณาเลือกจุดเวรอย่างน้อย 1 จุด", "warn");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "กำลังส่ง...";

    try {
      const status = document.querySelector('input[name="status"]:checked')?.value || "";
      const note = document.getElementById("note").value;

      let photoData = "", warning = "";
      const f = photoInput.files[0];
      if (f) {
        submitBtn.textContent = "เตรียมรูป...";
        const r = await Api.preparePhoto(f);
        photoData = r.data; warning = r.warning;
      }

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const result = await Api.submitRecord({
        workDate: dateStr,
        fullName: user.fullName,
        position: user.position,
        duty: duties,
        status, note,
        photo: photoData,
        isRetroactive: false,
      });

      if (result?.result === "error") {
        showMsg(result.message || "เกิดข้อผิดพลาด", "err");
      } else if (warning) {
        showMsg(warning, "warn");
        resetForm();
        Calendar.refreshCalendar("calendarContainer", onDayClick);
      } else {
        showMsg("ลงเวลาเรียบร้อย", "ok");
        resetForm();
        Calendar.refreshCalendar("calendarContainer", onDayClick);
      }
    } catch (err) {
      showMsg("ส่งไม่สำเร็จ ลองใหม่", "err");
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "ลงเวลา";
    }
  });

  function resetForm() {
    form.reset();
    document.getElementById("status_0").checked = true;
    photoPreview.classList.add("hidden");
    photoInfo.textContent = "";
  }

  // ────── Modal: retroactive ──────
  const modal = document.getElementById("retroModal");
  const modalDate = document.getElementById("modalDate");
  const modalForm = document.getElementById("retroForm");
  const modalSubmitBtn = document.getElementById("modalSubmitBtn");
  const modalMsg = document.getElementById("modalMessage");
  const modalClose = document.getElementById("modalClose");
  const modalOverlay = document.getElementById("modalOverlay");

  const mDutyGrid = document.getElementById("modalDutyGrid");
  DUTY_STATIONS.forEach((s, i) => {
    const lbl = document.createElement("label");
    lbl.className = "duty-checkbox";
    lbl.innerHTML = `<input type="checkbox" name="modalDuty" value="${s}" id="mduty_${i}"><span class="duty-label">${s}</span>`;
    mDutyGrid.appendChild(lbl);
  });

  const mStatusGroup = document.getElementById("modalStatusGroup");
  STATUSES.forEach((s, i) => {
    const lbl = document.createElement("label");
    lbl.className = "status-radio";
    const icon = Icons[s.iconFn] ? Icons[s.iconFn](16) : "";
    lbl.innerHTML = `<input type="radio" name="modalStatus" value="${s.value}" id="mstatus_${i}" ${i === 0 ? "checked" : ""}><span class="status-label">${icon} ${s.value}</span>`;
    mStatusGroup.appendChild(lbl);
  });

  const modalPhotoInput = document.getElementById("modalPhoto");
  const modalPhotoPreview = document.getElementById("modalPhotoPreview");
  modalPhotoInput.addEventListener("change", () => {
    const f = modalPhotoInput.files[0];
    if (!f) { modalPhotoPreview.classList.add("hidden"); return; }
    modalPhotoPreview.src = URL.createObjectURL(f);
    modalPhotoPreview.classList.remove("hidden");
  });

  let retroDate = "";

  function onDayClick(date, record) {
    retroDate = date;
    const p = date.split("-");
    modalDate.textContent = `${parseInt(p[2])} ${Calendar.monthNames[parseInt(p[1]) - 1]} ${parseInt(p[0]) + 543}`;

    if (record) {
      modalMsg.textContent = `ลงเวรแล้ว (${record.status}) — ลงซ้ำเพื่ออัพเดทได้`;
      modalMsg.className = "msg msg--warn";
      modalMsg.classList.remove("hidden");
    } else {
      modalMsg.classList.add("hidden");
    }

    modalForm.reset();
    document.getElementById("mstatus_0").checked = true;
    modalPhotoPreview.classList.add("hidden");

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  modalForm.addEventListener("submit", async e => {
    e.preventDefault();
    modalSubmitBtn.disabled = true;
    modalSubmitBtn.textContent = "กำลังส่ง...";

    try {
      const duties = Array.from(document.querySelectorAll('input[name="modalDuty"]:checked')).map(el => el.value).join(", ");
      if (!duties) {
        modalMsg.innerHTML = `<span class="msg-icon">${Icons.alertTriangle(16)}</span> กรุณาเลือกจุดเวรอย่างน้อย 1 จุด`;
        modalMsg.className = "msg msg--warn";
        modalMsg.classList.remove("hidden");
        modalSubmitBtn.disabled = false;
        modalSubmitBtn.textContent = "ลงเวลาย้อนหลัง";
        return;
      }
      const status = document.querySelector('input[name="modalStatus"]:checked')?.value || "";
      const note = document.getElementById("modalNote").value;

      let photoData = "";
      const f = modalPhotoInput.files[0];
      if (f) { const r = await Api.preparePhoto(f); photoData = r.data; }

      const result = await Api.submitRecord({
        workDate: retroDate,
        fullName: user.fullName,
        position: user.position,
        duty: duties,
        status, note,
        photo: photoData,
        isRetroactive: true,
      });

      if (result?.result === "error") {
        modalMsg.innerHTML = `<span class="msg-icon">${Icons.alertCircle(16)}</span> ${result.message || "เกิดข้อผิดพลาด"}`;
        modalMsg.className = "msg msg--err";
        modalMsg.classList.remove("hidden");
      } else {
        modalMsg.innerHTML = `<span class="msg-icon">${Icons.circleCheck(16)}</span> ลงเวลาย้อนหลังเรียบร้อย`;
        modalMsg.className = "msg msg--ok";
        modalMsg.classList.remove("hidden");
        setTimeout(() => { closeModal(); Calendar.refreshCalendar("calendarContainer", onDayClick); }, 1200);
      }
    } catch (err) {
      modalMsg.innerHTML = `<span class="msg-icon">${Icons.alertCircle(16)}</span> ส่งไม่สำเร็จ`;
      modalMsg.className = "msg msg--err";
      modalMsg.classList.remove("hidden");
      console.error(err);
    } finally {
      modalSubmitBtn.disabled = false;
      modalSubmitBtn.textContent = "ลงเวลาย้อนหลัง";
    }
  });

  // ────── Logout ──────
  document.getElementById("logoutBtn").addEventListener("click", () => {
    Auth.logout();
    location.href = "index.html";
  });

  // ────── Init Calendar ──────
  Calendar.refreshCalendar("calendarContainer", onDayClick);
})();
