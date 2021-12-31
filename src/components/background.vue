<template>
  <img id="vBackground" src="/lightsp/assets/background.jpg" alt="bg" />
</template>

<script>
export default {
  setup () {
  }
}
</script>

<style lang="stylus" scoped>
#vBackground
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  object-fit cover
  filter blur(3px)
  transform scale(1.01)
  z-index -1
</style>
