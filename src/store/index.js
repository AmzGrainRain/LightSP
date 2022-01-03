import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 壁纸组件相关
const wallpaper = {
  state: {
    bing: false,
    local: true
  },
  mutations: {
    setWallpaper (state, params) {
      console.log('setWallpaper')
      if (params === 'bing') {
        state.bing = true
        state.local = false
      }
      if (params === 'local') {
        state.bing = false
        state.local = true
      }
      if (params === 'customize') {
        state.bing = false
        state.local = ''
      }
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
