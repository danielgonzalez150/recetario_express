<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app-container">
    <header>
      <div class="container">
        <h1>📚 Recetario Express & Vue 3</h1>
      </div>
    </header>
    
    <main>
      <RouterView />
    </main>
  </div>
</template>

