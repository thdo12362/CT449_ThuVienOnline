const express = require('express');
const router = express.Router();

const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');

// ==========================================
// 1. ĐĂNG KÝ TÀI KHOẢN (Độc giả - Tạo mã tự động DG001)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, birthDate, gender, address, phone } = req.body; 

    // Kiểm tra trùng lặp Tên đăng nhập hoặc Email
    const existingUser = await DocGia.findOne({ $or: [{ Email: email }, { TenDangNhap: username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email hoặc Tên đăng nhập đã tồn tại!' });
    }

    // Tách Họ và Tên
    const nameParts = fullName.trim().split(' ');
    const ten = nameParts.pop() || username; 
    const hoLot = nameParts.join(' ') || 'Họ'; 

    // 👉 LOGIC TẠO MÃ ĐỘC GIẢ TỰ ĐỘNG TĂNG DẦN (DG001, DG002...)
    const lastUser = await DocGia.findOne({ MaDocGia: { $regex: /^DG\d+$/ } }).sort({ MaDocGia: -1 });
    let nextIdNumber = 1; // Mặc định là 1 nếu chưa có ai

    if (lastUser && lastUser.MaDocGia) {
      // Lấy phần số phía sau chữ "DG" (Ví dụ: "DG005" -> "005")
      const lastIdStr = lastUser.MaDocGia.replace('DG', ''); 
      const lastIdNum = parseInt(lastIdStr, 10);
      if (!isNaN(lastIdNum)) {
        nextIdNumber = lastIdNum + 1; // Tăng lên 1
      }
    }

    // Format thành dạng DG001, DG002, DG010... (padStart 3 chữ số)
    const formattedMaDocGia = 'DG' + nextIdNumber.toString().padStart(3, '0');

    // Tạo Độc giả mới
    const newDocGia = new DocGia({
      MaDocGia: formattedMaDocGia, // Gán mã vừa tạo vào đây
      TenDangNhap: username, 
      HoLot: hoLot, 
      Ten: ten, 
      NgaySinh: birthDate || null, 
      Phai: gender || 'Khác', 
      DiaChi: address || 'Chưa cập nhật', 
      DienThoai: phone || 'Chưa cập nhật', 
      Email: email,
      Password: password 
    });

    await newDocGia.save();
    res.json({ success: true, message: 'Đăng ký thành công! Hãy đăng nhập.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. ĐĂNG NHẬP (Độc giả & Nhân viên)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; 

    // BƯỚC 1: Tìm ĐỘC GIẢ theo TenDangNhap hoặc Email
    let user = await DocGia.findOne({ 
      $or: [{ TenDangNhap: username }, { Email: username }] 
    });

    if (user) {
      // 🌟 KIỂM TRA KHÓA TÀI KHOẢN NGAY TẠI ĐÂY (Trước khi check pass)
      if (user.isActive === false) {
        return res.status(403).json({ 
          success: false, 
          message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Thủ thư!' 
        });
      }

      // Kiểm tra mật khẩu
      if (user.Password !== password) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
      }
      
      return res.json({
        success: true,
        data: { _id: user._id, username: user.TenDangNhap, role: 'MEMBER' }
      });
    }

    // BƯỚC 2: Tìm NHÂN VIÊN theo MSNV
    let admin = await NhanVien.findOne({ MSNV: username });
    if (admin) {
      if (admin.Password !== password) {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
      }
      return res.json({
        success: true,
        data: { _id: admin._id, username: admin.HoTenNV, role: 'ADMIN' }
      });
    }

    return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. KHỞI TẠO ADMIN (Nhân viên)
// ==========================================
router.get('/init-admin', async (req, res) => {
  try {
    const adminExist = await NhanVien.findOne({ MSNV: 'admin' });
    if (adminExist) return res.json({ message: 'Tài khoản Admin đã tồn tại!' });

    const newAdmin = new NhanVien({
      MSNV: 'admin', 
      HoTenNV: 'Thủ Thư Chính', 
      Password: '123',
      ChucVu: 'Quản lý', 
      DiaChi: 'Thư viện', 
      SoDienThoai: '000' 
    });

    await newAdmin.save();
    res.json({ success: true, message: 'Tạo tài khoản Admin thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;