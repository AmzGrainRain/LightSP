<script setup lang='ts'>
import { useIndexStore } from '../store'
import { useDarkModeStore } from '../store/darkMode'

defineProps<{
  ListData: any[]
  Keywords: string
  Selected: boolean | number
}>()

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <div
    class='w-100 h-0 overflow-x-hide overflow-y-auto transition scrollbar-hide'
    :style='{
      height: (ListData.length && Keywords.length ? `calc(100vh - 188px - ${store.global.contentHeight}rem)` : 0)
    }'
  >
    <ul class='m-tb-0 m-lr-auto'>
      <li class='m-b transition' v-for='(item, index) in ListData' :key='index'>
        <a
          class='d-inline-block p-lr-lg w-100 transition text-overflow-ellipsis'
          :class="{
            'selected': Selected === index,
            'dark-mode': store.darkMode.enabled,
            blur: store.global.blur
          }"
          :href='item.url'
        >{{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang='stylus' scoped>
ul li:last-child
  margin 0

a
  height 2.5rem
  line-height 2.5rem
  text-shadow 0 0 .3rem #333
  backdrop-filter blur(var(--blur))
  border-radius var(--fillet)
  background-color #fff6

  &:hover
    text-indent .5rem
    background-color #fff9 !important

.selected
  text-indent .5rem !important
  background-color #fffa !important

.dark-mode
  color #fff
  background-color #1d1f21ad

  &:hover
    background-color #1d1f21c9 !important
</style>
