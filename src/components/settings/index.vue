<script setup lang="ts">
import { useIndexStore } from '../../store';
import { useDarkModeStore } from '../../store/darkMode';
import { clear as lfClear } from 'localforage';
import GlobalSetting from './global.vue';
import BackgroundSetting from './background.vue';
import ClockSetting from './clock.vue';
import DarkModeSetting from './darkMode.vue';
import WeatherSetting from './weather.vue';

const emit = defineEmits(['close']);

const store = {
    global: useIndexStore(),
    darkMode: useDarkModeStore()
};

const hotkeyHelp = (): void => {
    alert(`快捷键介绍：
ctrl + s = 打开设置
ctrl + f = 翻译
ctrl + b = 使用必应搜索当前输入框的内容
ctrl + g = 使用谷歌搜索当前输入框的内容
ctrl + d = 使用百度开发者搜索当前输入框的内容`);
};

const feedback = (): void => {
    window.open('https://github.com/AmzGrainRain/LightSP/issues/new');
};

const reset = (): void => {
    if (confirm('您确定要清除所有自定义设置吗？')) {
        lfClear().then(() => {
            localStorage.removeItem('LightSP');
            localStorage.removeItem('LightSP-weather');
            localStorage.removeItem('LightSP-darkMode');
            localStorage.removeItem('LightSP-wallpaper');
            localStorage.removeItem('LightSP-global');
            location.reload();
        });
    }
};

const actionButtonClass =
    'mb-2 mr-4 h-8 cursor-pointer rounded-[calc(var(--border-radius)-4px)] border-0 bg-[var(--bg-color)] px-3 font-[inherit] text-[inherit] transition-all duration-300 hover:bg-[#8296ff]';

const versionClass =
    'mb-2 inline-flex h-8 cursor-pointer items-center rounded-[calc(var(--border-radius)-4px)] border-0 px-3 transition-all duration-300';
</script>

<template>
    <div id="settings" class="fixed inset-0 m-auto h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]" @click="emit('close')">
        <div
            class="glass-effect float-right h-full w-105 max-w-full overflow-hidden rounded-[calc(var(--border-radius)-4px)] border border-[#888a] bg-(--bg-color) text-(--color)"
            @click.stop
        >
            <div class="flex h-12 items-center justify-between px-4 shadow-[0_1px_.2rem_#8884]">
                <h3>设置</h3>
                <span class="cursor-pointer px-2 py-1" @click.stop="emit('close')">关闭</span>
            </div>
            <div class="h-[calc(100%-3rem)] overflow-x-hidden overflow-y-auto px-3 pt-3">
                <h4 class="pl-[.3rem]">全局</h4>
                <Global-Setting />

                <h4 class="pl-[.3rem]">时钟</h4>
                <Clock-Setting />

                <h4 class="pl-[.3rem]">背景</h4>
                <Background-Setting />

                <h4 class="pl-[.3rem]">深色模式</h4>
                <DarkMode-Setting />

                <h4 class="pl-[.3rem]">天气</h4>
                <Weather-Setting />

                <h4 class="pl-[.3rem]">其他</h4>
                <div class="mt-2">
                    <input
                        id="hotkey-help"
                        :class="actionButtonClass"
                        type="button"
                        value="快捷键"
                        @click="hotkeyHelp()"
                    />
                    <input
                        id="feedback"
                        :class="actionButtonClass"
                        type="button"
                        value="反馈"
                        @click="feedback()"
                    />
                    <input
                        id="reset"
                        :class="actionButtonClass"
                        type="button"
                        value="恢复默认设置"
                        @click="reset()"
                    />
                    <span id="version" :class="versionClass"
                        >v{{ store.global.version }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>
