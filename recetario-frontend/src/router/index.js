// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
// 1. Importar las Vistas
// Asegúrate de que estos archivos existan en src/views/
import HomeView from '../views/HomeView.vue';
import RecetasView from '../views/RecetasView.vue';
// 2. Crear el Router
const router = createRouter({
    // Utiliza el historial basado en la API History de navegación web
    // import.meta.env.BASE_URL es la variable de entorno de Vite para la ruta base de la aplicación
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            // Ruta principal: Muestra el CRUD de Categorías
            path: '/',
            name: 'categorias',
            component: HomeView
        },
        {
            // Ruta dinámica: Muestra las recetas de una categoría específica
            // :id es el parámetro que se obtiene de la URL
            path: '/categorias/:id/recetas',
            name: 'recetas',
            component: RecetasView,
            // 'props: true' hace que el parámetro 'id' de la URL se pase como una prop al componente RecetasView
            props: true
        }
        // Si necesitas otras rutas (ej. /acercade), las añadirías aquí.
    ]
});
export default router;
