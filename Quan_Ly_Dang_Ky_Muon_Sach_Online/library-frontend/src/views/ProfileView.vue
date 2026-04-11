<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth">
    
    <nav class="sticky top-0 z-50 bg-blue-600 shadow-md transition-all">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <a @click="router.push('/')" class="flex items-center gap-2 text-white cursor-pointer group">
              <i class="fa-solid fa-book-open-reader text-2xl group-hover:scale-110 transition-transform"></i>
              <span class="font-bold text-xl tracking-tight">Thư Viện Sách</span>
            </a>
            <div class="hidden md:flex items-center gap-6 font-medium text-sm text-blue-100">
              <a @click="router.push('/')" class="hover:text-white transition-colors cursor-pointer">Trang chủ</a>
              <router-link to="/my-books" class="hover:text-white transition-all duration-200 active:scale-95 inline-block">My Library</router-link>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button @click="logout" class="text-blue-50 font-medium hover:text-white text-sm transition-colors flex items-center gap-2">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10 flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/30">
          <i class="fa-solid fa-id-card-clip"></i>
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Tài khoản cá nhân</h1>
          <p class="text-slate-500 mt-1 font-medium">Quản lý thông tin hồ sơ và bảo mật của bạn.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        <div class="col-span-1 space-y-6">
          <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-100 to-purple-50 opacity-50"></div>
            
            <div class="relative w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-4xl mx-auto mb-4 border-4 border-white shadow-xl shadow-blue-600/20 z-10">
              {{ userAvatar }}
            </div>
            <h2 class="text-xl font-black text-slate-800 relative z-10">{{ profile.fullName || profile.username || 'Đang tải...' }}</h2>
            <p class="text-sm text-slate-500 mb-4 relative z-10">{{ profile.email || 'Chưa cập nhật email' }}</p>
            
            <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-8 border border-emerald-100 relative z-10">
              <i class="fa-solid fa-circle-check text-[8px]"></i> Độc giả hợp lệ
            </span>
            
            <div class="flex flex-col space-y-2 relative z-10">
              <button @click="activeTab = 'INFO'" :class="['px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left flex items-center gap-3', activeTab === 'INFO' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:-translate-y-0.5' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100']">
                <i class="fa-solid fa-user-pen text-lg w-5 text-center"></i> Hồ sơ của tôi
              </button>
              <button @click="activeTab = 'PASSWORD'" :class="['px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left flex items-center gap-3', activeTab === 'PASSWORD' ? 'bg-blue-600 text-white shadow-md shadow-blue-200 hover:-translate-y-0.5' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100']">
                <i class="fa-solid fa-shield-halved text-lg w-5 text-center"></i> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <div class="col-span-1 md:col-span-2">
          
          <transition name="fade" mode="out-in">
            
            <div v-if="activeTab === 'INFO'" key="info" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h3 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <i class="fa-regular fa-address-card text-blue-500"></i> Cập nhật thông tin
              </h3>
              
              <form @submit.prevent="updateProfile" class="space-y-6">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Họ và Tên</label>
                    <div class="relative">
                      <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="profile.fullName" type="text" placeholder="Chưa cập nhật..."
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" required />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Tên đăng nhập (Chỉ đọc)</label>
                    <div class="relative">
                      <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="profile.username" type="text" disabled title="Tên đăng nhập không thể thay đổi" 
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed outline-none font-medium" />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Địa chỉ Email</label>
                    <div class="relative">
                      <i class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="profile.email" type="email" placeholder="example@email.com"
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" required />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Số điện thoại</label>
                    <div class="relative">
                      <i class="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="profile.phone" type="tel" placeholder="0123 456 789"
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Ngày sinh</label>
                    <input v-model="profile.birthDate" type="date" 
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-bold text-slate-700 ml-1">Phái</label>
                    <select v-model="profile.gender" 
                      class="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
                      <option value="" disabled>Chưa chọn</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 ml-1">Địa chỉ thường trú</label>
                  <div class="relative">
                    <i class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input v-model="profile.address" type="text" placeholder="Nhập địa chỉ của bạn..."
                      class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div class="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" :disabled="isSavingInfo" class="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-70 flex items-center active:scale-95">
                    <i v-if="isSavingInfo" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    <i v-else class="fa-solid fa-floppy-disk mr-2"></i>
                    {{ isSavingInfo ? 'Đang lưu...' : 'Lưu thông tin' }}
                  </button>
                </div>
              </form>
            </div>

            <div v-else-if="activeTab === 'PASSWORD'" key="password" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h3 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <i class="fa-solid fa-shield-halved text-blue-500"></i> Bảo mật tài khoản
              </h3>
              
              <form @submit.prevent="updatePassword" class="space-y-6">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 ml-1">Mật khẩu hiện tại</label>
                  <div class="relative">
                    <i class="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input v-model="passwords.oldPassword" type="password" placeholder="Nhập mật khẩu cũ"
                      class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" required />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 ml-1">Mật khẩu mới</label>
                  <div class="relative">
                    <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input v-model="passwords.newPassword" type="password" placeholder="Ít nhất 6 ký tự"
                      class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" required minlength="6" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-bold text-slate-700 ml-1">Xác nhận mật khẩu mới</label>
                  <div class="relative">
                    <i class="fa-solid fa-circle-check absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input v-model="passwords.confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới"
                      class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" required />
                  </div>
                </div>

                <div class="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" :disabled="isSavingPassword" class="px-10 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-md shadow-slate-300 disabled:opacity-70 flex items-center active:scale-95">
                    <i v-if="isSavingPassword" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    <i v-else class="fa-solid fa-arrows-rotate mr-2"></i>
                    {{ isSavingPassword ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
                  </button>
                </div>
              </form>
            </div>

          </transition>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('INFO');

// Các biến Header (Đồng bộ)
const isLoggedIn = ref(true);

const profile = ref({ 
  username: '', 
  fullName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  address: ''
});
const isSavingInfo = ref(false);

const passwords = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const isSavingPassword = ref(false);

// ĐÃ FIX: Hàm computed an toàn lấy chữ cái đầu của tên
const userAvatar = computed(() => {
  if (profile.value.fullName) return profile.value.fullName.charAt(0).toUpperCase();
  if (profile.value.username) return profile.value.username.charAt(0).toUpperCase();
  return 'U';
});

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const fetchProfile = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    router.push('/login');
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`);
    const data = await res.json();
    if (data.success) {
      profile.value.username = data.data.username; 
      profile.value.fullName = data.data.fullName; 
      profile.value.email = data.data.email;
      profile.value.phone = data.data.phone || '';
      profile.value.address = data.data.address || '';
      profile.value.gender = data.data.gender || '';
      profile.value.birthDate = formatDateForInput(data.data.birthDate);
    }
  } catch (error) {
    console.error('Lỗi tải thông tin:', error);
  }
};

const updateProfile = async () => {
  isSavingInfo.value = true;
  try {
    const res = await fetch(`http://localhost:5000/api/users/${localStorage.getItem('userId')}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile.value)
    });
    const data = await res.json();
    if (data.success) {
      alert('Cập nhật hồ sơ thành công!');
      // Cập nhật lại tên trên LocalStorage để thanh Navbar các trang khác nhận ngay
      localStorage.setItem('username', profile.value.fullName.split(' ').pop()); 
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Lỗi kết nối đến máy chủ Backend');
  } finally {
    isSavingInfo.value = false;
  }
};

const updatePassword = async () => {
  if (passwords.value.newPassword !== passwords.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  isSavingPassword.value = true;
  try {
    const res = await fetch(`http://localhost:5000/api/users/${localStorage.getItem('userId')}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldPassword: passwords.value.oldPassword,
        newPassword: passwords.value.newPassword
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      logout();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Lỗi kết nối đến máy chủ Backend');
  } finally {
    isSavingPassword.value = false;
  }
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

html, body {
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
}

/* Hiệu ứng chuyển tab mượt mà */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>