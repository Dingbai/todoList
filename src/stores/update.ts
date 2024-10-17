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
    update(data: Data) {
      const res = this.value.map((item: Data) => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
      localStorage.list = JSON.stringify(res)
      //   this.$patch({ value: res })
      this.value = res
    },
    addData(data: Data) {
      const res = [...this.value, data]
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
      this.value = res
    },
    setId(id: string) {
      //   this.$patch({ id })
      this.id = id
    }
  }
})
