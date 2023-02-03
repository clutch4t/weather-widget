import { createApp } from 'vue'
import store from './store/index.js'
import WeatherWidget from './App.vue'
import cors from 'cors';

const app = createApp(WeatherWidget);

app.use(store);
app.use(cors);

app.mount("#app");

