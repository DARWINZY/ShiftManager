// ─────────────────────────────────────────────
// app.js — หน้าลงเวร (dashboard)
// ─────────────────────────────────────────────

(function () {
  const user = Auth.requireAuth();
  if (!user) return;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  $("heroName").textContent = user.nickname;
  $("heroPos").textContent = `${user.fullName} · ${user.position}`;
  $("logoutBtn").onclick = () => { Auth.logout(); location.href = "index.html"; };

  // ────── Toast ──────
  let toastTimer = 0;
  function toast(text, type) {
    const el = $("toast");
    el.innerHTML = `<i class="fas ${type === "err" ? "fa-circle-exclamation" : type === "warn" ? "fa-triangle-exclamation" : "fa-circle-check"}"></i> ${esc(text)}`;
    el.className = `toast show is-${type || "ok"}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
  }

  // ────── จุดเวร (เลือกได้ 1 จุด) ──────
  $("dutyGrid").innerHTML = DUTY_STATIONS.map((s, i) => `
    <label class="opt">
      <input type="radio" name="duty" value="${esc(s)}" id="duty_${i}">
      <span class="opt-dot"></span><span class="opt-text">${esc(s)}</span>
    </label>`).join("");

  // ────── สถานะ ──────
  $("statusGrid").innerHTML = STATUSES.map((s, i) => `
    <label class="opt opt-status is-${s.key}">
      <input type="radio" name="status" value="${esc(s.value)}" ${i === 0 ? "checked" : ""}>
      <i class="fas ${s.icon}"></i><span class="opt-text">${esc(s.value)}</span>
    </label>`).join("");

  // ────── รูป (หลายรูป จากกล้องหรืออัลบั้ม) ──────
  let photos = []; // { key, file, url }
  let keySeq = 0;

  function addFiles(list) {
    const files = Array.from(list || []).filter(f => /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name));
    const room = CONFIG.MAX_PHOTOS - photos.length;
    if (files.length > room) toast(`ใส่ได้สูงสุด ${CONFIG.MAX_PHOTOS} รูป`, "warn");
    files.slice(0, Math.max(0, room)).forEach(file => photos.push({ key: ++keySeq, file, url: URL.createObjectURL(file) }));
    renderThumbs();
  }

  function renderThumbs() {
    $("thumbs").innerHTML = photos.map(p => `
      <div class="thumb">
        <img src="${p.url}" alt="" onerror="this.parentNode.classList.add('no-preview')">
        <span class="thumb-name">${esc(p.file.name)}</span>
        <button type="button" class="thumb-x" data-key="${p.key}" aria-label="เอารูปนี้ออก"><i class="fas fa-xmark"></i></button>
      </div>`).join("");
    $("photoCount").textContent = photos.length ? `${photos.length} รูป` : "ไม่บังคับ · ใส่ได้หลายรูป";
    $("photoCount").classList.toggle("is-on", photos.length > 0);
  }

  $("thumbs").onclick = e => {
    const b = e.target.closest(".thumb-x");
    if (!b) return;
    const i = photos.findIndex(p => p.key === Number(b.dataset.key));
    if (i >= 0) { URL.revokeObjectURL(photos[i].url); photos.splice(i, 1); renderThumbs(); }
  };
  ["camIn", "albumIn"].forEach(id => {
    $(id).onchange = e => { addFiles(e.target.files); e.target.value = ""; };
  });

  // ────── วันที่ที่จะลง ──────
  let workDate = Calendar.todayStr();
  Calendar.selectedDate = workDate;

  function setDate(ds) {
    workDate = ds;
    Calendar.selectedDate = ds;
    const isToday = ds === Calendar.todayStr();
    $("dateLabel").textContent = isToday ? "วันนี้" : "ลงย้อนหลัง";
    $("dateText").textContent = Calendar.thaiDate(ds);
    $("dateBar").classList.toggle("is-retro", !isToday);
    $("dateReset").hidden = isToday;
    showExisting();
    Calendar.render("calendar", onDayClick);
  }

  // ถ้าวันนั้นลงไปแล้ว บอกว่าลงอะไรไว้ และส่งใหม่จะแทนที่
  function showExisting() {
    const rec = Calendar.getRecord(workDate);
    const n = $("existNotice");
    const label = $("submitBtn").querySelector("span");
    if (!rec) {
      n.hidden = true;
      label.textContent = workDate === Calendar.todayStr() ? "ส่งเวรวันนี้" : "ส่งเวรย้อนหลัง";
      return;
    }
    const pics = rec.photos.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener">รูป ${i + 1}</a>`).join(" ");
    n.innerHTML = `
      <i class="fas fa-circle-info"></i>
      <div>
        <b>${workDate === Calendar.todayStr() ? "วันนี้" : "วันนั้น"}ลงไว้แล้ว</b> — ${esc(rec.duty || "-")} · ${esc(rec.status || "-")}${rec.note ? ` · ${esc(rec.note)}` : ""}
        ${pics ? `<div class="notice-pics">${pics}</div>` : ""}
        <div class="notice-sub">ส่งอีกครั้งจะแก้ข้อมูลเดิม รูปเก่ายังอยู่ รูปใหม่จะเพิ่มเข้าไป</div>
      </div>`;
    n.hidden = false;
    label.textContent = "ส่งแก้ไข";
    // เติมค่าเดิมให้ ถ้ายังไม่ได้เลือก
    const d = document.querySelector(`input[name="duty"][value="${CSS.escape(rec.duty)}"]`);
    if (d && !document.querySelector('input[name="duty"]:checked')) d.checked = true;
  }

  function onDayClick(ds) {
    setDate(ds);
    $("dutyForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("dateReset").onclick = () => setDate(Calendar.todayStr());
  $("datePick").onclick = () => $("calCard").scrollIntoView({ behavior: "smooth", block: "start" });

  // ────── ส่ง ──────
  const sheet = $("sendSheet");
  function setSteps(steps) {
    $("sendSteps").innerHTML = steps.map(s => `
      <li class="is-${s.state}">
        <i class="fas ${{ run: "fa-circle-notch fa-spin", ok: "fa-circle-check", err: "fa-circle-xmark", warn: "fa-triangle-exclamation", wait: "fa-circle" }[s.state]}"></i>
        <div><b>${esc(s.title)}</b>${s.sub ? `<small>${esc(s.sub)}</small>` : ""}</div>
      </li>`).join("");
  }
  function openSheet() {
    $("sendIcon").className = "sheet-icon";
    $("sendIcon").innerHTML = `<i class="fas fa-circle-notch fa-spin"></i>`;
    $("sendTitle").textContent = "กำลังส่ง...";
    $("sendActions").hidden = true;
    sheet.hidden = false;
    document.body.classList.add("no-scroll");
  }
  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove("no-scroll");
  }
  $("sendClose").onclick = closeSheet;

  $("dutyForm").onsubmit = async e => {
    e.preventDefault();
    const duty = document.querySelector('input[name="duty"]:checked')?.value;
    if (!duty) {
      toast("เลือกจุดเวรก่อน", "warn");
      $("dutyGrid").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const status = document.querySelector('input[name="status"]:checked')?.value || STATUSES[0].value;
    const note = $("note").value.trim();
    const files = photos.map(p => p.file);
    const date = workDate;

    $("submitBtn").disabled = true;
    openSheet();
    const st = {
      sheet: { title: "บันทึกลงชีท", sub: files.length ? `และเก็บ ${files.length} รูปลง Google Drive` : "", state: "run" },
      photos: { title: "เก็บรูปเข้าอัลบั้มเว็บ", sub: "เวรประจำวัน › " + date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + String(+date.slice(0, 4) + 543).slice(-2), state: files.length ? "run" : "wait" },
    };
    const draw = () => setSteps(files.length ? [st.sheet, st.photos] : [st.sheet]);
    if (files.length) st.sheet.sub = "กำลังเตรียมรูป...";
    draw();

    // รูปย่อสำหรับ Drive
    const drivePhotos = [];
    for (let i = 0; i < files.length; i++) {
      const data = await Api.preparePhoto(files[i]);
      if (data) drivePhotos.push({ data });
    }
    st.sheet.sub = files.length ? `และเก็บ ${drivePhotos.length} รูปลง Google Drive` : "";
    draw();

    const sheetJob = Api.submitRecord({
      workDate: date,
      fullName: user.fullName,
      position: user.position,
      duty, status, note,
      photos: drivePhotos,
      isRetroactive: date !== Calendar.todayStr(),
    }).then(r => {
      if (r?.result === "error") throw new Error(r.message || "บันทึกไม่สำเร็จ");
      st.sheet.state = "ok";
      if (r?.result === "sent_no_cors" || r?.result === "unknown") { st.sheet.state = "warn"; st.sheet.sub = "ส่งแล้ว แต่ยืนยันผลไม่ได้ ตรวจในปฏิทินอีกครั้ง"; }
    }).catch(err => {
      st.sheet.state = "err"; st.sheet.sub = err.message || "ส่งไม่สำเร็จ";
    }).finally(draw);

    const photoJob = !files.length ? Promise.resolve() : Api.uploadToPhotos(
      { date, name: user.fullName, position: user.position, files },
      p => { st.photos.sub = `กำลังอัปโหลด ${Math.round(p * 100)}%`; draw(); },
    ).then(r => {
      st.photos.state = "ok";
      st.photos.sub = `${r.uploaded} รูป · เวรประจำวัน › ${r.album.name}`;
      $("sendPhotosLink").href = `photos.html#${encodeURIComponent(r.album.id)}`;
    }).catch(err => {
      st.photos.state = "err"; st.photos.sub = err.message || "อัปโหลดไม่สำเร็จ";
    }).finally(draw);

    await Promise.all([sheetJob, photoJob]);

    const sheetOk = st.sheet.state !== "err";
    const allOk = sheetOk && st.photos.state !== "err";
    $("sendIcon").className = `sheet-icon is-${allOk ? "ok" : sheetOk ? "warn" : "err"}`;
    $("sendIcon").innerHTML = `<i class="fas ${allOk ? "fa-check" : sheetOk ? "fa-exclamation" : "fa-xmark"}"></i>`;
    $("sendTitle").textContent = allOk ? "ส่งเวรเรียบร้อย" : sheetOk ? "บันทึกแล้ว แต่รูปเข้าอัลบั้มไม่ครบ" : "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง";
    $("sendPhotosLink").hidden = !files.length || st.photos.state !== "ok";
    $("sendActions").hidden = false;
    $("sendClose").textContent = sheetOk ? "เสร็จสิ้น" : "ปิด";
    $("submitBtn").disabled = false;

    if (sheetOk) {
      $("dutyForm").reset();
      photos.forEach(p => URL.revokeObjectURL(p.url));
      photos = [];
      renderThumbs();
      await Calendar.refresh("calendar", onDayClick);
      setDate(Calendar.todayStr());
    }
  };

  // ────── เริ่ม ──────
  renderThumbs();
  setDate(workDate);
  Calendar.refresh("calendar", onDayClick).then(showExisting);
})();
