import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles.css'
import App from './App.vue'
import { createAppServices, provideAppServices } from './bootstrap/service-registry.ts'
import { router } from './router/index.ts'

const app = createApp(App)

app.use(createPinia())

const services = createAppServices(router)
provideAppServices(app, services)

app.use(router)
app.mount('#app')
