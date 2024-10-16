import { defineStore } from 'pinia'
import { type Data } from '@/types/index.d'

type State = {
  value: Data[]
  id: string
  currentItem?: Data
}

export const useDataStore = defineStore('data', {
  state: (): State => ({
    value: localStorage.list ? JSON.parse(localStorage.list || '') : [],
    id: '',
    currentItem: undefined
  }),
  actions: {
    update(data: Data) {
      const res = this.value.map((item: Data) => {
        if (item.id === data.id) {
          return data
        }
        return item
      })
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
      //   this.value = res
    },
    addData(data: Data) {
      const res = [...this.value, data]
      localStorage.list = JSON.stringify(res)
      this.$patch({ value: res })
    },
    setId(id: string) {
      this.$patch({ id })
    },
    getCurrentItem() {
      return this.value.find((item: Data) => item.id === this.id) || undefined
    },
    hasCurrentItem() {
      return !!this.value.find((item: Data) => item.id === this.id)
    }
  }
})
