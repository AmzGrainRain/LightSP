<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue'
import { useWallpaperStore } from '../store/wallpaper'
import { useDarkModeStore } from '../store/darkMode'
import { getItem as lfGet } from 'localforage'
import bgURL from '../assets/background.jpg'

interface Props {
  Blur: boolean
}

const props = withDefaults(defineProps<Props>(), {
  Blur: false
})

const store = {
  wallpaper: useWallpaperStore(),
  darkMode: useDarkModeStore()
}
const backgroundEl = ref(null) as any
const currentBackground = ref('')
const backgroundLoaded = ref(false)

onBeforeMount(() => {
  // 使用默认壁纸？
  if (store.wallpaper.default) {
    currentBackground.value = bgURL
  }
  // 使用必应壁纸？
  if (store.wallpaper.bing) {
    fetch('https://www.amzgr.cc/api/wallpaper', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((ori) => ori.json())
      .then((res) => {
        if (res?.url) currentBackground.value = res.url
      })
      .catch((err) => console.log(err))
  }
  // 使用自定义壁纸？
  if (store.wallpaper.customize) {
    lfGet('CustomizeWallpaper', (err: any, value: any) => {
      if (err || !value) {
        store.wallpaper.setWallpaper('default')
        if (!value) alert('自定义图片不存在，已自动切换为默认背景。')
        else alert('加载自定义背景失败，已自动切换为默认背景。')
        return
      }
      currentBackground.value = value
    })
  }
})
</script>

<template>
  <img
    ref='backgroundEl'
    class='penetrate object-fit-cover'
    :class='{
      fadeIn: backgroundLoaded
    }'
    :style="`
      transform: ${store.wallpaper.focusBlur && props.Blur ? 'scale(1.2)' : ''};
      filter: ${store.wallpaper.focusBlur && props.Blur ? 'blur(4px)' : ''} ${store.darkMode.darkWallpaper ? 'brightness(.8)' : ''}
    `"
    :src='currentBackground'
    @load='backgroundLoaded = true'
    alt='bg'
  />
</template>

<style lang='stylus' scoped>
img
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  opacity 0
  transition all .3s cubic-bezier(0.2, 0.73, 0.61, 0.95)
  z-index -1

.fadeIn
  animation aniFadeIn 1s forwards

@keyframes aniFadeIn
  0%
    opacity 0
  100%
    opacity 1
</style>
