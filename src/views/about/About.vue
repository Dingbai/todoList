<script lang="ts" setup>
import pkg from '../../../package.json'

const version: string = pkg.version
</script>
<template>
  <div class="about-container">
    <div class="version">
      <h1>about</h1>
      <span>版本号：</span>
      <span>{{ version }}</span>
    </div>
    <div class="change-log"></div>
  </div>
</template>
<style lang="less" scoped>
.about-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  flex: 1;
  .version {
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;

    color: rgba(0, 0, 0, 0.88);
  }
}
</style>
