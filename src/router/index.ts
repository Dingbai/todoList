import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      children: [
        {
          path: '/',
          name: 'main',
          component: () => import('@/views/main/Main.vue')
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@/views/setting/Setting.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/about/About.vue')
        }
      ]
    }
  ]
})

export default router
