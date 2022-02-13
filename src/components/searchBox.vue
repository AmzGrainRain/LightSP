<template>
  <input
    id="vInput"
    type="text"
    class="p-lr w-90 text-center text-size-sm border-none transition"
    :class="{'vFocus': text.length > 0, 'blur': store.state.gl.blur}"
    :style="`border-radius: ${store.state.gl.fillet}px`"
    :placeholder="placeholder"
    :title="title"
    v-model="text"
  />
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
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
    const store = useStore()
    const text = ref('')

    /**
     *
     *  监听变化
     *
     */
    watch(text, (newVal, oldVal) => {
      emit('updateEvent', newVal)
    })
    return { store, text }
  }
}
</script>

<style lang="stylus" scoped>
input
  height 2.5rem
  background-color #fff9
  &:hover
    background-color #fffb
.vFocus
  background-color #fffb
</style>
