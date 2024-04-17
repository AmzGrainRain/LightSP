<script setup lang="ts">
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import { clear as lfClear } from 'localforage'
import GlobalSetting from './global.vue'
import WallpaperSetting from './wallpaper.vue'
import ClockSetting from './clock.vue'
import DarkModeSetting from './darkMode.vue'
import WeatherSetting from './weather.vue'

const emit = defineEmits(['close'])

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const hotkeyHelp = (): void => {
  alert(`快捷键介绍：
ctrl + s = 打开设置
ctrl + f = 翻译
ctrl + b = 使用必应搜索当前输入框的内容
ctrl + g = 使用谷歌搜索当前输入框的内容
ctrl + d = 使用百度开发者搜索当前输入框的内容`)
}

const feedback = (): void => {
  window.open('https://github.com/AmzGrainRain/LightSP/issues/new')
}

const reset = (): void => {
  if (confirm('您确定要清除所有自定义设置吗？')) {
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
    id="settings"
    class="overflow-hide blur"
  >
    <div class="bar p-lr-ex">
      <h3>设置</h3>
      <span class="p-lr p-tb-sm pointer" @click="emit('close')">关闭</span>
    </div>
    <div class="panel p-lr-lg p-t-lg">
      <h4>全局</h4>
      <Global-Setting />

      <h4>壁纸</h4>
      <Wallpaper-Setting />

      <h4>时钟</h4>
      <Clock-Setting />

      <h4>深色模式</h4>
      <DarkMode-Setting />

      <h4>天气</h4>
      <Weather-Setting />

      <h4>其他</h4>
      <div class="other">
        <input
          id="hotkey-help"
          class="m-b p-lr-lg border-none transition pointer"
          type="button"
          value="快捷键"
          @click="hotkeyHelp()"
        />
        <input
          id="feedback"
          class="m-b p-lr-lg border-none transition pointer"
          type="button"
          value="反馈"
          @click="feedback()"
        />
        <input
          id="reset"
          class="m-b p-lr-lg border-none border-radius transition pointer"
          type="button"
          value="恢复默认设置"
          @click="reset()"
        />
        <span id="version" class="m-b p-lr-lg border-none border-radius transition pointer"
          >版本号: {{ store.global.version }}</span
        >
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
::selection
  background transparent

#settings
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  margin auto
  width 430px
  height 80vh
  color var(--color)
  border: 1px solid #888a;
  background-color var(--bg-color)
  border-radius calc(var(--border-radius) - 4px)
  //opacity 0
  //transition transform .7s cubic-bezier(0, 1, .3, 1)

  div.bar
    display flex
    justify-content space-between
    align-items center
    height 3rem
    box-shadow 0 1px .2rem #8884

  div.panel
    height calc(100% - 3rem)
    overflow hidden auto

    h4
      padding-left .3rem

    div.other
      margin-top .5rem

      input
        margin-right 1rem

#hotkey-help
#feedback
#reset
  height 2rem
  color inherit
  font-family inherit
  border-radius calc(var(--border-radius) - 4px)
  background-color var(----bg-color)

  &:hover
    background-color #8296ff

.show
  opacity 1 !important
</style>
