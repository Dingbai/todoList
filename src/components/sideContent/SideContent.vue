<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@/stores/update'
import CheckboxItem from '@/components/sideContent/checkboxItem/CheckboxItem.vue'
import moment from 'moment'

const dataStore = useDataStore()
const task = ref('')
const currentId = ref(dataStore.currentItem?.id || '')

const activeKey = ref(['1'])
const panelData = [
  {
    key: '1',
    title: '正在进行',
    status: 'doing'
  },
  {
    key: '2',
    title: '已完成',
    status: 'done'
  }
]

const handleAdd = () => {
  const uuid = crypto.randomUUID()

  dataStore.addData({
    title: task.value,
    editData: null,
    id: uuid,
    status: 'doing',
    actived: false,
    created: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  task.value = ''
  dataStore.setId(uuid)
  currentId.value = uuid
}

const getCount = (status: string) => {
  return dataStore.value.filter((item) => item.status === status).length
}
</script>

<template>
  <div class="side-container">
    <div class="side-add">
      <a-input
        placeholder="添加任务至 工作任务 ，回车即可创建"
        v-model:value="task"
        @keyup.enter="handleAdd"
      />
    </div>
    <a-collapse v-model:activeKey="activeKey" ghost>
      <a-collapse-panel v-for="item in panelData" :key="item.key">
        <template #header>
          <span>
            {{ item.title }}
            <span class="header">{{ getCount(item.status) }}</span>
          </span>
        </template>
        <CheckboxItem :status="item.status" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style lang="less" scoped>
.side-container {
  width: 36vw;
  border-right: 1px solid #f2f2f2;
  height: 100vh;
  padding: 10px;
  .side-add {
    display: flex;
    justify-content: center;
    :deep(.ant-btn-primary) {
      margin: 10px auto;
    }
  }
  :deep(.ant-collapse-item) {
    .ant-collapse-header {
      padding-left: 0;
    }
    .ant-collapse-content-box {
      padding-top: 0;
    }
    .header {
      color: #bdbdbd;
      font-size: 12px;
      margin-left: 2px;
    }
  }
}
</style>
