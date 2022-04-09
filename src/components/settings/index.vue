<template>
  <div
    id="vSettings"
    class="p-tb-sm p-lr-ex transition"
    :class="{
      'blur': store.state.gl.blur
    }"
    :style="`
      color: ${store.state.darkMode.enabled ? store.state.darkMode.color : store.state.gl.color};
      background-color: ${store.state.darkMode.enabled ? store.state.darkMode.bgColor : store.state.gl.bgColor}
    `"
  >
    <!-- 全局设置 -->
    <sGlobal />
    <hr>
    <!-- 壁纸设置 -->
    <sWallpaper />
    <hr>
    <!-- 时钟设置 -->
    <sClock />
    <hr>
    <!-- 深色模式设置 -->
    <sDarkMode />
    <hr>
    <!-- 天气设置 -->
    <sWeather />
    <hr>
    <button id="reset" class="m-b w-100 border-none border-radius transition pointer" type="button" @click="reset()">恢复默认设置</button>
    <button id="close" class="w-100 border-none border-radius transition pointer" type="button" @click="store.commit('settingVisible')">关闭</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import sGlobal from '@/components/settings/global.vue'
import sWallpaper from '@/components/settings/wallpaper.vue'
import sClock from '@/components/settings/clock.vue'
import sDarkMode from '@/components/settings/darkMode.vue'
import sWeather from '@/components/settings/weather.vue'
export default {
  components: {
    sGlobal,
    sWallpaper,
    sClock,
    sDarkMode,
    sWeather
  },
  setup () {
    const store = useStore()
    const reset = () => {
      if (prompt('输入 "confirm" 确认您的操作.') === 'confirm') {
        localStorage.removeItem('LightSP')
        location.reload()
      }
    }

    return { store, reset }
  }
}
</script>

<style lang="stylus" scoped>
::selection
  background transparent
#vSettings
  position absolute
  top 0
  left 0
  justify-content center
  align-items center
  width 320px
  height 100vh
  overflow hidden auto
hr
  border 0
  border-top 1px solid #444
#reset
#close
  height 32px
  background-color #f88a
#reset:hover
#close:hover
  background-color #f55
</style>
