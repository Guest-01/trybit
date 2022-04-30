import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/signup',
    component: () => import('../views/SignUp.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;