const express = require('express');
const router = express.Router();
const DocGia = require('../models/DocGia');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach'); 

// ==========================================
// 1. LẤY THÔNG TIN HỒ SƠ & TỰ ĐỘNG KHÓA TÀI KHOẢN (NỢ XẤU)
// ==========================================
router.get('/users/:id', async (req, res) => {
  try {
    const user = await DocGia.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    
    // 👉 LOGIC 1: QUÉT SÁCH QUÁ HẠN > 30 NGÀY
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const overdueLoan = await TheoDoiMuonSach.findOne({
      MaDocGia: user.MaDocGia,
      TrangThai: 'DANGMUON',
      NgayTra: { $lt: thirtyDaysAgo } 
    });

    // 👉 LOGIC 2: QUÉT SÁCH BÁO MẤT > 7 NGÀY MÀ CHƯA ĐỀN BÙ
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const unresolvedLostLoan = await TheoDoiMuonSach.findOne({
      MaDocGia: user.MaDocGia,
      TrangThai: 'MATSACH',
      NgayBaoMat: { $lt: sevenDaysAgo } 
    });

    // Nếu phát hiện nợ xấu (quá hạn 30 ngày HOẶC báo mất 7 ngày chưa đền) -> Tiến hành KHÓA
    if ((overdueLoan || unresolvedLostLoan) && user.isActive !== false) {
      user.isActive = false;
      await user.save();
    }

    res.json({ success: true, data: {
      username: user.TenDangNhap,
      fullName: user.HoLot + ' ' + user.Ten,
      email: user.Email,
      phone: user.DienThoai,
      address: user.DiaChi,
      gender: user.Phai,
      birthDate: user.NgaySinh,
      isActive: user.isActive // 👉 Trả trạng thái về cho Frontend
    }});
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});

// ==========================================
// 2. CẬP NHẬT HỒ SƠ ĐỘC GIẢ
// ==========================================
router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, email, phone, address, gender, birthDate } = req.body;
    
    // Tách Họ tên để lưu đúng 2 cột HoLot và Ten trong Database
    const nameParts = fullName.trim().split(' ');
    const ten = nameParts.pop() || '';
    const hoLot = nameParts.join(' ') || 'Họ';

    await DocGia.findByIdAndUpdate(req.params.id, {
      HoLot: hoLot,
      Ten: ten,
      Email: email,
      DienThoai: phone,
      DiaChi: address,
      Phai: gender,
      NgaySinh: birthDate || null
    });
    
    res.json({ success: true, message: 'Cập nhật hồ sơ thành công' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});

// ==========================================
// 3. ĐỔI MẬT KHẨU
// ==========================================
router.put('/users/:id/password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await DocGia.findById(req.params.id);
    
    if (!user || user.Password !== oldPassword) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác!' });
    }

    user.Password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
});

module.exports = router;