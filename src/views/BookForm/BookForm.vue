<template>
  <div
    class="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 text-primary-50"
  >
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <h4 class="text-lg font-semibold text-primary-200">{{ subtitle }}</h4>
      <p class="text-sm text-primary-200">by {{ authors }}</p>
      <p class="text-sm text-primary-200">First published: {{ firstPublished }}</p>
      
      <div>
        <p class="font-semibold text-lg">Description</p>
        <p class="text-sm">{{ description }}</p>
      </div>

      <div>
        <p class="font-semibold text-lg">Subjects</p>
        <p class="text-sm text-primary-200">{{ bookSubjects }}</p>
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


