<template>
  <div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
      v-slot="$form"
      :initialValues="form"
      @submit="(e) => onSave(e, $form)"
      class="flex flex-col gap-4 w-full"
    >
      {{ console.log(form) }}
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
              <InputText type='date' id="endDate" name="endDate" required placeholder="Дата окончания" />
            </div>
          </label>
      </div>
      <Button type="submit" label="Сохранить" />
    </Form>
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
  startDate: props.exhibition.startDate || new Date().toISOString().split('T')[0],
  endDate: props.exhibition.endDate || new Date().toISOString().split('T')[0]
})

const books = ref([]) // Список книг
const selectedBook = ref(null) // Выбранная книга для удаления
const rowsPerPage = 10
const currentPage = ref(1)

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

  try {
    const res = await api.post(`exhibitions`, {
      ...data,
      books: []
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
</style>
