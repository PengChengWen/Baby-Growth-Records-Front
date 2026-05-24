import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/vaccine-plan',
    name: 'VaccinePlan',
    component: () => import('../views/VaccinePlan.vue')
  },
  {
    path: '/iphone-compare',
    name: 'IPhoneCompare',
    component: () => import('../views/IPhoneCompare.vue')
  },
  {
    path: '/ipad-compare',
    name: 'IPadCompare',
    component: () => import('../views/IPadCompare.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
