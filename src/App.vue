<script setup lang="ts">
import { DeleteOutlined } from '@ant-design/icons-vue'
import { ref, reactive } from 'vue'
import type { Reactive } from 'vue'
import EditorComponent from './views/homeView/HomeView.vue'

type ListItem = {
  title: string
  // component: InstanceType<typeof EditorComponent>
  uuid: string
}
const list: Reactive<ListItem[]> = reactive([])
const id = ref('')
const editorData = ref({})

const handleAdd = () => {
  const uuid = crypto.randomUUID()
  id.value = uuid
  list.push({
    title: '新建备忘录',
    // component: EditorComponent,
    uuid
  })
}

const handleDelete = () => {
  console.log('删除')
}
const getEditorData = (data: unknown) => {
  console.log(data)
}
</script>

<template>
  <div class="app-container">
    <div class="side">
      <div class="side-add">
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </div>
      <div class="list-box">
        <template v-for="item in list">
          <div class="list-item">
            <div class="content">
              <div>{{ item.title }}</div>
            </div>
            <div class="handle">
              <DeleteOutlined @click="handleDelete" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="content">
      <EditorComponent @update:data="getEditorData" />
    </div>
  </div>
</template>
<style>
@import './assets/styles/reset.less';
</style>
<style lang="less" scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  .side {
    width: 20vw;
    border-right: 1px solid #ccc;
    height: 100vh;
    .side-add {
      display: flex;
      justify-content: center;
      :deep(.ant-btn-primary) {
        margin: 10px auto;
      }
    }
    .list-box {
      .list-item {
        height: 80px;
        display: flex;
        padding: 10px;
        margin-bottom: 10px;
        background-color: aquamarine;
        .content {
          display: flex;
          align-items: center;
          div {
            font-size: 16px;
            text-align: left;
          }
        }
      }

      .content {
        flex: 1;
      }
    }
  }
  .content {
    flex: 1;
  }
}
</style>
