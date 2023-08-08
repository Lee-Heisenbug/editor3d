<template>
  <v-list-group
    class="hierarchy-node"
    :value="data.id"
    :collapse-icon="collapseIcon"
    :expand-icon="expandIcon"
  >
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
import { computed } from 'vue'

export interface Node {
  id: string
  name: string
  children: Node[]
}

let props = defineProps<{
  data: Node
}>()

let collapseIcon = computed(() => {
  return props.data.children.length > 0 ? '$collapse' : ''
})

let expandIcon = computed(() => {
  return props.data.children.length > 0 ? '$expand' : ''
})
</script>

<style scoped>
.hierarchy {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
