<template>
  <v-list class="hierarchy">
    <HierarchyNode :key="nodeData.id" v-for="nodeData in data" :data="nodeData"></HierarchyNode>
  </v-list>
</template>

<script setup lang="ts">
import HierarchyNode, { type Node } from './HierarchyNode.vue'

defineProps<{
  data: Node[]
}>()
</script>

<style scoped>
.hierarchy {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
