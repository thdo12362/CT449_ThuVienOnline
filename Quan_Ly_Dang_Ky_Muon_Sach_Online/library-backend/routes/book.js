const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// --- CẤU HÌNH LƯU TRỮ ẢNH ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const Sach = require('../models/Sach');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach');
const DocGia = require('../models/DocGia'); 

// 1. LẤY DANH SÁCH SÁCH
router.get('/books', async (req, res) => {
  try {
    const sachs = await Sach.find();
    const booksData = sachs.map(s => ({
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
      borrowCount: 0 
    }));
    res.json({ success: true, data: booksData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. LẤY CHI TIẾT 1 CUỐN SÁCH
router.get('/books/:id', async (req, res) => {
  try {
    const s = await Sach.findById(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    const borrowCount = await TheoDoiMuonSach.countDocuments({ MaSach: s.MaSach });

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

// 3. ĐỘC GIẢ MƯỢN SÁCH (CÓ CHECK QUÁ HẠN, BÁO MẤT, VÀ SỐ LƯỢNG)
router.post('/loans', async (req, res) => {
  try {
    const { bookId, userId, daysToBorrow } = req.body;
    
    const docGia = await DocGia.findById(userId);
    if (!docGia) return res.status(404).json({ success: false, message: "Không tìm thấy thông tin Độc giả!" });

    // 👉 3.1 LOGIC: KIỂM TRA QUÁ HẠN
    const overdueLoan = await TheoDoiMuonSach.findOne({
      MaDocGia: docGia.MaDocGia,
      TrangThai: 'DANGMUON',
      NgayTra: { $lt: new Date() } // Ngày trả nhỏ hơn hôm nay = Quá hạn
    });

    if (overdueLoan) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đang có sách quá hạn chưa trả. Vui lòng trả sách để tiếp tục mượn mới!" 
      });
    }

    // 👉 3.2 LOGIC: KIỂM TRA BÁO MẤT CHƯA ĐỀN BÙ
    const lostLoan = await TheoDoiMuonSach.findOne({
      MaDocGia: docGia.MaDocGia,
      TrangThai: 'MATSACH'
    });

    if (lostLoan) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đang có sách báo mất chưa đền bù. Vui lòng đến thư viện nộp phạt để tiếp tục mượn sách!" 
      });
    }

    // 👉 3.3 LOGIC: KIỂM TRA SỐ LƯỢNG TỐI ĐA (3 CUỐN)
    const currentLoanCount = await TheoDoiMuonSach.countDocuments({
      MaDocGia: docGia.MaDocGia,
      TrangThai: { $in: ['CHODUYET', 'DANGMUON'] } // Tính cả đơn đang chờ và đơn đang mượn
    });

    if (currentLoanCount >= 3) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đã đạt giới hạn mượn tối đa 3 cuốn sách cùng lúc. Vui lòng trả bớt sách trước khi mượn mới!" 
      });
    }

    const sach = await Sach.findById(bookId);
    if (!sach || sach.SoQuyen <= 0) return res.status(400).json({ success: false, message: "Rất tiếc, sách này đã hết!" });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(daysToBorrow || 7));

    const newLoan = new TheoDoiMuonSach({
      MaDocGia: docGia.MaDocGia, 
      MaSach: sach.MaSach,       
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

// 4. LẤY LỊCH SỬ MƯỢN CỦA 1 ĐỘC GIẢ (TÍNH PHÍ TRỄ HẠN VÀ SỐ NGÀY TRỄ)
router.get('/loans/user/:userId', async (req, res) => {
  try {
    const docGia = await DocGia.findById(req.params.userId);
    if (!docGia) return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });

    const phieuMuons = await TheoDoiMuonSach.find({ MaDocGia: docGia.MaDocGia })
      .populate('thongTinSach') 
      .sort({ NgayMuon: -1 });

    const loansData = phieuMuons.map(p => {
      let statusEn = 'PENDING';
      if (p.TrangThai === 'DANGMUON') statusEn = 'APPROVED';
      if (p.TrangThai === 'DATRA') statusEn = 'COMPLETED';
      if (p.TrangThai === 'TUCHOI') statusEn = 'REJECTED';
      if (p.TrangThai === 'MATSACH') statusEn = 'LOST';
      if (p.TrangThai === 'DAGIAIQUYET') statusEn = 'RESOLVED';

      // 👉 LOGIC: TÍNH TIỀN PHẠT TRỄ HẠN VÀ SỐ NGÀY TRỄ
      let phiTreHan = 0;
      let soNgayTre = 0;
      const today = new Date();
      
      if (p.TrangThai === 'DANGMUON' && p.NgayTra && today > p.NgayTra) {
        // Tính số ngày quá hạn
        const diffTime = Math.abs(today - p.NgayTra);
        soNgayTre = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        phiTreHan = soNgayTre * 2000;
      }

      // Tổng tiền phạt = Tiền lưu trong DB (khi báo mất) + Phí trễ hạn tự động tính
      const totalFine = (p.TienPhat || 0) + phiTreHan;

      const s = p.thongTinSach; 
      return {
        _id: p._id,
        bookId: s ? { 
          _id: s._id, 
          title: s.TenSach, 
          author: s.NguonGocTacGia, 
          image: s.HinhAnh, 
          category: s.TheLoai 
        } : null,
        createdAt: p.NgayMuon, 
        dueDate: p.NgayTra,
        ngayBaoMat: p.NgayTraThucTe, // Nếu mất sách, ngày này sẽ là ngày bắt đầu đếm thời gian phạt
        status: statusEn,
        rejectReason: p.LyDoTuChoi,
        tienPhat: totalFine,
        soNgayTre: soNgayTre // 👉 Trả về số ngày trễ cho Frontend
      };
    });
    res.json({ success: true, data: loansData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. ĐỘC GIẢ HỦY YÊU CẦU MƯỢN SÁCH
router.delete('/loans/:id', async (req, res) => {
  try {
    const loan = await TheoDoiMuonSach.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    if (loan.TrangThai !== 'CHODUYET') return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn đang chờ duyệt!' });

    await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
    await Sach.findOneAndUpdate({ MaSach: loan.MaSach }, { $inc: { SoQuyen: 1 } });

    res.json({ success: true, message: 'Hủy yêu cầu mượn sách thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. ĐỘC GIẢ BÁO MẤT SÁCH (CỘNG TIỀN ĐỀN BÙ VÀO HỒ SƠ)
router.put('/loans/:id/report-lost', async (req, res) => {
  try {
    const loan = await TheoDoiMuonSach.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn!' });
    
    if (loan.TrangThai !== 'DANGMUON') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể báo mất đối với sách đang mượn!' });
    }

    // Lấy giá trị cuốn sách để làm tiền đền bù
    const sach = await Sach.findOne({ MaSach: loan.MaSach });
    const tienDenBu = sach ? (sach.DonGia || 0) : 0;

    // Chuyển trạng thái sang MATSACH và lưu tiền phạt
    loan.TrangThai = 'MATSACH';
    loan.TienPhat = tienDenBu; // Ghi cứng tiền phạt vào DB
    
    // SỬ DỤNG TRƯỜNG NgayBaoMat ĐỂ ĐẾM NGÀY NỘP PHẠT MÀ CHÚNG TA ĐÃ TẠO TRƯỚC ĐÓ
    loan.NgayBaoMat = new Date(); 

    await loan.save();

    res.json({ success: true, message: 'Báo mất sách thành công! Vui lòng đến thư viện để nộp phạt.', tienPhat: tienDenBu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;