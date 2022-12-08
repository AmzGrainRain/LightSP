<script setup lang="ts">
import vSwitch from '../switch.vue'
import { useIndexStore } from '../../store'
import { useClockStore } from '../../store/clock'
import { useDarkModeStore } from '../../store/darkMode'

/**
 * Data
 */
const store = {
  global: useIndexStore(),
  clock: useClockStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <ul id="sClock">
    <li class="border-radius">
      <span>显示日期</span>
      <vSwitch @click="store.clock.setDateVisible(null)" :active="store.clock.dateVisible" />
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
