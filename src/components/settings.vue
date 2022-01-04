<template>
  <div id="vSettings" class="d-flex blur">
    <div class="content p border-radius-lg">
      <h1 class="p-tb text-center text-size-normal letter-spacing-sm">起始页设置</h1>
      <hr>
      <!-- 壁纸 -->
      <div class="item d-flex m-b p-lr w-100 border-radius">
        <span>使用必应壁纸</span>
        <div class="sw" @click="mets.useBingWallpaperAPI">
          <vSwitch :active="store.state.wallpaper.bing" />
        </div>
      </div>
      <!-- 天气 -->
      <div class="weather item m-b p w-100 border-radius">
        <span class="d-block p-b text-size-sm text-weight-bold text-center">修改天气位置</span>
        <input
          type="text"
          class="w-100 p-lr text-center border-none border-radius"
          placeholder="输入您所在的城市"
          v-model="data.keywords"
        >
        <ul v-show="data.hit.length" class="m-t p overflow-x-hide overflow-y-auto border-radius">
          <li
            class="m-b-sm p-lr text-center border-radius pointer"
            v-for="(item, index) in data.hit"
            :key="index"
            @click="mets.setLocation(item.substring(item.length - 9))"
          >
            {{ item.substring(0, item.length - 10) }}
          </li>
        </ul>
      </div>
      <!-- 关闭 -->
      <div class="close item p-lr w-100 text-center border-radius transition pointer" @click="emit('close')">关闭</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
import vSwitch from '@/components/switch'
export default {
  components: {
    vSwitch
  },
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
    axios.get('./assets/weather/city_list.csv').then(res => {
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
      useBingWallpaperAPI: () => {
        if (store.state.wallpaper.bing) store.commit('setWallpaper', 'local')
        else store.commit('setWallpaper', 'bing')
      },
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
      if (!data.keywords.length) {
        data.hit = []
        return
      }
      data.hit = []
      data.cityData.forEach(e => {
        if (e.indexOf(newVal) !== -1) {
          data.hit.push(e)
        }
      })
    })

    return { emit, store, data, mets }
  }
}
</script>

<style lang="stylus" scoped>
::selection
  background transparent
#vSettings
  position absolute
  top 0
  left 0
  justify-content center
  align-items center
  width 100vw
  height 100vh
  background-color #0006
.content
  width 22rem
  height 30rem
  color #000
  font-size .8rem
  background-color #eee
  .item
    justify-content space-between
    align-items center
    height 2rem
    background-color #fff
    .sw
      width 2.5rem
      height 1.25rem
  .weather
    height calc(100% - 8.2rem)
    justify-content center
    align-items center
    input
      height 1.5rem
      font-size inherit
      background-color #eee
    ul
      max-height calc(100% - 3.5rem)
      background-color #eee
      li
        height 1.5rem
        line-height 1.5rem
        &:last-child
          margin 0 !important
        &:hover
          background-color #ddd
  .close
    line-height 2rem
    &:hover
      color #fff
      background-color #d33
</style>
