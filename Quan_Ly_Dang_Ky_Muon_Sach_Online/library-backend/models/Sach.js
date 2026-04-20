const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema({
  MaSach: { type: String, required: true, unique: true },
  TenSach: { type: String, required: true },
  DonGia: { type: Number, default: 0 },
  SoQuyen: { type: Number, required: true, min: 0 },
  NamXuatBan: { type: Number },
  
  // 👉 Đã thêm ref trỏ về NXB
  MaNXB: { type: String, ref: 'NhaXuatBan' }, 
  NguonGocTacGia: { type: String },
  
  // 👉 Đã thêm ref trỏ về DanhMuc (Giả sử TheLoai lưu mã danh mục)
  TheLoai: { type: String, ref: 'DanhMuc' }, 
  
  HinhAnh: { type: String },
  MoTa: { type: String }
}, { 
  collection: 'Sach',
  timestamps: true 
});

module.exports = mongoose.model('Sach', SachSchema);
