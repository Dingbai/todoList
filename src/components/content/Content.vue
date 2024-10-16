<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import { useDataStore } from '@/stores/update'
// import ImageTool from '@editorjs/image'

const editor = ref<EditorJS | null>(null)
const editorId = 'editorjs-container'
const title = ref('')
const editData = ref<OutputData | null>(null)
const dataStore = useDataStore()

dataStore.$subscribe(() => {
  const currentItem = dataStore.getCurrentItem()
  title.value = currentItem?.title || ''
  editData.value = currentItem?.editData || null
  if (currentItem?.editData) {
    editor.value?.render(
      currentItem.editData
      // blocks: currentItem?.editData?.blocks || []
    )
  }
})

watch(title, (newValue) => {
  if (newValue.trim()) {
    const data = { id: dataStore.id, title: newValue, editData: editData.value }
    dataStore.update(data)
  }
})

onMounted(() => {
  editor.value = new EditorJS({
    holder: editorId,
    tools: {
      header: Header,
      list: List
      // image: ImageTool
    },
    data: {
      ...editData.value,
      blocks: editData.value?.blocks || []
    },
    onChange: async () => {
      const outputData = (await editor.value?.save()) || null
      editData.value = outputData
      const data = { id: dataStore.id, title: title.value, editData: outputData }
      dataStore.update(data)
    },
    onReady: () => {
      if (editData.value) {
        editor.value?.render(editData.value)
      }
    }
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>
<template>
  <div class="edit-container">
    <a-input v-model:value="title" />
    <div id="editorjs-container" />
  </div>
</template>
<style lang="less" scoped>
.edit-container {
  :deep(.ant-input) {
    border: none;
    height: 60px;
    &:focus {
      border: none;
      box-shadow: none;
    }
  }
  #editorjs-container {
    height: calc(100vh - 60px);
    padding: 0 11px;
    box-sizing: border-box;
  }
}
</style>
