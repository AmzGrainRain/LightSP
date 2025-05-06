<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIndexStore } from '../../store';
import { useWallpaperStore, DefaultWallpaperManager, BingWallpaperManager, CustomWallpaperManager } from '../../store/wallpaper';
import { useParticleStore } from '../../store/particle';
import { useDarkModeStore } from '../../store/darkMode';
import { setItem as lfSet } from 'localforage';
import Switcher from '../Switcher.vue';

const store = {
    global: useIndexStore(),
    wallpaper: useWallpaperStore(),
    particle: useParticleStore(),
    darkMode: useDarkModeStore()
};

const wallpaperProvider = ref<'default' | 'bing' | 'custom'>(store.wallpaper.getCurrentWallpaper());

// 默认壁纸列表选择
const defaultWallpaperManager = new DefaultWallpaperManager(store.wallpaper);
const defaultWallpaperListChoice = ref(store.wallpaper.default.index);
watch(defaultWallpaperListChoice, (value) => {
    defaultWallpaperManager.setWallpaper(Number(value));
    defaultWallpaperManager.enable();
});

// 自定义壁纸
const fileChecker = ref<HTMLInputElement | null>(null);
const setCustomizeWallpaper = async () => {
    if (!fileChecker.value?.files?.length) {
        alert('请选择一个文件！');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileChecker.value.files[0]);
    reader.onloadend = () => {
        lfSet('CustomizeWallpaper', reader.result, (err) => {
            if (err !== null) console.log('[Error] setCustomizeWallpaper: localforage.setItem');
            new CustomWallpaperManager(store.wallpaper).enable();
        });
    };
};

// 壁纸来源选择
watch(wallpaperProvider, async (value) => {
    switch (value) {
        case 'default':
            defaultWallpaperManager.enable();
            break;
        case 'bing':
            new BingWallpaperManager(store.wallpaper).enable();
            break;
        case 'custom':
            fileChecker.value?.click();
            break;
    }
});
</script>

<template>
    <input ref="fileChecker" type="file" accept="image/*" @change="setCustomizeWallpaper()" v-show="false" />

    <ul>
        <li>
            <span>壁纸来源</span>
            <select v-model="wallpaperProvider">
                <option value="default" :selected="store.wallpaper.default.enable">默认壁纸</option>
                <option value="bing" :selected="store.wallpaper.bing.enable">必应每日一图</option>
                <option value="custom" :selected="store.wallpaper.custom.enable">自定义壁纸</option>
            </select>
        </li>
        <li v-show="store.wallpaper.default.enable">
            <span>默认壁纸列表</span>
            <select v-model="defaultWallpaperListChoice" class="p-lr">
                <option v-for="(item, i) in store.wallpaper.default.wallpaper" :key="i" :value="i">
                    {{ item.replace(/\.\w+$/, '') }}
                </option>
            </select>
        </li>
        <li>
            <span>背景聚焦模糊效果</span>
            <Switcher @click="store.wallpaper.setWallpaperFocusBlur(null)" :active="store.wallpaper.focusBlur" />
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

  select
    outline none
</style>
