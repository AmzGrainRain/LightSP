<script setup lang='ts'>
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useWallpaperStore } from '../../store/wallpaper'
import { useDarkModeStore } from '../../store/darkMode'
import { setItem as lfSet } from 'localforage'
import vSwitch from '../switch.vue'

const store = {
  global: useIndexStore(),
  wallpaper: useWallpaperStore(),
  darkMode: useDarkModeStore()
}
const fileChecker = ref(null) as any

const currentDefaultWallpaper = ref(store.wallpaper.default)
watch(currentDefaultWallpaper, (newValue) => {
  store.wallpaper.setWallpaper(newValue)
})

const setCustomizeWallpaper = () => {
  const reader = new FileReader()
  reader.readAsDataURL(fileChecker.value.files[0])
  reader.onloadend = () => {
    console.log(reader.result)
    lfSet('CustomizeWallpaper', reader.result, (err) => {
      if (err !== null) console.log('[Error] setCustomizeWallpaper: localforage.setItem')
      if (store.wallpaper.customize) location.reload()
      else {
        store.wallpaper.setWallpaper('customize')
        location.reload()
      }
    })
  }
}
</script>

<template>
  <ul>
    <li>
      <span>背景聚焦模糊效果</span>
      <vSwitch @click='store.wallpaper.setWallpaperFocusBlur(null)' :active='store.wallpaper.focusBlur' />
    </li>
    <li>
      <span>使用默认壁纸</span>
      <select v-model="currentDefaultWallpaper" class="p-lr-sm">
        <option :value="0">黑洞</option>
        <option :value="1">扁平</option>
        <option :value="2">自然</option>
      </select>
    </li>
    <li v-if="false">
      <span>使用必应壁纸</span>
      <vSwitch @click='store.wallpaper.setWallpaper("bing")' :active='store.wallpaper.bing' />
    </li>
    <li>
      <span>使用自定义壁纸</span>
      <vSwitch @click='store.wallpaper.setWallpaper("customize")' :active='store.wallpaper.customize' />
    </li>
    <li>
      <span>设置自定义壁纸</span>
      <input type='button' value='+' @click='fileChecker.click' />
      <input ref='fileChecker' type='file' @change='setCustomizeWallpaper()' v-show='false' />
    </li>
  </ul>
</template>

<style lang='stylus' scoped>
li
  margin 14px 0
  padding 8px 10px
  display flex
  justify-content space-between
  align-items center
  border-radius calc(var(--fillet) - 4px)
  background-color #8881
</style>
