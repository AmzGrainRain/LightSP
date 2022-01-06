import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 壁纸组件相关
const wallpaper = {
  state: {
    bing: false,
    local: true,
    customize: ''
  },
  mutations: {
    setWallpaper (state, params) {
      state.bing = false
      state.local = false
      state.customize = ''
      if (params === 'bing') {
        state.bing = true
        return
      }
      if (params === 'local') {
        state.local = true
        return
      }
      state.local = params
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
