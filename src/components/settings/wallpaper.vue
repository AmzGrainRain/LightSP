<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useWallpaperStore, DefaultWallpaper } from '../../store/wallpaper'
import { useDarkModeStore } from '../../store/darkMode'
import { setItem as lfSet } from 'localforage'
import Switcher from '../Switcher.vue'

const store = {
  global: useIndexStore(),
  wallpaper: useWallpaperStore(),
  darkMode: useDarkModeStore()
}

const dw = new DefaultWallpaper(store.wallpaper)
const defaultWallpaperListChoice = ref(store.wallpaper.default.index)
watch(defaultWallpaperListChoice, (value) => {
  dw.setWallpaper(Number(value))
  dw.enable()
  location.reload()
})

const fileChecker = ref<HTMLInputElement | null>(null)
const setCustomizeWallpaper = () => {
  if (!fileChecker.value?.files?.length) {
    alert('请选择一个文件！')
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(fileChecker.value.files[0])
  reader.onloadend = () => {
    lfSet('CustomizeWallpaper', reader.result, (err) => {
      if (err !== null) console.log('[Error] setCustomizeWallpaper: localforage.setItem')
      store.wallpaper.enableWallpaper('custom')
      location.reload()
    })
  }
}
</script>

<template>
  <ul>
    <li>
      <span>背景聚焦模糊效果</span>
      <Switcher
        @click="store.wallpaper.setWallpaperFocusBlur(null)"
        :active="store.wallpaper.focusBlur"
      />
    </li>
    <li>
      <span>默认壁纸</span>
      <select
        v-model="defaultWallpaperListChoice"
        class="p-lr"
      >
        <option v-for="(item, i) in store.wallpaper.default.wallpaper" :key="i" :value="i">
          {{ item.replace(/\.\w+$/, '') }}
        </option>
      </select>
    </li>
    <li v-if="false">
      <span>随机壁纸（必应）</span>
      <Switcher
        @click="store.wallpaper.enableWallpaper('bing')"
        :active="store.wallpaper.bing.enable"
      />
    </li>
    <li>
      <span>自定义壁纸</span>
      <Switcher
        @click="store.wallpaper.enableWallpaper('custom')"
        :active="store.wallpaper.custom.enable"
      />
    </li>
    <li>
      <span>自定义壁纸</span>
      <input type="button" value="+" @click="fileChecker?.click()" />
      <input ref="fileChecker" type="file" @change="setCustomizeWallpaper()" v-show="false" />
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
  border-radius calc(var(--border-radius) - 4px)
  background-color var(--fr-color)

  select
    outline none
</style>
