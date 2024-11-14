<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <div class="w-1/4 h-full p-4 bg-gray-100 border-r border-gray-300 overflow-y-auto">
      <h2 class="font-bold text-lg mb-4">Поиск книг</h2>
      <div class="mb-4">
        <label for="title" class="block font-semibold">Заголовок</label>
        <InputText id="title" v-model="searchCriteria.title" class="w-full" />
      </div>
      <div class="mb-4">
        <label for="author" class="block font-semibold">Автор</label>
        <InputText id="author" v-model="searchCriteria.author" class="w-full" />
      </div>
      <div class="mb-4">
        <label for="genre" class="block font-semibold">Жанр</label>
        <InputText id="genre" v-model="searchCriteria.genre" class="w-full" />
      </div>
      <Button label="Поиск" icon="pi pi-search" @click="performSearch" class="w-full" />
    </div>

    <!-- Результаты поиска и подробная информация -->
    <div class="w-3/4 h-full p-4 flex flex-col">
      <h2 class="font-bold text-lg mb-4">Результаты поиска</h2>

      <!-- Таблица с результатами -->
      <DataTable
        :value="books"
        tableStyle="min-width: 50rem"
        :paginator="true"
        :rows="rowsPerPage"
        scrollable
        scrollHeight="85%"
        :first="firstRow"
        @page="onPageChange"
        selectionMode="single"
        :selection="selectedBook"
        @selection-change="onSelectBook"
        class="flex-grow mb-4"
        style="min-height: 0"
      >
        <Column field="title" header="Название"></Column>
        <Column field="authors" header="Авторы"></Column>
        <template #footer>
          <div class="flex items-center gap-2 mb-4">
            Страница
            <Button icon="pi pi-chevron-left" @click="previousPage" :disabled="currentPage <= 1"
              ><</Button
            >
            <span>
              <InputText
                type="number"
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

      <!-- Подробная информация о книге -->
      <BookForm></BookForm>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { data } from './data'
import BookForm from '@/components/BookForm'

const searchCriteria = ref({ title: '', author: '', genre: '' })
const selectedBook = ref(null)
const rowsPerPage = 50
const currentPage = ref(1)
// const currentPage = ref('')

// Моковые данные книг
const books = ref(data)

const totalPages = computed(() => Math.ceil(books.value.length / rowsPerPage))

// Фильтрация книг по критериям поиска
const filteredBooks = computed(() =>
  books.value.filter(
    (book) =>
      (!searchCriteria.value.title ||
        book.title.toLowerCase().includes(searchCriteria.value.title.toLowerCase())) &&
      (!searchCriteria.value.author ||
        book.authors.some((author) =>
          author.toLowerCase().includes(searchCriteria.value.author.toLowerCase())
        )) &&
      (!searchCriteria.value.genre ||
        book.genre.toLowerCase().includes(searchCriteria.value.genre.toLowerCase()))
  )
)

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

function onPageChange(event) {
  currentPage.value = event.page + 1
}

function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const validatePagination = (e) => {
  console.log(e)

  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
  }
}

function goToPage(e) {
  console.log(e.target.value)
  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
  }
}

function onSelectBook(book) {
  selectedBook.value = book
}

function performSearch() {
  currentPage.value = 1
}
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
</style>
