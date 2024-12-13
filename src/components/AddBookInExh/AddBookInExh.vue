<template>
  <div class="p-4 flex">
    <FilterMenu :inputs="inputs" @search="onSearch" />
    <!-- Результаты поиска -->
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
        v-model:selection="selectedRows"
        dataKey="id"
        @row-select="onSelectBook"
        class="flex-grow mb-4"
        :style="{ 'min-height': 0, 'min-width': 'auto' }"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="title" header="Название"></Column>
        <Column field="authorsString" header="Авторы"></Column>
        <template #footer>
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
      <Button
        label="Обновить книги"
        @click="onAddBooks"
        class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
      />
      <!-- Подробная информация о книге -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  exhibition: {
    type: Object,
    default: () => {}
  },
  usedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save', 'cancel'])

const selectedRows = ref(props.usedRows)
const rowsPerPage = 5
const currentPage = ref(1)
// const currentPage = ref('')

// Моковые данные книг
const data = ref([])

const totalPages = ref(Math.ceil(data.value.length / rowsPerPage))
const hasBookForm = computed(() => Object.keys(bookForm.value).length > 0)

const onSearch = async (data) => {
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
  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
  }
}

const goToPage = async (e) => {
  const val = e.target.value

  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
    await fetchBooks()
  }
}
// ------------
const bookForm = ref({})

const onSelectBook = async (book) => {
  const data = book.data

  selectedRows.value.push(data)

  // const res = await api.get(`books/${data.id}`)
  // bookForm.value = res.data
}

function performSearch() {
  currentPage.value = 1
}

const onAddBooks = async () => {
  // if (selectedRows.value.length === 0) {
  //   toast.add({
  //     severity: 'error',
  //     summary: 'Ошибка',
  //     detail: 'Выберите книги',
  //     life: 3000
  //   })
  //   return
  // }

  const data = {
    ...props.exhibition,
    endDate: props.exhibition.endDate + 'T00:00:01',
    startDate: props.exhibition.startDate + 'T00:00:00'
  }

  const uniqBooks = selectedRows.value.filter((book, index, self) => {
    return self.findIndex((b) => b.id === book.id) === index
  })

  try {
    const res = await api.put(`exhibitions/${props.exhibition.id}`, {
      ...data,
      books: uniqBooks.map((book) => ({ book: { id: book.id } }))
    })
    emit('save', { books: res.data.books })
    console.log(res)
  } catch (e) {
    console.log(e)
  }
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
