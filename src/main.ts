import { createApp, toRaw } from 'vue';
import { createPinia, PiniaPluginContext } from 'pinia';
import localforage from 'localforage';
import Particles from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim';
import App from './App.vue';
import './style.styl';

// 配置 localforage
localforage.config({
    name: 'customBackgroundImage'
});

// Pinia 初始化 & Pinia 数据持久化
const store = createPinia();
const piniaPlugin = () => {
    return (ctx: PiniaPluginContext) => {
        const { store } = ctx;
        const key = `LightSP-${store.$id}`;
        const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {};
        store.$subscribe(() => {
            localStorage.setItem(key, JSON.stringify(toRaw(store.$state)));
        });
        return { ...data };
    };
};
store.use(piniaPlugin());

createApp(App)
    .use(store)
    .use(Particles, {
        init: async (engine) => {
            await loadSlim(engine);
        }
    })
    .mount('body');
