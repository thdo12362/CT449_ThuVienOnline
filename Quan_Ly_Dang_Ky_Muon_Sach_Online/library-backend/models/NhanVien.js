const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, required: true, unique: true }, // Khóa chính
  HoTenNV: { type: String, required: true },
  Password: { type: String, required: true },
  ChucVu: { type: String, default: 'Thủ thư' },
  DiaChi: { type: String },
  SoDienThoai: { type: String }
}, { collection: 'NhanVien' });

module.exports = mongoose.model('NhanVien', nhanVienSchema);


