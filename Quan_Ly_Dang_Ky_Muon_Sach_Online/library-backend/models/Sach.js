const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema({
  MaSach: { type: String, required: true, unique: true },
  TenSach: { type: String, required: true },
  DonGia: { type: Number, default: 0 }, // 👉 CHỐT CHẶN NẰM Ở ĐÂY
  SoQuyen: { type: Number, required: true, min: 0 },
  NamXuatBan: { type: Number },
  MaNXB: { type: String },
  NguonGocTacGia: { type: String },
  TheLoai: { type: String },
  HinhAnh: { type: String },
  MoTa: { type: String }
}, { 
  collection: 'Sach',
  timestamps: true 
});

module.exports = mongoose.model('Sach', SachSchema);