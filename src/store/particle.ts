import { defineStore } from 'pinia';

export const useParticleStore = defineStore('particle', {
    state: () => ({
        enable: true,
        fpsLimit: 60,
        number: 100,
        color: '#ffffff',
        opacity: 0.5,
        opacityRandom: false,
        size: 3,
        randomSize: true,
        speed: 0.5,
        direction: 'top-right' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
        randomMove: false
    }),
    getters: {},
    actions: {
        setParticlesVisible(status: boolean | null) {
            if (status === null) {
                this.enable = !this.enable;
                return;
            }
            this.enable = status;
        }
    }
});
