<template>
  <div
    id="vClock"
    :title="title"
    class="d-flex text-center pointer"
  >
      <p v-show="store.state.clock.dateVisible" class="date text-size-m">{{ data.date }}</p>
      <p class="time p-t-sm">{{ data.time }}</p>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
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
    const store = useStore()
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

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
      data.date = `${Y}年${M}月${D}日 ${d}`
      data.time = `${h}:${m}:${s}`
    }

    /**
     *
     *  初始化
     *
     */
    updateTime()
    setInterval(() => updateTime(), 1000)

    return { store, data }
  }
}
</script>

<style lang="stylus" scoped>
#vClock
  flex-flow column wrap
  text-shadow 0 0 2px #000
.date
  letter-spacing .1rem
.time
  font-size 2.5rem
  letter-spacing .2rem
</style>
