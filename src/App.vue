<script setup lang="ts">
import type { Ref } from 'vue'
import Content from './components/content/Content.vue'
import SideBar from './components/sideBar/SideBar.vue'

const getEditData = (data: { header: string; editData: {} }) => {
  console.log(data.header)
  console.log(data.editData)
}
</script>

<template>
  <div class="app-container">
    <SideBar />
    <div class="content">
      <Content @update:data="getEditData" />
    </div>
  </div>
</template>
<style>
@import './assets/styles/reset.less';
</style>
<style lang="less" scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  // background-color: #f0f2f5;

  .content {
    flex: 1;
  }
}
</style>
