<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch" />

    <!-- Результаты поиска и подробная информация -->
    <div class="w-3/4 h-full p-4 flex flex-col">
      <h2 class="font-bold text-lg mb-4">Результаты поиска</h2>

      <!-- Таблица с результатами -->
      <DataTable
        :value="data"
        tableStyle="min-width: 50rem"
        scrollable
        scrollHeight="85%"
        :first="firstRow"
        @page="onPageChange"
        selectionMode="single"
        v-model:selection="selectedRow"
        @row-select="onSelectBook"
        class="flex-grow mb-4"
        :style="{ 'min-height': 0, 'min-width': 'auto' }"
      >
        <Column field="title" header="Название"></Column>
        <Column field="authorsString" header="Авторы"></Column>
        <template v-if="totalPages > 1" #footer>
          <div class="flex items-center gap-2 mb-4">
            Страница
            <Button icon="pi pi-chevron-left" @click="previousPage" :disabled="currentPage <= 1"
              ><</Button
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

      <!-- Подробная информация о книге -->
      <BookForm v-if="hasBookForm" :book="bookForm"></BookForm>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { inputs } from './data'
import BookForm from '@/components/BookForm'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const selectedRow = ref(null)
const rowsPerPage = 50
const currentPage = ref(1)
// const currentPage = ref('')

// Моковые данные книг
const data = ref([])

const totalPages = ref(Math.ceil(data.value.length / rowsPerPage))
const hasBookForm = computed(() => Object.keys(bookForm.value).length > 0)

const onSearch = async (data) => {
  console.log(data)
  await fetchBooks(undefined, data)
}

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

const onPageChange = (event) => {
  currentPage.value = event.page + 1
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
// ------------
const bookForm = ref({})

const onSelectBook = async (book) => {
  console.log(book.data)
  const data = book.data

  selectedRow.value = data

  const res = await api.get(`books/${data.id}`)
  bookForm.value = res.data
}

function performSearch() {
  currentPage.value = 1
}

const fetchBooks = async (
  pagination = { page: currentPage.value - 1, size: rowsPerPage },
  params = {}
) => {
  let url = 'books' + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    const content = res.data.content.map((item) => ({
      ...item,
      authorsString: item.authors.map((author) => author.name).join(', ')
    }))
    data.value = content
    const page = res.data.page
    totalPages.value = page.totalPages
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
