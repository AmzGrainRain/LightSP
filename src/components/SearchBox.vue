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
    class="glass-effect h-10 w-full border border-[#8888] px-2 text-center text-base transition-all duration-300 outline-0"
    :placeholder="Placeholder"
    :title="Title"
    v-model="text"
  />
</template>

<style scoped>
input {
  font-family: inherit;
  color: var(--color);
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
}

input::selection {
  background-color: #000;
}
</style>
