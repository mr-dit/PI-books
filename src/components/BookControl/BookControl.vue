<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch">
      <template #footer>
        <div class="flex justify-end flex-col">
          <textarea class="mb-4"></textarea>
          <Button label="Редактировать" @click="onEditUser" />
        </div>
      </template>
    </FilterMenu>

    <div class="card w-3/4 h-full p-4 flex flex-col">
      <div class="border rounded-lg p-4 shadow-md">
      <h3 class="text-lg font-semibold mb-2">Issue / Return</h3>
      <p class="text font-semibold mb-2">Book ID</p>
      <div class="flex flex-col gap-2">
        <input
          v-model="bookId"
          @input="validateBook"
          class="input-text"
          placeholder="Enter Book ID"
        />
        <p v-if="bookTitle" class="text-gray-600">
          <strong>Title:</strong> {{ bookTitle }}
        </p>
        <div class="flex flex-col gap-2 mt-4">
          <button class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" :disabled="!canIssue" @click="issueBook">
            Issue
          </button>
          <button class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" :disabled="!canReturn" @click="returnBook">
            Return
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <div class="border rounded-lg p-4 shadow-md">
        <h4 class="text-lg font-semibold mb-2">Current Issues</h4>
        <DataTable
          :value="currentIssues"
          tableStyle="min-width: 50rem"
          :paginator="true"
          :rows="5"
          scrollable
          scrollHeight="300px"
          selectionMode="single"
          :selection="selectedIssue"
          @selection-change="onSelectIssue"
          class="mb-4"
        >
        <Column field="id" header="Название"></Column>
        <Column field="name" header="Дата выдачи"></Column>
        <Column field="address" header="Вернуть до"></Column>
        </DataTable>
      </div>
      <button class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" @click="renewBook">Renew</button>
    </div>

    <div class="border rounded-lg p-4 shadow-md mt-4">
        <h4 class="text-lg font-semibold mb-2">History</h4>
        <DataTable
          :value="histories"
          tableStyle="min-width: 50rem"
          :paginator="true"
          :rows="5"
          scrollable
          scrollHeight="300px"
          selectionMode="single"
          :selection="selectedHistory"
          @selection-change="onSelectHistory"
          class="mb-4"
        >
          <Column field="id" header="Название"></Column>
          <Column field="name" header="Дата выдачи"></Column>
          <Column field="address" header="Вернуть до"></Column>
        </DataTable>
      </div>
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

const selectedRow = ref(null)
const rowsPerPage = 50
const currentPage = ref(1)
// const currentPage = ref('')

const isDialogVisible = ref(false)
const dialogHeader = ref('Создание клиента')

// Моковые данные книг
const data = ref([])

const totalPages = computed(() => Math.ceil(data.value.length / rowsPerPage))

const onSearch = async (data) => {
  console.log(data)
  await fetchUsers(undefined, data)
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
