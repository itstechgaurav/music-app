import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './assets/main.css';
import store from './store';
import veeValidator from './includes/validation';
import { auth } from './includes/firebase';

let myApp = null;

auth.onAuthStateChanged(() => {
  if (!myApp) {
    myApp = createApp(App);
    myApp.use(veeValidator);
    myApp.use(store);
    myApp.use(router);

    myApp.mount('#app');
  }
});
