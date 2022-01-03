<template>
  <div id="vSwitchLocation">
    <div class="content">
      <div class="input">
        <input type="text" placeholder="输入您所在的城市" v-model="data.keywords">
        <span @click="emit('close')">X</span>
      </div>
      <div style="height: .5rem"></div>
      <ul v-show="data.hit.length">
        <li v-for="(item, index) in data.hit" :key="index">
          <span>{{ item.substring(0, item.length - 10) }}</span>
          <input type="button" value="设定" @click="mets.setLocation(item.substring(item.length - 9))">
        </li>
      </ul>
      <div v-show="!data.hit.length">
        <i>无结果</i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  setup (props, { emit }) {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const data = reactive({
      keywords: '',
      cityData: [],
      hit: []
    })
    // 获取城市列表 https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
    axios.get('/assets/weather/city_list.csv').then(res => {
      res.data = res.data.split('\n')
      let tmp = ''
      res.data.forEach(e => {
        /*
          e.split(',')[0] = id
          e.split(',')[2] = 县
          e.split(',')[7] = 省
          e.split(',')[9] = 市
        */
        tmp += `${e.split(',')[7]}-${e.split(',')[9]}-${e.split(',')[2]}-${e.split(',')[0]}\n`
      })
      data.cityData = tmp.split('\n')
    })

    /**
     *
     *  方法
     *
     */
    const mets = {
      setLocation: id => {
        store.commit('setWeatherLocation', id)
        emit('close')
      }
    }

    /**
     *
     *  监听动态数据变化
     *
     */
    watch(() => data.keywords, (newVal, oldVal) => {
      data.hit = []
      data.cityData.forEach(e => {
        if (e.indexOf(newVal) !== -1) {
          data.hit.push(e)
        }
      })
    })

    return { data, mets, emit }
  }
}
</script>

<style lang="stylus" scoped>
#vSwitchLocation
  display flex
  justify-content center
  align-items center
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  backdrop-filter blur(4px)
  z-index 1
  .content
    padding 1rem
    width 20rem
    height 24rem
    color #000
    background-color #fff
    border-radius .8rem
    overflow hidden
    .input
      display flex
      justify-content space-between
      align-items center
      width 100%
      height 2rem
      input
        width calc(100% - 2.5rem)
        height 100%
        text-align center
        border none
        border-radius .8rem
        outline none
        background-color #eee
      span
        width 2rem
        height 2rem
        text-align center
        font-size .7rem
        line-height 2rem
        border-radius .8rem
        background-color #eee
        cursor pointer
        &:hover
          color #fff
          background-color #f55
    ul
      list-style none
      height calc(100% - 2.5rem)
      font-size .8rem
      overflow-y auto
      li
        display flex
        justify-content space-between
        margin-bottom .4rem
        input
          padding 0 .2rem
          border none
          font-size .7rem
          cursor pointer
          &:hover
            background-color #ddd
    div
      height calc(100% - 2.5rem)
      display flex
      justify-content center
      align-items center
      text-align center
      font-size .8rem
</style>
