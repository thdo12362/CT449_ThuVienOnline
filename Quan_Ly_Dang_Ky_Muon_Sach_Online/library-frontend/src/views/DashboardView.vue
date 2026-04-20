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
          <div class="hidden md:flex items-center gap-8 font-bold text-sm">
            <a @click="router.push('/')" class="text-orange-500 cursor-pointer border-b-2 border-orange-500 pb-1">Trang chủ</a>
            <template v-if="isLoggedIn">
              <router-link to="/my-books" class="text-slate-500 hover:text-orange-500 transition-colors">Sách của tôi</router-link>
            </template>
          </div>
        </div>

        <div class="flex items-center gap-4 relative">
          <div class="relative hidden sm:block mr-2">
            <input 
              type="text" 
              v-model="searchInput"
              @keyup.enter="triggerSearch"
              placeholder="Tìm sách, tác giả..." 
              class="w-64 lg:w-80 bg-slate-100 text-slate-800 text-sm rounded-xl pl-5 pr-10 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-400 transition-all border border-transparent focus:border-orange-100"
            >
            <i @click="triggerSearch" class="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-orange-500 transition-colors"></i>
          </div>

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

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative min-h-[calc(100vh-20rem)] w-full">
      <section class="relative h-[250px] md:h-[300px] rounded-[2rem] overflow-hidden mb-10 shadow-2xl shadow-slate-200">
        <img src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1920&auto=format&fit=crop" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/90 via-slate-900/70 md:via-slate-900/60 to-transparent flex flex-col justify-center px-6 md:px-16 items-center md:items-start text-center md:text-left">
          <h1 class="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-snug">
            Sách là kho tàng <br class="hidden md:block"><span class="text-orange-400">tri thức của nhân loại.</span>
          </h1>
          <p class="text-slate-300 text-sm md:text-lg max-w-xl font-medium mb-8 leading-relaxed">
            Và việc đọc sách sẽ giúp bạn khám phá thế giới xung quanh mình. Hãy bắt đầu hành trình của bạn ngay hôm nay!
          </p>
          
          <div class="md:hidden relative w-full max-w-sm">
            <input type="text" v-model="searchInput" @keyup.enter="triggerSearch" placeholder="Tìm sách..." class="w-full py-3.5 pl-5 pr-12 rounded-xl text-slate-900 font-bold shadow-xl outline-none">
            <button @click="triggerSearch" class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-orange-400 text-white rounded-lg shadow-md"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-8">
        <aside class="col-span-1 lg:col-span-1 xl:col-span-3 space-y-6">
          <div class="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6">
            <h3 class="font-black text-slate-900 mb-5 flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-orange-400"></i> Danh mục
            </h3>
            <ul class="flex flex-col gap-1">
              <li>
                <button 
                  @click="selectedCategory = 'ALL'; searchInput = ''; searchQuery = ''" 
                  class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all"
                  :class="selectedCategory === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'"
                >
                  Tất cả sách <i v-if="selectedCategory === 'ALL'" class="fa-solid fa-check text-[10px]"></i>
                </button>
              </li>
              <template v-for="cat in dynamicCategories" :key="cat.id">
                <li v-if="cat.id !== 'ALL'">
                  <button 
                    @click="selectedCategory = cat.id" 
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group"
                    :class="selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-orange-500'"
                  >
                    {{ cat.name }}
                    <span 
                      class="px-2 py-0.5 rounded-md text-[10px] font-black transition-colors"
                      :class="selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600'"
                    >
                      {{ cat.count }}
                    </span>
                  </button>
                </li>
              </template>
            </ul>
          </div>

          <div class="bg-orange-400 rounded-[1.5rem] p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200">
            <div class="absolute -right-4 -bottom-4 text-7xl text-white/20"><i class="fa-solid fa-chart-pie"></i></div>
            <h3 class="font-black text-white/90 uppercase text-[10px] tracking-[0.2em] mb-4">Thống kê thư viện</h3>
            <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-end border-b border-white/20 pb-3">
                <span class="font-bold text-sm">Lượt mượn</span>
                <span class="text-2xl font-black">{{ stats.totalLoans || 0 }}</span>
              </div>
              <div class="flex justify-between items-end">
                <span class="font-bold text-sm">Tổng sách</span>
                <span class="text-2xl font-black">{{ stats.totalBooks || 0 }}</span>
              </div>
            </div>
          </div>
        </aside>

        <div class="col-span-1 lg:col-span-3 xl:col-span-9">
          <div class="mb-6 flex justify-between items-end">
            <div>
              <h2 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {{ selectedCategory === 'ALL' ? 'Tất cả sách' : selectedCategory }}
              </h2>
              <p v-if="searchQuery" class="text-sm font-medium text-orange-500 mt-1">Kết quả cho: "{{ searchQuery }}"</p>
            </div>
            <p class="text-sm font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">{{ filteredBooks.length }} cuốn</p>
          </div>

          <div v-if="filteredBooks.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
            <div class="text-5xl mb-4 text-slate-300"><i class="fa-solid fa-box-open"></i></div>
            <h3 class="text-lg font-black text-slate-700">Chưa tìm thấy sách</h3>
            <p class="text-slate-400 mt-1 text-sm font-medium">Thử nhập từ khóa khác hoặc chọn danh mục khác nhé.</p>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            <div v-for="book in filteredBooks" :key="book._id" class="group cursor-pointer flex flex-col h-full">
              <div class="relative aspect-[3/4.2] bg-slate-100 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300" @click="router.push('/book/' + book._id)">
                <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">{{ book.title.charAt(0) }}</div>
                
                <span class="absolute top-3 right-3 px-2.5 py-1 text-[9px] font-black rounded-md uppercase tracking-wider backdrop-blur-md" :class="book.quantity > 0 ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'">
                  {{ book.quantity > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>

                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button class="bg-white text-slate-900 px-4 py-2 rounded-lg font-black text-xs shadow-xl scale-90 group-hover:scale-100 transition-all">Xem chi tiết</button>
                </div>
              </div>

              <div class="flex flex-col flex-grow px-1">
                <span class="text-[9px] font-black uppercase text-orange-400 tracking-widest mb-1">{{ book.category }}</span>
                <h3 class="font-black text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors mb-1" @click="router.push('/book/' + book._id)">
                  {{ book.title }}
                </h3>
                <p class="text-xs text-slate-500 font-medium mb-3"><i class="fa-solid fa-pen-nib text-[10px] mr-1"></i>{{ book.author }}</p>

                <div class="mt-auto flex items-center justify-between">
                  <span class="text-sm font-black text-slate-900">
                    {{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : 'Free' }}
                  </span>
                  
                  <button 
                    @click="openBorrowModal(book)" 
                    class="px-3 py-1.5 rounded-lg font-black text-[10px] uppercase transition-all flex items-center gap-1.5"
                    :class="{
                      'bg-amber-500 text-white cursor-not-allowed opacity-90 shadow-sm': getBookBorrowStatus(book._id) === 'PENDING',
                      'bg-emerald-500 text-white cursor-not-allowed opacity-90 shadow-sm': getBookBorrowStatus(book._id) === 'APPROVED',
                      'bg-slate-900 text-white hover:bg-orange-400 active:scale-95': !getBookBorrowStatus(book._id) && book.quantity > 0,
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
          </div>
        </div>
      </div>
    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-6 right-6 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-2xl hover:bg-orange-400 hover:-translate-y-1 transition-all duration-300 z-50"
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
              Sách không chỉ giúp ta hiểu thêm về thế giới, mà còn giúp ta hiểu rõ hơn về chính mình.
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
              <li class="flex gap-3 pt-2">
                <i class="fa-solid fa-file-contract text-orange-400 mt-0.5"></i> 
                <a @click="router.push('/terms')" class="hover:text-orange-400 transition-colors cursor-pointer border-b border-dashed border-slate-500 hover:border-orange-400">Nội quy mượn trả</a>
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

    <div v-if="showBorrowModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div class="p-10">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-900 text-center mb-2">Đăng ký mượn</h3>
          <p class="text-slate-500 text-sm text-center mb-8 leading-relaxed font-medium">Bạn đang đăng ký mượn cuốn sách <b>"{{ selectedBook?.title }}"</b>. Vui lòng chọn thời gian trả.</p>
          
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../composables/useToast'

const router = useRouter()
const route = useRoute()
const { addToast } = useToast()

const isLoggedIn = ref(false)
const fullName = ref('')
const username = ref('')
const isUserMenuOpen = ref(false)
const showNotifications = ref(false)
const showBackToTop = ref(false)

const searchInput = ref('')
const searchQuery = ref('')

const selectedCategory = ref('ALL') 
const books = ref([])
const myLoans = ref([]) 
const stats = ref({ totalBooks: 0, totalUsers: 0, totalLoans: 0 }) 
const categoriesFromDB = ref([]) 

const readNotifIds = ref(JSON.parse(localStorage.getItem('readNotifs') || '[]'));

const showBorrowModal = ref(false)
const selectedBook = ref(null)
const daysToBorrow = ref(7)
const isProcessing = ref(false)

const displayFirstName = computed(() => {
  const name = fullName.value || username.value || 'User';
  return name.trim().split(' ').pop();
});

watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory;
    setTimeout(() => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  }
});

const triggerSearch = () => {
  searchQuery.value = searchInput.value;
};

const dynamicCategories = computed(() => {
  const cats = {};
  categoriesFromDB.value.forEach(cat => {
    cats[cat.tenDanhMuc] = { id: cat.tenDanhMuc, name: cat.tenDanhMuc, count: 0 };
  });
  books.value.forEach(book => {
    if (book.category && !cats[book.category]) {
      cats[book.category] = { id: book.category, name: book.category, count: 0 };
    }
    if (book.category) {
      cats[book.category].count++;
    }
  });
  return Object.values(cats);
});

const getBookForNotification = (loan) => {
  if (loan.thongTinSach) return loan.thongTinSach;
  const bookIdStr = loan.bookId?._id || loan.bookId || loan.MaSach;
  const foundBook = books.value.find(b => b._id === bookIdStr || b.maSach === bookIdStr);
  return foundBook || { _id: bookIdStr };
};

const getBookBorrowStatus = (bookId) => {
  if (!bookId) return null;
  const loan = myLoans.value.find(loan => {
    const loanBookId = loan.bookId?._id || loan.bookId || loan.MaSach;
    return loanBookId === bookId && (loan.status === 'PENDING' || loan.status === 'APPROVED');
  });
  return loan ? loan.status : null; 
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

const fetchBooks = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/books');
    const data = await res.json();
    if (data.success) books.value = data.data;
  } catch (e) { console.error("Lỗi lấy sách:", e); }
};

const fetchCategories = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/categories');
    const data = await res.json();
    if (data.success) categoriesFromDB.value = data.data;
  } catch (e) { console.error("Lỗi lấy danh mục:", e); }
};

const fetchMyLoans = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
  try {
    const res = await fetch(`http://localhost:5000/api/loans/user/${userId}`);
    const data = await res.json();
    if (data.success) myLoans.value = data.data;
  } catch (e) { console.error("Lỗi lấy phiếu:", e); }
};

const fetchStats = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/stats');
    const data = await res.json();
    if (data.success) stats.value = data.data;
  } catch (e) { console.error("Lỗi lấy thống kê:", e); }
};

const filteredBooks = computed(() => {
  let result = books.value;
  if (selectedCategory.value !== 'ALL') {
    result = result.filter(b => b.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    result = result.filter(b => 
      b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      b.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return result;
});

const openBorrowModal = async (book) => {
  if (!isLoggedIn.value) {
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

      if (user.isActive === false) {
        addToast('Tài khoản của bạn đã bị khóa do vi phạm nội quy. Vui lòng liên hệ thủ thư.', 'error');
        return;
      }

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
        return; 
      }

      if (!user.phone || user.phone === 'Chưa cập nhật' || !user.address || user.address === 'Chưa cập nhật' || !user.birthDate || !user.gender || user.gender === 'Khác') {
        addToast('Vui lòng hoàn thiện hồ sơ (SĐT, Địa chỉ, Ngày sinh, Phái) để tiếp tục mượn sách!', 'warning');
        setTimeout(() => { router.push('/profile'); }, 2000);
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

  selectedBook.value = book;
  daysToBorrow.value = 7; 
  showBorrowModal.value = true;
};

const confirmBorrow = async () => {
  isProcessing.value = true;
  try {
    const response = await fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: selectedBook.value._id,
        maSach: selectedBook.value.maSach, 
        userId: localStorage.getItem('userId'),
        daysToBorrow: daysToBorrow.value
      })
    });
    const data = await response.json();
    if (data.success) {
      addToast("Gửi yêu cầu mượn thành công!", "success");
      showBorrowModal.value = false;
      await fetchBooks(); 
      await fetchMyLoans(); 
      await fetchStats();   
    } else { 
      addToast(data.message, "error"); 
    }
  } catch (error) { 
    addToast("Lỗi hệ thống máy chủ!", "error"); 
  } finally { 
    isProcessing.value = false; 
  }
};

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  window.location.reload(); 
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; 
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    isLoggedIn.value = true;
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
    
    fetchBooks();
    fetchCategories(); 
    fetchStats();
    fetchMyLoans();
  } else {
    isLoggedIn.value = false;
    fetchBooks();
    fetchCategories(); 
    fetchStats();
  }

  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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