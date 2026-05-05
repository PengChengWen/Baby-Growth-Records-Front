import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/vaccine-plan'
  },
  {
    path: '/vaccine-plan',
    name: 'VaccinePlan',
    component: () => import('../views/VaccinePlan.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
