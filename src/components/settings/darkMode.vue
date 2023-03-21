<script setup lang='ts'>
import vSwitch from '../switch.vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <ul>
    <li v-show='!store.darkMode.followSystem'>
      <span>深色模式</span>
      <vSwitch @click='store.darkMode.setDarkModeStatus(null)' :active='store.darkMode.enabled' />
    </li>
    <li class='border-radius'>
      <span>深色模式（跟随系统）</span>
      <vSwitch @click='store.darkMode.setFollowSystem(null)' :active='store.darkMode.followSystem' />
    </li>
    <li class='border-radius'>
      <span>深色壁纸</span>
      <vSwitch @click='store.darkMode.setDarkWallpaper(null)' :active='store.darkMode.darkWallpaper' />
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
