const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer'); // 1. Thêm thư viện multer

// --- CẤU HÌNH LƯU TRỮ ẢNH ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Ảnh sẽ lưu vào thư mục này
  },
  filename: function (req, file, cb) {
    // Đổi tên file để tránh trùng lặp: thời gian_tên_gốc
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Gọi các Model
const Sach = require('../models/Sach');
const NhaXuatBan = require('../models/NhaXuatBan');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');

// ==========================================
// 1. LẤY DANH SÁCH SÁCH
// ==========================================
router.get('/books', async (req, res) => {
  try {
    const sachs = await Sach.find();
    const booksData = sachs.map(s => ({
      _id: s._id,
      maSach: s.MaSach, // Bổ sung mã sách
      title: s.TenSach,
      author: s.NguonGocTacGia,
      category: s.TheLoai,
      quantity: s.SoQuyen,
      image: s.HinhAnh,
      description: s.MoTa,
      price: s.DonGia, 
      publishYear: s.NamXuatBan,
      publisher: s.MaNXB, 
      borrowCount: 0 
    }));
    res.json({ success: true, data: booksData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. LẤY CHI TIẾT 1 CUỐN SÁCH
// ==========================================
router.get('/books/:id', async (req, res) => {
  try {
    const s = await Sach.findById(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    const borrowCount = await TheoDoiMuonSach.countDocuments({ MaSach: s._id });

    res.json({ 
      success: true, 
      data: {
        _id: s._id,
        maSach: s.MaSach,
        title: s.TenSach,
        author: s.NguonGocTacGia,
        category: s.TheLoai,
        quantity: s.SoQuyen,
        image: s.HinhAnh,
        description: s.MoTa,
        price: s.DonGia,
        publishYear: s.NamXuatBan,
        publisher: s.MaNXB,
        borrowCount: borrowCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. ĐỘC GIẢ MƯỢN SÁCH
// ==========================================
router.post('/loans', async (req, res) => {
  try {
    const { bookId, userId, daysToBorrow } = req.body;
    const sach = await Sach.findById(bookId);
    if (!sach || sach.SoQuyen <= 0) return res.status(400).json({ success: false, message: "Rất tiếc, sách này đã hết!" });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(daysToBorrow || 7));

    const newLoan = new TheoDoiMuonSach({
      MaDocGia: userId,
      MaSach: bookId,
      NgayMuon: new Date(),
      NgayTra: dueDate,
      TrangThai: 'CHODUYET'
    });
    await newLoan.save();
    sach.SoQuyen -= 1;
    await sach.save();

    res.json({ success: true, message: "Đăng ký mượn thành công! Vui lòng chờ duyệt." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. LẤY LỊCH SỬ MƯỢN CỦA 1 ĐỘC GIẢ
// ==========================================
router.get('/loans/user/:userId', async (req, res) => {
  try {
    const phieuMuons = await TheoDoiMuonSach.find({ MaDocGia: req.params.userId }).populate('MaSach').sort({ NgayMuon: -1 });
    const loansData = phieuMuons.map(p => {
      let statusEn = 'PENDING';
      if (p.TrangThai === 'DANGMUON') statusEn = 'APPROVED';
      if (p.TrangThai === 'DATRA') statusEn = 'COMPLETED';
      if (p.TrangThai === 'TUCHOI') statusEn = 'REJECTED';
      return {
        _id: p._id,
        bookId: p.MaSach ? { _id: p.MaSach._id, title: p.MaSach.TenSach, author: p.MaSach.NguonGocTacGia, image: p.MaSach.HinhAnh, category: p.MaSach.TheLoai } : null,
        createdAt: p.NgayMuon, dueDate: p.NgayTra, status: statusEn
      };
    });
    res.json({ success: true, data: loansData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. ĐỘC GIẢ HỦY YÊU CẦU MƯỢN SÁCH
// ==========================================
router.delete('/loans/:id', async (req, res) => {
  try {
    const loanId = req.params.id;

    // Tìm phiếu mượn trong Database
    const loan = await TheoDoiMuonSach.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    }

    // (Tùy chọn) Chỉ cho phép người dùng hủy khi phiếu còn đang ở trạng thái "CHODUYET"
    if (loan.TrangThai !== 'CHODUYET') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn đang chờ duyệt!' });
    }

    // Xóa phiếu mượn
    await TheoDoiMuonSach.findByIdAndDelete(loanId);

    // Hoàn lại 1 cuốn sách vào kho (vì lúc mượn đã trừ đi 1)
    await Sach.findByIdAndUpdate(loan.MaSach, { $inc: { SoQuyen: 1 } });

    res.json({ success: true, message: 'Hủy yêu cầu mượn sách thành công!' });

  } catch (error) {
    console.error("Lỗi khi hủy phiếu mượn:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// ==========================================
// THỐNG KÊ DASHBOARD (Cho Admin)
// ==========================================
router.get('/admin/stats', async (req, res) => {
  try {
    const totalBooks = await Sach.countDocuments();
    const totalUsers = await DocGia.countDocuments(); 
    const totalLoans = await TheoDoiMuonSach.countDocuments(); 
    const activeLoans = await TheoDoiMuonSach.countDocuments({ TrangThai: 'DANGMUON' });
    res.json({ success: true, data: { totalBooks, totalUsers, totalLoans, activeLoans } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. ADMIN LẤY TẤT CẢ PHIẾU MƯỢN
// ==========================================
router.get('/admin/loans', async (req, res) => {
  try {
    const phieuMuons = await TheoDoiMuonSach.find().populate('MaSach').populate('MaDocGia').sort({ NgayMuon: -1 });
    const loansData = phieuMuons.map(p => {
      let statusEn = 'PENDING';
      if (p.TrangThai === 'DANGMUON') statusEn = 'APPROVED';
      if (p.TrangThai === 'DATRA') statusEn = 'COMPLETED';
      if (p.TrangThai === 'TUCHOI') statusEn = 'REJECTED';
      return {
        _id: p._id, createdAt: p.NgayMuon, dueDate: p.NgayTra, status: statusEn,
        bookId: p.MaSach ? { _id: p.MaSach._id, title: p.MaSach.TenSach, image: p.MaSach.HinhAnh } : null,
        userId: p.MaDocGia ? { _id: p.MaDocGia._id, username: p.MaDocGia.HoLot + ' ' + p.MaDocGia.Ten, email: p.MaDocGia.Email } : null
      };
    });
    res.json({ success: true, data: loansData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 8. CẬP NHẬT TRẠNG THÁI MƯỢN TRẢ
// ==========================================
router.put('/admin/loans/:id/status', async (req, res) => {
  try {
    const { status } = req.body; 
    const loan = await TheoDoiMuonSach.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Lỗi' });

    let newStatusVN = 'CHODUYET';
    if (status === 'APPROVED') newStatusVN = 'DANGMUON';
    if (status === 'REJECTED') newStatusVN = 'TUCHOI';
    if (status === 'COMPLETED') newStatusVN = 'DATRA';

    if ((newStatusVN === 'TUCHOI' && loan.TrangThai === 'CHODUYET') || 
        (newStatusVN === 'DATRA' && loan.TrangThai === 'DANGMUON')) {
      await Sach.findByIdAndUpdate(loan.MaSach, { $inc: { SoQuyen: 1 } });
    }
    loan.TrangThai = newStatusVN;
    await loan.save();
    res.json({ success: true, message: 'Cập nhật thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 9. ADMIN THÊM SÁCH MỚI (Hỗ trợ UPLOAD ẢNH)
// ==========================================
router.post('/admin/books', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, quantity, price, description, publisher, publishYear } = req.body;
    
    // Nếu có file được upload, lấy tên file đó, ngược lại để trống
    const imageName = req.file ? req.file.filename : "";

    const newSach = new Sach({
      MaSach: "S" + Date.now(), 
      TenSach: title,
      NguonGocTacGia: author,
      TheLoai: category,
      SoQuyen: Number(quantity) || 0,
      DonGia: Number(price) || 0,
      HinhAnh: imageName, // Lưu tên file ảnh vào DB
      MoTa: description,
      MaNXB: publisher, 
      NamXuatBan: publishYear
    });

    await newSach.save();
    res.json({ success: true, message: 'Thêm sách thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 10. ADMIN SỬA SÁCH (Hỗ trợ UPLOAD ẢNH)
// ==========================================
router.put('/admin/books/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, quantity, price, description, publisher, publishYear } = req.body;
    
    const updateData = {
      TenSach: title,
      NguonGocTacGia: author,
      TheLoai: category,
      SoQuyen: Number(quantity) || 0,
      DonGia: Number(price) || 0,
      MoTa: description,
      MaNXB: publisher,
      NamXuatBan: publishYear
    };

    // Nếu người dùng có chọn ảnh mới thì mới cập nhật trường HinhAnh
    if (req.file) {
      updateData.HinhAnh = req.file.filename;
    }

    await Sach.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: 'Cập nhật sách thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 11. ADMIN XÓA SÁCH
// ==========================================
router.delete('/admin/books/:id', async (req, res) => {
  try {
    await Sach.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa sách thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;