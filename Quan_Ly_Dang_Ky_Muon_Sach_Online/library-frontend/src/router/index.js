import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue') // Trỏ thẳng về Dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue') 
    },
    {
      path: '/my-books',
      name: 'my-books',
      component: () => import('../views/MyBooksView.vue'),
      meta: { requiresAuth: true, role: 'MEMBER' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true } // Admin hay Member đều xài được
    },
    {
      path: '/book/:id', // Đường dẫn nhận ID sách
      name: 'book-detail',
      component: () => import('../views/BookDetailView.vue')
    },
    // 👉 THÊM ĐƯỜNG DẪN TRANG NỘI QUY MƯỢN TRẢ
    {
      path: '/terms',
      name: 'terms-of-service',
      component: () => import('../views/TermsOfServiceView.vue') // Sẽ tạo file này sau
    },
    // Khu vực của Quản trị viên - Thủ thư (ADMIN) - Đã được làm gọn thành 1 trang duy nhất
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' }
    }
  ]
})

// Vệ sĩ kiểm tra quyền truy cập 
router.beforeEach((to, from) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('role'); 

  if (isLoggedIn) {
    if (to.path === '/login') {
      return userRole === 'ADMIN' ? '/admin' : '/';
    }
    if (to.meta.role === 'ADMIN' && userRole !== 'ADMIN') {
      alert('Khu vực cấm! Bạn không phải là Thủ thư.');
      return '/'; 
    }
    if (to.meta.role === 'MEMBER' && userRole === 'ADMIN') {
      return '/admin';
    }
  } else if (to.meta.requiresAuth) {
    return '/login';
  }
})

export default router