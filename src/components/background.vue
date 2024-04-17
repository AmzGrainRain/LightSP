<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useWallpaperStore, getWallpaperLoader } from '../store/wallpaper'
import { useDarkModeStore } from '../store/darkMode'

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

const backgroundEl = ref<HTMLImageElement | null>(null)
const backgroundLoaded = ref(false)

onBeforeMount(async () => {
  const wallpaperUrl = await getWallpaperLoader(store.wallpaper)?.getWallpaperUrl()
  if (!wallpaperUrl) {
    alert('加载背景失败')
    return
  }

  backgroundEl.value?.setAttribute('src', wallpaperUrl)
})
</script>

<template>
  <img
    ref="backgroundEl"
    class="penetrate object-fit-cover"
    :class="{
      fadeIn: backgroundLoaded,
      focused: store.wallpaper.focusBlur && props.Blur,
      'dark-mode': store.darkMode.darkWallpaper
    }"

    @load="backgroundLoaded = true"
    alt="bg"
  />
</template>

<style lang="stylus" scoped>
img
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  transition all .3s cubic-bezier(0.2, 0.73, 0.61, 0.95)
  opacity 0
  z-index -1

.focused
  transform scale(1.2)
  filter blur(4px)

.dark-mode
  filter brightness(0.8)

.fadeIn
  animation aniFadeIn 1s forwards

@keyframes aniFadeIn
  0%
    opacity 0
  100%
    opacity 1
</style>
