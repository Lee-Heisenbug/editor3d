<template>
  <v-list-group class="hierarchy-node" :value="data.name">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :title="data.name"></v-list-item>
    </template>
    <HierarchyNode
      v-for="nodeData in data.children"
      :key="nodeData.id"
      :data="nodeData"
    ></HierarchyNode>
  </v-list-group>
</template>

<script setup lang="ts">
export interface Node {
  id: string
  name: string
  children: Node[]
}

defineProps<{
  data: Node
}>()
</script>

<style scoped>
.hierarchy {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
