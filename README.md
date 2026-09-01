# 📋 Arrange the Duty Schedule (จัดตารางเวรประจำวัน)

ระบบจัดตารางเวรสำหรับสภานักเรียน — สร้างแบบบันทึกการปฏิบัติหน้าที่ประจำวันในรูปแบบ Excel และ Markdown

## 📁 โครงสร้างโปรเจค

```
Arrange-the-duty-schedule/
├── create_schedule.py      # สร้างไฟล์ Excel (.xlsx) ตารางเวร 25-29 May
├── generate_markdown.py    # สร้างไฟล์ Markdown ตารางเวร
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (output path)
├── .gitignore              # ไฟล์ที่ git ไม่ track
└── README.md               # ไฟล์นี้
```

## 🚀 วิธีติดตั้งและรัน

### 1. Clone repository

```bash
git clone https://github.com/thanpisitthongnam-cpu/Arrange-the-duty-schedule.git
cd Arrange-the-duty-schedule
```

### 2. สร้าง Virtual Environment (แนะนำ)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. ติดตั้ง Dependencies

```bash
pip install -r requirements.txt
```

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` (มีตัวอย่างอยู่แล้ว) หรือแก้ไข output path ตามต้องการ:

```env
OUTPUT_DIR=./output
```

### 5. รันโปรแกรม

**สร้างไฟล์ Excel:**
```bash
python create_schedule.py
```

**สร้างไฟล์ Markdown:**
```bash
python generate_markdown.py
```

## 📄 Output

- `create_schedule.py` → สร้าง `แบบบันทึกการปฏิบัติหน้าที่_25_29_May.xlsx` (และ PDF ถ้ามี Microsoft Excel)
- `generate_markdown.py` → สร้าง `markdown_output.md`

## 📌 รายละเอียดหน้าที่

ตารางเวรประจำวัน 25-29 พฤษภาคม ประกอบด้วย:
- เวรตรวจตึก (อาคาร 3, 5, 6, 9, 11, 15)
- สายเฉื่อย (หน้าอาคาร 5 ม.1-6, หลังโดม ม.1-6)
- เชิญธง
- เวรประตู (1, 2, 4)
- มุมรักสิรินธร / อยู่ซอยมุมรักสิรินธร
- ห้องน้ำสนามบาส / ห้องน้ำหน้าอาคาร10
- โรงรถสหกรณ์

## 🛠 Tech Stack

- **Python 3.8+**
- **openpyxl** — สร้าง/แก้ไข Excel
- **python-dotenv** — โหลด environment variables
- **pywin32** (optional, Windows only) — แปลง Excel เป็น PDF

## 👥 ผู้พัฒนา

สภานักเรียน — ระบบจัดตารางเวร
