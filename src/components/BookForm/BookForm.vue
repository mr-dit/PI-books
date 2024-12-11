<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-primary-50"
  >
    {{ console.log(props.book) }}
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{{ props.book.title }}</h2>
      <h4 class="text-lg font-semibold text-primary-200">{{ props.book.subtitle }}</h4>

      <div class="text-sm text-primary-200">
        <p>
          Автор(ы):
          <span v-for="(author, index) in props.book.authors" :key="author.id">
            <a
              href="#"
              @click.prevent="showAuthorInfo(author)"
              class="underline hover:text-primary-100"
            >
              {{ author.name }}
            </a>
            <span v-if="index < props.book.authors.length - 1">, </span>
          </span>
        </p>
        <p>Опубликовано: {{ props.book.firstPublishDate }}</p>
      </div>

      <div>
        <p class="font-semibold text-lg">Описание</p>
        <div class="text-sm max-h-40 overflow-y-auto">
          {{ props.book.description }}
        </div>
      </div>

      <div>
        <p class="font-semibold text-lg">Темы</p>
        <p class="text-sm text-primary-200">
          {{ props.book.subjects.map((s) => s.name).join(', ') }}
        </p>
      </div>
    </div>

    <div class="flex flex-col items-center">
      <img :src="currentImage" alt="Book cover" class="w-40 h-52 object-cover rounded-md mb-4" />
      <div v-if="images.length > 1" class="flex gap-2">
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
        :authorList="props.book.authors"
        :bookTitle="props.book.title"
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
import AuthorInfo from '@/components/AuthorInfo/AuthorInfo.vue'
import api from '@/api'

const props = defineProps({
  book: {
    type: Object,
    default: () => ({
      title: '',
      subtitle: '',
      firstPublishDate: '',
      description: '',
      subjects: () => [],
      authors: () => [],
      covers: () => []
    })
  }
})

// Изображения книги
const images = computed(() => props.book.covers.map((cover) => cover.path))

// Текущий индекс изображения
const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.value])

// Состояние модального окна и выбранный автор
const isDialogVisible = ref(false)
const selectedAuthor = ref({}) // Инициализация первым автором

const showAuthorInfo = async (author) => {
  const res = await api.get(`authors/${author.id}`)

  selectedAuthor.value = res.data
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
