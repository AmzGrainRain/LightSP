<script setup lang="ts">
import { watch, onBeforeMount, ref, Ref } from 'vue';
import { useIndexStore } from './store';
import { useDarkModeStore } from './store/darkMode';
import { clear } from 'localforage';
import Weather from './components/Weather.vue';
import Background from './components/Background.vue';
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

// 是否显示设置
const showSettings: Ref<boolean> = ref(false);
// 关键词内容
const keyword: Ref<string> = ref('');
// 关键词列表
const keywordList: Ref<KeywordListType> = ref([]);
// 关键词列表索引
let keywordListIndex: Ref<number> = ref(-1);
// 是否为背景添加放大、模糊效果
const backgroundBlur: Ref<boolean> = ref(false);

/**
 * 更新壁纸聚焦模糊效果
 * @param keyword 关键词内容
 */
const updateFocusBlur = (keyword: Ref<string>): void => {
    if (keyword.value.length == 0) {
        backgroundBlur.value = false;
        return;
    }
    backgroundBlur.value = true;
};

/**
 * 根据关键词内容更新关键词列表
 * @param keywordList 关键词列表
 */
const updateKeyWordList = async (
    keyword: Ref<string>,
    keywordList: Ref<KeywordListType>
): Promise<void> => {
    const req = await fetch(
        `https://www.baidu.com/sugrec?ie=utf-8&prod=pc&from=pc_web&json=1&wd=${keyword.value}`
    );

    const jsonData: any[] | undefined = ((await req.json()) as any)?.g;
    if (!jsonData || jsonData.length == 0) return;

    keywordList.value.length = 0;
    jsonData.forEach((item: any) => {
        keywordList.value.push({
            text: item.q,
            url: `https://www.baidu.com/s?ie=utf-8&wd=${item.q}`
        });
    });
};

/**
 * 监听关键词变化
 */
watch(keyword, () => {
    updateFocusBlur(keyword);
    if (!keyword.value.length) return;
    updateKeyWordList(keyword, keywordList);
    keywordListIndex.value = -1;
});

/**
 * 跳转
 * @param store 状态
 */
const jump = (store: ReturnType<typeof useIndexStore>): void => {
    // 若 keywordListIndex 则使用搜索框内容搜素，否则使用关键词列表中当前聚焦的内容搜素
    const encodedKeyword: string =
        keywordListIndex.value < 0
            ? encodeURIComponent(keyword.value)
            : encodeURIComponent(keywordList.value[keywordListIndex.value].text);

    // 清空搜索框与关键词列表
    keyword.value = '';
    keywordList.value.length = 0;

    // 在当前标签页打开
    if (store.openIn === 'self') window.location.href = store.getCurrentSearchUrl(encodedKeyword);
    // 在新标签页打开
    else if (store.openIn === 'newtab')
        window.open(store.getCurrentSearchUrl(encodedKeyword), '_blank')?.location;
};

const setKeywordListIndex = (
    direction: Direction,
    keywordList: Ref<KeywordListType>,
    keywordListIndex: Ref<number>
): void => {
    // 向上切换
    if (direction === 'up') {
        keywordListIndex.value = keywordListIndex.value <= 0 ? 0 : keywordListIndex.value - 1;
        return;
    }

    // 向下切换
    const lastIndex = keywordList.value.length - 1;
    keywordListIndex.value =
        keywordListIndex.value >= lastIndex ? lastIndex : keywordListIndex.value + 1;
};

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
        jump(store.global);
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
    if (keywordList.value.length === 0 && keyword.value === '') return;

    // 关键词列表切换
    if (e.key === Keys.ArrowUP) {
        setKeywordListIndex('up', keywordList, keywordListIndex);
        e.preventDefault();
        return;
    }

    // 关键词列表切换
    if (e.key === Keys.ArrowDown) {
        setKeywordListIndex('down', keywordList, keywordListIndex);
        e.preventDefault();
        return;
    }
});

onBeforeMount(() => {
    // 首次进入首页的帮助信息
    if (store.global.first) {
        store.global.first = false;
        alert(`欢迎使用！点击时间可以打开设置面板`);
        showSettings.value = true;
    }

    // 版本号检查
    if (store.global.version !== '3.1.4') {
        clear().then(() => {
            localStorage.removeItem('LightSP');
            localStorage.removeItem('LightSP-weather');
            localStorage.removeItem('LightSP-darkMode');
            localStorage.removeItem('LightSP-wallpaper');
            localStorage.removeItem('LightSP-global');
            location.reload();
        });
        alert('非常抱歉：持久化数据的数据结构发生改变，已还原个性化设置。');
    }

    // 深色模式跟随系统
    if (store.darkMode.followSystem)
        store.darkMode.setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
            '--blur-factor': `${
                store.global.blur.enable ? `blur(${store.global.blur.factor}px)` : '0px'
            }`,
            '--color': store.darkMode.enabled
                ? store.darkMode.colorStyle.text
                : store.global.colorStyle.text,
            '--bg-color': store.darkMode.enabled
                ? store.darkMode.getBackgroundColor()
                : store.global.getBackgroundColor(),
            '--fr-color': store.darkMode.enabled
                ? store.darkMode.getForegroundColor()
                : store.global.getForegroundColor()
        }"
    >
        <Background :Blur="backgroundBlur" />

        <div
            class="search-box transition"
            :class="{
                actived: keywordList.length != 0 && keyword.length != 0
            }"
        >
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
                :ListData="keywordList"
                :Selected="keywordListIndex"
                :Keywords="keyword"
            />
        </div>

        <Weather Title="点击查看详情" />

        <transition name="fade">
            <Settings v-show="showSettings" @close="showSettings = false" />
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
@font-face {
    font-family: FusionPixel_12px;
    src: url('./assets/fusion-pixel.ttc');
}

.blur
  backdrop-filter var(--blur-factor)

.fade-enter-from
.fade-leave-to
  opacity 0
  transform scale(.95)

.fade-enter-active
  transition all .5s cubic-bezier(0.15, 0.65, 0, 1)
.fade-leave-active
  // transition all .7s cubic-bezier(0,1,.3,1)
  transition all .2s

.fade-enter-to
.fade-leave-from
  opacity 1
  transform scale(1)
</style>
