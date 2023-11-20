import { defineStore } from 'pinia'
import { getItem } from 'localforage'

export const useWallpaperStore = defineStore('wallpaper', {
  state: () => ({
    default: 0, // 默认壁纸
    bing: false, // 必应壁纸
    customize: false, // 自定义壁纸
    focusBlur: true, // 聚焦模糊
    internalWallpaper: ['3.1.3.png', '3.1.2.jpg', '3.1.1.jpg']
  }),
  getters: {},
  actions: {
    setWallpaper(params: string | number) {
      const resotre = () => {
        this.default = 0
        this.bing = false
        this.customize = false
      }

      switch(params) {
        case 'bing': {
          if (this.bing) resotre()
          else {
            this.default = -1
            this.bing = true
            this.customize = false
          }
          break
        }
        case 'customize': {
          if (!getItem('CustomizeWallpaper')) {
            alert('应用失败！您还没有设置一个壁纸。')
            return
          }
          if (this.customize) resotre()
          else {
            this.default = -1
            this.bing = false
            this.customize = true
          }
          break
        }
        default: {
          if (typeof(params) !== 'number') resotre()
          else {
            this.default = params as number
            this.bing = false
            this.customize = false
          }
        }
      }

      location.reload()
    },

    setWallpaperFocusBlur(status: boolean | null) {
      if (status === null) this.focusBlur = !this.focusBlur
      else this.focusBlur = status
    }
  }
})
