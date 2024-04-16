import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import AxiosHelper from './axios/axios.helper'
import router from './router'
import store from './store'
import emitter from './emitter'
import { Loader } from './plugin'

const app = createApp(App)

app.config.globalProperties.$http = new AxiosHelper(app)

const vuetify = createVuetify({
    components,
    directives,
})

app.use(Loader)
app.use(router)
app.use(store)
app.use(emitter)
app.use(vuetify, { iconfont: 'mdi' })
app.mount('#app')

