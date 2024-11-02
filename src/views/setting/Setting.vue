<script lang="ts" setup>
import { App, type UploadChangeParam } from 'ant-design-vue'
import { ref } from 'vue'
import { InboxOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'

import { LocalStorageManager } from '@/utils/backup'

const { message } = App.useApp()

const fileList = ref([])
const data = ref<Record<string, string>>({})
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
  file: { path: string }
  onSuccess: (data: any) => void
  onError: (error: any) => void
}) {
  try {
    const res = await window.electronAPI.uploadFile(file.path)

    if (res.success) {
      data.value = res.data || {}
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
const handlePreview = (file: File) => {
  console.log(file)
}
// const restore = () => {
//   LocalStorageManager.restore()
//     .then((res) => {
//       if (res.success) {
//         message.success('恢复成功')
//       }
//     })
//     .catch((err) => {
//       message.error(`恢复失败,${err}`)
//     })
// }
</script>
<template>
  <div class="setting-container">
    <div class="setting-content">
      <h1>setting</h1>
      <a-row>
        <a-col :span="3">
          <div class="backup">
            数据备份
            <a-popover placement="bottomLeft">
              <template #content>
                <div>备份路径：{{ backupPath }}</div>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </a-col>
        <a-col :span="10">
          <a-button type="primary" @click="backup">备份</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="3">
          <div>数据恢复</div>
        </a-col>
        <a-col :span="10">
          <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            :customRequest="handleCustomRequest"
            :disabled="fileList.length > 0"
            @change="handleChange"
            @drop="handleDrop"
            @preview="handlePreview"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或拖动文件到该区域上传</p>
            <p class="ant-upload-hint">仅支持单个json文件上传</p>
          </a-upload-dragger>
        </a-col>
      </a-row>
      <!-- <a-button type="primary">备份</a-button>
      <a-button type="primary" @click="restore">恢复</a-button> -->
    </div>
  </div>
</template>
<style lang="less" scoped>
.setting-container {
  padding: 0 10px;
  width: 100%;
  color: rgba(0, 0, 0, 0.88);
  font-size: 16px;
  .setting-content {
    :deep(.ant-row) {
      margin-top: 10px;
      .ant-col {
        > div {
          display: flex;
          justify-content: flex-end;
          padding-right: 8px;
        }
      }
    }
    .backup {
      align-items: center;
      :deep(.anticon-info-circle) {
        margin-left: 5px;
      }
    }
  }
}
</style>
