<script setup lang="ts">
import { watch, onBeforeMount, ref, Ref } from 'vue';
import { useIndexStore } from './store';
import { useClockStore } from './store/clock';
import { useDarkModeStore } from './store/darkMode';
import { useWallpaperStore } from './store/wallpaper';
import Weather from './components/Weather.vue';
import Wallpaper from './components/Wallpaper.vue';
import Clock from './components/Clock.vue';
import SearchBox from './components/SearchBox.vue';
import KeywordList from './components/KeywordList.vue';
import Settings from './components/settings/index.vue';

type KeywordListType = { text: string; url: string }[];
type Direction = 'up' | 'down';
type BaiduSuggestionResponse = { g?: { q: string }[]; permissionRequired?: boolean };
type KeywordSuggestionMessage = { type: 'getKeywordSuggestions'; query: string };
type OriginPermissions = {
    request: (permissions: { origins: string[] }) => Promise<boolean>;
};

type BrowserRuntime = {
    sendMessage: (message: KeywordSuggestionMessage) => Promise<BaiduSuggestionResponse>;
};
type ChromeRuntime = {
    lastError?: { message?: string };
    sendMessage: (message: KeywordSuggestionMessage, callback: (response?: BaiduSuggestionResponse) => void) => void;
};

const store = {
    global: useIndexStore(),
    clock: useClockStore(),
    darkMode: useDarkModeStore(),
    wallpaper: useWallpaperStore()
};

const showSettings: Ref<boolean> = ref(false);
const keyword: Ref<string> = ref('');
const keywordList: Ref<KeywordListType> = ref([]);
const keywordListIndex: Ref<number> = ref(-1);
const keywordSuggestionPermissionRequired: Ref<boolean> = ref(false);
let keywordListRequestId = 0;

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
const keywordListIndexIsDefault = (): boolean => keywordListIndex.value === -1;

const getKeywordSuggestions = (query: string): Promise<BaiduSuggestionResponse> => {
    const extensionContext = globalThis as typeof globalThis & {
        browser?: { runtime?: BrowserRuntime };
        chrome?: { runtime?: ChromeRuntime };
    };
    const message: KeywordSuggestionMessage = { type: 'getKeywordSuggestions', query };

    if (extensionContext.browser?.runtime) {
        return extensionContext.browser.runtime.sendMessage(message);
    }

    if (extensionContext.chrome?.runtime) {
        return new Promise((resolve, reject) => {
            const runtime = extensionContext.chrome?.runtime;
            if (!runtime) {
                reject(new Error('扩展运行时不可用'));
                return;
            }
            runtime.sendMessage(message, (response) => {
                if (runtime.lastError) {
                    reject(new Error(runtime.lastError.message));
                    return;
                }
                resolve(response ?? {});
            });
        });
    }

    return Promise.reject(new Error('未在扩展环境中运行'));
};

const requestKeywordSuggestionPermission = (): Promise<boolean> => {
    const extensionContext = globalThis as typeof globalThis & {
        browser?: { permissions?: OriginPermissions };
        chrome?: { permissions?: OriginPermissions };
    };
    const permissions = extensionContext.browser?.permissions ?? extensionContext.chrome?.permissions;

    if (!permissions) return Promise.resolve(false);

    return permissions.request({ origins: ['https://www.baidu.com/*'] });
};

const updateKeywordList = (): void => {
    keywordList.value.length = 0;

    const query = keyword.value.trim();
    if (!query) return;

    const requestId = ++keywordListRequestId;
    getKeywordSuggestions(query)
        .then((response) => {
            if (requestId !== keywordListRequestId) return;

            if (response.permissionRequired) {
                keywordSuggestionPermissionRequired.value = true;
                return;
            }

            response.g?.forEach((item) => {
                keywordList.value.push({
                    text: item.q,
                    url: `https://www.baidu.com/s?ie=utf-8&wd=${encodeURIComponent(item.q)}`
                });
            });
        })
        .catch(() => {
            if (requestId === keywordListRequestId) keywordList.value.length = 0;
        });
};

const enableKeywordSuggestions = (): void => {
    requestKeywordSuggestionPermission()
        .then((granted) => {
            keywordSuggestionPermissionRequired.value = !granted;
            if (granted) updateKeywordList();
        })
        .catch(() => {
            keywordSuggestionPermissionRequired.value = true;
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
    if (!backgroundBlur.value) {
        keywordListRequestId++;
        keywordList.value.length = 0;
        return;
    }
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
                showSettings.value = !showSettings.value;
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
const CURRENT_CONFIG_VERSION = '4.0.2';

const configMigrations: Record<string, () => void> = {
    // 4.0.1 起，showKeywordList 与其名称一致：true 表示显示列表。
    // 旧版本的 false 表示显示，因此需要反转以保留实际显示状态。
    '3.2.0': () => {
        store.global.showKeywordList = !store.global.showKeywordList;
        store.global.version = '4.0.1';
    },
    '3.2.1': () => {
        store.global.showKeywordList = !store.global.showKeywordList;
        store.global.version = '4.0.1';
    },
    '4.0.0': () => {
        store.global.showKeywordList = !store.global.showKeywordList;
        store.global.version = '4.0.1';
    },
    // 4.0.2 新增搜索框显示配置，旧版始终显示搜索框。
    '4.0.1': () => {
        store.global.showSearchBox = true;
        store.global.version = CURRENT_CONFIG_VERSION;
    },
    // 4.0.3 移除了部分搜索引擎
    '4.0.2': () => {
        store.global.searchEngine.list = [
            { name: '必应搜索', url: 'https://cn.bing.com/search?form=QBLH&q={}' },
            { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?va=g&t=hj&ia=web&q={}' },
            { name: '谷歌搜索', url: 'https://www.google.com/search?q={}' },
            { name: '百度搜素', url: 'https://www.baidu.com/s?ie=utf-8&wd={}' },
            { name: '360搜索', url: 'https://www.so.com/s?ie=utf-8&q={}' },
            { name: '搜狗搜索', url: 'https://www.sogou.com/web?query={}' },
            { name: '自定义', url: '' }
        ]
    }
};

const MigrateClockConfig = (): void => {
    const legacyStore = store.clock as typeof store.clock & {
        dateVisible?: boolean;
        secondsVisible?: boolean;
        lunarVisible?: boolean;
    };
    const hasLegacySettings =
        typeof legacyStore.dateVisible === 'boolean' ||
        typeof legacyStore.secondsVisible === 'boolean' ||
        typeof legacyStore.lunarVisible === 'boolean';

    if (!hasLegacySettings) return;

    const dateSlots = ['hidden', 'hidden', 'hidden'];
    if (legacyStore.dateVisible) {
        dateSlots[0] = 'date-chinese';
        dateSlots[1] = 'week-long';
        if (legacyStore.lunarVisible) dateSlots[2] = 'lunar';
    }

    store.clock.$patch({
        dateSlots,
        timeFormat: legacyStore.secondsVisible ? '24-hour-seconds' : '24-hour'
    });
};

const MigrateWallpaperConfig = (): void => {
    const legacyStore = store.wallpaper as typeof store.wallpaper & {
        bing?: { enable?: boolean };
        bingRandom?: { enable?: boolean };
    };
    const usedRemovedBingWallpaper = legacyStore.bing?.enable || legacyStore.bingRandom?.enable;

    if (usedRemovedBingWallpaper) {
        store.wallpaper.$patch({
            default: { enable: true },
            url: { ...store.wallpaper.url, enable: false },
            local: { ...store.wallpaper.local, enable: false }
        });
    }

    delete legacyStore.bing;
    delete legacyStore.bingRandom;
};

const CheckVersion = (): void => {
    while (store.global.version !== CURRENT_CONFIG_VERSION) {
        const migrate = configMigrations[store.global.version];
        if (!migrate) {
            console.warn(`未找到 ${store.global.version} 到 ${CURRENT_CONFIG_VERSION} 的配置迁移，将保留已有配置。`);
            store.global.version = CURRENT_CONFIG_VERSION;
            break;
        }
        migrate();
    }
    MigrateClockConfig();
    MigrateWallpaperConfig();
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
    <div id="app" class="flex h-screen w-screen flex-col flex-nowrap items-center overflow-hidden p-6" :style="{
        fontFamily: store.global.font,
        justifyContent: store.global.adaptiveHeight ? 'center' : 'unset',
        // 如果启用了 自适应高度 则应屏蔽 偏移高度
        '--offset-height': `${store.global.adaptiveHeight ? 0 : store.global.offsetHeight}rem`,
        '--border-radius': `${store.global.borderRadius}px`,
        '--blur-factor': `${store.global.blur.enable ? `blur(${store.global.blur.factor}px)` : '0px'}`,
        '--color': store.darkMode.enabled ? store.darkMode.colorStyle.text : store.global.colorStyle.text,
        '--bg-color': store.darkMode.enabled ? store.darkMode.getBackgroundColor() : store.global.getBackgroundColor(),
        '--fr-color': store.darkMode.enabled ? store.darkMode.getForegroundColor() : store.global.getForegroundColor()
    }">
        <Wallpaper :Blur="backgroundBlur" />

        <div
            class="flex w-180 flex-col flex-wrap items-center pt-(--offset-height) pb-[15%] transition-all duration-300 max-[1024px]:w-4/5 max-[512px]:w-[95%]">
            <Clock @click="showSettings = true" title="点击打开设置" />
            <div class="h-4"></div>
            <div class="relative w-full">
                <SearchBox v-if="store.global.showSearchBox" Placeholder="输入搜索内容" Title="按下回车搜索" @updateEvent="
                    (text: string): void => {
                        keyword = text;
                    }
                " />
                <button
                    v-if="store.global.showSearchBox && store.global.showKeywordList && keywordSuggestionPermissionRequired"
                    class="mt-3 cursor-pointer rounded-(--border-radius) border border-[#8888] px-3 py-1 text-sm transition-colors hover:bg-white/20"
                    type="button" @click="enableKeywordSuggestions">
                    授权百度搜索建议
                </button>
                <div class="h-[0.8rem]"></div>
                <KeywordList v-if="store.global.showSearchBox && store.global.showKeywordList"
                    class="absolute left-0 top-full" :Keywords="keyword" :ListData="keywordList"
                    :Selected="keywordListIndex" />
            </div>
        </div>

        <Weather Title="点击查看详情" />

        <transition name="fade">
            <Settings v-show="showSettings" @close="showSettings = false" />
        </transition>
    </div>
</template>
