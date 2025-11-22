// src/services/api.ts
import axios from 'axios';

// ----------------------------------------------------
// URL BASE
// ----------------------------------------------------
const API_URL = 'http://localhost:3000';

// ----------------------------------------------------
// TIPOS DE DATOS (Necesarios para tipado en Vue)
// ----------------------------------------------------

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Receta { 
    id: number;
    categoriaId: number;
    nombre: string;
    ingredientes: string[]; // Arreglo de strings
    instrucciones: string;
    tiempoPreparacion: number; // Numérico
}

// ----------------------------------------------------
// 1. FUNCIONES CRUD CATEGORÍAS
// ----------------------------------------------------

// GET /categorias
export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const response = await axios.get(`${API_URL}/categorias`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
};

// GET /categorias/:id (Necesario para el título en RecetasView)
export const getCategoriaById = async (categoriaId: number): Promise<Categoria> => {
    try {
        const response = await axios.get(`${API_URL}/categorias/${categoriaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener categoría ${categoriaId}:`, error);
        throw error;
    }
};

// POST /categorias
export const createCategoria = async (nombre: string, descripcion: string): Promise<Categoria> => {
    try {
        const response = await axios.post(`${API_URL}/categorias`, { nombre, descripcion });
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};

// PUT /categorias/:id
export const updateCategoria = async (categoria: Categoria): Promise<Categoria> => {
    try {
        const response = await axios.put(`${API_URL}/categorias/${categoria.id}`, categoria);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la categoría ${categoria.id}:`, error);
        throw error;
    }
};

// DELETE /categorias/:id
export const deleteCategoria = async (categoriaId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/categorias/${categoriaId}`);
    } catch (error) {
        console.error(`Error al eliminar la categoría ${categoriaId}:`, error);
        throw error;
    }
};


// ----------------------------------------------------
// 2. FUNCIONES CRUD RECETAS
// ----------------------------------------------------

// GET /categorias/:id/recetas
export const getRecetasPorCategoria = async (categoriaId: number): Promise<Receta[]> => {
    try {
        const response = await axios.get(`${API_URL}/categorias/${categoriaId}/recetas`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener recetas para la categoría ${categoriaId}:`, error);
        return [];
    }
};

// POST /recetas
export const createReceta = async (recetaData: Omit<Receta, 'id'>): Promise<Receta> => {
    try {
        const response = await axios.post(`${API_URL}/recetas`, recetaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la receta:", error);
        throw error;
    }
};

// DELETE /recetas/:id
export const deleteReceta = async (recetaId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/recetas/${recetaId}`);
    } catch (error) {
        console.error(`Error al eliminar la receta ${recetaId}:`, error);
        throw error;
    }
};
export const updateReceta = async (receta: Receta): Promise<Receta> => {
    try {
        const response = await axios.put(`${API_URL}/recetas/${receta.id}`, receta);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la receta ${receta.id}:`, error);
        throw error;
    }
};

// **ACCIÓN PENDIENTE: Agrega la función updateReceta (PUT /recetas/:id) aquí cuando la necesites.**
// export const updateReceta = async (receta: Receta): Promise<Receta> => { /* ... */ };