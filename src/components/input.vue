<template>
  <input
    id="vInput"
    type="text"
    class="p-lr w-90 text-center text-size-sm border-none transition"
    :class="{
      'blur': store.state.gl.blur,
      'dark-mode': store.state.darkMode.enabled
    }"
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
.dark-mode
  color #fff
  background-color #1d1f21c9
</style>
