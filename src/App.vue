<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createApp3D } from './app-3d/createApp3D'
let app3dCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (app3dCanvas.value) {
    let app3d = createApp3D(app3dCanvas.value)
    app3d.initiate()
  }
})
</script>

<template>
  <div class="editor3d">
    <canvas ref="app3dCanvas" class="app-3d"></canvas>
  </div>
</template>

<style scoped>
.editor3d {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
