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

let text = ref(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!`)
</script>

<template>
  <div class="editor3d">
    <canvas ref="app3dCanvas" class="app-3d"></canvas>
    <v-card title="Card title" :text="text"></v-card>
  </div>
</template>

<style scoped>
.editor3d {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
