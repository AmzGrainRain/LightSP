<script setup lang="ts">
import { dateSlotOptions, getDateSlotCategory, timeFormatOptions, useClockStore } from '../../store/clock'
import Switcher from '../Switcher.vue'
import { settingRowClass, settingsSelectClass } from './classes'

const store = useClockStore()

const optionIsUsed = (slotIndex: number, optionValue: string): boolean => {
  const category = getDateSlotCategory(optionValue)
  return category !== 'hidden' && store.dateSlots.some(
    (selectedValue, index) => index !== slotIndex && getDateSlotCategory(selectedValue) === category
  )
}
</script>

<template>
  <ul>
    <li v-for="(_slot, index) in store.dateSlots" :key="index" :class="settingRowClass">
      <span>日期位置 {{ index + 1 }}</span>
      <select v-model="store.dateSlots[index]" :class="[settingsSelectClass, 'w-1/2 rounded-sm bg-white text-black']">
        <option
          v-for="option in dateSlotOptions"
          :key="option.value"
          :value="option.value"
          :disabled="optionIsUsed(index, option.value)"
        >
          {{ option.label }}
        </option>
      </select>
    </li>
    <li :class="settingRowClass">
      <span>时间格式</span>
      <select v-model="store.timeFormat" :class="[settingsSelectClass, 'w-1/2 rounded-sm bg-white text-black']">
        <option v-for="option in timeFormatOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </li>
    <li :class="settingRowClass">
      <span>日期显示在时间上方</span>
      <Switcher @click="store.setDateAboveTime(null)" :active="store.dateAboveTime" />
    </li>
  </ul>
</template>
