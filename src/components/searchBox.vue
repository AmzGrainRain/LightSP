<template>
  <input id="vInput" type="text" :placeholder="placeholder" :title="title" v-model="text" />
</template>

<script>
import { ref, watch } from 'vue'
export default {
  props: {
    ClassSlot: String,
    StyleSlot: String,
    placeholder: String,
    title: String
  },
  setup (props, { emit }) {
    /**
     *
     *  组件数据
     *
    */
    const text = ref('')

    /**
     *
     *  监听变化
     *
     */
    watch(text, (newVal, oldVal) => {
      emit('updateEvent', newVal)
    })
    return { text }
  }
}
</script>

<style lang="stylus" scoped>
input
  padding 0 .5rem
  width 90%
  height 2.5rem
  font-size 1rem
  text-align center
  border 0
  border-radius 1rem
  outline none
  background-color #fff9
  backdrop-filter blur(.5rem)
  transition all .3s
  &:hover
    background-color #fff9
</style>
