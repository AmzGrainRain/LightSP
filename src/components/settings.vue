<template>
  <div id="vSettings" class="d-flex blur">
    <!-- 设置面板 -->
    <div class="panel p" :style="`border-radius: ${store.state.gl.fillet}px`">
      <h1 class="p-tb text-center text-size-normal letter-spacing-sm">起始页设置</h1>
      <hr>
      <!-- 设置全局毛玻璃效果 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>毛玻璃效果</span>
        <div class="sw" @click="store.commit('setGlobalBlur', !store.state.gl.blur)">
          <vSwitch :active="store.state.gl.blur" />
        </div>
      </div>
      <!-- 设置全局圆角数值 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>调整全局圆角</span>
        <div class="sl">
          <input type="range" min="0" max="18" v-model="data.slider">
        </div>
      </div>
      <!-- 设置背景视差效果 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>背景视差效果</span>
        <div class="sw" @click="store.commit('setWallpaperParallax', !store.state.wallpaper.parallax)">
          <vSwitch :active="store.state.wallpaper.parallax" />
        </div>
      </div>
      <!-- 设置背景聚焦效果 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>背景聚焦效果</span>
        <div class="sw" @click="store.commit('setWallpaperFocusBlur', !store.state.wallpaper.focusBlur)">
          <vSwitch :active="store.state.wallpaper.focusBlur" />
        </div>
      </div>
      <!-- 使用必应壁纸 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>必应壁纸</span>
        <div class="sw" @click="mets.useBingWallpaperAPI">
          <vSwitch :active="store.state.wallpaper.bing" />
        </div>
      </div>
      <!-- 使用自定义壁纸 -->
      <div class="item d-flex m-b p w-100 border-radius" style="height: 2rem">
        <span>自定义壁纸</span>
        <input type="button" value="+" @click="base64file.click">
        <input ref="base64file" type="file" @change="mets.useCustomizeWallpaper" v-show="false">
      </div>
      <!-- 显示天气设置 -->
      <div
        class="showWeatherSettings item m-b p-lr w-100 text-center border-radius transition pointer"
        @click="data.weather.show = true"
        style="height: 2rem"
      >
        显示天气组件设置
      </div>
      <!-- 重置设置 -->
      <div class="item d-flex m-b p w-100 border-radius">
        <span>重置设置</span>
        <input type="button" value="点击重置" @click="mets.reset">
      </div>
      <!-- 关闭 -->
      <div
        class="close item p-lr w-100 text-center border-radius transition pointer"
        @click="emit('close')"
      >
        关闭
      </div>
    </div>
    <!-- 二级面板 - 天气 -->
    <div class="weather position-absolute p m-auto w-100 border-radius-lg" v-show="data.weather.show">
      <h2 class="p-tb text-center text-size-normal letter-spacing-sm">修改天气位置</h2>
      <hr>
      <input
        type="text"
        class="w-100 p-lr text-center border-none border-radius"
        placeholder="输入您所在的城市"
        v-model="data.weather.keywords"
        style="height: 2rem"
      >
      <ul v-show="data.weather.hit.length" class="m-t p overflow-x-hide overflow-y-auto border-radius">
        <li
          class="m-b-sm p-lr text-center border-radius pointer"
          v-for="(item, index) in data.weather.hit"
          :key="index"
          @click="mets.setLocation(item.substring(item.length - 9))"
        >
          {{ item.substring(0, item.length - 10) }}
        </li>
      </ul>
      <!-- 关闭 -->
      <div
        class="close m-t p-lr w-100 text-center border-radius transition pointer"
        @click="data.weather.show = false"
        style="height: 2rem"
      >返回</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import localforage from 'localforage'
import { reactive, ref, watch } from 'vue'
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
      slider: store.state.gl.fillet,
      weather: {
        show: false, // 显示天气设置
        keywords: '', // 天气设置输入框内容
        cityData: [], // 城市数据
        hit: [] // 命中结果
      }
    })
    const base64file = ref(null)
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
      data.weather.cityData = tmp.split('\n')
    })

    /**
     *
     *  方法
     *
     */
    const mets = {
      useBingWallpaperAPI: () => { // 使用必应壁纸
        if (store.state.wallpaper.bing) store.commit('setWallpaper', 'local')
        else store.commit('setWallpaper', 'bing')
        alert('设置成功（刷新生效）')
      },
      useCustomizeWallpaper: () => { // 使用自定义壁纸
        const reader = new FileReader()
        reader.readAsDataURL(base64file.value.files[0])
        reader.onloadend = () => {
          localforage.setItem('01', reader.result, err => {
            if (err !== null) {
              store.commit('setWallpaper', 'local')
              return
            }
            store.commit('setWallpaper', 'customize')
            alert('设置成功（刷新生效）')
          })
        }
      },
      setLocation: id => { // 更新天气位置
        store.commit('setWeatherLocation', id)
        alert('设置成功（刷新生效）')
        data.weather.show = false
      },
      reset: () => { // 重置所有设置
        localStorage.removeItem('LightSP')
        location.reload()
      }
    }

    /**
     *
     *  监听动态数据变化
     *
     */
    // 全局圆角滑块
    watch(() => data.slider, (newVal, oldVal) => {
      store.commit('setGlobalFillet', newVal)
    })
    // 设置天气搜索框
    watch(() => data.weather.keywords, (newVal, oldVal) => {
      if (!data.weather.keywords.length) {
        data.weather.hit = []
        return
      }
      data.weather.hit = []
      data.weather.cityData.forEach(e => {
        if (e.indexOf(newVal) !== -1) {
          data.weather.hit.push(e)
        }
      })
    })

    return { emit, store, data, base64file, mets, localforage }
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
.panel
  width 22rem
  height 30rem
  color #000
  font-size .8rem
  background-color #eee
  .item
    justify-content space-between
    align-items center
    background-color #fff
    input[type=button]
      font-size .6rem
    .sw
      width 2.5rem
      height 1.25rem
    .switcher
      justify-content space-between
      align-items center
  .showWeatherSettings
    line-height 2rem
    &:hover
      color #fff
      background-color #8fa2ff
  .close
    line-height 2rem
    &:hover
      color #fff
      background-color #d33
.weather
  top 0
  left 0
  right 0
  bottom 0
  width 22rem
  height 30rem
  color #000
  font-size .8rem
  background-color #eee
  justify-content center
  align-items center
  input
    height 1.5rem
    font-size inherit
    background-color #fff
  ul
    max-height calc(100% - 8rem)
    background-color #fff
    li
      height 1.5rem
      line-height 1.5rem
      &:last-child
        margin 0 !important
      &:hover
        background-color #ddd
  .close
    line-height 2rem
    background-color #fff
    &:hover
      color #fff
      background-color #d33
</style>
