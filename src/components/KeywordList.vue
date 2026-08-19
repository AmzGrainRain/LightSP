<script setup lang="ts">
defineProps<{
    ListData: { text: string; url: string }[];
    Keywords: string;
    Selected: boolean | number;
}>();
</script>

<template>
    <div
        class="h-0 w-full overflow-x-hidden overflow-y-auto transition-all duration-300 scrollbar-hide"
        :class="ListData.length && Keywords.length ? 'h-125' : ''"
    >
        <ul class="mx-auto my-0">
            <li
                class="glass-effect mb-2 h-10 w-full overflow-hidden rounded-(--border-radius) border border-[#8888] bg-(--bg-color) transition-all duration-300 last:mb-0"
                v-for="(item, index) in ListData"
                :key="index"
            >
                <a
                    class="block h-full w-full overflow-hidden text-ellipsis whitespace-nowrap px-3 leading-10 text-(--color) transition-transform duration-300 hover:translate-x-2"
                    :class="Selected === index ? 'translate-x-2' : ''"
                    :href="item.url"
                    >{{ item.text }}
                </a>
            </li>
        </ul>
    </div>
</template>
