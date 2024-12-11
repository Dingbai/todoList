<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, type PropType } from 'vue'
import EditorJS, { type OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import Table from '@editorjs/table'
// import Quote from '@editorjs/quote'
import CheckList from '@editorjs/checklist'
import Marker from '@editorjs/marker'
import SimpleImage from '@editorjs/simple-image'
// import TextVariantTune from '@editorjs/text-variant-tune'
import { i18nZhCN } from './config/i18n'
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
    i18n: i18nZhCN,
    tools: {
      header: Header,
      list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
      },
      checklist: {
        class: CheckList,
        inlineToolbar: true
      },
      code: Code,
      marker: Marker,
      // textVariant: TextVariantTune,
      paragraph: {
        inlineToolbar: true
        // tunes: ['textVariant']
      },
      // quote: Quote,
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
  <div id="editorjs-container" class="custom-scroll" />
</template>
<style lang="less" scoped>
#editorjs-container {
  overflow-x: hidden;
  :deep(.codex-editor__redactor) {
    padding-bottom: 0 !important;
    margin-left: 50px;
    margin-right: initial;
  }
  :deep(.codex-editor--narrow) {
    .ce-toolbar__actions {
      left: -4px;
      width: 53px;
    }
  }
}
</style>
