const mongoose = require('mongoose');

const danhMucSchema = new mongoose.Schema({
  maDanhMuc: { type: String, required: true, unique: true },
  tenDanhMuc: { type: String, required: true }
}, { 
  collection: 'DanhMuc',
  timestamps: true 
});

module.exports = mongoose.model('DanhMuc', danhMucSchema);