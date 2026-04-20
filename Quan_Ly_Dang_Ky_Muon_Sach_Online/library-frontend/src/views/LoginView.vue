<template>
  <div class="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden login-container">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0"></div>

    <div class="glass-box w-full max-w-md relative z-10 p-8 md:p-10 transition-all duration-300">
      
      <div class="text-center mb-8">
        <div class="bg-orange-400 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(251,146,60,0.5)]">
          <i class="fa-solid fa-book-open-reader text-2xl"></i>
        </div>
        <h2 class="text-3xl font-black text-white tracking-[0.15em] uppercase drop-shadow-md">THƯ VIỆN</h2>
      </div>

      <transition name="fade" mode="out-in">
        
        <div v-if="isLogin" key="login" class="w-full">
          <form @submit.prevent="handleLogin" class="flex flex-col">
            
            <div class="h-14 mb-4">
              <transition name="fade">
                <div v-if="loginError" class="h-full px-3 bg-red-500/20 text-red-300 rounded-xl text-sm font-bold flex items-center justify-center border border-red-500/30">
                  <i class="fa-solid fa-circle-exclamation mr-2"></i> {{ loginError }}
                </div>
              </transition>
            </div>

            <div class="space-y-4">
              <div class="relative group">
                <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/70 group-focus-within:text-orange-400 transition-colors"></i>
                <input v-model="loginForm.username" type="text" placeholder="Tài khoản" required
                  class="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-white outline-none font-medium transition-all" />
              </div>

              <div class="relative group">
                <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/70 group-focus-within:text-orange-400 transition-colors"></i>
                <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu" required
                  class="glass-input w-full pl-12 pr-10 py-3.5 rounded-xl text-white outline-none font-medium transition-all" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400/70 hover:text-white transition-colors">
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 mb-2">
              <label class="flex items-center text-slate-300 cursor-pointer text-xs group transition-colors hover:text-orange-300">
                <div class="relative flex items-center justify-center w-4 h-4 mr-2 border rounded border-slate-500 bg-slate-800/50 group-hover:border-orange-400 transition-colors">
                  <input type="checkbox" v-model="loginForm.rememberMe" class="opacity-0 absolute inset-0 cursor-pointer" />
                  <i v-if="loginForm.rememberMe" class="fa-solid fa-check text-[10px] text-orange-400"></i>
                </div>
                Ghi nhớ tôi
              </label>
              <a href="#" class="text-xs text-slate-400 hover:text-orange-300 transition-colors">Quên mật khẩu?</a>
            </div>

            <div class="mt-8">
              <button type="submit" :disabled="isLoading"
                class="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)] disabled:opacity-50 hover:-translate-y-1 active:scale-95 tracking-wide text-lg">
                <span v-if="isLoading"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Đang xử lý...</span>
                <span v-else>Đăng nhập</span>
              </button>
            </div>
          </form>

          <p class="mt-8 text-center text-sm text-slate-400 font-medium">
            Chưa có tài khoản? 
            <button @click="toggleView" class="text-orange-400 font-bold hover:text-white hover:underline transition-colors">Đăng ký ngay</button>
          </p>
        </div>

        <div v-else key="register" class="w-full">
          <form @submit.prevent="handleRegister" class="flex flex-col">
            
            <div class="relative group mb-4">
              <i class="fa-regular fa-address-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/70 group-focus-within:text-orange-400 transition-colors"></i>
              <input v-model="registerForm.fullName" type="text" placeholder="Họ và Tên (*)" @input="validateRegister" required
                class="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl outline-none font-medium text-sm transition-all text-white" 
                :class="errors.fullName ? 'border-red-400/50' : ''" />
            </div>

            <div class="relative group mb-4">
              <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/70 group-focus-within:text-orange-400 transition-colors"></i>
              <input v-model="registerForm.username" type="text" placeholder="Tài khoản (*)" @input="validateRegister" required
                class="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl outline-none font-medium text-sm transition-all text-white"
                :class="errors.username ? 'border-red-400/50' : ''" />
            </div>

            <div class="relative group">
              <i class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400/70 group-focus-within:text-orange-400 transition-colors"></i>
              <input v-model="registerForm.email" type="email" placeholder="Địa chỉ Email (*)" @input="validateRegister" required
                class="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl outline-none font-medium text-sm transition-all text-white"
                :class="errors.email ? 'border-red-400/50' : ''" />
            </div>
            
            <div class="h-5 px-2 pt-1 mb-2">
              <p class="text-red-400 text-[11px] font-bold transition-opacity duration-300" :class="errors.email ? 'opacity-100' : 'opacity-0'">
                {{ errors.email || 'Lỗi email' }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <div class="w-full sm:w-1/2 relative group">
                <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400/70 text-sm group-focus-within:text-orange-400"></i>
                <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Mật khẩu (*)" @input="validateRegister" required
                  class="glass-input w-full pl-9 pr-4 py-3 rounded-xl outline-none font-medium text-xs transition-all text-white"
                  :class="errors.password ? 'border-red-400/50' : ''" />
              </div>

              <div class="w-full sm:w-1/2 relative group">
                <i class="fa-solid fa-shield-halved absolute left-3 top-1/2 -translate-y-1/2 text-slate-400/70 text-sm group-focus-within:text-orange-400"></i>
                <input v-model="registerForm.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Xác nhận (*)" @input="validateRegister" required
                  class="glass-input w-full pl-9 pr-4 py-3 rounded-xl outline-none font-medium text-xs transition-all text-white"
                  :class="errors.confirmPassword ? 'border-red-400/50' : ''" />
              </div>
            </div>

            <div class="flex items-center mt-3 mb-4 px-1">
              <label class="flex items-center text-slate-300 cursor-pointer text-[11px] group transition-colors hover:text-orange-300">
                <div class="relative flex items-center justify-center w-3.5 h-3.5 mr-2 border rounded border-slate-500 bg-slate-800/50 group-hover:border-orange-400 transition-colors">
                  <input type="checkbox" v-model="showPassword" class="opacity-0 absolute inset-0 cursor-pointer" />
                  <i v-if="showPassword" class="fa-solid fa-check text-[9px] text-orange-400"></i>
                </div>
                Hiện mật khẩu
              </label>
            </div>

            <div class="flex items-start px-1 mb-2">
              <label class="flex items-start text-slate-300 cursor-pointer text-xs group transition-colors hover:text-slate-200">
                <div class="relative flex items-center justify-center w-4 h-4 mr-2.5 mt-0.5 border rounded border-slate-500 bg-slate-800/50 group-hover:border-orange-400 transition-colors shrink-0">
                  <input type="checkbox" v-model="registerForm.agreedToTerms" class="opacity-0 absolute inset-0 cursor-pointer" />
                  <i v-if="registerForm.agreedToTerms" class="fa-solid fa-check text-[10px] text-orange-400"></i>
                </div>
                <span>Tôi đã đọc và đồng ý với <a href="/terms" target="_blank" class="text-orange-400 hover:text-orange-300 font-bold hover:underline transition-colors ml-0.5">Nội quy thư viện</a>.</span>
              </label>
            </div>

            <div class="h-5 px-2 text-center mb-1">
              <p class="text-red-400 text-[11px] font-bold transition-opacity duration-300" :class="(errors.password || errors.confirmPassword) ? 'opacity-100' : 'opacity-0'">
                {{ errors.password || errors.confirmPassword || 'Lỗi mật khẩu' }}
              </p>
            </div>

            <div class="mt-2">
              <button type="submit" :disabled="isLoading || hasErrors || !registerForm.agreedToTerms"
                class="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)] disabled:opacity-50 disabled:shadow-none hover:-translate-y-1 disabled:hover:translate-y-0 active:scale-95 text-base tracking-wide">
                <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang xử lý...</span>
                <span v-else>Đăng ký tài khoản</span>
              </button>
            </div>
          </form>

          <p class="mt-8 text-center text-sm text-slate-400 font-medium">
            Đã có tài khoản? 
            <button @click="toggleView" class="text-orange-400 font-bold hover:text-white hover:underline transition-colors">Đăng nhập</button>
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

// States
const isLogin = ref(true)
const isLoading = ref(false)
const showPassword = ref(false) 
const loginError = ref('')

const toggleView = () => {
  isLogin.value = !isLogin.value
  loginError.value = ''
  showPassword.value = false 
  loginForm.username = ''
  loginForm.password = ''
  loginForm.rememberMe = false
  registerForm.fullName = ''
  registerForm.username = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.agreedToTerms = false // Reset checkbox nội quy
  Object.keys(errors).forEach(k => errors[k] = '')
}

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
      body: JSON.stringify({ username: loginForm.username, password: loginForm.password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.clear();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', data.data._id);
      localStorage.setItem('username', data.data.username);
      localStorage.setItem('role', data.data.role);
      if (loginForm.rememberMe) localStorage.setItem('rememberMe', 'true');
      
      if (data.data.role === 'ADMIN' || data.data.role === 'EMPLOYEE') router.push('/admin');
      else router.push('/');
    } else {
      loginError.value = data.message;
    }
  } catch (error) {
    loginError.value = "Không thể kết nối máy chủ!";
  } finally {
    isLoading.value = false;
  }
}

const registerForm = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false // Thêm state cho checkbox nội quy
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
  // Không cho gửi nếu có lỗi hoặc CHƯA ĐỒNG Ý nội quy
  if (hasErrors.value || !registerForm.agreedToTerms) return
  
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerForm.username,
        password: registerForm.password,
        fullName: registerForm.fullName,
        email: registerForm.email
      })
    });
    const data = await response.json();
    if (data.success) {
      alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
      toggleView();
    } else alert("Lỗi: " + data.message);
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
  background: url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop') no-repeat center/cover;
}

.glass-box {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

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
  border-color: rgba(251, 146, 60, 0.5); 
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1); 
}

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