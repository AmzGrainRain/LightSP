import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    enabled: false, // 组件状态
    location_id: 101010100, // 位置ID
    api: 'https://devapi.qweather.com/v7/weather/now',
    apiKey: '4c54684fdabd4827b1ced33761912043'
  }),
  getters: {},
  actions: {
    // 更新组件状态
    setWeatherStatus(status: boolean | null) {
      if (status === null) {
        this.enabled = !this.enabled
        return
      }
      this.enabled = true
    },
    // 设置天气位置
    setWeatherLocation(id: any) {
      this.location_id = id
      location.reload()
    }
  }
})
