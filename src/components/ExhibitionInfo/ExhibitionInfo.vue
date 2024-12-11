<template>
    <Dialog
      :visible="localVisible"
      modal
      :header="header"
      :style="{ width: '50vw' }"
      :closable="false"
      @hide="close"
    >
      <div class="p-4">
        <h3 class="font-bold text-xl mb-2">{{ exhibition.name }}</h3>
        <p v-if="exhibition.description" class="mt-4">{{ exhibition.description }}</p>
        <p class="text-gray-500 mt-2">
          Период действия: {{ exhibition.startDate }} - {{ exhibition.endDate }}
        </p>
        <h4 class="font-bold text-lg mt-6">Список книг:</h4>
        <DataTable
          :value="exhibition.books"
          :rows="10"
          tableStyle="min-width: 50rem"
          scrollable
          scrollHeight="30vh"
          :paginator="true"
          :rowsPerPageOptions="[10]"
        >
          <Column field="title" header="Название книги" sortable></Column>
          <Column field="firstPublishDate" header="Дата первой публикации" sortable></Column>
          <Column field="description" header="Описание" sortable></Column>
          <Column field="authors" header="Авторы" sortable>
            <template #body="slotProps">
              <ul>
                <li v-for="author in slotProps.rowData.authors" :key="author.id">{{ author.name }}</li>
              </ul>
            </template>
          </Column>
          <Column field="subjects" header="Темы" sortable>
            <template #body="slotProps">
              <ul>
                <li v-for="subject in slotProps.rowData.subjects" :key="subject">{{ subject }}</li>
              </ul>
            </template>
          </Column>
        </DataTable>
      </div>
      <template #footer>
        <Button label="Закрыть" @click="close" class="p-button-secondary" />
      </template>
    </Dialog>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import Button from 'primevue/button'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  
  // Пропсы для передачи данных
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true
    },
    exhibition: {
      type: Object,
      default: () => ({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        books: []
      })
    }
  })
  
  // Событие закрытия
  const emit = defineEmits(['update:visible'])
  
  const localVisible = ref(props.visible)
  
  watch(() => props.visible, (newValue) => {
    localVisible.value = newValue
  })
  
  const header = 'Информация о выставке'
  
  const close = () => {
    localVisible.value = false
    emit('update:visible', false)
  }
  </script>
  
  <style scoped>
  /* Стили для модального окна */
  </style>
  