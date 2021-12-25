<template>
  <div id="vClock">
      <p class="date">{{ date }}</p>
      <p class="time">{{ time }}</p>
  </div>
</template>

<script>
import { onBeforeMount, reactive, toRefs } from 'vue'
export default {
  setup () {
    /**
     *
     *  动态数据
     *
     */
    const data = reactive({
      date: '0000-00-00',
      time: '00:00:00'
    })

    /**
     *
     *  静态数据
     *
     */
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    /**
     *
     *  挂载之前
     *
     */
    onBeforeMount(() => {
      setInterval(() => {
        const t = new Date()
        const Y = t.getFullYear()
        const M = t.getMonth() + 1 < 10 ? `0${t.getMonth() + 1}` : t.getMonth() + 1
        const D = t.getDate() < 10 ? `0${t.getDate()}` : t.getDate()
        const d = week[t.getDay()]
        const h = t.getHours() < 10 ? `0${t.getHours()}` : t.getHours()
        const m = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes()
        const s = t.getSeconds() < 10 ? `0${t.getSeconds()}` : t.getSeconds()
        data.date = `${Y}-${M}-${D} ${d}`
        data.time = `${h}:${m}:${s}`
      }, 1000)
    })

    return toRefs(data)
  }
}
</script>

<style lang="stylus" scoped>
@font-face
  font-family 'Share Tech Mono'
  font-style normal
  font-weight 400
  src url('~@/assets/Share Tech Mono.woff2') format('woff2')
  unicode-range U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD

#vClock
  font-family 'Share Tech Mono', monospace
  display flex
  flex-flow column wrap
  text-align center
  letter-spacing .2rem
  text-shadow 0 0 2px #000
  .time
    font-size 3rem
    padding .4rem 0 0 0
  .date
    font-size 1rem
</style>
