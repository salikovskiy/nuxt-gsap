import { createRouter, createWebHistory } from "vue-router"
import Home from "./pages/Home.vue"

export function initRouter() {
    return createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: "/",
                name: "Home",
                component: Home,
            },
        ],
        scrollBehavior(to, from, savedPosition) {
            if (to.hash) {
                return {
                    el: to.hash,
                    behavior: "smooth",
                }
            }
        },
    })
}
