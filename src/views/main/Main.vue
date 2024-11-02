<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Content from '@/components/content/Content.vue'
import SideContent from '@/components/sideContent/SideContent.vue'
import { useDataStore } from '@/stores/update'
import { backupData } from '@/utils/backup'

const isShowContent = ref(false)

const dataStore = useDataStore()

onMounted(() => {
  backupData()
})

watch(
  () => dataStore.value,
  () => {
    isShowContent.value = dataStore.hasCurrentItem
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="main-container">
    <SideContent />
    <div class="content">
      <Content v-show="isShowContent" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex: 1;

  .content {
    flex: 1;
  }
}
</style>
