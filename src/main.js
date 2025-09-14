import 'bootstrap/dist/css/bootstrap.min.css'
import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const firebaseConfig = {
  apiKey: "AIzaSyDc5EAxP2-TEuxHdsSQgRtUgFykV7ht6u4",
  authDomain: "week7-yiyang.firebaseapp.com",
  projectId: "week7-yiyang",
  storageBucket: "week7-yiyang.firebasestorage.app",
  messagingSenderId: "673433037727",
  appId: "1:673433037727:web:8fc7269fc3207131222baa"
};


initializeApp(firebaseConfig);
const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
