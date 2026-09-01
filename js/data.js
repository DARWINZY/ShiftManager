// ─────────────────────────────────────────────
// data.js — ข้อมูลสมาชิก ตำแหน่ง จุดเวร สถานะ
// แก้ไขที่ไฟล์นี้ไฟล์เดียวเมื่อต้องการเปลี่ยนข้อมูล
// ─────────────────────────────────────────────

const MEMBERS = [
  { id: 1,  nickname: "แบงค์",    fullName: "นายณัฐพงษ์ พงษ์นุเคราะห์ศิริ",     position: "ประธานสภานักเรียน" },
  { id: 2,  nickname: "ธีร์",      fullName: "นายธิติวุฒิ โสวภาค",               position: "รองประธานสภานักเรียน" },
  { id: 3,  nickname: "ตองหนึ่ง",  fullName: "นางสาวเจียระไน สุนทรารักษ์",       position: "เลขานุการ" },
  { id: 4,  nickname: "มุกดา",     fullName: "นางสาวญาตาวี แสงธนู",              position: "สมาชิกสภานักเรียน" },
  { id: 5,  nickname: "เมย์",      fullName: "นางสาวชนากานต์ บัวหลวง",           position: "สมาชิกสภานักเรียน" },
  { id: 6,  nickname: "เกต",       fullName: "นางสาวธนัฐพร สายกระสุน",           position: "สมาชิกสภานักเรียน" },
  { id: 7,  nickname: "ฟ้า/5",     fullName: "นางสาวกัญญารัตน์ สุขยานุดิษฐ",     position: "สมาชิกสภานักเรียน" },
  { id: 8,  nickname: "มาวิน",     fullName: "นายพลพจน์ ไพรทูลย์",               position: "สมาชิกสภานักเรียน" },
  { id: 9,  nickname: "เกรซ",      fullName: "นางสาวณหทัย สุภิมารส",             position: "สมาชิกสภานักเรียน" },
  { id: 10, nickname: "กระต่าย",   fullName: "นางสาวพิรญา แจ่มใส",              position: "สมาชิกสภานักเรียน" },
  { id: 11, nickname: "แคมปัส",    fullName: "นายธีรภัทร ผลพูน",                 position: "สมาชิกสภานักเรียน" },
  { id: 12, nickname: "ตังค์",     fullName: "นายเพชรกร สกุลสุรินทร์",           position: "สมาชิกสภานักเรียน" },
  { id: 13, nickname: "ข้าวหอม",   fullName: "นางสาวฐานันตร์ พะนิรัมย์",         position: "สมาชิกสภานักเรียน" },
  { id: 14, nickname: "พีค",       fullName: "นางสาวรตีภัทร ทองศรี",             position: "สมาชิกสภานักเรียน" },
  { id: 15, nickname: "ยีนส์",     fullName: "นางสาวกานกวิญจน์ ต่อยอด",          position: "สมาชิกสภานักเรียน" },
  { id: 16, nickname: "ไตเติ้ล",   fullName: "นายกรกฎ พรมสีใหม่",                position: "สมาชิกสภานักเรียน" },
  { id: 17, nickname: "ปลื้ม",     fullName: "นายธัญพิสิษฐ์ ทองนำ",              position: "สมาชิกสภานักเรียน" },
  { id: 18, nickname: "ซานต้า",    fullName: "นางสาวอรุณวรรณ ไสยลา",             position: "สมาชิกสภานักเรียน" },
  { id: 19, nickname: "กาลาแม",    fullName: "นางสาวเพลงพรรษ ทองเปลว",           position: "สมาชิกสภานักเรียน" },
  { id: 20, nickname: "เปียโน",    fullName: "นางสาวสุปรียา จันดา",              position: "สมาชิกสภานักเรียน" },
  { id: 21, nickname: "เอย",       fullName: "นางสาวกัญญาภัค อินทรเสาร์",        position: "สมาชิกสภานักเรียน" },
  { id: 22, nickname: "โฮป",       fullName: "นางสาวพอเพียง ตุ้มนาค",            position: "สมาชิกสภานักเรียน" },
  { id: 23, nickname: "ปูน",       fullName: "นางสาวกานต์พิชชา ลายทอง",          position: "สมาชิกสภานักเรียน" },
  { id: 24, nickname: "วุ้นเส้น",  fullName: "นางสาวณิชกุล กิ่งแก้ว",            position: "สมาชิกสภานักเรียน" },
  { id: 25, nickname: "ฟ้า/8",     fullName: "นางสาวบวรลักษณ์ เสียวน้อย",         position: "สมาชิกสภานักเรียน" },
  { id: 26, nickname: "เดียร์",    fullName: "นางสาวภิญญาพัชญ์ อินทร์สอน",       position: "สมาชิกสภานักเรียน" },
  { id: 27, nickname: "หมิว",      fullName: "นางสาวธนพร เหมือนคิด",             position: "สมาชิกสภานักเรียน" },
  { id: 28, nickname: "ลีอัน",     fullName: "นางสาวลีอัน กาวาร์",               position: "สมาชิกสภานักเรียน" },
  { id: 29, nickname: "อาร์ต",     fullName: "นางสาวภัทรวดี ทัพทวี",             position: "สมาชิกสภานักเรียน" },
  { id: 30, nickname: "ลันเต",     fullName: "นางสาวปาริณลดา แสงทับทิม",          position: "สมาชิกสภานักเรียน" },
  { id: 31, nickname: "ไจ๋",       fullName: "นางสาวกัญญาณัฐ อัมหะธร",           position: "สมาชิกสภานักเรียน" },
  { id: 32, nickname: "ออกัส",     fullName: "นางสาวศศิกานต์ ทวดอาจ",            position: "สมาชิกสภานักเรียน" },
  { id: 33, nickname: "ชมพู่",     fullName: "นางสาวนิรมล ทุนาบูรณ์",            position: "สมาชิกสภานักเรียน" },
  { id: 34, nickname: "พิ้งกี้",   fullName: "นางสาวปวีณ์ธิดา บุญนอง",           position: "สมาชิกสภานักเรียน" },
  { id: 35, nickname: "ทอฝัน",     fullName: "นางสาวชุดาณัฏฐ์ สุขอุ้ม",           position: "สมาชิกสภานักเรียน" },
  { id: 36, nickname: "คะนิ้ง",    fullName: "นางสาวเมญานี เป็นสุข",             position: "สมาชิกสภานักเรียน" },
  { id: 37, nickname: "ม่อน",      fullName: "นางสาวภัทรานิษฐ์ นภาคเวช",         position: "สมาชิกสภานักเรียน" },
  { id: 38, nickname: "ใบหม่อน",   fullName: "นางสาวจิรัชญา ศรีผุย",             position: "สมาชิกสภานักเรียน" },
  { id: 39, nickname: "น้ำหนึ่ง",  fullName: "นางสาวอรวิภา บุญหมั้น",            position: "สมาชิกสภานักเรียน" },
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
  "ตรวจเวรในโดม",
  "เวรห้องน้ำอาคาร 10",
];

// สถานะการมา/ลา
const STATUSES = [
  { value: "มาปฏิบัติงาน",         iconFn: "checkCircle",   color: "#2d8a4e" },
  { value: "ลาป่วย",               iconFn: "thermometer",   color: "#c93c37" },
  { value: "ลากิจ",                iconFn: "fileText",      color: "#b87b1a" },
  { value: "ไปทำกิจกรรมโรงเรียน",  iconFn: "school",        color: "#2563a8" },
  { value: "อื่นๆ",               iconFn: "plusCircle",    color: "#6b6b6b" },
];

// Helper: หา member จาก id
function getMemberById(id) {
  return MEMBERS.find(m => m.id === id) || null;
}

// Helper: หา member จากชื่อเต็ม
function getMemberByFullName(fullName) {
  return MEMBERS.find(m => m.fullName === fullName) || null;
}
