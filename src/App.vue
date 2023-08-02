<script setup lang="ts">
import { watch, reactive, onBeforeMount, ref } from 'vue'
import { useIndexStore } from './store'
import { useDarkModeStore } from './store/darkMode'
import { jsonp } from 'vue-jsonp'
import WeatherComponent from './components/weather.vue'
import BackgroundComponent from './components/background.vue'
import ClockComponent from './components/clock.vue'
import InputComponent from './components/input.vue'
import ListComponent from './components/list.vue'
import SettingsComponent from './components/settings/index.vue'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

const data = reactive<{
  keyword: string
  result: any
  focusIndex: number
}>({
  keyword: '',    // 搜索框内容
  result: [],     // 关键词联想列表
  focusIndex: -1  // 关键词列表聚焦索引
})

const backgroundBlur = ref(false) // 壁纸模糊
const showSettings = ref(false)   // 显示设置
const contentHeight = ref(true)   // 内容高度（自适应高度功能所需要的占位符高度）

const hooks = {
  // 输入框内容更新事件
  vInputUpdate: (keyword: string): void => {
    data.keyword = keyword
  }
}

document.addEventListener('keydown', (e: KeyboardEvent): void => {
  // Ctrl 组合键
  if (e.ctrlKey) {
    switch (e.key) {
      // 显示设置
      case 's':
        showSettings.value = !showSettings.value
        e.preventDefault()
        break
      // 翻译
      case 'f':
        window.location.href = `https://fanyi.baidu.com/#en/zh/${data.keyword}`
        e.preventDefault()
        break
      // 必应搜索
      case 'b':
        window.location.href = `https://cn.bing.com/search?q=${data.keyword}`
        e.preventDefault()
        break
      // 谷歌搜索
      case 'g':
        window.location.href = `https://www.google.com/search?q=${data.keyword}`
        e.preventDefault()
        break
      // 百度开发者搜索
      case 'd':
        window.location.href = `https://kaifa.baidu.com/searchPage?wd=${data.keyword}&module=SEARCH`
        e.preventDefault()
    }

    // 避免多余的计算
    return
  }

  // 如果关键词列表为空或搜索框内容为空就没必要继续往下执行了
  if (data.result.length == 0 || data.keyword == '') return

  // 关键词选择
  switch (e.key) {
    case 'ArrowUp': {
      // 初始化 focusIndex
      if (data.focusIndex < 0) {
        data.focusIndex = 0
        return
      }

      // 如果当前焦点在顶部就把焦点移动到尾部
      // 反之则向上移动一次
      data.focusIndex = data.focusIndex === 0 ? data.result.length - 1 : data.focusIndex - 1

      e.preventDefault()
      break
    }
    case 'ArrowDown': {
      // 初始化 focusIndex
      if (data.focusIndex < 0) {
        data.focusIndex = 0
        return
      }

      // 如果当前焦点在尾部就把焦点移动到顶部
      // 反之则向下移动一次
      data.focusIndex = data.focusIndex + 1 > data.result.length - 1 ? 0 : data.focusIndex + 1

      e.preventDefault()
      break
    }
    case 'Enter': {
      // 编码关键词
      let encodedKeyword = encodeURIComponent(data.keyword)

      // 搜索引擎
      let searchEngine = 'https://www.baidu.com/s?ie=utf-8&wd=关键词'

      // 如果用户使用自定义的搜索引擎
      if (store.global.searchEngines !== '') {
        searchEngine = store.global.searchEngines
      }

      // 使用搜索框内容进行检索
      if (data.focusIndex < 0) {
        // 编码关键词、跳转
        window.location.href = searchEngine.replace('关键词', encodeURIComponent(data.keyword))
        e.preventDefault()
        break
      }

      // 使用关键词列表的聚焦项进行检索
      if (data.result?.[data.focusIndex]) {
        // 编码关键词、跳转
        window.location.href = searchEngine.replace('关键词', encodeURIComponent(data.result[data.focusIndex].text))
        e.preventDefault()
      }
    }
  }
})

// 监听关键词变化
watch(
  () => data.keyword,
  (newVal) => {
    // 如果输入框为空则取消激活状态
    if (!newVal.length) {
      backgroundBlur.value = false
      contentHeight.value = true
      return
    }

    backgroundBlur.value = true
    contentHeight.value = false

    // 百度关键词 API
    jsonp('https://www.baidu.com/sugrec', {
      callbackName: 'JSONP',
      ie: 'utf-8',
      prod: 'pc',
      from: 'pc_web',
      wd: data.keyword,
      json: 1,
      bs: 'jsonp'
    }).then((res: any) => {
      // 若结果为空
      if (!res?.g?.length) {
        data.result = []
        return
      }

      data.result = []
      if (res.g.length) {
        for (let i = 0, len = res.g.length; i < len; i++) {
          data.result.push({
            text: res.g[i].q,
            url: `https://www.baidu.com/s?ie=utf-8&wd=${res.g[i].q}`
          })
        }
      }

      // 聚焦索引自适应
      const len: number = data.result.length - 1
      if (data.focusIndex > len) data.focusIndex = len
    })
  }
)

onBeforeMount(() => {
  // 首次进入首页的帮助信息
  if (store.global.first === true) {
    alert('温馨提示：点击时间可以打开设置')
    store.global.setFirstStatus(false)
  }

  // 深色模式跟随系统
  if (store.darkMode.followSystem) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      store.darkMode.setDarkModeStatus(true)
    } else store.darkMode.setDarkModeStatus(false)
  }

  console.log('轻起始页 - LightSP')
  console.log('https://github.com/AmzGrainRain/LightSP')
})
</script>

<template>
  <div
    id="app"
    class="p-mx d-flex overflow-hide"
    :style="{
      'justify-content': store.global.adaptiveContentHeight ? 'center' : 'unset',
      'padding-top': store.global.adaptiveContentHeight ? 0 : `${store.global.contentHeight}rem`,
      '--fillet': `${store.global.fillet}px`,
      '--color': store.darkMode.enabled ? store.darkMode.color : store.global.color,
      '--bg-color': store.darkMode.enabled ? store.darkMode.bgColor : store.global.bgColor,
      '--fr-color': store.darkMode.enabled ? store.darkMode.frColor : store.global.frColor
    }"
  >
    <!-- 背景组件 -->
    <Background-Component :Blur="backgroundBlur" />

    <!-- 搜索栏 -->
    <div
      class="search-box transition"
      :style="{
        'padding-bottom': store.global.adaptiveContentHeight ? (contentHeight ? `${store.global.contentHeight}rem` : 0) : ''
      }"
    >
      <!-- 日期组件 -->
      <Clock-Component @click="showSettings = true" title="点击打开设置" />
      <div style="height: 1rem"></div>
      <!-- 输入框 -->
      <Input-Component Placeholder="输入搜索内容" Title="按下回车搜索" @updateEvent="hooks.vInputUpdate" />
      <div style="height: 0.8rem"></div>
      <!-- 关键词联想列表 -->
      <List-Component :ListData="data.result" :Selected="data.focusIndex" :Keywords="data.keyword" />
    </div>

    <!-- 天气组件 -->
    <Weather-Component Title="点击查看详情" />

    <!-- 设置组件 -->
    <transition name="fade">
      <Settings-Component v-show='showSettings' @close="showSettings = false" />
    </transition>
  </div>
</template>

<style lang="stylus" scoped>
#app
  flex-flow column nowrap
  justify-content center
  align-items center
  width 100vw
  height 100vh

.search-box
  display flex
  align-items center
  flex-flow column wrap
  width 45rem
  @media screen and (max-width: 1024px)
    width 80%
  @media screen and (max-width: 512px)
    width 95%

.fade-enter-from
.fade-leave-to
  opacity 0
  transform scale(.95)

.fade-enter-active
  transition all .5s cubic-bezier(0.15, 0.65, 0, 1)
.fade-leave-active
  // transition all .7s cubic-bezier(0,1,.3,1)
  transition all .2s

.fade-enter-to
.fade-leave-from
  opacity 1
  transform scale(1)

</style>
