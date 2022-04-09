<template>
  <ul>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>背景聚焦模糊效果</span>
      <vSwitch @click="store.commit('setWallpaperFocusBlur', null)" :active="store.state.wallpaper.focusBlur" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>背景视差效果</span>
      <vSwitch @click="store.commit('setWallpaperParallax', null)" :active="store.state.wallpaper.parallax" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>使用必应壁纸</span>
      <vSwitch @click="mets.useBingWallpaperAPI()" :active="store.state.wallpaper.bing" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>自定义壁纸</span>
      <input type="button" value="+" @click="base64file.click">
      <input ref="base64file" type="file" @change="mets.useCustomizeWallpaper" v-show="false">
    </li>
  </ul>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import localforage from 'localforage'
import vSwitch from '@/components/switch'
export default {
  components: {
    vSwitch
  },
  setup () {
    const store = useStore()
    const base64file = ref(null)

    const mets = {
      // 使用必应壁纸
      useBingWallpaperAPI: () => {
        if (store.state.wallpaper.bing) store.commit('setWallpaper', 'default')
        else store.commit('setWallpaper', 'bing')
        alert('设置成功（刷新生效）')
      },
      // 使用自定义壁纸
      useCustomizeWallpaper: () => {
        const reader = new FileReader()
        reader.readAsDataURL(base64file.value.files[0])
        reader.onloadend = () => {
          localforage.setItem('CustomizeWallpaper', reader.result, err => {
            if (err !== null) {
              store.commit('setWallpaper', 'default')
              alert('应用失败！已为您切换为默认壁纸。（刷新生效）')
              return
            }
            store.commit('setWallpaper', 'customize')
            alert('设置成功（刷新生效）')
          })
        }
      }
    }

    return { store, mets, base64file }
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
