import { defineStore } from 'pinia'
import { getItem as lfGet } from 'localforage'

export const useWallpaperStore = defineStore('wallpaper', {
  state: () => ({
    default: true, // 默认壁纸
    bing: false, // 必应壁纸
    customize: false, // 自定义壁纸
    focusBlur: false // 聚焦模糊
  }),
  getters: {},
  actions: {
    setWallpaper(params: string) {
      this.default = false
      this.bing = false
      this.customize = false
      switch (params) {
        case 'default':
          this.default = true
          break
        case 'bing':
          this.bing = true
          break
        case 'customize':
          if (!lfGet('CustomizeWallpaper')) {
            alert('应用失败！您还没有设置一个壁纸。')
            return
          }
          this.customize = true
          break
        default:
          this.default = true
      }
      location.reload()
    },

    setWallpaperFocusBlur(status: boolean | null) {
      if (status === null) {
        this.focusBlur = !this.focusBlur
        return
      }
      this.focusBlur = status
    }
  }
})
