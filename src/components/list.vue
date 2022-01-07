<template>
  <div
    id="vList"
    class="m-t overflow-x-hide overflow-y-auto transition scrollbar-hide"
    :class="{'show': listData.length && keywords.length}"
  >
    <ul class="m-tb-0 m-lr-auto w-90">
      <li class="m-b transition" v-for="(item, index) in listData" :key="index">
        <a
          class="d-inline-block p-lr-lg w-100 border-radius-lg transition blur"
          :href="item.url"
          :class="{'selected': selected === index}"
        >{{ item.text }}</a>
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
  height 0rem
a
  height 2.5rem
  line-height 2.5rem
  text-shadow 0 0 .3rem #333
  background-color #fff6
  &:hover
    text-indent .5rem
    background-color #fffa
.show
  height calc(100% - 12rem) !important
.selected
  text-indent .5rem !important
  background-color #fffa !important
</style>
