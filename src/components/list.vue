<template>
  <div
    id="vList"
    class="w-100 h-0 overflow-x-hide overflow-y-auto transition scrollbar-hide"
    :class="{'show': listData.length && keywords.length}"
  >
    <ul class="m-tb-0 m-lr-auto">
      <li class="m-b transition" v-for="(item, index) in listData" :key="index">
        <a
          class="d-inline-block p-lr-lg w-100 transition text-overflow-ellipsis"
          :class="{
            'selected': selected === index,
            'blur': store.state.gl.blur,
            'dark-mode': store.state.darkMode.enabled
          }"
          :style="`border-radius: ${store.state.gl.fillet}px`"
          :href="item.url"
        >{{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  props: {
    listData: Array,
    keywords: String,
    selected: [Boolean, Number]
  },
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    return { store }
  }
}
</script>

<style lang="stylus" scoped>
// #vList
//   max-height 522px
ul li:last-child
  margin 0
a
  height 2.5rem
  line-height 2.5rem
  text-shadow 0 0 .3rem #333
  background-color #fff6
  &:hover
    text-indent .5rem
    background-color #fff9 !important
.show
  // height calc(100vh - 48px - 140px)
  height calc(100vh - 188px)
.selected
  text-indent .5rem !important
  background-color #fffa !important
.dark-mode
  color #fff
  background-color #1d1f21ad
  &:hover
    background-color #1d1f21c9 !important
</style>
