<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
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
  const currentItem = dataStore.currentItem
  title.value = currentItem?.title || ''
  editData.value = currentItem?.editData || null

  editor.value
    ?.render({
      version: currentItem?.editData?.version,
      time: currentItem?.editData?.time,
      blocks: currentItem?.editData?.blocks || []
    })
    .then((res) => {
      console.log('res :>> ', res)
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
})

const handleChange = (event: InputEvent) => {
  const value = (event.target as HTMLInputElement).value
  if (value.trim()) {
    const data = { id: dataStore.id, title: value, editData: editData.value }
    dataStore.update(data)
  }
}

const initializeEditor = () => {
  const currentItem = dataStore.currentItem
  const initValue = currentItem?.editData
  title.value = currentItem?.title || ''
  editor.value = new EditorJS({
    holder: editorId,
    placeholder: '在这里开始输入...',
    tools: {
      header: Header,
      list: List
      // image: ImageTool
    },
    data: {
      ...initValue,
      blocks: initValue?.blocks || []
    },
    onChange: async () => {
      const outputData = (await editor.value?.save()) || null
      const data = { id: dataStore.id, title: title.value, editData: outputData }
      editData.value = outputData
      dataStore.update(data)
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
