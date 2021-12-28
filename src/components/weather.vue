<template>
  <div id="he-plugin-simple"></div>
</template>

<script>
export default {
  setup () {
    window.WIDGET = {
      CONFIG: {
        modules: '01234',
        background: '5',
        tmpColor: 'FFFFFF',
        tmpSize: '16',
        cityColor: 'FFFFFF',
        citySize: '16',
        aqiColor: 'FFFFFF',
        aqiSize: '16',
        weatherIconSize: '24',
        alertIconSize: '18',
        shadow: '0',
        language: 'auto',
        fixed: 'true',
        vertical: 'center',
        horizontal: 'center',
        right: '38',
        top: '16',
        key: '6b5ff096908947079b875900d57b5f48'
      }
    }
    const tag = document.createElement('script')
    tag.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
    document.querySelector('body').appendChild(tag)
  }
}
</script>

<style lang="stylus">
#he-plugin-simple
  z-index 1
  #weather-view-he
    padding .2rem
    margin-top -.3rem
    border-radius 1rem
    #view-vertical
      overflow scroll
</style>
