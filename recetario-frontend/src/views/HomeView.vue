<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router'; 
import { 
    getCategorias, 
    createCategoria, 
    deleteCategoria, 
    updateCategoria,
    type Categoria 
} from '@/services/api';

const categorias = ref<Categoria[]>([]);
const mensajeError = ref('');
const nuevoNombre = ref('');
const nuevaDescripcion = ref('');
const categoriaEnEdicion = ref<Categoria | null>(null);
const nuevoNombreEditado = ref('');
const nuevaDescripcionEditada = ref('');

const cargarCategorias = async () => {
  mensajeError.value = '';
  try {
    const data = await getCategorias();
    categorias.value = data;
  } catch (e) {
    mensajeError.value = 'No se pudieron cargar las categorías. Asegúrese que el backend esté corriendo en http://localhost:3000.';
  }
};

const manejarCrearCategoria = async () => {
  mensajeError.value = '';
  if (!nuevoNombre.value || !nuevaDescripcion.value) {
    mensajeError.value = 'El nombre y la descripción son obligatorios.';
    return;
  }
  try {
    const nuevaCat = await createCategoria(nuevoNombre.value, nuevaDescripcion.value);
    categorias.value.push(nuevaCat);
    nuevoNombre.value = '';
    nuevaDescripcion.value = '';
  } catch (error) {
    mensajeError.value = 'Error al crear la categoría. Revise la consola.';
  }
};

const iniciarEdicion = (categoria: Categoria) => {
    categoriaEnEdicion.value = categoria;
    nuevoNombreEditado.value = categoria.nombre;
    nuevaDescripcionEditada.value = categoria.descripcion;
};

const cancelarEdicion = () => {
    categoriaEnEdicion.value = null;
};

const manejarActualizarCategoria = async () => {
    mensajeError.value = '';
    if (!categoriaEnEdicion.value) return;

    const categoriaActualizada: Categoria = {
        ...categoriaEnEdicion.value,
        nombre: nuevoNombreEditado.value,
        descripcion: nuevaDescripcionEditada.value,
    };

    try {
        const respuesta = await updateCategoria(categoriaActualizada);
        const index = categorias.value.findIndex(c => c.id === respuesta.id);
        if (index !== -1) {
            categorias.value[index] = respuesta;
        }
        cancelarEdicion();
    } catch (error) {
        mensajeError.value = 'Error al actualizar la categoría.';
    }
};

const manejarEliminarCategoria = async (categoriaId: number, nombre: string) => {
    mensajeError.value = '';
    if (!confirm(`¿Está seguro de que desea eliminar la categoría "${nombre}" y todas sus recetas asociadas?`)) {
        return;
    }
    
    try {
        await deleteCategoria(categoriaId);
        categorias.value = categorias.value.filter(c => c.id !== categoriaId);
    } catch (e) {
        mensajeError.value = 'Error al eliminar la categoría.';
    }
};

onMounted(cargarCategorias);
</script>

<template>
  <div class="container">
    <h1>Administrador de Categorías 🍲</h1>

    <div v-if="mensajeError" class="alert-error">
      {{ mensajeError }}
    </div>

    <div class="section">
      <h2>Crear Nueva Categoría</h2>
      <form @submit.prevent="manejarCrearCategoria">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="nuevoNombre" required>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="nuevaDescripcion" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">➕ Crear Categoría</button>
      </form>
    </div>

    <h2>Lista de Categorías Existentes ({{ categorias.length }})</h2>
    
    <div v-for="categoria in categorias" :key="categoria.id" class="list-item">
        
        <template v-if="categoriaEnEdicion?.id === categoria.id">
            <div class="form-inline">
                <input v-model="nuevoNombreEditado" type="text" required>
                <input v-model="nuevaDescripcionEditada" type="text" required>
                <div class="actions">
                    <button @click.prevent="manejarActualizarCategoria" class="btn btn-primary">💾 Guardar</button>
                    <button type="button" @click="cancelarEdicion" class="btn btn-danger">❌ Cancelar</button>
                </div>
            </div>
        </template>

        <template v-else>
            <div>
              <p class="item-title">{{ categoria.nombre }}</p>
              <p class="item-desc">ID: {{ categoria.id }} | {{ categoria.descripcion }}</p>
            </div>
            
            <div class="actions">
                <button @click="iniciarEdicion(categoria)" class="btn btn-warning">✏️ Editar</button>
                <RouterLink :to="{ name: 'recetas', params: { id: categoria.id } }" class="btn btn-info">🍽️ Ver Recetas</RouterLink>
                <button @click="manejarEliminarCategoria(categoria.id, categoria.nombre)" class="btn btn-danger">🗑️ Eliminar</button>
            </div>
        </template>
    </div>
  </div>
</template>

<style scoped>
/* Estilos necesarios para la edición inline */
.form-inline {
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: center;
}
.form-inline input {
    flex-grow: 1;
    margin: 0;
    width: auto; /* Anula width: 100% de .form-group input */
}
.list-item {
    align-items: flex-start; /* Ajuste para el modo edición */
}
</style>