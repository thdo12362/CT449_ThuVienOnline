const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true, unique: true },
  TenDangNhap: { type: String, required: true, unique: true },
  HoLot: { type: String, required: true },
  Ten: { type: String, required: true },
  NgaySinh: { type: Date },
  Phai: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
  DiaChi: { type: String },
  DienThoai: { type: String },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  
  // 👉 THÊM DÒNG NÀY ĐỂ QUẢN LÝ TRẠNG THÁI KHÓA/MỞ KHÓA
  isActive: { type: Boolean, default: true } 
  
}, { collection: 'DocGia' });

module.exports = mongoose.model('DocGia', docGiaSchema);