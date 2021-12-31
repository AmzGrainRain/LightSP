<template>
  <div id="vList" :class="{'show': listData.length && keywords.length}">
    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <a :href="item.url" :class="{'selected': selected == index}">{{ item.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: Array,
    keywords: String,
    selected: Number
  }
}
</script>

<style lang="stylus" scoped>
#vList
  margin-top .5rem
  height 0rem
  overflow hidden auto
  scrollbar-width none
  transition all .3s
  ul
    margin 0 auto
    list-style none
    width 90%
    li
      margin .5rem 0
      transition all .3s
      &:first-child
        margin-top 0
      &:last-child
        margin-bottom 0
      a
        display inline-block
        width 100%
        height 2.5rem
        color inherit
        line-height 2.5rem
        text-indent .8rem
        text-decoration inherit
        text-shadow 0 0 .3rem #333
        border-radius 1rem
        background-color #fff6
        backdrop-filter blur(.5rem)
        transition all .3s
        &:hover
          text-indent 1rem
          background-color #fff9
.show
  height calc(100% - 12rem) !important
.selected
  text-indent 1rem !important
  background-color #fff9 !important
</style>
