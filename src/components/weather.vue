<script setup lang="ts">
import { reactive } from 'vue'
import { useIndexStore } from '../store'
import { useWeatherStore } from '../store/weather'

/**
 * Props
 */
interface Props {
  Title: string
}
defineProps<Props>()

/**
 * Data
 */
interface Reactive {
  show: boolean
  link: string
  icon: string
  text: string
  temp: string
}
const weather = reactive<Reactive>({
  show: false,
  link: '',
  icon: '',
  text: '',
  temp: ''
})
const store = {
  global: useIndexStore(),
  weather: useWeatherStore()
}
fetch(`${store.weather.api}?key=${store.weather.apiKey}&location=${store.weather.location_id}`)
  .then((ori) => ori.json())
  .then((res) => {
    weather.link = res.fxLink
    weather.temp = res.now.temp
    weather.icon = res.now.icon
    weather.text = res.now.text
    weather.show = true
  })
  .catch((err) => {
    weather.show = false
    console.log(err)
  })
</script>


<template>
  <a
    id="vWeather"
    class="d-block p-tb-sm p-lr transition pointer"
    :style="`border-radius: ${store.global.fillet}px`"
    :title="Title"
    :href="weather.link"
    target="_blank"
  >
    <i :class="`qi-${weather.icon}`"></i>
    <div style="display: inline-block; width: .4rem"></div>
    <span>{{ `${weather.temp}°C&nbsp;|&nbsp;${weather.text}` }}</span>
  </a>
</template>


<style lang="stylus" scoped>
@import url('../assets/weather/qweather-icons.css')
#vWeather
  position absolute
  top 1rem
  right 1rem
  &:hover
    background-color #fff3
</style>
