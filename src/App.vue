<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Content from './components/content/Content.vue'
import SideBar from './components/sideBar/SideBar.vue'
import { useDataStore } from '@/stores/update'

const isShowContent = ref(false)

const dataStore = useDataStore()
dataStore.$subscribe(() => {
  getContentStatus()
})

onMounted(() => {
  getContentStatus()
})

const getContentStatus = () => {
  dataStore.hasCurrentItem && (isShowContent.value = true)
}
</script>

<template>
  <div class="app-container">
    <SideBar />
    <div class="content">
      <Content v-show="isShowContent" />
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

  .content {
    flex: 1;
  }
}
</style>
