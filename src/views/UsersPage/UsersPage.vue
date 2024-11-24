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
        :style="{ 'min-height': 0, 'min-width': 'auto' }"
      >
        <Column field="id" header="Код"></Column>
        <Column field="name" header="Имя"></Column>
        <Column field="address" header="Адрес"></Column>
        <Column field="zip" header="Индекс"></Column>
        <Column field="city" header="Город"></Column>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'

const selectedBook = ref(null)
const rowsPerPage = 50
const currentPage = ref(1)
// const currentPage = ref('')

// Моковые данные книг
const data = ref([])

const totalPages = computed(() => Math.ceil(data.value.length / rowsPerPage))

const onSearch = async (data) => {
  console.log(data)
  await fetchUsers({ page: currentPage.value, size: rowsPerPage }, data)
}

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

function onPageChange(event) {
  currentPage.value = event.page + 1
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchUsers({ page: currentPage.value, size: rowsPerPage })
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchUsers({ page: currentPage.value, size: rowsPerPage })
  }
}

const validatePagination = (e) => {
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
    await fetchUsers({ page: currentPage.value, size: rowsPerPage })
  }
}
// ------------

function onSelectBook(book) {
  selectedBook.value = book
}

function performSearch() {
  currentPage.value = 1
}

const fetchUsers = async (
  pagination = { page: currentPage.value, size: rowsPerPage },
  params = {}
) => {
  let url = 'customers'

  if (Object.keys(params).length > 0) {
    url += `?${new URLSearchParams(params).toString()}`
  }
  url += `?${new URLSearchParams(pagination).toString()}`

  try {
    const res = await api.get(url)
    data.value = res.data
  } catch (e) {
    console.log(e)
  }
}

fetchUsers()
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
