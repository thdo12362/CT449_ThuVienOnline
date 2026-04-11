<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from './components/ToastNotification.vue'
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>
<style>
/* Ép luôn hiện thanh cuộn dọc để chống giật màn hình khi chuyển trang */
html {
  overflow-y: scroll; 
}
</style>