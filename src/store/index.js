import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

/* 全局控制 - 不可禁用 */
const gl = {
  state: {
    blur: false, // 全局模糊
    fillet: 16, // 全局圆角
    contentHeight: 14, // 内容高度
    color: '#000', // 字体颜色
    bgColor: '#fffc', // 背景色
    frColor: '#8881', // 前景色
    searchEngines: '' // 自定义搜索引擎
  },
  mutations: {
    // 设置毛玻璃效果
    setGlobalBlur (state, status) {
      if (status === null) {
        state.blur = !state.blur
        return
      }
      state.blur = status
    },
    // 设置圆角数值
    setGlobalFillet (state, status) {
      state.fillet = status
    },
    // 设置内容高度
    setContentHeight (state, status) {
      state.contentHeight = status
    },
    // 设置默认搜索引擎
    setSearchEngines (state, url) {
      state.searchEngines = url
    }
  }
}

// /* 设置组件 */
// const settings = {
//   state: {
//     show: false // 显示
//   },
//   mutations: {
//     settingVisible (state) {
//       state.show = !state.show
//     }
//   }
// }

/* 壁纸组件 - 不可禁用 */
const wallpaper = {
  state: {
    default: true, // 使用默认壁纸
    bing: false, // 使用必应壁纸
    customize: false, // 自定义壁纸
    parallax: false, // 视差效果
    focusBlur: false // 聚焦模糊
  },
  mutations: {
    // 设置壁纸
    setWallpaper (state, params) {
      state.default = false
      state.bing = false
      state.customize = false
      if (params === 'default') {
        state.default = true
        return
      }
      if (params === 'bing') {
        state.bing = true
        return
      }
      if (params === 'customize') {
        state.customize = true
        return
      }
      state.default = true
    },
    // 设置视差效果
    setWallpaperParallax (state, status) {
      if (status === null) {
        state.parallax = !state.parallax
        alert('刷新后生效')
        return
      }
      state.parallax = status
      alert('刷新后生效')
    },
    // 设置聚焦模糊
    setWallpaperFocusBlur (state, status) {
      if (status === null) {
        state.focusBlur = !state.focusBlur
        return
      }
      state.focusBlur = status
    }
  }
}

/* 时钟组件 - 不可禁用 */
const clock = {
  state: {
    dateVisible: true // 显示日期
  },
  mutations: {
    setDateVisible (state, status) {
      if (status === null) {
        state.dateVisible = !state.dateVisible
        return
      }
      state.dateVisible = status
    }
  }
}

/* 深色模式 - 可禁用 */
const darkMode = {
  state: {
    enabled: false, // 组件状态
    darkWallpaper: false, // 深色壁纸
    autoSwitch: false, // 自动切换
    followSystem: false, // 跟随系统
    followTime: true, // 跟随时间
    color: '#fff', // 字体颜色
    bgColor: '#1d1f21c9', // 背景色
    frColor: '#fff1' // 前景色
  },
  mutations: {
    // 更新组件状态
    setDarkMode (state, status) {
      if (status === null) {
        state.enabled = !state.enabled
        return
      }
      state.enabled = status
    },
    // 设置深色壁纸
    setDarkWallpaper (state, status) {
      if (status === null) {
        state.darkWallpaper = !state.darkWallpaper
        return
      }
      state.darkWallpaper = status
    },
    // 自动切换开关
    setAutoSwitch (state, status) {
      if (status === null) {
        state.autoSwitch = !state.autoSwitch
        return
      }
      state.autoSwitch = status
    },
    // 自动切换深色模式
    setAutoDarkMode (state, status) {
      state.followSystem = false
      state.followTime = false
      if (status === 'system') {
        state.followSystem = true
      }
      if (status === 'time') {
        state.followTime = true
      }
    }
  }
}

/* 天气组件 - 可禁用 */
const weather = {
  state: {
    visible: false, // 组件状态
    location_id: 101010100 // 位置ID
  },
  mutations: {
    // 显示与隐藏
    setWeatherVisible (state, status) {
      if (status === null) {
        state.visible = !state.visible
        return
      }
      state.visible = true
    },
    // 设置天气位置
    setWeatherLocation (state, id) {
      state.location_id = id
    }
  }
}

export default createStore({
  modules: {
    gl,
    // settings,
    wallpaper,
    clock,
    darkMode,
    weather
  },
  plugins: [
    createPersistedState({
      key: 'LightSP',
      fetchBeforeUse: true
    })
  ]
})
