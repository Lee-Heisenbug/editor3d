<template>
  <div class="editor3d">
    <canvas ref="app3dCanvas" class="app-3d"></canvas>
    <SceneHierarchy
      :data="hierarchy"
      :selecteds="selecteds"
      @select="selectInApp3D"
    ></SceneHierarchy>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createApp3D, type App3D } from './app-3d/createApp3D'
import SceneHierarchy from './components/SceneHierarchy.vue'
import type { Node } from './components/SceneHierarchy.vue'
let app3dCanvas = ref<HTMLCanvasElement | null>(null)
let app3d: App3D
let hierarchy = ref<Node[]>([])
let selecteds = ref<string[]>([])

onMounted(() => {
  if (app3dCanvas.value) {
    app3d = createApp3D(app3dCanvas.value)
    app3d.initiate()
    app3d.onHierachyChanged((h) => {
      hierarchy.value = h
    })
    app3d.onObjectSelect((id) => {
      if (id) {
        selecteds.value = [id]
      } else {
        selecteds.value = []
      }
    })
  }
})

function selectInApp3D(selectedKeys: string[]) {
  app3d.selectObject(selectedKeys[0])
}
</script>

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
