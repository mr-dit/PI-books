<template>
  <div class="p-4">
    <h3 class="font-bold text-xl mb-2">{{ exhibition.name }}</h3>
    <p class="text-gray-500">Период: {{ exhibition.startDate }} — {{ exhibition.endDate }}</p>
    <p v-if="exhibition.description" class="mt-4">{{ exhibition.description }}</p>

    <h4 class="font-bold text-lg mt-6">Книги на выставке</h4>
    {{ console.log(exhibition.books) }}
    <DataTable
      :value="exhibition.books"
      tableStyle="min-width: 50rem"
      :paginator="true"
      :rows="10"
      scrollable
      scrollHeight="300px"
    >
      <Column field="title" header="Название книги"></Column>
      <Column field="authorsString" header="Автор"></Column>
      <!-- <Column field="publishedDate" header="Дата публикации"></Column> -->
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Пропсы для передачи данных
defineProps({
  visible: Boolean,
  exhibition: {
    type: Object,
    default: () => ({})
  },
  books: {
    type: Array,
    default: () => []
  }
})

// Событие закрытия
defineEmits(['close'])
</script>

<style scoped>
/* Стили для модального окна */
</style>
