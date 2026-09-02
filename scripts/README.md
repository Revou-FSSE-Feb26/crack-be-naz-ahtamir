# 📁 Scripts Directory

Script utilities untuk backend SMK3.

## 📄 Files

### `import-karyawan.js`
Script untuk import data karyawan dari Excel ke PostgreSQL database.

**Usage**:
```bash
npm run import:karyawan <path-to-excel-file>
# atau
node scripts/import-karyawan.js scripts/karyawan.xlsx
```

### `generate-template.js`
Generate template Excel dengan format yang benar untuk import karyawan.

**Usage**:
```bash
npm run generate:template
```

Output: `scripts/karyawan-template.xlsx`

### `karyawan-template.xlsx`
Template Excel dengan contoh data karyawan. Digunakan sebagai referensi format.

## 🚀 Quick Start

```bash
# 1. Generate template
npm run generate:template

# 2. Edit karyawan-template.xlsx dengan data Anda

# 3. Import ke database (pastikan backend running)
npm run import:karyawan scripts/karyawan-template.xlsx
```

## 📚 Documentation

- [Quick Start Guide](./QUICK_START_IMPORT.md)
- [Complete Guide](../../IMPORT_KARYAWAN_GUIDE.md)

## 🔐 Default Credentials

- Username: ID Karyawan
- Password: `<ID>K3`

Contoh:
- ID: 82400999
- Username: `82400999`
- Password: `82400999K3`
