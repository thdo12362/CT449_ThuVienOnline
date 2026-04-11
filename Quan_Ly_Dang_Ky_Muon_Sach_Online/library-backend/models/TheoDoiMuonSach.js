const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
  // 2 Khóa ngoại trỏ về Độc giả và Sách
  MaDocGia: { type: String, ref: 'DocGia', required: true },
  MaSach: { type: String, ref: 'Sach', required: true },
  
  NgayMuon: { type: Date, default: Date.now },
  NgayTra: { type: Date },
  NgayTraThucTe: { type: Date }, // 👉 Nơi lưu giờ phút giây trả sách thực tế

  // 👉 TRƯỜNG BỔ SUNG CHO WEB (Quản lý tiến độ):
  TrangThai: { 
    type: String, 
    enum: ['CHODUYET', 'DANGMUON', 'DATRA', 'TUCHOI'], 
    default: 'CHODUYET' 
  }
}, { collection: 'TheoDoiMuonSach' });

// Đã sửa lại chữ 't' thường cho khớp với tên biến khai báo ở trên
module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema, 'TheoDoiMuonSach');