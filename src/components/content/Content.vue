<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { type OutputData } from '@editorjs/editorjs'
import { type Data } from '@/types/index.d'
import Editor from '@/components/editor/Editor.vue'
import { useDataStore } from '@/stores/update'

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

// const initializeEditor = () => {
//   const currentItem = dataStore.currentItem
//   const initValue = currentItem?.editData
//   title.value = currentItem?.title || ''
//   editor.value = new EditorJS({
//     holder: editorId,
//     // placeholder: '在这里开始输入...',
//     tools: {
//       header: Header,
//       list: List,
//       checklist: {
//         class: CheckList,
//         inlineToolbar: true
//       },
//       code: Code,
//       marker: Marker,
//       textVariant: TextVariantTune,
//       paragraph: {
//         // class: Paragraph,
//         inlineToolbar: true,
//         tunes: ['textVariant']
//       },
//       quote: Quote,
//       simpleImage: SimpleImage,
//       table: Table
//     },
//     data: {
//       ...initValue,
//       blocks: initValue?.blocks || []
//     },
//     onChange: async (_api, event) => {
//       if (event && !Array.isArray(event) && event.type === 'block-changed') {
//         console.log('内容已更改')
//         // 在这里执行您的逻辑
//         const outputData = (await editor.value?.save()) || null
//       }
//     },
//     onReady: () => {
//       if (initValue) {
//         editor.value?.render(initValue)
//       }
//     }
//   })
// }

// onMounted(() => {
//   initializeEditor()
// })

// onBeforeUnmount(() => {
//   if (editor.value) {
//     editor.value.destroy()
//   }
// })
const handleEditChange = (outputData: OutputData) => {
  const currentItem = dataStore.currentItem as Data
  const data = { ...currentItem, title: title.value, editData: outputData }
  editData.value = outputData
  dataStore.update(data)
  editData.value = { ...data.editData, blocks: data.editData?.blocks || [] }
}
</script>
<template>
  <div class="edit-container">
    <a-input v-model:value="title" @change="handleChange" placeholder="准备做什么？" />
    <!-- <div id="editorjs-container" /> -->
    <Editor :data="editData || { version: '', time: 0, blocks: [] }" @change="handleEditChange" />
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
  // #editorjs-container {
  //   height: calc(100vh - 60px);
  //   padding: 0 11px;
  //   box-sizing: border-box;
  //   overflow: auto;
  //   :deep(.codex-editor__redactor) {
  //     padding-bottom: 0 !important;
  //   }
  // }
}
</style>
