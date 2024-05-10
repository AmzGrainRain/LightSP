import { defineStore } from 'pinia';
import { getItem } from 'localforage';

export const useWallpaperStore = defineStore('wallpaper', {
    state: () => ({
        // 默认壁纸
        default: {
            enable: true,
            index: 0,
            wallpaper: [
                '3.1.6.png',
                '3.1.5.jpg',
                '3.1.4.jpg',
                '3.1.3.png',
                '3.1.2.jpg',
                '3.1.1.jpg'
            ]
        },
        // 必应壁纸
        bing: {
            enable: false
        },
        // 自定义壁纸
        custom: {
            enable: false
        },
        // 聚焦模糊
        focusBlur: true
    }),
    getters: {},
    actions: {
        getCurrentWallpaper(): 'default' | 'bing' | 'custom' {
            if (this.default.enable) return 'default';
            if (this.bing.enable) return 'bing';
            if (this.custom.enable) return 'custom';

            // 异常情况
            this.default.enable = true;
            this.bing.enable = false;
            this.custom.enable = false;
            return 'default';
        },
        restoreDefaultWallpaper() {
            this.default.enable = true;
            this.bing.enable = false;
            this.custom.enable = false;
            location.reload();
        },
        enableWallpaper(name: 'default' | 'bing' | 'custom') {
            this.default.enable = false;
            this.bing.enable = false;
            this.custom.enable = false;

            if (name === 'default') this.default.enable = true;
            else if (name === 'bing') this.bing.enable = true;
            else if (name === 'custom') this.custom.enable = true;
            location.reload();
        },
        setWallpaperFocusBlur(status: boolean | null) {
            if (status === null) this.focusBlur = !this.focusBlur;
            else this.focusBlur = status;
        }
    }
});

export interface WallpaperManager {
    getWallpaperURL(): string | Promise<string | void>;
    setWallpaper(...param: any): void;
    enable(): void | Promise<void>;
}

export class DefaultWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    getWallpaperURL(): string {
        return new URL(`../assets/${this.store.default.wallpaper[this.store.default.index]}`, import.meta.url)
            .href;
    }

    setWallpaper(index: number): void {
        if (index >= 0 || index < this.store.default.wallpaper.length) {
            this.store.default.index = index;
        }
    }

    enable(): void {
        this.store.restoreDefaultWallpaper();
        location.reload();
    }
}

export class BingWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperURL(): Promise<string | undefined> {
        try {
            const response = await fetch('https://khlee.site:3333/api/wallpaper', {
                method: 'GET'
            });

            const data = await response.json();
            if (data === null) return undefined;
            return 'https://cn.bing.com/' + data.images[0].url;
        } catch (error) {
            console.error('Failed to fetch Bing wallpaper:', error);
            return undefined;
        }
    }

    setWallpaper(): void {}

    enable(): void {
        if (this.store.bing.enable) this.store.restoreDefaultWallpaper();
        else this.store.enableWallpaper('bing');
        location.reload();
    }
}

export class CustomWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperURL(): Promise<string | undefined> {
        const value = await getItem<string>('CustomizeWallpaper');
        if (!value) {
            alert('自定义图片不存在，已自动切换为默认背景。');
            this.store.restoreDefaultWallpaper();
            return undefined;
        }

        return value;
    }

    setWallpaper(): void {

    }

    async enable(): Promise<void> {
        const value = await getItem<string>('CustomizeWallpaper');
        if (!value) {
            alert('您还没有设置一个图片，所以无法将自定义图片作为背景。');
            location.reload();
            return;
        }

        if (this.store.custom.enable) {
            this.store.enableWallpaper('default');
            location.reload();
            return;
        }

        this.store.enableWallpaper('custom');
        location.reload();
    }
}

export const GetWallpaperManager = (store: ReturnType<typeof useWallpaperStore>): WallpaperManager | undefined => {
    const current = store.getCurrentWallpaper();
    if (current === 'default') return new DefaultWallpaperManager(store) as DefaultWallpaperManager;
    else if (current === 'bing') return new BingWallpaperManager(store) as BingWallpaperManager;
    else if (current === 'custom') return new CustomWallpaperManager(store) as CustomWallpaperManager;
    return undefined;
}
