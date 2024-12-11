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
        <h3 class="font-bold text-xl mb-2">{{ book.title }}</h3>
        <p v-if="book.description" class="mt-4">{{ book.description }}</p>
        <p class="text-gray-500 mt-2">
        Дата первой публикации: {{ book.firstPublishDate || 'Неизвестно' }}
        </p>
        <h4 class="font-bold text-lg mt-6">Авторы</h4>
        <ul class="list-disc pl-6">
        <li v-for="author in book.authors" :key="author.id">
            {{ author.name }}
        </li>
        </ul>
        <h4 class="font-bold text-lg mt-6">Темы</h4>
        <ul class="list-disc pl-6">
        <li v-for="subject in book.subjects" :key="subject">
            {{ subject }}
        </li>
        </ul>
    </div>
    <template #footer>
        <Button label="Закрыть" @click="close" class="p-button-secondary" />
    </template>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog } from 'primevue/dialog';
import Button from 'primevue/button';

  // Пропсы для передачи данных
defineProps({
    visible: Boolean,
    book: {
    type: Object,
    default: () => ({})
    }
});

  // Событие закрытия
defineEmits(['update:visible']);

// Локальное состояние видимости
const localVisible = ref(visible);

watch(visible, (newValue) => {
localVisible.value = newValue;
});

// Заголовок окна
const header = ref('Информация о книге');

// Метод закрытия модального окна
const close = () => {
localVisible.value = false;
emit('update:visible', false);
};
</script>

<style scoped>
/* Стили для модального окна */
</style>
