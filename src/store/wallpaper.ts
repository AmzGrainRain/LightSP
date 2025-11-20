import { defineStore } from 'pinia';
import { getItem, setItem } from 'localforage';

export type WallpaperTypes = 'default' | 'bing' | 'bing-random' | 'url' | 'local';

export const useWallpaperStore = defineStore('wallpaper', {
    state: () => ({
        // 默认壁纸
        default: {
            enable: true,
            index: 0,
            wallpaper: [
                '3.2.0.png',
                '3.1.9.jpg',
                '3.1.8.jpg',
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
            enable: false,
            index: 1,
            wallpaper: [
                'https://bing.img.run/uhd.php',
                'https://bing.img.run/1920x1080.php',
                'https://bing.img.run/1366x768.php'
            ]
        },
        // 必应随机壁纸
        bingRandom: {
            enable: false,
            index: 1,
            wallpaper: [
                'https://bing.img.run/rand_uhd.php',
                'https://bing.img.run/rand.php',
                'https://bing.img.run/rand_1366x768.php'
            ]
        },
        // 自定义 url 壁纸
        url: {
            enable: false,
            src: ''
        },
        // 自定义壁纸
        local: {
            enable: false
        },
        // 聚焦模糊
        focusBlur: true
    }),
    getters: {},
    actions: {
        getCurrentWallpaper(): WallpaperTypes {
            if (this.default.enable) return 'default';
            if (this.bing.enable) return 'bing';
            if (this.bingRandom.enable) return 'bing-random';
            if (this.url.enable) return 'url';
            if (this.local.enable) return 'local';

            return 'default';
        },
        restoreDefaultWallpaper() {
            localStorage.removeItem('LightSP-wallpaper');
            location.reload();
        },
        enableWallpaper(name: WallpaperTypes) {
            this.default.enable = false;
            this.bing.enable = false;
            this.bingRandom.enable = false;
            this.local.enable = false;

            if (name === 'bing') this.bing.enable = true;
            else if (name === 'bing-random') this.bingRandom.enable = true;
            else if (name === 'url') this.url.enable = true;
            else if (name === 'local') this.local.enable = true;
            else this.default.enable = true;
            location.reload();
        },
        setWallpaperFocusBlur(status?: boolean) {
            if (status === undefined) this.focusBlur = !this.focusBlur;
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

    getWallpaperURL(): string {
        return this.store.bing.wallpaper[this.store.bing.index];
    }

    setWallpaper(index: number): void {
        if (index >= 0 || index < this.store.bing.wallpaper.length) {
            this.store.bing.index = index;
        }
    }

    enable(): void {
        if (this.store.bing.enable) this.store.restoreDefaultWallpaper();
        else this.store.enableWallpaper('bing');
        location.reload();
    }
}

export class BingRandomWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    getWallpaperURL(): string {
        return this.store.bingRandom.wallpaper[this.store.bingRandom.index];
    }

    setWallpaper(index: number): void {
        if (index >= 0 || index < this.store.bingRandom.wallpaper.length) {
            this.store.bingRandom.index = index;
        }
    }

    enable(): void {
        if (this.store.bingRandom.enable) this.store.restoreDefaultWallpaper();
        else this.store.enableWallpaper('bing-random');
        location.reload();
    }
}

export class UrlWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    getWallpaperURL(): string {
        return this.store.url.src;
    }

    setWallpaper(src: string): void {
        this.store.url.src = src;
    }

    enable(): void {
        if (this.store.url.enable) this.store.restoreDefaultWallpaper();
        else this.store.enableWallpaper('url');
        location.reload();
    }
}

export class LocalWallpaperManager implements WallpaperManager {
    constructor(private store: ReturnType<typeof useWallpaperStore>) {}

    async getWallpaperURL(): Promise<string | undefined> {
        const value = await getItem<string>('LocalWallpaper');
        if (!value) {
            alert('自定义图片不存在，已自动切换为默认背景。');
            this.store.restoreDefaultWallpaper();
            return undefined;
        }

        return value;
    }

    setWallpaper(file: File): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setItem('LocalWallpaper', reader.result, (err) => {
                if (err !== null) console.log('[Error] setCustomizeWallpaper: localforage.setItem');
                this.enable();
            });
        };
    }

    async enable(): Promise<void> {
        const value = await getItem<string>('LocalWallpaper');
        if (!value) {
            alert('您还没有设置一个图片，所以无法将自定义图片作为背景。');
            location.reload();
            return;
        }

        if (this.store.local.enable) {
            this.store.enableWallpaper('default');
            location.reload();
            return;
        }

        this.store.enableWallpaper('local');
        location.reload();
    }
}

export const WallpaperManagerFactory = (
    store: ReturnType<typeof useWallpaperStore>
): WallpaperManager | undefined => {
    const current = store.getCurrentWallpaper();
    if (current === 'default') return new DefaultWallpaperManager(store);
    else if (current === 'bing') return new BingWallpaperManager(store);
    else if (current === 'bing-random') return new BingRandomWallpaperManager(store);
    else if (current === 'url') return new UrlWallpaperManager(store);
    else if (current === 'local') return new LocalWallpaperManager(store);
    return undefined;
};
