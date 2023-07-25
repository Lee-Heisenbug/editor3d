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

let text = ref(`3d编辑器项目`)
</script>

<template>
  <div class="editor3d">
    <canvas ref="app3dCanvas" class="app-3d"></canvas>
    <v-card class="editor3d-card" title="项目说明" :text="text"></v-card>
  </div>
</template>

<style scoped type="scss">
.editor3d {
  position: fixed;
  top: 0;
  left: 0;
}

.editor3d .editor3d-card {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
