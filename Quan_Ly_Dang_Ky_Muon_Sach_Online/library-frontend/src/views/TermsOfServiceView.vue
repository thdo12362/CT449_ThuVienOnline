<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth flex flex-col">
    
    <nav class="bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b border-slate-200 w-full shrink-0">
      <div class="max-w-[1000px] mx-auto w-full flex justify-between items-center">
        <a @click="router.push('/')" class="flex items-center gap-3 cursor-pointer group">
          <div class="bg-orange-400 w-11 h-11 rounded-xl text-white flex items-center justify-center group-hover:rotate-12 transition-all shadow-lg shadow-orange-200">
            <i class="fa-solid fa-book-open-reader text-xl"></i>
          </div>
          <span class="font-black text-2xl tracking-tighter text-slate-800">THƯ VIỆN</span>
        </a>
        <button @click="router.push('/')" class="text-slate-500 font-bold hover:text-orange-500 transition-colors flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <i class="fa-solid fa-arrow-left"></i> Quay lại
        </button>
      </div>
    </nav>

    <main class="flex-grow w-full max-w-[800px] mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-black text-slate-900 mb-2">Quy định Thư viện</h1>
        <p class="text-slate-500 font-medium">Ngắn gọn, minh bạch và bắt buộc tuân thủ.</p>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div class="p-8 md:p-12 space-y-10">
          
          <section>
            <h2 class="text-lg font-black text-slate-800 flex items-center gap-3 mb-4 uppercase tracking-wider">
              <span class="w-8 h-8 rounded-lg bg-orange-400 text-white flex items-center justify-center text-xs">01</span>
              Tiêu chuẩn mượn sách
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Tối đa</p>
                <p class="font-black text-slate-800">03 cuốn / người</p>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Thời gian</p>
                <p class="font-black text-slate-800">01 - 30 ngày</p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-lg font-black text-red-600 flex items-center gap-3 mb-4 uppercase tracking-wider">
              <span class="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center text-xs">02</span>
              Điều kiện chặn mượn sách
            </h2>
            <p class="text-sm font-bold text-slate-500 mb-3">Tài khoản sẽ bị tạm khóa tính năng mượn nếu:</p>
            <ul class="space-y-3 ml-2">
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i class="fa-solid fa-circle-xmark text-red-500 w-4"></i> Chưa cập nhật đầy đủ thông tin cá nhân.
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i class="fa-solid fa-circle-xmark text-red-500 w-4"></i> Có sách quá hạn (Bị khóa ngay từ ngày trễ đầu tiên cho đến khi trả sách).
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i class="fa-solid fa-circle-xmark text-red-500 w-4"></i> Đang nợ phí đền bù sách mất.
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <i class="fa-solid fa-circle-xmark text-red-500 w-4"></i> Đã mượn đủ 03 cuốn.
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-black text-slate-800 flex items-center gap-3 mb-4 uppercase tracking-wider">
              <span class="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">03</span>
              Mức phí vi phạm
            </h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                <span class="text-sm font-bold text-red-700">Trễ hạn</span>
                <span class="font-black text-red-600">2.000đ / ngày</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <span class="text-sm font-bold text-amber-700">Mất sách</span>
                <span class="font-black text-amber-600">100% giá trị sách</span>
              </div>
            </div>
            
            <div class="mt-5 p-4 bg-slate-900 rounded-2xl border-l-4 border-red-500">
              <p class="text-xs font-bold text-slate-300 leading-relaxed">
                <span class="text-red-400 uppercase tracking-wider block mb-1">Cảnh báo:</span>
                Vi phạm nhiều lần, hoặc để quá hạn 30 ngày / báo mất 7 ngày không xử lý có thể dẫn đến <span class="text-white">khóa tài khoản vĩnh viễn</span>.
              </p>
            </div>
          </section>

        </div>
        
        <div class="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p class="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Tuân thủ nội quy để xây dựng văn hóa đọc văn minh</p>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 mt-auto">
      <div class="max-w-[1000px] mx-auto px-6 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2026 Thư viện Online
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

html, body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
</style>