<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import Table from '@editorjs/table'
import Quote from '@editorjs/quote'
import CheckList from '@editorjs/checklist'
import Marker from '@editorjs/marker'
import SimpleImage from '@editorjs/simple-image'
import TextVariantTune from '@editorjs/text-variant-tune'
import { useDataStore } from '@/stores/update'
import { type Data } from '@/types/index.d'

const editor = ref<EditorJS | null>(null)
const editorId = 'editorjs-container'
const title = ref('')
const editData = ref<OutputData | null>(null)
const dataStore = useDataStore()

watch(
  () => dataStore.id,
  () => {
    const currentItem = dataStore.currentItem
    editor.value
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

const initializeEditor = () => {
  const currentItem = dataStore.currentItem
  const initValue = currentItem?.editData
  title.value = currentItem?.title || ''
  editor.value = new EditorJS({
    holder: editorId,
    // placeholder: '在这里开始输入...',
    tools: {
      header: Header,
      list: List,
      checklist: {
        class: CheckList,
        inlineToolbar: true
      },
      code: Code,
      marker: Marker,
      textVariant: TextVariantTune,
      paragraph: {
        // class: Paragraph,
        inlineToolbar: true,
        tunes: ['textVariant']
      },
      quote: Quote,
      simpleImage: SimpleImage,
      table: Table
    },
    data: {
      ...initValue,
      blocks: initValue?.blocks || []
    },
    onChange: async (_api, event) => {
      if (event && !Array.isArray(event) && event.type === 'block-changed') {
        console.log('内容已更改')
        // 在这里执行您的逻辑
        const outputData = (await editor.value?.save()) || null
        const currentItem = dataStore.currentItem as Data
        const data = { ...currentItem, title: title.value, editData: outputData }
        editData.value = outputData
        dataStore.update(data)
      }
    },
    onReady: () => {
      if (initValue) {
        editor.value?.render(initValue)
      }
    }
  })
}

onMounted(() => {
  initializeEditor()
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>
<template>
  <div class="edit-container">
    <a-input v-model:value="title" @change="handleChange" placeholder="准备做什么？" />
    <div id="editorjs-container" />
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
  #editorjs-container {
    height: calc(100vh - 60px);
    padding: 0 11px;
    box-sizing: border-box;
    overflow: auto;
    :deep(.codex-editor__redactor) {
      padding-bottom: 0 !important;
    }
  }
}
</style>
