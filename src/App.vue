<template>
  <!-- 背景组件 -->
  <vBackground />

  <!-- 天气组件 -->
  <vWeather title="查看详情|设置位置" @selectCity="mets.vWeatherSelectCity" />
  <vSwitchLocation v-show="cStatus.vSwitchLocation.show" @close="cStatus.vSwitchLocation.show = false" />

  <!-- 搜索栏 -->
  <div class="search-box">
    <vClock />
    <div style="height: 8px"></div>
    <vInput placeholder="输入搜索内容" title="按下回车直接搜索" @updateEvent="mets.vSearchBoxInputUpdateEvent" />
  </div>

  <!-- 装饰用的横线 -->
  <hr v-show="data.result.length && data.keywords.length" />

  <!-- 关键词联想列表 -->
  <vList :listData="data.result" :selected="data.selected" :keywords="data.keywords" />
</template>

<script>
import { watch, reactive, onBeforeMount, onMounted } from 'vue'
import axios from 'axios'
import vWeather from '@/components/weather'
import vSwitchLocation from '@/components/weather/vSwitchLocation.vue'
import vBackground from '@/components/background.vue'
import vClock from '@/components/clock.vue'
import vInput from '@/components/searchBox.vue'
import vList from '@/components/list.vue'
export default {
  components: {
    vWeather,
    vSwitchLocation,
    vBackground,
    vClock,
    vInput,
    vList
  },
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const cStatus = reactive({
      vSwitchLocation: {
        show: false
      }
    })
    const data = reactive({
      keywords: '',
      result: [],
      selected: null,
      loaded: false
    })

    /**
     *
     *  方法
     *
     */
    const mets = {
      // vInput组件 - 内容更新事件 - 关键词联想
      vSearchBoxInputUpdateEvent: (str) => {
        data.keywords = String(str)
      },
      // vWeather组件 - 右键事件 - 选择城市（天气）
      vWeatherSelectCity: () => {
        cStatus.vSwitchLocation.show = true
      }
    }

    /**
     *
     *  热键捕捉
     *
     */
    document.addEventListener('keydown', (e) => {
      // 上箭头
      if (e.key === 'ArrowUp') {
        if (data.selected === null) {
          data.selected = 0
          return
        }
        data.selected = data.selected - 1 < 0 ? data.result.length - 1 < 0 ? 0 : data.result.length - 1 : data.selected - 1
        e.preventDefault()
      }
      // 下箭头
      if (e.key === 'ArrowDown') {
        if (data.selected === null) {
          data.selected = 0
          return
        }
        data.selected = data.selected + 1 > data.result.length - 1 ? 0 : data.selected + 1
        e.preventDefault()
      }
      // 回车事件
      if (e.key === 'Enter') {
        if (data.selected === null) window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.keywords}`
        if (data.result?.[data.selected]?.text) window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.result[data.selected].text}`
        if (data.keywords.length) window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.keywords}`
        e.preventDefault()
      }
      // Ctrl + F: 快速翻译
      if (e.ctrlKey && e.key === 'f') {
        window.location.href = `https://fanyi.baidu.com/#en/zh/${data.keywords}`
        e.preventDefault()
      }
      // Ctrl + B: 必应搜索
      if (e.ctrlKey && e.key === 'b') {
        window.location.href = `https://cn.bing.com/search?q=${data.keywords}`
        e.preventDefault()
      }
      // Ctrl + G: 谷歌搜索
      if (e.ctrlKey && e.key === 'g') {
        window.location.href = `https://www.google.com/search?q=${data.keywords}`
        e.preventDefault()
      }
      // Ctrl + D: 百度开发者搜索
      if (e.ctrlKey && e.key === 'd') {
        window.location.href = `https://kaifa.baidu.com/searchPage?wd=${data.keywords}&module=SEARCH`
        e.preventDefault()
      }
    })

    /**
     *
     *  监听动态数据变化
     *
     */
    watch(() => data.keywords, (newVal, oldVal) => {
      if (!String(newVal).length) return
      // 获取百度关键词联想数据
      axios.get('https://www.baidu.com/sugrec', {
        params: {
          ie: 'utf-8',
          prod: 'pc',
          from: 'pc_web',
          wd: data.keywords
        }
      }).then((res) => {
        // 结果为空时
        if (!res.data?.g) {
          data.result = []
          return
        }
        // 反之
        const tmp = []
        if (res.data.g.length) {
          for (let i = 0, len = res.data.g.length; i < len; i++) {
            tmp.push({
              text: res.data.g[i].q,
              url: `https://www.baidu.com/s?ie=utf-8&wd=${res.data.g[i].q}`
            })
          }
        }
        if (tmp.length) data.result = tmp
        else data.result = []
      }).catch((err) => console.log(err))
    })

    /**
     *
     *  生命周期钩子
     *
     */
    onBeforeMount(() => {
      if (!localStorage.getItem('LightSP')) {
        console.log('尝试重建localStorage对象...')
        localStorage.setItem('LightSP', JSON.stringify({
          wallpaper: {
            bing: false,
            local: true
          },
          weather: {
            location_id: 101010100
          }
        }))
        console.log('重建localStorage对象成功.')
      }
      // 打印信息
      console.log(`
        #      #####   #####
        #      #       #   #                  LightSP - 轻起始页
        #      #####   #####
        #          #   #
        #####  #####   #        开源地址: https://github.com/KiHanLee/LightSP
      `)
    })
    onMounted(() => {
      data.loaded = true
    })

    return { data, mets, cStatus }
  }
}
</script>

<style lang="stylus">
*
  margin 0
  padding 0
  box-sizing border-box
::-webkit-scrollbar
  display none
::selection
  background-color #00f2
body
  display flex
  justify-content center
  align-items center
  width 100%
  height 100vh
  color #fff
  font 16px/1.2 "PingFang SC", "Microsoft YaHei", sans-serif
  background-color #000
  overflow hidden
kbd
  margin 0 .2rem
  padding 0 .2rem
  font-size 1rem
  border 1px solid #aaa
  border-radius .25rem
  background-color #fafafa
</style>

<style lang="stylus">
main
  padding 1rem
  width 40rem
  height 85%
  @media screen and (min-width: 1280px)
    width 48rem
  .search-box
    padding .5rem 0
    display flex
    justify-content flex-end
    align-items center
    flex-flow column wrap
    height 12rem
  hr
    display block
    margin 0 auto
    padding 0 1rem
    width 85%
    height 1px
    border 0
    border-top 1px solid #fff8
</style>
