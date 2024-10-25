<script setup lang="ts">
import SideBar from '@/views/sideBar/SideBar.vue'
</script>

<template>
  <div class="app-container">
    <SideBar />
    <router-view />
  </div>
</template>
<style>
@import '@/assets/styles/reset.less';
</style>
<style lang="less" scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>
