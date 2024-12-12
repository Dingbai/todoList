declare module '@editorjs/text-variant-tune'
declare module '@editorjs/simple-image'
declare module '@editorjs/marker'
declare module '@editorjs/checklist'
declare module '@editorjs/paragraph'
declare module 'vue3-json-viewer' {
  import { AllowedComponentProps, App, Component, ComponentCustomProps, VNodeProps } from 'vue'
  interface JsonViewerProps {
    value: Object | Array<any> | string | number | boolean //对象
    expanded: boolean //是否自动展开
    expandDepth: number //展开层级
    copyable: boolean | object //是否可复制
    sort: boolean //是否排序
    boxed: boolean //是否boxed
    theme: string //主题 jv-dark | jv-light
    previewMode: boolean //是否可复制
    timeformat: (value: any) => string
  }
  type JsonViewerType = JsonViewerProps & VNodeProps & AllowedComponentProps & ComponentCustomProps
  const JsonViewer: Component<JsonViewerType>
  export { JsonViewer }
  const def: { install: (app: App) => void }
  export default def
}
