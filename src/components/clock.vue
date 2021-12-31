<template>
  <div id="vClock">
    <p class="date">{{ date }}</p>
    <p class="time">{{ time }}</p>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const data = reactive({
      date: 'xxxx-xx-xx xxx',
      time: '00:00:00'
    })
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    // const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    /**
     *
     *  方法
     *
     */
    const updateTime = () => {
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
    }

    /**
     *
     *  初始化
     *
     */
    updateTime()
    setInterval(() => updateTime(), 1000)

    return toRefs(data)
  }
}
</script>

<style lang="stylus" scoped>
#vClock
  display flex
  flex-flow column wrap
  text-align center
  text-shadow 0 0 2px #000
  .time
    font-size 2.5rem
    padding .4rem 0 0 0
    letter-spacing .2rem
  .date
    font-size .8rem
    letter-spacing .1rem
</style>
