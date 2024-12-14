<template>
  <div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
      v-slot="$form"
      :initialValues="form"
      @submit="(e) => onSave(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="w-3/4 w-full gap-4 p-4 flex flex-col">
        <label>
          Название выставки
          <InputText id="name" name="name" placeholder="Имя" required :feedback="false" fluid />
        </label>
        <label>
          Описание выставки
          <InputText
            id="description"
            name="description"
            placeholder="Описание"
            required
            :feedback="false"
            fluid
          />
        </label>
        <label>
          Дата начала
          <!-- <InputText
              type="date"
              :minDate="new Date()"
              :maxDate="new Date()"
              id="startDate"
              placeholder="Дата начала"
              required
              :feedback="false"
              fluid
              v-model="date"
              /> -->
          <DatePicker
            name="startDate"
            :minDate="new Date()"
            :maxDate="$form?.endDate?.value"
            :manualInput="false"
            showIcon
            fluid
            dateFormat="yy-mm-dd"
            showButtonBar
            iconDisplay="input"
          />
        </label>
        <label>
          Дата окончания
          <!-- <InputText
              type="date"
              id="endDate"
              name="endDate"
              required
              placeholder="Дата окончания"
              fluid
            /> -->
          <DatePicker
            name="endDate"
            :minDate="$form?.startDate?.value"
            showIcon
            fluid
            iconDisplay="input"
            dateFormat="yy-mm-dd"
            showButtonBar
            :manualInput="false"
          />
        </label>
      </div>
      <Button type="submit" label="Сохранить" />
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { toISODateWithTime } from '@/helpers'

const props = defineProps({
  exhibition: Object, // Принимаем выставку как prop
  newBook: Array
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  name: props.exhibition.name || '',
  description: props.exhibition.description || '',
  startDate: props.exhibition.startDate,
  endDate: props.exhibition.endDate
})

// Сохранить изменения в выставке
const onSave = async (c, form) => {
  const states = c.states

  const data = {
    name: states.name.value,
    description: states.description.value,
    startDate: toISODateWithTime(states.startDate.value),
    endDate: toISODateWithTime(states.endDate.value)
  }

  try {
    const res = await api.post(`exhibitions`, {
      ...data,
      books: []
    })
    emit('save')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
</style>
