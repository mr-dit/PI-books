<template>
  <div class="p-6 rounded-lg w-full mx-auto mt-4">
    <h3 class="text-xl font-bold mb-2">Авторы книги: {{ bookTitle }}</h3>

    <!-- Выпадающий список для выбора автора -->
    <select
      v-if="authorList.length > 1"
      v-model="localSelectedAuthor"
      @change="updateSelectedAuthor"
      class="mb-4 bg-primary-500 border border-gray-300 p-2 rounded w-full text-white"
    >
      <option v-for="auth in authorList" :key="auth.name" :value="auth">
        {{ auth.name }}
      </option>
    </select>

    <p class="text-sm text-white-700">
      {{ localSelectedAuthor.birthDate }} - {{ localSelectedAuthor.deathDate || 'Наше время' }}
    </p>

    <div class="mt-4">
      <p class="font-semibold">Биография</p>
      <div class="text-sm max-h-40 overflow-y-auto">
        {{ localSelectedAuthor.bio }}
      </div>
    </div>

    <a
      v-if="localSelectedAuthor.wikipediaLink"
      :href="localSelectedAuthor.wikipediaLink"
      target="_blank"
      class="text-blue-500 underline mt-4 block"
    >
      Читать подробнее
    </a>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  authorList: {
    type: Array,
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  selectedAuthor: Object // Принимаем selectedAuthor как prop
})

const localSelectedAuthor = ref(props.selectedAuthor) // Локальная переменная для управления выбором автора

// Слежение за изменением selectedAuthor из родителя
watch(
  () => props.selectedAuthor,
  (newAuthor) => {
    localSelectedAuthor.value = newAuthor
  }
)

// Метод для обновления выбранного автора в родительском компоненте
function updateSelectedAuthor() {
  localSelectedAuthor.value = props.selectedAuthor = localSelectedAuthor.value
}
</script>

<style scoped>
/* Добавьте ваши стили */
</style>
