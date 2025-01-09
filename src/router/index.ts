import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/main',
      children: [
        {
          path: '/main',
          name: 'main',
          component: () => import('@/views/main/Main.vue')
        },
        {
          path: '/calendar',
          name: 'calendar',
          component: () => import('@/views/calendar/Calendar.vue')
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
