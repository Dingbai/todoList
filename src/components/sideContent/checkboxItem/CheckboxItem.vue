<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue'
import { useDataStore } from '@/stores/update'
import { Empty } from 'ant-design-vue'
import draggable from 'vuedraggable'
import draggableImg from '@img/draggable-icon.png'
import { type Data } from '@/types/index.d'
import classNames from 'classnames'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const props = defineProps({
  status: {
    type: String,
    default: 'doing',
    validator: (val: string) => ['doing', 'done'].includes(val)
  },
  source: {
    type: Array as PropType<Data[]>,
    default: () => []
  }
})

const dataStore = useDataStore()
const currentId = ref(dataStore.currentItem?.id || '')
const imgSrc = ref(draggableImg)
const list = ref<Data[]>([])

onMounted(() => {
  list.value = props.source
})

const handleSwitch = (id: string) => {
  dataStore.setId(id)
  currentId.value = id
  // 标记选中状态
  const temp = dataStore.value.map((item) => {
    item.selected = item.id === id
    return item
  })
  dataStore.updateAllData(temp)
}

const getActivedClass = (id: string) => {
  return dataStore.currentItem?.id === id ? 'bg-actived' : ''
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
    <draggable
      v-if="list.length"
      handle=".drag-handle"
      class="list-group"
      item-key="id"
      v-model="list"
      :animation="300"
      @change="handleChange"
    >
      <template #item="{ element }">
        <div class="list-item" :key="element.id">
          <img :src="imgSrc" alt="" class="drag-handle" />
          <div :class="classNames('content', getActivedClass(element.id), getStatusClass())">
            <a-popover
              placement="rightTop"
              trigger="contextmenu"
              class="custom-popover"
              :getPopupContainer="getPopupContainer"
            >
              <template #content>
                <p @click="handleDelete(element.id)">delete</p>
              </template>
              <a-row>
                <a-col :span="2">
                  <a-checkbox
                    :value="element.id"
                    :checked="element.actived"
                    @change="handleChange"
                  />
                </a-col>
                <a-col :span="22">
                  <a-input
                    :class="`${getActivedClass(element.id)}`"
                    v-model:value="element.title"
                    placeholder="无标题"
                    @focus="handleSwitch(element.id)"
                  />
                </a-col>
              </a-row>
            </a-popover>
          </div>
        </div>
      </template>
    </draggable>

    <div v-else>
      <a-empty :image="simpleImage" description="暂无数据" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-box-container {
  .list-item {
    margin-bottom: 6px;
    position: relative;
    display: flex;
    padding: 0 10px 0 20px;
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
      padding-left: 8px;
      border-radius: 6px;
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
    .drag-handle {
      width: 16px;
      height: 16px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: move;
      opacity: 0;
      visibility: hidden;

      transition:
        opacity 0.8s ease,
        visibility 0s linear 0.8s;
    }
    &:hover {
      .drag-handle {
        opacity: 1;
        visibility: visible;
        transition:
          opacity 0.8s ease,
          visibility 0s linear 0s;
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
