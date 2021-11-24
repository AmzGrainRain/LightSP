<template>
  <img :src="`${require(`@/assets/wallpaper/home-${currentBackground}.jpg`)}`" alt="bg">
  <!-- 右上角帮助按钮 -->
  <svg class="help-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="display_help = true">
    <path d="M12 6a3.939 3.939 0 0 0-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 0 0-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0 0 12 6zm-1 10h2v2h-2z"></path>
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
  </svg>
  <!-- 帮助 -->
  <div class="help" v-show="display_help" :class="{ 'help-on': display_help }">
    <div class="help-content">
      <div>
        <h2>快捷键解释</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click="display_help = false">
          <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
        </svg>
      </div>
      <ul>
        <li><kbd>Ctrl</kbd>+<kbd>t</kbd>&nbsp;翻译搜索框内容</li>
        <li><kbd>Ctrl</kbd>+<kbd>b</kbd>&nbsp;必应搜索</li>
        <li><kbd>Ctrl</kbd>+<kbd>g</kbd>&nbsp;谷歌搜索</li>
        <li><kbd>Ctrl</kbd>+<kbd>d</kbd>&nbsp;开发者搜索</li>
      </ul>
    </div>
  </div>
  <!-- 搜索栏 -->
  <div class="search-box">
    <Title :TextSlot="current_time" />
    <br />
    <Input placeholder="输入搜索内容" @updateEvent="Input_updateEvent" @enterEvent="Input_enterEvent" />
  </div>
  <!-- 装饰用的横线 -->
  <hr v-show="result_list.length && keywords.length" />
  <!-- 关键词联想列表 -->
  <List :listData="result_list" :keywords="keywords" />
</template>

<script>
import { onMounted, watch, ref } from 'vue'
import axios from 'axios'
import Title from './components/title.vue'
import Input from './components/responsive_input.vue'
import List from './components/list.vue'
export default {
  components: {
    Title,
    Input,
    List
  },
  setup () {
    /* 动态数据 */
    let current_time = ref('等待时间函数启动...')
    let keywords = ref('')
    let result_list = ref([])
    let display_help = ref(false)
    let currentBackground = ref(Math.floor(Math.random() * (10 - 1) + 1))
    /* 方法 */
    const Input_updateEvent = str => { // Input组件 - 内容更新事件
      keywords.value = String(str)
      console.log(keywords.value)
    }
    const Input_enterEvent = str => { // Input组件 - 回车事件
      window.location.href = `https://www.baidu.com/s?ie=utf-8&wd=${str}`
    }
    /* 监听动态数据变化 */
    watch(keywords, (newVal, oldVal) => {
      if (!String(newVal).length) return
      // 获取百度关键词联想数据
      const params = {
        params: {
          ie: 'utf-8',
          prod: 'pc',
          from: 'pc_web',
          wd: keywords.value
        }
      }
      axios.get('https://www.baidu.com/sugrec', params).then(res => {
        // 结果为空时
        if (!Object.keys(res.data).length) return result_list.value = []
        // 反之
        let tmp = []
        if (res.data.g.length) {
          for (let i = 0, len = res.data.g.length; i < len; i++) {
            tmp.push({
              text: res.data.g[i].q,
              url: `https://www.baidu.com/s?ie=utf-8&wd=${res.data.g[i].q}`
            })
          }
        }
        if (tmp.length) result_list.value = tmp
        else result_list.value = []
      }).catch(err => {
        console.log(err)
      })
    })
    /* 生命周期钩子 */
    onMounted(() => {
      // 搜索框焦点
      document.querySelector('.search-box input').focus()
      // 动态刷新时间
      setInterval(() => {
        const t = new Date()
        const h = t.getHours() < 10 ? `0${t.getHours()}` : t.getHours()
        const m = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes()
        const s = t.getSeconds() < 10 ? `0${t.getSeconds()}` : t.getSeconds()
        current_time.value = `${h}:${m}:${s}`
      }, 1000)
      // 热键捕捉
      document.onkeydown = e => {
        // Ctrl + T: 快速翻译
        if (e.ctrltKey && e.key == 't') {
          window.location.href = `https://fanyi.baidu.com/#en/zh/${keywords.value}`
        }
        // Ctrl + B: 必应搜索
        if (e.ctrltKey && e.key == 'b') {
          window.location.href = `https://cn.bing.com/search?q=${keywords.value}`
        }
        // Ctrl + G: 谷歌搜索
        if (e.ctrltKey && e.key == 'g') {
          window.location.href = `https://www.google.com/search?q=${keywords.value}`
        }
        // Ctrl + D: 百度开发者搜索
        if (e.ctrltKey && e.key == 'd') {
          window.location.href = `https://kaifa.baidu.com/searchPage?wd=${keywords.value}&module=SEARCH`
        }
      }
    })
    /* 返回数据 */
    return { current_time, keywords, result_list, display_help, currentBackground, Input_updateEvent, Input_enterEvent }
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
@font-face
  font-family 'CUS'
  src url('./assets/font.ttf')
body
  display flex
  justify-content center
  align-items center
  width 100%
  height 100vh
  color #fff
  font 16px/1.2 'CUS'
  overflow hidden
kbd
  margin 0 .2rem
  padding 0 .2rem
  font-size 1rem
  border 1px solid #aaa
  border-radius .25rem
  background-color #fafafa
img
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  object-fit cover
  z-index -1
#main
  padding 1rem
  width 40rem
  height 90%
  @media screen and (min-width: 1280px)
    width 48rem
  .help-icon
    position absolute
    top 1rem
    right 1rem
    fill #ccc
    cursor pointer
    &:hover
      fill #fff
  .help
    display flex
    justify-content center
    align-items center
    position absolute
    top 0
    right 0
    width 100vw
    height 100vh
    z-index 9
    background-color #0006
    .help-content
      padding 1rem
      display flex
      flex-flow column wrap
      width 32rem
      color #000
      background-color #fff
      border-radius .6rem
      box-shadow 0 0 2rem #0008
      div
        display flex
        justify-content space-between
        h2
          font-size 1.2rem
        svg
          border-radius .4rem
          transition all .3s
          cursor pointer
          &:hover
            fill #fff
            background-color #a00
      ul
        list-style none
        li
          margin .4rem 0
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
.help-on
  animation HelpOnAnimate-Mask .5s forwards
  .help-content
    animation HelpOnAnimate-Content .3s cubic-bezier(.5, 0, .5, 1.5) forwards

@keyframes HelpOnAnimate-Mask
  0%
    opacity 0
  100%
    opacity 1
@keyframes HelpOnAnimate-Content
  0%
    transform scale(.8)
  100%
    transform scale(1)
</style>
