// src/server.ts
import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// --- SIMULACIÓN DE BASE DE DATOS (Datos en Memoria) ---
let categorias = [
    { id: 1, nombre: 'Postres', descripcion: 'Dulces, tortas y pasteles.' },
    { id: 2, nombre: 'Comida Rápida', descripcion: 'Recetas sencillas y rápidas.' },
    { id: 3, nombre: 'Comida Mexicana', descripcion: 'Tacos, enchiladas y más.' },
];
let recetas = [
    { id: 101, categoriaId: 1, nombre: 'Tarta de Limón', ingredientes: ['Limón', 'Mantequilla', 'Azúcar', 'Huevo'], instrucciones: 'Mezclar y hornear a 180°C por 30 minutos.', tiempoPreparacion: 50 },
    { id: 102, categoriaId: 1, nombre: 'Mousse de Chocolate', ingredientes: ['Chocolate', 'Nata', 'Azúcar'], instrucciones: 'Derretir chocolate y mezclar con nata montada.', tiempoPreparacion: 30 },
    { id: 103, categoriaId: 2, nombre: 'Hamburguesa Clásica', ingredientes: ['Pan', 'Carne', 'Queso', 'Lechuga', 'Tomate'], instrucciones: 'Asar la carne y armar.', tiempoPreparacion: 15 },
    { id: 104, categoriaId: 3, nombre: 'Tacos al Pastor', ingredientes: ['Carne de cerdo', 'Piña', 'Tortillas', 'Cilantro'], instrucciones: 'Adobar, cocinar y servir.', tiempoPreparacion: 90 },
];
let nextCategoriaId = Math.max(...categorias.map(c => c.id)) + 1;
let nextRecetaId = Math.max(...recetas.map(r => r.id)) + 1;
// --- CONFIGURACIÓN DEL SERVIDOR ---
const app = express();
const PORT = 3000;
// Middleware
app.use(cors());
app.use(express.json());
// --- CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Recetario Digital',
            version: '1.0.0',
            description: 'Documentación de la API CRUD para la gestión de Categorías y Recetas.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo Local',
            },
        ],
        components: {
            schemas: {
                Categoria: {
                    type: 'object',
                    required: ['nombre', 'descripcion'],
                    properties: {
                        id: { type: 'integer', description: 'ID autogenerado' },
                        nombre: { type: 'string', description: 'Nombre de la categoría' },
                        descripcion: { type: 'string', description: 'Descripción de la categoría' },
                    },
                },
                Receta: {
                    type: 'object',
                    required: ['categoriaId', 'nombre', 'instrucciones', 'tiempoPreparacion'],
                    properties: {
                        id: { type: 'integer', description: 'ID de la receta' },
                        categoriaId: { type: 'integer', description: 'ID de la categoría asociada' },
                        nombre: { type: 'string', description: 'Nombre de la receta' },
                        ingredientes: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Lista de ingredientes'
                        },
                        instrucciones: { type: 'string', description: 'Pasos de preparación' },
                        tiempoPreparacion: { type: 'integer', description: 'Tiempo en minutos' },
                    },
                },
            },
        },
    },
    apis: ['./src/server.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// RUTA DE DOCUMENTACIÓN SWAGGER 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ----------------------------------------------------------------------------------
// --- RUTAS CATEGORÍAS (CRUD Completo) ---
// ----------------------------------------------------------------------------------
/**
 * @swagger
 * /categorias:
 * get:
 * summary: Obtiene la lista de todas las categorías
 * tags: [Categorias]
 * responses:
 * 200:
 * description: Lista de categorías exitosa
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Categoria'
 */
app.get('/categorias', (req, res) => {
    res.json(categorias);
});
/**
 * @swagger
 * /categorias:
 * post:
 * summary: Crea una nueva categoría
 * tags: [Categorias]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Categoria'
 * responses:
 * 201:
 * description: Categoría creada exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Categoria'
 * 400:
 * description: Datos incompletos o inválidos
 */
app.post('/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'El nombre y la descripción son obligatorios.' });
    }
    const nuevaCategoria = {
        id: nextCategoriaId++,
        nombre,
        descripcion,
    };
    categorias.push(nuevaCategoria);
    res.status(201).json(nuevaCategoria);
});
/**
 * @swagger
 * /categorias/{id}:
 * get:
 * summary: Obtiene una categoría por ID
 * tags: [Categorias]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID de la categoría a obtener
 * responses:
 * 200:
 * description: Categoría encontrada
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Categoria'
 * 404:
 * description: Categoría no encontrada
 */
app.get('/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
    res.json(categoria);
});
/**
 * @swagger
 * /categorias/{id}:
 * put:
 * summary: Actualiza una categoría existente
 * tags: [Categorias]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID de la categoría a actualizar
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Categoria'
 * responses:
 * 200:
 * description: Categoría actualizada exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Categoria'
 * 404:
 * description: Categoría no encontrada
 */
app.put('/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
    const categoriaExistente = categorias[index];
    const { nombre, descripcion } = req.body;
    categorias[index] = {
        id: categoriaExistente.id,
        nombre: nombre || categoriaExistente.nombre,
        descripcion: descripcion || categoriaExistente.descripcion,
    };
    res.json(categorias[index]);
});
/**
 * @swagger
 * /categorias/{id}:
 * delete:
 * summary: Elimina una categoría por ID y sus recetas asociadas
 * tags: [Categorias]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID de la categoría a eliminar
 * responses:
 * 204:
 * description: Categoría eliminada exitosamente
 * 404:
 * description: Categoría no encontrada
 */
app.delete('/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
    recetas = recetas.filter(r => r.categoriaId !== id);
    categorias.splice(index, 1);
    res.status(204).send();
});
// ----------------------------------------------------------------------------------
// --- RUTAS RECETAS (CRUD y Lógica) ---
// ----------------------------------------------------------------------------------
/**
 * @swagger
 * /recetas:
 * post:
 * summary: Crea una nueva receta
 * tags: [Recetas]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Receta'
 * responses:
 * 201:
 * description: Receta creada exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Receta'
 * 400:
 * description: Faltan campos obligatorios
 * 404:
 * description: La CategoríaId especificada no existe
 */
app.post('/recetas', (req, res) => {
    const { categoriaId, nombre, ingredientes, instrucciones, tiempoPreparacion } = req.body;
    if (!categoriaId || !nombre || !instrucciones || !tiempoPreparacion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para la receta.' });
    }
    if (!categorias.find(c => c.id === categoriaId)) {
        return res.status(404).json({ message: 'La CategoríaId especificada no existe.' });
    }
    const nuevaReceta = {
        id: nextRecetaId++,
        categoriaId: Number(categoriaId),
        nombre,
        ingredientes: Array.isArray(ingredientes) ? ingredientes : [],
        instrucciones,
        tiempoPreparacion: Number(tiempoPreparacion)
    };
    recetas.push(nuevaReceta);
    res.status(201).json(nuevaReceta);
});
/**
 * @swagger
 * /recetas/{id}:
 * put:
 * summary: Actualiza una receta existente por ID
 * tags: [Recetas]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID de la receta a actualizar
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Receta'
 * responses:
 * 200:
 * description: Receta actualizada exitosamente
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Receta'
 * 404:
 * description: Receta no encontrada
 */
app.put('/recetas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recetas.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Receta no encontrada.' });
    }
    const recetaExistente = recetas[index];
    const { nombre, ingredientes, instrucciones, tiempoPreparacion } = req.body;
    recetas[index] = {
        id: recetaExistente.id,
        categoriaId: recetaExistente.categoriaId,
        nombre: nombre || recetaExistente.nombre,
        instrucciones: instrucciones || recetaExistente.instrucciones,
        ingredientes: Array.isArray(ingredientes) ? ingredientes : recetaExistente.ingredientes,
        tiempoPreparacion: Number(tiempoPreparacion) || recetaExistente.tiempoPreparacion,
    };
    res.json(recetas[index]);
});
/**
 * @swagger
 * /recetas/{id}:
 * delete:
 * summary: Elimina una receta por ID
 * tags: [Recetas]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: ID de la receta a eliminar
 * responses:
 * 204:
 * description: Receta eliminada exitosamente
 * 404:
 * description: Receta no encontrada
 */
app.delete('/recetas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recetas.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Receta no encontrada.' });
    }
    recetas.splice(index, 1);
    res.status(204).send();
});
/**
 * @swagger
 * /categorias/{categoriaId}/recetas:
 * get:
 * summary: Obtiene todas las recetas para una categoría específica
 * tags: [Categorias, Recetas]
 * parameters:
 * - in: path
 * name: categoriaId
 * schema:
 * type: integer
 * required: true
 * description: ID de la categoría
 * responses:
 * 200:
 * description: Lista de recetas exitosa
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Receta'
 */
app.get('/categorias/:categoriaId/recetas', (req, res) => {
    const categoriaId = parseInt(req.params.categoriaId);
    const recetasFiltradas = recetas.filter(r => r.categoriaId === categoriaId);
    res.json(recetasFiltradas);
});
/**
 * @swagger
 * /recetas/search:
 * get:
 * summary: Busca recetas por palabra clave en el nombre o ingredientes
 * tags: [Recetas]
 * parameters:
 * - in: query
 * name: query
 * schema:
 * type: string
 * required: true
 * description: Palabra clave para buscar recetas
 * responses:
 * 200:
 * description: Lista de recetas encontradas
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Receta'
 */
app.get('/recetas/search', (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    if (!query) {
        return res.status(400).json({ message: 'El parámetro "query" es obligatorio.' });
    }
    const resultados = recetas.filter(r => r.nombre.toLowerCase().includes(query) ||
        r.ingredientes.some(ing => ing.toLowerCase().includes(query)));
    res.json(resultados);
});
/**
 * @swagger
 * /recetas/fast:
 * get:
 * summary: Obtiene todas las recetas con un tiempo de preparación menor a 30 minutos
 * tags: [Recetas]
 * responses:
 * 200:
 * description: Lista de recetas rápidas
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Receta'
 */
app.get('/recetas/fast', (req, res) => {
    const recetasRapidas = recetas.filter(r => r.tiempoPreparacion <= 30);
    res.json(recetasRapidas);
});
// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`Documentación de la API disponible en http://localhost:${PORT}/docs`);
});
//# sourceMappingURL=server.js.map