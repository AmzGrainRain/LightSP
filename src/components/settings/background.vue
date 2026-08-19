<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIndexStore } from '../../store';
import { useWallpaperStore, DefaultWallpaperManager, LocalWallpaperManager, WallpaperTypes, UrlWallpaperManager } from '../../store/wallpaper';
import { useDarkModeStore } from '../../store/darkMode';
import Switcher from '../Switcher.vue';
import { settingRowClass, settingsSelectClass } from './classes';

const store = {
    global: useIndexStore(),
    wallpaper: useWallpaperStore(),
    darkMode: useDarkModeStore()
};


// 默认壁纸列表选择
const defaultWM = new DefaultWallpaperManager(store.wallpaper);

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
        <li :class="settingRowClass">
            <span>壁纸来源</span>
            <select :class="settingsSelectClass" v-model="wallpaperProvider" class="bg-white text-black rounded-sm">
                <option value="default" :selected="store.wallpaper.default.enable">默认壁纸</option>
                <option value="url" :selected="store.wallpaper.url.enable">自定义网址</option>
                <option value="local" :selected="store.wallpaper.local.enable">自定义壁纸</option>
            </select>
        </li>
        <li :class="settingRowClass">
            <span>背景聚焦模糊效果</span>
            <Switcher @click="store.wallpaper.setWallpaperFocusBlur()" :active="store.wallpaper.focusBlur" />
        </li>
    </ul>
</template>
