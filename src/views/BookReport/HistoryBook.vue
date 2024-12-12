<template>
  <div>
    <div class="flex flex-col mb-4">
      <label for="book-id" class="mb-2">Идентификатор книги</label>
      <InputText
        id="book-id"
        v-model="bookId"
        class="p-2 border rounded-lg"
        placeholder="Введите идентификатор книги"
        @input="fetchBookHistory"
      />
    </div>
    <!-- Информация о книге -->
    <div v-if="bookInfo" class="mb-4">
      <h3 class="text-xl font-semibold">{{ bookInfo.title }}</h3>
      <p class="text-gray-500">{{ bookInfo.subtitle }}</p>
    </div>
    <div v-else class="mb-4 text-red-500">Книга не найдена</div>

    <div class="flex justify-end mb-4">
      <Button class="w-[150px]" label="Экспорт" @click="exportToCSV('history')" />
    </div>
    <DataTable
      :value="history"
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
      <Column field="customerName" header="Клиент" sortable></Column>
      <Column field="dateOfIssue" header="Дата выдачи" sortable></Column>
      <Column field="returnDate" header="Дата сдачи" sortable>
        <template #body="slotProps">
          <span
            v-if="new Date(slotProps.data.returnDate) > new Date(slotProps.data.returnDueDate)"
            class="text-red-500 font-bold"
          >
            {{ slotProps.data.returnDate }}
          </span>
          <span v-else>
            {{ slotProps.data.returnDate }}
          </span>
        </template>
      </Column>
      <template v-if="totalPages > 1" #footer>
        <div class="flex items-center gap-2 mb-4">
          Страница
          <Button icon="pi pi-chevron-left" @click="previousPage" :disabled="currentPage <= 1"
            >></Button
          >
          <span>
            <InputText
              type="number"
              :value="currentPage"
              @input="validatePagination"
              @keydown.enter="goToPage"
              class="w-20"
          /></span>
          <Button icon="pi pi-chevron-right" @click="nextPage" :disabled="currentPage >= totalPages"
            >></Button
          >
          из {{ totalPages }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import api from '@/api'
import { debounce } from 'vue-debounce'

const bookId = ref('')
const bookInfo = ref(null)
const history = ref([])
const sortField = ref('dateOfIssue')
const sortOrder = ref(-1)

const selectedRow = ref(null)
const rowsPerPage = 50
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(history.value.length / rowsPerPage))

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

function onPageChange(event) {
  currentPage.value = event.page + 1
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchHistories()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchHistories()
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
    await fetchHistories()
  }
}
// ----------------------------

const fetchBookHistory = debounce(async () => {
  try {
    const res = await api.get(`books/${bookId.value}`)
    bookInfo.value = res.data
    await fetchHistories()
  } catch (e) {
    bookInfo.value = null
    history.value = []
    console.log(e)
  }
}, 400)

// Функция экспорта в CSV
const exportToCSV = async () => {
  const res = await api.get(`history-export/${bookId.value}/book-history?bookId=${bookId.value}`, {
    responseType: 'blob'
  })

  const blob = new Blob([res.data])

  const headers = res.headers['content-disposition']
  const filename = bookInfo.value.title + headers.split(';')[1].split('=')[1]
  // const blob = new Blob([res.data], { type: filename.split('.')[1] })
  // const filename = `${type}_report.csv`
  saveAs(blob, filename)
}

// Сортировка
const onSort = (event) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
}

const fetchHistories = async (
  pagination = { page: currentPage.value - 1, size: rowsPerPage },
  params = {}
) => {
  let url =
    `history/${bookId.value}/book-history` + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    console.log(res)
    const page = res.data.page
    totalPages.value = page.totalPages
    history.value = res.data.content
  } catch (e) {
    console.log(e)
  }
}
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
