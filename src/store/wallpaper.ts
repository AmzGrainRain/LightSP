import { defineStore } from 'pinia'

export const useWallpaperStore = defineStore('wallpaper', {
  state: () => ({
    default: true, // 使用默认壁纸
    bing: false, // 使用必应壁纸
    customize: false, // 自定义壁纸
    parallax: false, // 视差效果
    focusBlur: false // 聚焦模糊
  }),
  getters: {},
  actions: {
    // 设置壁纸
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
          this.customize = true
          break
        default:
          this.default = true
      }
      location.reload()
    },
    // 设置视差效果
    setWallpaperParallax(status: boolean | null) {
      if (status === null) {
        this.parallax = !this.parallax
        location.reload()
        return
      }
      this.parallax = status
      location.reload()
    },
    // 设置聚焦模糊
    setWallpaperFocusBlur(status: boolean | null) {
      if (status === null) {
        this.focusBlur = !this.focusBlur
        return
      }
      this.focusBlur = status
    }
  }
})
