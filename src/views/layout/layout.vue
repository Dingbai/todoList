<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Content from '@/components/content/Content.vue'
import sideContent from '@/components/sideContent/sideContent.vue'
import { useDataStore } from '@/stores/update'
import { backupData } from './utils/backup'

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
import SideBar from './sideBar/SideBar.vue'
</script>
<template>
  <div class="layout-Container">
    <SideBar />
     
  </div>
</template>
<style lang="less" scoped>
.layout-Container {
}
</style>
