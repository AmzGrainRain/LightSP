<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import Switcher from '../Switcher.vue'
import { settingRowClass, settingsSelectClass, settingsTextInputClass } from './classes'

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
    <li :class="settingRowClass">
      <span>启用毛玻璃效果</span>
      <Switcher
        @click="store.global.blur.enable = !store.global.blur.enable"
        :active="store.global.blur.enable"
      />
    </li>
    <li :class="settingRowClass" v-if="store.global.blur.enable">
      <span>模糊强度</span>
      <input type="range" min="2" max="32" v-model="store.global.blur.factor" />
    </li>
    <li :class="settingRowClass">
      <span>圆角大小</span>
      <input type="range" min="0" max="30" v-model="store.global.borderRadius" />
    </li>
    <li :class="settingRowClass">
      <span>自适应偏移高度</span>
      <Switcher
        @click="store.global.adaptiveHeight = !store.global.adaptiveHeight"
        :active="store.global.adaptiveHeight"
      />
    </li>
    <li :class="settingRowClass" v-if="!store.global.adaptiveHeight">
      <span>偏移高度</span>
      <input type="range" min="0" max="30" v-model="store.global.offsetHeight" />
    </li>
    <li :class="settingRowClass">
      <span>字体</span>
      <input
        :class="settingsTextInputClass"
        class="bg-white text-black rounded-sm"
        type="text"
        v-model="store.global.font"
        placeholder="留空则使用默认字体"
      />
    </li>
    <li :class="settingRowClass">
      <span>自定义搜索引擎</span>
      <select :class="settingsSelectClass" v-model="currentSearchEngine" class="bg-white text-black rounded-sm">
        <option v-for="(item, index) in store.global.searchEngine.list" :value="index">
          {{ item.name }}
        </option>
      </select>
    </li>
    <li :class="settingRowClass">
      <span>在新标签页展现搜索结果</span>
      <Switcher @click="store.global.setOpenIn()" :active="store.global.openIn === 'newtab'" />
    </li>
    <li :class="settingRowClass">
      <span>显示搜索建议</span>
      <Switcher
        @click="store.global.showKeywordList = !store.global.showKeywordList"
        :active="store.global.showKeywordList"
      />
    </li>
    <li :class="settingRowClass">
      <span>显示搜索框</span>
      <Switcher
        @click="store.global.showSearchBox = !store.global.showSearchBox"
        :active="store.global.showSearchBox"
      />
    </li>
  </ul>
</template>
