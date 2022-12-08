<script setup lang="ts">
import { ref } from 'vue'
import { useIndexStore } from '../../store'
import { useWallpaperStore } from '../../store/wallpaper'
import { useDarkModeStore } from '../../store/darkMode'
import localforage from 'localforage'
import vSwitch from '../switch.vue'

/**
 * Data
 */
const store = {
  global: useIndexStore(),
  wallpaper: useWallpaperStore(),
  darkMode: useDarkModeStore()
}
const base64file = ref(null) as any

/**
 * Methods
 */
const methods = {
  useBingWallpaper: () => {
    if (store.wallpaper.bing) store.wallpaper.setWallpaper('default')
    else store.wallpaper.setWallpaper('bing')
  },

  useCustomizeWallpaper: () => {
    if (store.wallpaper.customize) store.wallpaper.setWallpaper('default')
    else store.wallpaper.setWallpaper('customize')
  },

  setCustomizeWallpaper: () => {
    const reader = new FileReader()
    reader.readAsDataURL(base64file.value.files[0])
    reader.onloadend = () => {
      localforage.setItem('CustomizeWallpaper', reader.result, (err) => {
        if (err !== null) alert('应用失败！已为您切换为默认壁纸。（即将自动刷新）')
      })
    }
  }
}
</script>

<template>
  <ul>
    <li class="border-radius">
      <span>背景聚焦模糊效果</span>
      <vSwitch @click="store.wallpaper.setWallpaperFocusBlur(null)" :active="store.wallpaper.focusBlur" />
    </li>
    <li class="border-radius">
      <span>使用必应壁纸</span>
      <vSwitch @click="methods.useBingWallpaper()" :active="store.wallpaper.bing" />
    </li>
    <li class="border-radius">
      <span>使用自定义壁纸</span>
      <vSwitch @click="methods.useCustomizeWallpaper()" :active="store.wallpaper.customize" />
    </li>
    <li class="border-radius">
      <span>设置自定义壁纸</span>
      <input type="button" value="+" @click="base64file.click" />
      <input ref="base64file" type="file" @change="methods.setCustomizeWallpaper()" v-show="false" />
    </li>
  </ul>
</template>

<style lang="stylus" scoped>
li
  margin 14px 0
  padding 8px 10px
  display flex
  justify-content space-between
  align-items center
  background-color #8881
</style>
