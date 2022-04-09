<template>
  <ul>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>全局毛玻璃效果</span>
      <vSwitch @click="store.commit('setGlobalBlur', null)" :active="store.state.gl.blur" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>调整全局圆角</span>
      <input type="range" min="0" max="18" v-model="data.slider.fillet">
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>调整内容高度</span>
      <input type="range" min="60" max="100" v-model="data.content.height">
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
      }
    })

    watch(() => data.slider.fillet, (newVal, oldVal) => {
      store.commit('setGlobalFillet', newVal)
    })
    watch(() => data.content.height, (newVal, oldVal) => {
      store.commit('setContentHeight', newVal)
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
