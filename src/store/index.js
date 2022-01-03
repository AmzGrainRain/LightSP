import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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
