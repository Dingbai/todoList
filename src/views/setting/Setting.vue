<script lang="ts" setup>
import { App, type UploadChangeParam } from 'ant-design-vue'
import { ref, onMounted } from 'vue'
import {
  InboxOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  EyeOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import { type OutputData } from '@editorjs/editorjs'
import Column from '@/components/column/Column.vue'

import { LocalStorageManager } from '@/utils/backup'
import { JsonViewer } from 'vue3-json-viewer'
import ClipboardJS from 'clipboard'

import 'vue3-json-viewer/dist/index.css'
import type { ReturnValue } from '@/types/electron'
import { useDataStore } from '@/stores/update'
import type { Data } from '@/types/index.d'

const { message } = App.useApp()
const dataStore = useDataStore()

const fileList = ref([])
const data = ref('')
const visible = ref(false)
const previewData = ref<OutputData>({ blocks: [] })
const checked = ref(false)
const windowCloseOption = ref('ask')

const handleChange = (info: UploadChangeParam) => {
  const isJson = info.file.type === 'application/json'
  if (!isJson) {
    message.error('You can only upload JSON file!')
    fileList.value = []
  }
}
onMounted(async () => {
  const state = await window.electronAPI.getAutoLaunchState()
  checked.value = state
  const option = await window.electronAPI.getQuitAction()
  windowCloseOption.value = option
})

async function handleSwitchChange(checked: boolean) {
  try {
    const res = await window.electronAPI.toggleAutoLaunch(checked)
    if (res.success) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  } catch (err: unknown) {
    console.log('err :>> ', err)
    message.error(String(err))
  }
  // window.electronAPI.setAutoLaunch(checked)
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
      const blocks = [
        {
          type: 'code',
          data: {
            code: res.data ? res.data : {}
          }
        }
      ]
      previewData.value = { blocks }
      data.value = res.data ? res.data : ''
      onSuccess(res.data)
    } else {
      onError(res.data)
    }
  } catch (err) {
    onError(err)
  }
}

const backupPath = await window.electronAPI.getBackupPath()

const backup = async (): Promise<ReturnValue> => {
  return new Promise((resolve, reject) => {
    LocalStorageManager.backup()
      .then((res) => {
        if (res.success) {
          message.success('备份成功')
          resolve(res)
        } else {
          message.error(`备份失败,${res.message}`)
          reject(res.message)
        }
      })
      .catch((err) => {
        message.error(`备份失败,${err}`)
        reject(err)
      })
  })
}
const handlePreview = () => {
  visible.value = true
}
const handleOk = () => {
  visible.value = false
}
const restore = async () => {
  const res = await backup()
  if (res.success) {
    const temp = JSON.parse(data.value)
    localStorage.list = temp
    dataStore.updateAllData(temp)
    const id = temp.filter((item: Data) => item.status === 'todo')?.[0]?.id
    if (id) {
      dataStore.setId(id)
    }
    message.success('恢复成功')
  } else {
    message.error(`恢复失败,${res.message}`)
  }
  close()
}
const close = () => {
  visible.value = false
}
const handleDelete = () => {
  fileList.value = []
  data.value = ''
}
const copy = (text: string) => {
  const clipboard = new ClipboardJS('.copy', {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboard.destroy()
    message.success('复制成功')
  })
}
const handleWindowOptionChange = () => {
  window.electronAPI.setQuitAction(windowCloseOption.value)
}
</script>
<template>
  <div class="setting-container">
    <div class="setting-content">
      <h1>setting</h1>
      <a-row>
        <Column label="窗口关闭选项" :labelCol="{ span: 3 }">
          <a-radio-group
            v-model:value="windowCloseOption"
            name="radioGroup"
            @change="handleWindowOptionChange"
          >
            <a-radio value="ask">询问</a-radio>
            <a-radio value="quit">直接关闭</a-radio>
            <a-radio value="minimize">最小化到托盘</a-radio>
          </a-radio-group>
        </Column>
        <Column label="开机自启动" :labelCol="{ span: 3 }">
          <a-switch v-model:checked="checked" @change="handleSwitchChange" />
        </Column>
        <Column :labelCol="{ span: 3 }">
          <template #label>
            <div class="backup label">
              数据备份
              <a-popover placement="bottomLeft">
                <template #content>
                  <div>
                    备份路径：{{ backupPath }}
                    <CopyOutlined class="copy" @click="copy(backupPath)" />
                  </div>
                </template>
                <InfoCircleOutlined />
              </a-popover>
            </div>
          </template>
          <a-button type="primary" @click="backup">备份</a-button>
        </Column>
        <Column label="数据恢复" :labelCol="{ span: 3 }">
          <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            :customRequest="handleCustomRequest"
            :disabled="fileList.length > 0"
            :show-upload-list="false"
            @change="handleChange"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">点击或拖动文件到该区域上传</p>
            <p class="ant-upload-hint">仅支持单个json文件上传</p>
          </a-upload-dragger>
          <div class="file-list">
            <a-list v-if="fileList.length > 0" :dataSource="fileList">
              <template #renderItem="{ item }">
                <a-list-item class="custom-item">
                  <PaperClipOutlined />
                  <span>{{ item.name }}</span>
                  <a-space>
                    <EyeOutlined @click="handlePreview" />
                    <DeleteOutlined @click="handleDelete" />
                  </a-space>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </Column>
      </a-row>
    </div>
    <a-modal v-model:open="visible" title="数据预览/恢复" @ok="handleOk" centered>
      <template #footer>
        <a-space>
          <a-popconfirm
            title="该操作会覆盖当前数据，是否继续？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="restore"
          >
            <a-button type="primary">恢复</a-button>
          </a-popconfirm>
          <a-button @click="close">取消</a-button>
        </a-space>
      </template>
      <JsonViewer
        copyable
        boxed
        sort
        theme="jv-dark"
        expanded
        :value="JSON.parse(data)"
        :expandDepth="2"
      />
    </a-modal>
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
      margin-top: 16px;
    }
    .backup {
      align-items: center;
      :deep(.anticon-info-circle) {
        margin-left: 5px;
      }
    }

    :deep(.ant-list) {
      margin-top: 10px;
      .custom-item {
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        border-radius: 6px;
        .anticon-paper-clip {
          margin-right: 5px;
        }
        .ant-space {
          margin-left: auto;
          cursor: pointer;
        }
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
    :deep(.ant-upload-drag) {
      height: initial;
    }
  }
}
:deep(.anticon-copy) {
  margin-left: 5px;
  cursor: pointer;
}
</style>
