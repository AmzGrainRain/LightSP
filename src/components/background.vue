<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
  fetch('https://www.kihanlee.site/api/wallpaper', {
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
      alert('加载自定义背景失败，已自动设置为默认背景。（刷新生效）')
      return
    }
    currentBackground.value = value
  })
}

/**
 * Hooks
 */
onMounted(() => {
  /**
   * Background parallax
   */
  if (store.wallpaper.parallax) {
    // Get the abscissa center point (page width divided by 2)
    const offsetW = document.body.offsetWidth / 2
    // Get the vertical coordinate center point (page height divided by 2)
    const offsetH = document.body.offsetHeight
    // Mouse movement event
    document.body.onmousemove = (e: any) => {
      // Subtract the abscissa of the mouse from the center point
      const mX = offsetW - e.clientX
      // Center point minus mouse ordinate
      const mY = offsetH - e.clientY
      // Change the position of img tag（ × The smaller the value of, the lower the sensitivity)
      backgroundEl.value.style.transform = `scale(1.2) translateX(${mX * 0.02}px) translateY(${mY * 0.03}px)`
    }
  }
})
</script>


<template>
  <img
    ref="backgroundEl"
    id="vBackground"
    class="object-fit-cover"
    :style="{
      'filter': `${store.wallpaper.focusBlur && props.Blur ? 'blur(4px)' : ''} ${store.darkMode.darkWallpaper ? 'brightness(.8)' : ''}`
    }"
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
  // transform scale(1.2)
  transition all .1s
  z-index -1
</style>
