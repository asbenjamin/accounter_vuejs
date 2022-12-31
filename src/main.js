import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VCalendar from 'v-calendar'
import 'v-calendar/dist/style.css'
// import 'v-calendar/lib/v-calendar.min.css'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

createApp(App).use(store).use(VCalendar).use(router, axios).mount('#app')
