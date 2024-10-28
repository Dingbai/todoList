<script lang="ts" setup>
import { App } from 'ant-design-vue'

import { LocalStorageManager } from '@/utils/backup'

const { message } = App.useApp()
const backupPath = await window.electronAPI.getBackupPath()

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
      <h1>setting</h1>
      <a-button type="primary" @click="backup">备份</a-button>
      <a-button type="primary" @click="restore">恢复</a-button>
      <div class="path">备份路径: {{ backupPath }}</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.setting-countainer {
  .path {
    color: rgba(0, 0, 0, 0.88);
  }
}
</style>
