import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    enabled: false,
    darkWallpaper: false,
    followSystem: false,
    followTime: true,
    colorStyle: {
      text: '#ffffff',
      background: { r: 30, g: 30, b: 30, a: 60 },
      foreground: { r: 128, g: 128, b: 128, a: 5 },
      theme: { r: 130, g: 150, b: 255, a: 100 }
    }
  }),
  getters: {},
  actions: {
    setDarkMode(status: boolean | null) {
      if (status === null) {
        this.enabled = !this.enabled
        return
      }
      this.enabled = status
    },

    setDarkWallpaper(status: boolean | null) {
      if (status === null) {
        this.darkWallpaper = !this.darkWallpaper
        return
      }
      this.darkWallpaper = status
    },

    setFollowSystem(status: boolean | null) {
      if (status === null) {
        this.followSystem = !this.followSystem
        location.reload()
        return
      }
      this.followSystem = status
      location.reload()
    },

    getBackgroundColor(): string {
      const bg = this.colorStyle.background
      return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`
    },

    getForegroundColor(): string {
      const bg = this.colorStyle.foreground
      return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`
    },

    getThemeColor(): string {
      const bg = this.colorStyle.theme
      return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`
    }
  }
})
