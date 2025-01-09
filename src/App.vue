<script setup lang="ts">
import SideBar from '@/views/sideBar/SideBar.vue'
</script>

<template>
  <Suspense>
    <a-app class="app-container">
      <SideBar />
      <router-view />
    </a-app>
  </Suspense>
</template>
<style>
@import '@/assets/styles/reset.less';
</style>
<style lang="less" scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
<style lang="less">
.custom-scroll {
  overflow: auto;

  // 默认隐藏滚动条
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  // 滚动条轨道
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  // 滚动条滑块
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }

  // 鼠标悬停或滚动时显示滚动条
  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(127, 127, 127, 0.5);

      &:hover {
        background-color: rgba(127, 127, 127, 0.8);
      }
    }
  }
}
</style>
