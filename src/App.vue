<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'
import GlobalLoader from '@/components/GlobalLoader/GlobalLoader.vue'

import './assets/tailwind.css'
import LoginForm from '@/views/LoginForm'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const items = ref([
  {
    label: 'Файл',
    icon: 'pi pi-search',
    items: [
      // {
      //   label: 'Вход',
      //   icon: 'pi pi-bolt'
      // },
      {
        label: 'Выход',
        icon: 'pi pi-server',
        command: async () => {
          try {
            await api.post('auth/logout')
            authStore.setAuthenticated(false)
          } catch (e) {
            toast.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Произошла ошибка, попробуйте еще раз',
              life: 3000
            })
            authStore.setAuthenticated(false)
          }
        }
      }
      // {
      //   label: 'Закрыть',
      //   command: () => {
      //     // TODO добавить метод выхода с бэка
      //     window.close()
      //   }
      // }
    ]
  },
  {
    label: 'Библиотека',
    icon: 'pi pi-envelope',
    items: [
      {
        label: 'Главная',
        icon: 'pi pi-bolt',
        command: async () => {
          await router.push({ name: 'home' })
        }
      },
      {
        label: 'Управление клиентами',
        icon: 'pi pi-bolt',
        command: async () => {
          await router.push({ name: 'customers' })
        }
      },
      {
        label: 'Выдача книг',
        icon: 'pi pi-server',
        command: async () => {
          await router.push({ name: 'book_control' })
        }
      },
      {
        label: 'Отчеты',
        icon: 'pi pi-pencil',
        command: async () => {
          await router.push({ name: 'report' })
        }
      },
      {
        label: 'Выставка',
        icon: 'pi pi-pencil',
        command: async () => {
          await router.push({ name: 'exhibitions_control' })
        }
      }
    ]
  }
])

// const restoreAuthState = () => {
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
//   authStore.setAuthenticated(isAuthenticated)
// }
// restoreAuthState()

const isLoading = ref(false)

const checkAuth = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/auth/check-you-is-live')
    authStore.setAuthenticated(response.data)
  } catch (error) {
    authStore.setAuthenticated(false)
    console.warn('Сессия недействительна:', error.response?.data || error.message)
    isLoading.value = false
  }
  isLoading.value = false
}

// Проверяем авторизацию при загрузке страницы
checkAuth()
</script>

<template>
  <Toast />
  <div v-if="isLoading"></div>
  <LoginForm v-else-if="!authStore.isAuthenticated"></LoginForm>
  <div v-else class="h-screen w-screen flex overflow-hidden flex-col">
    <Menubar :model="items"></Menubar>
    <RouterView />
  </div>
  <Teleport to="body">
    <GlobalLoader />
  </Teleport>
</template>

<style scoped>
:deep(.p-menubar-submenu) {
  z-index: 2;
}
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } 
 } */
</style>
