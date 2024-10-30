<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDataStore } from '@/stores/update'
import CheckboxItem from '@/components/sideContent/checkboxItem/CheckboxItem.vue'
import moment from 'moment'

const dataStore = useDataStore()
const task = ref('')
const currentId = ref(dataStore.currentItem?.id || '')

const activeKey = ref(['1'])

watch(activeKey, (val) => {
  console.log(val)
})

const handleAdd = () => {
  const uuid = crypto.randomUUID()

  dataStore.addData({
    title: task.value,
    editData: null,
    id: uuid,
    status: 'doing',
    created: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  task.value = ''
  dataStore.setId(uuid)
  currentId.value = uuid
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
      <a-collapse-panel key="1" header="正在进行">
        <CheckboxItem status="doing" />
      </a-collapse-panel>
      <a-collapse-panel key="2" header="已完成">
        <CheckboxItem status="done"/>
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
  }
}
</style>
