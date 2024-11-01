// import '@/assets/main.css';
import '@/utils/Global';
import '@/utils/Array';
import '@/utils/Date';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { ElLoading } from 'element-plus';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive('loading', ElLoading.directive);

app.mount('#app');
