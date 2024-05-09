<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIndexStore } from '../../store';
import {
    useWallpaperStore,
    DefaultWallpaperManager,
    BingWallpaperManager,
    CustomWallpaperManager
} from '../../store/wallpaper';
import { useDarkModeStore } from '../../store/darkMode';
import { setItem as lfSet } from 'localforage';
import Switcher from '../Switcher.vue';

const store = {
    global: useIndexStore(),
    wallpaper: useWallpaperStore(),
    darkMode: useDarkModeStore()
};

const dw = new DefaultWallpaperManager(store.wallpaper);
const bw = new BingWallpaperManager(store.wallpaper);
const cw = new CustomWallpaperManager(store.wallpaper);

// 是否显示默认壁纸列表
const showDefaultWallpaperList = ref<boolean>(store.wallpaper.default.enable);

// 默认壁纸列表选择
const defaultWallpaperListChoice = ref(store.wallpaper.default.index);
watch(defaultWallpaperListChoice, (value) => {
    dw.setWallpaper(Number(value));
    dw.enable();
    location.reload();
});

// 自定义壁纸
const fileChecker = ref<HTMLInputElement | null>(null);
const setCustomizeWallpaper = () => {
    if (!fileChecker.value?.files?.length) {
        alert('请选择一个文件！');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileChecker.value.files[0]);
    reader.onloadend = () => {
        lfSet('CustomizeWallpaper', reader.result, (err) => {
            if (err !== null) console.log('[Error] setCustomizeWallpaper: localforage.setItem');
            store.wallpaper.enableWallpaper('custom');
            location.reload();
        });
    };
};
</script>

<template>
    <ul>
        <li>
            <span>背景聚焦模糊效果</span>
            <Switcher
                @click="store.wallpaper.setWallpaperFocusBlur(null)"
                :active="store.wallpaper.focusBlur"
            />
        </li>
        <li>
            <span>默认壁纸</span>
            <Switcher
                @click="store.wallpaper.enableWallpaper('default')"
                :active="store.wallpaper.default.enable"
            />
        </li>
        <li v-show="showDefaultWallpaperList">
            <span>默认壁纸列表</span>
            <select v-model="defaultWallpaperListChoice" class="p-lr">
                <option v-for="(item, i) in store.wallpaper.default.wallpaper" :key="i" :value="i">
                    {{ item.replace(/\.\w+$/, '') }}
                </option>
            </select>
        </li>
        <li>
            <span>必应每日一图</span>
            <Switcher
                @click="bw.enable()"
                :active="store.wallpaper.bing.enable"
            />
        </li>
        <li>
            <span>自定义壁纸</span>
            <Switcher @click="cw.enable()" :active="store.wallpaper.custom.enable" />
        </li>
        <li>
            <span>自定义壁纸</span>
            <input type="button" value="+" @click="fileChecker?.click()" />
            <input ref="fileChecker" type="file" accept="image/*" @change="setCustomizeWallpaper()" v-show="false" />
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
