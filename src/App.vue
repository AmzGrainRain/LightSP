<template>
  <main class="p-mx d-flex overflow-hide">
    <!-- 背景组件 -->
    <vBackground :blur="cStatus.vBackground.blur" />

    <!-- 搜索栏 -->
    <div
      class="search-box transition"
      :style="`padding-bottom: ${cStatus.seat ? `${store.state.gl.contentHeight}` : '0'}rem`"
    >
      <!-- 日期组件 -->
      <vClock title="点击打开设置" @click="cStatus.vSettings = true" />

      <!-- 占位元素 -->
      <div style="height: 1rem"></div>

      <!-- 输入框 -->
      <vInput
        placeholder="输入搜索内容"
        title="按下回车直接搜索"
        @updateEvent="mets.vSearchBoxInputUpdateEvent"
      />

      <!-- 装饰用的横线 -->
      <hr class="w-95" v-show="data.result.length && data.keywords.length" />

      <!-- 关键词联想列表 -->
      <vList
        :listData="data.result"
        :selected="data.focus"
        :keywords="data.keywords"
      />
    </div>

    <!-- 天气组件 -->
    <vWeather title="点击查看详情" v-show="store.state.weather.visible" />

    <!-- 设置组件 -->
    <transition name="fade">
      <vSettings
        v-show="cStatus.vSettings"
        @close="cStatus.vSettings = false"
      />
    </transition>
  </main>
</template>

<script>
import { watch, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { jsonp } from 'vue-jsonp'
import vWeather from '@/components/weather.vue'
import vBackground from '@/components/background.vue'
import vClock from '@/components/clock.vue'
import vInput from '@/components/input.vue'
import vList from '@/components/list.vue'
import vSettings from '@/components/settings/index.vue'
export default {
  components: {
    vWeather,
    vBackground,
    vClock,
    vInput,
    vList,
    vSettings
  },
  setup () {
    /**
     *
     *  组件数据
     *
     */
    const store = useStore()
    const cStatus = reactive({
      vBackground: {
        blur: false
      },
      vSettings: false,
      seat: true
    })
    const data = reactive({
      keywords: '',
      result: [],
      focus: false
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
        if (data.focus !== false) {
          data.focus =
            data.focus - 1 < 0
              ? data.result.length - 1 < 0
                ? 0
                : data.result.length - 1
              : data.focus - 1
        } else data.focus = 0
        e.preventDefault()
      }
      // 下箭头
      if (e.key === 'ArrowDown') {
        if (data.focus !== false) {
          data.focus =
            data.focus + 1 > data.result.length - 1 ? 0 : data.focus + 1
        } else data.focus = 0
        e.preventDefault()
      }
      // 回车事件
      if (e.key === 'Enter') {
        if (data.focus === false) {
          if (store.state.gl.searchEngines !== '') {
            window.location.href = store.state.gl.searchEngines.replace(
              '关键词',
              data.keywords
            )
          } else { window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.keywords}` }
          return
        }
        if (data.result?.[data.focus]) {
          if (store.state.gl.searchEngines !== '') {
            window.location.href = store.state.gl.searchEngines.replace(
              '关键词',
              data.result[data.focus].text
            )
          } else {
            window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${
              data.result[data.focus].text
            }`
          }
          return
        }
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
    watch(
      () => data.keywords,
      (newVal, oldVal) => {
        if (!String(newVal).length) {
          cStatus.vBackground.blur = false
          cStatus.seat = true
          return
        }
        cStatus.vBackground.blur = true
        cStatus.seat = false
        // 获取百度关键词联想数据
        jsonp('https://www.baidu.com/sugrec', {
          callbackName: '_JSONP',
          ie: 'utf-8',
          prod: 'pc',
          from: 'pc_web',
          wd: data.keywords,
          json: 1,
          bs: 'jsonp'
        }).then((res) => {
          // 结果为空时
          if (!res?.g.length) {
            data.result = []
            return
          }
          // 反之
          const tmp = []
          if (res.g.length) {
            for (let i = 0, len = res.g.length; i < len; i++) {
              tmp.push({
                text: res.g[i].q,
                url: `https://www.baidu.com/s?ie=utf-8&wd=${res.g[i].q}`
              })
            }
          }
          if (tmp.length) data.result = tmp
          else data.result = []
        })
      }
    )

    /**
     *
     *  生命周期钩子
     *
     */
    onBeforeMount(() => {
      // 跟随系统的深色模式
      if (
        store.state.darkMode.autoSwitch &&
        store.state.darkMode.followSystem
      ) {
        console.log('跟随系统')
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          store.commit('setDarkMode', true)
        }
      }
      // 跟随时间的深色模式
      const curDate = new Date()
      if (curDate.getHours() > 20 && curDate.getHours() < 8) {
        console.log('跟随时间')
        store.commit('setDarkMode', true)
      }
      // 打印信息
      console.log('LightSP - 轻起始页')
      console.log('https://github.com/KiHanLee/LightSP')
    })

    return { store, data, mets, cStatus }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/style.styl'
body
  color #fff
  font 16px/1.2 "PingFang SC", "Microsoft YaHei", sans-serif
  background-color #000
  overflow hidden
main
  flex-flow column nowrap
  justify-content center
  align-items center
  width 100vw
  height 100vh
.fade-enter-active,
.fade-leave-active
  transform translateX(-100%)
  transition all .3s cubic-bezier(1, 0, 0, 1)
</style>

<style lang="stylus" scoped>
.search-box
  display flex
  align-items center
  flex-flow column wrap
  width 45rem
  @media screen and (max-width: 1024px)
    width 80%
  @media screen and (max-width: 512px)
    width 95%
  hr
    display block
    border 0
    border-top 1px solid #fff8
</style>
