<template>
  <div class="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden login-container">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-[6px] z-0"></div>

    <div class="glass-box w-full max-w-md relative z-10 p-8 md:p-10 transition-all duration-300">
      
      <div class="text-center mb-8">
        <div class="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
          <i class="fa-solid fa-book-open-reader text-2xl"></i>
        </div>
        <h2 class="text-3xl font-black text-white tracking-tight uppercase drop-shadow-md">Thư Viện Online</h2>
      </div>

      <transition name="fade" mode="out-in">
        
        <div v-if="isLogin" key="login" class="w-full">
          <div class="text-center mb-8">
            <h3 class="text-xl font-extrabold text-blue-400 mb-1">Chào mừng trở lại!</h3>
            <p class="text-slate-300 text-sm font-medium">Đăng nhập để tiếp tục sử dụng hệ thống.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div v-if="loginError" class="p-3 bg-red-500/20 text-red-300 rounded-xl text-sm font-bold flex items-center justify-center border border-red-500/30">
              <i class="fa-solid fa-circle-exclamation mr-2"></i> {{ loginError }}
            </div>

            <div class="relative group">
              <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
              <input v-model="loginForm.username" type="text" placeholder="Tên đăng nhập hoặc MSNV" required
                class="glass-input w-full pl-11 pr-4 py-3.5 rounded-xl text-white outline-none font-medium transition-all" />
            </div>

            <div class="relative group">
              <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"></i>
              <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" required
                class="glass-input w-full pl-11 pr-10 py-3.5 rounded-xl text-white outline-none font-medium transition-all" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>

            <div class="flex items-center justify-between text-sm mt-2">
              <label class="flex items-center text-slate-300 cursor-pointer font-medium hover:text-white transition-colors">
                <input type="checkbox" v-model="loginForm.rememberMe" class="w-4 h-4 text-blue-600 rounded bg-slate-800 border-slate-600 focus:ring-blue-500 mr-2" />
                Ghi nhớ tôi
              </label>
              <a href="#" class="text-blue-400 hover:text-blue-300 font-bold transition-colors hover:underline">Quên mật khẩu?</a>
            </div>

            <div class="flex justify-center mt-8">
              <button type="submit" :disabled="isLoading"
                class="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-blue-400">
                <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin text-xl"></i>
                <i v-else class="fa-solid fa-arrow-right text-xl"></i>
              </button>
            </div>
          </form>

          <p class="mt-8 text-center text-sm text-slate-400 font-medium">
            Chưa có tài khoản? 
            <button @click="toggleView" class="text-blue-400 font-bold hover:text-white hover:underline transition-colors">Đăng ký ngay</button>
          </p>
        </div>

        <div v-else key="register" class="w-full">
          <div class="text-center mb-6">
            <h3 class="text-xl font-extrabold text-blue-400 mb-1">Trở thành Độc giả</h3>
            <p class="text-slate-300 text-sm font-medium">Tham gia cộng đồng yêu sách ngay hôm nay.</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4">
            
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="w-full sm:w-1/2 relative group">
                <i class="fa-regular fa-address-card absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-400"></i>
                <input v-model="registerForm.fullName" type="text" placeholder="Họ và Tên (*)" @input="validateRegister" required
                  :class="['glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white', errors.fullName ? 'border-red-400/50' : '']" />
              </div>
              <div class="w-full sm:w-1/2 relative group">
                <i class="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-400"></i>
                <input v-model="registerForm.username" type="text" placeholder="Tên đăng nhập (*)" @input="validateRegister" required
                  :class="['glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white', errors.username ? 'border-red-400/50' : '']" />
              </div>
            </div>

            <div class="relative group">
              <i class="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-400"></i>
              <input v-model="registerForm.email" type="email" placeholder="Địa chỉ Email (*)" @input="validateRegister" required
                :class="['glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white', errors.email ? 'border-red-400/50' : '']" />
            </div>
            <p v-if="errors.email" class="text-red-400 text-[10px] font-bold mt-[-8px] ml-2">{{ errors.email }}</p>

            <div class="flex gap-2">
              <div class="w-2/5 relative">
                <input v-model="registerForm.birthDate" type="date" title="Ngày sinh"
                  class="glass-input w-full px-3 py-2.5 rounded-xl outline-none font-medium text-sm text-slate-200 transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
              </div>
              <div class="w-1/5 relative">
                <select v-model="registerForm.gender" 
                  class="glass-input w-full px-2 py-2.5 rounded-xl outline-none font-medium text-sm text-slate-200 transition-all cursor-pointer">
                  <option value="" disabled selected class="text-black">Phái</option>
                  <option value="Nam" class="text-black">Nam</option>
                  <option value="Nữ" class="text-black">Nữ</option>
                  <option value="Khác" class="text-black">Khác</option>
                </select>
              </div>
              <div class="w-2/5 relative group">
                <i class="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-400"></i>
                <input v-model="registerForm.phone" type="tel" placeholder="Điện thoại" 
                  class="glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white" />
              </div>
            </div>

            <div class="relative group">
              <i class="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-blue-400"></i>
              <input v-model="registerForm.address" type="text" placeholder="Nhập địa chỉ" 
                class="glass-input w-full pl-9 pr-3 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white" />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <div class="w-full sm:w-1/2 relative">
                <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu (*)" @input="validateRegister" required
                  :class="['glass-input w-full px-4 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white', errors.password ? 'border-red-400/50' : '']" />
              </div>
              <div class="w-full sm:w-1/2 relative">
                <input v-model="registerForm.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Nhập lại mật khẩu (*)" @input="validateRegister" required
                  :class="['glass-input w-full px-4 py-2.5 rounded-xl outline-none font-medium text-sm transition-all text-white', errors.confirmPassword ? 'border-red-400/50' : '']" />
              </div>
            </div>
            <p v-if="errors.password || errors.confirmPassword" class="text-red-400 text-[10px] font-bold text-center mt-1">{{ errors.password || errors.confirmPassword }}</p>

            <div class="flex justify-center mt-6">
              <button type="submit" :disabled="isLoading || hasErrors"
                class="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-blue-400">
                <i v-if="isLoading" class="fa-solid fa-spinner fa-spin text-xl"></i>
                <i v-else class="fa-solid fa-check text-xl"></i>
              </button>
            </div>
          </form>

          <p class="mt-6 text-center text-sm text-slate-400 font-medium">
            Đã có tài khoản? 
            <button @click="toggleView" class="text-blue-400 font-bold hover:text-white hover:underline transition-colors">Đăng nhập ngay</button>
          </p>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Toggles & States
const isLogin = ref(true)
const isLoading = ref(false)
const showPassword = ref(false)
const loginError = ref('')

const toggleView = () => {
  isLogin.value = !isLogin.value
  loginError.value = ''
  // Clear forms
  loginForm.username = ''
  loginForm.password = ''
  registerForm.fullName = ''
  registerForm.username = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.birthDate = ''
  registerForm.gender = ''
  registerForm.address = ''
  registerForm.phone = ''
  Object.keys(errors).forEach(k => errors[k] = '')
}

// --- LOGIN LOGIC ---
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  loginError.value = ''
  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: loginForm.username, 
        password: loginForm.password 
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.clear();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', data.data._id);
      localStorage.setItem('username', data.data.username);
      localStorage.setItem('role', data.data.role);

      if (data.data.role === 'ADMIN' || data.data.role === 'EMPLOYEE') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      loginError.value = data.message;
    }
  } catch (error) {
    loginError.value = "Không thể kết nối máy chủ!";
  } finally {
    isLoading.value = false;
  }
}

// --- REGISTER LOGIC ---
const registerForm = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  gender: '',
  address: '',
  phone: ''
})

const errors = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validateRegister = () => {
  if (!registerForm.email) errors.email = ''
  else if (!isValidEmail(registerForm.email)) errors.email = 'Email không hợp lệ.'
  else errors.email = ''

  if (!registerForm.password) errors.password = ''
  else if (registerForm.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự.'
  else errors.password = ''

  if (!registerForm.confirmPassword) errors.confirmPassword = ''
  else if (registerForm.confirmPassword !== registerForm.password) errors.confirmPassword = 'Mật khẩu không khớp.'
  else errors.confirmPassword = ''
}

const hasErrors = computed(() => {
  return Object.values(errors).some(err => err !== '') || 
          !registerForm.fullName || !registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword
})

const handleRegister = async () => {
  validateRegister()
  if (hasErrors.value) return

  isLoading.value = true
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerForm.username,
        password: registerForm.password,
        fullName: registerForm.fullName,
        email: registerForm.email,
        birthDate: registerForm.birthDate,
        gender: registerForm.gender,
        address: registerForm.address,
        phone: registerForm.phone
      })
    });

    const data = await response.json();
    if (data.success) {
      alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
      toggleView();
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (error) {
    alert("Lỗi kết nối máy chủ!");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.login-container {
  /* Thay ảnh nền workspace tại đây nếu bạn có link ảnh khác */
  background: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1920&auto=format&fit=crop') no-repeat center/cover;
}

/* Glassmorphism Effect */
.glass-box {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

.glass-box:has(.space-y-4) {
  max-width: 32rem; /* Nới rộng form khi ở chế độ Đăng ký */
}

/* Glass Input */
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white !important;
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Fix lỗi autofill của Chrome làm mất nền trong suốt */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from { opacity: 0; transform: scale(0.95) translateY(10px); }
.fade-leave-to { opacity: 0; transform: scale(0.95) translateY(-10px); }
</style>