<script setup lang='ts'>
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import { clear as lfClear } from 'localforage'
import sGlobal from './global.vue'
import sWallpaper from './wallpaper.vue'
import sClock from './clock.vue'
import sDarkMode from './darkMode.vue'
import sWeather from './weather.vue'

interface Props {
  show: boolean
}
const props = defineProps<Props>()

const emit = defineEmits(['close'])

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const feedback = (): void => {
  window.open('https://github.com/KiHanLee/LightSP/issues/new')
}

const reset = (): void => {
  if (prompt('输入 "confirm" 确认您的操作: ') === 'confirm') {
    lfClear().then(() => {
      localStorage.removeItem('LightSP')
      localStorage.removeItem('LightSP-weather')
      localStorage.removeItem('LightSP-darkMode')
      localStorage.removeItem('LightSP-wallpaper')
      localStorage.removeItem('LightSP-global')
      location.reload()
    })
  }
}
</script>

<template>
  <div
    id='settings'
    class='p-tb-sm p-lr-ex'
    :class='{
      show: props.show,
      blur: store.global.blur
    }'
  >
    <div>
      <!-- 全局设置 -->
      <sGlobal />
      <hr />
      <!-- 壁纸设置 -->
      <sWallpaper />
      <hr />
      <!-- 时钟设置 -->
      <sClock />
      <hr />
      <!-- 深色模式设置 -->
      <sDarkMode />
      <hr />
      <!-- 天气设置 -->
      <sWeather />
      <hr />
      <input id='feedback' type='button' value='反馈' class='m-b w-100 border-none transition pointer'
             @click='feedback()' />
      <input id='reset' type='button' value='恢复默认设置'
             class='m-b w-100 border-none border-radius transition pointer' @click='reset()' />
      <input id='close' type='button' value='关闭' class='m-b w-100 border-none transition pointer'
             @click="emit('close')" />
    </div>
  </div>
</template>

<style lang='stylus' scoped>
::selection
  background transparent

#settings
  position absolute
  top 0
  left 0
  justify-content center
  align-items center
  width 330px
  height 100vh
  color var(--color)
  background-color var(--bg-color)
  overflow hidden auto
  transform translateX(-101%)
  transition transform .7s cubic-bezier(0, 1, .3, 1)

  > div
    opacity 0
    transition opacity .7s

hr
  border 0
  border-top 1px solid #0003

#feedback
#reset
#close
  height 32px
  color inherit
  border-radius calc(var(--fillet) - 4px)
  background-color #8881

#feedback:hover
#reset:hover
#close:hover
  background-color #8296ff

.show
  transform translateX(0) !important

  > div
    opacity 1 !important
</style>
