<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <!-- Панель поиска -->
    <FilterMenu :inputs="inputs" @search="onSearch">
      <template #footer>
        <div class="flex justify-end flex-col">
          <textarea 
            v-model="clientInfo"
            class="mb-4 p-2 border rounded-lg w-full h-32 resize-none" 
            readonly
          ></textarea>
          <Button label="Редактировать" @click="onEditUser" />
        </div>
      </template>
    </FilterMenu>

    <div class="card w-3/4 h-full p-4 flex flex-col">
      <!-- Выдача / Возврат -->
      <div class="border rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-semibold mb-2">Выдача / Возврат</h3>
        <p class="text font-semibold mb-2">Идентификатор книги</p>
        <div class="flex flex-col gap-2">
          <input
            v-model="bookId"
            @input="validateBook"
            class="input-text"
            placeholder="Введите идентификатор книги"
          />
          <div class="flex flex-col gap-2 mt-4">
            <button 
              class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" 
              :disabled="!canIssue" 
              @click="issueBook"
            >
              Выдать
            </button>
            <button 
              class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" 
              :disabled="!canReturn" 
              @click="returnBook"
            >
              Вернуть
            </button>
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
            <Column field="id" header="Название"></Column>
            <Column field="name" header="Дата выдачи"></Column>
            <Column field="address" header="Срок сдачи"></Column>
          </DataTable>
        </div>
        <button class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded" @click="renewBook">Обновить</button>
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
          <Column field="id" header="Название"></Column>
          <Column field="name" header="Дата выдачи"></Column>
          <Column field="address" header="Срок сдачи"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { inputs } from './data'
import FilterMenu from '@/components/FilterMenu'
import api from '@/api'


const clientInfo = ref(""); // Информация о клиенте
const selectedClient = ref(null); // Выбранный клиент
const bookId = ref(""); // ID книги
const canIssue = computed(() => bookId.value !== ""); // Проверка для выдачи книги
const canReturn = computed(() => bookId.value !== ""); // Проверка для возврата книги

// Обработчик поиска клиента

const onSearch = async (searchParams) => {
  try {
    const response = await api.get("customers", { params: searchParams }); // Запрос к API для получения данных клиентов
    if (response.data && response.data.length > 0) {
      selectedClient.value = response.data[0]; // Выбираем первого клиента из результатов поиска
      updateClientInfo(selectedClient.value); // Обновляем данные клиента в textarea
    } else {
      clientInfo.value = "Клиент не найден.";
    }
  } catch (error) {
    console.error("Ошибка поиска клиента:", error);
    clientInfo.value = "Произошла ошибка при поиске клиента.";
  }
};

// Обновление данных клиента в textarea
const updateClientInfo = (client) => {
  if (client) {
    clientInfo.value = `
Имя: ${client.name}
Идентификатор: ${client.id}
Адрес: ${client.address}
Индекс: ${client.zip}
Город: ${client.city}
    `.trim();
  } else {
    clientInfo.value = "Информация о клиенте недоступна.";
  }
};

// Простая валидация для книги
const validateBook = () => {
  if (bookId.value === "OL76837W") {
    console.log("Книга найдена");
  } else {
    console.log("Книга не найдена");
  }
};
</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
  display: none;
}
:deep(.p-datatable-table) {
  min-width: auto !important;
}
</style>
