<script setup lang="ts">
// import { DeleteOutlined } from '@ant-design/icons-vue'
import { ref, watch, computed } from 'vue'
import { useDataStore } from '@/stores/update'

const task = ref('')
const value = ref([])

const dataStore = useDataStore()

watch(dataStore.value, (newValue) => {
  console.log('newValue :>> ', newValue)
  task.value = dataStore.getCurrentItem()?.title || ''
})

const list = computed(() => dataStore.value)

const handleAdd = () => {
  const uuid = crypto.randomUUID()

  dataStore.addData({
    title: task.value,
    editData: {},
    id: uuid
  })

  task.value = ''
  dataStore.setId(uuid)
}
const handleSwitch = (id: string) => {
  dataStore.setId(id)
}

// const handleDelete = () => {
//   console.log('删除')
// }
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
    <div class="list-box">
      <template v-for="item in list">
        <div class="list-item" @click="handleSwitch(item.id)">
          <div class="content">
            <a-checkbox-group v-model:value="value" style="width: 100%">
              <div>
                <a-checkbox :value="item.id" />
                <a-input v-model:value="item.title" />
              </div>
            </a-checkbox-group>
          </div>
          <!-- <div class="handle">
            <DeleteOutlined @click="handleDelete" />
          </div> -->
        </div>
      </template>
    </div>
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
  .list-box {
    padding-top: 10px;
    .list-item {
      display: flex;
      margin-bottom: 6px;
      :deep(.ant-input) {
        border: none;
        &:focus {
          border: none;
          box-shadow: none;
        }
      }

      .content {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
