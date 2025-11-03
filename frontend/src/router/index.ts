import { createRouter, createWebHistory } from 'vue-router';
import CompaniesPage from '../pages/CompaniesPage.vue';
import ApplicationsPage from '../pages/ApplicationsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/companies',
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesPage,
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationsPage,
    },
  ],
});

export default router;