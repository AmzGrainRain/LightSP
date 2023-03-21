<script setup lang='ts'>
import { useIndexStore } from '../../store'
import { useClockStore } from '../../store/clock'
import { useDarkModeStore } from '../../store/darkMode'
import vSwitch from '../switch.vue'

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
      <vSwitch @click='store.clock.setDateVisible(null)' :active='store.clock.dateVisible' />
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
