
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Receta { 
    id: number;
    categoriaId: number;
    nombre: string;
    ingredientes: string[]; 
    instrucciones: string;
    tiempoPreparacion: number; 
}
export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const response = await axios.get(`${API_URL}/categorias`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
};
export const getCategoriaById = async (categoriaId: number): Promise<Categoria> => {
    try {
        const response = await axios.get(`${API_URL}/categorias/${categoriaId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener categoría ${categoriaId}:`, error);
        throw error;
    }
};
export const createCategoria = async (nombre: string, descripcion: string): Promise<Categoria> => {
    try {
        const response = await axios.post(`${API_URL}/categorias`, { nombre, descripcion });
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};
export const updateCategoria = async (categoria: Categoria): Promise<Categoria> => {
    try {
        const response = await axios.put(`${API_URL}/categorias/${categoria.id}`, categoria);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la categoría ${categoria.id}:`, error);
        throw error;
    }
};
export const deleteCategoria = async (categoriaId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/categorias/${categoriaId}`);
    } catch (error) {
        console.error(`Error al eliminar la categoría ${categoriaId}:`, error);
        throw error;
    }
};
export const getRecetasPorCategoria = async (categoriaId: number): Promise<Receta[]> => {
    try {
        const response = await axios.get(`${API_URL}/categorias/${categoriaId}/recetas`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener recetas para la categoría ${categoriaId}:`, error);
        return [];
    }
};
export const createReceta = async (recetaData: Omit<Receta, 'id'>): Promise<Receta> => {
    try {
        const response = await axios.post(`${API_URL}/recetas`, recetaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la receta:", error);
        throw error;
    }
};
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
