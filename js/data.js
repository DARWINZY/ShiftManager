// ─────────────────────────────────────────────
// data.js — ข้อมูลสมาชิก ตำแหน่ง จุดเวร สถานะ
// แก้ไขที่ไฟล์นี้ไฟล์เดียวเมื่อต้องการเปลี่ยนข้อมูล
// ─────────────────────────────────────────────

const MEMBERS = [
  { id: 1,  nickname: "แบงค์",    fullName: "นายณัฐพงษ์ พงษ์นุเคราะห์ศิริ",     position: "ประชาสัมพันธ์" },
  { id: 2,  nickname: "ธีร์",      fullName: "นายธิติวุฒิ โสวภาค",               position: "หัวหน้าอาคารสถานที่" },
  { id: 3,  nickname: "ตองหนึ่ง",  fullName: "นางสาวเจียระไน สุนทรารักษ์",       position: "ฝ่ายระดับชั้น ม.5" },
  { id: 4,  nickname: "มุกดา",     fullName: "นางสาวญาตาวี แสงธนู",              position: "หัวหน้าฝ่ายบริหารวิชาการ" },
  { id: 5,  nickname: "เมย์",      fullName: "นางสาวชนากานต์ บัวหลวง",           position: "รองประธาน 2" },
  { id: 6,  nickname: "เกต",       fullName: "นางสาวธนัฐพร สายกระสุน",           position: "เลขานุการ" },
  { id: 7,  nickname: "ฟ้า/5",     fullName: "นางสาวกัญญารัตน์ สุขยานุดิษฐ",     position: "เหรัญญิก" },
  { id: 8,  nickname: "มาวิน",     fullName: "นายพลพจน์ ไพรทูลย์",               position: "ประชาสัมพันธ์" },
  { id: 9,  nickname: "เกรซ",      fullName: "นางสาวณหทัย สุภิมารส",             position: "หัวหน้าทัศนศึกษา" },
  { id: 10, nickname: "กระต่าย",   fullName: "นางสาวพิรญา แจ่มใส",              position: "รองหัวหน้าระดับชั้น ม.1" },
  { id: 11, nickname: "แคมปัส",    fullName: "นายธีรภัทร ผลพูน",                 position: "หัวหน้าฝ่ายสารสนเทศ" },
  { id: 12, nickname: "ตังค์",     fullName: "นายเพชรกร สกุลสุรินทร์",           position: "ผู้ช่วยระดับชั้น ม.5" },
  { id: 13, nickname: "ข้าวหอม",   fullName: "นางสาวฐานันตร์ พะนิรัมย์",         position: "ประชาสัมพันธ์" },
  { id: 14, nickname: "พีค",       fullName: "นางสาวรตีภัทร ทองศรี",             position: "ฝ่ายแผนงานและสารสนเทศ" },
  { id: 15, nickname: "ยีนส์",     fullName: "นางสาวกานกวิญจน์ ต่อยอด",          position: "หัวหน้าฝ่ายประเมินนิเทศติดตาม" },
  { id: 16, nickname: "ไตเติ้ล",   fullName: "นายกรกฎ พรมสีใหม่",                position: "ฝ่ายอาคารสถานที่" },
  { id: 17, nickname: "ปลื้ม",     fullName: "นายธัญพิสิษฐ์ ทองนำ",              position: "ผู้ช่วยหัวหน้าฝ่ายระเบียบวินัย" },
  { id: 18, nickname: "ซานต้า",    fullName: "นางสาวอรุณวรรณ ไสยลา",             position: "เลขาฝ่ายวิชาการ" },
  { id: 19, nickname: "กาลาแม",    fullName: "นางสาวเพลงพรรษ ทองเปลว",           position: "รองฝ่ายงานกิจกรรม" },
  { id: 20, nickname: "เปียโน",    fullName: "นางสาวสุปรียา จันดา",              position: "ฝ่ายปฏิคม - ผู้ช่วยปฏิคม" },
  { id: 21, nickname: "เอย",       fullName: "นางสาวกัญญาภัค อินทรเสาร์",        position: "ผู้ช่วยประชาสัมพันธ์" },
  { id: 22, nickname: "โฮป",       fullName: "นางสาวพอเพียง ตุ้มนาค",            position: "หัวหน้ากิจการ" },
  { id: 23, nickname: "ปูน",       fullName: "นางสาวกานต์พิชชา ลายทอง",          position: "หัวหน้าระเบียบวินัย" },
  { id: 24, nickname: "วุ้นเส้น",  fullName: "นางสาวณิชกุล กิ่งแก้ว",            position: "สมาชิกสภานักเรียน" },
  { id: 25, nickname: "ฟ้า/8",     fullName: "นางสาวบวรลักษณ์ เสียวน้อย",         position: "สมาชิกสภานักเรียน" },
  { id: 26, nickname: "เดียร์",    fullName: "นางสาวภิญญาพัชญ์ อินทร์สอน",       position: "ผู้ช่วยเลขานุการ" },
  { id: 27, nickname: "หมิว",      fullName: "นางสาวธนพร เหมือนคิด",             position: "ฝ่ายอาคารสถานที่ - ผู้ช่วยและเลขานุการ" },
  { id: 28, nickname: "ลีอัน",     fullName: "นางสาวลีอัน กาวาร์",               position: "หัวหน้าปฏิคม" },
  { id: 29, nickname: "อาร์ต",     fullName: "นางสาวภัทรวดี ทัพทวี",             position: "ฝ่ายกิจกรรม - หัวหน้างานกิจกรรม" },
  { id: 30, nickname: "ลันเต",     fullName: "นางสาวปาริณลดา แสงทับทิม",          position: "ประชาสัมพันธ์ - หัวหน้า" },
  { id: 31, nickname: "ไจ๋",       fullName: "นางสาวกัญญาณัฐ อัมหะธร",           position: "รองฝ่ายประชาสัมพันธ์" },
  { id: 32, nickname: "ออกัส",     fullName: "นางสาวศศิกานต์ ทวดอาจ",            position: "ผู้ช่วยปฏิคม" },
  { id: 33, nickname: "ชมพู่",     fullName: "นางสาวนิรมล ทุนาบูรณ์",            position: "หัวหน้าบริหารทั่วไป" },
  { id: 34, nickname: "พิ้งกี้",   fullName: "นางสาวปวีณ์ธิดา บุญนอง",           position: "ประธานสภานักเรียน" },
  { id: 35, nickname: "ทอฝัน",     fullName: "นางสาวชุดาณัฏฐ์ สุขอุ้ม",           position: "รองประธาน" },
  { id: 37, nickname: "ม่อน",      fullName: "นางสาวภัทรานิษฐ์ นภาคเวช",         position: "หัวหน้าขอเวลาเรียน" },
  { id: 38, nickname: "ใบหม่อน",   fullName: "นางสาวจิรัชญา ศรีผุย",             position: "หัวหน้าระดับ ม.3" },
  { id: 39, nickname: "น้ำหนึ่ง",  fullName: "นางสาวอรวิภา บุญหมั้น",            position: "หัวหน้าระดับชั้น" },
];

// จุดเวรทั้งหมด
const DUTY_STATIONS = [
  "สายเฉื่อยหลังโดม",
  "สายเฉื่อยอาคาร 5",
  "พิธีกร",
  "ร้องเพลง",
  "เชิญธง",
  "เวรประตู 1",
  "เวรประตู 2",
  "เวรประตู 4",
  "สายเฉื่อยบริเวณมุมรักสิรินธร",
  "สายเฉื่อยบริเวณโรงรถ",
  "ห้องน้ำสนามบาส",
  "สายเฉื่อยหน้าอาคาร 9",
  "ตรวจแถวในโดม",
  "เวรห้องน้ำอาคาร 10",
  "บริหาร",
];

// สถานะการมา/ลา
const STATUSES = [
  { value: "มาปฏิบัติงาน",                 iconFn: "checkCircle",   color: "#2d8a4e" },
  { value: "ลาป่วย",                     iconFn: "thermometer",   color: "#c93c37" },
  { value: "ลากิจ",                      iconFn: "fileText",      color: "#b87b1a" },
  { value: "ไปทำกิจกรรมโรงเรียน",           iconFn: "school",        color: "#2563a8" },
  { value: "อื่นๆ",                      iconFn: "plusCircle",    color: "#6b6b6b" },
];

// Helper: หา member จาก id
function getMemberById(id) {
  return MEMBERS.find(m => m.id === id) || null;
}

// Helper: หา member จากชื่อเต็ม
function getMemberByFullName(fullName) {
  return MEMBERS.find(m => m.fullName === fullName) || null;
}
