<template>
  <div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="form"
      @submit="(e) => onSave(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="w-3/4 w-full gap-4 p-4 flex flex-col">
        <label>
          Название выставки
          <InputText id="name" name="name" placeholder="Имя" :feedback="false" fluid />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}</Message>
        </label>
        <label>
          Описание выставки
          <InputText
            id="description"
            name="description"
            placeholder="Описание"
            :feedback="false"
            fluid
          />
          <Message
            v-if="$form.description?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.description.error?.message }}</Message
          >
        </label>
        <label>
          Дата начала
          <DatePicker
            name="startDate"
            :minDate="new Date()"
            :maxDate="$form?.endDate?.value"
            :manualInput="false"
            showIcon
            placeholder="Дата начала"
            fluid
            dateFormat="yy-mm-dd"
            showButtonBar
            iconDisplay="input"
          />
          <Message v-if="$form.startDate?.invalid" severity="error" size="small" variant="simple">{{
            $form.startDate.error?.message
          }}</Message>
        </label>
        <label>
          Дата окончания
          <DatePicker
            name="endDate"
            :minDate="$form?.startDate?.value"
            showIcon
            fluid
            placeholder="Дата окончания"
            iconDisplay="input"
            dateFormat="yy-mm-dd"
            showButtonBar
            :manualInput="false"
          />
          <Message v-if="$form.endDate?.invalid" severity="error" size="small" variant="simple">{{
            $form.endDate.error?.message
          }}</Message>
        </label>
        <Button type="submit" label="Сохранить" />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { toISODateWithTime } from '@/helpers'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  exhibition: Object, // Принимаем выставку как prop
  newBook: Array
})

const emit = defineEmits(['save', 'cancel'])

const resolver = ref(
  zodResolver(
    z.object({
      startDate: z
        .date({ required_error: 'Дата обязательна' })
        .refine((val) => val !== null, { message: 'Дата обязательна' }),
      endDate: z
        .date({ required_error: 'Дата обязательна' })
        .refine((val) => val !== null, { message: 'Дата обязательна' }),
      name: z.string().min(1, { message: 'Обязательное поле' }),
      description: z.string().min(1, { message: 'Обязательное поле' })
    })
  )
)

const form = ref({
  name: props.exhibition.name || '',
  description: props.exhibition.description || '',
  startDate: props.exhibition.startDate,
  endDate: props.exhibition.endDate
})

// Сохранить изменения в выставке
const onSave = async (c, form) => {
  if (!c.valid) {
    return
  }

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
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Произошла ошибка, попробуйте еще раз',
      life: 3000
    })
    console.log(e)
  }
}
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
</style>
