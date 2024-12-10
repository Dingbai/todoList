import { defineStore } from 'pinia'
import { type Data } from '@/types/index.d'

type State = {
  value: Data[]
  id: string
}

const sortTasks = (tasks: Data[]) => {
  return tasks.sort((a, b) => {
    // 先按状态排序（todo 在 done 前）
    if (a.status !== b.status) {
      return a.status === 'todo' ? -1 : 1
    }
    // 状态相同时，保持原有插入顺序
    return tasks.indexOf(a) - tasks.indexOf(b)
  })
}

export const useDataStore = defineStore('data', {
  state: (): State => {
    let list = localStorage.list ? JSON.parse(localStorage.list || '') : []
    list = sortTasks(list)
    return {
      value: list,
      id: list.length ? list[0].id : ''
    }
  },
  getters: {
    currentItem: (state) => state.value.find((item: Data) => item.id === state.id) || undefined,
    hasCurrentItem: (state) => !!state.value.find((item: Data) => item.id === state.id),
    todoList: (state) => state.value.filter((item: Data) => item.status === 'todo'),
    doneList: (state) => state.value.filter((item: Data) => item.status === 'done')
  },
  actions: {
    // 更新单个数据
    update(data: Data) {
      const res = this.value.map((item: Data) => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
    },
    // 更新所有数据
    updateAllData(data: Data[]) {
      localStorage.list = JSON.stringify(data)
      this.$patch({ value: data })
    },
    addData(data: Data) {
      const res = [...this.value, data]
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
    },
    setId(id: string) {
      this.$patch({ id })
    },
    deleteData(id: string) {
      const res = this.value.filter((item: Data) => item.id !== id)
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
    },
    // 更新todolist
    updatetodoList(data: Data[]) {
      const newValue = this.value
      newValue.splice(0, data.length, ...data)
      this.updateAllData(newValue)
    },
    // 更新donelist
    updateDoneList(data: Data[]) {
      const newValue = this.value
      newValue.splice(this.value.length - data.length, data.length, ...data)
      this.updateAllData(newValue)
    },
    updateList(status: string, data: Data[]) {
      if (status === 'todo') {
        this.updatetodoList(data)
      } else {
        this.updateDoneList(data)
      }
    }
  }
})
