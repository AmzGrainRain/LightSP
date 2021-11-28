<template>
  <input type="text" :placeholder="placeholder" v-model="text" @keyup.enter="enter()" />
</template>

<script>
import { ref, watch } from 'vue'
export default {
  props: {
    ClassSlot: String,
    StyleSlot: String,
    placeholder: String
  },
  setup (props, { emit }) {
    /* 动态数据 */
    const text = ref('')
    /* 方法 */
    const enter = () => {
      emit('enterEvent', text.value)
    }
    /* 监听变化 */
    watch(text, (newVal, oldVal) => {
      emit('updateEvent', newVal)
    })
    return { text, enter }
  }
}
</script>

<style lang="stylus" scoped>
input
  padding 0 .5rem
  width 90%
  height 2.5rem
  font-family 'CUS'
  font-size 1rem
  text-align center
  border 0
  border-radius .6rem
  outline none
  background-color #fff9
  backdrop-filter blur(.5rem)
  transition all .3s
  &:hover
    background-color #fff9
</style>
