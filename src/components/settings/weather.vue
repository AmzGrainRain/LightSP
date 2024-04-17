<script setup lang="ts">
import { ref, watch } from 'vue'
import { useIndexStore } from '../../store'
import { useWeatherStore } from '../../store/weather'
import { useDarkModeStore } from '../../store/darkMode'
import csvFile from '../../assets/weather/city_list.csv?raw'
// 获取城市列表 https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv

import Switcher from '../Switcher.vue'

const store = {
  global: useIndexStore(),
  weather: useWeatherStore(),
  darkMode: useDarkModeStore()
}

// 天气设置输入框内容
const keyword = ref<string>('')
// 城市数据
const cityData = ref<string[]>([])
// 命中结果
const hitList = ref<string[]>([])

watch(keyword, (value) => {
  // 当输入框内容长度为0时隐藏结果列表
  if (!keyword.value.length) {
    hitList.value = []
    return
  }
  // 清空命中列表内的旧数据
  hitList.value = []
  // 将命中的数据添加到命中列表
  cityData.value.forEach((e: any) => {
    if (e.indexOf(value.replace(/[省|市|区]/g, '')) !== -1) {
      hitList.value.push(e)
    }
  })
})

const setLocation = (id: number | string) => {
  store.weather.setWeatherLocation(id)
}

let tmp = ''
csvFile.split('\n').forEach((e: any) => {
  /*
    0        1    2   3   4    5      6       7     8      9        10           11        12       13
101070209,Xigang,西岗,CN,China,中国,Liaoning,辽宁省,Dalian,大连市,Asia/Shanghai,38.914265,121.616112,210203
  */
  const item: string[] = e.split(',')
  tmp += `${item[7]}-${item[9]}-${item[2]}-${item[0]}\n`
})
cityData.value = tmp.split('\n')
tmp = ''
</script>

<template>
  <ul>
    <li>
      <span>显示天气组件</span>
      <Switcher @click="store.weather.setWeatherStatus(null)" :active="store.weather.enabled" />
    </li>
    <li>
      <span>设置天气位置</span>
      <input
        class="w-50 text-size-m text-center border-none border-radius-sm"
        type="text"
        placeholder="输入您所在的城市"
        title="请不要输入完整的位置"
        v-model="keyword"
      />
    </li>
    <li v-show="hitList.length">
      <ul
        id="hit-list"
        class="w-100 overflow-x-hide overflow-y-auto border-radius"
        v-show="hitList.length"
      >
        <li
          class="m-b-sm p-lr text-center border-radius pointer"
          v-for="(item, index) in hitList"
          :key="index"
          @click="setLocation(item.substring(item.length - 9))"
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
  border-radius calc(var(--border-radius) - 4px)
  background-color var(--fr-color)

#hit-list
  height 256px

  li
    font-size 12px
    transition background-color .2s
    &:hover
      background-color #8883

    &:first-child
      margin-top 0 !important
</style>
