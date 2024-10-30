import { defineStore } from 'pinia'
import { type Data } from '@/types/index.d'

type State = {
  value: Data[]
  id: string
}

export const useDataStore = defineStore('data', {
  state: (): State => {
    const list = localStorage.list ? JSON.parse(localStorage.list || '') : []
    return {
      value: list,
      id: list.length ? list[0].id : ''
    }
  },
  getters: {
    currentItem: (state) => state.value.find((item: Data) => item.id === state.id) || undefined,
    hasCurrentItem: (state) => !!state.value.find((item: Data) => item.id === state.id)
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
    }
  }
})
