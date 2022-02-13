import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

/* 全局 */
const gl = {
  state: {
    fillet: 16, // 全局圆角
    blur: false // 全局模糊
  },
  mutations: {
    // 设置圆角数值
    setGlobalFillet (state, value) {
      state.fillet = value
    },
    // 设置毛玻璃效果
    setGlobalBlur (state, value) {
      state.blur = value
    }
  }
}

/* 壁纸组件 */
const wallpaper = {
  state: {
    local: true, // 使用默认壁纸
    bing: false, // 使用必应壁纸
    customize: false, // 自定义壁纸
    parallax: false, // 视差效果
    focusBlur: false // 聚焦模糊
  },
  mutations: {
    // 设置壁纸
    setWallpaper (state, params) {
      state.local = false
      state.bing = false
      state.customize = false
      if (params === 'local') {
        state.local = true
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
      state.local = true
    },
    // 设置视差效果
    setWallpaperParallax (state, status) {
      state.parallax = status
      alert('刷新后生效')
    },
    // 设置聚焦模糊
    setWallpaperFocusBlur (state, status) {
      state.focusBlur = status
    }
  }
}

/* 天气组件 */
const weather = {
  state: {
    location_id: 101010100 // 位置ID
  },
  mutations: {
    // 设置天气位置
    setWeatherLocation (state, id) {
      state.location_id = id
    }
  }
}

export default createStore({
  modules: {
    gl,
    wallpaper,
    weather
  },
  plugins: [
    createPersistedState({
      key: 'LightSP',
      fetchBeforeUse: true
    })
  ]
})
