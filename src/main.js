import { createApp } from 'vue'
import store from './store/index.js'
import App from './App.vue'
import cors from 'cors';


// WeatherWidget.use(cors);
// const element = defineCustomElement(WeatherWidget);

// customElements.define("weather-widget", element);

const app = createApp(App);

app.use(store);
app.use(cors);

app.mount("#app");

// createApp(App).use(cors, store).mount('#app')
