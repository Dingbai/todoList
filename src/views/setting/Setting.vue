<script lang="ts" setup>
import { App, type UploadChangeParam } from 'ant-design-vue'
import { ref } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'

import { LocalStorageManager } from '@/utils/backup'

const { message } = App.useApp()

const fileList = ref([])
const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

async function handleCustomRequest({
  file,
  onSuccess,
  onError
}: {
  file: File
  onSuccess: (data: any) => void
  onError: (error: any) => void
}) {
  console.log('file :>> ', file)
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await window.electronAPI.uploadFile(formData)
    console.log('res :>> ', res)
    if (res.success) {
      onSuccess(res.data)
    } else {
      onError(res.data)
    }
  } catch (err) {
    onError(err)
  }
}

function handleDrop(e: DragEvent) {
  console.log(e)
}
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
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        :customRequest="handleCustomRequest"
        @change="handleChange"
        @drop="handleDrop"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p>
      </a-upload-dragger>
    </div>
  </div>
</template>
<style lang="less" scoped>
.setting-container {
  padding: 0 10px;
  .path {
    color: rgba(0, 0, 0, 0.88);
  }
}
</style>
