<script setup lang="ts">
import Switcher from '../Switcher.vue';
import { useIndexStore } from '../../store';
import { useParticleStore } from '../../store/particle';

const store = {
    global: useIndexStore(),
    particle: useParticleStore()
};
</script>

<template>
    <ul>
        <li>
            <span>启用粒子效果</span>
            <Switcher @click="store.particle.setParticlesVisible(null)" :active="store.particle.enable" />
        </li>
        <li>
            <span>FPS (每秒帧数) 限制</span>
            <input type="number" min="1" max="60" v-model.number="store.particle.fpsLimit" />
        </li>
        <li>
            <span>粒子数量</span>
            <input type="number" min="20" max="1000" v-model.number="store.particle.number" />
        </li>
        <li>
            <span>粒子颜色</span>
            <input type="color" v-model="store.particle.color" />
        </li>
        <li>
            <span>粒子透明度</span>
            <input type="range" min="0" max="1" step="0.1" v-model.number="store.particle.opacity" />
        </li>
        <li>
            <span>随机粒子透明度</span>
            <Switcher @click="store.particle.opacityRandom = !store.particle.opacityRandom" :active="store.particle.opacityRandom" />
        </li>
        <li>
            <span>粒子大小</span>
            <input type="range" min="1" max="10" step="1" v-model.number="store.particle.size" />
        </li>
        <li>
            <span>随机粒子大小</span>
            <Switcher @click="store.particle.randomSize = !store.particle.randomSize" :active="store.particle.randomSize" />
        </li>
        <li>
            <span>粒子速度</span>
            <input type="range" min="0.1" max="2" step="0.1" v-model.number="store.particle.speed" />
        </li>
        <li>
            <span>粒子方向</span>
            <select v-model="store.particle.direction">
                <option value="top-right">右上</option>
                <option value="top-left">左上</option>
                <option value="bottom-right">右下</option>
                <option value="bottom-left">左下</option>
            </select>
        </li>
        <li>
            <span>粒子随机移动</span>
            <Switcher @click="store.particle.randomMove = !store.particle.randomMove" :active="store.particle.randomMove" />
        </li>
    </ul>
</template>

<style lang="stylus" scoped>
li
  margin 14px 0
  padding 8px 10px
  display flex
  justify-content space-between
  align-items center
  border-radius calc(var(--border-radius) - 4px)
  background-color var(--fr-color)

  input[type="color"]
    margin 0
    padding 0
    border none
    width 3rem
    height 1rem
    cursor pointer
</style>
