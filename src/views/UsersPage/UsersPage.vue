<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch">
      <template #footer>
        <div class="flex justify-between gap-2">
          <Button label="Редактировать" @click="onEditUser" />
          <Button label="Добавить" @click="onAddUser" />
        </div>
      </template>
    </FilterMenu>

    <!-- Результаты поиска и подробная информация -->
    <div class="card w-3/4 h-full p-4 flex flex-col">
      <h2 class="font-bold text-lg mb-4">Результаты поиска</h2>

      <!-- Таблица с результатами -->
      <DataTable
        :value="data"
        tableStyle="min-width: 50rem"
        scrollable
        scrollHeight="95%"
        :first="firstRow"
        @page="onPageChange"
        selectionMode="single"
        v-model:selection="selectedRow"
        @row-select="onSelectBook"
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
  </div>
  <Dialog
    v-model:visible="isDialogVisible"
    modal
    :header="dialogHeader"
    :style="{ width: '30rem' }"
  >
    <UserModal :user="selectedRow" @save="onUserSave" />
    <!-- <template #footer>
      <Button
        label="Закрыть"
        @click="isDialogVisible = false"
        class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
      />
    </template> -->
  </Dialog>
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
import UserModal from '@/components/UserModal'

// const currentPage = ref('')

const isDialogVisible = ref(false)
const dialogHeader = ref('Создание клиента')

// Моковые данные книг
const data = ref([])

const onSearch = async (data) => {
  console.log(data)
  await fetchUsers(undefined, data)
}

// Логика для страницы и пагинации
const selectedRow = ref(null)
const rowsPerPage = 5
const currentPage = ref(1)

const totalPages = ref(Math.ceil(data.value.length / rowsPerPage))

const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

function onPageChange(event) {
  currentPage.value = event.page + 1
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchUsers()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchUsers()
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
    await fetchUsers()
  }
}
// ------------

function onSelectBook(book) {
  selectedRow.value = book.data
}

function performSearch() {
  currentPage.value = 1
}

const onEditUser = () => {
  isDialogVisible.value = true
  dialogHeader.value = 'Редактирование клиента'
}
const onAddUser = () => {
  selectedRow.value = {}
  isDialogVisible.value = true
  dialogHeader.value = 'Создание клиента'
}
const onUserSave = async () => {
  isDialogVisible.value = false
  await fetchUsers()
}

const fetchUsers = async (
  pagination = { page: currentPage.value - 1, size: rowsPerPage, sort: 'id,asc' },
  params = {}
) => {
  let url = 'customers' + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    console.log(res)
    const page = res.data.page
    totalPages.value = page.totalPages
    data.value = res.data.content
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
