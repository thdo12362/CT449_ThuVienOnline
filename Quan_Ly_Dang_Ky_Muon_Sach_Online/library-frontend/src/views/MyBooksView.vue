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
              <template v-if="isLoggedIn">
                <router-link to="/my-books" class="text-white font-bold hover:text-white transition-all duration-200 active:scale-95 inline-block">My Library</router-link>
              </template>
            </div>
          </div>

          <div class="flex items-center gap-4 relative">
            <template v-if="isLoggedIn">
              
              <div class="relative">
                <button @click="showNotifications = !showNotifications; isUserMenuOpen = false" class="p-2 text-blue-100 hover:text-white transition-colors relative focus:outline-none mt-1">
                  <i class="fa-regular fa-bell text-xl"></i>
                  <span v-if="userNotifications.length > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600 animate-pulse"></span>
                </button>
                <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <div class="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                    <span class="font-bold text-slate-700">Thông báo</span>
                    <span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{{ userNotifications.length }}</span>
                  </div>
                  <div class="max-h-[350px] overflow-y-auto">
                    <div v-if="userNotifications.length === 0" class="px-4 py-8 text-center text-slate-400 text-sm">Bạn không có thông báo nào.</div>
                    <div v-for="(notif, index) in userNotifications" :key="index" :class="['px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors', notif.bgClass]" @click="showNotifications = false">
                      <p :class="['text-sm font-semibold flex items-center gap-2', notif.titleClass]">
                        <span>{{ notif.icon }}</span> {{ notif.title }}
                      </p>
                      <p class="text-xs text-slate-500 mt-1 leading-snug">{{ notif.message }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative">
                <button @click="isUserMenuOpen = !isUserMenuOpen; showNotifications = false" class="flex items-center gap-2 hover:bg-blue-700 p-1 pr-3 rounded-full transition-colors focus:outline-none border border-transparent hover:border-blue-500">
                  <div class="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-sm shadow-sm">{{ username?.charAt(0)?.toUpperCase() || 'U' }}</div>
                  <span class="text-sm font-bold text-white hidden md:block">{{ username }}</span>
                  <i class="fa-solid fa-chevron-down text-xs text-blue-200 transition-transform" :class="{'rotate-180': isUserMenuOpen}"></i>
                </button>

                <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <router-link to="/profile" class="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors">
                    <i class="fa-regular fa-user me-2 w-4 text-center"></i> Hồ sơ cá nhân
                  </router-link>
                  <hr class="my-2 border-slate-100">
                  <button @click="logout" class="w-full text-left block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">
                    <i class="fa-solid fa-arrow-right-from-bracket me-2 w-4 text-center"></i> Đăng xuất
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">
      
      <div class="mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Quản lý sách của tôi</h1>
          <p class="text-slate-500 mt-2 font-medium">Theo dõi tiến độ mượn, trả và lịch sử đọc sách của bạn.</p>
        </div>
        <button @click="router.push('/')" class="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 w-max">
          <i class="fa-solid fa-plus"></i> Mượn thêm sách
        </button>
      </div>

      <div class="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button @click="activeTab = 'BORROWING'" :class="['px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-sm', activeTab === 'BORROWING' ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200']">
          <i class="fa-solid fa-book-open-reader"></i> Đang mượn ({{ borrowingList.length }})
        </button>
        <button @click="activeTab = 'PENDING'" :class="['px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-sm', activeTab === 'PENDING' ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200']">
          <i class="fa-solid fa-hourglass-half"></i> Chờ duyệt ({{ pendingList.length }})
        </button>
        <button @click="activeTab = 'HISTORY'" :class="['px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 border shadow-sm', activeTab === 'HISTORY' ? 'bg-slate-800 text-white border-slate-800 shadow-slate-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200']">
          <i class="fa-solid fa-clock-rotate-left"></i> Lịch sử
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-20 text-slate-400 font-bold text-lg"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</div>
      
      <div v-else-if="currentList.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center shadow-sm">
        <div class="text-6xl mb-4 text-slate-300"><i class="fa-solid fa-box-open"></i></div>
        <h3 class="text-xl font-bold text-slate-700">Danh sách trống</h3>
        <p class="text-slate-500 mt-2 font-medium">Bạn chưa có cuốn sách nào trong mục này.</p>
        <button @click="router.push('/')" class="mt-6 bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1">Khám phá sách ngay</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="loan in currentList" :key="loan._id" :class="['bg-white rounded-3xl p-6 shadow-sm border hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between', (loan.status === 'APPROVED' && isOverdue(loan.dueDate)) ? 'border-rose-200 hover:shadow-rose-100/50' : 'border-slate-100 hover:shadow-blue-100/50']">
          
          <div class="flex gap-5 items-start mb-4">
            <div class="w-24 h-36 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm relative cursor-pointer" @click="router.push(`/book/${loan.bookId?._id}`)">
              <img v-if="loan.bookId?.image" :src="'http://localhost:5000/uploads/' + loan.bookId.image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center text-blue-300 font-bold text-3xl bg-blue-50">{{ loan.bookId?.title?.charAt(0) || '?' }}</div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="mb-3">
                <span v-if="loan.status === 'PENDING'" class="bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Đang chờ duyệt</span>
                <span v-else-if="loan.status === 'APPROVED'" class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Đang giữ sách</span>
                <span v-else-if="loan.status === 'COMPLETED'" class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Đã trả xong</span>
                <span v-else-if="loan.status === 'REJECTED'" class="bg-rose-100 text-rose-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">Bị từ chối</span>
              </div>

              <h3 class="font-bold text-slate-900 text-lg leading-tight line-clamp-2 mb-1 cursor-pointer hover:text-blue-600 transition-colors" :title="loan.bookId?.title" @click="router.push(`/book/${loan.bookId?._id}`)">{{ loan.bookId?.title || 'Sách đã bị xóa' }}</h3>
              <p class="text-xs text-slate-500 font-medium"><i class="fa-solid fa-pen-nib mr-1"></i> {{ loan.bookId?.author || 'Không rõ' }}</p>
              
              <div class="text-sm space-y-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p class="flex justify-between items-center text-slate-500 font-medium">
                  <span class="text-xs"><i class="fa-regular fa-calendar mr-1"></i> Gửi đơn:</span> 
                  <span class="text-slate-700">{{ formatDate(loan.createdAt) }}</span>
                </p>
                <p :class="['flex justify-between items-center font-medium', (loan.status === 'APPROVED' && isOverdue(loan.dueDate)) ? 'text-rose-500 font-bold' : 'text-slate-500']">
                  <span class="text-xs"><i class="fa-regular fa-calendar-check mr-1"></i> Hẹn trả:</span> 
                  <span :class="(loan.status === 'APPROVED' && isOverdue(loan.dueDate)) ? 'text-rose-600' : 'text-slate-700'">{{ formatDate(loan.dueDate) }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="loan.status === 'APPROVED' && isOverdue(loan.dueDate)" class="mt-2 text-xs font-bold text-rose-600 flex items-center bg-rose-50 p-3 rounded-xl border border-rose-200">
            <i class="fa-solid fa-triangle-exclamation mr-2 text-lg"></i> Sách đã quá hạn! Vui lòng hoàn trả ngay để tránh bị phạt.
          </div>
          <div v-else-if="loan.status === 'APPROVED'" class="mt-2 text-xs font-bold text-blue-600 flex items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
            <i class="fa-regular fa-face-smile mr-2 text-lg"></i> Chúc bạn đọc sách vui vẻ. Nhớ trả đúng hạn nhé!
          </div>

          <div v-if="loan.status === 'PENDING'" class="mt-4 pt-4 border-t border-slate-100">
            <button @click="cancelLoan(loan._id)" class="w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2">
              <i class="fa-solid fa-xmark"></i> Hủy yêu cầu
            </button>
          </div>

        </div>
      </div>
    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 z-50 focus:outline-none"
      :class="showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>

    <footer class="bg-slate-950 text-slate-300 pt-16 pb-8 mt-12 border-t border-slate-800">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <i class="fa-solid fa-book-open-reader text-white text-lg"></i>
              </div>
              <h5 class="text-2xl font-bold text-white tracking-tight">Thư Viện Sách</h5>
            </div>
            <p class="text-sm leading-relaxed max-w-md text-slate-400">
              Nơi kết nối tri thức và đam mê đọc sách. Thư viện trực tuyến hiện đại, giúp bạn tìm kiếm, quản lý và khám phá kho sách dễ dàng hơn bao giờ hết.
            </p>
          </div>
          <div>
            <h5 class="text-white font-semibold mb-5 uppercase text-sm tracking-wider">Liên hệ</h5>
            <ul class="space-y-4 text-sm text-slate-400">
              <li class="flex gap-3">
                <i class="fa-solid fa-location-dot text-blue-500 mt-1"></i>
                <span>Khu II đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành phố Cần Thơ</span>
              </li>
              <li class="flex gap-3">
                <i class="fa-solid fa-phone text-blue-500"></i>
                <span>0774 400 275</span>
              </li>
              <li class="flex gap-3">
                <i class="fa-solid fa-envelope text-blue-500"></i>
                <a href="mailto:thanhdo@thuvien.com" class="hover:text-white transition">thanhdo@thuvien.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-semibold mb-5 uppercase text-sm tracking-wider">Giờ mở cửa</h5>
            <div class="space-y-4 text-sm text-slate-400">
              <div class="flex gap-3">
                <i class="fa-regular fa-clock text-blue-500"></i>
                <span><span class="text-white font-medium">T2 - T6:</span> 8:00 - 20:00</span>
              </div>
              <div class="flex gap-3">
                <i class="fa-solid fa-calendar-day text-blue-500"></i>
                <span><span class="text-white font-medium">T7 - CN:</span> 9:00 - 18:00</span>
              </div>
              <div class="mt-6 p-3 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-500">
                Hỗ trợ online 24/7 qua email
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          © 2026 Thư Viện Sách Online · All rights reserved · 
          <span class="text-blue-500 font-medium">Thanh Do</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dữ liệu User & Header
const isLoggedIn = ref(false);
const username = ref('');
const showNotifications = ref(false);
const showBackToTop = ref(false);
const isUserMenuOpen = ref(false);

// Dữ liệu My Books
const myLoans = ref([]);
const activeTab = ref('BORROWING');
const isLoading = ref(true);

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
  } finally {
    isLoading.value = false;
  }
};

const userNotifications = computed(() => {
  const notifs = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  myLoans.value.forEach(loan => {
    const bookTitle = loan.bookId?.title || 'Sách';
    
    if (loan.status === 'APPROVED') {
      const dueDate = new Date(loan.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 0) {
        notifs.push({ 
          icon: '⚠️', title: 'Quá hạn trả sách', 
          message: `Bạn đã quá hạn trả sách '${bookTitle}'. Vui lòng hoàn trả ngay!`, 
          titleClass: 'text-red-600', bgClass: 'hover:bg-red-50 bg-red-50/30' 
        });
      } else if (daysDiff <= 2) {
        const dayText = daysDiff === 0 ? 'hôm nay' : daysDiff === 1 ? 'ngày mai' : '2 ngày nữa';
        notifs.push({ 
          icon: '⏰', title: 'Nhắc hạn trả sách', 
          message: `Sách '${bookTitle}' sẽ đến hạn vào ${dayText}.`, 
          titleClass: 'text-orange-500', bgClass: 'hover:bg-orange-50 bg-orange-50/30' 
        });
      } else {
        notifs.push({ 
          icon: '✅', title: 'Yêu cầu được duyệt', 
          message: `Yêu cầu mượn '${bookTitle}' đã được duyệt.`, 
          titleClass: 'text-blue-600', bgClass: 'hover:bg-blue-50' 
        });
      }
    } 
    else if (loan.status === 'REJECTED') {
      notifs.push({ 
        icon: '❌', title: 'Yêu cầu bị từ chối', 
        message: `Yêu cầu mượn '${bookTitle}' đã bị Thủ thư từ chối.`, 
        titleClass: 'text-slate-600', bgClass: 'hover:bg-slate-100' 
      });
    } 
    else if (loan.status === 'COMPLETED') {
      notifs.push({ 
        icon: '🎉', title: 'Xác nhận đã trả', 
        message: `Bạn đã trả sách '${bookTitle}' thành công. Cảm ơn bạn!`, 
        titleClass: 'text-emerald-600', bgClass: 'hover:bg-emerald-50' 
      });
    }
  });
  
  return notifs.sort((a, b) => {
    if (a.titleClass.includes('red')) return -1;
    if (b.titleClass.includes('red')) return 1;
    if (a.titleClass.includes('orange')) return -1;
    if (b.titleClass.includes('orange')) return 1;
    return 0;
  });
});

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const cancelLoan = async (loanId) => {
  if(!confirm("Bạn có chắc chắn muốn hủy yêu cầu mượn cuốn sách này?")) return;
  try {
    const response = await fetch(`http://localhost:5000/api/loans/${loanId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if(data.success) {
      alert("Đã hủy yêu cầu mượn sách thành công!");
      fetchMyLoans(); 
    } else { alert(data.message); }
  } catch (error) { alert("Lỗi khi hủy!"); }
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

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
  username.value = localStorage.getItem('username') || '';
  if (isLoggedIn.value) {
    fetchMyLoans();
  } else {
    router.push('/login'); // Chống người lạ vào trang này
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const pendingList = computed(() => myLoans.value.filter(loan => loan.status === 'PENDING'));
const borrowingList = computed(() => myLoans.value.filter(loan => loan.status === 'APPROVED'));
const historyList = computed(() => myLoans.value.filter(loan => ['COMPLETED', 'REJECTED'].includes(loan.status)));

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

html, body {
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>