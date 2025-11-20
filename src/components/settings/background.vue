<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIndexStore } from '../../store';
import { useWallpaperStore, DefaultWallpaperManager, BingWallpaperManager, BingRandomWallpaperManager, LocalWallpaperManager, WallpaperTypes, UrlWallpaperManager } from '../../store/wallpaper';
import { useParticleStore } from '../../store/particle';
import { useDarkModeStore } from '../../store/darkMode';
import Switcher from '../Switcher.vue';

const store = {
    global: useIndexStore(),
    wallpaper: useWallpaperStore(),
    particle: useParticleStore(),
    darkMode: useDarkModeStore()
};


// 默认壁纸列表选择
const defaultWM = new DefaultWallpaperManager(store.wallpaper);
const defaultWallpaperListChoice = ref(store.wallpaper.default.index);
watch(defaultWallpaperListChoice, (value) => {
    defaultWM.setWallpaper(value);
    defaultWM.enable();
});

// 必应壁纸质量选择
const bingWM = new BingWallpaperManager(store.wallpaper);
const bingWallpaperListChoice = ref(store.wallpaper.bing.index);
watch(bingWallpaperListChoice, (value) => {
    bingWM.setWallpaper(value);
    bingWM.enable();
});

// 必应随机壁纸质量选择
const bingRandomWM = new BingRandomWallpaperManager(store.wallpaper);
const bingRandomWallpaperListChoice = ref(store.wallpaper.bingRandom.index);
watch(bingRandomWallpaperListChoice, (value) => {
    bingRandomWM.setWallpaper(value);
    bingRandomWM.enable();
});

const bingWallpaperListIndex2String = (index: number): string => {
    if (index === 0) return '无损';
    if (index === 1) return '标清';
    if (index === 2) return '低质量'
    return '低质量';
}

// 设置本地壁纸
const fileChecker = ref<HTMLInputElement | null>(null);
const setLocalWallpaper = async () => {
    if (!fileChecker.value?.files?.length) {
        alert('请选择一个文件！');
        return;
    }

    const file = fileChecker.value.files[0]!;

    new LocalWallpaperManager(store.wallpaper).setWallpaper(file);
};

// 壁纸来源选择
const wallpaperProvider = ref<WallpaperTypes>(store.wallpaper.getCurrentWallpaper());
watch(wallpaperProvider, (value) => {
    if (value === 'default') {
        defaultWM.enable();
        return;
    }

    if (value === 'bing') {
        bingWM.enable();
        return
    }

    if (value === 'bing-random') {
        bingRandomWM.enable();
        return
    }

    if (value === 'url') {
        const wm = new UrlWallpaperManager(store.wallpaper);
        const src = prompt('请输入一个指向图片的网址，作为背景：', '')
        if (!src) {
            alert('您没有输入任何内容');
            return
        }

        wm.setWallpaper(src);
        wm.enable();
        return
    }

    if (value === 'local') {
        fileChecker.value?.click();
        return
    }
});
</script>

<template>
    <input ref="fileChecker" type="file" accept="image/*" @change="setLocalWallpaper()" v-show="false" />

    <ul>
        <li>
            <span>壁纸来源</span>
            <select v-model="wallpaperProvider">
                <option value="default" :selected="store.wallpaper.default.enable">默认壁纸</option>
                <option value="bing" :selected="store.wallpaper.bing.enable">必应每日壁纸</option>
                <option value="bing-random" :selected="store.wallpaper.bingRandom.enable">必应随机壁纸</option>
                <option value="url" :selected="store.wallpaper.bing.enable">自定义网址</option>
                <option value="local" :selected="store.wallpaper.local.enable">自定义壁纸</option>
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
        <li v-show="store.wallpaper.bing.enable">
            <span>必应壁纸质量</span>
            <select v-model="bingWallpaperListChoice" class="p-lr">
                <option v-for="(_, i) in store.wallpaper.bing.wallpaper" :key="i" :value="i">
                    {{ bingWallpaperListIndex2String(i) }}
                </option>
            </select>
        </li>
        <li v-show="store.wallpaper.bingRandom.enable">
            <span>必应随机壁纸质量</span>
            <select v-model="bingRandomWallpaperListChoice" class="p-lr">
                <option v-for="(_, i) in store.wallpaper.bingRandom.wallpaper" :key="i" :value="i">
                    {{ bingWallpaperListIndex2String(i) }}
                </option>
            </select>
        </li>
        <li>
            <span>背景聚焦模糊效果</span>
            <Switcher @click="store.wallpaper.setWallpaperFocusBlur()" :active="store.wallpaper.focusBlur" />
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
