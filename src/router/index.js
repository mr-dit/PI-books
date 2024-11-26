import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/MainPage')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('@/views/UsersPage')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/LoginForm')
    },
    {
      path: '/book',
      name: 'book',
      component: () => import('@/components/BookForm')
    },
    {
      path: '/author',
      name: 'author',
      component: () => import('@/components/AuthorInfo')
    },
    {
      path: '/book_control',
      name: 'book_control',
      component: () => import('@/views/BookControl')
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/BookReport')
    }
  ]
})

export default router
