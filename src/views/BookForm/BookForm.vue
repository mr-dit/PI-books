<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-primary-50"
  >
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <h4 class="text-lg font-semibold text-primary-200">{{ subtitle }}</h4>
      
      <div class="text-sm text-primary-200">
        <p>Автор(ы): 
          <span v-for="(author, index) in authorList" :key="author">
            <a href="#" @click.prevent="showAuthorInfo(author)" class="underline hover:text-primary-100">
              {{ author }}
            </a><span v-if="index < authorList.length - 1">, </span>
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
        <button @click="previousImage" class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded">
          &lt;
        </button>
        <button @click="nextImage" class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded">
          &gt;
        </button>
      </div>
    </div>

    <!-- Модальное окно с информацией об авторе -->
    <div v-if="isAuthorModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-80 text-black">
        <h3 class="text-xl font-bold mb-4">Информация об авторе</h3>
        <p>{{ selectedAuthor }}: Здесь будет информация об авторе.</p>
        <button @click="closeAuthorModal" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Пример названия книги",
      subtitle: "Подзаголовок",
      authors: "Имя автора, Другой автор",
      firstPublished: "2023 год",
      description: "Описание книги, ооооооооооооооооочень длинное",
      bookSubjects: "Жанр, Другой жанр, Ещё один жанр",
      images: [
        new URL('@/assets/book1.jpg', import.meta.url).href,
      ],
      currentIndex: 0,
      isAuthorModalVisible: false,
      selectedAuthor: "",
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
    authorList() {
      return this.authors.split(', ');
    },
    bookSubjectsList() {
      return this.bookSubjects.split(', ');
    }
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    previousImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    showAuthorInfo(author) {
      this.selectedAuthor = author;
      this.isAuthorModalVisible = true;
    },
    closeAuthorModal() {
      this.isAuthorModalVisible = false;
      this.selectedAuthor = "";
    }
  }
};
</script>
