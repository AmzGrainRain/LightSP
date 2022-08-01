<script setup lang="ts">
import { reactive } from 'vue'
import { useClockStore } from '../store/clock'

/**
 * Props
 */
interface Props {
  Title: string
}
withDefaults(defineProps<Props>(), {
  Title: ''
})

/**
 * Data
 */
interface Reactive {
  date: string
  time: string
}
const data = reactive<Reactive>({
  date: 'xxxx-xx-xx xxx',
  time: '00:00:00'
})
const store = useClockStore()
const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/**
 * Methods
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
 * Init
 */
updateTime()
setInterval(() => {
  updateTime()
}, 1000)
</script>


<template>
  <div
    id="vClock"
    :title="Title"
    class="d-flex text-center pointer"
  >
    <p v-show="store.dateVisible" class="date text-size-m">{{ data.date }}</p>
    <p class="time p-t-sm">{{ data.time }}</p>
  </div>
</template>


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
