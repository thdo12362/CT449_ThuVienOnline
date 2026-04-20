const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// --- CẤU HÌNH LƯU TRỮ ẢNH VỚI MULTER ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const Sach = require('../models/Sach');
const DocGia = require('../models/DocGia');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const NhaXuatBan = require('../models/NhaXuatBan'); 
const DanhMuc = require('../models/DanhMuc'); 
const NhanVien = require('../models/NhanVien'); 

// ==========================================
// 1. LẤY TẤT CẢ PHIẾU MƯỢN (ĐÃ THÊM LOGIC TÍNH PHẠT)
// ==========================================
router.get('/admin/loans', async (req, res) => {
  try {
    const phieuMuons = await TheoDoiMuonSach.find()
      .populate('thongTinSach') 
      .populate('thongTinDocGia') 
      .sort({ NgayMuon: -1 });

    const mappedData = phieuMuons.map(p => {
      let statusEn = 'PENDING';
      if (p.TrangThai === 'DANGMUON') statusEn = 'APPROVED';
      if (p.TrangThai === 'DATRA') statusEn = 'COMPLETED';
      if (p.TrangThai === 'TUCHOI') statusEn = 'REJECTED';
      if (p.TrangThai === 'MATSACH') statusEn = 'LOST';
      if (p.TrangThai === 'DAGIAIQUYET') statusEn = 'RESOLVED';

      // 👉 TÍNH TOÁN PHÍ TRỄ HẠN VÀ SỐ NGÀY TRỄ CHO ADMIN VIEW
      let phiTreHan = 0;
      let soNgayTre = 0;
      const today = new Date();
      if (p.TrangThai === 'DANGMUON' && p.NgayTra && today > p.NgayTra) {
        const diffTime = Math.abs(today - p.NgayTra);
        soNgayTre = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        phiTreHan = soNgayTre * 2000;
      }
      
      const totalFine = (p.TienPhat || 0) + phiTreHan;

      return {
        _id: p._id,
        status: statusEn,               
        createdAt: p.NgayMuon,          
        dueDate: p.NgayTra,             
        updatedAt: p.NgayTraThucTe,     
        rejectReason: p.LyDoTuChoi,
        tienPhat: totalFine, 
        soNgayTre: soNgayTre, // 👉 Trả về số ngày trễ

        bookId: p.thongTinSach ? { 
          _id: p.thongTinSach._id,
          title: p.thongTinSach.TenSach,
          image: p.thongTinSach.HinhAnh 
        } : null,
        
        userId: p.thongTinDocGia ? { 
          _id: p.thongTinDocGia._id, 
          username: (p.thongTinDocGia.HoLot || '') + ' ' + (p.thongTinDocGia.Ten || ''), 
          email: p.thongTinDocGia.Email,
          phone: p.thongTinDocGia.DienThoai, 
          address: p.thongTinDocGia.DiaChi
        } : null
      };
    });

    res.json({ success: true, data: mappedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. CẬP NHẬT TRẠNG THÁI MƯỢN TRẢ
// ==========================================
router.put('/admin/loans/:id/status', async (req, res) => {
  try {
    const { status, rejectReason } = req.body;
    const loan = await TheoDoiMuonSach.findById(req.params.id);
    
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });

    let oldStatus = loan.TrangThai;
    let newStatusVN = 'CHODUYET';
    
    if (status === 'APPROVED') newStatusVN = 'DANGMUON';
    if (status === 'REJECTED') newStatusVN = 'TUCHOI';
    if (status === 'COMPLETED') newStatusVN = 'DATRA';
    if (status === 'LOST') newStatusVN = 'MATSACH';
    if (status === 'RESOLVED') newStatusVN = 'DAGIAIQUYET';

    // Xử lý hoàn trả sách vào kho
    if ((newStatusVN === 'TUCHOI' && oldStatus === 'CHODUYET') || 
        (newStatusVN === 'DATRA' && oldStatus === 'DANGMUON')) {
      await Sach.findOneAndUpdate({ MaSach: loan.MaSach }, { $inc: { SoQuyen: 1 } });
    }

    loan.TrangThai = newStatusVN;

    if (newStatusVN === 'TUCHOI' && rejectReason) {
      loan.LyDoTuChoi = rejectReason;
    }

    if (newStatusVN === 'DATRA') {
      loan.NgayTraThucTe = new Date();
    }

    if (newStatusVN === 'MATSACH') {
      const sach = await Sach.findOne({ MaSach: loan.MaSach });
      if (sach) loan.TienPhat = sach.DonGia || 0; 
      // LƯU NGÀY BÁO MẤT ĐỂ TÍNH THỜI GIAN ĐỀN BÙ
      loan.NgayTraThucTe = new Date(); 
    }

    // 👉 MỞ KHÓA TÀI KHOẢN NẾU USER ĐÃ ĐÓNG PHẠT XONG
    if (newStatusVN === 'RESOLVED') {
       const user = await DocGia.findOne({ MaDocGia: loan.MaDocGia });
       if (user && user.isActive === false) {
           user.isActive = true;
           await user.save();
       }
    }

    await loan.save();

    res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. LẤY DANH SÁCH ĐỘC GIẢ
// ==========================================
router.get('/admin/users', async (req, res) => {
  try {
    const docGias = await DocGia.find().select('-Password');
    
    const mappedUsers = docGias.map(d => ({
      _id: d._id,
      username: d.TenDangNhap,   
      maDocGia: d.MaDocGia,      
      fullName: d.HoLot + ' ' + d.Ten, 
      email: d.Email,
      ngaySinh: d.NgaySinh,      
      phai: d.Phai,              
      diaChi: d.DiaChi,          
      dienThoai: d.DienThoai,    
      isActive: d.isActive !== false 
    }));

    res.json({ success: true, data: mappedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. THỐNG KÊ DASHBOARD (NÂNG CAO)
// ==========================================
router.get('/admin/stats', async (req, res) => {
  try {
    const totalBooks = await Sach.countDocuments();
    const totalUsers = await DocGia.countDocuments();
    const totalLoans = await TheoDoiMuonSach.countDocuments();
    const activeLoans = await TheoDoiMuonSach.countDocuments({ TrangThai: 'DANGMUON' });
    const pendingLoansCount = await TheoDoiMuonSach.countDocuments({ TrangThai: 'CHODUYET' });

    // 👉 TÍNH HOẠT ĐỘNG GẦN ĐÂY
    const recentLoans = await TheoDoiMuonSach.find()
      .sort({ _id: -1 })
      .limit(10)
      .populate('thongTinSach', 'TenSach')
      .populate('thongTinDocGia', 'HoLot Ten');

    const recentActivities = recentLoans.map(loan => {
      const userName = loan.thongTinDocGia ? `${loan.thongTinDocGia.HoLot} ${loan.thongTinDocGia.Ten}` : 'Độc giả ẩn';
      const bookName = loan.thongTinSach ? loan.thongTinSach.TenSach : 'sách không tồn tại';
      
      let action = 'đăng ký mượn';
      if (loan.TrangThai === 'DANGMUON') action = 'đang mượn';
      if (loan.TrangThai === 'DATRA') action = 'đã trả';
      if (loan.TrangThai === 'TUCHOI') action = 'bị từ chối mượn';
      if (loan.TrangThai === 'MATSACH') action = 'báo mất';
      
      return {
        id: loan._id,
        user: userName,
        action: action,
        book: bookName,
        time: loan._id.getTimestamp() // Lấy thời gian từ ObjectID
      };
    });

    // 👉 TOP SÁCH MƯỢN NHIỀU NHẤT
    const topBooksAggr = await TheoDoiMuonSach.aggregate([
      { $match: { TrangThai: { $ne: 'TUCHOI' } } },
      { $group: { _id: "$MaSach", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const topBooks = await Promise.all(topBooksAggr.map(async (b) => {
       const s = await Sach.findOne({ MaSach: b._id });
       return { name: s ? s.TenSach : b._id, count: b.count };
    }));

    // 👉 TOP NGƯỜI MƯỢN NHIỀU NHẤT
    const topUsersAggr = await TheoDoiMuonSach.aggregate([
      { $match: { TrangThai: { $ne: 'TUCHOI' } } },
      { $group: { _id: "$MaDocGia", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topUsers = await Promise.all(topUsersAggr.map(async (u) => {
       const d = await DocGia.findOne({ MaDocGia: u._id });
       return { name: d ? `${d.HoLot} ${d.Ten}` : u._id, count: u.count };
    }));

    res.json({ 
      success: true, 
      data: { 
        totalBooks, 
        totalUsers, 
        totalLoans, 
        activeLoans,
        pendingLoansCount,
        recentActivities,
        topBooks,
        topUsers
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. ADMIN THÊM SÁCH
// ==========================================
router.post('/admin/books', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, quantity, price, description, publisher, publishYear } = req.body;
    const imageName = req.file ? req.file.filename : "";

    const lastBook = await Sach.findOne({ MaSach: { $regex: /^S\d{1,5}$/ } }).sort({ MaSach: -1 }); 
    let nextIdNumber = 1;

    if (lastBook && lastBook.MaSach) {
      const lastIdNum = parseInt(lastBook.MaSach.substring(1), 10);
      if (!isNaN(lastIdNum)) nextIdNumber = lastIdNum + 1;
    }

    const formattedId = 'S' + nextIdNumber.toString().padStart(3, '0');

    const newSach = new Sach({
      MaSach: formattedId, 
      TenSach: title,
      NguonGocTacGia: author,
      TheLoai: category,
      SoQuyen: Number(quantity) || 0,
      DonGia: Number(price) || 0,
      HinhAnh: imageName, 
      MoTa: description,
      MaNXB: publisher,
      NamXuatBan: publishYear
    });

    await newSach.save();
    res.json({ success: true, message: 'Thêm sách thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. ADMIN SỬA SÁCH
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

    if (req.file) updateData.HinhAnh = req.file.filename;

    await Sach.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: 'Cập nhật sách thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. ADMIN XÓA SÁCH
// ==========================================
router.delete('/admin/books/:id', async (req, res) => {
  try {
    await Sach.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 8. KHÓA / MỞ KHÓA TÀI KHOẢN
// ==========================================
router.put('/admin/users/:id/toggle-lock', async (req, res) => {
  try {
    const user = await DocGia.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    user.isActive = user.isActive === false ? true : false;
    await user.save();
    res.json({ success: true, message: user.isActive ? 'Đã mở khóa' : 'Đã khóa' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 9. QUẢN LÝ DANH MỤC
// ==========================================
router.get('/admin/categories', async (req, res) => {
  try {
    const cats = await DanhMuc.find();
    res.json({ success: true, data: cats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/categories', async (req, res) => {
  try {
    const lastCat = await DanhMuc.findOne({ maDanhMuc: { $regex: /^DM\d+$/ } }).sort({ maDanhMuc: -1 });
    let nextId = 1;
    if (lastCat && lastCat.maDanhMuc) {
      const lastNum = parseInt(lastCat.maDanhMuc.replace('DM', ''), 10);
      if (!isNaN(lastNum)) nextId = lastNum + 1;
    }
    const maDanhMuc = 'DM' + nextId.toString().padStart(3, '0');

    const newCat = new DanhMuc({ maDanhMuc, tenDanhMuc: req.body.tenDanhMuc });
    await newCat.save();
    res.json({ success: true, message: 'Thêm danh mục thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/categories/:id', async (req, res) => {
  try {
    await DanhMuc.findByIdAndUpdate(req.params.id, { tenDanhMuc: req.body.tenDanhMuc });
    res.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/admin/categories/:id', async (req, res) => {
  try {
    const cat = await DanhMuc.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

    const bookCount = await Sach.countDocuments({ TheLoai: cat.tenDanhMuc });
    if (bookCount > 0) {
      return res.status(400).json({ success: false, message: `Không thể xóa! Đang có ${bookCount} sách thuộc danh mục này.` });
    }

    await DanhMuc.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa danh mục thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 10. QUẢN LÝ NHÀ XUẤT BẢN
// ==========================================
router.get('/admin/publishers', async (req, res) => {
  try {
    const pubs = await NhaXuatBan.find();
    const mappedPubs = pubs.map(p => ({
      _id: p._id,
      maNXB: p.MaNXB,
      tenNXB: p.TenNXB,
      diaChi: p.DiaChi
    }));
    res.json({ success: true, data: mappedPubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/publishers', async (req, res) => {
  try {
    const lastPub = await NhaXuatBan.findOne({ MaNXB: { $regex: /^NXB\d+$/ } }).sort({ MaNXB: -1 });
    let nextId = 1;
    if (lastPub && lastPub.MaNXB) {
      const lastNum = parseInt(lastPub.MaNXB.replace('NXB', ''), 10);
      if (!isNaN(lastNum)) nextId = lastNum + 1;
    }
    const maNXB = 'NXB' + nextId.toString().padStart(3, '0');

    const newPub = new NhaXuatBan({
      MaNXB: maNXB,
      TenNXB: req.body.tenNXB,
      DiaChi: req.body.diaChi
    });
    await newPub.save();
    res.json({ success: true, message: 'Thêm NXB thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/publishers/:id', async (req, res) => {
  try {
    await NhaXuatBan.findByIdAndUpdate(req.params.id, {
      TenNXB: req.body.tenNXB,
      DiaChi: req.body.diaChi
    });
    res.json({ success: true, message: 'Cập nhật NXB thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/admin/publishers/:id', async (req, res) => {
  try {
    await NhaXuatBan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa NXB thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 11. QUẢN LÝ NHÂN VIÊN
// ==========================================
router.get('/admin/employees', async (req, res) => {
  try {
    const employees = await NhanVien.find().select('-Password');
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/admin/employees', async (req, res) => {
  try {
    const lastEmp = await NhanVien.findOne({ MSNV: { $regex: /^NV\d+$/ } }).sort({ MSNV: -1 });
    let nextId = 1;
    if (lastEmp && lastEmp.MSNV) {
      const lastNum = parseInt(lastEmp.MSNV.replace('NV', ''), 10);
      if (!isNaN(lastNum)) nextId = lastNum + 1;
    }
    const msnv = 'NV' + nextId.toString().padStart(3, '0');

    const newEmp = new NhanVien({
      MSNV: msnv,
      HoTenNV: req.body.HoTenNV,
      Password: req.body.Password || '123456', 
      ChucVu: req.body.ChucVu,
      DiaChi: req.body.DiaChi,
      SoDienThoai: req.body.SoDienThoai
    });
    
    await newEmp.save();
    res.json({ success: true, message: 'Thêm nhân viên thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/admin/employees/:id', async (req, res) => {
  try {
    const updateData = {
      HoTenNV: req.body.HoTenNV,
      ChucVu: req.body.ChucVu,
      DiaChi: req.body.DiaChi,
      SoDienThoai: req.body.SoDienThoai
    };
    
    if (req.body.Password && req.body.Password.trim() !== '') {
      updateData.Password = req.body.Password;
    }

    await NhanVien.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: 'Cập nhật nhân viên thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/admin/employees/:id', async (req, res) => {
  try {
    const emp = await NhanVien.findById(req.params.id);
    if (emp && emp.MSNV === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể xóa quản trị viên gốc!' });
    }

    await NhanVien.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Xóa nhân viên thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;