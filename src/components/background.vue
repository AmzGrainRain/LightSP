<template>
  <img id="vBackground" :src="currentBackground" alt="bg" />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const currentBackground = ref('')

    /**
     *
     *  初始化
     *
     */
    // 检查是否启用了必应壁纸
    if (store.state.wallpaper.bing) {
      fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN').then(ori => ori.json()).then(res => {
        if (res?.images?.[0]?.url) {
          currentBackground.value = `https://cn.bing.com${res.images[0].url}`
        }
      }).catch(err => console.log(err))
    }
    // 检查是否启用了默认壁纸
    if (store.state.wallpaper.local === true) {
      currentBackground.value = './assets/background.jpg'
    }

    return { currentBackground }
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
  object-fit cover
  filter blur(3px)
  transform scale(1.01)
  z-index -1
</style>
