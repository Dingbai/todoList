<script setup lang="ts">
import SideBar from './sideBar/SideBar.vue'
import Content from './content/Content.vue'
</script>
<template>
  <div class="layout-Container">
    <SideBar />
    <Content /> 
  </div>
</template>
<style lang="less" scoped>
.layout-Container {
  display: flex;
}
</style>
