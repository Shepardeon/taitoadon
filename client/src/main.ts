import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./app.routes";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
