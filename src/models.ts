export interface Receta {
  id_receta: number;
  id_categoria: number;
  nombre: string;
  ingredientes: string[];
  instrucciones: string;
}
export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

// Datos simulados en memoria
export const categorias: Categoria[] = [];
export const recetas: Receta[] = [];

// NUEVA LÓGICA DE CONTADORES: Usamos variables para llevar la cuenta del siguiente ID
let categoriaIdCounter = 1;
let recetaIdCounter = 1;

// Función para generar el siguiente ID numérico
export function generateCategoriaId(): number {
    return categoriaIdCounter++; // Devuelve el valor actual y luego lo incrementa
}

export function generateRecetaId(): number {
    return recetaIdCounter++; // Devuelve el valor actual y luego lo incrementa
}