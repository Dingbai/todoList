<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
// import ImageTool from '@editorjs/image'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:data'])

const editor = ref<EditorJS | null>(null)
const editorId = 'editorjs-container'
const header = ref('')
const editData = ref({})

watch(header, (newValue) => {
  if (newValue.trim()) {
    updateData(newValue, editData.value)
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
      ...props.data,
      blocks: []
    },
    onChange: async () => {
      const outputData = (await editor.value?.save()) || {}
      editData.value = outputData
      updateData(header.value, outputData)
    }
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

const updateData = (title: string, data: {}) => {
  emit('update:data', {
    header: title,
    editData: data
  })
}
</script>
<template>
  <div class="edit-container">
    <a-input v-model:value="header" />
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
