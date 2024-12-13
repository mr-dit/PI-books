<template>
  <div class="h-screen w-screen flex flex-col">
    <h2 class="text-lg font-bold mb-4">Отчеты</h2>
    <div>
      <TabView>
        <!-- Вкладка Напоминание -->
        <TabPanel header="Напоминание">
          <div class="flex justify-end mb-4">
            <Button class="w-[150px]" label="Экспорт" @click="exportToCSV('reminders')" />
          </div>
          <DataTable
            :value="reminders"
            :paginator="true"
            scrollable
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="onSort"
            tableStyle="min-width: 50rem"
            :rows="rowsPerPage"
            scrollHeight="95%"
            :first="firstRow"
            @page="onPageChange"
            class="flex-grow mb-4"
            :style="{ 'min-height': 0, 'min-width': 'auto' }"
          >
            <Column field="title" header="Название" sortable></Column>
            <Column field="customerName" header="Клиент" sortable></Column>
            <Column field="dateOfIssue" header="Дата выдачи" sortable></Column>
            <Column field="returnDueDate" header="Срок сдачи" sortable></Column>
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
        </TabPanel>

        <!-- Вкладка История выдачи книги -->
        <TabPanel header="История выдачи книги">
          <HistoryBook />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import api from '@/api'
import HistoryBook from './HistoryBook.vue'

const sortField = ref('dateOfIssue')
const sortOrder = ref(-1)

const rowsPerPage = 50
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(reminders.value.length / rowsPerPage))

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

function onPageChange(event) {
  currentPage.value = event.page + 1
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchReminders()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchReminders()
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
    await fetchReminders()
  }
}
// ----------------------------

const reminders = ref([])

// Функция экспорта в CSV
const exportToCSV = async () => {
  const res = await api.get(`history-export/reminders`, { responseType: 'blob' })

  const blob = new Blob([res.data])

  const headers = res.headers['content-disposition']
  const filename = headers.split(';')[1].split('=')[1]
  // const blob = new Blob([res.data], { type: filename.split('.')[1] })
  // const filename = `${type}_report.csv`
  saveAs(blob, filename)
}

// Сортировка
const onSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
}

const fetchReminders = async (
  pagination = { page: currentPage.value - 1, size: rowsPerPage },
  params = {}
) => {
  let url = 'history/reminders' + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    console.log(res)
    const page = res.data.page
    totalPages.value = page.totalPages
    reminders.value = res.data.content
  } catch (e) {
    console.log(e)
  }
}

fetchReminders()
</script>

<style scoped>
input {
  width: 100%;
  max-width: 400px;
}

.h-screen {
  padding: 20px;
}

:deep(.p-datatable-paginator-bottom) {
  display: none;
}
</style>
