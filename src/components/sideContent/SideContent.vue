<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/update'
import moment from 'moment'

const dataStore = useDataStore()
const task = ref('')
const value = ref([])
const currentId = ref(dataStore.currentItem?.id || '')

const list = computed(() => dataStore.value)

const handleAdd = () => {
  const uuid = crypto.randomUUID()

  dataStore.addData({
    title: task.value,
    editData: null,
    id: uuid,
    created: moment().format('YYYY-MM-DD HH:mm:ss')
  })

  task.value = ''
  dataStore.setId(uuid)
  currentId.value = uuid
}
const handleSwitch = (id: string) => {
  dataStore.setId(id)
  currentId.value = id
}

const getActivedClass = (id: string) => {
  return currentId.value === id ? 'bg-actived' : ''
}

const handleDelete = (id: string) => {
  dataStore.deleteData(id)
  dataStore.setId(dataStore.value[0].id)
}
const getPopupContainer = () => document.querySelector('.content')
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
    <div class="list-box-doing">
      <template v-for="item in list">
        <div :class="`list-item ${getActivedClass(item.id)}`">
          <div class="content">
            <a-popover
              placement="rightTop"
              trigger="contextmenu"
              class="custom-popover"
              :getPopupContainer="getPopupContainer"
            >
              <template #content>
                <p @click="handleDelete(item.id)">delete</p>
              </template>
              <a-checkbox-group v-model:value="value" style="width: 100%">
                <a-row>
                  <a-col :span="2">
                    <a-checkbox :value="item.id" />
                  </a-col>
                  <a-col :span="22">
                    <a-input
                      :class="`${getActivedClass(item.id)}`"
                      v-model:value="item.title"
                      placeholder="无标题"
                      @focus="handleSwitch(item.id)"
                    />
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-popover>
          </div>
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
  .list-box-doing {
    padding-top: 10px;
    .list-item {
      display: flex;
      margin-bottom: 6px;
      padding: 0 10px;
      border-radius: 6px;
      :deep(.ant-input) {
        border: none;
        padding-left: 0;
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
      :deep(.ant-checkbox-wrapper) {
        padding-top: 4px;
      }

      .content {
        display: flex;
        align-items: center;
        width: 100%;
        :deep(.ant-popover-inner) {
          width: 100px;
          padding: 0;
          p {
            text-align: left;
            padding: 10px;
            cursor: pointer;
            &:hover {
              background: #f3f3f3;
            }
          }
        }
      }
    }
    .bg-actived {
      background: #f3f3f3;
    }
  }
}
</style>
