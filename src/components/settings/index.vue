<script setup lang="ts">
import { useIndexStore } from "../../store"
import { useDarkModeStore } from "../../store/darkMode"
import sGlobal from './global.vue'
import sWallpaper from './wallpaper.vue'
import sClock from './clock.vue'
import sDarkMode from './darkMode.vue'
import sWeather from './weather.vue'

/**
 * Emits
 */
const emit = defineEmits(['close'])

/**
 * Data
 */
const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

/**
 * Feedback
 */
const feedback = (): void => {
  window.open('https://github.com/KiHanLee/LightSP/issues/new')
}

/**
 * Reset
 */
const reset = (): void => {
  if (prompt('输入 "confirm" 确认您的操作: ') === 'confirm') {
    localStorage.removeItem('LightSP')
    localStorage.removeItem('LightSP-weather')
    localStorage.removeItem('LightSP-darkMode')
    localStorage.removeItem('LightSP-wallpaper')
    localStorage.removeItem('LightSP-global')
    location.reload()
  }
}
</script>

<template>
  <div
    id="vSettings"
    class="p-tb-sm p-lr-ex transition"
    :class="{'blur': store.global.blur}"
    :style="{
      'color': store.darkMode.enabled ? store.darkMode.color : store.global.color,
      'background-color': store.darkMode.enabled ? store.darkMode.bgColor : store.global.bgColor
    }"
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
    <input id="feedback" type="button" value="反馈" class="m-b w-100 border-none border-radius transition pointer" @click="feedback()">
    <input id="reset" type="button" value="恢复默认设置" class="m-b w-100 border-none border-radius transition pointer" @click="reset()">
    <input id="close" type="button" value="关闭" class="m-b w-100 border-none border-radius transition pointer" @click="emit('close')">
  </div>
</template>

<style lang="stylus" scoped>
::selection
  background transparent
#vSettings
  position absolute
  top 0
  left 0
  justify-content center
  align-items center
  width 330px
  height 100vh
  overflow hidden auto
hr
  border 0
  border-top 1px solid #444
#feedback
#reset
#close
  height 32px
  background-color #f88a
#feedback:hover
#reset:hover
#close:hover
  background-color #f55
</style>
