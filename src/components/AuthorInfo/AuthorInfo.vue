<template>
  <div class="p-6 rounded-lg w-full mx-auto mt-4">
    <h3 class="text-xl font-bold mb-2">Авторы книги: {{ bookTitle }}</h3>

    <!-- Выпадающий список для выбора автора -->
    <select
      v-if="authorList.length > 0"
      v-model="localSelectedAuthor.id"
      @change="updateSelectedAuthor"
      class="mb-4 bg-primary-500 border border-gray-300 p-2 rounded w-full text-white"
    >
      <option v-for="auth in authorList" :key="auth.name" :value="auth.id">
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
      v-if="localSelectedAuthor.wikipedia"
      :href="localSelectedAuthor.wikipedia"
      target="_blank"
      class="text-blue-500 underline mt-4 block"
    >
      Читать подробнее
    </a>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api'

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
const updateSelectedAuthor = async (e) => {
  const val = e.target.value
  console.log(e.target.value)
  const res = await api.get(`authors/${val}`)
  localSelectedAuthor.value = res.data
  await new Promise((resolve) => setTimeout(resolve, 200))
}
</script>

<style scoped>
/* Добавьте ваши стили */
</style>
