// Datos simulados en memoria
export const categorias = [];
export const recetas = [];
// NUEVA LÓGICA DE CONTADORES: Usamos variables para llevar la cuenta del siguiente ID
let categoriaIdCounter = 1;
let recetaIdCounter = 1;
// Función para generar el siguiente ID numérico
export function generateCategoriaId() {
    return categoriaIdCounter++; // Devuelve el valor actual y luego lo incrementa
}
export function generateRecetaId() {
    return recetaIdCounter++; // Devuelve el valor actual y luego lo incrementa
}
