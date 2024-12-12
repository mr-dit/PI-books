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
          @row-select="onSelectExhibition"
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
                />
              </span>
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
        <Button class="w-[150px]" :disabled="!selectedRow" @click="editExhibition">
          Редактировать
        </Button>
        <Button class="w-[150px]" :disabled="!selectedRow" @click="deleteExhibition">
          Удалить
        </Button>
      </div>
    </div>
    <!-- Модальное окно для просмотра выставки -->
    <Dialog v-model:visible="isDialogVisible" modal header="Информация о выставке">
      <add-book-in-exh></add-book-in-exh>
      <!-- <ExhibitionInfo :exhibition="selectedRow" v-model:selectedRow="selectedRow" /> -->
      <template #footer>
        <Button
          label="Закрыть"
          @click="isDialogVisible = false"
          class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="isEditDialogVisible"
      modal
      header="Редактирование выставки"
      :style="{ width: '30rem' }"
    >
      <ExhibitionEdit :exhibition="selectedRow" v-model:selectedRow="selectedRow" />
      <template #footer>
        <Button
          label="Закрыть"
          @click="isEditDialogVisible = false"
          class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'
import ExhibitionInfo from '@/components/ExhibitionInfo'
import AddBookInExh from '@/components/AddBookInExh'
import ExhibitionEdit from '@/components/ExhibitionEdit/ExhibitionEdit.vue'

const props = defineProps({
  book: {
    type: Object,
    default: () => ({
      title: '',
      firstPublishDate: '',
      description: '',
      authors: '',
      subjects: () => [],
      authors: () => []
    })
  }
})

const dialogHeader = ref('')
const data = ref([]) // Полный список выставок
const selectedRow = ref(null) // Выбранная выставка
const rowsPerPage = 10
const currentPage = ref(1)

const totalPages = ref(Math.ceil(data.value.length / rowsPerPage))

const onSearch = async (filters) => {
  console.log(filters)
  await fetchExhibitions(undefined, filters)
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
  const val = e.target.value
  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
  }
}

const goToPage = async (e) => {
  const val = e.target.value
  if (val > 0 && val <= totalPages.value) {
    currentPage.value = val
    await fetchExhibitions()
  }
}

// Получение выставок
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
    const page = res.data.page
    totalPages.value = page.totalPages
    const content = res.data.content.map((item) => ({
      ...item,
      books: item.books.map((book) => ({
        ...book,
        authorsString: book.authors.map((author) => author.name).join(', ')
      }))
    }))
    data.value = content
  } catch (e) {
    console.log(e)
  }
}

fetchExhibitions()

const deleteExhibition = async () => {
  try {
    await api.delete(`exhibitions/${selectedRow.value.id}`)
    await fetchExhibitions()
  } catch (e) {
    console.log(e)
  }
}

// Обработчик выбора выставки
const onSelectExhibition = (event) => {
  selectedRow.value = event.data
}

// Открытие модального окна
const isDialogVisible = ref(false)
const isEditDialogVisible = ref(false)

const viewExhibition = async () => {
  if (!selectedRow.value) return

  try {
    // const response = await api.get(`/exhibitions/${selectedRow.value.id}/books`)
    // selectedRow.value.books = response.data // Добавляем книги в выбранную выставку
    isDialogVisible.value = true // Открытие модального окна
  } catch (error) {
    console.error('Ошибка при загрузке книг выставки:', error)
  }
}

const editExhibition = () => {
  if (!Object.keys(selectedRow.value).length) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Выставка не выбрана',
      life: 4000
    })
    return
  }

  isEditDialogVisible.value = true
  dialogHeader.value = 'Редактирование выставки'
}
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
