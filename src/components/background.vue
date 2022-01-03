<template>
  <img id="vBackground" ref="backgroundEl" :src="currentBackground" alt="bg" />
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
export default {
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const backgroundEl = ref(null)
    const currentBackground = ref('./assets/background.jpg')

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
  object-fit cover
  filter blur(3px)
  transform scale(1.2)
  transition all .1s
  z-index -1
</style>
