<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth relative w-full overflow-x-hidden flex flex-col">
    
    <nav class="bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b border-slate-200 transition-all w-full shrink-0">
      <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
        
        <div class="flex items-center gap-10">
          <a @click="router.push('/')" class="flex items-center gap-3 cursor-pointer group">
            <div class="bg-orange-400 w-11 h-11 rounded-xl text-white flex items-center justify-center group-hover:rotate-12 transition-all shadow-lg shadow-orange-200">
              <i class="fa-solid fa-book-open-reader text-xl"></i>
            </div>
            <span class="font-black text-2xl tracking-tighter text-slate-800">THƯ VIỆN</span>
          </a>
          <div class="hidden md:flex items-center gap-8 font-bold text-sm">
            <a @click="router.push('/')" class="text-slate-500 hover:text-orange-500 transition-colors cursor-pointer">Trang chủ</a>
            <router-link to="/my-books" class="text-slate-500 hover:text-orange-500 transition-colors">Sách của tôi</router-link>
          </div>
        </div>

        <div class="flex items-center gap-4 relative">
          <template v-if="isLoggedIn">
            
            <div class="relative">
              <button @click="showNotifications = !showNotifications; isUserMenuOpen = false" class="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-orange-500 rounded-xl transition-all relative">
                <i class="fa-regular fa-bell text-xl"></i>
                <span v-if="displayNotifications.length > 0" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              
              <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                <div class="px-5 py-3 border-b border-slate-50 flex justify-between items-center">
                  <span class="font-black text-slate-700">Thông báo</span>
                  <button v-if="displayNotifications.length > 0" @click="markAllAsRead" class="text-[10px] text-red-500 hover:text-red-600 font-black uppercase transition-colors">
                    Đọc tất cả ({{ displayNotifications.length }})
                  </button>
                </div>
                
                <div class="max-h-[350px] overflow-y-auto custom-scroll">
                  <div v-if="displayNotifications.length === 0" class="px-4 py-10 text-center text-slate-400 text-sm font-medium italic">Bạn đã xem hết thông báo!</div>
                  
                  <div v-for="notif in displayNotifications" :key="notif.id" 
                       @click="handleNotifClick(notif)" 
                       class="px-5 py-4 cursor-pointer border-b border-slate-50 transition-colors flex gap-3 bg-red-50/30 hover:bg-red-50 relative group">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div class="flex-1">
                      <p class="text-sm font-bold flex items-center gap-2 text-red-600">
                        <span>{{ notif.icon }}</span> {{ notif.title }}
                      </p>
                      <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ notif.message }}</p>
                      <p v-if="notif.reason" class="text-[10px] font-bold text-red-500 mt-1"><i class="fa-solid fa-angle-right"></i> Lý do: {{ notif.reason }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="relative ml-1">
              <button 
                @click="isUserMenuOpen = !isUserMenuOpen; showNotifications = false"
                class="flex items-center gap-2 bg-orange-50 pl-1.5 pr-4 py-1.5 rounded-full transition-colors focus:outline-none border border-orange-100"
              >
                <div class="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  {{ displayFirstName.charAt(0) }}
                </div>
                <span class="text-sm font-bold text-orange-600 hidden md:block">{{ displayFirstName }}</span>
                <i class="fa-solid fa-chevron-down text-[10px] text-orange-400 ml-1 transition-transform" :class="{'rotate-180': isUserMenuOpen}"></i>
              </button>

              <div v-if="isUserMenuOpen" class="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-[fadeIn_0.2s_ease-out]">
                <button @click="logout" class="w-full flex items-center gap-3 text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors rounded-xl"><i class="fa-solid fa-power-off w-4"></i> Đăng xuất</button>
              </div>
            </div>
          </template>
        </div>

      </div>
    </nav>

    <main class="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 z-10 relative">
      
      <div class="mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 text-9xl text-slate-50 opacity-50 pointer-events-none"><i class="fa-solid fa-id-card-clip"></i></div>
        <div class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Tài khoản cá nhân</h1>
          <p class="text-slate-500 font-medium">Quản lý thông tin hồ sơ và bảo mật của bạn.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        
        <div class="col-span-1 space-y-6">
          <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-100 to-amber-50 opacity-50"></div>
            
            <div class="relative w-28 h-28 rounded-full bg-orange-400 flex items-center justify-center text-white font-black text-4xl mx-auto mb-4 border-4 border-white shadow-xl shadow-orange-200 z-10">
              {{ displayFirstName.charAt(0) }}
            </div>
            
            <h2 class="text-xl font-bold text-slate-500 relative z-10">{{ profile.fullName || profile.username || 'Đang tải...' }}</h2>
            <p class="text-sm text-slate-400 mb-4 relative z-10">{{ profile.email || 'Chưa cập nhật email' }}</p>
            
            <span v-if="isProfileComplete" class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-100 relative z-10">
              <i class="fa-solid fa-circle-check"></i> Độc giả hợp lệ
            </span>
            <span v-else class="inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-red-100 relative z-10">
              <i class="fa-solid fa-triangle-exclamation"></i> Hồ sơ chưa đầy đủ
            </span>
            
            <div class="flex flex-col space-y-2 relative z-10 mt-6">
              <button @click="activeTab = 'INFO'" :class="['px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left flex items-center gap-3', activeTab === 'INFO' ? 'bg-slate-900 text-white shadow-md hover:-translate-y-0.5' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100']">
                <i class="fa-solid fa-user-pen text-lg w-5 text-center"></i> Hồ sơ của tôi
              </button>
              <button @click="activeTab = 'PASSWORD'" :class="['px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left flex items-center gap-3', activeTab === 'PASSWORD' ? 'bg-slate-900 text-white shadow-md hover:-translate-y-0.5' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100']">
                <i class="fa-solid fa-shield-halved text-lg w-5 text-center"></i> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-2">
          
          <transition name="fade" mode="out-in">
            
            <div v-if="activeTab === 'INFO'" key="info" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <div class="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                <h3 class="text-xl font-black text-slate-800 flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center"><i class="fa-regular fa-address-card"></i></div>
                  Cập nhật thông tin
                </h3>
              </div>

              <form @submit.prevent="updateProfile" class="space-y-6">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Họ và Tên</label>
                    <div class="relative">
                      <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-orange-500"></i>
                      <input v-model="profile.fullName" type="text" placeholder="Chưa cập nhật..." @focus="$event.target.select()" 
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent bg-slate-50 border-slate-200 focus:ring-orange-400 text-slate-500 focus:text-slate-900" required />
                    </div>
                    <p v-if="isMissing(profile.fullName)" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng cập nhật Họ Tên</p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập (Chỉ đọc)</label>
                    <div class="relative opacity-60 cursor-not-allowed">
                      <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input v-model="profile.username" type="text" disabled title="Tên đăng nhập không thể thay đổi" 
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed outline-none font-medium" />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Địa chỉ Email</label>
                    <div class="relative">
                      <i class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-orange-500"></i>
                      <input v-model="profile.email" type="email" placeholder="Chưa cập nhật..." @focus="$event.target.select()" 
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent bg-slate-50 border-slate-200 focus:ring-orange-400 text-slate-500 focus:text-slate-900" required />
                    </div>
                    <p v-if="isMissing(profile.email)" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng cập nhật Email</p>
                  </div>

                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Số điện thoại</label>
                    <div class="relative">
                      <i class="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-orange-500"></i>
                      <input v-model="profile.phone" type="tel" placeholder="Chưa cập nhật..." @focus="$event.target.select()" 
                        class="w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent bg-slate-50 border-slate-200 focus:ring-orange-400 text-slate-500 focus:text-slate-900" />
                    </div>
                    <p v-if="isMissing(profile.phone)" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng cập nhật SĐT</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Ngày sinh</label>
                    <input v-model="profile.birthDate" type="date" 
                      class="w-full px-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold bg-slate-50 border-slate-200 focus:ring-orange-400 text-slate-500 focus:text-slate-900" />
                    <p v-if="!profile.birthDate" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng chọn Ngày sinh</p>
                  </div>

                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Phái</label>
                    <select v-model="profile.gender" 
                      :class="['w-full px-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold cursor-pointer appearance-none bg-slate-50 border-slate-200 focus:ring-orange-400', (!profile.gender || profile.gender === 'Khác') ? 'text-slate-400 font-medium' : 'text-slate-500 focus:text-slate-900']">
                      <option value="" disabled class="text-slate-400 font-medium">Chưa chọn phái...</option>
                      <option value="Nam" class="text-slate-900">Nam</option>
                      <option value="Nữ" class="text-slate-900">Nữ</option>
                      <option value="Khác" class="text-slate-900">Khác</option>
                    </select>
                    <p v-if="!profile.gender || profile.gender === 'Khác'" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng chọn Phái</p>
                  </div>
                </div>

                <div class="space-y-2 group">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-orange-500">Địa chỉ thường trú</label>
                  <div class="relative">
                    <i class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-orange-500"></i>
                    <input v-model="profile.address" type="text" placeholder="Chưa cập nhật..." @focus="$event.target.select()" 
                      class="w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all focus:bg-white focus:ring-2 focus:border-transparent font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent bg-slate-50 border-slate-200 focus:ring-orange-400 text-slate-500 focus:text-slate-900" />
                  </div>
                  <p v-if="isMissing(profile.address)" class="text-[10px] text-red-500 font-bold ml-1"><i class="fa-solid fa-asterisk"></i> Vui lòng cập nhật Địa chỉ</p>
                </div>

                <div class="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" :disabled="isSavingInfo" class="px-10 py-3.5 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-black transition-all shadow-lg shadow-orange-200 disabled:opacity-70 flex items-center active:scale-95 uppercase tracking-widest text-xs">
                    <i v-if="isSavingInfo" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    <i v-else class="fa-solid fa-floppy-disk mr-2"></i>
                    {{ isSavingInfo ? 'Đang lưu...' : 'Lưu thông tin' }}
                  </button>
                </div>
              </form>
            </div>

            <div v-else-if="activeTab === 'PASSWORD'" key="password" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
              <h3 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center"><i class="fa-solid fa-shield-halved"></i></div>
                Bảo mật tài khoản
              </h3>
              
              <form @submit.prevent="updatePassword" class="space-y-6">
                
                <div class="space-y-4">
                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-rose-500">Mật khẩu hiện tại</label>
                    <div class="relative">
                      <i class="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-rose-500"></i>
                      <input v-model="passwords.oldPassword" :type="showAllPasswords ? 'text' : 'password'" placeholder="Nhập mật khẩu cũ" @focus="$event.target.select()" class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-rose-400 focus:border-transparent text-slate-500 focus:text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent" required />
                    </div>
                  </div>

                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-rose-500">Mật khẩu mới</label>
                    <div class="relative">
                      <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-rose-500"></i>
                      <input v-model="passwords.newPassword" :type="showAllPasswords ? 'text' : 'password'" placeholder="Ít nhất 6 ký tự..." @focus="$event.target.select()" class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-rose-400 focus:border-transparent text-slate-500 focus:text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent" required minlength="6" />
                    </div>
                  </div>

                  <div class="space-y-2 group">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-rose-500">Xác nhận mật khẩu mới</label>
                    <div class="relative">
                      <i class="fa-solid fa-circle-check absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-rose-500"></i>
                      <input v-model="passwords.confirmPassword" :type="showAllPasswords ? 'text' : 'password'" placeholder="Nhập lại mật khẩu mới..." @focus="$event.target.select()" class="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-rose-400 focus:border-transparent text-slate-500 focus:text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:placeholder-transparent" required />
                    </div>
                  </div>
                </div>

                <label class="flex items-center gap-3 cursor-pointer select-none mt-2 w-fit group">
                   <div class="relative w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center transition-colors group-hover:border-rose-400" :class="showAllPasswords ? 'bg-rose-500 border-rose-500' : 'bg-white'">
                      <i v-if="showAllPasswords" class="fa-solid fa-check text-[10px] text-white"></i>
                      <input type="checkbox" v-model="showAllPasswords" class="hidden" />
                   </div>
                   <span class="text-sm font-bold text-slate-500 transition-colors group-hover:text-rose-500">Hiển thị các mật khẩu</span>
                </label>

                <div class="pt-6 border-t border-slate-100 flex justify-end">
                  <button type="submit" :disabled="isSavingPassword" class="px-10 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl font-black transition-all shadow-lg shadow-slate-300 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-70 flex items-center">
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

// Biến duy nhất quản lý hiện/ẩn mật khẩu
const showAllPasswords = ref(false);

const isLoggedIn = ref(true);
const isUserMenuOpen = ref(false);
const showNotifications = ref(false);

const profile = ref({ username: '', fullName: '', email: '', phone: '', birthDate: '', gender: '', address: '' });
const isSavingInfo = ref(false);

const passwords = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const isSavingPassword = ref(false);

const books = ref([]); 
const myLoans = ref([]);

// 👉 CẬP NHẬT: Thêm ref readNotifIds để sửa lỗi thông báo
const readNotifIds = ref(JSON.parse(localStorage.getItem('readNotifs') || '[]'));

const displayFirstName = computed(() => {
  const name = profile.value.fullName || profile.value.username || 'User';
  return name.trim().split(' ').pop();
});

// KIỂM TRA TRƯỜNG THÔNG TIN CÓ BỊ TRỐNG KHÔNG
const isMissing = (value) => {
  if (!value) return true;
  if (typeof value === 'string' && (value.trim() === '' || value.toLowerCase() === 'chưa cập nhật')) return true;
  return false;
};

// KIỂM TRA TOÀN BỘ HỒ SƠ ĐÃ ĐẦY ĐỦ CHƯA (ĐIỀU KIỆN MƯỢN SÁCH)
const isProfileComplete = computed(() => {
  return !isMissing(profile.value.fullName) &&
         !isMissing(profile.value.email) &&
         !isMissing(profile.value.phone) &&
         !isMissing(profile.value.address) &&
         profile.value.birthDate &&
         (profile.value.gender && profile.value.gender !== 'Khác');
});

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const fetchBooks = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/books');
    const data = await res.json();
    if (data.success) books.value = data.data;
  } catch (error) { console.error(error); }
};

const fetchMyLoans = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
  try {
    const res = await fetch(`http://localhost:5000/api/loans/user/${userId}`);
    const data = await res.json();
    if (data.success) myLoans.value = data.data;
  } catch (error) { console.error(error); }
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
      profile.value.fullName = data.data.fullName || ''; 
      profile.value.email = data.data.email || '';
      profile.value.phone = data.data.phone?.trim() || '';
      profile.value.address = data.data.address?.trim() || '';
      profile.value.gender = data.data.gender || '';
      profile.value.birthDate = formatDateForInput(data.data.birthDate);
    }
  } catch (error) {
    console.error('Lỗi tải thông tin:', error);
  }
};

const getBookForNotification = (loan) => {
  if (loan.thongTinSach) return loan.thongTinSach;
  const bookIdStr = loan.bookId?._id || loan.bookId || loan.MaSach;
  const foundBook = books.value.find(b => b._id === bookIdStr || b.maSach === bookIdStr);
  return foundBook || { _id: bookIdStr };
};

// 1. TẤT CẢ THÔNG BÁO
const allNotifications = computed(() => {
  const notifs = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  myLoans.value.forEach(loan => {
    if (loan.status === 'PENDING') return;

    const bookObj = getBookForNotification(loan);
    const bookTitle = bookObj.title || bookObj.TenSach || 'Sách';
    const notifId = loan._id + '_' + loan.status; 
    let notif = null;
    
    if (loan.status === 'APPROVED') {
      const dueDate = new Date(loan.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 0) {
        notif = { id: notifId, targetTab: 'BORROWING', icon: '⚠️', title: 'Quá hạn trả sách', message: `Bạn đã quá hạn trả '${bookTitle}'.`};
      } else if (daysDiff <= 2) {
        const dayText = daysDiff === 0 ? 'hôm nay' : daysDiff === 1 ? 'ngày mai' : '2 ngày nữa';
        notif = { id: notifId, targetTab: 'BORROWING', icon: '⏰', title: 'Nhắc hạn trả', message: `'${bookTitle}' đến hạn ${dayText}.`};
      } else {
        notif = { id: notifId, targetTab: 'BORROWING', icon: '✅', title: 'Yêu cầu được duyệt', message: `Yêu cầu mượn '${bookTitle}' đã duyệt.`};
      }
    } else if (loan.status === 'REJECTED') {
      notif = { id: notifId, targetTab: 'HISTORY', icon: '❌', title: 'Bị từ chối', message: `Yêu cầu mượn '${bookTitle}' đã bị hủy.`, reason: loan.rejectReason };
    } else if (loan.status === 'COMPLETED') {
      notif = { id: notifId, targetTab: 'HISTORY', icon: '🎉', title: 'Đã trả xong', message: `Đã hoàn tất trả '${bookTitle}'.`};
    }

    if (notif) notifs.push(notif);
  });
  
  return notifs.reverse();
});

// 2. LỌC THÔNG BÁO CHƯA ĐỌC
const displayNotifications = computed(() => {
  return allNotifications.value.filter(n => !readNotifIds.value.includes(n.id));
});

// Xử lý đọc tất cả
const markAllAsRead = () => {
  const allIds = allNotifications.value.map(n => n.id);
  localStorage.setItem('readNotifs', JSON.stringify(allIds));
  readNotifIds.value = allIds; // Vue tự cập nhật giao diện
};

// Xử lý Click thông báo
const handleNotifClick = (notif) => {
  const updatedIds = [...readNotifIds.value, notif.id];
  localStorage.setItem('readNotifs', JSON.stringify(updatedIds));
  readNotifIds.value = updatedIds; // Vue tự cập nhật giao diện
  
  showNotifications.value = false;
  router.push({ path: '/my-books', query: { tab: notif.targetTab } });
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
      window.location.reload();
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
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
  fetchProfile();
  fetchBooks();
  fetchMyLoans();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

html {
  overflow-y: scroll;
  scrollbar-gutter: stable;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  scroll-behavior: smooth;
}

.min-h-screen {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

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

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>