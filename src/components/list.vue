<template>
  <div class="result-list" :class="{'show': listData.length && keywords.length}">
    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <a :href="item.url">{{ item.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: Array,
    keywords: String
  }
}
</script>

<style lang="stylus" scoped>
.result-list
  margin-top .5rem
  height 0rem
  overflow hidden auto
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
        border-radius .6rem
        background-color #fff6
        backdrop-filter blur(.5rem)
        transition all .3s
        &:hover
          text-indent 1rem
          background-color #fff9
.show
  height calc(100% - 12rem)
</style>
