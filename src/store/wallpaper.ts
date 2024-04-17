import { defineStore } from 'pinia';
import { getItem } from 'localforage';
import Wallpaper from '../components/settings/wallpaper.vue';

export const useWallpaperStore = defineStore('wallpaper', {
    state: () => ({
        // 默认壁纸
        default: {
            enable: true,
            index: 0,
            wallpaper: ['3.1.4.jpg', '3.1.3.png', '3.1.2.jpg', '3.1.1.jpg']
        },
        // 必应壁纸
        bing: {
            enable: false
        },
        // 自定义壁纸
        custom: {
            enable: false
        },
        wallpaperLoader: null as Wallpaper | null,
        // 聚焦模糊
        focusBlur: true
    }),
    getters: {
        current() {
            if (this.default.enable) return 'default';
            if (this.bing.enable) return 'bing';
            if (this.custom.enable) return 'custom';

            // 异常情况
            this.default.enable = true;
            this.bing.enable = false;
            this.custom.enable = false;
            return 'default';
        }
    },
    actions: {
        restoreWallpaper() {
            this.default.enable = true;
            this.bing.enable = false;
            this.custom.enable = false;
        },
        enableWallpaper(name: 'default' | 'bing' | 'custom') {
            this.default.enable = false;
            this.bing.enable = false;
            this.custom.enable = false;

            if (name === 'default') this.default.enable = true;
            if (name === 'bing') this.bing.enable = true;
            if (name === 'custom') this.custom.enable = true;
        },
        setWallpaperFocusBlur(status: boolean | null) {
            if (status === null) this.focusBlur = !this.focusBlur;
            else this.focusBlur = status;
        }
    }
});

export interface Wallpaper {
    getWallpaperUrl(): Promise<string | undefined>;
    enable(): void;
    getStore(): ReturnType<typeof useWallpaperStore>;
}

export class DefaultWallpaper implements Wallpaper {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperUrl(): Promise<string> {
        return new URL(
            `../assets/${this.store.default.wallpaper[this.store.default.index]}`,
            import.meta.url
        ).href;
    }

    setWallpaper(index: number) {
        this.store.default.index = index;
    }

    enable(): void {
        this.store.restoreWallpaper();
    }

    getStore = () => this.store;
}

export class BingWallpaper implements Wallpaper {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperUrl(): Promise<string | undefined> {
        try {
            const response = await fetch('https://khlee.site:81/api/wallpaper', {
                method: 'GET',
                mode: 'cors'
            });
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Failed to fetch Bing wallpaper:', error);
            return undefined;
        }
    }

    enable(): void {
        this.store.enableWallpaper('bing');
    }

    getStore = () => this.store;
}

export class CustomWallpaper implements Wallpaper {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperUrl(): Promise<string | undefined> {
        const value = await getItem<string>('CustomizeWallpaper');
        if (!value) {
            alert('自定义图片不存在，已自动切换为默认背景。');
            return undefined;
        }

        return value;
    }

    enable(): void {
        this.store.enableWallpaper('custom');
    }

    getStore = () => this.store;
}

export const getWallpaperLoader = (
    store?: ReturnType<typeof useWallpaperStore>
): Wallpaper | undefined => {
    store = store || useWallpaperStore();

    if (store.default.enable) return new DefaultWallpaper(store);

    if (store.bing.enable) return new BingWallpaper(store);

    if (store.custom.enable) return new CustomWallpaper(store);
};
