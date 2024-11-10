<template>
    <div class="bg-white p-6 rounded-lg w-80 text-black mx-auto mt-10">
        <h3 class="text-xl font-bold mb-2">Авторы книги: {{ bookTitle }}</h3>

        <select v-if="authorList.length > 1" v-model="selectedAuthor" @change="updateAuthorInfo" class="mb-4 bg-primary-500 border border-gray-300 p-2 rounded w-full text-white">
        <option v-for="auth in authorList" :key="auth.name" :value="auth">
            {{ auth.name }}
        </option>
        </select>

        <!-- <h4 class="text-lg font-semibold">{{ selectedAuthor.name }}</h4> -->
        <p class="text-sm text-gray-700">{{ selectedAuthor.birthDate }} - {{ selectedAuthor.deathDate || 'Наше время' }}</p>

        <div class="mt-4">
        <p class="font-semibold">Биография</p>
        <div class="text-sm max-h-40 overflow-y-auto">
            {{ selectedAuthor.bio }}
        </div>
        </div>

        <a v-if="selectedAuthor.wikipediaLink" :href="selectedAuthor.wikipediaLink" target="_blank" class="text-blue-500 underline mt-4 block">
        Читать подробнее
        </a>

        <router-link to="/book" class="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded inline-block text-center">
        Закрыть
        </router-link>
    </div>
</template>

<script>
    export default {
    props: {
        authorList: {
        type: Array,
        required: true
        },
        bookTitle: {
        type: String,
        required: true
        }
    },
    data() {
        return {
        selectedAuthor: this.authorList[0] || {},
        };
    },
    methods: {
        updateAuthorInfo() {
        // Метод для обновления информации о выбранном авторе
        }
    }
    };
</script>
