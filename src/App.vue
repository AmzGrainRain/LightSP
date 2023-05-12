<script setup lang="ts">
import { watch, reactive, onBeforeMount, ref } from 'vue'
import { useIndexStore } from './store'
import { useDarkModeStore } from './store/darkMode'
import { jsonp } from 'vue-jsonp'
import vWeather from './components/weather.vue'
import vBackground from './components/background.vue'
import vClock from './components/clock.vue'
import vInput from './components/input.vue'
import vList from './components/list.vue'
import vSettings from './components/settings/index.vue'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}

interface DataReactive {
  keyword: string
  result: any
  focusIndex: number
}

const data = reactive<DataReactive>({
  keyword: '',
  result: [],
  focusIndex: -1
})

const backgroundBlur = ref(false)
const showSettings = ref(false)
const contentHeight = ref(true)

// 自定义事件
const hooks = {
  vInputUpdate: (keyword: string): void => {
    data.keyword = keyword
  }
}

// 热键监听
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
      // 使用搜索框内容进行检索
      if (data.focusIndex < 0) {
        // 是否使用用户自定义的搜索引擎
        if (store.global.searchEngines !== '') window.location.href = store.global.searchEngines.replace('关键词', data.keyword)
        else window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.keyword}`

        e.preventDefault()
        break
      }

      // 使用关键词列表的聚焦项进行检索
      if (data.result?.[data.focusIndex]) {
        // 是否使用用户自定义的搜索引擎
        if (store.global.searchEngines !== '') {
          window.location.href = store.global.searchEngines.replace('关键词', data.result[data.focusIndex].text)
        } else window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.result[data.focusIndex].text}`

        e.preventDefault()
      }
    }
  }
})

// 监听输入框内容变化
watch(
  () => data.keyword,
  (newVal, oldVal) => {
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
    <vBackground :Blur="backgroundBlur" />

    <!-- 搜索栏 -->
    <div
      class="search-box transition"
      :style="{
        'padding-bottom': store.global.adaptiveContentHeight ? (contentHeight ? `${store.global.contentHeight}rem` : 0) : ''
      }"
    >
      <!-- 日期组件 -->
      <vClock Title="点击打开设置" @click="showSettings = !showSettings" />
      <!-- 占位元素 -->
      <div style="height: 1rem"></div>
      <!-- 输入框 -->
      <vInput Placeholder="输入搜索内容" Title="按下回车直接搜索" @updateEvent="hooks.vInputUpdate" />
      <!-- 占位元素 -->
      <div style="height: 0.8rem"></div>
      <!-- 关键词联想列表 -->
      <vList :ListData="data.result" :Selected="data.focusIndex" :Keywords="data.keyword" />
    </div>

    <!-- 天气组件 -->
    <vWeather Title="点击查看详情" />

    <!-- 设置组件 -->
    <vSettings :show="showSettings" @close="showSettings = false" />
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
</style>
