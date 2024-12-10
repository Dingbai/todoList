<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, type PropType } from 'vue'
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
// import SearchTool from '@/components/searchTool/SearchTool'

const props = defineProps({
  data: {
    type: Object as PropType<OutputData>,
    required: true
  },
  config: {
    type: Object as PropType<EditorJS.EditorConfig>,
    default: () => ({
      readOnly: false
    })
  }
})
const emit = defineEmits(['change', 'getEditorInstance'])

const editor = ref<EditorJS | null>(null)
const editorId = 'editorjs-container'

const initializeEditor = () => {
  editor.value = new EditorJS({
    holder: editorId,
    readOnly: props.config.readOnly,
    inlineToolbar: ['link', 'marker', 'bold', 'italic'],
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
        inlineToolbar: true,
        tunes: ['textVariant']
      },
      quote: Quote,
      simpleImage: SimpleImage,
      table: Table
      // search: SearchTool
    },
    data: {
      ...props.data,
      blocks: props.data?.blocks || []
    },
    onChange: async (_api, event) => {
      if (event && !Array.isArray(event) && event.type === 'block-changed') {
        console.log('内容已更改')
        const outputData = (await editor.value?.save()) || null
        emit('change', outputData)
      }
    },
    onReady: () => {
      emit('getEditorInstance', editor.value)
      if (props.data) {
        editor.value?.render(props.data)
      }
    }
  })
}

onMounted(() => {
  initializeEditor()
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value?.destroy()
  }
})
</script>
<template>
  <div id="editorjs-container" />
</template>
<style lang="less" scoped>
#editorjs-container {
  // // height: calc(100vh - 60px);
  // // padding: 0 11px;
  // box-sizing: border-box;
  // overflow: auto;
  :deep(.codex-editor__redactor) {
    padding-bottom: 0 !important;
  }
}
</style>
