<template>
<div class="flex items-end rounded-lg w-full mx-auto mt-4">
    <Form
    v-slot="$form"
    :initialValues="initialValues"
    @submit="(e) => onFormSubmit(e, $form)"
    class="flex flex-col gap-4 w-full"
    >
    <div class="flex flex-col gap-1">
        <label>
        Название выставки
        <InputText id="name" name="name" placeholder="Имя" required :feedback="false" fluid />
        </label>
        <label>
            Описание выставки
        <InputText
            id="address"
            name="address"
            placeholder="Адрес"
            required
            :feedback="false"
            fluid
        />
        </label>
        <label>
            Дата начала
            <div class="flex gap-1">
            <InputText id="zip" name="zip" placeholder="Дата начала" required :feedback="false" fluid />
            </div>
            <div class="flex gap-1">
            <label>
            Дата окончания
        <InputText v-model="form.endDate" placeholder="Дата окончания" />
        </label>
        </div>
        </label>
    </div>
    <Button type="submit" severity="secondary" label="Сохранить" />
    </Form>
    <h3 class="font-bold mt-4">Книги на выставке</h3>
    <DataTable
        :value="books"
        :rows="10"
        :first="firstRow"
        @page="onPageChange"
        selectionMode="single"
        v-model:selection="selectedBook"
    >
        <Column field="title" header="Название книги" />
        <Column field="author" header="Автор" />
        <Column
        header="Удалить"
        :body="deleteButton"
        />
    </DataTable>

    <!-- Кнопки управления -->
    <div class="flex justify-between gap-4">
        <Button label="Сохранить" @click="onSave" />
        <Button label="Закрыть" @click="closeDialog" />
    </div>
</div>
</template>


<script setup>
import { ref, computed } from 'vue'
import api from '@/api'

const props = defineProps({
exhibition: Object, // Принимаем выставку как prop
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
name: props.exhibition.name || '',
description: props.exhibition.description || '',
startDate: props.exhibition.startDate || '',
endDate: props.exhibition.endDate || '',
})

const books = ref([]) // Список книг
const selectedBook = ref(null) // Выбранная книга для удаления
const rowsPerPage = 10
const currentPage = ref(1)

const firstRow = computed(() => (currentPage.value - 1) * rowsPerPage)

const fetchBooks = async () => {
if (!props.exhibition.id) return

try {
    const response = await api.get(`/exhibitions/${props.exhibition.id}/books`, {
    params: { page: currentPage.value - 1, size: rowsPerPage },
    })
    books.value = response.data.content
} catch (error) {
    console.error('Ошибка при загрузке книг:', error)
}
}

const onPageChange = (event) => {
currentPage.value = event.page + 1
fetchBooks()
}

const deleteBook = async (book) => {
if (confirm(`Вы уверены, что хотите удалить книгу "${book.title}" из выставки?`)) {
    try {
    await api.delete(`/exhibitions/${props.exhibition.id}/books/${book.id}`)
    fetchBooks()
    } catch (error) {
    console.error('Ошибка при удалении книги:', error)
    }
}
}

// Кнопка для удаления книги
const deleteButton = (rowData) => {
return {
    template: `
    <Button
        icon="pi pi-trash"
        class="p-button-danger"
        @click="deleteBook(rowData)"
    />
    `
}
}

// Сохранить изменения в выставке
const onSave = async () => {
const updatedExhibition = {
    ...form.value,
    books: books.value.map(book => book.id), // Сохраняем только ID книг
}

try {
    await api.put(`/exhibitions/${props.exhibition.id}`, updatedExhibition)
    emit('save', updatedExhibition)
    closeDialog()
} catch (error) {
    console.error('Ошибка при сохранении выставки:', error)
}
}

const closeDialog = () => {
emit('cancel')
}

fetchBooks()

</script>

<style scoped>
:deep(.p-datatable-paginator-bottom) {
display: none;
}
</style>
