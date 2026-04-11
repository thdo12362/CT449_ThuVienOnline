const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
  MaNXB: { type: String, required: true, unique: true }, // Khóa chính
  TenNXB: { type: String, required: true },
  DiaChi: { type: String }
}, { collection: 'NhaXuatBan' }); // Ép tên bảng cho chuẩn tiếng Việt

module.exports = mongoose.model('NhaXuatBan', nhaXuatBanSchema);