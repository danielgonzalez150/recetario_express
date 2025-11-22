<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { 
    getRecetasPorCategoria, 
    createReceta, 
    deleteReceta, 
    updateReceta,
    getCategoriaById, 
    type Receta, 
    type Categoria 
} from '@/services/api';

const props = defineProps<{ id: string }>(); 

const recetas = ref<Receta[]>([]);
const categoria = ref<Categoria | null>(null);
const mensajeError = ref('');

// Formulario de Nueva Receta
const nuevaReceta = ref({
    nombre: '',
    ingredientes: '', // String separado por comas
    instrucciones: '',
    tiempoPreparacion: 30
});

// Estado para la Edición
const recetaEnEdicion = ref<Receta | null>(null);
const nombreEditado = ref('');
const ingredientesEditados = ref('');
const instruccionesEditadas = ref('');
const tiempoEditado = ref(0);


const categoriaIdNumerico = computed(() => parseInt(props.id));

const cargarDatos = async () => {
    mensajeError.value = '';
    const id = categoriaIdNumerico.value;

    try {
        categoria.value = await getCategoriaById(id);
        const data = await getRecetasPorCategoria(id);
        recetas.value = data;
    } catch (e) {
        mensajeError.value = 'No se pudo cargar la categoría o las recetas. Asegúrese que el ID sea correcto.';
    }
};

const manejarCrearReceta = async () => {
    mensajeError.value = '';
    const ingredientesArray = nuevaReceta.value.ingredientes.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const recetaDataParaEnvio = {
        ...nuevaReceta.value,
        ingredientes: ingredientesArray,
        categoriaId: categoriaIdNumerico.value,
        tiempoPreparacion: Number(nuevaReceta.value.tiempoPreparacion)
    };

    try {
        const nueva = await createReceta(recetaDataParaEnvio);
        recetas.value.push(nueva);
        nuevaReceta.value = { nombre: '', ingredientes: '', instrucciones: '', tiempoPreparacion: 30 };
    } catch (e) {
        mensajeError.value = 'Error al crear la receta.';
    }
};

const manejarEliminarReceta = async (recetaId: number) => {
    mensajeError.value = '';
    if (!confirm('¿Está seguro de que desea eliminar esta receta?')) return;

    try {
        await deleteReceta(recetaId);
        recetas.value = recetas.value.filter(r => r.id !== recetaId);
    } catch (e) {
        mensajeError.value = 'Error al eliminar la receta.';
    }
};

// --- Lógica de Edición ---
const iniciarEdicion = (receta: Receta) => {
    recetaEnEdicion.value = receta;
    nombreEditado.value = receta.nombre;
    ingredientesEditados.value = receta.ingredientes.join(', '); 
    instruccionesEditadas.value = receta.instrucciones;
    tiempoEditado.value = receta.tiempoPreparacion;
};

const cancelarEdicion = () => {
    recetaEnEdicion.value = null;
};

const manejarActualizarReceta = async () => {
    mensajeError.value = '';
    if (!recetaEnEdicion.value) return;

    const recetaActualizada: Receta = {
        ...recetaEnEdicion.value,
        nombre: nombreEditado.value,
        // Limpia y convierte la cadena de ingredientes en un array
        ingredientes: ingredientesEditados.value.split(',').map(s => s.trim()).filter(s => s.length > 0),
        instrucciones: instruccionesEditadas.value,
        tiempoPreparacion: Number(tiempoEditado.value),
    };

    try {
        const respuesta = await updateReceta(recetaActualizada);
        const index = recetas.value.findIndex(r => r.id === respuesta.id);
        if (index !== -1) {
            recetas.value[index] = respuesta;
        }
        cancelarEdicion();
    } catch (error) {
        mensajeError.value = 'Error al actualizar la receta.';
    }
};


onMounted(cargarDatos);
</script>

<template>
  <div class="container">
    <div class="back-link">
        <RouterLink to="/" class="btn btn-info">← Volver a Categorías</RouterLink>
    </div>
    
    <h1 v-if="categoria">{{ categoria.nombre }} - Recetas</h1>
    <h1 v-else>Cargando Recetas...</h1>

    <div v-if="mensajeError" class="alert-error">
      {{ mensajeError }}
    </div>

    <div class="section">
      <h2>Añadir Nueva Receta</h2>
      <form @submit.prevent="manejarCrearReceta">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="nuevaReceta.nombre" required>
        </div>
        <div class="form-group">
          <label>Tiempo de Preparación (min)</label>
          <input type="number" v-model="nuevaReceta.tiempoPreparacion" min="1" required>
        </div>
        <div class="form-group">
          <label>Ingredientes (Separar por coma)</label>
          <textarea v-model="nuevaReceta.ingredientes" required></textarea>
        </div>
        <div class="form-group">
          <label>Instrucciones</label>
          <textarea v-model="nuevaReceta.instrucciones" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">➕ Crear Receta</button>
      </form>
    </div>

    <h2>Recetas Disponibles ({{ recetas.length }})</h2>
    
    <div v-for="receta in recetas" :key="receta.id" class="list-item">
        
        <template v-if="recetaEnEdicion?.id === receta.id">
            <div class="section-edit">
                <h3>Editando Receta (ID: {{ receta.id }})</h3>
                <form @submit.prevent="manejarActualizarReceta">
                    <div class="form-group">
                        <input v-model="nombreEditado" type="text" required placeholder="Nombre">
                    </div>
                    <div class="form-group">
                        <input v-model="tiempoEditado" type="number" min="1" required placeholder="Tiempo (min)">
                    </div>
                    <div class="form-group">
                        <textarea v-model="ingredientesEditados" placeholder="Ingredientes (separados por coma)" required></textarea>
                    </div>
                    <div class="form-group">
                        <textarea v-model="instruccionesEditadas" placeholder="Instrucciones" required></textarea>
                    </div>
                    
                    <div class="actions">
                        <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                        <button type="button" @click="cancelarEdicion" class="btn btn-danger">❌ Cancelar</button>
                    </div>
                </form>
            </div>
        </template>

        <template v-else>
            <div class="receta-content">
                <div class="item-header">
                    <p class="item-title">{{ receta.nombre }}</p>
                    <p class="item-desc">Tiempo: {{ receta.tiempoPreparacion }} min (ID: {{ receta.id }})</p>
                </div>

                <div class="recipe-details">
                    <h3>Ingredientes:</h3>
                    <ul>
                        <li v-for="(ing, index) in receta.ingredientes" :key="index">{{ ing }}</li>
                    </ul>
                    <h3>Instrucciones:</h3>
                    <pre>{{ receta.instrucciones }}</pre>
                </div>
            </div>
            
            <div class="actions">
                <button @click="iniciarEdicion(receta)" class="btn btn-warning">✏️ Editar</button>
                <button @click="manejarEliminarReceta(receta.id)" class="btn btn-danger">🗑️ Eliminar</button>
            </div>
        </template>
    </div>
    
  </div>
</template>

<style scoped>
/* Estilos locales para ajustar la vista de Recetas */
.back-link {
    margin-bottom: 20px;
}
.list-item {
    align-items: flex-start;
    flex-direction: column; /* Apilamos contenido y acciones */
}
.item-header {
    width: 100%;
    margin-bottom: 10px;
}
.receta-content {
    width: 100%;
}
.recipe-details {
    margin-top: 10px;
}
.recipe-details pre {
    /* Estilo para <pre> definido en main.css */
    margin-top: 5px;
}
.section-edit {
    width: 100%;
    padding: 10px;
    border-left: 5px solid #ffc107;
    background-color: #fffbe6;
    border-radius: 4px;
}
.section-edit h3 {
    margin-bottom: 10px;
}
.section-edit .actions {
    justify-content: flex-end;
    margin-top: 15px;
}
</style>