<template>
  <ul id="sDarkMode">
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>深色模式</span>
      <vSwitch @click="store.commit('setDarkMode', null)" :active="store.state.darkMode.enabled" />
    </li>
    <li
      v-if="false"
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>自动切换深色模式</span>
      <vSwitch @click="store.commit('setAutoSwitch', null)" :active="store.state.darkMode.autoSwitch" />
    </li>
    <li
      v-if="false"
      class="border-radius"
      :style="`
        opacity: ${store.state.darkMode.autoSwitch ? '1' : '.5'};
        pointer-events: ${store.state.darkMode.autoSwitch ? 'auto' : 'none'};
        background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}
      `"
    >
      <span>自动切换-跟随系统</span>
      <vSwitch @click="store.commit('setAutoDarkMode', 'system')" :active="store.state.darkMode.followSystem" />
    </li>
    <li
      v-if="false"
      class="border-radius"
      :style="`
        opacity: ${store.state.darkMode.autoSwitch ? '1' : '.5'};
        pointer-events: ${store.state.darkMode.autoSwitch ? 'auto' : 'none'};
        background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}
      `"
    >
      <span>自动切换-跟随时间</span>
      <vSwitch @click="store.commit('setAutoDarkMode', 'time')" :active="store.state.darkMode.followTime" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>深色壁纸</span>
      <vSwitch @click="store.commit('setDarkWallpaper', null)" :active="store.state.darkMode.darkWallpaper" />
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
</style>
