<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-primary-50"
  >
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <h4 class="text-lg font-semibold text-primary-200">{{ subtitle }}</h4>
      
      <div class="text-sm text-primary-200">
        <p>Автор(ы): 
          <span v-for="(author, index) in authorList" :key="author.name">
            <router-link
              :to="{ name: 'author', query: { authorList: JSON.stringify(authorList), bookTitle: title } }"
              class="underline hover:text-primary-100"
            >
              {{ author.name }}
            </router-link>
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
        <button @click="previousImage" class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded">
          &lt;
        </button>
        <button @click="nextImage" class="bg-white/10 hover:bg-white/20 text-primary-50 px-3 py-1 rounded">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Название книги",
      subtitle: "Подзаголовок",
      authors: "Имя автора, Другой автор",
      firstPublished: "2023 год",
      description: "Описание книги, которое может быть достаточно длинным, чтобы требовать прокрутки.",
      bookSubjects: "Жанр, Другой жанр, Ещё один жанр",
      images: [
        new URL('@/assets/book1.jpg', import.meta.url).href,
      ],
      currentIndex: 0,
      authorList: [
        { name: "Имя автора", birthDate: "31 июля 1965", deathDate: null, bio: "Краткая биография автора", wikipediaLink: "https://www.wikipedia.org/" },
        { name: "Другой автор", birthDate: "15 августа 1970", deathDate: null, bio: "Краткая биография другого автора", wikipediaLink: "https://www.wikipedia.org/" }
      ],
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
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
    }
  }
};
</script>
