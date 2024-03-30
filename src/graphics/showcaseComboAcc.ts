import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './showcaseComboAcc/main.vue';
import '../tailwindImport.css';

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');
