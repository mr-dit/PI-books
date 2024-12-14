<template>
  <div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="(e) => onFormSubmit(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="flex flex-col gap-1">
        <label>
          Имя
          <InputText id="name" name="name" placeholder="Имя" :feedback="false" fluid />
        </label>
        <Message
          v-for="(error, index) of $form.name?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >

        <label>
          Адрес
          <InputText id="address" name="address" placeholder="Адрес" :feedback="false" fluid />
        </label>
        <Message
          v-for="(error, index) of $form.address?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >

        <label>
          Индекс\Город
          <div class="flex gap-1">
            <InputText id="zip" name="zip" placeholder="Индекс" :feedback="false" fluid />
            <InputText id="city" name="city" placeholder="Город" :feedback="false" fluid />
          </div>
        </label>
        <div class="flex gap-1 justify-between">
          <div>
            <Message
              v-for="(error, index) of $form.zip?.errors"
              :key="index"
              severity="error"
              size="small"
              variant="simple"
              class="flex-1 flex flex-col"
              >{{ error.message }}</Message
            >
          </div>
          <div>
            <Message
              v-for="(error, index) of $form.city?.errors"
              :key="index"
              severity="error"
              size="small"
              variant="simple"
              class="flex-1 flex flex-col"
              >{{ error.message }}</Message
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label>
          Телефон
          <InputText id="phone" name="phone" placeholder="Телефон" :feedback="false" fluid />
        </label>
        <Message
          v-for="(error, index) of $form.phone?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >

        <label>
          Почта
          <InputText id="email" name="email" placeholder="Почта" :feedback="false" fluid />
        </label>
        <Message
          v-for="(error, index) of $form.email?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >
      </div>
      <Button :disabled="btnDisabled" type="submit" severity="secondary" label="Сохранить" />
    </Form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ id: '', name: '', address: '', zip: '', city: '', phone: '', email: '' })
  }
})

const emit = defineEmits(['save', 'cancel'])

const initialValues = ref(props.user)

const resolver = ref(
  zodResolver(
    z.object({
      name: z
        .string({
          required_error: 'Обязательное поле',
          invalid_type_error: 'Обязательное поле'
        })
        .min(1, { message: 'Обязательное поле' }),
      address: z
        .string({
          required_error: 'Обязательное поле',
          invalid_type_error: 'Обязательное поле'
        })
        .min(1, { message: 'Обязательное поле' }),
      zip: z
        .string({
          required_error: 'Обязательное поле',
          invalid_type_error: 'Обязательное поле'
        })
        .min(1, { message: 'Обязательное поле' })
        .regex(/^\d+$/, { message: 'Только цифры' })
        .length(6, { message: 'Должно быть 6 цифр' }),
      city: z
        .string({
          required_error: 'Обязательное поле',
          invalid_type_error: 'Обязательное поле'
        })
        .min(1, { message: 'Обязательное поле' }),
      phone: z
        .string({
          invalid_type_error: 'Неверный формат телефона',
          required_error: 'Обязательное поле'
        })
        .min(1, { message: 'Обязательное поле' })
        .regex(/^\+?[\d\s-]+$/, { message: 'Неверный формат телефона' })
        .max(16, { message: 'Не больше 16 символов' }),
      email: z
        .string({
          invalid_type_error: 'Неверный формат email'
        })
        .email({ message: 'Неверный формат email' })
        .optional()
        .or(z.literal(''))
    })
  )
)

watch(
  () => props.user,
  (val) => {
    initialValues.value = val
  }
)

const btnDisabled = ref(false)

const onFormSubmit = async (c, form) => {
  if (!c.valid) return

  // FIXME
  //   const states = c.states
  // const user = {
  //   name: states.name.value,
  //   address: states.address.value,
  //   zip: states.zip.value,
  //   city: states.city.value,
  //   phone: states.phone.value,
  //   email: states.email.value
  // }

  // try {
  //   const id = initialValues.value.id
  //   if (!id) {
  //     const res = await api.post('customers', user)
  //     emit('save', res.data)
  //     return
  //   }
  //   const res = await api.put(`customers/${id}`, user)
  //   emit('save', res.data)

  btnDisabled.value = true
  try {
    const user = {
      ...c.values
    }

    const id = initialValues.value?.id
    if (!id) {
      const res = await api.post('customers', user)
      emit('save', res.data)
      btnDisabled.value = false
      return
    }
    const res = await api.put(`customers/${id}`, user)
    emit('save', res.data)

    btnDisabled.value = false

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Данные клиента сохранены',
      life: 3000
    })
  } catch (e) {
    btnDisabled.value = false
    console.error(e)

    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось сохранить клиента',
      life: 3000
    })
  }
}
</script>

<style scoped></style>
