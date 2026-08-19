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
    class="weather-link glass-effect absolute right-4 top-4 block cursor-pointer rounded-[calc(var(--border-radius)-4px)] px-2 py-1 transition-all duration-300 hover:bg-(--fr-color)"
    :title="Title"
    :href="weather.link"
    target="_blank"
    :class="{
      slideIn: weatherLoaded
    }"
  >
    <i :class="`qi-${weather.icon}`"></i>
    <span class="inline-block w-[0.4rem]" aria-hidden="true"></span>
    <span class="[text-shadow:0_0_4px_#0008]" v-show="weather.link.length !== 0">{{ `${weather.temp}°C&nbsp;|&nbsp;${weather.text}` }}</span>
  </a>
</template>

<style scoped>
@import url('../assets/weather/qweather-icons.css');

.weather-link {
  transform: translateX(120%);
}

.slideIn {
  animation: aniSlideIn 0.5s forwards;
}

@keyframes aniSlideIn {
  0% {
    transform: translateX(120%);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
