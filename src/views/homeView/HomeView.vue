<template>
  <div class="edit-container">
    <div id="editorjs-container" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
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
    onChange: () => {
      editor.value?.save().then((outputData) => {
        emit('update:data', outputData)
      })
    }
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style lang="less" scoped>
#editorjs-container {
  // width: 500px;
  height: 100vh;
  border: 1px solid #ccc;
}
</style>
