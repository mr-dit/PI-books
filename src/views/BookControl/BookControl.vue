<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch">
      <template #footer>
        <div class="flex justify-end flex-col">
          <textarea
            v-model="clientInfo"
            class="mb-4 p-2 border rounded-lg w-full h-[300px] resize-none"
            readonly
          ></textarea>
          <Button label="Редактировать" @click="onEditUser" />
        </div>
      </template>
    </FilterMenu>

    <div class="card w-3/4 h-full p-4 flex flex-col">
      <!-- Выдача / Возврат -->
      <div class="border rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2">Выдача и возврат</h3>
        <p class="text font-semibold mb-2">Идентификатор книги</p>
        <div class="flex flex-col gap-2">
          <input
            :value="bookId"
            @input="validateBook"
            class="input-text text-lg"
            placeholder="Введите идентификатор книги"
          />
          <div class="flex justify-between">
            <div>
              <span v-if="bookTitle">Название: {{ bookTitle }}</span>
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <Button class="w-[150px]" :disabled="!canIssue" @click="issueBook"> Выдать </Button>
              <Button class="w-[150px]" :disabled="!canReturn" @click="returnBook">
                Вернуть
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Таблицы -->
      <div class="flex flex-col gap-4 mt-4">
        <!-- Текущие выдачи -->
        <div class="border rounded-lg p-4 shadow-md">
          <h4 class="text-lg font-semibold mb-2">Текущие выдачи</h4>
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
            <Column field="bookTitle" header="Название"></Column>
            <Column field="dateOfIssue" header="Дата выдачи"></Column>
            <Column field="returnDueDate" header="Срок сдачи"></Column>
          </DataTable>
          <div class="flex flex-col mt-4">
            <Button
              class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded"
              @click="renewBook"
            >
              Обновить
            </Button>
          </div>
        </div>
      </div>

      <!-- История -->
      <div class="border rounded-lg p-4 shadow-md mt-4">
        <h4 class="text-lg font-semibold mb-2">История</h4>
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
          <Column field="bookTitle" header="Название"></Column>
          <Column field="dateOfIssue" header="Дата выдачи"></Column>
          <Column field="returnDate" header="Дата сдачи"></Column>
        </DataTable>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="isDialogVisible"
    modal
    header="Редактирование пользователя"
    :style="{ width: '30rem' }"
  >
    <UserModal :user="selectedClient" @save="onUserSave" />
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
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'
import { debounce } from 'vue-debounce'

const histories = ref([])
const bookTitle = ref('')
const isDialogVisible = ref(false)
const currentIssues = ref([]) // Текущие выдачи
const clientInfo = ref('') // Информация о клиенте
const selectedClient = ref(null) // Выбранный клиент
const bookId = ref('') // ID книги

const findIssue = computed(() =>
  currentIssues.value.find((issue) => issue.bookTitle === bookTitle.value)
)

const canIssue = computed(() => bookTitle.value !== '' && !findIssue.value)
const canReturn = computed(() => bookTitle.value !== '' && !canIssue.value)

const updateHistories = async (id = selectedClient.value.id) => {
  if (!id) return

  try {
    const resIssues = await fetchCurrIssues(id)
    currentIssues.value = resIssues

    const resHistories = await fetchCustomerHistory(id)
    histories.value = resHistories
  } catch (error) {
    console.error('Ошибка обновления истории:', error)
  }
}

const onSearch = async (searchParams) => {
  try {
    await updateHistories(searchParams.id)

    const { data } = await api.get('customers' + `?${new URLSearchParams(searchParams).toString()}`)
    if (data && data.content.length > 0) {
      selectedClient.value = data.content[0] // Выбираем первого клиента из результатов поиска
      updateClientInfo(selectedClient.value) // Обновляем данные клиента в textarea
    } else {
      clientInfo.value = 'Клиент не найден.'
    }
  } catch (error) {
    console.error('Ошибка поиска клиента:', error)
    clientInfo.value = 'Произошла ошибка при поиске клиента.'
  }
}

// Обновление данных клиента в textarea
const updateClientInfo = (client) => {
  if (client) {
    clientInfo.value = `
Имя: ${client.name}
Идентификатор: ${client.id}
Адрес: ${client.address}
Индекс: ${client.zip}
Город: ${client.city}
    `.trim()
  } else {
    clientInfo.value = 'Информация о клиенте недоступна.'
  }
}

// Простая валидация для книги
const validateBook = debounce(async (e) => {
  const val = e.target.value
  bookId.value = val

  try {
    const res = await api.get(`books/${val}`)
    bookTitle.value = res.data.title
  } catch (e) {
    bookTitle.value = ''
    console.log(e)
  }
}, 400)

const onUserSave = async (data) => {
  updateClientInfo(data)
  isDialogVisible.value = false
  //  TODO
}
const onEditUser = () => {
  isDialogVisible.value = true
}

const issueBook = async () => {
  try {
    const res = await api.post(`history/make-issue/${selectedClient.value.id}/${bookId.value}`)
    await updateHistories()
  } catch (e) {
    console.log(e)
  }
}

const returnBook = async () => {
  const id = findIssue.value.id
  if (!id) return

  try {
    const res = await api.put(`history/make-return/${id}`)

    await updateHistories()
  } catch (e) {
    console.log(e)
  }
}

const fetchCurrIssues = async (
  id,
  // pagination = { page: currentPage.value - 1, size: rowsPerPage, sort: 'id,asc' },
  params = {}
) => {
  let url = `history/${id}/current_issue`
  // + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    console.log(res)
    // const page = res.data.page
    // totalPages.value = page.totalPages
    return res.data.content
  } catch (e) {
    console.log(e)
  }
}

const fetchCustomerHistory = async (
  id,
  // pagination = { page: currentPage.value - 1, size: rowsPerPage, sort: 'id,asc' },
  params = {}
) => {
  let url = `history/customerHistory/${id}`
  // + `?${new URLSearchParams(pagination).toString()}`

  if (Object.keys(params).length > 0) {
    url += `&${new URLSearchParams(params).toString()}`
  }

  try {
    const res = await api.get(url)
    console.log(res)
    // const page = res.data.page
    // totalPages.value = page.totalPages
    return res.data.content
  } catch (e) {
    console.log(e)
  }
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
