/* eslint-disable import/no-extraneous-dependencies */
import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import { Quasar } from 'quasar';
import VueCountdown from '@chenfengyuan/vue-countdown';
import App from './upcomingPanel/main.vue';
import 'quasar/dist/quasar.css';
import '../tailwindImport.css';

const app = createApp(App);
const head = createHead();
app.use(Quasar, {});
app.use(head);
app.component(VueCountdown.name, VueCountdown);
app.mount('#app');
