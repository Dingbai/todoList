<script lang="ts" setup>
import { App } from 'ant-design-vue'

const { message } = App.useApp()
import { LocalStorageManager } from '@/utils/backup'

window.electronAPI.getBackupPath((data: string) => {
  console.log('收到主进程消息:', data)
})
// console.log('path :>> ', path)
// window.electronAPI.receiveOnce('backup-path', (data: string) => {
//   console.log('收到主进程消息:', data)
// })

const backup = () => {
  LocalStorageManager.backup()
    .then((res) => {
      if (res.success) {
        message.success('备份成功')
      }
    })
    .catch((err) => {
      message.error(`备份失败,${err}`)
    })
}
const restore = () => {
  LocalStorageManager.restore()
    .then((res) => {
      if (res.success) {
        message.success('恢复成功')
      }
    })
    .catch((err) => {
      message.error(`恢复失败,${err}`)
    })
}
</script>
<template>
  <div class="setting-container">
    <div class="setting-content">
      <a-button type="primary" @click="backup">备份</a-button>
      <a-button type="primary" @click="restore">恢复</a-button>
      <h1>备份路径</h1>
    </div>
  </div>
</template>
