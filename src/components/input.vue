<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../store'
import { useDarkModeStore } from '../store/darkMode'

/**
 * Props
 */
interface Props {
  // ClassSlot?: string
  // StyleSlot?: string
  Placeholder?: string
  Title?: string
}
defineProps<Props>()

/**
 * Emits
 */
const emit = defineEmits(['updateEvent'])

/**
 * Data
 */
const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
const text = ref('')

/**
 * Watch
 */
watch(text, (newVal, oldVal) => {
  emit('updateEvent', newVal)
})
</script>


<template>
  <input
    id="vInput"
    type="text"
    class="p-lr w-100 text-center text-size-sm border-none transition"
    :class="{
      'blur': store.global.blur,
      'dark-mode': store.darkMode.enabled
    }"
    :style="{'borderRadius': store.global.fillet + 'px'}"
    :placeholder="Placeholder"
    :title="Title"
    v-model="text"
  />
</template>


<style lang="stylus" scoped>
input
  height 2.5rem
  background-color #fff9
.dark-mode
  color #fff
  background-color #1d1f21c9
</style>
