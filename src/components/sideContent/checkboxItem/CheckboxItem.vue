<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataStore } from '@/stores/update'

const props = defineProps({
  status: {
    type: String,
    default: 'doing',
    validator: (val: string) => ['doing', 'done'].includes(val)
  }
})

const dataStore = useDataStore()
const checkedValue = ref([])
const currentId = ref(dataStore.currentItem?.id || '')

const list = computed(() => dataStore.value.filter((item) => item.status === props.status))

watch(checkedValue, (val) => {
  console.log('val :>> ', val)
  const temp = dataStore.value.map((item) => {
    if (val.includes(item.id)) {
      item.status = props.status === 'doing' ? 'done' : 'doing'
    }
    return item
  })
  dataStore.update(temp)
})

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
  <div class="list-box-container">
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
            <a-checkbox-group v-model:value="checkedValue" style="width: 100%">
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
</style>
