<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-primary-50"
  >
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <h4 class="text-lg font-semibold text-primary-200">{{ subtitle }}</h4>

      <div class="text-sm text-primary-200">
        <p>
          Автор(ы):
          <span v-for="(author, index) in authorList" :key="author.name">
            <a
              href="#"
              @click.prevent="showAuthorInfo(author)"
              class="underline hover:text-primary-100"
            >
              {{ author.name }}
            </a>
            <span v-if="index < authorList.length - 1">, </span>
          </span>
        </p>
        <p>Опубликовано: {{ firstPublished }}</p>
      </div>

      <div>
        <p class="font-semibold text-lg">Описание</p>
        <div class="text-sm max-h-40 overflow-y-auto">
          {{ description }}
        </div>
      </div>

      <div>
        <p class="font-semibold text-lg">Темы</p>
        <p class="text-sm text-primary-200">{{ bookSubjectsList.join(', ') }}</p>
      </div>
    </div>

    <div class="flex flex-col items-center">
      <img :src="currentImage" alt="Book cover" class="w-40 h-52 object-cover rounded-md mb-4" />
      <div class="flex gap-2">
        <button
          @click="previousImage"
          class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded"
        >
          &lt;
        </button>
        <button
          @click="nextImage"
          class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded"
        >
          &gt;
        </button>
      </div>
    </div>

    <!-- Модальное окно для информации об авторе -->
    <Dialog
      v-model:visible="isDialogVisible"
      modal
      header="Информация об авторе"
      :style="{ width: '30rem' }"
    >
      <AuthorInfo
        :authorList="authorList"
        :bookTitle="title"
        v-model:selectedAuthor="selectedAuthor"
      />
      <template #footer>
        <Button
          label="Закрыть"
          @click="isDialogVisible = false"
          class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import AuthorInfo from '@/components/AuthorInfo/AuthorInfo.vue';

// Основные данные книги
const title = ref('Название книги')
const subtitle = ref('Подзаголовок')
const firstPublished = ref('2023 год')
const description = ref(
  'Описание книги, которое может быть достаточно длинным, чтобы требовать прокрутки.'
)
const bookSubjects = ref('Жанр, Другой жанр, Ещё один жанр')

// Список авторов
const authorList = ref([
  {
    name: 'Имя автора',
    birthDate: '31 июля 1965',
    deathDate: null,
    bio: 'Краткая биография автора',
    wikipediaLink: 'https://www.wikipedia.org/'
  },
  {
    name: 'Другой автор',
    birthDate: '15 августа 1970',
    deathDate: null,
    bio: 'Краткая биография другого автора',
    wikipediaLink: 'https://www.wikipedia.org/'
  }
])

// Обработка тем книги
const bookSubjectsList = computed(() => bookSubjects.value.split(', '))

// Изображения книги
const images = ref([new URL('@/assets/book1.jpg', import.meta.url).href])

// Текущий индекс изображения
const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.value])

// Состояние модального окна и выбранный автор
const isDialogVisible = ref(false)
const selectedAuthor = ref(authorList.value[0]) // Инициализация первым автором

function showAuthorInfo(author) {
  selectedAuthor.value = author
  isDialogVisible.value = true
}

// Методы переключения изображений
function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

function previousImage() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}
</script>
