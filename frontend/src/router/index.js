import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Criminals from '../views/Criminals.vue';
import CriminalDetail from '../views/CriminalDetail.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/criminals', name: 'Criminals', component: Criminals },
  { path: '/criminals/:id', name: 'CriminalDetail', component: CriminalDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;