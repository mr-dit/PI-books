<template>
  <div class="h-screen w-screen flex overflow-auto">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch">
      <template #footer>
        <div class="flex justify-end flex-col">
          <Button label="Редактировать" @click="onEditUser" />
        </div>
      </template>
    </FilterMenu>
    <div class="w-3/4 h-full p-4 flex flex-col">
      <div class="rounded-lg p-4 shadow-md">
        <h3 class="font-bold text-lg mb-4">Список выставок</h3>
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
          <Column field="name" header="Название" sortable></Column>
          <Column field="startDate" header="Дата начала" sortable></Column>
          <Column field="endDate" header="Дата окончания" sortable></Column>
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
      </div>
      <div class="flex flex-row gap-2 mt-4">
        <Button class="w-[150px]" :disabled="!selectedRow" @click="viewExhibition">
          Просмотреть
        </Button>
        <Button class="w-[150px]" :disabled="!canReturn" @click="returnBook">
          Редактировать
        </Button>
        <Button class="w-[150px]" :disabled="!canReturn" @click="returnBook"> Удалить </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'
import ExhibitionInfo from '@/components/ExhibitionInfo/ExhibitionInfo.vue'

const data = ref([]) // Полный список выставок
const filteredExhibitions = ref([]) // Отфильтрованные выставки
const selectedExhibition = ref(null)
const filters = ref({
  name: '',
  startDate: '',
  endDate: ''
}) // Фильтры для поиска
const isBookModalVisible = ref(false) // Видимость модального окна книги
const books = ref([]) // Книги, относящиеся к выбранной выставке

const selectedRow = ref(null)
const rowsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(data.value.length / rowsPerPage))

const onSearch = async (data) => {
  console.log(data)
  await fetchExhibitions(undefined, data)
}

// Логика для страницы и пагинации
const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

const onPageChange = (event) => {
  currentPage.value = event.page + 1
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchExhibitions()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchExhibitions()
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
    await fetchExhibitions()
  }
}

// Логика фильтрации
const applyFilters = () => {
  filteredExhibitions.value = exhibitions.value.filter((exhibition) => {
    const nameMatch =
      !filters.value.name ||
      exhibition.name.toLowerCase().includes(filters.value.name.toLowerCase())
    const startDateMatch =
      !filters.value.startDate ||
      new Date(exhibition.startDate) >= new Date(filters.value.startDate)
    const endDateMatch =
      !filters.value.endDate || new Date(exhibition.endDate) <= new Date(filters.value.endDate)
    return nameMatch && startDateMatch && endDateMatch
  })
}

// Выбор выставки
const viewExhibition = async () => {
  if (!selectedRow.value) return

  try {
    const response = await api.get(`/exhibitions/${selectedRow.value.id}/books`)
    const books = response.data
    selectedBook.value = books[0] // Выберите первую книгу для примера
    isBookModalVisible.value = true
  } catch (error) {
    console.error('Ошибка при загрузке книг выставки:', error)
  }
}

const fetchExhibitions = async (
  pagination = { page: currentPage.value - 1, size: rowsPerPage },
  params = {}
) => {
  let url = 'exhibitions' + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    const content = res.data.content.map((item) => ({
      ...item
    }))
    data.value = content
  } catch (e) {
    console.log(e)
  }
}

fetchExhibitions()
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
