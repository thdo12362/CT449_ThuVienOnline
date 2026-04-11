<template>
  <div class="min-h-screen bg-slate-900 flex font-sans text-slate-200 scroll-smooth relative">
    
    <aside class="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <div class="p-8 cursor-pointer" @click="router.push('/')">
        <h2 class="text-xl font-black text-emerald-500 tracking-tighter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] flex items-center gap-2">
          <i class="fa-solid fa-book-open"></i> ADMIN
        </h2>
        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Thủ thư hệ thống</p>
      </div>

      <nav class="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pb-4">
        <button @click="activeModule = 'DASHBOARD'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'DASHBOARD' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-chart-pie w-5 text-center opacity-90 text-lg"></i>
          <span>Dashboard</span>
        </button>
        <button @click="activeModule = 'BOOKS'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'BOOKS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-book w-5 text-center opacity-90 text-lg"></i>
          <span>Quản lý Sách</span>
        </button>
        <button @click="activeModule = 'CATEGORIES'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'CATEGORIES' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-tags w-5 text-center opacity-90 text-lg"></i>
          <span>Danh mục</span>
        </button>
        <button @click="activeModule = 'PUBLISHERS'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'PUBLISHERS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-building w-5 text-center opacity-90 text-lg"></i>
          <span>Nhà xuất bản</span>
        </button>
        <button @click="activeModule = 'LOANS'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'LOANS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-hand-holding-hand w-5 text-center opacity-90 text-lg"></i>
          <span>Mượn / Trả</span>
        </button>
        <button @click="activeModule = 'USERS'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'USERS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-users w-5 text-center opacity-90 text-lg"></i>
          <span>Độc giả</span>
        </button>
        <button v-if="isSuperAdmin" @click="activeModule = 'EMPLOYEES'" :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:translate-x-1', activeModule === 'EMPLOYEES' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200']">
          <i class="fa-solid fa-user-tie w-5 text-center opacity-90 text-lg"></i>
          <span>Nhân viên</span>
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800 bg-slate-950">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-emerald-500 border border-slate-700 shadow-inner">{{ adminName.charAt(0) }}</div>
          <div>
            <p class="text-sm font-bold text-slate-200">{{ adminName }}</p>
            <p class="text-xs text-emerald-600/70 font-semibold uppercase tracking-wider">{{ adminRole }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-bold text-sm transition-all border border-red-500/20 hover:border-red-500/40 active:scale-95 flex items-center justify-center gap-2">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
        </button>
      </div>
    </aside>

    <div class="w-64 shrink-0 hidden md:block"></div>

    <main class="flex-1 p-8 md:p-10 overflow-x-hidden min-h-screen bg-[#0f172a]">
      
      <div v-if="activeModule === 'DASHBOARD'" class="animate-[fadeIn_0.3s_ease-out]">
        <h1 class="text-3xl font-extrabold text-white mb-8 tracking-tight">Tổng quan Hệ thống</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div class="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between h-40 shadow-lg hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(59,130,246,0.15)] hover:border-blue-500/30 transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-400 transition-colors">Sách</p>
              <div class="p-2 bg-blue-500/10 text-blue-400 rounded-xl text-xl border border-blue-500/20"><i class="fa-solid fa-book w-6 text-center"></i></div>
            </div>
            <p class="text-4xl font-black text-white group-hover:text-blue-50 transition-colors">{{ stats.totalBooks }}</p>
          </div>
          
          <div class="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between h-40 shadow-lg hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.15)] hover:border-purple-500/30 transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-400 transition-colors">Lượt mượn</p>
              <div class="p-2 bg-purple-500/10 text-purple-400 rounded-xl text-xl border border-purple-500/20"><i class="fa-solid fa-hand-holding-hand w-6 text-center"></i></div>
            </div>
            <p class="text-4xl font-black text-white group-hover:text-purple-50 transition-colors">{{ stats.totalLoans }}</p>
          </div>

          <div class="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between h-40 shadow-lg hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(249,115,22,0.15)] hover:border-orange-500/30 transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-400 transition-colors">Đang mượn</p>
              <div class="p-2 bg-orange-500/10 text-orange-400 rounded-xl text-xl border border-orange-500/20"><i class="fa-solid fa-book-open-reader w-6 text-center"></i></div>
            </div>
            <p class="text-4xl font-black text-white group-hover:text-orange-50 transition-colors">{{ stats.activeLoans }}</p>
          </div>

          <div class="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-between h-40 shadow-lg hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-300 group">
            <div class="flex justify-between items-start">
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Độc giả</p>
              <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xl border border-emerald-500/20"><i class="fa-solid fa-users w-6 text-center"></i></div>
            </div>
            <p class="text-4xl font-black text-white group-hover:text-emerald-50 transition-colors">{{ stats.totalUsers }}</p>
          </div>
          
          <div class="bg-slate-800/90 rounded-3xl p-6 border border-red-500/30 flex flex-col justify-between h-40 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(239,68,68,0.2)] transition-all duration-300 group">
            <div class="absolute -right-4 -top-4 w-20 h-20 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/30 transition-colors"></div>
            <div class="flex justify-between items-start relative z-10">
              <p class="text-sm font-bold text-red-400 uppercase tracking-wider">Quá hạn</p>
              <div class="p-2 bg-red-500/20 text-red-400 rounded-xl text-xl border border-red-500/20"><i class="fa-solid fa-triangle-exclamation w-6 text-center"></i></div>
            </div>
            <p class="text-4xl font-black text-red-400 relative z-10 drop-shadow-md">{{ overdueLoans.length }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'BOOKS'" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Quản lý Sách</h1>
            <p class="text-slate-400 mt-1">Danh sách thông tin, giá bán và tình trạng kho.</p>
          </div>
          <div class="flex items-center gap-3 w-full lg:w-auto">
            <div class="relative flex-1 lg:w-72 group">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none group-focus-within:text-emerald-500 transition-colors">
                <i class="fa-solid fa-magnifying-glass"></i>
              </span>
              <input v-model="bookSearchQuery" type="text" placeholder="Tìm tên, mã sách..." class="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/80 text-white border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
            </div>
            <button @click="openBookModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 shrink-0 border border-emerald-500">
              <i class="fa-solid fa-plus"></i> <span class="hidden sm:inline">Thêm sách</span>
            </button>
          </div>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-260px)] overflow-y-auto overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse min-w-[1000px]">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700 w-24">Mã Sách</th>
                  <th class="p-5 font-bold border-b border-slate-700">Tên Sách & Tác Giả</th>
                  <th class="p-5 font-bold border-b border-slate-700">Danh mục</th>
                  <th class="p-5 font-bold border-b border-slate-700">Xuất bản</th>
                  <th class="p-5 font-bold border-b border-slate-700">Giá (VNĐ)</th>
                  <th class="p-5 font-bold text-center border-b border-slate-700">Số lượng</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="filteredBooksList.length === 0">
                  <td colspan="7" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Không tìm thấy cuốn sách nào!</td>
                </tr>
                <tr v-for="book in filteredBooksList" :key="book._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  <td class="p-5 font-black text-orange-400">{{ book.maSach || '---' }}</td>
                  <td class="p-5">
                    <div class="flex items-center gap-4">
                      <img v-if="book.image" :src="'http://localhost:5000/uploads/' + book.image" class="w-12 h-16 object-cover rounded-md shadow-sm border border-slate-600 group-hover:border-slate-500 transition-colors" />
                      <div v-else class="w-12 h-16 bg-slate-700/50 rounded-md flex items-center justify-center font-bold text-slate-500 border border-slate-600">Ảnh</div>
                      <div>
                        <p class="font-bold text-slate-200 text-base group-hover:text-emerald-400 transition-colors">{{ book.title }}</p>
                        <p class="text-xs text-slate-400 mt-0.5"><i class="fa-solid fa-pen-nib mr-1"></i>{{ book.author }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-5"><span class="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase shadow-inner">{{ book.category }}</span></td>
                  <td class="p-5">
                    <p class="font-bold text-slate-300">{{ getPublisherName(book.publisher) }}</p>
                    <p class="text-sm font-semibold text-slate-500 mt-0.5">Năm XB: {{ book.publishYear || '---' }}</p>
                  </td>
                  <td class="p-5 font-bold text-red-500 text-base tracking-wide">{{ book.price ? book.price.toLocaleString('vi-VN') + 'đ' : '0đ' }}</td>
                  <td class="p-5 text-center">
                    <span v-if="book.quantity > 0" class="font-black text-emerald-400 text-lg">{{ book.quantity }}</span>
                    <span v-else class="font-bold text-red-500 text-xs bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg uppercase tracking-wider">Hết sách</span>
                  </td>
                  <td class="p-5 text-right space-x-3">
                    <button @click="openBookModal(book)" class="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-pen mr-1"></i> Sửa</button>
                    <button @click="deleteBook(book._id)" class="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-trash mr-1"></i> Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'CATEGORIES'" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Danh mục sách</h1>
            <p class="text-slate-400 mt-1">Phân loại sách để dễ dàng tra cứu.</p>
          </div>
          <button @click="openCategoryModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 shrink-0 border border-emerald-500">
            <i class="fa-solid fa-plus"></i> <span class="hidden sm:inline">Thêm danh mục</span>
          </button>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700 w-32">Mã DM</th>
                  <th class="p-5 font-bold border-b border-slate-700">Tên Danh Mục</th>
                  <th class="p-5 font-bold text-center border-b border-slate-700">Số sách thuộc DM</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="categoriesWithCount.length === 0">
                  <td colspan="4" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Chưa có danh mục nào.</td>
                </tr>
                <tr v-for="cat in categoriesWithCount" :key="cat._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  <td class="p-5 font-black text-orange-400">{{ cat.maDanhMuc || '---' }}</td>
                  <td class="p-5 font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{{ cat.tenDanhMuc }}</td>
                  <td class="p-5 text-center">
                    <span class="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-black">{{ cat.count }} cuốn</span>
                  </td>
                  <td class="p-5 text-right space-x-3">
                    <button @click="openCategoryModal(cat)" class="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-pen mr-1"></i> Sửa</button>
                    <button @click="deleteCategory(cat)" class="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-trash mr-1"></i> Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'PUBLISHERS'" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Nhà Xuất Bản</h1>
            <p class="text-slate-400 mt-1">Thông tin các đơn vị phát hành sách.</p>
          </div>
          <button @click="openPublisherModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 shrink-0 border border-emerald-500">
            <i class="fa-solid fa-plus"></i> <span class="hidden sm:inline">Thêm NXB</span>
          </button>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700 w-32">Mã NXB</th>
                  <th class="p-5 font-bold border-b border-slate-700">Tên Nhà Xuất Bản</th>
                  <th class="p-5 font-bold border-b border-slate-700">Địa chỉ</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="publishers.length === 0">
                  <td colspan="4" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Chưa có Nhà xuất bản nào.</td>
                </tr>
                <tr v-for="nxb in publishers" :key="nxb._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  <td class="p-5 font-black text-orange-400">{{ nxb.maNXB || '---' }}</td>
                  <td class="p-5 font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{{ nxb.tenNXB }}</td>
                  <td class="p-5 text-slate-400"><i class="fa-solid fa-location-dot text-emerald-500 mr-2 text-xs"></i>{{ nxb.diaChi || '---' }}</td>
                  <td class="p-5 text-right space-x-3">
                    <button @click="openPublisherModal(nxb)" class="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-pen mr-1"></i> Sửa</button>
                    <button @click="deletePublisher(nxb._id)" class="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-trash mr-1"></i> Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'LOANS'" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Mượn / Trả Sách</h1>
            <p class="text-slate-400 mt-1">Duyệt đơn và quản lý thu hồi sách.</p>
          </div>
          <div class="flex space-x-2 bg-slate-800/80 p-1.5 rounded-xl w-max border border-slate-700 overflow-x-auto max-w-full backdrop-blur-sm">
            <button @click="loanTab = 'PENDING'" :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap', loanTab === 'PENDING' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700']">Chờ duyệt <span class="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ pendingLoans.length }}</span></button>
            <button @click="loanTab = 'APPROVED'" :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap', loanTab === 'APPROVED' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700']">Đang mượn <span class="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ activeLoans.length }}</span></button>
            <button @click="loanTab = 'OVERDUE'" :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap', loanTab === 'OVERDUE' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700']">Quá hạn <span class="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ overdueLoans.length }}</span></button>
            <button @click="loanTab = 'HISTORY'" :class="['px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap', loanTab === 'HISTORY' ? 'bg-slate-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700']">Lịch sử</button>
          </div>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700">Độc giả</th>
                  <th class="p-5 font-bold border-b border-slate-700">Sách</th>
                  <th class="p-5 font-bold border-b border-slate-700">Thời gian (Mượn - Hạn)</th>
                  <th class="p-5 font-bold border-b border-slate-700 text-center w-32">Ngày trả thực tế</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="filteredLoans.length === 0"><td colspan="5" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Không có dữ liệu trong mục này.</td></tr>
                
                <tr v-for="loan in filteredLoans" :key="loan._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  
                  <td class="p-5">
                    <p class="font-bold text-slate-200 group-hover:text-white transition-colors">{{ loan.userId?.username || 'Đã xóa' }}</p>
                    <p class="text-sm text-blue-300 mt-0.5 font-medium">{{ loan.userId?.email }}</p>
                  </td>
                  
                  <td class="p-5">
                    <div class="flex items-center gap-3">
                      <img v-if="loan.bookId?.image" :src="'http://localhost:5000/uploads/' + loan.bookId.image" class="w-10 h-14 object-cover rounded-md border border-slate-600 shadow-sm" />
                      <div v-else class="w-10 h-14 bg-slate-700/50 rounded-md flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-600">Ảnh</div>
                      <p class="font-bold text-emerald-400 max-w-[200px] truncate" :title="loan.bookId?.title">{{ loan.bookId?.title || 'Sách đã xóa' }}</p>
                    </div>
                  </td>
                  
                  <td class="p-5 space-y-1 text-sm font-medium">
                    <p class="text-slate-300"><i class="fa-regular fa-calendar mr-1.5 text-slate-500"></i> Mượn: <span class="text-white">{{ formatDate(loan.createdAt) }}</span></p>
                    <p :class="[(loan.status === 'APPROVED' && isOverdue(loan.dueDate)) ? 'text-red-400 font-bold' : 'text-slate-300']">
                      <i class="fa-regular fa-calendar-check mr-1.5 text-slate-500"></i> Hạn: <span :class="{'text-white' : loan.status !== 'APPROVED' || !isOverdue(loan.dueDate)}">{{ formatDate(loan.dueDate) }}</span>
                    </p>
                  </td>

                  <td class="p-5 text-center font-medium">
                    <template v-if="loan.status === 'COMPLETED'">
                      <span class="text-emerald-400 font-black text-[13px] tracking-wide">{{ formatDate(loan.updatedAt) }}</span>
                    </template>
                    <template v-else-if="loan.status === 'APPROVED'">
                      <span class="text-orange-400 font-bold text-xs uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md">Chưa trả</span>
                    </template>
                    <template v-else-if="loan.status === 'PENDING'">
                      <span class="text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">Chờ duyệt</span>
                    </template>
                    <template v-else>
                      <span class="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-md">Đã hủy</span>
                    </template>
                  </td>

                  <td class="p-5 text-right">
                    <template v-if="loan.status === 'PENDING'">
                      <button @click="updateLoan(loan._id, 'APPROVED')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold mr-2 hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95"><i class="fa-solid fa-check mr-1"></i> Duyệt</button>
                      <button @click="updateLoan(loan._id, 'REJECTED')" class="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"><i class="fa-solid fa-xmark mr-1"></i> Từ chối</button>
                    </template>
                    <template v-else-if="loan.status === 'APPROVED'">
                      <button @click="updateLoan(loan._id, 'COMPLETED')" class="bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all active:scale-95"><i class="fa-solid fa-box-open mr-1"></i> Đã thu hồi</button>
                    </template>
                    <span v-else-if="loan.status === 'COMPLETED'" class="text-xs font-bold text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">Hoàn thành</span>
                    <span v-else class="text-xs font-bold text-red-500 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">Đã từ chối</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'USERS'" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Quản lý Độc giả</h1>
          <p class="text-slate-400 mt-1 font-medium">Khóa tài khoản và theo dõi lịch sử mượn sách.</p>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-200px)] overflow-x-auto overflow-y-auto custom-scrollbar">
            <table class="w-full text-left border-collapse min-w-[1100px]">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700">Mã ĐG</th>
                  <th class="p-5 font-bold border-b border-slate-700">Họ và Tên / Email</th>
                  <th class="p-5 font-bold text-center border-b border-slate-700">Phái & Ngày Sinh</th>
                  <th class="p-5 font-bold border-b border-slate-700">Liên hệ</th>
                  <th class="p-5 font-bold text-center border-b border-slate-700">Trạng thái</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="users.length === 0">
                  <td colspan="6" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Chưa có độc giả nào tham gia.</td>
                </tr>
                <tr v-for="user in users" :key="user._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  
                  <td class="p-5 font-black text-emerald-400">{{ user.maDocGia || '---' }}</td>
                  
                  <td class="p-5">
                    <p class="font-bold text-slate-200 group-hover:text-white transition-colors">{{ user.fullName }}</p>
                    <p class="text-sm text-blue-300 mt-0.5 font-medium">{{ user.email }}</p>
                  </td>

                  <td class="p-5 text-center">
                    <span :class="['px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-inner mb-1 inline-block', 
                      user.phai === 'Nam' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      user.phai === 'Nữ' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 
                      'bg-slate-500/10 text-slate-400 border-slate-500/20']">
                      {{ user.phai || 'Khác' }}
                    </span>
                    <p class="text-slate-300 font-medium text-xs mt-1">{{ user.ngaySinh ? formatDate(user.ngaySinh) : '---' }}</p>
                  </td>

                  <td class="p-5">
                    <div class="flex flex-col gap-1">
                      <p class="text-slate-200 font-bold flex items-center gap-2">
                        <i class="fa-solid fa-phone text-[10px] text-emerald-500 w-3"></i> {{ user.dienThoai || '---' }}
                      </p>
                      <p class="text-xs text-slate-500 italic max-w-[200px] truncate" :title="user.diaChi">
                        <i class="fa-solid fa-location-dot text-[10px] w-3"></i> {{ user.diaChi || '---' }}
                      </p>
                    </div>
                  </td>

                  <td class="p-5 text-center">
                    <span :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-inner', user.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20']">
                      {{ user.isActive !== false ? 'Hoạt động' : 'Đã khóa' }}
                    </span>
                  </td>

                  <td class="p-5 text-right space-x-2">
                    <button @click="openHistoryModal(user)" class="px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border-blue-500/30 shadow-sm hover:shadow-blue-500/20 active:scale-95">
                      <i class="fa-solid fa-clock-rotate-left mr-1"></i> Xem lịch sử
                    </button>

                    <button @click="toggleUserStatus(user)" :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all border active:scale-95', user.isActive !== false ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border-red-500/30 shadow-sm hover:shadow-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border-emerald-500/30 shadow-sm hover:shadow-emerald-500/20']">
                      <i :class="user.isActive !== false ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'" class="mr-1"></i>
                      {{ user.isActive !== false ? 'Khóa tài khoản' : 'Mở khóa' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else-if="activeModule === 'EMPLOYEES' && isSuperAdmin" class="animate-[fadeIn_0.3s_ease-out]">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Quản lý Nhân Viên</h1>
            <p class="text-slate-400 mt-1">Quản trị danh sách nhân sự của thư viện.</p>
          </div>
          <button @click="openEmployeeModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 shrink-0 border border-emerald-500">
            <i class="fa-solid fa-user-plus"></i> <span class="hidden sm:inline">Thêm Nhân viên</span>
          </button>
        </div>

        <div class="bg-slate-800/80 rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                <tr>
                  <th class="p-5 font-bold border-b border-slate-700 w-32">Mã NV</th>
                  <th class="p-5 font-bold border-b border-slate-700">Họ Tên</th>
                  <th class="p-5 font-bold text-center border-b border-slate-700">Chức vụ</th>
                  <th class="p-5 font-bold border-b border-slate-700">Liên hệ</th>
                  <th class="p-5 font-bold text-right border-b border-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-if="employees.length === 0">
                  <td colspan="5" class="p-12 text-center text-slate-500 font-medium bg-slate-800/50">Chưa có Nhân viên nào.</td>
                </tr>
                <tr v-for="emp in employees" :key="emp._id" class="even:bg-slate-800/40 odd:bg-slate-800/10 hover:!bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-0 group">
                  <td class="p-5 font-black text-orange-400">{{ emp.MSNV || '---' }}</td>
                  <td class="p-5 font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{{ emp.HoTenNV }}</td>
                  <td class="p-5 text-center">
                    <span class="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-black uppercase tracking-wider text-[10px]">{{ emp.ChucVu }}</span>
                  </td>
                  <td class="p-5">
                    <div class="flex flex-col gap-1">
                      <p class="text-slate-200 font-bold flex items-center gap-2">
                        <i class="fa-solid fa-phone text-[10px] text-emerald-500 w-3"></i> {{ emp.SoDienThoai || '---' }}
                      </p>
                      <p class="text-xs text-slate-500 italic max-w-[200px] truncate" :title="emp.DiaChi">
                        <i class="fa-solid fa-location-dot text-[10px] w-3"></i> {{ emp.DiaChi || '---' }}
                      </p>
                    </div>
                  </td>
                  <td class="p-5 text-right space-x-3">
                    <button @click="openEmployeeModal(emp)" class="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-pen mr-1"></i> Sửa</button>
                    <button v-if="emp.MSNV !== 'admin'" @click="deleteEmployee(emp._id)" class="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline"><i class="fa-solid fa-trash mr-1"></i> Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>

    <button 
      @click="scrollToTop" 
      class="fixed bottom-8 right-8 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 z-50 focus:outline-none border border-emerald-400"
      :class="showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>

    <div v-if="showHistoryModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-3xl border border-slate-600 overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        <div class="bg-slate-800/80 p-6 text-white flex justify-between items-center border-b border-slate-700 shrink-0">
          <div>
            <h3 class="font-black text-2xl text-blue-400 tracking-tight">Lịch sử mượn sách</h3>
            <p class="text-slate-400 mt-1 font-medium">Độc giả: <span class="text-white font-bold ml-1">{{ selectedUserName }}</span></p>
          </div>
          <button @click="showHistoryModal = false" class="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div v-if="selectedUserHistory.length === 0" class="text-center py-12">
            <div class="text-5xl text-slate-600 mb-4"><i class="fa-solid fa-folder-open"></i></div>
            <p class="text-slate-400 font-medium text-lg">Độc giả này chưa mượn cuốn sách nào.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="loan in selectedUserHistory" :key="loan._id" class="bg-slate-900/50 rounded-2xl p-4 border border-slate-700 flex gap-5 items-center hover:bg-slate-900 transition-colors group">
              
              <div class="w-16 h-24 bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-600 shadow-md">
                <img v-if="loan.bookId?.image" :src="'http://localhost:5000/uploads/' + loan.bookId.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-500 font-bold">Ảnh</div>
              </div>
              
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <h4 class="font-bold text-slate-200 text-lg truncate group-hover:text-blue-400 transition-colors mb-2">{{ loan.bookId?.title || 'Sách đã xóa' }}</h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div class="text-slate-400">
                    <p class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-0.5">Ngày mượn</p>
                    <p class="font-medium text-slate-200">{{ formatDate(loan.createdAt) }}</p>
                  </div>
                  <div class="text-slate-400">
                    <p class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-0.5">Hạn trả</p>
                    <p class="font-medium text-slate-200">{{ formatDate(loan.dueDate) }}</p>
                  </div>
                  <div class="text-slate-400">
                    <p class="text-xs uppercase tracking-wider font-bold text-slate-500 mb-0.5">Thực tế trả</p>
                    <p v-if="loan.status === 'COMPLETED'" class="font-bold text-emerald-400">{{ formatDate(loan.updatedAt) }}</p>
                    <p v-else-if="loan.status === 'REJECTED'" class="font-bold text-slate-500">Đã hủy</p>
                    <p v-else class="font-bold text-orange-400">Chưa trả</p>
                  </div>
                </div>
              </div>
              
              <div class="shrink-0 text-right w-24">
                <span v-if="loan.status === 'COMPLETED'" class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner block text-center">Đã trả</span>
                <span v-else-if="loan.status === 'APPROVED' && isOverdue(loan.dueDate)" class="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner block text-center">Quá hạn</span>
                <span v-else-if="loan.status === 'APPROVED'" class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner block text-center">Đang mượn</span>
                <span v-else-if="loan.status === 'PENDING'" class="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner block text-center">Chờ duyệt</span>
                <span v-else class="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-inner block text-center">Từ chối</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-5 border-t border-slate-700 flex justify-end shrink-0 bg-slate-800/80">
          <button @click="showHistoryModal = false" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95 border border-slate-600">Đóng cửa sổ</button>
        </div>
      </div>
    </div>

    <div v-if="showBookModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-xl border border-slate-600 overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        
        <div class="bg-slate-800/90 p-6 text-white flex justify-between items-center border-b border-slate-700 shrink-0 sticky top-0 z-10 backdrop-blur-md">
          <h3 class="font-black text-xl text-emerald-400 tracking-tight">{{ isEditing ? 'Sửa thông tin sách' : 'Thêm sách mới' }}</h3>
          <button @click="showBookModal = false" class="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-800">
          <form @submit.prevent="saveBook" id="bookFormId" class="space-y-5">
            
            <div>
              <label class="block text-sm font-bold text-slate-300 mb-2">Ảnh bìa sách</label>
              <div class="flex items-center gap-4">
                <div class="w-16 h-20 bg-slate-900 rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                  <img v-else-if="bookForm.image" :src="'http://localhost:5000/uploads/' + bookForm.image" class="w-full h-full object-cover" />
                  <i v-else class="fa-solid fa-image text-slate-500 text-xl"></i>
                </div>
                <input 
                  type="file" 
                  @change="handleFileUpload" 
                  accept="image/*" 
                  class="w-full px-3 py-2 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 transition-all outline-none" 
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-300 mb-1.5">Tên sách <span class="text-red-500">*</span></label>
              <input v-model="bookForm.title" type="text" required placeholder="Nhập tên sách..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
            </div>
            
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Tác giả <span class="text-red-500">*</span></label>
                <input v-model="bookForm.author" type="text" required placeholder="Nhập tác giả..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Thể loại (Danh mục) <span class="text-red-500">*</span></label>
                <select v-model="bookForm.category" required class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner">
                  <option value="">-- Chọn danh mục --</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat.tenDanhMuc">{{ cat.tenDanhMuc }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Nhà xuất bản <span class="text-red-500">*</span></label>
                <select v-model="bookForm.publisher" required class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner">
                  <option value="">-- Chọn NXB --</option>
                  <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">{{ nxb.tenNXB }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Năm xuất bản</label>
                <input v-model="bookForm.publishYear" type="number" placeholder="VD: 2024" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Số lượng <span class="text-red-500">*</span></label>
                <input v-model="bookForm.quantity" type="number" min="0" required class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Đơn giá (VNĐ) <span class="text-red-500">*</span></label>
                <input 
                  v-model="bookForm.price" 
                  type="number" 
                  min="0" 
                  step="1000" 
                  required 
                  placeholder="VD: 50000" 
                  class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-slate-300 mb-1.5">Mô tả ngắn</label>
              <textarea v-model="bookForm.description" rows="3" placeholder="Nhập giới thiệu về sách..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner"></textarea>
            </div>
            
          </form>
        </div>

        <div class="p-5 border-t border-slate-700 flex justify-end gap-3 shrink-0 bg-slate-800/90 sticky bottom-0 z-10 backdrop-blur-md">
          <button type="button" @click="showBookModal = false" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95">Hủy bỏ</button>
          <button type="submit" form="bookFormId" class="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 border border-emerald-500">
            <i class="fa-solid fa-floppy-disk"></i> Lưu sách
          </button>
        </div>

      </div>
    </div>

    <div v-if="showCategoryModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-600 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-slate-800/90 p-6 text-white flex justify-between items-center border-b border-slate-700 shrink-0">
          <h3 class="font-black text-xl text-emerald-400 tracking-tight">{{ isEditingCategory ? 'Sửa Danh mục' : 'Thêm Danh mục' }}</h3>
          <button @click="showCategoryModal = false" class="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        <form @submit.prevent="saveCategory" class="p-6 md:p-8 space-y-5 bg-slate-800">
          <div>
            <label class="block text-sm font-bold text-slate-300 mb-1.5">Tên Danh mục <span class="text-red-500">*</span></label>
            <input v-model="categoryForm.tenDanhMuc" type="text" required placeholder="VD: Sách Lịch Sử..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showCategoryModal = false" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95">Hủy</button>
            <button type="submit" class="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showPublisherModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-600 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div class="bg-slate-800/90 p-6 text-white flex justify-between items-center border-b border-slate-700 shrink-0">
          <h3 class="font-black text-xl text-emerald-400 tracking-tight">{{ isEditingPublisher ? 'Sửa Nhà Xuất Bản' : 'Thêm NXB' }}</h3>
          <button @click="showPublisherModal = false" class="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        <form @submit.prevent="savePublisher" class="p-6 md:p-8 space-y-5 bg-slate-800">
          <div>
            <label class="block text-sm font-bold text-slate-300 mb-1.5">Tên NXB <span class="text-red-500">*</span></label>
            <input v-model="publisherForm.tenNXB" type="text" required placeholder="VD: NXB Trẻ..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-300 mb-1.5">Địa chỉ</label>
            <input v-model="publisherForm.diaChi" type="text" placeholder="Nhập địa chỉ..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all placeholder:text-slate-500 shadow-inner" />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showPublisherModal = false" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95">Hủy</button>
            <button type="submit" class="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEmployeeModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-xl border border-slate-600 overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        <div class="bg-slate-800/90 p-6 text-white flex justify-between items-center border-b border-slate-700 shrink-0 sticky top-0 z-10 backdrop-blur-md">
          <h3 class="font-black text-xl text-emerald-400 tracking-tight">{{ isEditingEmployee ? 'Sửa thông tin Nhân viên' : 'Thêm Nhân viên mới' }}</h3>
          <button @click="showEmployeeModal = false" class="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-800">
          <form @submit.prevent="saveEmployee" id="employeeFormId" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-300 mb-1.5">Họ và Tên NV <span class="text-red-500">*</span></label>
              <input v-model="employeeForm.HoTenNV" type="text" required placeholder="Nhập họ tên nhân viên..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" />
            </div>
            
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Mật khẩu đăng nhập <span v-if="!isEditingEmployee" class="text-red-500">*</span></label>
                <input v-model="employeeForm.Password" type="text" :required="!isEditingEmployee" :placeholder="isEditingEmployee ? 'Bỏ trống nếu không đổi' : 'Nhập mật khẩu...'" class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Chức vụ <span class="text-red-500">*</span></label>
                <select v-model="employeeForm.ChucVu" required class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner">
                  <option value="Quản lý">Quản lý</option>
                  <option value="Thủ thư">Thủ thư</option>
                  <option value="Nhân viên">Nhân viên</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Số điện thoại</label>
                <input v-model="employeeForm.SoDienThoai" type="text" placeholder="Nhập SĐT..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-300 mb-1.5">Địa chỉ</label>
                <input v-model="employeeForm.DiaChi" type="text" placeholder="Nhập địa chỉ..." class="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all shadow-inner" />
              </div>
            </div>
          </form>
        </div>

        <div class="p-5 border-t border-slate-700 flex justify-end gap-3 shrink-0 bg-slate-800/90 sticky bottom-0 z-10 backdrop-blur-md">
          <button type="button" @click="showEmployeeModal = false" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors active:scale-95">Hủy bỏ</button>
          <button type="submit" form="employeeFormId" class="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 border border-emerald-500">
            <i class="fa-solid fa-floppy-disk"></i> Lưu
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const adminName = ref('');
const adminRole = ref('Nhân viên thư viện'); // 👉 HIỂN THỊ CHỨC VỤ

// 👉 BIẾN PHÂN QUYỀN
const isSuperAdmin = ref(false);

// Điều khiển Giao diện
const activeModule = ref('DASHBOARD');
const loanTab = ref('PENDING');
const showBackToTop = ref(false);

// Dữ liệu Hệ thống
const stats = ref({ totalBooks: 0, totalLoans: 0, activeLoans: 0, totalUsers: 0 });
const books = ref([]);
const loans = ref([]);
const users = ref([]);
const categories = ref([]); 
const publishers = ref([]); 
const employees = ref([]); 

// QUẢN LÝ MODAL SÁCH
const showBookModal = ref(false);
const isEditing = ref(false);
const bookForm = ref({ title: '', author: '', category: '', quantity: 1, price: 0, image: '', description: '', publisher: '', publishYear: '' });
let currentBookId = null;

// File Upload Sách
const selectedFile = ref(null);
const imagePreview = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file); 
  } else {
    selectedFile.value = null;
    imagePreview.value = null;
  }
};

// QUẢN LÝ MODAL DANH MỤC
const showCategoryModal = ref(false);
const isEditingCategory = ref(false);
const categoryForm = ref({ tenDanhMuc: '' });
let currentCategoryId = null;

// Tính toán số lượng sách cho mỗi danh mục
const categoriesWithCount = computed(() => {
  return categories.value.map(cat => ({
    ...cat,
    count: books.value.filter(b => b.category === cat.tenDanhMuc).length
  }));
});

// QUẢN LÝ MODAL NHÀ XUẤT BẢN
const showPublisherModal = ref(false);
const isEditingPublisher = ref(false);
const publisherForm = ref({ tenNXB: '', diaChi: '' });
let currentPublisherId = null;

// 👉 QUẢN LÝ MODAL NHÂN VIÊN
const showEmployeeModal = ref(false);
const isEditingEmployee = ref(false);
const employeeForm = ref({ HoTenNV: '', Password: '', ChucVu: 'Nhân viên', DiaChi: '', SoDienThoai: '' });
let currentEmployeeId = null;

// Modal Lịch sử Độc giả
const showHistoryModal = ref(false);
const selectedUserHistory = ref([]);
const selectedUserName = ref('');

const bookSearchQuery = ref('');

// ==============================================================
// WATCHER (Chặn truy cập Module Nhân viên)
// ==============================================================
watch(activeModule, (newVal) => {
  if (newVal === 'EMPLOYEES' && !isSuperAdmin.value) {
    alert("Bạn không có quyền truy cập chức năng quản trị nhân sự!");
    activeModule.value = 'DASHBOARD';
  }
});

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300; 
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==============================================================
// FETCH DATA
// ==============================================================
const fetchData = async () => {
  try {
    const resB = await fetch('http://localhost:5000/api/books');
    const dataB = await resB.json();
    if(dataB.success) books.value = dataB.data;
  } catch (e) { console.error(e); }

  try {
    const resL = await fetch('http://localhost:5000/api/admin/loans');
    const dataL = await resL.json();
    if(dataL.success) loans.value = dataL.data;
  } catch (e) { console.error(e); }

  try {
    const resU = await fetch('http://localhost:5000/api/admin/users');
    const dataU = await resU.json();
    if(dataU.success) users.value = dataU.data;
  } catch (e) { console.error(e); }

  try {
    const resS = await fetch('http://localhost:5000/api/admin/stats');
    const dataS = await resS.json();
    if(dataS.success) stats.value = dataS.data;
  } catch (e) { console.error(e); }

  try {
    const resCat = await fetch('http://localhost:5000/api/admin/categories');
    const dataCat = await resCat.json();
    if(dataCat.success) categories.value = dataCat.data;
  } catch (e) { console.warn("Chưa có API Categories", e); }

  try {
    const resPub = await fetch('http://localhost:5000/api/admin/publishers');
    const dataPub = await resPub.json();
    if(dataPub.success) publishers.value = dataPub.data;
  } catch (e) { console.warn("Chưa có API Publishers", e); }

  // 👉 Lấy danh sách Nhân viên và bóc tách CHỨC VỤ
  try {
    const resEmp = await fetch('http://localhost:5000/api/admin/employees');
    const dataEmp = await resEmp.json();
    if(dataEmp.success) {
      employees.value = dataEmp.data;
      
      const myId = localStorage.getItem('userId');
      const myProfile = employees.value.find(emp => emp._id === myId);
      
      if (myProfile) {
        adminRole.value = myProfile.ChucVu; // Hiển thị Thủ thư, Nhân viên...
        isSuperAdmin.value = (myProfile.MSNV === 'admin' || myProfile.ChucVu === 'Quản lý');
      } else if (adminName.value === 'Thủ Thư Hệ Thống' || adminName.value === 'Thủ Thư Chính' || adminName.value === 'admin') {
        adminRole.value = 'Quản lý';
        isSuperAdmin.value = true;
      } else {
        adminRole.value = 'Nhân viên';
      }
    }
  } catch (e) { console.warn("Chưa có API Employees", e); }
};

// ==============================================================
// LOGIC SÁCH
// ==============================================================
const getPublisherName = (pubId) => {
  const pub = publishers.value.find(p => p._id === pubId || p.tenNXB === pubId);
  return pub ? pub.tenNXB : pubId; 
};

const openBookModal = (book = null) => {
  selectedFile.value = null;
  imagePreview.value = null;

  if (book) {
    isEditing.value = true;
    currentBookId = book._id;
    bookForm.value = { ...book, price: book.price || 0 };
  } else {
    isEditing.value = false;
    currentBookId = null;
    bookForm.value = { title: '', author: '', category: '', quantity: 1, price: 0, image: '', description: '', publisher: '', publishYear: '' };
  }
  showBookModal.value = true;
};

const saveBook = async () => {
  const method = isEditing.value ? 'PUT' : 'POST';
  const url = isEditing.value ? `http://localhost:5000/api/admin/books/${currentBookId}` : 'http://localhost:5000/api/admin/books';
  
  const formData = new FormData();
  formData.append('title', bookForm.value.title);
  formData.append('author', bookForm.value.author);
  formData.append('category', bookForm.value.category);
  formData.append('quantity', bookForm.value.quantity);
  formData.append('price', bookForm.value.price);
  formData.append('description', bookForm.value.description || '');
  formData.append('publisher', bookForm.value.publisher || '');
  formData.append('publishYear', bookForm.value.publishYear || '');

  if (selectedFile.value) {
    formData.append('image', selectedFile.value);
  } else {
    formData.append('image', bookForm.value.image || '');
  }

  try {
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    if(data.success) {
      alert(isEditing.value ? 'Cập nhật thành công!' : 'Thêm sách thành công!');
      showBookModal.value = false;
      fetchData(); 
    } else { alert(data.message); }
  } catch (e) { alert("Lỗi kết nối"); }
};

const deleteBook = async (id) => {
  if(!confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/books/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if(data.success) { alert("Xóa thành công!"); fetchData(); }
  } catch (e) { alert("Lỗi kết nối"); }
};

// ==============================================================
// LOGIC DANH MỤC & NXB
// ==============================================================
const openCategoryModal = (cat = null) => {
  if (cat) {
    isEditingCategory.value = true;
    currentCategoryId = cat._id;
    categoryForm.value = { ...cat };
  } else {
    isEditingCategory.value = false;
    currentCategoryId = null;
    categoryForm.value = { tenDanhMuc: '' };
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  const method = isEditingCategory.value ? 'PUT' : 'POST';
  const url = isEditingCategory.value ? `http://localhost:5000/api/admin/categories/${currentCategoryId}` : 'http://localhost:5000/api/admin/categories';
  try {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryForm.value) });
    const data = await res.json();
    if(data.success) { alert('Thành công!'); showCategoryModal.value = false; fetchData(); } else { alert(data.message); }
  } catch (e) { alert("Lỗi kết nối"); }
};

const deleteCategory = async (cat) => {
  if (cat.count > 0) { alert(`Không thể xóa! Danh mục này đang chứa ${cat.count} cuốn sách.`); return; }
  if(!confirm(`Bạn chắc chắn muốn xóa danh mục: ${cat.tenDanhMuc}?`)) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/categories/${cat._id}`, { method: 'DELETE' });
    const data = await res.json();
    if(data.success) { alert("Xóa thành công!"); fetchData(); }
  } catch (e) { alert("Lỗi kết nối"); }
};

const openPublisherModal = (nxb = null) => {
  if (nxb) {
    isEditingPublisher.value = true;
    currentPublisherId = nxb._id;
    publisherForm.value = { ...nxb };
  } else {
    isEditingPublisher.value = false;
    currentPublisherId = null;
    publisherForm.value = { tenNXB: '', diaChi: '' };
  }
  showPublisherModal.value = true;
};

const savePublisher = async () => {
  const method = isEditingPublisher.value ? 'PUT' : 'POST';
  const url = isEditingPublisher.value ? `http://localhost:5000/api/admin/publishers/${currentPublisherId}` : 'http://localhost:5000/api/admin/publishers';
  try {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(publisherForm.value) });
    const data = await res.json();
    if(data.success) { alert('Thành công!'); showPublisherModal.value = false; fetchData(); } else { alert(data.message); }
  } catch (e) { alert("Lỗi kết nối"); }
};

const deletePublisher = async (id) => {
  if(!confirm("Bạn có chắc chắn muốn xóa Nhà Xuất Bản này?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/publishers/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if(data.success) { alert("Xóa thành công!"); fetchData(); }
  } catch (e) { alert("Lỗi kết nối"); }
};

// ==============================================================
// 👉 LOGIC NHÂN VIÊN
// ==============================================================
const openEmployeeModal = (emp = null) => {
  if (emp) {
    isEditingEmployee.value = true;
    currentEmployeeId = emp._id;
    employeeForm.value = { HoTenNV: emp.HoTenNV, Password: '', ChucVu: emp.ChucVu, DiaChi: emp.DiaChi || '', SoDienThoai: emp.SoDienThoai || '' };
  } else {
    isEditingEmployee.value = false;
    currentEmployeeId = null;
    employeeForm.value = { HoTenNV: '', Password: '', ChucVu: 'Nhân viên', DiaChi: '', SoDienThoai: '' };
  }
  showEmployeeModal.value = true;
};

const saveEmployee = async () => {
  const method = isEditingEmployee.value ? 'PUT' : 'POST';
  const url = isEditingEmployee.value ? `http://localhost:5000/api/admin/employees/${currentEmployeeId}` : 'http://localhost:5000/api/admin/employees';
  try {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(employeeForm.value) });
    const data = await res.json();
    if(data.success) { 
      alert('Thành công!'); 
      showEmployeeModal.value = false; 

      if (isEditingEmployee.value && currentEmployeeId === localStorage.getItem('userId')) {
        adminName.value = employeeForm.value.HoTenNV;
        adminRole.value = employeeForm.value.ChucVu;
        localStorage.setItem('username', employeeForm.value.HoTenNV);
        
        if (employeeForm.value.ChucVu !== 'Quản lý' && employeeForm.value.MSNV !== 'admin') {
          isSuperAdmin.value = false;
          if (activeModule.value === 'EMPLOYEES') activeModule.value = 'DASHBOARD';
        }
      }

      fetchData(); 
    } else { 
      alert(data.message); 
    }
  } catch (e) { alert("Lỗi kết nối"); }
};

const deleteEmployee = async (id) => {
  if(!confirm("Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?")) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/employees/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if(data.success) { alert("Xóa thành công!"); fetchData(); } else { alert(data.message); }
  } catch (e) { alert("Lỗi kết nối"); }
};

// ==============================================================
// CÁC HÀM CÒN LẠI (MƯỢN TRẢ, USERS, ETC)
// ==============================================================
const updateLoan = async (loanId, newStatus) => {
  let actionName = newStatus === 'APPROVED' ? 'Duyệt' : newStatus === 'REJECTED' ? 'Từ chối' : 'Xác nhận thu hồi';
  if(!confirm(`Xác nhận ${actionName} đơn này?`)) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/loans/${loanId}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
    });
    if(res.ok) fetchData();
  } catch (e) { alert("Lỗi kết nối"); }
};

const toggleUserStatus = async (user) => {
  const action = user.isActive !== false ? "KHÓA" : "MỞ KHÓA";
  if(!confirm(`Xác nhận ${action} tài khoản này?`)) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${user._id}/toggle-lock`, { method: 'PUT' });
    if(res.ok) fetchData();
  } catch (e) { alert("Lỗi kết nối"); }
};

const openHistoryModal = (user) => {
  selectedUserName.value = user.fullName || user.username || 'Không xác định';
  selectedUserHistory.value = loans.value.filter(loan => {
    return loan.userId && (loan.userId._id === user._id || loan.userId === user._id);
  });
  showHistoryModal.value = true;
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const filteredBooksList = computed(() => {
  if (!bookSearchQuery.value) return books.value;
  const query = bookSearchQuery.value.toLowerCase();
  return books.value.filter(b => b.title.toLowerCase().includes(query) || (b.maSach && b.maSach.toLowerCase().includes(query)));
});

const pendingLoans = computed(() => loans.value.filter(l => l.status === 'PENDING'));
const activeLoans = computed(() => loans.value.filter(l => l.status === 'APPROVED'));
const historyLoans = computed(() => loans.value.filter(l => ['COMPLETED', 'REJECTED'].includes(l.status)));
const overdueLoans = computed(() => loans.value.filter(l => l.status === 'APPROVED' && isOverdue(l.dueDate)));

const filteredLoans = computed(() => {
  if (loanTab.value === 'PENDING') return pendingLoans.value;
  if (loanTab.value === 'APPROVED') return activeLoans.value;
  if (loanTab.value === 'OVERDUE') return overdueLoans.value; 
  return historyLoans.value;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const handleLogout = () => {
  localStorage.clear();
  router.push('/login');
};

onMounted(() => {
  if(localStorage.getItem('role') !== 'ADMIN') {
    alert("Khu vực cấm!");
    router.push('/');
    return;
  }
  
  const currentName = localStorage.getItem('username') || 'Admin';
  adminName.value = currentName;

  // Gán tạm chức vụ trước khi fetch dữ liệu xong
  if (currentName === 'Thủ Thư Hệ Thống' || currentName === 'Thủ Thư Chính' || currentName === 'admin') {
    isSuperAdmin.value = true;
    adminRole.value = 'Quản lý';
  } else {
    adminRole.value = 'Đang tải...';
  }

  fetchData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { 
  width: 6px; 
}
.custom-scrollbar::-webkit-scrollbar-track { 
  background: rgba(15, 23, 42, 0.3); 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background-color: rgba(51, 65, 85, 0.8); 
  border-radius: 8px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
  background-color: rgba(71, 85, 105, 1); 
}
</style>