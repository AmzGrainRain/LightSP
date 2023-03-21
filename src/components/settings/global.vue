<script setup lang='ts'>
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import vSwitch from '../switch.vue'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const sliderFillet = ref(store.global.fillet)
watch(sliderFillet, (newVal, oldVal) => {
  store.global.setGlobalFillet(newVal)
})

const contentHeight = ref(store.global.contentHeight)
watch(contentHeight, (newVal, oldVal) => {
  store.global.setContentHeight(newVal)
})

const searchEngines = ref(store.global.searchEngines)
watch(searchEngines, (newVal, oldVal) => {
  store.global.setSearchEngines(newVal)
})
</script>

<template>
  <ul>
    <li>
      <span>全局毛玻璃效果</span>
      <vSwitch @click='store.global.setGlobalBlur(null)' :active='store.global.blur' />
    </li>
    <li>
      <span>调整全局圆角</span>
      <input type='range' min='0' max='18' v-model='sliderFillet' />
    </li>
    <li>
      <span>调整内容高度</span>
      <input type='range' min='0' max='30' v-model='contentHeight' />
    </li>
    <li>
      <span>自适应内容高度</span>
      <vSwitch @click='store.global.setAdaptiveContentHeight(null)' :active='store.global.adaptiveContentHeight' />
    </li>
    <li>
      <span>自定义搜索引擎</span>
      <input
        class='w-50 text-size-m text-center border-none border-radius-sm'
        type='text'
        title='示例: https://www.baidu.com/s?ie=utf-8&wd=关键词'
        placeholder='留空则使用默认值'
        v-model='searchEngines'
      />
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
