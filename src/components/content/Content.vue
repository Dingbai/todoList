<script setup lang="ts">
import { ref, watch } from 'vue'
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import { type Data } from '@/types/index.d'
import Editor from '@/components/editor/Editor.vue'
import { useDataStore } from '@/stores/update'

const title = ref('')
const editData = ref<OutputData | null>(null)
const editorInstance = ref<EditorJS | null>(null)
const dataStore = useDataStore()

watch(
  () => dataStore.id,
  () => {
    const currentItem = dataStore.currentItem
    editorInstance.value
      ?.render({
        version: currentItem?.editData?.version,
        time: currentItem?.editData?.time,
        blocks: currentItem?.editData?.blocks || []
      })
      .catch((err) => {
        console.log('err :>> ', err)
      })
  }
)

watch(
  () => dataStore.currentItem,
  (data) => {
    title.value = data?.title || ''
    editData.value = data?.editData || null
  },
  { immediate: true, deep: true }
)

const handleChange = (event: InputEvent) => {
  const value = (event.target as HTMLInputElement).value
  const currentItem = dataStore.currentItem as Data
  const data = { ...currentItem, title: value, editData: editData.value }
  dataStore.update(data)
}

const handleEditChange = (outputData: OutputData) => {
  const currentItem = dataStore.currentItem as Data
  const data = { ...currentItem, title: title.value, editData: outputData }
  editData.value = outputData
  dataStore.update(data)
  editData.value = { ...data.editData, blocks: data.editData?.blocks || [] }
}
const getEditorInstance = (instance: EditorJS) => {
  editorInstance.value = instance
}
</script>
<template>
  <div class="edit-container">
    <a-input v-model:value="title" @change="handleChange" placeholder="准备做什么？" />
    <Editor
      :data="editData || { version: '', time: 0, blocks: [] }"
      @change="handleEditChange"
      @getEditorInstance="getEditorInstance"
    />
  </div>
</template>
<style lang="less" scoped>
.edit-container {
  height: 100vh;
  :deep(.ant-input) {
    border: none;
    height: 60px;
    font-size: 28px;
    &:focus {
      border: none;
      box-shadow: none;
    }
  }
  :deep(#editorjs-container) {
    height: calc(100vh - 60px);
    padding: 0 10px;
    box-sizing: border-box;
    overflow: auto;
  }
}
</style>
