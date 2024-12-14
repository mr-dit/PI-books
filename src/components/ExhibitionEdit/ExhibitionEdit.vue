<template>
  <div class="p-4 flex">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="form"
      @submit="(e) => onSave(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="h-full gap-4 p-4 flex flex-col">
        <label>
          Название выставки
          <InputText
            id="name"
            name="name"
            placeholder="Название выставки"
            required
            :feedback="false"
            fluid
          />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}</Message>
        </label>
        <label>
          Описание выставки
          <InputText
            id="description"
            name="description"
            placeholder="Описание выставки"
            required
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
          <!-- <InputText
              id="startDate"
              type="date"
              name="startDate"
              placeholder="Дата начала"
              :feedback="false"
              fluid
            /> -->
          <DatePicker
            name="startDate"
            :model-value="$form?.startDate?.value"
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
          <!-- <InputText
              id="endDate"
              type="date"
              name="endDate"
              placeholder="Дата окончания"
              :feedback="false"
              fluid
              /> -->
          <DatePicker
            name="endDate"
            :model-value="$form?.endDate?.value"
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
    <div class="w-3/4 h-full p-4 flex flex-col">
      <h2 class="font-bold text-lg mb-4">Книги на выставке</h2>
      <DataTable
        class="flex flex-col flex-grow mb-4 justify-between w-[40vw] min-h-[500px]"
        :value="newBook"
        scrollable
        scrollHeight="500px"
        tableStyle="min-width: 50rem"
        :first="firstRow"
        @page="onPageChange"
      >
        <Column field="title" header="Название книги" />
        <Column field="authorsString" header="Авторы" />
        <!-- <Column header="Удалить" :body="deleteButton" /> -->
        <template v-if="totalPages > 1" #footer>
          <div class="flex items-center gap-2 mb-4">
            Страница
            <Button icon="pi pi-chevron-left" @click="previousPage" :disabled="currentPage <= 1"
              >></Button
            >
            <span>
              <InputNumber
                v-model="currentPage"
                mode="decimal"
                showButtons
                :min="1"
                :max="totalPages"
                @keydown.enter="goToPage"
                class="!w-20"
                fluid
            /></span>
            <Button
              icon="pi pi-chevron-right"
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              >></Button
            >
            из {{ totalPages }}
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Кнопки управления -->
    <!-- <div class="flex justify-between gap-4">
      <Button label="Сохранить" @click="onSave" />
      <Button label="Закрыть" @click="closeDialog" />
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
        .date({ required_error: 'Дата обязательна', invalid_type_error: 'Дата обязательна' })
        .refine((val) => val !== null, { message: 'Дата обязательна' }),
      endDate: z
        .date({ required_error: 'Дата обязательна', invalid_type_error: 'Дата обязательна' })
        .refine((val) => val !== null, { message: 'Дата обязательна' }),
      name: z.string().min(1, { message: 'Обязательное поле' }),
      description: z.string().min(1, { message: 'Обязательное поле' })
    })
  )
)

const form = ref({
  name: props.exhibition.name || '',
  description: props.exhibition.description || '',
  startDate: new Date(props.exhibition.startDate) || '',
  endDate: new Date(props.exhibition.endDate) || ''
})

const books = ref([]) // Список книг
const rowsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(Math.ceil(books.value.length / rowsPerPage))

const goToPage = async (e) => {
  console.log(e.target.value)
  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
    await fetchBooks()
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchBooks()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchBooks()
  }
}

const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

const fetchBooks = async () => {
  if (!props.exhibition.id) return

  try {
    const response = await api.get(`/exhibitions/${props.exhibition.id}/books`, {
      params: { page: currentPage.value - 1, size: rowsPerPage }
    })
    books.value = response.data.content
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Произошла ошибка, попробуйте еще раз',
      life: 3000
    })
    console.error('Ошибка при загрузке книг:', error)
  }
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  fetchBooks()
}

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

  const uniqBooks = props.newBook.filter((book, index, self) => {
    return self.findIndex((b) => b.id === book.id) === index
  })

  try {
    const res = await api.put(`exhibitions/${props.exhibition.id}`, {
      ...data,
      books: uniqBooks.map((book) => ({ book: { id: book.id } }))
    })
    emit('save')
    console.log(res)
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
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
