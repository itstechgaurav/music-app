import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/includes/firebase';
import Home from '@/views/Home.vue';
import Manage from '@/views/Manage.vue';
import Song from '@/views/Song.vue';
import _404 from '@/views/404.vue';

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'manage',
    path: '/manage',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
  },
  {
    name: 'song',
    path: '/song/:songId',
    component: Song,
  },
  {
    path: '/:catchAll(.*)',
    component: _404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'bg-gray-900',
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  const { requiresAuth } = to.meta;
  if (!requiresAuth || (requiresAuth && auth.currentUser)) next();
  else next({ name: from.name });
});

export default router;
