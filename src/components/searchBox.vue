<template>
  <input
    id="vInput"
    type="text"
    class="p-lr w-90 text-center text-size-sm border-none border-radius-lg transition blur"
    :placeholder="placeholder"
    :title="title"
    v-model="text"
  />
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
  height 2.5rem
  background-color #fff9
  &:hover
    background-color #fffd
</style>
