<template>
  <div class="p-4 flex">
    <Form
      v-slot="$form"
      :initialValues="form"
      @submit="(e) => onSave(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      <div class="w-3/4 h-full gap-4 p-4 flex flex-col">
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
        </label>
        <label>
          Дата начала
          <div class="flex gap-1">
            <InputText
              id="startDate"
              type='date'
              name="startDate"
              placeholder="Дата начала"
              required
              :feedback="false"
              fluid
            />
          </div>
        </label>
        <label>
          Дата окончания
          <div class="flex gap-1">
            <InputText
              id="endDate"
              type='date'
              name="endDate"
              placeholder="Дата окончания"
              required
              :feedback="false"
              fluid
            />
          </div>
        </label>
        <Button type="submit" label="Сохранить" />
      </div>
    </Form>
    <div class="w-3/4 h-full p-4 flex flex-col">
      <h3 class="font-bold text-lg mb-4">Книги на выставке</h3>
      {{ console.log(newBook) }}
      <DataTable
        :value="newBook"
        :rows="5"
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
              <InputText
                type="number"
                :disabled="totalPages <= 1"
                :value="currentPage"
                @input="validatePagination"
                @keydown.enter="goToPage"
                class="w-20"
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

const props = defineProps({
  exhibition: Object, // Принимаем выставку как prop
  newBook: Array
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  name: props.exhibition.name || '',
  description: props.exhibition.description || '',
  startDate: props.exhibition.startDate || '',
  endDate: props.exhibition.endDate || ''
})

const books = ref([]) // Список книг
const selectedBook = ref(props.newBook) // Выбранная книга для удаления
const rowsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(Math.ceil(books.value.length / rowsPerPage))

const validatePagination = (e) => {
  console.log(e)

  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
  }
}

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
    console.error('Ошибка при загрузке книг:', error)
  }
}

const onPageChange = (event) => {
  currentPage.value = event.page + 1
  fetchBooks()
}

const deleteBook = async (book) => {
  if (confirm(`Вы уверены, что хотите удалить книгу "${book.title}" из выставки?`)) {
    try {
      await api.delete(`/exhibitions/${props.exhibition.id}/books/${book.id}`)
      fetchBooks()
    } catch (error) {
      console.error('Ошибка при удалении книги:', error)
    }
  }
}

// Кнопка для удаления книги
const deleteButton = (rowData) => {
  return {
    template: `
    <Button
        icon="pi pi-trash"
        class="p-button-danger"
        @click="deleteBook(rowData)"
    />
    `
  }
}

// Сохранить изменения в выставке
const onSave = async (c, form) => {
  //   const updatedExhibition = {
  //     ...form.value,
  //     books: books.value.map((book) => book.id) // Сохраняем только ID книг
  //   }

  //   try {
  //     await api.put(`/exhibitions/${props.exhibition.id}`, updatedExhibition)
  //     emit('save', updatedExhibition)
  //     closeDialog()
  //   } catch (error) {
  //     console.error('Ошибка при сохранении выставки:', error)
  //   }
  const states = c.states

  const data = {
    name: states.name.value,
    description: states.description.value,
    startDate: states.startDate.value + 'T00:00:00',
    endDate: states.endDate.value + 'T00:00:01'
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
    console.log(e)
  }
}

const closeDialog = () => {
  emit('cancel')
}

fetchBooks()
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
