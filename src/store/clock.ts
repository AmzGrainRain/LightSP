import { defineStore } from 'pinia'

export type DateSlotCategory = 'hidden' | 'date' | 'week' | 'lunar'
export type TimeFormat =
  | '24-hour'
  | '12-hour'
  | '24-hour-seconds'
  | '12-hour-seconds'
  | '12-hour-suffix'
  | '12-hour-seconds-suffix'

export interface DateSlotOption {
  value: string
  label: string
  category: DateSlotCategory
}

export const dateSlotOptions: DateSlotOption[] = [
  { value: 'hidden', label: '隐藏', category: 'hidden' },
  { value: 'date-chinese', label: '日期：xxxx年x月x日', category: 'date' },
  { value: 'date-dot', label: '日期：xxxx.x.x', category: 'date' },
  { value: 'date-slash', label: '日期：xxxx/x/x', category: 'date' },
  { value: 'week-long', label: '周天：星期一', category: 'week' },
  { value: 'week-short', label: '周天：周一', category: 'week' },
  { value: 'lunar', label: '农历', category: 'lunar' }
]

export const timeFormatOptions: { value: TimeFormat; label: string }[] = [
  { value: '24-hour', label: 'xx:xx' },
  { value: '12-hour', label: 'AM/PM xx:xx' },
  { value: '24-hour-seconds', label: 'xx:xx:xx' },
  { value: '12-hour-seconds', label: 'AM/PM xx:xx:xx' },
  { value: '12-hour-suffix', label: 'xx:xx AM/PM' },
  { value: '12-hour-seconds-suffix', label: 'xx:xx:xx AM/PM' }
]

export const getDateSlotCategory = (value: string): DateSlotCategory =>
  dateSlotOptions.find((option) => option.value === value)?.category ?? 'hidden'

export const useClockStore = defineStore('clock', {
  state: () => ({
    dateSlots: ['hidden', 'hidden', 'hidden'],
    dateAboveTime: true,
    timeFormat: '24-hour' as TimeFormat
  }),
  actions: {
    setDateAboveTime(status: boolean | null) {
      if (status === null) {
        this.dateAboveTime = !this.dateAboveTime
        return
      }
      this.dateAboveTime = status
    }
  }
})
