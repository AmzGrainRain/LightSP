<script setup lang="ts">
import { ref } from 'vue'
import { useWallpaperStore } from '../store/wallpaper'
import { useDarkModeStore } from '../store/darkMode'
import localforage from 'localforage'
import bgURL from '../assets/background.jpg'

/**
 * Props
 */
interface Props {
  Blur: boolean
}
const props = withDefaults(defineProps<Props>(), {
  Blur: false
})

/**
 * Data
 */
const store = {
  wallpaper: useWallpaperStore(),
  darkMode: useDarkModeStore()
}
const backgroundEl = ref(null) as any
const currentBackground = ref('')

// Use default wallpaper
if (store.wallpaper.default) {
  currentBackground.value = bgURL
}
// Use bing wallpaper
if (store.wallpaper.bing) {
  fetch('https://www.amzgr.cc/api/wallpaper', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `ts=${Date.now()}`
  })
    .then((ori) => ori.json())
    .then((res) => {
      if (res?.url) currentBackground.value = res.url
    })
    .catch((err) => console.log(err))
}
// Use customize wallpaper
if (store.wallpaper.customize) {
  localforage.getItem('CustomizeWallpaper', (err: any, value: any) => {
    if (err !== null) {
      store.wallpaper.setWallpaper('default')
      alert('加载自定义背景失败，已自动设置为默认背景。')
      return
    }
    currentBackground.value = value
  })
}
</script>


<template>
  <img
    ref="backgroundEl"
    id="vBackground"
    class="object-fit-cover"
    :style="`
      transform: ${store.wallpaper.focusBlur && props.Blur ? 'scale(1.2)' : ''};
      filter: ${store.wallpaper.focusBlur && props.Blur ? 'blur(4px)' : ''} ${store.darkMode.darkWallpaper ? 'brightness(.8)' : ''}
    `"
    :src="currentBackground"
    alt="bg"
  />
</template>


<style lang="stylus" scoped>
#vBackground
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  transition all .3s cubic-bezier(0.2, 0.73, 0.61, 0.95);
  z-index -1
</style>
