<template>
  <ul>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>显示天气组件</span>
      <vSwitch @click="store.commit('setWeatherVisible', null)" :active="store.state.weather.visible" />
    </li>
    <li
      class="border-radius"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <span>设置天气位置</span>
      <input class="w-50 text-size-m text-center border-none border-radius-sm" type="text" placeholder="输入您所在的城市" v-model="data.keywords">
    </li>
    <li
      class="border-radius"
      v-show="data.hit.length"
      :style="`background-color: ${store.state.darkMode.enabled ? store.state.darkMode.frColor : store.state.gl.frColor}`"
    >
      <ul id="hit-list" class="overflow-x-hide overflow-y-auto border-radius" v-show="data.hit.length">
        <li
          class="m-b-sm p-lr text-center border-radius pointer"
          v-for="(item, index) in data.hit"
          :key="index"
          @click="mets.setLocation(item.substring(item.length - 9))"
        >
          {{ item.substring(0, item.length - 10) }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import vSwitch from '@/components/switch'
export default {
  components: {
    vSwitch
  },
  setup () {
    const store = useStore()
    const data = reactive({
      keywords: '', // 天气设置输入框内容
      cityData: [], // 城市数据
      hit: [] // 命中结果
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

    const mets = {
      // 更新天气位置
      setLocation: id => {
        store.commit('setWeatherLocation', id)
        alert('设置成功（刷新生效）')
      }
    }

    watch(() => data.keywords, (newVal, oldVal) => {
      // 当输入框内容长度为0时隐藏结果列表
      if (!data.keywords.length) {
        data.hit = []
        return
      }
      // 清空命中列表内的旧数据
      data.hit = []
      // 将命中的数据添加到命中列表
      data.cityData.forEach(e => {
        if (e.indexOf(newVal) !== -1) {
          data.hit.push(e)
        }
      })
    })

    return { store, data, mets }
  }
}
</script>

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
