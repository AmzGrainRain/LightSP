<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import { useIndexStore } from '../store';
import { useWeatherStore } from '../store/weather';

defineProps<{
  Title: string;
}>();
const store = {
  global: useIndexStore(),
  weather: useWeatherStore()
};

const weather = reactive({
  link: '',
  icon: '',
  text: '',
  temp: ''
});

const weatherLoaded = ref(false);

onBeforeMount(() => {
  // hit cache
  if (Date.now() < store.weather.cache_time) {
    weather.link = store.weather.cache.link;
    weather.temp = store.weather.cache.temp;
    weather.icon = store.weather.cache.icon;
    weather.text = store.weather.cache.text;
    weatherLoaded.value = true;
    return;
  }

  fetch(`${store.weather.api}?key=${store.weather.apiKey}&location=${store.weather.location_id}`)
    .then((ori) => ori.json())
    .then((res) => {
      // cache
      store.weather.cache.link = res.fxLink;
      store.weather.cache.temp = res.now.temp;
      store.weather.cache.icon = res.now.icon;
      store.weather.cache.text = res.now.text;
      store.weather.cache_time = Date.now() + 600000; // 10 min

      weather.link = res.fxLink;
      weather.temp = res.now.temp;
      weather.icon = res.now.icon;
      weather.text = res.now.text;
      weatherLoaded.value = true;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<template>
  <a
    v-if="store.weather.enabled"
    v-show="weatherLoaded"
    class="d-block p-tb-sm p-lr transition pointer blur"
    :title="Title"
    :href="weather.link"
    target="_blank"
    :class="{
      slideIn: weatherLoaded
    }"
  >
    <i :class="`qi-${weather.icon}`"></i>
    <div style="display: inline-block; width: 0.4rem"></div>
    <span v-show="weather.link.length !== 0">{{ `${weather.temp}°C&nbsp;|&nbsp;${weather.text}` }}</span>
  </a>
</template>

<style lang="stylus" scoped>
@import url('../assets/weather/qweather-icons.css')
a
  position absolute
  top 1rem
  right 1rem
  border-radius calc(var(--border-radius) - 4px)
  transform translateX(120%)

  &:hover
    background-color var(--fr-color)

  span
    text-shadow 0 0 4px #0008

.slideIn
  animation aniSlideIn .5s forwards

@keyframes aniSlideIn
  0%
    transform translateX(120%)
  100%
    transform translateX(0)
</style>
