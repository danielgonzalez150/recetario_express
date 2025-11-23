
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi, { JsonObject } from 'swagger-ui-express'; 
import * as fs from 'fs';
import * as yaml from 'js-yaml';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Receta {
    id: number;
    categoriaId: number;
    nombre: string;
    ingredientes: string[]; 
    instrucciones: string;
    tiempoPreparacion: number; 
}

type CategoriaUpdate = Partial<Categoria>;
type RecetaUpdate = Partial<Receta>;


let categorias: Categoria[] = [
    { id: 1, nombre: 'Postres', descripcion: 'Dulces, tortas y pasteles.' },
    { id: 2, nombre: 'Comida Rápida', descripcion: 'Recetas sencillas y rápidas.' },
    { id: 3, nombre: 'Comida Mexicana', descripcion: 'Tacos, enchiladas y más.' },
];

let recetas: Receta[] = [
    { id: 101, categoriaId: 1, nombre: 'Tarta de Limón', ingredientes: ['Limón', 'Mantequilla', 'Azúcar', 'Huevo'], instrucciones: 'Mezclar y hornear a 180°C por 30 minutos.', tiempoPreparacion: 50 },
    { id: 102, categoriaId: 1, nombre: 'Mousse de Chocolate', ingredientes: ['Chocolate', 'Nata', 'Azúcar'], instrucciones: 'Derretir chocolate y mezclar con nata montada.', tiempoPreparacion: 30 },
    { id: 103, categoriaId: 2, nombre: 'Hamburguesa Clásica', ingredientes: ['Pan', 'Carne', 'Queso', 'Lechuga', 'Tomate'], instrucciones: 'Asar la carne y armar.', tiempoPreparacion: 15 },
    { id: 104, categoriaId: 3, nombre: 'Tacos al Pastor', ingredientes: ['Carne de cerdo', 'Piña', 'Tortillas', 'Cilantro'], instrucciones: 'Adobar, cocinar y servir.', tiempoPreparacion: 90 },
];

let nextCategoriaId = Math.max(...categorias.map(c => c.id)) + 1;
let nextRecetaId = Math.max(...recetas.map(r => r.id)) + 1;

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

try {

    const swaggerDocument: JsonObject = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8')) as JsonObject;
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 
} catch (e) {
    console.error("Error al cargar swagger.yaml. Asegúrate de que el archivo exista en la raíz del proyecto y esté bien formado.");
}


app.get('/categorias', (req: Request, res: Response) => {
    res.json(categorias);
});

app.post('/categorias', (req: Request, res: Response) => {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
        return res.status(400).json({ message: 'El nombre y la descripción son obligatorios.' });
    }

    const nuevaCategoria: Categoria = {
        id: nextCategoriaId++,
        nombre,
        descripcion,
    };

    categorias.push(nuevaCategoria);
    res.status(201).json(nuevaCategoria);
});

app.get('/categorias/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id!);
    const categoria = categorias.find(c => c.id === id);

    if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    res.json(categoria);
});

app.put('/categorias/:id', (req: Request<{ id: string }, {}, CategoriaUpdate>, res: Response) => {
    const id = parseInt(req.params.id!); 
    const index = categorias.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    const categoriaExistente = categorias[index]!; 
    const { nombre, descripcion } = req.body;

    categorias[index] = {
        id: categoriaExistente.id,
        nombre: nombre || categoriaExistente.nombre, 
        descripcion: descripcion || categoriaExistente.descripcion,
    };

    res.json(categorias[index]);
});

app.delete('/categorias/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id!); 
    const index = categorias.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    recetas = recetas.filter(r => r.categoriaId !== id);
    categorias.splice(index, 1);
    res.status(204).send(); 
});


app.post('/recetas', (req: Request, res: Response) => {
    const { categoriaId, nombre, ingredientes, instrucciones, tiempoPreparacion } = req.body;

    if (!categoriaId || !nombre || !instrucciones || !tiempoPreparacion) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para la receta.' });
    }
    
    if (!categorias.find(c => c.id === categoriaId)) {
        return res.status(404).json({ message: 'La CategoríaId especificada no existe.' });
    }

    const nuevaReceta: Receta = {
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

app.put('/recetas/:id', (req: Request<{ id: string }, {}, RecetaUpdate>, res: Response) => {
    const id = parseInt(req.params.id!);
    const index = recetas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Receta no encontrada.' });
    }

    const recetaExistente = recetas[index]!;
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


app.delete('/recetas/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id!);
    const index = recetas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Receta no encontrada.' });
    }

    recetas.splice(index, 1);
    res.status(204).send();
});


app.get('/categorias/:categoriaId/recetas', (req: Request<{ categoriaId: string }>, res: Response) => {
    const categoriaId = parseInt(req.params.categoriaId!);
    const recetasFiltradas = recetas.filter(r => r.categoriaId === categoriaId);
    res.json(recetasFiltradas);
});


app.get('/recetas/search', (req: Request<{}, {}, {}, { query: string }>, res: Response) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';

    if (!query) {
        return res.status(400).json({ message: 'El parámetro "query" es obligatorio.' });
    }

    const resultados = recetas.filter(r => 
        r.nombre.toLowerCase().includes(query) || 
        r.ingredientes.some(ing => ing.toLowerCase().includes(query))
    );

    res.json(resultados);
});

app.get('/recetas/fast', (req: Request, res: Response) => {
    const recetasRapidas = recetas.filter(r => r.tiempoPreparacion <= 30);
    res.json(recetasRapidas);
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`Documentación de la API disponible en http://localhost:${PORT}/docs`);
});