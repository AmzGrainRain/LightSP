<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import vSwitch from '../switch.vue'

/**
 * Data
 */
const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
interface Reactive {
  slider: {
    fillet: number
  }
  content: {
    height: number
  }
  searchEngines: string
}
const data = reactive<Reactive>({
  slider: {
    fillet: store.global.fillet
  },
  content: {
    height: store.global.contentHeight
  },
  searchEngines: store.global.searchEngines
})

/**
 * Watch
 */
watch(
  () => data.slider.fillet,
  (newVal, oldVal) => {
    store.global.setGlobalFillet(newVal)
  }
)
watch(
  () => data.content.height,
  (newVal, oldVal) => {
    store.global.setContentHeight(newVal)
  }
)
watch(
  () => data.searchEngines,
  (newVal, oldVal) => {
    store.global.setSearchEngines(newVal)
  }
)
</script>


<template>
  <ul>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>全局毛玻璃效果</span>
      <vSwitch
        @click="store.global.setGlobalBlur(null)"
        :active="store.global.blur"
      />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>调整全局圆角</span>
      <input type="range" min="0" max="18" v-model="data.slider.fillet" />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>调整内容高度</span>
      <input type="range" min="0" max="30" v-model="data.content.height" />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>自适应内容高度</span>
      <vSwitch
        @click="store.global.setAdaptiveContentHeight(null)"
        :active="store.global.adaptiveContentHeight"
      />
    </li>
    <li
      class="border-radius"
      :style="{'background-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor}"
    >
      <span>自定义搜索引擎</span>
      <input
        class="w-50 text-size-m text-center border-none border-radius-sm"
        type="text"
        title="示例: https://www.baidu.com/s?ie=utf-8&wd=关键词"
        placeholder="留空则使用默认值"
        v-model="data.searchEngines"
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
  background-color #fff1
</style>
