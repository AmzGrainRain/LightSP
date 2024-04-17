<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import Switcher from '../Switcher.vue'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const currentSearchEngine = ref(store.global.searchEngine.index)
watch(currentSearchEngine, (value) => {
  const lastIndex = store.global.searchEngine.list.length - 1
  if (value === lastIndex) {
    if (!confirm('请参阅官方文档来设置此项。\n不当的设置会导致您无法正常搜索，确定继续？')) return
    const url = prompt(
      '示例：https://www.baidu.com/s?ie=utf-8&wd={}\n其中 {} 代表关键词（搜索框内的文本）。\n\n请输入您要自定义的搜索引擎：'
    )
    if (url === null || url?.length === 0) {
      alert('不合法的输入')
      location.reload()
      return
    }
    store.global.searchEngine.list[lastIndex].url = url
  }
  store.global.searchEngine.index = value
})
</script>

<template>
  <ul>
    <li>
      <span>启用毛玻璃效果</span>
      <Switcher
        @click="store.global.blur.enable = !store.global.blur.enable"
        :active="store.global.blur.enable"
      />
    </li>
    <li v-if="store.global.blur.enable">
      <span>模糊强度</span>
      <input type="range" min="2" max="32" v-model="store.global.blur.factor" />
    </li>
    <li>
      <span>圆角大小</span>
      <input type="range" min="0" max="30" v-model="store.global.borderRadius" />
    </li>
    <li>
      <span>自适应偏移高度</span>
      <Switcher
        @click="store.global.adaptiveHeight = !store.global.adaptiveHeight"
        :active="store.global.adaptiveHeight"
      />
    </li>
    <li v-if="!store.global.adaptiveHeight">
      <span>偏移高度</span>
      <input type="range" min="0" max="30" v-model="store.global.offsetHeight" />
    </li>
    <li>
      <span>字体</span>
      <input
        class="text-center border-none border-radius-sm"
        type="text"
        v-model="store.global.font"
        placeholder="留空则使用默认字体"
      />
    </li>
    <li>
      <span>自定义搜索引擎</span>
      <select class="p-lr-sm" v-model="currentSearchEngine">
        <option v-for="(item, index) in store.global.searchEngine.list" :value="index">
          {{ item.name }}
        </option>
      </select>
    </li>
    <li>
      <span>在新标签页展现搜索结果</span>
      <Switcher @click="store.global.setOpenIn()" :active="store.global.openIn === 'newtab'" />
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

  select
    outline none
</style>
