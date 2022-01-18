<template>
  <img
    id="vBackground"
    class="object-fit-cover"
    :class="{'vBlur': blur}"
    ref="backgroundEl"
    :src="currentBackground"
    alt="bg"
  />
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import localforage from 'localforage'
export default {
  props: {
    blur: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const backgroundEl = ref(null)
    const currentBackground = ref('')

    /**
     *
     *  初始化
     *
     */
    // 是否启用了默认壁纸
    if (store.state.wallpaper.local) {
      currentBackground.value = './assets/background.jpg'
    }
    // 是否启用了必应壁纸
    if (store.state.wallpaper.bing) {
      fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN').then(ori => ori.json()).then(res => {
        if (res?.images?.[0]?.url) {
          currentBackground.value = `https://cn.bing.com${res.images[0].url}`
        }
      }).catch(err => console.log(err))
    }
    // 是否启用自定义壁纸
    if (store.state.wallpaper.customize) {
      localforage.getItem('01', (err, value) => {
        if (err !== null) {
          alert('加载自定义背景失败，已自动设置为默认背景。（刷新生效）')
          store.commit('setWallpaper', 'local')
          return
        }
        currentBackground.value = value
      })
    }

    /**
     *
     *  生命周期钩子
     *
     */
    onMounted(() => {
      /**
       *
       *  背景视差效果
       *
       */
      // 获取横坐标中心点（页面宽度除2）
      const offsetW = document.body.offsetWidth / 2
      // 获取纵坐标中心点（页面高度除2）
      const offsetH = document.body.offsetHeight
      // 鼠标移动事件
      document.body.onmousemove = e => {
        // 中心点减去鼠标横坐标
        const mX = offsetW - e.clientX
        // 中心点减去鼠标纵坐标
        const mY = offsetH - e.clientY
        // 变换 img 标签的位置（×的数值越小，灵敏度越低）
        backgroundEl.value.style.transform = `scale(1.2) translateX(${mX * 0.02}px) translateY(${mY * 0.03}px)`
      }
    })

    return { backgroundEl, currentBackground }
  }
}
</script>

<style lang="stylus" scoped>
#vBackground
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  transform scale(1.2)
  transition all .1s
  z-index -1
.vBlur
  filter blur(3px)
</style>
