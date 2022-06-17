import { createApp } from "vue"
import App from "./App.vue"
import { initRouter } from "./router"

createApp(App).use(initRouter()).mount("#app")
