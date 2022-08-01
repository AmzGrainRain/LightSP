import { defineStore } from 'pinia'

export const useIndexStore = defineStore('global', {
  state: () => ({
    blur: false, // 全局模糊
    fillet: 16, // 全局圆角
    contentHeight: 14, // 内容高度
    adaptiveContentHeight: false, // 自适应内容高度
    color: '#000', // 字体颜色
    bgColor: '#fffc', // 背景色
    frColor: '#8881', // 前景色
    searchEngines: '' // 自定义搜索引擎
  }),
  getters: {},
  actions: {
    // 设置毛玻璃效果
    setGlobalBlur(status: boolean | null) {
      if (status === null) {
        this.blur = !this.blur
        return
      }
      this.blur = status
    },
    // 设置圆角数值
    setGlobalFillet(status: number) {
      this.fillet = status
    },
    // 设置内容高度
    setContentHeight(status: number) {
      this.contentHeight = status
    },
    // 设置自适应内容高度
    setAdaptiveContentHeight(status: boolean | null) {
      if (status === null) {
        this.adaptiveContentHeight = !this.adaptiveContentHeight
        return
      }
      this.adaptiveContentHeight = status
    },
    // 设置默认搜索引擎
    setSearchEngines(url: string) {
      this.searchEngines = url
    }
  }
})
