<script setup lang='ts'>
import { reactive, watch } from 'vue'
import { getDateSlotCategory, useClockStore } from '../store/clock'

const data = reactive({
  dateInfo: '',
  time: '00:00'
})

const store = useClockStore()
const week: string[] = ['日', '一', '二', '三', '四', '五', '六']
let lunarLibrary: Promise<typeof import('lunar-typescript')> | undefined

const formatDateSlot = (slot: string, date: Date, lunar: string): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  switch (slot) {
    case 'date-chinese': return `${year}年${month}月${day}日`
    case 'date-dot': return `${year}.${month}.${day}`
    case 'date-slash': return `${year}/${month}/${day}`
    case 'week-long': return `星期${week[date.getDay()]}`
    case 'week-short': return `周${week[date.getDay()]}`
    case 'lunar': return lunar
    default: return ''
  }
}

const updateTime = async () => {
  const date = new Date()
  const dateSlots = store.dateSlots.filter((slot) => getDateSlotCategory(slot) !== 'hidden')
  let lunar = ''

  if (dateSlots.includes('lunar')) {
    const { Solar } = await (lunarLibrary ??= import('lunar-typescript'))
    const lunarDate = Solar.fromDate(date).getLunar()
    lunar = `农历${lunarDate.getMonthInChinese()}月${lunarDate.getDayInChinese()}`
  }
  data.dateInfo = dateSlots.map((slot) => formatDateSlot(slot, date, lunar)).join(' ')

  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const hour12 = hours % 12 || 12
  const amPm = hours < 12 ? 'AM' : 'PM'
  data.time = {
    '24-hour': `${hours.toString().padStart(2, '0')}:${minutes}`,
    '12-hour': `${amPm} ${hour12}:${minutes}`,
    '24-hour-seconds': `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`,
    '12-hour-seconds': `${amPm} ${hour12}:${minutes}:${seconds}`,
    '12-hour-suffix': `${hour12}:${minutes} ${amPm}`,
    '12-hour-seconds-suffix': `${hour12}:${minutes}:${seconds} ${amPm}`
  }[store.timeFormat] ?? `${hours.toString().padStart(2, '0')}:${minutes}`
}

watch(() => [store.dateSlots, store.timeFormat], updateTime, { deep: true })
updateTime()
setInterval(updateTime, 1000)
</script>

<template>
  <div
    class="flex flex-col flex-wrap text-center [text-shadow:0_0_4px_#0008] transition-transform duration-300 hover:scale-110 cursor-pointer ease-[cubic-bezier(.14,.94,.36,1.38)]"
  >
    <p v-if="data.dateInfo && store.dateAboveTime" class="text-xs">{{ data.dateInfo }}</p>
    <p class="pt-1 text-[2.5rem]">{{ data.time }}</p>
    <p v-if="data.dateInfo && !store.dateAboveTime" class="text-xs">{{ data.dateInfo }}</p>
  </div>
</template>
