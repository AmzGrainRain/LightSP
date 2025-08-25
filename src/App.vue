<script setup lang="ts">
import { watch, onBeforeMount, ref, Ref } from 'vue';
import { useIndexStore } from './store';
import { useDarkModeStore } from './store/darkMode';
import { clear } from 'localforage';
import Weather from './components/Weather.vue';
import Wallpaper from './components/Wallpaper.vue';
// import Particle from './components/settings/particle.vue';
import Clock from './components/Clock.vue';
import SearchBox from './components/SearchBox.vue';
import KeywordList from './components/KeywordList.vue';
import Settings from './components/settings/index.vue';

type KeywordListType = { text: string; url: string }[];
type Direction = 'up' | 'down';

const store = {
    global: useIndexStore(),
    darkMode: useDarkModeStore()
};

const showSettings: Ref<boolean> = ref(false);
const keyword: Ref<string> = ref('');
const keywordList: Ref<KeywordListType> = ref([]);
const keywordListIndex: Ref<number> = ref(-1);

const clearKeyword = (): void => {
    keyword.value = '';
};
const clearKeywordList = (): void => {
    keywordList.value.length = 0;
};
const resetKeywordListIndex = (): void => {
    keywordListIndex.value = -1;
};

const keywordIsEmpty = (): boolean => keyword.value.length === 0;
const keywordListIsEmpty = (): boolean => keywordList.value.length === 0;
const keywordListIndexIsDefault = (): boolean => keywordListIndex.value === -1;

const updateKeywordList = async (): Promise<void> => {
    const req = await fetch(`https://www.baidu.com/sugrec?ie=utf-8&prod=pc&from=pc_web&json=1&wd=${keyword.value}`, {
        method: 'GET',
        mode: 'cors'
    });
    const res: any[] | undefined = (await req.json())?.g;
    if (!res || res.length == 0) return;

    keywordList.value.length = 0;
    res.forEach((item: any) => {
        keywordList.value.push({
            text: item.q,
            url: `https://www.baidu.com/s?ie=utf-8&wd=${item.q}`
        });
    });
};

const switchKeywordListIndex = (direction: Direction): void => {
    // 向上切换
    if (direction === 'up') {
        keywordListIndex.value = keywordListIndex.value <= 0 ? 0 : keywordListIndex.value - 1;
        return;
    }
    // 向下切换
    const lastIndex = keywordList.value.length - 1;
    keywordListIndex.value = keywordListIndex.value >= lastIndex ? lastIndex : keywordListIndex.value + 1;
};

const jump = (): void => {
    // 若 index = -1 则使用搜索框内容搜素，否则使用关键词列表中当前聚焦的内容搜素
    const encodedKeyword: string = keywordListIndexIsDefault()
        ? encodeURIComponent(keyword.value)
        : encodeURIComponent(keywordList.value[keywordListIndex.value].text);

    // 清空搜索框与关键词列表
    clearKeyword();
    clearKeywordList();
    resetKeywordListIndex();

    // 在当前标签页打开
    if (store.global.openIn === 'self') {
        window.location.href = store.global.getCurrentSearchUrl(encodedKeyword);
    }

    // 在新标签页打开
    else if (store.global.openIn === 'newtab') {
        window.open(store.global.getCurrentSearchUrl(encodedKeyword), '_blank')?.location;
    }
};

// 是否为背景添加放大、模糊效果
const backgroundBlur: Ref<boolean> = ref(false);

/**
 * 监听关键词变化
 */
watch(keyword, () => {
    // 根据输入框内容决定是否启用背景放大+模糊效果
    backgroundBlur.value = !keywordIsEmpty();
    // 关键词为空则不更新关键词列表
    if (!backgroundBlur.value) return;
    updateKeywordList();
    resetKeywordListIndex();
});

enum Keys {
    Esc = 'Escape',
    Enter = 'Enter',
    ArrowUP = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    Settings = 's',
    Translation = 'f',
    BingSearch = 'b',
    GoogleSearch = 'g'
}

/**
 * 快捷键监听
 */
document.addEventListener('keydown', (e: KeyboardEvent): void => {
    // Esc - 关闭设置面板
    if (e.key === Keys.Esc) {
        showSettings.value = false;
        e.preventDefault();
        return;
    }

    // Enter - 搜索
    if (e.key === Keys.Enter) {
        jump();
        e.preventDefault();
        return;
    }

    // Ctrl 组合键
    if (e.ctrlKey) {
        switch (e.key) {
            // Ctrl + S - 打开设置
            case Keys.Settings:
                showSettings.value = !showSettings;
                break;
            // Ctrl + F - 翻译
            case Keys.Translation:
                window.location.href = `https://fanyi.baidu.com/mtpe-individual/multimodal?query=${keyword.value}&lang=zh2en`;
                break;
            // 必应搜索
            case Keys.BingSearch:
                window.location.href = `https://cn.bing.com/search?q=${keyword.value}`;
                break;
            // 谷歌搜索
            case Keys.GoogleSearch:
                window.location.href = `https://www.google.com/search?q=${keyword.value}`;
                break;
        }
        return;
    }

    // 如果关键词列表为空并且搜索框内容为空就没必要继续往下执行了
    if (keywordIsEmpty()) return;

    // 关键词列表切换
    if (e.key === Keys.ArrowUP) {
        switchKeywordListIndex('up');
        e.preventDefault();
        return;
    }

    // 关键词列表切换
    if (e.key === Keys.ArrowDown) {
        switchKeywordListIndex('down');
        e.preventDefault();
        return;
    }
});

/**
 * 检查版本号
 */
const CheckVersion = () => {
    const resetStore = () => {
        alert('非常抱歉！！！个性化数据结构发生改变，已还原个性化设置。');
        clear().then(() => {
            localStorage.removeItem('LightSP');
            localStorage.removeItem('LightSP-weather');
            localStorage.removeItem('LightSP-darkMode');
            localStorage.removeItem('LightSP-wallpaper');
            localStorage.removeItem('LightSP-particle');
            localStorage.removeItem('LightSP-global');
            location.reload();
        });
    };

    switch (store.global.version) {
        case '3.1.9.1':
            break;
        case '3.1.9':
            break;
        case '3.1.8-hotfix':
            break;
        case '3.1.8.1':
            break;
        default:
            resetStore();   
    }
};

/**
 * 首次进入
 */
const OnFirstEnter = () => {
    if (store.global.first) {
        store.global.first = false;
        alert(`欢迎使用！点击时间可以打开设置面板`);
        showSettings.value = true;
    }
};

/**
 * 深色模式跟随系统
 */
const DarkModeFollowSystem = () => {
    if (store.darkMode.followSystem) {
        store.darkMode.setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
};

onBeforeMount(() => {
    CheckVersion();
    OnFirstEnter();
    DarkModeFollowSystem();

    console.log('轻起始页 - https://github.com/AmzGrainRain/LightSP');
});
</script>

<template>
    <div
        id="app"
        class="p-mx d-flex overflow-hide"
        :style="{
            fontFamily: store.global.font,
            justifyContent: store.global.adaptiveHeight ? 'center' : 'unset',
            // 如果启用了 自适应高度 则应屏蔽 偏移高度
            '--offset-height': `${store.global.adaptiveHeight ? 0 : store.global.offsetHeight}rem`,
            '--border-radius': `${store.global.borderRadius}px`,
            '--blur-factor': `${store.global.blur.enable ? `blur(${store.global.blur.factor}px)` : '0px'}`,
            '--color': store.darkMode.enabled ? store.darkMode.colorStyle.text : store.global.colorStyle.text,
            '--bg-color': store.darkMode.enabled ? store.darkMode.getBackgroundColor() : store.global.getBackgroundColor(),
            '--fr-color': store.darkMode.enabled ? store.darkMode.getForegroundColor() : store.global.getForegroundColor()
        }"
    >
        <!-- <Particle /> -->

        <Wallpaper :Blur="backgroundBlur" />

        <div class="search-box transition" :class="{ actived: !keywordIsEmpty() && !keywordListIsEmpty() }">
            <Clock @click="showSettings = true" title="点击打开设置" />
            <div style="height: 1rem"></div>
            <SearchBox
                Placeholder="输入搜索内容"
                Title="按下回车搜索"
                @updateEvent="
                    (text: string): void => {
                        keyword = text;
                    }
                "
            />
            <div style="height: 0.8rem"></div>
            <KeywordList
                v-if="!store.global.showKeywordList"
                :Keywords="keyword"
                :ListData="keywordList"
                :Selected="keywordListIndex"
            />
        </div>

        <Weather Title="点击查看详情" />

        <transition name="fade">
            <Settings v-show="showSettings" :show="showSettings" @close="showSettings = false" />
        </transition>
    </div>
</template>

<style lang="stylus" scoped>
#app
    flex-flow column nowrap
    justify-content center
    align-items center
    width 100vw
    height 100vh

.search-box
    padding-top var(--offset-height)
    padding-bottom 15%
    display flex
    align-items center
    flex-flow column wrap
    width 45rem

    @media screen and (max-width: 1024px)
        width 80%

    @media screen and (max-width: 512px)
        width 95%

.search-box.actived
    padding-bottom 0
</style>

<style lang="stylus">
.blur
    backdrop-filter var(--blur-factor)

.fade-enter-from
.fade-leave-to
    transform translateX(442px)

.fade-enter-active
.fade-leave-active
    transition all .7s cubic-bezier(0,1,.3,1)

.fade-enter-to
.fade-leave-from
    transform translateX(0)
</style>
