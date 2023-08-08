<template>
  <v-card title="场景" height="100%" class="scene-hierarchy overflow-auto bg-white">
    <v-card-text>
      <v-list class="hierarchy" density="compact">
        <HierarchyNode :key="nodeData.id" v-for="nodeData in data" :data="nodeData"></HierarchyNode>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import HierarchyNode, { type Node } from './HierarchyNode.vue'

defineProps<{
  data: Node[]
}>()
</script>

<style scoped>
.scene-hierarchy {
  position: fixed;
  top: 0;
  left: 0;

  width: 300px;
  height: 100%;
}
</style>
