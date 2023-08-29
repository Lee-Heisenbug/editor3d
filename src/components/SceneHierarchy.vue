<template>
  <div class="scene-hierarchy">
    <a-typography-title :level="5">场景</a-typography-title>
    <a-divider />
    <div class="container">
      <a-tree
        v-if="data.length"
        :fieldNames="{
          title: 'name',
          key: 'id',
          children: 'children'
        }"
        :tree-data="data"
        :selectedKeys="selecteds"
        default-expand-all
        @select="emitSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Node {
  id: string
  name: string
  children: Node[]
}

defineProps<{
  data: Node[]
  selecteds: string[]
}>()

let emit = defineEmits<{
  select: [selectedKeys: string[]]
}>()

function emitSelect(selectedKeys: string[]) {
  emit('select', selectedKeys)
}
</script>

<style scoped>
.scene-hierarchy {
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;
  left: 0;

  width: 300px;
  height: 100%;
  padding: 0.5em;

  background: white;
}

.ant-divider {
  margin: 0 0 0.5em 0;
}

.scene-hierarchy .container {
  flex-grow: 1;
  overflow: auto;
}
</style>
