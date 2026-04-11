<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth relative">
    
    <nav class="bg-blue-600 shadow-md h-16 flex items-center px-4 sm:px-6 lg:px-8 text-white sticky top-0 z-50">
      <div class="max-w-7xl mx-auto w-full flex justify-between">
        <a @click="router.push('/')" class="flex items-center gap-2 cursor-pointer font-bold text-lg hover:text-blue-100 transition-colors">
          <i class="fa-solid fa-arrow-left"></i> Quay lại Thư viện
        </a>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 py-8 lg:py-12">
      
      <div v-if="isLoading" class="text-center py-32 text-slate-400 font-bold text-lg">
        <i class="fa-solid fa-spinner fa-spin text-4xl mb-4 text-blue-500"></i><br>Đang tải thông tin sách...
      </div>

      <div v-else-if="!book" class="text-center py-32">
        <div class="text-7xl mb-4 text-slate-300"><i class="fa-solid fa-book-skull"></i></div>
        <h2 class="text-2xl font-bold text-slate-700">Không tìm thấy cuốn sách này!</h2>
        <button @click="router.push('/')" class="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all hover:-translate-y-1">Trở về Trang chủ</button>
      </div>

      <div v-else class="animate-[fadeIn_0.4s_ease-out]">
        
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
          
          <div class="w-full lg:w-1/3 shrink-0 flex flex-col gap-5">
            <div class="rounded-3xl overflow-hidden shadow-md bg-white border-4 border-white aspect-[3/4] group">
              <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
              <div v-else class="w-full h-full flex items-center justify-center text-7xl font-black text-blue-200 bg-blue-50">{{ book.title.charAt(0) }}</div>
            </div>
            
            <div class="bg-red-50 border-2 border-red-100 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm">
              <span class="text-red-400 font-bold text-sm uppercase tracking-wider mb-1"><i class="fa-solid fa-tag mr-1"></i> Giá trị sách</span>
              <span class="font-black text-red-600 text-3xl tracking-tight">{{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}</span>
            </div>
          </div>

          <div class="flex-1">
            <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200 h-full flex flex-col">
              
              <h1 class="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{{ book.title }}</h1>
              <p class="text-lg text-gray-500 font-medium mb-6"><i class="fa-solid fa-pen-nib mr-2 text-gray-400"></i> {{ book.author }}</p>
              
              <div class="flex flex-wrap items-center gap-3 mb-8">
                <span class="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {{ book.category }}
                </span>
                <span :class="['px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider', book.quantity > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
                  {{ book.quantity > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>
              </div>

              <div class="flex flex-col gap-2 text-sm font-medium text-slate-700 mb-8">
                <div class="flex justify-between items-center px-4 py-3 rounded-xl bg-white/70 hover:bg-gray-100 transition-colors mt-2">
                  <span class="text-gray-500"><i class="fa-solid fa-building mr-2 w-4"></i> Nhà xuất bản</span>
                  <span class="font-bold text-slate-800">{{ getPublisherName(book.publisher) || 'Đang cập nhật' }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span class="text-gray-500"><i class="fa-regular fa-calendar-days mr-2 w-4"></i> Năm xuất bản</span>
                  <span class="font-bold text-slate-800">{{ book.publishYear || 'Đang cập nhật' }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 rounded-xl bg-white/70 hover:bg-gray-100 transition-colors">
                  <span class="text-gray-500"><i class="fa-solid fa-box-archive mr-2 w-4 text-green-500"></i> Trong kho</span>
                  <span class="font-black text-green-600 text-base bg-green-50 px-3 py-0.5 rounded-lg">{{ book.quantity }}</span>
                </div>
                <div class="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span class="text-gray-500"><i class="fa-solid fa-arrow-trend-up mr-2 w-4 text-blue-500"></i> Lượt mượn</span>
                  <span class="font-black text-blue-600 text-base bg-blue-50 px-3 py-0.5 rounded-lg">{{ book.borrowCount || 0 }}</span>
                </div>
              </div>

              <div class="mb-8 flex-grow">
                <h3 class="text-lg font-bold text-slate-800 mb-3 border-b border-gray-200 pb-2">Giới thiệu sách</h3>
                <p class="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{{ book.description || 'Cuốn sách này hiện chưa có bài viết giới thiệu chi tiết.' }}</p>
              </div>

              <div class="mt-auto pt-6 border-t border-gray-200">
                <button 
                  @click="openBorrowModal()" 
                  class="w-full md:w-auto px-12 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                  :class="book.quantity > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                  :disabled="book.quantity <= 0"
                >
                  <i class="fa-solid fa-bell-slash text-xl" v-if="book.quantity <= 0"></i>
                  {{ book.quantity > 0 ? 'Đăng ký Mượn Sách' : 'Tạm thời Hết Sách' }}
                </button>
              </div>

            </div>
          </div>
        </div>

        <section v-if="relatedBooks.length > 0" class="mt-12 border-t border-gray-200 pt-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h3 class="font-black text-2xl text-slate-800 tracking-tight">Sách cùng danh mục</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="relBook in relatedBooks" 
              :key="relBook._id"
              class="bg-white/80 rounded-3xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col hover:-translate-y-2 hover:shadow-md transition-all duration-300 cursor-pointer"
              @click="router.push('/book/' + relBook._id)"
            >
              <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border-b border-gray-100">
                <img v-if="relBook.image" :src="'http://localhost:5000/uploads/' + relBook.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div v-else class="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-200 bg-blue-50">{{ relBook.title.charAt(0) }}</div>
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <span class="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-blue-50 text-blue-600 self-start mb-2">{{ relBook.category }}</span>
                <h4 class="font-bold text-sm text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors" :title="relBook.title">{{ relBook.title }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ relBook.author }}</p>
                
                <p class="text-sm font-bold text-red-500 mt-2">{{ relBook.price ? relBook.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}</p>
              </div>
            </div>
          </div>
        </section>

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

    <div v-if="showBorrowModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h3 class="font-bold text-lg">Đăng ký mượn sách</h3>
          <button @click="showBorrowModal = false" class="text-blue-200 hover:text-white transition-colors"><i class="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <div class="p-6">
          <div class="flex gap-4 mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" class="w-16 h-24 object-cover rounded-lg shadow-sm" />
            <div v-else class="w-16 h-24 bg-blue-200 rounded-lg flex items-center justify-center text-blue-700 font-bold text-2xl">{{ book.title.charAt(0) }}</div>
            <div class="flex-1">
              <p class="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{{ book.title }}</p>
              <p class="text-xs text-slate-500 font-medium mb-1">{{ book.author }}</p>
              <p class="text-xs font-bold text-red-500 mt-1"><i class="fa-solid fa-tag mr-1"></i> Giá trị sách: {{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : 'Miễn phí' }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-bold text-slate-700 mb-2">Số ngày mượn (Mặc định 7 ngày)</label>
            <input type="number" v-model="daysToBorrow" min="1" max="30" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 font-bold outline-none transition-all" />
          </div>
          
          <div class="flex gap-3">
            <button @click="showBorrowModal = false" class="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Hủy</button>
            <button @click="confirmBorrow" :disabled="isProcessing" class="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex justify-center items-center shadow-md shadow-blue-200 disabled:opacity-70">
              <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              {{ isProcessing ? 'Đang gửi...' : 'Xác nhận mượn' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const book = ref(null);
const relatedBooks = ref([]);
const publishers = ref([]); 
const isLoading = ref(true);

const showBorrowModal = ref(false);
const daysToBorrow = ref(7);
const isProcessing = ref(false);
const showBackToTop = ref(false);

const getPublisherName = (pubId) => {
  if (!pubId) return '';
  const pub = publishers.value.find(p => p._id === pubId || p.tenNXB === pubId);
  return pub ? pub.tenNXB : pubId;
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
        relatedBooks.value = dataAll.data
          .filter(b => b.category === book.value.category && b._id !== book.value._id)
          .slice(0, 4); 
      }
    }
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchBookDetail();
  }
});

const openBorrowModal = () => {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    router.push('/login');
    return;
  }
  if (localStorage.getItem('role') === 'ADMIN') {
    alert('Tài khoản Admin không được phép mượn sách!');
    return;
  }
  daysToBorrow.value = 7;
  showBorrowModal.value = true;
};

const confirmBorrow = async () => {
  isProcessing.value = true;
  try {
    const res = await fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: book.value._id,
        userId: localStorage.getItem('userId'),
        daysToBorrow: daysToBorrow.value
      })
    });
    const data = await res.json();
    if (data.success) {
      alert("Đăng ký mượn thành công!");
      showBorrowModal.value = false;
      router.push('/my-books');
    } else alert(data.message);
  } catch (e) { 
    alert("Lỗi kết nối"); 
  } finally {
    isProcessing.value = false;
  }
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; 
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchBookDetail();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>