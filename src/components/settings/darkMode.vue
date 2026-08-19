<script setup lang="ts">
import Switcher from '../Switcher.vue'
import { useIndexStore } from '../../store'
import { useDarkModeStore } from '../../store/darkMode'
import { settingRowClass } from './classes'

const store = {
  global: useIndexStore(),
  darkMode: useDarkModeStore()
}
</script>

<template>
  <ul>
    <li :class="settingRowClass" v-show="!store.darkMode.followSystem">
      <span>深色模式</span>
      <Switcher
        @click="store.darkMode.enabled = !store.darkMode.enabled"
        :active="store.darkMode.enabled"
      />
    </li>
    <li :class="settingRowClass">
      <span>深色模式（跟随系统）</span>
      <Switcher
        @click="store.darkMode.setFollowSystem(null)"
        :active="store.darkMode.followSystem"
      />
    </li>
    <li :class="settingRowClass">
      <span>深色壁纸</span>
      <Switcher
        @click="store.darkMode.setDarkWallpaper(null)"
        :active="store.darkMode.darkWallpaper"
      />
    </li>
  </ul>
</template>
