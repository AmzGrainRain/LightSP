<script setup lang="ts">
withDefaults(
  defineProps<{
    active: boolean
  }>(),
  {
    active: false
  }
)
</script>

<template>
  <div class="relative h-5 w-10 overflow-hidden rounded-2xl border border-black/5 shadow-[inset_0_0_2px_#888]">
    <input
      type="checkbox"
      class="absolute left-0 top-0 m-0 h-full w-full cursor-pointer opacity-0"
      placeholder="朴实无华的按钮"
      :checked="active"
    />
    <i
      class="pointer-events-none absolute h-full w-1/2 rounded-2xl border border-black/5 bg-[#888] transition-all duration-300 ease-in-out"
    ></i>
  </div>
</template>

<style scoped>
input:checked ~ i {
  background-color: #8296ff !important;
  transform: translateX(100%);
}
</style>
