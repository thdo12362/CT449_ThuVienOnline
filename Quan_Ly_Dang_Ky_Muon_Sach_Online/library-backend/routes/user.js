router.get('/users/:id', async (req, res) => {
  try {
    const user = await DocGia.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Lỗi' });
    
    res.json({ success: true, data: {
      username: user.TenDangNhap,
      fullName: user.HoLot + ' ' + user.Ten,
      email: user.Email,
      phone: user.DienThoai,
      address: user.DiaChi,
      gender: user.Phai,
      birthDate: user.NgaySinh
    }});
  } catch (error) { res.status(500).json({ success: false }); }
});
router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, email, phone, address, gender, birthDate } = req.body;
    
    // Tách Họ tên để lưu chuẩn CSDL
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
    
    res.json({ success: true, message: 'Thành công' });
  } catch (error) { res.status(500).json({ success: false }); }
});