<template>
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[2000]"
  >
    <div class="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <span class="mt-2 text-gray-700">Загрузка...</span>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLoaderStore } from '@/stores/loader'

const { loading } = storeToRefs(useLoaderStore())
</script>
