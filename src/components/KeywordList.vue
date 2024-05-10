<script setup lang="ts">
defineProps<{
    ListData: { text: string; url: string }[];
    Keywords: string;
    Selected: boolean | number;
}>();
</script>

<template>
    <div
        class="w-100 h-0 overflow-x-hide overflow-y-auto transition scrollbar-hide"
        :class="{
            actived: ListData.length && Keywords.length
        }"
    >
        <ul class="m-tb-0 m-lr-auto">
            <li class="m-b w-100 transition blur" v-for="(item, index) in ListData" :key="index">
                <a
                    class="d-block p-lr-lg w-100 h-100 transition text-overflow-ellipsis"
                    :class="{
                        selected: Selected === index
                    }"
                    :href="item.url"
                    >{{ item.text }}
                </a>
            </li>
        </ul>
    </div>
</template>

<style lang="stylus" scoped>
div.actived
    height 500px

ul li
    height 2.5rem
    border 1px solid #8888
    border-radius var(--border-radius)
    background-color var(--bg-color)
    overflow hidden

    &:last-child
        margin 0

    a
        line-height 2.5rem
        color var(--color)

        &:hover
        &.selected
            text-indent .5rem
            letter-spacing 2px
</style>
