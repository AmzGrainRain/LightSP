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
  <div class="position-relative w-100 h-100 border-solid border-radius-lg overflow-hide">
    <input
      type="checkbox"
      class="position-absolute m-0 w-100 h-100 pointer"
      placeholder="朴实无华的按钮"
      :checked="active"
    />
    <i
      class="position-absolute w-50 h-100 border-solid border-radius-lg transition-ease-in-out"
    ></i>
  </div>
</template>

<style lang="stylus" scoped>
div
  width 2.5rem
  height 1.25rem
  box-shadow inset 0 0 2px #888

input
  top 0
  left 0
  opacity 0

  &:checked ~ i
    background-color #8296ff !important
    transform: translateX(100%)

i
  pointer-events none
  background-color #888
</style>
