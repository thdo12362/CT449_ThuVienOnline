const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Gọi Model mới để phục vụ việc tạo Admin mặc định (Seeding)
const NhanVien = require('./models/NhanVien');

// Load file .env
dotenv.config();

// Kết nối Database
connectDB().then(() => {
  // Sau khi kết nối DB thành công, tiến hành tạo Thủ thư (Admin) mặc định
  seedAdmin();
});

const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH ROUTES ---
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user'); // 👉 Đã thêm route user

app.use('/api', adminRoutes);
app.use('/api', bookRoutes);
app.use('/api', authRoutes); 
app.use('/api', userRoutes); // 👉 Đã khai báo sử dụng route user

// Cho phép truy cập công khai thư mục public/uploads
app.use('/uploads', express.static('public/uploads'));

// --- HÀM TỰ ĐỘNG TẠO ADMIN (SEEDING) ---
// Hàm này sẽ tạo tài khoản Thủ thư vào bảng NhanVien theo chuẩn ERD
async function seedAdmin() {
  try {
    // Kiểm tra xem đã có nhân viên nào trong hệ thống chưa
    const adminExists = await NhanVien.findOne({ MSNV: 'admin' });
    
    if (!adminExists) {
      const defaultAdmin = new NhanVien({
        MSNV: 'admin',
        HoTenNV: 'Thủ thư hệ thống',
        Password: '123', // Bạn có thể đổi lại mật khẩu ở đây
        ChucVu: 'Quản lý',
        DiaChi: 'Thư viện trung tâm',
        SoDienThoai: '0123456789'
      });
      
      await defaultAdmin.save();
      console.log('--------------------------------------------------');
      console.log('✅ ĐÃ KHỞI TẠO TÀI KHOẢN THỦ THƯ MẶC ĐỊNH!');
      console.log('👉 Tài khoản (MSNV): admin');
      console.log('👉 Mật khẩu: 123');
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error('❌ Lỗi khi tạo Admin mặc định:', error);
  }
}

// Đường dẫn test
app.get('/', (req, res) => {
  res.send('API Hệ thống Quản lý mượn sách (Chuẩn ERD) đang hoạt động...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});