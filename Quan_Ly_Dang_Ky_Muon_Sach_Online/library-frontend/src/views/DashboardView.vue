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
              <a @click="router.push('/')" class="text-white cursor-pointer">Trang chủ</a>
              <template v-if="isLoggedIn">
                <router-link to="/my-books" class="hover:text-white transition-colors">My Library</router-link>
              </template>
            </div>
          </div>

          <div class="flex items-center gap-4">
            
            <div class="relative hidden sm:block">
              <input 
                type="text" 
                v-model="searchInput"
                @keyup.enter="triggerSearch"
                
                placeholder="Tìm kiếm sách, tác giả..." 
                class="w-64 lg:w-72 bg-white/90 text-slate-800 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 shadow-inner transition-all"
              >
              <i @click="triggerSearch" class="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors"></i>
            </div>

            <template v-if="!isLoggedIn">
              <button @click="router.push('/login')" class="hidden md:block text-blue-50 font-medium hover:text-white text-sm transition-colors">Đăng nhập</button>
              <button @click="router.push('/login')" class="bg-white hover:bg-blue-50 text-blue-600 px-5 py-2 rounded-md font-bold transition-all text-sm shadow-sm">Đăng ký</button>
            </template>

            <template v-else>
              <div class="relative">
                <button @click="showNotifications = !showNotifications; isUserMenuOpen = false" class="p-2 text-blue-100 hover:text-white transition-colors relative focus:outline-none mt-1">
                  <i class="fa-regular fa-bell text-xl"></i>
                  <span v-if="userNotifications.length > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600 animate-pulse"></span>
                </button>
                <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                  <div class="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                    <span class="font-bold text-slate-700">Thông báo</span>
                    <span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold">{{ userNotifications.length }}</span>
                  </div>
                  <div class="max-h-[350px] overflow-y-auto">
                    <div v-if="userNotifications.length === 0" class="px-4 py-8 text-center text-slate-400 text-sm">
                      Bạn không có thông báo nào.
                    </div>
                    <div v-for="(notif, index) in userNotifications" :key="index" :class="['px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors', notif.bgClass]" @click="router.push('/my-books')">
                      <p :class="['text-sm font-semibold', notif.titleClass]">{{ notif.title }}</p>
                      <p class="text-xs text-slate-500 mt-1 leading-snug">{{ notif.message }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative">
                <button 
                  @click="isUserMenuOpen = !isUserMenuOpen; showNotifications = false"
                  class="flex items-center gap-2 hover:bg-blue-700 p-1 pr-3 rounded-md transition-colors focus:outline-none border border-transparent hover:border-blue-500"
                >
                  <div class="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-sm shadow-sm">
                    {{ username.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-bold text-white hidden md:block">{{ username }}</span>
                  <i class="fa-solid fa-chevron-down text-xs text-blue-200"></i>
                </button>

                <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                  <router-link to="/profile" class="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors"><i class="fa-regular fa-user me-2 w-4"></i> Hồ sơ cá nhân</router-link>
                  <hr class="my-2 border-slate-100">
                  <button @click="logout" class="w-full text-left block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"><i class="fa-solid fa-arrow-right-from-bracket me-2 w-4"></i> Đăng xuất</button>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <section class="bg-gradient-to-r from-white to-slate-200 rounded-xl p-8 md:p-12 mb-10 shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 opacity-60 blur-3xl"></div>
        <div class="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-slate-300 opacity-40 blur-3xl"></div>
        <div class="relative z-10">
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Chào mừng đến với <span class="text-blue-600">Thư viện Sách</span></h1>
          <p class="text-slate-500 md:text-lg max-w-2xl mx-auto font-medium">Khám phá kho tàng tri thức vô tận. Hàng ngàn đầu sách đang chờ bạn khám phá và trải nghiệm!</p>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-8">
        
        <aside class="col-span-1 lg:col-span-1 xl:col-span-3 space-y-6">
          
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="bg-blue-50 px-5 py-4 border-b border-blue-100 flex justify-between items-center">
              <h3 class="font-bold text-blue-900 flex items-center gap-2 text-[15px]">
                <div class="w-7 h-7 bg-white rounded flex items-center justify-center text-blue-600 shadow-sm">
                  <i class="fa-solid fa-layer-group"></i>
                </div>
                Danh mục
              </h3>
              
              <button 
                @click="selectedCategory = 'ALL'; searchInput = ''; searchQuery = ''" 
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm"
                :class="selectedCategory === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-transparent'"
              >
                Tất cả
              </button>
            </div>

            <div class="p-0">
              <ul class="flex flex-col">
                <template v-for="cat in dynamicCategories" :key="cat.id">
                  <li v-if="cat.id !== 'ALL'" class="border-b border-slate-100 last:border-0">
                    <button 
                      @click="selectedCategory = cat.id" 
                      class="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-all duration-300"
                      :class="selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:pl-8'"
                    >
                      {{ cat.name }}
                      <span 
                        class="px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors shadow-sm"
                        :class="selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
                      >
                        {{ cat.count }}
                      </span>
                    </button>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-4 flex items-center gap-2 text-white shadow-inner">
              <i class="fa-solid fa-chart-line text-lg opacity-90"></i>
              <h3 class="font-bold text-[15px] tracking-wide">Thống kê</h3>
            </div>
            
            <div class="p-6 flex flex-col gap-5">
              <div class="flex justify-between items-center group cursor-default">
                <div class="flex items-center gap-3 text-slate-600 group-hover:text-emerald-600 transition-colors">
                  <div class="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <i class="fa-regular fa-handshake text-base"></i>
                  </div>
                  <span class="font-semibold text-sm">Lượt mượn</span>
                </div>
                <span class="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-black shadow-sm border border-emerald-600/20 group-hover:scale-105 transition-transform">{{ stats.totalLoans || 0 }}</span>
              </div>
              
              <div class="border-b border-dashed border-slate-200"></div>
              
              <div class="flex justify-between items-center group cursor-default">
                <div class="flex items-center gap-3 text-slate-600 group-hover:text-blue-600 transition-colors">
                  <div class="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <i class="fa-solid fa-book-bookmark text-base"></i>
                  </div>
                  <span class="font-semibold text-sm">Tổng sách</span>
                </div>
                <span class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-black shadow-sm border border-blue-700/20 group-hover:scale-105 transition-transform">{{ stats.totalBooks || 0 }}</span>
              </div>
            </div>
          </div>

        </aside>

        <div class="col-span-1 lg:col-span-3 xl:col-span-9">
          
          <div class="bg-white rounded-lg shadow-sm border border-slate-100 p-4 mb-6 flex justify-between items-center">
            <h2 class="font-bold text-slate-800 flex items-center gap-2">
              Hiển thị: <span class="text-blue-600">{{ selectedCategory === 'ALL' ? 'Tất cả sách' : selectedCategory }}</span>
              <span v-if="searchQuery" class="text-slate-400 text-sm font-normal">| Từ khóa: "{{ searchQuery }}"</span>
            </h2>
            <p class="text-sm font-medium text-slate-500">{{ filteredBooks.length }} kết quả</p>
          </div>

          <div v-if="filteredBooks.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
            <div class="text-5xl mb-4 text-slate-300"><i class="fa-solid fa-magnifying-glass-minus"></i></div>
            <h3 class="text-lg font-bold text-slate-600">Không tìm thấy sách</h3>
            <p class="text-slate-400 mt-1 text-sm font-medium">Thử tìm kiếm với từ khóa hoặc danh mục khác nhé!</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            
            <div 
              v-for="book in filteredBooks" 
              :key="book._id"
              class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
            >
              <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden cursor-pointer" @click="router.push('/book/' + book._id)">
                <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" :alt="book.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div v-else class="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-200 bg-blue-50">{{ book.title.charAt(0) }}</div>
                
                <span 
                  class="absolute top-3 right-3 px-3 py-1 text-[10px] font-bold rounded shadow-sm backdrop-blur-md uppercase tracking-wider border"
                  :class="book.quantity > 0 ? 'bg-green-500/90 text-white border-green-400' : 'bg-red-500/90 text-white border-red-400'"
                >
                  {{ book.quantity > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>
              </div>

              <div class="p-5 flex flex-col flex-grow">
                <div class="mb-2">
                  <span class="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                    :class="book.quantity > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'">
                    {{ book.category }}
                  </span>
                </div>
                
                <h3 class="font-bold text-base text-slate-900 leading-snug mb-1 line-clamp-2" :title="book.title">
                  {{ book.title }}
                </h3>
                
                <div class="text-xs text-slate-500 font-medium mb-4">
                  <p class="flex items-center gap-1.5"><i class="fa-solid fa-pen-nib text-slate-300 w-3"></i> {{ book.author }}</p>
                </div>

                <div class="mt-auto flex flex-col gap-3">
                  <div class="flex gap-2">
                    <button 
                      @click="router.push('/book/' + book._id)" 
                      class="px-4 py-2 rounded-md border border-blue-200 text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors flex justify-center items-center flex-1"
                    >
                      Chi tiết
                    </button>

                    <template v-if="getPendingLoan(book._id)">
                      <button @click="cancelLoan(getPendingLoan(book._id)._id)" class="px-4 py-2 rounded-md font-bold text-xs bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors flex justify-center items-center flex-1">
                        Đang chờ (Hủy)
                      </button>
                    </template>
                    <template v-else>
                      <button 
                        @click="openBorrowModal(book)" 
                        class="px-4 py-2 rounded-md font-bold text-xs flex justify-center items-center flex-1 transition-colors"
                        :class="book.quantity > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
                        :disabled="book.quantity <= 0"
                      >
                        {{ book.quantity > 0 ? 'Mượn' : 'Hết sách' }}
                      </button>
                    </template>
                  </div>

                  <div class="text-left mt-1">
                    <span class="text-lg font-bold text-red-500 hover:text-red-700 transition-colors cursor-default">
                      {{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 z-50 focus:outline-none"
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

    <div v-if="showBorrowModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h3 class="font-bold text-lg"> <i class="fa-solid fa-book"></i> Đăng ký mượn sách</h3>
          <button @click="showBorrowModal = false" class="text-blue-200 hover:text-white transition-colors"><i class="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <div class="p-6">
          <div class="flex gap-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <img v-if="selectedBook.image" :src="'http://localhost:5000/uploads/' + selectedBook.image" class="w-16 h-24 object-cover rounded-md shadow-sm" />
            <div v-else class="w-16 h-24 bg-blue-200 rounded-md flex items-center justify-center text-blue-700 font-bold">{{ selectedBook.title.charAt(0) }}</div>
            <div class="flex-1">
              <span class="inline-block px-2 py-0.5 bg-white text-blue-600 text-[10px] font-bold uppercase rounded mb-1 shadow-sm">{{ selectedBook.category }}</span>
              <p class="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{{ selectedBook.title }}</p>
              <p class="text-xs text-slate-500 font-medium mb-1"><i class="fa-solid fa-pen-nib mr-1"></i> {{ selectedBook.author }}</p>
              <p class="text-xs font-bold text-emerald-600"><i class="fa-solid fa-tag mr-1"></i> Giá trị sách: {{ selectedBook.price ? selectedBook.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-bold text-slate-700 mb-2">Số ngày mượn (Mặc định 7 ngày)</label>
            <input type="number" v-model="daysToBorrow" min="1" max="30" class="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700" />
          </div>

          <div class="flex gap-3">
            <button @click="showBorrowModal = false" class="flex-1 py-3 rounded-md font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Hủy</button>
            <button @click="confirmBorrow" :disabled="isProcessing" class="flex-1 py-3 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center shadow-md shadow-blue-200">
              <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              {{ isProcessing ? 'Đang gửi...' : 'Xác nhận' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
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

const showBorrowModal = ref(false)
const selectedBook = ref(null)
const daysToBorrow = ref(7)
const isProcessing = ref(false)

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
        notifs.push({ title: '⚠️ Quá hạn trả', message: `Đã quá hạn sách '${bookTitle}'.`, titleClass: 'text-red-600', bgClass: 'hover:bg-red-50 bg-red-50/50' });
      } else if (daysDiff <= 2) {
        const dayText = daysDiff === 0 ? 'hôm nay' : daysDiff === 1 ? 'ngày mai' : '2 ngày nữa';
        notifs.push({ title: '⏰ Nhắc nhở', message: `Sách '${bookTitle}' đến hạn ${dayText}.`, titleClass: 'text-orange-500', bgClass: 'hover:bg-orange-50' });
      }
    } else if (loan.status === 'REJECTED') {
      notifs.push({ title: '❌ Bị từ chối', message: `Yêu cầu mượn '${bookTitle}' đã bị hủy.`, titleClass: 'text-slate-600', bgClass: 'hover:bg-slate-100' });
    } else if (loan.status === 'COMPLETED') {
      notifs.push({ title: '🎉 Đã trả xong', message: `Đã hoàn tất trả sách '${bookTitle}'.`, titleClass: 'text-green-600', bgClass: 'hover:bg-green-50' });
    }
  });
  
  return notifs;
});

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

const logout = () => {
  localStorage.clear();
  isLoggedIn.value = false;
  window.location.reload(); 
};

const getPendingLoan = (bookId) => {
  return myLoans.value.find(loan => 
    (loan.bookId?._id === bookId || loan.bookId === bookId) && loan.status === 'PENDING'
  );
};

const openBorrowModal = (book) => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  if (localStorage.getItem('role') === 'ADMIN') {
    alert('Tài khoản Admin không được phép mượn sách!');
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
        userId: localStorage.getItem('userId'),
        daysToBorrow: daysToBorrow.value
      })
    });
    const data = await response.json();
    if (data.success) {
      alert("Gửi yêu cầu mượn thành công!");
      showBorrowModal.value = false;
      fetchBooks(); 
      fetchMyLoans(); 
      fetchStats();   
    } else { alert("Lỗi: " + data.message); }
  } catch (error) { alert("Lỗi hệ thống!"); } 
  finally { isProcessing.value = false; }
};

const cancelLoan = async (loanId) => {
  if(!confirm("Hủy yêu cầu mượn cuốn sách này?")) return;
  try {
    const response = await fetch(`http://localhost:5000/api/loans/${loanId}`, { method: 'DELETE' });
    const data = await response.json();
    if(data.success) {
      alert("Hủy yêu cầu thành công!");
      fetchBooks(); 
      fetchMyLoans(); 
      fetchStats();
    } else { alert(data.message); }
  } catch (error) { alert("Lỗi khi hủy!"); }
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; 
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchBooks();
  fetchCategories(); 
  fetchStats();
  
  const storedUserId = localStorage.getItem('userId');
  const storedUsername = localStorage.getItem('username');
  
  if (storedUserId && storedUsername) {
    isLoggedIn.value = true;
    username.value = storedUsername;
    fetchMyLoans();
  } else {
    isLoggedIn.value = false;
  }
  
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');

html, body {
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>