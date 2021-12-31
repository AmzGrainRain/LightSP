<template>
  <div id="vMask" :class="{'off': turnOff}"></div>
</template>

<script>
export default {
  props: {
    turnOff: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
#vMask
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  background-color #000
  pointer-events none
  z-index 9
.off
  animation off .3s forwards
@keyframes off
  0%
    opacity 1
  100%
    opacity 0
</style>
