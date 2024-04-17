<script setup lang="ts">
import Switcher from '../Switcher.vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <ul>
    <li v-show="!store.darkMode.followSystem">
      <span>深色模式</span>
      <Switcher
        @click="store.darkMode.enabled = !store.darkMode.enabled"
        :active="store.darkMode.enabled"
      />
    </li>
    <li class="border-radius">
      <span>深色模式（跟随系统）</span>
      <Switcher
        @click="store.darkMode.setFollowSystem(null)"
        :active="store.darkMode.followSystem"
      />
    </li>
    <li class="border-radius">
      <span>深色壁纸</span>
      <Switcher
        @click="store.darkMode.setDarkWallpaper(null)"
        :active="store.darkMode.darkWallpaper"
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
  border-radius calc(var(--border-radius) - 4px)
  background-color var(--fr-color)
</style>
