import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 壁纸组件相关
const wallpaper = {
  state: {
    local: true,
    customize: false
  },
  mutations: {
    setWallpaper (state, params) {
      state.local = false
      state.customize = false
      // Default
      if (params === 'local') {
        state.local = true
        return
      }
      // Customize
      if (params === 'customize') {
        state.customize = true
        return
      }
      state.local = true
    }
  }
}

// 天气组件相关
const weather = {
  state: {
    location_id: 101010100
  },
  mutations: {
    setWeatherLocation (state, id) {
      state.location_id = id
    }
  }
}

export default createStore({
  modules: {
    wallpaper,
    weather
  },
  plugins: [createPersistedState({
    key: 'LightSP',
    fetchBeforeUse: true
  })]
})
