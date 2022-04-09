<template>
  <ul id="sClock">
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>显示日期</span>
      <vSwitch @click="store.commit('setDateVisible', null)" :active="store.state.clock.dateVisible" />
    </li>
  </ul>
</template>

<script>
import { useStore } from 'vuex'
import vSwitch from '@/components/switch'
export default {
  components: {
    vSwitch
  },
  setup () {
    const store = useStore()

    return { store }
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
