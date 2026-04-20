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
            <router-link to="/my-books" class="text-orange-500 border-b-2 border-orange-500 pb-1">Sách của tôi</router-link>
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
                class="flex items-center gap-2 bg-slate-100 pl-1.5 pr-4 py-1.5 rounded-full hover:bg-slate-200 transition-colors focus:outline-none"
              >
                <div class="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  {{ displayFirstName.charAt(0) }}
                </div>
                <span class="text-sm font-bold text-slate-700 hidden md:block">{{ displayFirstName }}</span>
                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-1 transition-transform" :class="{'rotate-180': isUserMenuOpen}"></i>
              </button>

              <div v-if="isUserMenuOpen" class="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                <router-link to="/profile" class="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-bold transition-colors"><i class="fa-regular fa-user w-4"></i> Hồ sơ cá nhân</router-link>
                <div class="h-px bg-slate-100 my-1"></div>
                <button @click="logout" class="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors"><i class="fa-solid fa-power-off w-4"></i> Đăng xuất</button>
              </div>
            </div>
          </template>
        </div>

      </div>
    </nav>

    <main class="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 z-10 relative">
      
      <div class="mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 text-9xl text-slate-50 opacity-50 pointer-events-none"><i class="fa-solid fa-book-bookmark"></i></div>
        <div class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Tủ sách của <span class="text-orange-400">{{ displayFirstName }}</span></h1>
          <p class="text-slate-500 font-medium">Nơi lưu giữ hành trình tri thức và quản lý những cuốn sách bạn đang theo dõi.</p>
        </div>
        <button @click="router.push('/')" class="relative z-10 px-8 py-3.5 bg-orange-400 text-white font-black rounded-xl hover:bg-orange-500 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 w-max active:scale-95">
          <i class="fa-solid fa-plus"></i> Mượn thêm sách
        </button>
      </div>

      <div class="flex space-x-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-max max-w-full overflow-x-auto scrollbar-hide border border-slate-200">
        <button @click="activeTab = 'BORROWING'" :class="['px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2', activeTab === 'BORROWING' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
          <i class="fa-solid fa-book-open-reader"></i> Đang mượn <span class="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] ml-1">{{ borrowingList.length }}</span>
        </button>
        <button @click="activeTab = 'PENDING'" :class="['px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2', activeTab === 'PENDING' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
          <i class="fa-solid fa-hourglass-half"></i> Chờ duyệt <span class="bg-slate-100 px-2 py-0.5 rounded-md text-[10px] ml-1">{{ pendingList.length }}</span>
        </button>
        <button @click="activeTab = 'HISTORY'" :class="['px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap flex items-center gap-2', activeTab === 'HISTORY' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
          <i class="fa-solid fa-clock-rotate-left"></i> Lịch sử
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl text-orange-400 mb-4"></i>
        <p class="text-slate-400 font-bold text-lg animate-pulse">Đang tải dữ liệu tủ sách...</p>
      </div>
      
      <div v-else-if="currentList.length === 0" class="bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 text-center shadow-sm">
        <div class="text-6xl mb-4 text-slate-200"><i class="fa-solid fa-box-open"></i></div>
        <h3 class="text-xl font-black text-slate-700">Tủ sách trống</h3>
        <p class="text-slate-400 mt-2 font-medium mb-6">Bạn chưa có cuốn sách nào trong danh mục này.</p>
        <button @click="router.push('/')" class="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-400 shadow-xl transition-all">Khám phá sách ngay</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-out]">
        <div v-for="loan in currentList" :key="loan._id" :class="['rounded-[2rem] p-6 shadow-sm border hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group', (loan.status === 'APPROVED' && loan.soNgayTre > 0) ? 'bg-red-50/30 border-red-200' : 'bg-white border-slate-100']">
          
          <div class="flex gap-5 items-start mb-4">
            <div class="w-24 h-36 bg-slate-100 rounded-xl overflow-hidden shrink-0 shadow-md group-hover:shadow-lg transition-all relative cursor-pointer" @click="router.push(`/book/${getBook(loan)._id}`)">
              <img v-if="getBook(loan).image" :src="'http://localhost:5000/uploads/' + getBook(loan).image" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-300 font-black text-4xl bg-slate-50">{{ getBook(loan).title?.charAt(0) || '?' }}</div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="mb-3">
                <span v-if="loan.status === 'PENDING'" class="bg-orange-100 text-orange-600 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-orange-200">Đang chờ duyệt</span>
                <span v-else-if="loan.status === 'APPROVED' && loan.soNgayTre === 0" class="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-emerald-200">Đang mượn</span>
                <span v-else-if="loan.status === 'APPROVED' && loan.soNgayTre > 0" class="bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm shadow-red-200 animate-pulse">Quá hạn</span>
                
                <span v-else-if="loan.status === 'COMPLETED'" class="bg-slate-100 text-slate-600 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-slate-200">Đã trả sách</span>
                <span v-else-if="loan.status === 'REJECTED'" class="bg-red-100 text-red-600 text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-red-200">Bị từ chối</span>
                <span v-else-if="loan.status === 'LOST'" class="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm">Đã báo mất</span>
                <span v-else-if="loan.status === 'RESOLVED'" class="bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm">Đã giải quyết</span>
              </div>

              <h3 class="font-black text-slate-900 text-lg leading-snug line-clamp-2 mb-1 cursor-pointer group-hover:text-orange-500 transition-colors" :title="getBook(loan).title" @click="router.push(`/book/${getBook(loan)._id}`)">{{ getBook(loan).title || 'Sách đã bị xóa' }}</h3>
              <p class="text-xs text-slate-500 font-bold mb-4"><i class="fa-solid fa-feather-pointed mr-1 text-[10px]"></i> {{ getBook(loan).author || 'Không rõ tác giả' }}</p>
              
              <div class="space-y-2">
                <p class="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <i class="fa-regular fa-calendar w-3"></i> Ngày mượn: <span class="text-slate-700">{{ formatDate(loan.createdAt) }}</span>
                </p>
                <p :class="['text-xs font-bold flex items-center gap-2', (loan.status === 'APPROVED' && loan.soNgayTre > 0) ? 'text-red-500' : 'text-slate-400']">
                  <i class="fa-regular fa-calendar-check w-3"></i> Hẹn trả: <span :class="(loan.status === 'APPROVED' && loan.soNgayTre > 0) ? 'text-red-600 font-black' : 'text-slate-700'">{{ formatDate(loan.dueDate) }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="loan.status === 'REJECTED' && loan.rejectReason" class="mt-2 text-[11px] font-black text-red-600 flex items-start bg-red-50 p-3 rounded-xl border border-red-100">
            <i class="fa-solid fa-circle-info mr-2 text-base mt-0.5"></i>
            <div>
               <span class="block mb-0.5 uppercase tracking-widest text-[9px] text-red-400">Lý do từ chối:</span>
               {{ loan.rejectReason }}
            </div>
          </div>

          <div v-else-if="loan.status === 'APPROVED' && loan.soNgayTre > 0" class="mt-2 text-[11px] font-black text-red-600 flex flex-col bg-red-100 p-3.5 rounded-xl border border-red-200 gap-2 shadow-inner">
            <div class="flex items-center text-sm">
              <i class="fa-solid fa-triangle-exclamation mr-2 text-lg animate-bounce"></i> 
              <span class="uppercase tracking-widest">CẢNH BÁO: BẠN ĐÃ TRỄ {{ loan.soNgayTre }} NGÀY</span>
            </div>
            <div class="flex items-center justify-between border-t border-red-300/50 pt-2.5 mt-1">
              <span class="text-xs uppercase tracking-widest text-red-500">Phí phạt tạm tính:</span>
              <span class="text-base font-black text-red-700">{{ (loan.tienPhat || 0).toLocaleString('vi-VN') }}đ</span>
            </div>
          </div>
          
          <div v-else-if="loan.status === 'APPROVED'" class="mt-2 text-[11px] font-black text-emerald-600 flex items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <i class="fa-regular fa-face-smile mr-2 text-base"></i> Chúc bạn đọc sách vui vẻ.
          </div>

          <div v-else-if="loan.status === 'LOST'" class="mt-2 text-[11px] font-black text-amber-700 flex flex-col bg-amber-50 p-3 rounded-xl border border-amber-200 gap-2">
            <div class="flex items-start">
              <i class="fa-solid fa-circle-exclamation mr-2 text-base mt-0.5"></i>
              <span>Vui lòng đến thư viện để nộp phạt đền bù cho cuốn sách này.</span>
            </div>
            <div class="flex items-center justify-between border-t border-amber-200/50 pt-2 mt-1">
              <span class="text-[10px] uppercase tracking-widest text-amber-600">Phí đền bù sách:</span>
              <span class="text-sm font-black">{{ (loan.tienPhat || 0).toLocaleString('vi-VN') }}đ</span>
            </div>
          </div>

          <div v-if="loan.status === 'PENDING' || loan.status === 'APPROVED'" class="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button v-if="loan.status === 'PENDING'" @click="cancelLoan(loan._id)" class="flex-1 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black transition-colors flex justify-center items-center gap-2 uppercase tracking-widest">
              <i class="fa-solid fa-xmark"></i> Hủy yêu cầu
            </button>
            <button v-if="loan.status === 'APPROVED'" @click="reportLostBook(loan._id)" class="flex-1 py-3 bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black transition-colors flex justify-center items-center gap-2 uppercase tracking-widest">
              <i class="fa-solid fa-circle-exclamation"></i> Báo mất sách
            </button>
          </div>

        </div>
      </div>
    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-8 right-6 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-2xl hover:bg-orange-400 hover:-translate-y-1 transition-all duration-300 z-50"
      :class="showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>

    <footer class="bg-[#1E1E1E] pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-lg bg-orange-400 flex items-center justify-center">
                <i class="fa-solid fa-book-open-reader text-white text-lg"></i>
              </div>
              <h5 class="text-2xl font-black text-white tracking-tight">THƯ VIỆN SÁCH</h5>
            </div>
            <p class="text-base font-medium italic leading-relaxed max-w-md text-slate-300">
              "Sách không chỉ giúp ta hiểu thêm về thế giới, mà còn giúp ta hiểu rõ hơn về chính mình."
            </p>
          </div>
          <div>
            <h5 class="text-white font-bold mb-5 uppercase text-xs tracking-widest">Liên hệ</h5>
            <ul class="space-y-3 text-sm text-slate-300 font-medium">
              <li class="flex gap-3 group cursor-default">
                <i class="fa-solid fa-location-dot text-orange-400 mt-1"></i> 
                <span class="group-hover:text-orange-400 transition-colors">Đại học Cần Thơ</span>
              </li>
              <li class="flex gap-3 group cursor-default">
                <i class="fa-solid fa-phone text-orange-400 mt-0.5"></i> 
                <span class="group-hover:text-orange-400 transition-colors">0774 400 275</span>
              </li>
              <li class="flex gap-3">
                <i class="fa-solid fa-envelope text-orange-400 mt-0.5"></i> 
                <a href="mailto:thanhdo@thuvien.com" class="hover:text-orange-400 transition-colors">thanhdo@thuvien.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-bold mb-5 uppercase text-xs tracking-widest">Giờ mở cửa</h5>
            <div class="space-y-3 text-sm text-slate-300 font-medium">
              <div class="flex justify-between border-b border-[#333333] pb-2">
                <span>Thứ 2 - Thứ 6:</span><span class="text-white">8:00 - 20:00</span>
              </div>
              <div class="flex justify-between">
                <span>Thứ 7 - CN:</span><span class="text-white">9:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-6 border-t border-[#333333] text-center text-xs font-bold text-slate-400">
          © 2026 THƯ VIỆN ONLINE · DESIGNED BY <span class="text-orange-400">THANH DO</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isLoggedIn = ref(false);
const fullName = ref('');
const username = ref('');
const showNotifications = ref(false);
const showBackToTop = ref(false);
const isUserMenuOpen = ref(false);

const books = ref([]); 
const myLoans = ref([]);
const activeTab = ref('BORROWING');
const isLoading = ref(true);

const readNotifIds = ref(JSON.parse(localStorage.getItem('readNotifs') || '[]'));

const displayFirstName = computed(() => {
  const name = fullName.value || username.value || 'User';
  return name.trim().split(' ').pop();
});

const fetchBooks = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/books');
    const data = await res.json();
    if (data.success) {
      books.value = data.data;
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách sách:", error);
  }
};

const fetchMyLoans = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    router.push('/login');
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/api/loans/user/${userId}`);
    const data = await res.json();
    if (data.success) {
      myLoans.value = data.data;
    }
  } catch (error) {
    console.error("Lỗi khi tải lịch sử:", error);
  }
};

const getBook = (loan) => {
  if (loan.thongTinSach && loan.thongTinSach.TenSach) return {
      _id: loan.thongTinSach._id,
      title: loan.thongTinSach.TenSach,
      image: loan.thongTinSach.HinhAnh,
      author: loan.thongTinSach.NguonGocTacGia
  };
  
  if (loan.bookId && loan.bookId.title) return loan.bookId;

  const possibleIds = [
    loan.MaSach, 
    loan.bookId?._id, 
    typeof loan.bookId === 'string' ? loan.bookId : null
  ].filter(Boolean);

  for (const id of possibleIds) {
    const foundBook = books.value.find(b => b._id === id || b.maSach === id || b.MaSach === id);
    if (foundBook) return foundBook;
  }

  return { title: 'Đang xử lý / Lỗi dữ liệu', author: 'N/A' }; 
};

// 1. TẤT CẢ THÔNG BÁO
const allNotifications = computed(() => {
  const notifs = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  myLoans.value.forEach(loan => {
    if (loan.status === 'PENDING') return;

    const bookObj = getBook(loan);
    const bookTitle = bookObj.title || 'Sách';
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
    } else if (loan.status === 'LOST') {
      notif = { id: notifId, targetTab: 'HISTORY', icon: '💸', title: 'Báo mất sách', message: `Hệ thống đã ghi nhận mất sách '${bookTitle}'.`};
    } else if (loan.status === 'RESOLVED') {
      notif = { id: notifId, targetTab: 'HISTORY', icon: '🤝', title: 'Đã giải quyết', message: `Đã xử lý xong phiếu đền bù '${bookTitle}'.`};
    }

    if (notif) notifs.push(notif);
  });
  
  return notifs.reverse();
});

const displayNotifications = computed(() => {
  return allNotifications.value.filter(n => !readNotifIds.value.includes(n.id));
});

const markAllAsRead = () => {
  const allIds = allNotifications.value.map(n => n.id);
  localStorage.setItem('readNotifs', JSON.stringify(allIds));
  readNotifIds.value = allIds; 
};

const handleNotifClick = (notif) => {
  const updatedIds = [...readNotifIds.value, notif.id];
  localStorage.setItem('readNotifs', JSON.stringify(updatedIds));
  readNotifIds.value = updatedIds; 
  
  showNotifications.value = false;
  activeTab.value = notif.targetTab; 
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// HÀM HỦY ĐƠN MƯỢN
const cancelLoan = async (loanId) => {
  if(!confirm("Bạn có chắc chắn muốn hủy yêu cầu mượn cuốn sách này?")) return;
  try {
    const response = await fetch(`http://localhost:5000/api/loans/${loanId}`, { method: 'DELETE' });
    const data = await response.json();
    if(data.success) {
      alert("Đã hủy yêu cầu mượn sách thành công!");
      fetchMyLoans(); 
    } else { alert(data.message); }
  } catch (error) { alert("Lỗi khi hủy!"); }
};

// BÁO MẤT SÁCH
const reportLostBook = async (loanId) => {
  if(!confirm("Xác nhận báo mất sách? Bạn sẽ phải đến thư viện để nộp phí đền bù.")) return;
  try {
    const response = await fetch(`http://localhost:5000/api/loans/${loanId}/report-lost`, { method: 'PUT' });
    const data = await response.json();
    if(data.success) {
      alert(`Báo mất thành công! Vui lòng nộp phạt: ${data.tienPhat.toLocaleString('vi-VN')}đ tại quầy thư viện.`);
      activeTab.value = 'HISTORY'; // Chuyển sang tab Lịch sử
      fetchMyLoans(); 
    } else { alert(data.message); }
  } catch (error) { alert("Lỗi khi kết nối với máy chủ!"); }
};

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  router.push('/login');
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 100; 
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn.value) {
    isLoading.value = true;
    
    const storedUserId = localStorage.getItem('userId');
    try {
        const res = await fetch(`http://localhost:5000/api/users/${storedUserId}`);
        const data = await res.json();
        if(data.success) {
             fullName.value = data.data.fullName;
             username.value = data.data.username;
        } else {
             username.value = localStorage.getItem('username') || 'User';
        }
    } catch(e) {
        username.value = localStorage.getItem('username') || 'User';
    }

    await Promise.all([fetchBooks(), fetchMyLoans()]);
    isLoading.value = false;
  } else {
    router.push('/login');
  }
  
  window.addEventListener('scroll', handleScroll);

  if (route.query.tab) {
    activeTab.value = route.query.tab; 
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Bổ sung các trạng thái mới vào Tab Lịch sử
const pendingList = computed(() => myLoans.value.filter(loan => loan.status === 'PENDING'));
const borrowingList = computed(() => myLoans.value.filter(loan => loan.status === 'APPROVED'));
const historyList = computed(() => myLoans.value.filter(loan => ['COMPLETED', 'REJECTED', 'LOST', 'RESOLVED'].includes(loan.status)));

const currentList = computed(() => {
  if (activeTab.value === 'BORROWING') return borrowingList.value;
  if (activeTab.value === 'PENDING') return pendingList.value;
  return historyList.value;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
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

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>