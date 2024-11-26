<template>
  <div class="h-screen w-screen flex flex-col">
    <h2 class="text-lg font-bold mb-4">Отчеты</h2>
    <div>
      <TabView>
        <!-- Вкладка Напоминание -->
        <TabPanel header="Напоминание">
          <div class="flex justify-end mb-4">
            <Button label="Экспорт" icon="pi pi-download" @click="exportToCSV('reminders')" />
          </div>
          <DataTable
            :value="reminders"
            :paginator="true"
            :rows="10"
            scrollable
            scrollHeight="400px"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="onSort"
          >
            <Column field="title" header="Название" sortable></Column>
            <Column field="customer" header="Клиент" sortable></Column>
            <Column field="dateOfIssue" header="Дата выдачи" sortable></Column>
            <Column field="returnUntil" header="Срок сдачи" sortable></Column>
          </DataTable>
        </TabPanel>

        <!-- Вкладка История выдачи книги -->
        <TabPanel header="История выдачи книги">
          <div class="flex flex-col mb-4">
            <label for="book-id" class="mb-2">Идентификатор книги</label>
            <input
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
          <div v-else class="mb-4 text-red-500">
            Книга не найдена
          </div>

          <div class="flex justify-end mb-4">
            <Button label="Экспорт" icon="pi pi-download" @click="exportToCSV('history')" />
          </div>
          <DataTable
            :value="history"
            :paginator="true"
            :rows="10"
            scrollable
            scrollHeight="400px"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="onSort"
          >
            <Column field="customer" header="Клиент" sortable></Column>
            <Column field="dateOfIssue" header="Дата выдачи" sortable></Column>
            <Column header="Дата сдачи" sortable>
              <!-- <template #body="slotProps">
                <span v-if="slotProps.data.overdue" class="text-red-500 font-bold">
                  {{ slotProps.data.returnDate }}
                </span>
                <span v-else>
                  {{ slotProps.data.returnDate }}
                </span>
              </template> -->
            </Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { saveAs } from 'file-saver';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

const bookId = ref('');
const bookInfo = ref(null);
const history = ref([]);
const sortField = ref('dateOfIssue');
const sortOrder = ref(-1);

const reminders = ref([
  {
    title: 'Moby Dick or The White Whale',
    customer: 'Jasper Sweet',
    dateOfIssue: '24.05.17',
    returnUntil: '14.06.17',
  },
  {
    title: 'The Da Vinci Code',
    customer: 'Bianca Mendoza',
    dateOfIssue: '25.05.17',
    returnUntil: '15.06.17',
  },
]);

const fetchBookHistory = () => {
  const bookDatabase = {
    OL957468W: {
      title: 'The Da Vinci Code',
      subtitle: 'A Mystery Thriller',
      history: [
        {
          customer: 'Grace Bridges',
          dateOfIssue: '26.05.17',
          returnDate: '16.06.17',
          overdue: false,
        },
        {
          customer: 'Bianca Mendoza',
          dateOfIssue: '25.03.17',
          returnDate: '09.04.17',
          overdue: false,
        },
        {
          customer: 'Nash Charles',
          dateOfIssue: '01.03.17',
          returnDate: '12.03.17',
          overdue: false,
        },
        {
          customer: 'Jasper Sweet',
          dateOfIssue: '06.02.17',
          returnDate: '20.02.17',
          overdue: true,
        },
      ],
    },
  };

  if (bookId.value && bookDatabase[bookId.value]) {
    const book = bookDatabase[bookId.value];
    bookInfo.value = { title: book.title, subtitle: book.subtitle };
    history.value = book.history;
  } else {
    bookInfo.value = null;
    history.value = [];
  }
};

// Функция экспорта в CSV
const exportToCSV = (type) => {
  const data = type === 'reminders' ? reminders.value : history.value;
  const csvContent = [
    ['Название', 'Клиент', 'Дата выдачи', 'Дата сдачи'],
    ...data.map((row) => [
      row.title || '',
      row.customer,
      row.dateOfIssue,
      row.returnDate || row.returnUntil,
    ]),
  ]
    .map((e) => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `${type}_report.csv`;
  saveAs(blob, filename);
};

// Сортировка
const onSort = (event) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
};
</script>

<style scoped>
input {
  width: 100%;
  max-width: 400px;
}

.h-screen {
  padding: 20px;
}
</style>
