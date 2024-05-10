<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{
  Placeholder?: string
  Title?: string
}>()

const emit = defineEmits(['updateEvent'])

const text = ref('')
watch(text, (newVal) => {
  emit('updateEvent', newVal)
})
</script>

<template>
  <input
    type="text"
    class="p-lr w-100 text-center text-size-sm border-none transition blur"
    :placeholder="Placeholder"
    :title="Title"
    v-model="text"
  />
</template>

<style lang="stylus" scoped>
input
  --alpha 20
  font-family inherit
  height 2.5rem
  color var(--color)
  border 1px solid #8888
  border-radius var(--border-radius)
  background-color var(--bg-color)

  &::selection
    background-color #000
</style>
