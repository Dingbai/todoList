import { type OutputData } from '@editorjs/editorjs'
export interface Data {
  title: string
  editData: OutputData | null
  id: string
  created: string
  status: 'done' | 'todo'
  actived?: boolean
  selected?: boolean
}
