<script setup lang="ts">
// import { DeleteOutlined } from '@ant-design/icons-vue'
import { ref, reactive } from 'vue'
import type { Reactive } from 'vue'

type ListItem = {
  title: string
  // component: InstanceType<typeof EditorComponent>
  uuid: string
}
const list: Reactive<ListItem[]> = reactive(
  localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list') || '') : []
)
const id = ref('')
const task = ref('')
const value = ref([])

const handleAdd = () => {
  const uuid = crypto.randomUUID()
  id.value = uuid
  list.push({
    title: task.value,
    // component: EditorComponent,
    uuid
  })
  saveToLocalStorage(list)
  task.value = ''
}

const saveToLocalStorage = (data: Reactive<ListItem[]>) => {
  localStorage.setItem('list', JSON.stringify(data))
}

// const handleDelete = () => {
//   console.log('删除')
// }
</script>

<template>
  <div class="side-container">
    <div class="side-add">
      <!-- <a-button type="primary" @click="handleAdd">新增</a-button> -->
      <a-input
        placeholder="添加任务至 工作任务 ，回车即可创建"
        v-model:value="task"
        @keyup.enter="handleAdd"
      />
    </div>
    <div class="list-box">
      <template v-for="item in list">
        <div class="list-item">
          <div class="content">
            <a-checkbox-group v-model:value="value" style="width: 100%">
              <div>
                <a-checkbox :value="item.uuid" />
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
