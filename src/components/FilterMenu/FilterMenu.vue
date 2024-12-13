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
          fluid
          iconDisplay="input"
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
    return acc
  }, {})
)

const emitSearch = () => {
  const formDataCopy = { ...formData }
  for (const key in formDataCopy) {
    if (!formDataCopy[key]) {
      delete formDataCopy[key]
    }
  }
  emit('search', formDataCopy)
}
</script>
