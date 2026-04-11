import { ref } from 'vue'

// Khai báo state global để các component khác nhau đều gọi được
const toasts = ref([])

export function useToast() {
  // Hàm thêm thông báo mới
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    // Tự động tắt sau khoảng thời gian duration (mặc định 3 giây)
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  // Hàm xóa thông báo
  const removeToast = (id) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return { toasts, addToast, removeToast }
}