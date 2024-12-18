<template>
  <div class="w-1/4 h-full flex flex-col justify-between p-4 surface-border overflow-y-auto">
    <div>
      <h2 class="text-primary font-bold text-lg mb-4">{{ props.title }}</h2>
      <div v-for="(input, index) in inputs" :key="index" class="mb-4">
        <label :for="input.key" class="block text-secondary font-semibold mb-2">
          {{ input.label }}
        </label>
        <DatePicker
          v-if="input.type === 'date'"
          :id="input.key"
          :minDate="typeof input.minDate === 'string' ? formData[input.minDate] : input.minDate"
          :maxDate="typeof input.maxDate === 'string' ? formData[input.maxDate] : input.maxDate"
          v-model="formData[input.key]"
          :manualInput="false"
          showIcon
          showButtonBar
          dateFormat="yy-mm-dd"
          fluid
          iconDisplay="input"
        />
        <InputNumber
          v-else-if="input.type === 'number'"
          :id="input.key"
          v-model="formData[input.key]"
          class="w-full"
        />
        <InputText
          v-else
          type="text"
          :id="input.key"
          v-model="formData[input.key]"
          class="w-full"
        />
      </div>
      <Button label="Поиск" icon="pi pi-search" @click="emitSearch" class="w-full p-button" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { InputNumber } from 'primevue'
import { reactive } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Поиск книг'
  },
  inputs: {
    type: Array,
    required: true,
    default: () => [] // [{ key: 'title', label: 'Заголовок' }]
  }
})

const emit = defineEmits(['search'])

const formData = reactive(
  props.inputs.reduce((acc, input) => {
    acc[input.key] = ''
    if (input.type === 'number') {
      acc[input.key] = null
    }
    return acc
  }, {})
)

const isDate = (obj) => Object.prototype.toString.call(obj) === '[object Date]'

function toISODate(date) {
  date = new Date(date)
  // Получаем компоненты года, месяца и дня
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const day = String(date.getDate()).padStart(2, '0')

  // Формируем строку ISO с фиктивным временем
  return `${year}-${month}-${day}`
}

const emitSearch = () => {
  const formDataCopy = { ...formData }
  for (const key in formDataCopy) {
    const val = formDataCopy[key]
    if (!val) {
      delete formDataCopy[key]
    }
    if (isDate(val)) {
      formDataCopy[key] = toISODate(val)
    }
  }
  emit('search', formDataCopy)
}
</script>
