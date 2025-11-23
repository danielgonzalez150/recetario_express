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
export const categorias: Categoria[] = [];
export const recetas: Receta[] = [];

let categoriaIdCounter = 1;
let recetaIdCounter = 1;

export function generateCategoriaId(): number {
    return categoriaIdCounter++; 
}

export function generateRecetaId(): number {
    return recetaIdCounter++; 
}