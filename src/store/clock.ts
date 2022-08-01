import { defineStore } from 'pinia'

export const useClockStore = defineStore('clock', {
  state: () => ({
    dateVisible: true // 显示日期
  }),
  getters: {},
  actions: {
    setDateVisible(status: boolean | null) {
      if (status === null) {
        this.dateVisible = !this.dateVisible
        return
      }
      this.dateVisible = status
    }
  }
})
