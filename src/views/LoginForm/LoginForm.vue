<template>
  <div class="card flex justify-center">
    <Form
      v-slot="$form"
      :resolver
      :initialValues
      @submit="(e) => onFormSubmit(e, $form)"
      class="flex flex-col gap-4 w-full sm:w-64"
    >
      <div class="flex flex-col gap-1">
        <InputText id="login" name="login" placeholder="Логин" :feedback="false" fluid />
        <!-- <template v-if="$form.password?.invalid"> -->
        <Message
          v-for="(error, index) of $form.login?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >
        <!-- </template> -->
      </div>
      <div class="flex flex-col gap-1">
        <Password id="password" name="password" placeholder="Пароль" :feedback="false" fluid />
        <!-- <template v-if="$form.password?.invalid"> -->
        <Message
          v-for="(error, index) of $form.password?.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}</Message
        >
        <!-- </template> -->
      </div>
      <Button :disabled="btnDisabled" type="submit" severity="secondary" label="Войти" />
    </Form>
  </div>

  <!-- <div
    class="flex flex-col px-8 py-8 gap-6 rounded-2xl"
    style="
      background-image: radial-gradient(
        circle at left top,
        var(--p-primary-400),
        var(--p-primary-700)
      );
    "
  >
    <div class="inline-flex flex-col gap-2">
      <label for="username" class="text-primary-50 font-semibold">Логин</label>
      <InputText
        id="username"
        class="!bg-white/20 !border-0 !p-4 !text-primary-50 w-80"
        v-model="username"
      ></InputText>
    </div>
    <div class="inline-flex flex-col gap-2">
      <label for="password" class="text-primary-50 font-semibold">Пароль</label>
      <InputText
        id="password"
        class="!bg-white/20 !border-0 !p-4 !text-primary-50 w-80"
        type="password"
        v-model="password"
      ></InputText>
    </div>
    <div class="flex items-center gap-4">
      <Button
        label="Войти"
        @click="onLogin"
        text
        class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"
      ></Button>
    </div>
  </div> -->
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import api from '@/api'

import { Form } from '@primevue/forms'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const authStore = useAuthStore()

const initialValues = ref({
  password: '',
  login: ''
})
const resolver = ref(
  zodResolver(
    z.object({
      password: z.string().min(1, { message: 'Обязательное поле' }),
      // .max(8, { message: 'Maximum 8 characters.' })
      // .refine((value) => /[a-z]/.test(value), {
      //   message: 'Must have a lowercase letter.'
      // })
      // .refine((value) => /[A-Z]/.test(value), {
      //   message: 'Must have an uppercase letter.'
      // })
      // .refine((value) => /d/.test(value), {
      //   message: 'Must have a number.'
      // })
      login: z.string().min(1, { message: 'Обязательное поле' })
    })
  )
)

const btnDisabled = ref(false)
const onFormSubmit = async (c, form) => {
  console.log(c, form)

  if (!c.valid) return
  btnDisabled.value = true
  try {
    const res = await api.post('auth/login', {
      username: c.values.login,
      password: c.values.password
    })
    console.log(res)
    authStore.setAuthenticated(true)
    btnDisabled.value = false
  } catch (e) {
    btnDisabled.value = false
    console.log(e)
    authStore.setAuthenticated(false)
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Неправильный логин или пароль',
      life: 3000
    })
  }
}
</script>

<style lang="scss" scoped></style>
