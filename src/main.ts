import { createApp } from 'vue'
import App from './App.vue'

import 'virtual:uno.css'

const app = createApp(App)

app.directive('vis', (element, binding) => {
    element.style.opacity = binding.value ? 1 : 0
})

app.mount('#app')
