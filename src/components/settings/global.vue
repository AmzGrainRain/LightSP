<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import vSwitch from '../switch.vue'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const sliderFillet = ref(store.global.fillet)
watch(sliderFillet, (newValue) => {
  store.global.setGlobalFillet(newValue)
})

const contentHeight = ref(store.global.contentHeight)
watch(contentHeight, (newValue) => {
  store.global.setContentHeight(newValue)
})

const searchEnginesList = [
  { name: '必应搜索', url: 'https://www.bing.com/search?q={}' },
  { name: '百度搜素', url: 'https://www.baidu.com/s?ie=utf-8&wd={}' },
  { name: '谷歌搜索', url: 'https://www.google.com/search?q={}' },
  { name: '360搜索', url: 'https://www.so.com/s?ie=utf-8&q={}'},
  { name: '搜狗搜索', url: 'https://www.sogou.com/web?query={}'},
  { name: '自定义', url: '' }
]

const selectedSearchEngines = ref(1)
watch(selectedSearchEngines, (newValue: number, oldValue: number) => {
  if (newValue === searchEnginesList.length - 1) {
    if (!confirm('请参阅官方文档来设置此项。\n不当的设置会导致您无法正常搜索，确定继续？')) return
    selectedSearchEngines.value = oldValue
    const url = prompt('示例：https://www.baidu.com/s?ie=utf-8&wd={}\n其中 {} 代表关键词（搜索框内的文本）。\n\n请输入您要自定义的搜索引擎：')
    if (url === null || url?.length === 0) {
      alert('不合法的输入')
      return
    }
    searchEnginesList[newValue].url = url
  }
  store.global.setSearchEngines(searchEnginesList[newValue].url)
})
</script>

<template>
  <ul>
    <li>
      <span>毛玻璃效果</span>
      <vSwitch @click="store.global.setGlobalBlur(null)" :active="store.global.blur" />
    </li>
    <li>
      <span>调整圆角幅度</span>
      <input type="range" min="0" max="18" v-model="sliderFillet" />
    </li>
    <li>
      <span>调整内容高度</span>
      <input type="range" min="0" max="30" v-model="contentHeight" />
    </li>
    <li>
      <span>自适应内容高度</span>
      <vSwitch @click="store.global.setAdaptiveContentHeight(null)" :active="store.global.adaptiveContentHeight" />
    </li>
    <li>
      <span>自定义搜索引擎</span>
      <select class="p-lr-sm" v-model="selectedSearchEngines">
        <option v-for="(item, index) in searchEnginesList" :value="index">{{ item.name }}</option>
      </select>
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
  border-radius calc(var(--fillet) - 4px)
  background-color #8881
</style>
