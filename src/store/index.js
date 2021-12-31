import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// 壁纸相关
const wallpaper = {
  state: {
    bing: false,
    local: true
  },
  mutations: {
    setWallpaper (state, params) {
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

export default createStore({
  modules: {
    wallpaper
  },
  plugins: [createPersistedState({
    key: 'LightSP',
    fetchBeforeUse: true
  })]
})
