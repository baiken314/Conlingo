import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import UserLogin from './components/UserLogin.vue';

const routes = [
  { path: '/', component: App },
  { path: '/login', component: UserLogin }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;