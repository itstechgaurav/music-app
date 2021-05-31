import { createApp } from 'vue';
import VueFormulate from '@braid/vue-formulate';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import './assets/main.css';
import store from './store';
// import validator from './includes/validation';

function myFirstPlugin(instance) {
  // Add a new validation rule
  instance.extend({
    rules: {
      foobar: ({ value }) => ['foo', 'bar'].includes(value),
    },
  });
}

const myApp = createApp(App);
myApp.use(store);
myApp.use(router);

myApp.use(VueFormulate, {
  plugins: [myFirstPlugin],
});

myApp.mount('#app');
