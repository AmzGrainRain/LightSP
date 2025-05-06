<script setup lang="ts">
import { useIndexStore } from '../../store';
import { useDarkModeStore } from '../../store/darkMode';
import { clear as lfClear } from 'localforage';
import GlobalSetting from './global.vue';
import BackgroundSetting from './background.vue';
// import ParticleSetting from './particle.vue';
import ClockSetting from './clock.vue';
import DarkModeSetting from './darkMode.vue';
import WeatherSetting from './weather.vue';

const emit = defineEmits(['close']);
const props = defineProps<{ show: boolean }>();

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
</script>

<template>
    <div id="settings" @click="emit('close')">
        <div class="inner overflow-hide blur" @click.stop>
            <div class="bar p-lr-ex">
                <h3>设置</h3>
                <span class="p-lr p-tb-sm pointer" @click.stop="emit('close')">关闭</span>
            </div>
            <div class="panel p-lr-lg p-t-lg" :class="{ show: props.show }">
                <h4>全局</h4>
                <Global-Setting />

                <h4>时钟</h4>
                <Clock-Setting />

                <h4>背景</h4>
                <Background-Setting />

                <!-- <h4>粒子</h4>
                <Particle-Setting /> -->

                <h4>深色模式</h4>
                <DarkMode-Setting />

                <h4>天气</h4>
                <Weather-Setting />

                <h4>其他</h4>
                <div class="other">
                    <input
                        id="hotkey-help"
                        class="m-b p-lr-lg border-none transition pointer"
                        type="button"
                        value="快捷键"
                        @click="hotkeyHelp()"
                    />
                    <input
                        id="feedback"
                        class="m-b p-lr-lg border-none transition pointer"
                        type="button"
                        value="反馈"
                        @click="feedback()"
                    />
                    <input
                        id="reset"
                        class="m-b p-lr-lg border-none border-radius transition pointer"
                        type="button"
                        value="恢复默认设置"
                        @click="reset()"
                    />
                    <span id="version" class="m-b p-lr-lg border-none border-radius transition pointer"
                        >v{{ store.global.version }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
::selection
    background transparent

#settings
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    margin auto
    width calc(100vw - 2rem)
    height calc(100vh - 2rem)


    .inner
        float right
        width 420px
        height 100%
        color var(--color)
        border: 1px solid #888a;
        background-color var(--bg-color)
        border-radius calc(var(--border-radius) - 4px)

        div.bar
            display flex
            justify-content space-between
            align-items center
            height 3rem
            box-shadow 0 1px .2rem #8884

        div.panel
            height calc(100% - 3rem)
            overflow hidden auto

        h4
            padding-left .3rem

        div.other
            margin-top .5rem

            input
                margin-right 1rem

#hotkey-help
#feedback
#reset
    height 2rem
    color inherit
    font-family inherit
    border-radius calc(var(--border-radius) - 4px)
    background-color var(----bg-color)

    &:hover
        background-color #8296ff
</style>
