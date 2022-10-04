<script setup lang="ts">
import { watch, reactive, onBeforeMount } from 'vue'
import { useIndexStore } from './store'
import { useWeatherStore } from './store/weather'
import { useDarkModeStore } from './store/darkMode'
import { jsonp } from 'vue-jsonp'
import vWeather from './components/weather.vue'
import vBackground from './components/background.vue'
import vClock from './components/clock.vue'
import vInput from './components/input.vue'
import vList from './components/list.vue'
import vSettings from './components/settings/index.vue'

/**
 * store
 */
const store: any = {
  global: useIndexStore(),
  weather: useWeatherStore(),
  darkMode: useDarkModeStore()
}

/**
 * Data
 */
interface dataReactive {
  keyword: string
  result: any
  focus: any
}
const data = reactive<dataReactive>({
  keyword: '',
  result: [],
  focus: false
})
interface componentsReactive {
  background: {
    blur: boolean
  }
  settings: boolean
  contentHeight: boolean
}
const components = reactive<componentsReactive>({
  background: {
    blur: false
  },
  settings: false,
  contentHeight: true
})

/**
 * Methods
 */
const methods = {
  // vInput - Content update event (keyword Association)
  vSearchBoxKeywordUpdate: (keyword: string): void => {
    data.keyword = keyword
  }
}

/**
 * Shortcut key
 */
document.addEventListener('keydown', (e: any): void => {
  // No Ctrl key pressed
  if (!e.ctrlKey) {
    switch (e.key) {
      case 'ArrowUp':
        if (data.focus !== false) {
          // // 判断当前的焦点是否是第一个
          // if (data.focus - 1 < 0) {
          //   // 判断关键词是否为空
          //   if (data.result.length === 0) {
          //     // 隐藏焦点
          //     data.focus = 0
          //   } else {
          //     // 正常逻辑
          //     data.focus = data.result.length - 1
          //   }
          // } else {
          //   data.focus = 0
          // }

          data.focus =
            data.focus === 0
              ? data.result.length === 0
                ? 0
                : data.result.length - 1
              : data.focus - 1
        } else data.focus = 0
        e.preventDefault()
        break
      case 'ArrowDown':
        if (data.focus !== false) {
          data.focus =
            data.focus + 1 > data.result.length - 1 ? 0 : data.focus + 1
        } else data.focus = 0
        e.preventDefault()
        break
      case 'Enter':
        if (data.focus === false) {
          if (store.global.searchEngines !== '') {
            window.location.href = store.global.searchEngines.replace(
              '关键词',
              data.keyword
            )
          } else
            window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${data.keyword}`
          e.preventDefault()
          break
        }
        if (data.result?.[data.focus]) {
          if (store.global.searchEngines !== '') {
            window.location.href = store.global.searchEngines.replace(
              '关键词',
              data.result[data.focus].text
            )
          } else
            window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${
              data.result[data.focus].text
            }`
          e.preventDefault()
          break
        }
    }
  } else {
    switch (e.key) {
      // Ctrl + F: Fast translation
      case 'f':
        window.location.href = `https://fanyi.baidu.com/#en/zh/${data.keyword}`
        e.preventDefault()
        break
      // Ctrl + B: Bing Search
      case 'b':
        window.location.href = `https://cn.bing.com/search?q=${data.keyword}`
        e.preventDefault()
        break
      // Ctrl + G: Google search
      case 'g':
        window.location.href = `https://www.google.com/search?q=${data.keyword}`
        e.preventDefault()
        break
      // Ctrl + D: Baidu developer search
      case 'd':
        window.location.href = `https://kaifa.baidu.com/searchPage?wd=${data.keyword}&module=SEARCH`
        e.preventDefault()
    }
  }
})

/**
 * Watch
 */
watch(
  () => data.keyword, 
  (newVal, oldVal) => {
    if (!newVal.length) {
      components.background.blur = false
      components.contentHeight = true
      return
    }
    components.background.blur = true
    components.contentHeight = false
    // Get 'Baidu' keyword Lenovo data
    jsonp('https://www.baidu.com/sugrec', {
      callbackName: 'JSONP',
      ie: 'utf-8',
      prod: 'pc',
      from: 'pc_web',
      wd: data.keyword,
      json: 1,
      bs: 'jsonp'
    })
      .then((res) => {
        // Empty result processing
        if (!res?.g?.length) {
          data.result = []
          return
        }
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
 * Hooks
 */
onBeforeMount(() => {
  if (store.darkMode.followSystem) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      store.darkMode.setDarkModeStatus(true)
    } else store.darkMode.setDarkModeStatus(false)
  }

  console.log('LightSP - 轻起始页')
  console.log('https://github.com/KiHanLee/LightSP')
})
</script>

<template>
  <div id="app" class="p-mx d-flex overflow-hide" :style="{
    'justify-content': (store.global.adaptiveContentHeight ? 'center' : 'unset'),
    'padding-top': (store.global.adaptiveContentHeight ? 0 : `${store.global.contentHeight}rem`)
  }">
    <!-- 背景组件 -->
    <vBackground :Blur="components.background.blur" />

    <!-- 搜索栏 -->
    <div
      class="search-box transition"
      :style="{
        'padding-bottom': (store.global.adaptiveContentHeight ? (components.contentHeight ? `${store.global.contentHeight}rem` : 0) : '')
      }"
    >
      <!-- 日期组件 -->
      <vClock Title="点击打开设置" @click="components.settings = !components.settings" />
      <!-- 占位元素 -->
      <div style="height: 1rem"></div>
      <!-- 输入框 -->
      <vInput
        Placeholder="输入搜索内容"
        Title="按下回车直接搜索"
        @updateEvent="methods.vSearchBoxKeywordUpdate"
      />
      <!-- 占位元素 -->
      <div style="height: .8rem"></div>
      <!-- 关键词联想列表 -->
      <vList
        :ListData="data.result"
        :Selected="data.focus"
        :Keywords="data.keyword"
      />
    </div>

    <!-- 天气组件 -->
    <vWeather Title="点击查看详情" v-show="store.weather.enabled" />

    <!-- 设置组件 -->
    <transition name="fade">
      <vSettings
        v-show="components.settings"
        @close="components.settings = false"
      />
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
</style>
