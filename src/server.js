
import express from 'express';
import cors from 'cors';

let categorias = [
    { id: 1, nombre: 'Postres', descripcion: 'Dulces, tortas y pasteles.' },
    { id: 2, nombre: 'Comida Rápida', descripcion: 'Recetas sencillas y rápidas.' },
    { id: 3, nombre: 'Comida Mexicana', descripcion: 'Tacos, enchiladas y más.' },
];
let recetas = [
    { id: 101, categoriaId: 1, nombre: 'Tarta de Limón', ingredientes: ['Limón', 'Mantequilla', 'Azúcar', 'Huevo'], instrucciones: 'Mezclar y hornear a 180°C por 30 minutos.', tiempoPreparacion: 50 },
    { id: 103, categoriaId: 2, nombre: 'Hamburguesa Clásica', ingredientes: ['Pan', 'Carne', 'Queso', 'Lechuga', 'Tomate'], instrucciones: 'Asar la carne y armar.', tiempoPreparacion: 15 },
    { id: 104, categoriaId: 3, nombre: 'Tacos al Pastor', ingredientes: ['Carne de cerdo', 'Piña', 'Tortillas', 'Cilantro'], instrucciones: 'Adobar, cocinar y servir.', tiempoPreparacion: 90 },
];
let nextCategoriaId = Math.max(...categorias.map(c => c.id)) + 1;
let nextRecetaId = Math.max(...recetas.map(r => r.id)) + 1;
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.get('/categorias', (req, res) => {
    res.json(categorias);
});

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

app.get('/categorias/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
    }
    res.json(categoria);
});

app.get('/categorias/:categoriaId/recetas', (req, res) => {
    const categoriaId = parseInt(req.params.categoriaId);
    const recetasFiltradas = recetas.filter(r => r.categoriaId === categoriaId);
    res.json(recetasFiltradas);
});

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

app.delete('/recetas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recetas.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Receta no encontrada.' });
    }
    recetas.splice(index, 1);
    res.status(204).send();
});
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
