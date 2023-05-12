<script setup lang='ts'>
import { ref, watch } from 'vue'
import { useIndexStore } from '../store'
import { useDarkModeStore } from '../store/darkMode'

interface Props {
  Placeholder?: string
  Title?: string
}
defineProps<Props>()

const emit = defineEmits(['updateEvent'])
const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const text = ref('')
watch(text, (newVal, oldVal) => {
  emit('updateEvent', newVal)
})
</script>

<template>
  <input
    type='text'
    class='p-lr w-100 text-center text-size-sm border-none transition'
    :class="{
      'dark-mode': store.darkMode.enabled,
      blur: store.global.blur
    }"
    :placeholder='Placeholder'
    :title='Title'
    v-model='text'
  />
</template>

<style lang='stylus' scoped>
input
  height 2.5rem
  border-radius var(--fillet)
  background-color #fff9

.dark-mode
  color #fff
  background-color #1d1f21c9
</style>
