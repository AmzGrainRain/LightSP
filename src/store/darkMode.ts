import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    enabled: false, // 组件状态
    darkWallpaper: false, // 深色壁纸
    followSystem: false, // 跟随系统
    followTime: true, // 跟随时间
    color: '#fff', // 字体颜色
    bgColor: '#1d1f21c9', // 背景色
    frColor: '#fff1' // 前景色
  }),
  getters: {},
  actions: {
    // 更新组件状态
    setDarkModeStatus(status: boolean | null) {
      if (status === null) {
        this.enabled = !this.enabled
        return
      }
      this.enabled = status
    },
    // 设置深色壁纸
    setDarkWallpaper(status: boolean | null) {
      if (status === null) {
        this.darkWallpaper = !this.darkWallpaper
        return
      }
      this.darkWallpaper = status
    },
    // 自动切换深色模式
    setFollowSystem(status: boolean | null) {
      if (status === null) {
        this.followSystem = !this.followSystem
        location.reload()
        return
      }
      this.followSystem = status
      location.reload()
    }
  }
})
