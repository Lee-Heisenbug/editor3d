<template>
  <div class="scene-hierarchy">
    <a-tree
      :fieldNames="{
        title: 'name',
        key: 'id',
        children: 'children'
      }"
      :tree-data="data"
    ></a-tree>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'

interface Node {
  id: string
  name: string
  children: Node[]
}

let selected = ref([])
let opened = ref([])

watch(selected, (v) => {
  console.log('selected: ', v)
})

watch(opened, (v) => {
  console.log('opened: ', v)
})

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

  background: white;
  overflow: auto;
}
</style>
