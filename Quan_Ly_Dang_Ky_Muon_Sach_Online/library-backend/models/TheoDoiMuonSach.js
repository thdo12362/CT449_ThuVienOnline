const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true }, // Bỏ ref ở đây
  MaSach: { type: String, required: true },   // Bỏ ref ở đây
  
  NgayMuon: { type: Date, default: Date.now },
  NgayTra: { type: Date },
  NgayTraThucTe: { type: Date },
  
  // 👉 THÊM MỚI: Ngày người dùng báo mất sách (để tính thời hạn 7 ngày nộp phạt)
  NgayBaoMat: { type: Date },

  TrangThai: { 
    type: String, 
    enum: ['CHODUYET', 'DANGMUON', 'DATRA', 'TUCHOI', 'MATSACH', 'DAGIAIQUYET'], 
    default: 'CHODUYET' 
  },
  
  LyDoTuChoi: { type: String, default: '' },
  TienPhat: { type: Number, default: 0 }

}, { 
  collection: 'TheoDoiMuonSach',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

theoDoiMuonSachSchema.virtual('thongTinDocGia', {
  ref: 'DocGia',
  localField: 'MaDocGia', 
  foreignField: 'MaDocGia', 
  justOne: true 
});

theoDoiMuonSachSchema.virtual('thongTinSach', {
  ref: 'Sach',
  localField: 'MaSach',
  foreignField: 'MaSach',
  justOne: true
});

module.exports = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema, 'TheoDoiMuonSach');