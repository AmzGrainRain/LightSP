<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useWeatherStore } from '../../store/weather'
import { useDarkModeStore } from '../../store/darkMode'
import vSwitch from '../switch.vue'
// 获取城市列表 https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
import csvFile from '../../assets/weather/city_list.csv?raw'

/**
 * Data
 */
interface Reactive {
  keyword: string // 天气设置输入框内容
  cityData: any[] // 城市数据
  hit: any[] // 命中结果
}
const data = reactive<Reactive>({
  keyword: '',
  cityData: [],
  hit: []
})
const store = {
  global: useIndexStore(),
  weather: useWeatherStore(),
  darkMode: useDarkModeStore()
}
let _csvFile = csvFile.split('\n')
let tmp = ''
_csvFile.forEach((e: any) => {
  /*
    e.split(',')[0] = id
    e.split(',')[2] = 县
    e.split(',')[7] = 省
    e.split(',')[9] = 市
  */
  tmp += `${e.split(',')[7]}-${e.split(',')[9]}-${e.split(',')[2]}-${
    e.split(',')[0]
  }\n`
})
data.cityData = tmp.split('\n')

/**
 * Methods
 */
const methods = {
  // 更新天气位置
  setLocation: (id: number | string) => {
    store.weather.setWeatherLocation(id)
  }
}

/**
 * Watch
 */
watch(
  () => data.keyword,
  (newVal, oldVal) => {
    // 当输入框内容长度为0时隐藏结果列表
    if (!data.keyword.length) {
      data.hit = []
      return
    }
    // 清空命中列表内的旧数据
    data.hit = []
    // 将命中的数据添加到命中列表
    data.cityData.forEach((e: any) => {
      if (e.indexOf(newVal) !== -1) {
        data.hit.push(e)
      }
    })
  }
)
</script>

<template>
  <ul>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.darkMode.enabled
          ? store.darkMode.frColor
          : store.global.frColor
      }`"
    >
      <span>显示天气组件</span>
      <vSwitch
        @click="store.weather.setWeatherStatus(null)"
        :active="store.weather.enabled"
      />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${
        store.darkMode.enabled
          ? store.darkMode.frColor
          : store.global.frColor
      }`"
    >
      <span>设置天气位置</span>
      <input
        class="w-50 text-size-m text-center border-none border-radius-sm"
        type="text"
        placeholder="输入您所在的城市"
        v-model="data.keyword"
      />
    </li>
    <li
      class="border-radius"
      v-show="data.hit.length"
      :style="`background-color: ${
        store.darkMode.enabled
          ? store.darkMode.frColor
          : store.global.frColor
      }`"
    >
      <ul
        id="hit-list"
        class="overflow-x-hide overflow-y-auto border-radius"
        v-show="data.hit.length"
      >
        <li
          class="m-b-sm p-lr text-center border-radius pointer"
          v-for="(item, index) in data.hit"
          :key="index"
          @click="methods.setLocation(item.substring(item.length - 9))"
        >
          {{ item.substring(0, item.length - 10) }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<style lang="stylus" scoped>
li
  margin 14px 0
  padding 8px 10px
  display flex
  justify-content space-between
  align-items center
  background-color #fff2
#hit-list
  height 256px
  li
    font-size 12px
    &:first-child
      margin-top 0 !important
</style>
