<template>
  <div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
      v-slot="$form"
      :initialValues
      @submit="(e) => onFormSubmit(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="flex flex-col gap-1">
        <label>
          Имя
          <InputText id="name" name="name" placeholder="Имя" :feedback="false" fluid />
        </label>
        <label>
          Адрес
          <InputText id="address" name="address" placeholder="Адрес" :feedback="false" fluid />
        </label>
        <label>
          Индекс\Город
          <div class="flex gap-1">
            <InputText id="zip" name="zip" placeholder="Индекс" :feedback="false" fluid />
            <InputText id="city" name="city" placeholder="Город" :feedback="false" fluid />
          </div>
        </label>
        <!-- <template v-if="$form.password?.invalid"> -->
        <!-- <Message
          v-for="(error, index) of $form.login?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        > -->
        <!-- </template> -->
      </div>
      <div class="flex flex-col gap-1">
        <label>
          Телефон
          <InputText id="phone" name="phone" placeholder="Телефон" :feedback="false" fluid />
        </label>
        <label>
          Почта
          <InputText id="email" name="email" placeholder="Почта" :feedback="false" fluid />
        </label>
        <!-- <Password id="password" name="password" placeholder="Пароль" :feedback="false" fluid /> -->
        <!-- <template v-if="$form.password?.invalid"> -->
        <!-- <Message
          v-for="(error, index) of $form.password?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message> -->
        <!-- </template> -->
      </div>
      <Button type="submit" severity="secondary" label="Сохранить" />
    </Form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ id: '', name: '', address: '', zip: '', city: '', phone: '', email: '' })
  }
})

const emit = defineEmits(['save', 'cancel'])

// const localSelectedAuthor = ref(props.selectedAuthor)e
const initialValues = ref(props.user)

// Слежение за изменением selectedAuthor из родителя
watch(
  () => props.user,
  (val) => {
    initialValues.value = val
  }
)

const onFormSubmit = async (c, form) => {
  console.log(c, form)

  if (!c.valid) return

  // FIXME
  const states = c.states
  const user = {
    name: states.name.value,
    address: states.address.value,
    zip: states.zip.value,
    city: states.city.value,
    phone: states.phone.value,
    email: states.email.value
  }

  try {
    const id = initialValues.value.id
    if (!id) {
      const res = await api.post('customers', user)
      emit('save', res.data)
      return
    }
    const res = await api.put(`customers/${id}`, user)
    emit('save', res.data)
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
/* Добавьте ваши стили */
</style>
