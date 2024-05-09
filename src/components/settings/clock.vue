<script setup lang="ts">
import { useIndexStore } from '../../store'
import { useClockStore } from '../../store/clock'
import { useDarkModeStore } from '../../store/darkMode'
import Switcher from '../Switcher.vue'

const store = {
  global: useIndexStore(),
  clock: useClockStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <ul>
    <li>
      <span>显示日期</span>
      <Switcher @click="store.clock.setDateVisible(null)" :active="store.clock.dateVisible" />
    </li>
    <li>
      <span>时钟显秒</span>
      <Switcher @click="store.clock.setSecondsVisible(null)" :active="store.clock.dateVisible" />
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
