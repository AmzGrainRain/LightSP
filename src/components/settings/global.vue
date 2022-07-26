<template>
  <ul>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.state.darkMode.enabled
          ? store.state.darkMode.frColor
          : store.state.gl.frColor
      }`"
    >
      <span>全局毛玻璃效果</span>
      <vSwitch
        @click="store.commit('setGlobalBlur', null)"
        :active="store.state.gl.blur"
      />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.state.darkMode.enabled
          ? store.state.darkMode.frColor
          : store.state.gl.frColor
      }`"
    >
      <span>调整全局圆角</span>
      <input type="range" min="0" max="18" v-model="data.slider.fillet" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.state.darkMode.enabled
          ? store.state.darkMode.frColor
          : store.state.gl.frColor
      }`"
    >
      <span>调整内容高度</span>
      <input type="range" min="0" max="30" v-model="data.content.height" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.state.darkMode.enabled
          ? store.state.darkMode.frColor
          : store.state.gl.frColor
      }`"
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

<script>
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
import vSwitch from '@/components/switch'
export default {
  components: {
    vSwitch
  },
  setup () {
    const store = useStore()
    const data = reactive({
      slider: {
        fillet: store.state.gl.fillet
      },
      content: {
        height: store.state.gl.contentHeight
      },
      searchEngines: store.state.gl.searchEngines
    })

    watch(() => data.slider.fillet, (newVal, oldVal) => {
      store.commit('setGlobalFillet', newVal)
    })
    watch(() => data.content.height, (newVal, oldVal) => {
      store.commit('setContentHeight', newVal)
    })
    watch(() => data.searchEngines, (newVal, oldVal) => {
      store.commit('setSearchEngines', newVal)
    })

    return { store, data }
  }
}
</script>

<style lang="stylus" scoped>
li
  margin 14px 0
  padding 8px 10px
  display flex
  justify-content space-between
  align-items center
  background-color #fff1
</style>
