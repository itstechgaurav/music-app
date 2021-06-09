import { createRouter, createWebHashHistory } from 'vue-router';
import { auth } from '@/includes/firebase';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
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
    name: 'about',
    path: '/about',
    component: About,
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
    path: '/:catchAll(.*)*',
    component: _404,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  const { requiresAuth } = to.meta;
  if (!requiresAuth || (requiresAuth && auth.currentUser)) next();
  else next({ name: from.name });
});

export default router;
