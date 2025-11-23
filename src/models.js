
export const categorias = [];
export const recetas = [];

let categoriaIdCounter = 1;
let recetaIdCounter = 1;

export function generateCategoriaId() {
    return categoriaIdCounter++; 
}
export function generateRecetaId() {
    return recetaIdCounter++; 
}
