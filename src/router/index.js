import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/LoginForm')
    },
    {
      path: '/book',
      name: 'book',
      component: () => import('@/views/BookForm')
    },
    {
      path: '/author',
      name: 'author',
      component: () => import('@/views/AuthorInfo/AuthorInfo.vue'),
      props: route => ({
        authorList: JSON.parse(route.query.authorList),
        bookTitle: route.query.bookTitle
      })
    },
  ]
})

export default router
