import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import localforage from 'localforage'
localforage.config({
  name: 'base64img'
})

createApp(App).use(store).mount('main')
