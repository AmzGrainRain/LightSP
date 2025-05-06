import { defineStore } from 'pinia';

export enum SearchEngine {
    Bing,
    Baidu,
    Google,
    Sogo,
    _360,
    Custom
}

export const useIndexStore = defineStore('global', {
    state: () => ({
        version: '3.1.8',
        first: true,
        blur: {
            enable: true,
            factor: 22
        },
        showKeywordList: false,
        borderRadius: 12,
        adaptiveHeight: true,
        offsetHeight: 0,
        font: 'FusionPixel',
        colorStyle: {
            text: '#000000',
            background: { r: 255, g: 255, b: 255, a: 60 },
            foreground: { r: 128, g: 128, b: 128, a: 5 },
            theme: { r: 130, g: 150, b: 255, a: 100 }
        },
        searchEngine: {
            index: SearchEngine.Bing,
            list: [
                { name: '必应搜索', url: 'https://cn.bing.com/search?form=QBLH&q={}' },
                { name: '秘塔AI搜索', url: 'https://metaso.cn/?q={}' },
                { name: '网盘搜索', url: 'https://miaosou.fun/info?searchKey={}' },
                { name: '学术搜索', url: 'https://www.oalib.com/search?kw={}' },
                { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?va=g&t=hj&ia=web&q={}' },
                { name: '谷歌搜索', url: 'https://www.google.com/search?q={}' },
                { name: '百度搜素', url: 'https://www.baidu.com/s?ie=utf-8&wd={}' },
                { name: '360搜索', url: 'https://www.so.com/s?ie=utf-8&q={}' },
                { name: '搜狗搜索', url: 'https://www.sogou.com/web?query={}' },
                { name: '自定义', url: '' }
            ]
        },
        openIn: 'newtab' as 'self' | 'newtab'
    }),
    getters: {},
    actions: {
        setDefaultEngine(se: SearchEngine) {
            this.searchEngine.index = se;
        },

        setOpenIn(nv?: typeof this.openIn) {
            if (!nv) {
                this.openIn = this.openIn === 'newtab' ? 'self' : 'newtab';
                return;
            }

            this.openIn = nv;
        },

        getCurrentSearchUrl(keyword: string): string {
            return this.searchEngine.list[this.searchEngine.index].url.replace('{}', keyword);
        },

        getBackgroundColor(): string {
            const bg = this.colorStyle.background;
            return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`;
        },

        getForegroundColor(): string {
            const bg = this.colorStyle.foreground;
            return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`;
        },

        getThemeColor(): string {
            const bg = this.colorStyle.theme;
            return `rgba(${bg.r} ${bg.g} ${bg.g} / ${bg.a}%)`;
        }
    }
});
