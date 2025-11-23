
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RecetasView from '../views/RecetasView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'categorias',
            component: HomeView
        },
        {
            path: '/categorias/:id/recetas',
            name: 'recetas',
            component: RecetasView,
            props: true
        }
    ]
});
export default router;
