<template>
  <a
    id="vWeather"
    :title="title"
    :href="weather.link"
    :class="{'hide': weather.text === null}"
    @contextmenu="setLocation"
    target="_blank"
  >
    <i :class="`qi-${weather.icon}`"></i>
    <div style="display: inline-block; width: .4rem"></div>
    <span>{{ `${weather.temp}°${weather.text}` }}</span>
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
  setup (props, { emit }) {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const weather = reactive({
      link: null,
      icon: null,
      text: null,
      temp: null
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
      // console.log(`${weather.detail.temp}° ${weather.detail.wind.dir}${weather.detail.wind.scale}级`)
    }).catch(err => console.log(err))

    /**
     *
     *  组件方法
     *
     */
    const setLocation = (e) => {
      emit('selectCity')
      e.preventDefault()
    }

    return { weather, setLocation }
  }
}
</script>

<style lang="stylus" scoped>
@import url('~@/assets/weather/qweather-icons.css')
#vWeather
  display block
  padding .2rem .5rem
  position absolute
  top 1rem
  right 1rem
  color inherit
  text-decoration inherit
  border-radius .5rem
  transition all .2s
  cursor pointer
  &:hover
    background-color #fff3
.hide
  display none
</style>
