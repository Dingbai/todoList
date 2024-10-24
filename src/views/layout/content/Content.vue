<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Content from '@/components/content/Content.vue'
import SideContent from '@/components/sideContent/SideContent.vue'
import { useDataStore } from '@/stores/update'
import { backupData } from '@/utils/backup'

const isShowContent = ref(false)

const dataStore = useDataStore()
dataStore.$subscribe(() => {
  getContentStatus()
})

onMounted(() => {
  backupData()
  getContentStatus()
})

const getContentStatus = () => {
  dataStore.hasCurrentItem && (isShowContent.value = true)
}
</script>

<template>
  <div class="content-container">
    <SideContent />
    <div class="content">
      <Content v-show="isShowContent" />
    </div>
  </div>
</template>
<style>
@import './assets/styles/reset.less';
</style>
<style lang="less" scoped>
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .content {
    flex: 1;
  }
}
</style>
