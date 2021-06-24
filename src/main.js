import { createApp } from 'vue';
import Icon from '@/directives/Icon';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './assets/main.css';
import store from './store';
import veeValidator from './includes/validation';
import { auth } from './includes/firebase';
import i18n from './i18n';

let myApp = null;

auth.onAuthStateChanged(() => {
  if (!myApp) {
    myApp = createApp(App).use(i18n);
    myApp.use(veeValidator);
    myApp.use(store);
    myApp.use(router);
    myApp.directive('icon', Icon);
    myApp.mount('#app');
  }
});
