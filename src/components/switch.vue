<template>
  <div
    id="vSwitch"
    class="position-relative w-100 h-100 border-solid border-radius-lg overflow-hide"
  >
    <input
      type="checkbox"
      class="position-absolute m-0 w-100 h-100 pointer"
      :checked="active"
    />
    <i
      class="position-absolute w-50 h-100 border-solid border-radius-lg transition-ease-in-out"
    ></i>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
input
  top 0
  left 0
  opacity 0
  &:checked ~ i
    background-color #8296ff !important
    transform: translateX(100%)
i
  pointer-events none
</style>
