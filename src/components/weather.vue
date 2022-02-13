<template>
  <a
    id="vWeather"
    class="d-block p-tb-sm p-lr transition pointer"
    :style="`border-radius: ${store.state.gl.fillet}px`"
    :title="title"
    :href="weather.link"
    target="_blank"
    v-show="weather.show"
  >
    <i :class="`qi-${weather.icon}`"></i>
    <div style="display: inline-block; width: .4rem"></div>
    <span>{{ `${weather.temp}°C&nbsp;|&nbsp;${weather.text}` }}</span>
  </a>
</template>

<script>
import axios from 'axios'
import { useStore } from 'vuex'
import { reactive } from 'vue'
export default {
  props: {
    title: String
  },
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const weather = reactive({
      show: false,
      link: '',
      icon: '',
      text: '',
      temp: ''
    })
    // 请求天气数据
    axios.get('https://devapi.qweather.com/v7/weather/now', {
      params: {
        key: '4c54684fdabd4827b1ced33761912043',
        location: store.state.weather.location_id
      }
    }).then(res => {
      weather.link = res.data.fxLink // 天气详情链接
      weather.temp = res.data.now.temp // 温度
      weather.icon = res.data.now.icon // 天气图标
      weather.text = res.data.now.text // 天气描述
      weather.show = true
    }).catch(err => {
      weather.show = false
      console.log(err)
    })

    return { store, weather }
  }
}
</script>

<style lang="stylus" scoped>
@import url('~@/assets/weather/qweather-icons.css')
#vWeather
  position absolute
  top 1rem
  right 1rem
  &:hover
    background-color #fff3
</style>
