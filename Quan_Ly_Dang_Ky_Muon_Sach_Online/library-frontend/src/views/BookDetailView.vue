<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth relative w-full overflow-x-hidden flex flex-col">
    
    <nav class="bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b border-slate-200 transition-all w-full shrink-0">
      <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
        
        <div class="flex items-center gap-10">
          <a @click="router.push('/')" class="flex items-center gap-3 cursor-pointer group">
            <div class="bg-orange-400 w-11 h-11 rounded-xl text-white flex items-center justify-center group-hover:rotate-12 transition-all shadow-lg shadow-orange-200">
              <i class="fa-solid fa-book-open-reader text-xl"></i>
            </div>
            <span class="font-black text-2xl tracking-tighter text-slate-800 hidden md:block">THƯ VIỆN</span>
          </a>
          
          <div class="flex items-center text-sm font-bold md:ml-4 md:border-l pl-4 md:pl-6 border-slate-200">
            <a @click="router.push('/')" class="text-slate-400 hover:text-orange-500 transition-colors cursor-pointer hidden sm:block">Trang chủ</a>
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-300 mx-3 hidden sm:block"></i>
            
            <span v-if="book" class="text-slate-400 hover:text-orange-500 transition-colors cursor-pointer hidden sm:block" @click="router.push({ path: '/', query: { category: book.category } })">
              {{ book.category }}
            </span>
            <span v-else class="text-slate-300 animate-pulse w-16 h-4 bg-slate-200 rounded hidden sm:block"></span>
            
            <i class="fa-solid fa-chevron-right text-[10px] text-slate-300 mx-3 hidden sm:block"></i>
            
            <span v-if="book" class="text-slate-800 line-clamp-1 max-w-[150px] md:max-w-[300px]">
              {{ book.title }}
            </span>
            <span v-else class="text-slate-300 animate-pulse w-32 h-4 bg-slate-200 rounded"></span>
          </div>
        </div>

        <div class="flex items-center gap-4 relative">
          <template v-if="!isLoggedIn">
            <button @click="router.push('/login')" class="hidden md:block text-slate-500 font-bold hover:text-orange-500 text-sm transition-colors">Đăng nhập</button>
            <button @click="router.push('/login')" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md">Đăng ký</button>
          </template>
          <template v-else>
            
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

    <main class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full relative z-10 flex-grow">
      
      <div v-if="isLoading" class="text-center py-32">
        <i class="fa-solid fa-circle-notch fa-spin text-5xl mb-6 text-orange-400"></i>
        <p class="text-slate-400 font-bold text-lg animate-pulse">Đang tải thông tin sách...</p>
      </div>

      <div v-else-if="!book" class="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div class="text-8xl mb-6 text-slate-200"><i class="fa-solid fa-book-open-reader"></i></div>
        <h2 class="text-2xl font-black text-slate-700 mb-2">Cuốn sách này không tồn tại</h2>
        <p class="text-slate-400 font-medium mb-8">Có thể sách đã bị gỡ hoặc đường dẫn bị sai.</p>
        <button @click="router.push('/')" class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-orange-400 shadow-xl transition-all">Khám phá sách khác</button>
      </div>

      <div v-else class="animate-[fadeIn_0.4s_ease-out]">
        
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20">
          
          <div class="w-full lg:w-1/3 shrink-0">
            <div class="sticky top-28 space-y-6">
              <div class="rounded-[2rem] overflow-hidden shadow-2xl bg-white border-[8px] border-white aspect-[3/4.2] group">
                <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div v-else class="w-full h-full flex items-center justify-center text-8xl font-black text-slate-200 bg-slate-100">{{ book.title.charAt(0) }}</div>
              </div>
              
              <div class="hidden lg:block">
                <button 
                  @click="openBorrowModal()" 
                  class="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-widest"
                  :class="{
                    'bg-amber-500 text-white cursor-not-allowed opacity-90 shadow-md': getBookBorrowStatus(book._id) === 'PENDING',
                    'bg-emerald-500 text-white cursor-not-allowed opacity-90 shadow-md': getBookBorrowStatus(book._id) === 'APPROVED',
                    'bg-orange-400 text-white hover:bg-orange-500 shadow-xl shadow-orange-200 hover:-translate-y-1': !getBookBorrowStatus(book._id) && book.quantity > 0,
                    'bg-slate-200 text-slate-400 cursor-not-allowed': !getBookBorrowStatus(book._id) && book.quantity <= 0
                  }"
                  :disabled="book.quantity <= 0 || getBookBorrowStatus(book._id) !== null"
                >
                  <i v-if="getBookBorrowStatus(book._id) === 'PENDING'" class="fa-solid fa-hourglass-half text-xl"></i>
                  <i v-else-if="getBookBorrowStatus(book._id) === 'APPROVED'" class="fa-solid fa-book-open-reader text-xl"></i>
                  <i v-else-if="book.quantity <= 0" class="fa-solid fa-lock text-xl"></i>
                  
                  {{ 
                    getBookBorrowStatus(book._id) === 'PENDING' ? 'Đang chờ duyệt' : 
                    getBookBorrowStatus(book._id) === 'APPROVED' ? 'Đang mượn' : 
                    (book.quantity > 0 ? 'Đăng ký mượn ngay' : 'Đã mượn hết') 
                  }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col">
            
            <div class="mb-8">
              <div class="flex items-center gap-3 mb-4">
                <span class="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">
                  {{ book.category }}
                </span>
                <span :class="['px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-md', book.quantity > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200']">
                  {{ book.quantity > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>
              </div>

              <h1 class="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">{{ book.title }}</h1>
              
              <div class="flex items-center gap-6 text-slate-500">
                <p class="text-lg font-bold flex items-center gap-2"><i class="fa-solid fa-feather-pointed text-orange-400"></i> {{ book.author }}</p>
                <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <p class="text-2xl font-black text-slate-900">{{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div class="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <i class="fa-solid fa-building text-slate-300 text-xl mb-2"></i>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhà xuất bản</span>
                <span class="font-bold text-slate-800 text-sm line-clamp-1" :title="getPublisherName(book.publisher)">{{ getPublisherName(book.publisher) || 'N/A' }}</span>
              </div>
              <div class="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <i class="fa-solid fa-calendar-check text-slate-300 text-xl mb-2"></i>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Năm XB</span>
                <span class="font-bold text-slate-800 text-sm">{{ book.publishYear || 'N/A' }}</span>
              </div>
              <div class="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <i class="fa-solid fa-boxes-stacked text-orange-300 text-xl mb-2"></i>
                <span class="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Trong kho</span>
                <span class="font-black text-orange-500 text-xl">{{ book.quantity }}</span>
              </div>
              <div class="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <i class="fa-solid fa-arrow-trend-up text-emerald-300 text-xl mb-2"></i>
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Lượt mượn</span>
                <span class="font-black text-emerald-500 text-xl">{{ book.borrowCount || 0 }}</span>
              </div>
            </div>

            <div class="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm flex-grow">
              <h3 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center"><i class="fa-solid fa-quote-left"></i></div>
                Giới thiệu nội dung
              </h3>
              <p class="text-slate-600 leading-[1.8] text-justify whitespace-pre-line text-base font-medium">
                {{ book.description || 'Cuốn sách này hiện chưa có bài viết giới thiệu chi tiết từ thư viện. Vui lòng quay lại sau.' }}
              </p>
            </div>

            <div class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40">
              <button 
                @click="openBorrowModal()" 
                class="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl transition-all"
                :class="{
                  'bg-amber-500 text-white cursor-not-allowed opacity-90 shadow-md': getBookBorrowStatus(book._id) === 'PENDING',
                  'bg-emerald-500 text-white cursor-not-allowed opacity-90 shadow-md': getBookBorrowStatus(book._id) === 'APPROVED',
                  'bg-orange-400 text-white hover:bg-orange-500 active:scale-95': !getBookBorrowStatus(book._id) && book.quantity > 0,
                  'bg-slate-200 text-slate-400 cursor-not-allowed': !getBookBorrowStatus(book._id) && book.quantity <= 0
                }"
                :disabled="book.quantity <= 0 || getBookBorrowStatus(book._id) !== null"
              >
                <i v-if="getBookBorrowStatus(book._id) === 'PENDING'" class="fa-solid fa-hourglass-half"></i>
                <i v-else-if="getBookBorrowStatus(book._id) === 'APPROVED'" class="fa-solid fa-book-open-reader"></i>
                <i v-else-if="book.quantity <= 0" class="fa-solid fa-lock"></i>
                
                {{ 
                  getBookBorrowStatus(book._id) === 'PENDING' ? 'Đang chờ duyệt' : 
                  getBookBorrowStatus(book._id) === 'APPROVED' ? 'Đang mượn' : 
                  (book.quantity > 0 ? 'Mượn ngay' : 'Đã mượn hết') 
                }}
              </button>
            </div>

          </div>
        </div>

        <section v-if="relatedBooks.length > 0" class="pt-16 border-t border-slate-200">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-black text-2xl text-slate-800 tracking-tight">Sách cùng danh mục</h3>
            
            <div class="flex items-center gap-2">
              <button @click="scrollCarousel(-1)" class="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-colors shadow-sm">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button @click="scrollCarousel(1)" class="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-colors shadow-sm">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div id="related-books-carousel" class="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 scroll-smooth">
            <div v-for="relBook in relatedBooks" :key="relBook._id" class="group cursor-pointer flex flex-col flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start" @click="router.push('/book/' + relBook._id)">
              <div class="relative aspect-[3/4.2] bg-slate-100 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <img v-if="relBook.image" :src="'http://localhost:5000/uploads/' + relBook.image" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">{{ relBook.title.charAt(0) }}</div>
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="px-1">
                <h4 class="font-black text-sm text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors" :title="relBook.title">{{ relBook.title }}</h4>
                <p class="text-xs text-slate-500 font-medium mt-1 line-clamp-1">{{ relBook.author }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-24 lg:bottom-8 right-6 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-2xl hover:bg-orange-400 hover:-translate-y-1 transition-all duration-300 z-50"
      :class="showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>

    <div v-if="showBorrowModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div class="p-10">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Đăng ký mượn</h3>
          <p class="text-slate-500 text-sm text-center mb-8 leading-relaxed font-medium">Bạn đang đăng ký mượn cuốn sách <b>"{{ book?.title }}"</b>. Vui lòng chọn thời gian trả.</p>
          
          <div class="space-y-6">
            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Số ngày mượn (1 - 30)</label>
              <div class="flex items-center justify-center gap-5">
                <button @click="daysToBorrow > 1 && daysToBorrow--" class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-orange-400 hover:text-white transition-all shadow-sm text-xl"><i class="fa-solid fa-minus"></i></button>
                <div class="w-16 text-center">
                  <span class="text-4xl font-black text-slate-800">{{ daysToBorrow }}</span>
                </div>
                <button @click="daysToBorrow < 30 && daysToBorrow++" class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-orange-400 hover:text-white transition-all shadow-sm text-xl"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="showBorrowModal = false" class="flex-1 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all uppercase text-xs tracking-widest">Hủy bỏ</button>
              <button @click="confirmBorrow" :disabled="isProcessing" class="flex-[2] py-4 rounded-2xl font-black text-white bg-orange-400 hover:bg-orange-500 shadow-xl shadow-orange-100 transition-all uppercase text-xs tracking-widest disabled:opacity-50 flex justify-center items-center">
                <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                {{ isProcessing ? 'Đang gửi...' : 'Xác nhận mượn' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast'; 

const route = useRoute();
const router = useRouter();
const { addToast } = useToast(); 

// State Quản lý người dùng & Layout
const isLoggedIn = ref(false);
const username = ref('');
const fullName = ref('');
const isUserMenuOpen = ref(false);
const showNotifications = ref(false);
const showBackToTop = ref(false);
const searchInput = ref('');

// State Dữ liệu
const book = ref(null);
const allBooks = ref([]); 
const relatedBooks = ref([]);
const publishers = ref([]); 
const myLoans = ref([]);
const isLoading = ref(true);

// State Modal Mượn sách
const showBorrowModal = ref(false);
const daysToBorrow = ref(7);
const isProcessing = ref(false);

const readNotifIds = ref(JSON.parse(localStorage.getItem('readNotifs') || '[]'));

// Computed Tên Avatar
const displayFirstName = computed(() => {
  const name = fullName.value || username.value || 'User';
  return name.trim().split(' ').pop();
});

// Hàm Tìm kiếm Navbar
const triggerSearch = () => {
  if (searchInput.value.trim()) {
    router.push({ path: '/', query: { search: searchInput.value } });
  }
};

const scrollCarousel = (direction) => {
  const container = document.getElementById('related-books-carousel');
  if (container) {
    const scrollAmount = 300;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
};

const getPublisherName = (pubId) => {
  if (!pubId) return '';
  const pub = publishers.value.find(p => p._id === pubId || p.tenNXB === pubId);
  return pub ? pub.tenNXB : pubId;
};

const fetchMyLoans = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
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

const fetchBookDetail = async () => {
  isLoading.value = true;
  book.value = null;
  relatedBooks.value = [];
  window.scrollTo({ top: 0, behavior: 'smooth' }); 

  try {
    try {
      const resPub = await fetch('http://localhost:5000/api/admin/publishers');
      const pubData = await resPub.json();
      if(pubData.success) publishers.value = pubData.data;
    } catch (e) { console.warn("Chưa lấy được NXB", e); }

    const res = await fetch('http://localhost:5000/api/books/' + route.params.id);
    const data = await res.json();
    
    if (data.success) {
      book.value = data.data;
      
      const resAll = await fetch('http://localhost:5000/api/books');
      const dataAll = await resAll.json();
      if(dataAll.success) {
        allBooks.value = dataAll.data;
        relatedBooks.value = dataAll.data.filter(b => b.category === book.value.category && b._id !== book.value._id); 
      }
    }
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchBookDetail();
});

// HÀM KIỂM TRA SÁCH ĐÃ MƯỢN TRẢ VỀ TRẠNG THÁI CỤ THỂ
const getBookBorrowStatus = (bookId) => {
  if (!bookId) return null;
  const loan = myLoans.value.find(loan => {
    const loanBookId = loan.bookId?._id || loan.bookId || loan.MaSach;
    return loanBookId === bookId && (loan.status === 'PENDING' || loan.status === 'APPROVED');
  });
  return loan ? loan.status : null; // Trả về 'PENDING' hoặc 'APPROVED'
};

// HỆ THỐNG THÔNG BÁO (Bảo toàn Reactivity)
const getBookForNotification = (loan) => {
  if (loan.thongTinSach) return loan.thongTinSach;
  const bookIdStr = loan.bookId?._id || loan.bookId || loan.MaSach;
  const foundBook = allBooks.value.find(b => b._id === bookIdStr || b.maSach === bookIdStr);
  return foundBook || { _id: bookIdStr };
};

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
  router.push({ path: '/my-books', query: { tab: notif.targetTab } });
};

// HÀM MỞ BẢNG MƯỢN SÁCH CÓ CHECK ĐIỀU KIỆN
const openBorrowModal = async () => {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    router.push('/login');
    return;
  }
  if (localStorage.getItem('role') === 'ADMIN') {
    addToast('Tài khoản Admin không được phép mượn sách!', 'warning');
    return;
  }

  try {
    const userId = localStorage.getItem('userId');
    const res = await fetch(`http://localhost:5000/api/users/${userId}`);
    const data = await res.json();

    if (data.success) {
      const user = data.data;
      
      // 1. Kiểm tra tài khoản có bị khóa vì nợ xấu không
      if (user.isActive === false) {
        addToast('Tài khoản của bạn đã bị khóa do vi phạm nội quy thư viện. Vui lòng liên hệ thủ thư.', 'error');
        return; // CHẶN LẠI NGAY
      }

      // 2. Kiểm tra có đang bị mượn sách quá hạn nào không
      const hasOverdueBook = myLoans.value.some(loan => {
        if (loan.status !== 'APPROVED' || !loan.dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(loan.dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today;
      });

      if (hasOverdueBook) {
        addToast('Bạn đang có sách quá hạn chưa trả. Vui lòng trả sách để tiếp tục mượn mới!', 'error');
        return; // CHẶN LẠI NGAY
      }

      // 3. Kiểm tra hồ sơ cá nhân
      if (!user.phone || user.phone === 'Chưa cập nhật' || !user.address || user.address === 'Chưa cập nhật' || !user.birthDate || !user.gender || user.gender === 'Khác') {
        addToast('Vui lòng hoàn thiện hồ sơ cá nhân (SĐT, Địa chỉ, Ngày sinh, Phái) để tiếp tục mượn sách!', 'warning');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
        return; 
      }
    } else {
      addToast('Không thể xác thực thông tin người dùng!', 'error');
      return; 
    }
  } catch (error) {
    addToast('Lỗi xác minh thông tin cá nhân!', 'error');
    return;
  }

  daysToBorrow.value = 7;
  showBorrowModal.value = true;
};

// HÀM XÁC NHẬN MƯỢN (Không nhảy trang)
const confirmBorrow = async () => {
  isProcessing.value = true;
  try {
    const response = await fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: book.value._id,
        userId: localStorage.getItem('userId'),
        daysToBorrow: daysToBorrow.value
      })
    });
    const data = await response.json();
    
    if (data.success) {
      addToast("Đăng ký mượn thành công! Vui lòng chờ duyệt.", "success");
      showBorrowModal.value = false;
      
      await fetchBookDetail(); 
      await fetchMyLoans(); 
    } else {
      // Backend cũng chặn nếu có sách quá hạn, hiển thị lỗi từ API luôn
      addToast(data.message, "error");
    }
  } catch (e) { 
    addToast("Lỗi kết nối đến máy chủ!", "error"); 
  } finally {
    isProcessing.value = false;
  }
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; 
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn.value) {
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
    
    // Tải lịch sử mượn để check trạng thái nút
    await fetchMyLoans();
  }

  // Cuối cùng mới tải sách để tránh lỗi
  await fetchBookDetail();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

html, body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  scroll-behavior: smooth;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: scale(1); }
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>