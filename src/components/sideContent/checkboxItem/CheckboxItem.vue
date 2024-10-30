<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/update'
import { Empty } from 'ant-design-vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const props = defineProps({
  status: {
    type: String,
    default: 'doing',
    validator: (val: string) => ['doing', 'done'].includes(val)
  }
})

const dataStore = useDataStore()
const currentId = ref(dataStore.currentItem?.id || '')

const list = computed(() => dataStore.value.filter((item) => item.status === props.status))
const handleSwitch = (id: string) => {
  dataStore.setId(id)
  currentId.value = id
}

const getActivedClass = (id: string) => {
  return currentId.value === id ? 'bg-actived' : ''
}

const getStatusClass = () => {
  return props.status === 'done' ? 'bg-done' : ''
}

const handleDelete = (id: string) => {
  dataStore.deleteData(id)
  dataStore.setId(dataStore.value[0].id)
}
const getPopupContainer = () => document.querySelector('.content')

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const temp = dataStore.value.map((item) => {
    if (target.value === item.id) {
      item.status = props.status === 'doing' ? 'done' : 'doing'
    }
    // 完成状态所有任务都是选中状态
    item.actived = item.status === 'done'
    return item
  })
  dataStore.updateAllData(temp)
}
</script>

<template>
  <div class="list-box-container">
    <template v-if="list.length">
      <template v-for="item in list" :key="item.id">
        <div :class="`list-item ${getActivedClass(item.id)} ${getStatusClass()}`">
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
              <a-row>
                <a-col :span="2">
                  <a-checkbox :value="item.id" :checked="item.actived" @change="handleChange" />
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
            </a-popover>
          </div>
        </div>
      </template>
    </template>
    <div v-else>
      <a-empty :image="simpleImage" description="暂无数据" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-box-container {
  .list-item {
    display: flex;
    margin-bottom: 6px;
    padding: 0 10px;
    border-radius: 6px;
    :deep(.ant-input) {
      border: none;
      &:focus {
        border: none;
        box-shadow: none;
      }
    }
    :deep(.ant-checkbox-wrapper) {
      padding-top: 4px;
      padding-right: 6px;
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
  .bg-done {
    :deep(.ant-input) {
      color: #bdbdbd;
    }
    :deep(.ant-checkbox-wrapper) {
      .ant-checkbox-inner {
        background: #bdbdbd;
        border-color: #bdbdbd;
      }
      &:hover {
        .ant-checkbox {
          &::after {
            border-color: #bdbdbd;
          }
        }
        .ant-checkbox-inner {
          background: #bdbdbd;
          border-color: #bdbdbd;
          &::after {
            border-color: #bdbdbd;
          }
        }
      }
    }
  }
}
</style>
