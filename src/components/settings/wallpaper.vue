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
  // 使用必应壁纸
  useBingWallpaperAPI: () => {
    if (store.wallpaper.bing) store.wallpaper.setWallpaper('default')
    else store.wallpaper.setWallpaper('bing')
  },
  // 使用自定义壁纸
  useCustomizeWallpaper: () => {
    const reader = new FileReader()
    reader.readAsDataURL(base64file.value.files[0])
    reader.onloadend = () => {
      localforage.setItem('CustomizeWallpaper', reader.result, (err) => {
        if (err !== null) {
          store.wallpaper.setWallpaper('default')
          alert('应用失败！已为您切换为默认壁纸。（刷新生效）')
          return
        }
        store.wallpaper.setWallpaper('customize')
      })
    }
  }
}
</script>

<template>
  <ul>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>背景聚焦模糊效果</span>
      <vSwitch
        @click="store.wallpaper.setWallpaperFocusBlur(null)"
        :active="store.wallpaper.focusBlur"
      />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>背景视差效果</span>
      <vSwitch
        @click="store.wallpaper.setWallpaperParallax(null)"
        :active="store.wallpaper.parallax"
      />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>使用必应壁纸</span>
      <vSwitch
        @click="methods.useBingWallpaperAPI()"
        :active="store.wallpaper.bing"
      />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>自定义壁纸</span>
      <input type="button" value="+" @click="base64file.click" />
      <input
        ref="base64file"
        type="file"
        @change="methods.useCustomizeWallpaper"
        v-show="false"
      />
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
  background-color #fff1
</style>
