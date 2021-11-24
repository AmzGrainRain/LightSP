<template>
  <h1 :class="ClassSlot" :style="StyleSlot">{{ TextSlot }}</h1>
</template>

<script>
export default {
  props: {
    ClassSlot: String,
    StyleSlot: String,
    TextSlot: String
  },
}
</script>

<style lang="stylus" scoped>
h1
  letter-spacing .2rem
  font-size 1.8rem
  font-weight normal
</style>
