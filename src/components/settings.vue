<template>
  <div id="vSettings" v-show="show">
    <div class="content">
      <header>
        <h1>设置</h1>
      </header>
      <section>
        <div class="item">
          <span>使用必应壁纸API</span>
          <input type="checkbox" v-model="data.useBing" />
        </div>
        <!-- <div class="item">
          <span>使用在线图片</span>
          <input type="button" value="设置" />
        </div>
        <div class="item">
          <span>选择本地图片</span>
          <input type="button" value="上传" @click="imgUpload.click()" />
          <input type="file" ref="imgUpload" v-show="false" />
        </div> -->
      </section>
      <footer @click="emit('close')">
        <i>单击此处关闭</i>
      </footer>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const data = reactive({
      useBing: store.state.wallpaper.bing,
      useLocal: store.state.wallpaper.local
    })
    const imgUpload = ref(null)

    /**
     *
     *  监听数据变化
     *
     */
    watch(() => data.useBing, (newVal, oldVal) => {
      if (newVal) {
        store.commit('setWallpaper', 'bing')
      } else {
        store.commit('setWallpaper', 'local')
      }
    })

    return { data, imgUpload, emit }
  }
}
</script>

<style lang="stylus" scoped>
#vSettings
  position absolute
  top 0
  left 0
  width 100vw
  height 100vw
  background-color #0008
  z-index 9
  .content
    position absolute
    top 10%
    left 0
    right 0
    margin auto
    width 320px
    height 320px
    border-radius 12px
    overflow hidden
    z-index 999
    header
      padding 0 1rem
      display flex
      justify-content center
      align-items center
      height 2rem
      background-color #333
      h1
        font-size 1.1rem
        font-weight normal
        letter-spacing .2rem
    section
      padding .5rem
      height calc(100% - 4rem)
      color #000
      background-color #fff
      div.item
        margin-bottom .5rem
        padding .5rem
        display flex
        justify-content space-between
        align-items center
        font-size .8rem
        border-radius 12px
        background-color #eee
        input[type=button]
          padding 0 .2rem
          font-size .7rem
    footer
      display flex
      justify-content center
      align-items center
      height 2rem
      color #000
      font-size .8rem
      background-color #fff
      cursor pointer
</style>
