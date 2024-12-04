<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    required: false
  },
  labelCol: {
    type: Object,
    default: () => ({ span: 4 })
  },
  wrapperCol: {
    type: Object,
    default: () => ({ span: 10 })
  }
})
</script>
<template>
  <a-row class="column-container">
    <a-col :span="props.labelCol.span">
      <div class="label">
        <slot name="label" v-if="$slots.label">
          {{ $slots.label() }}
        </slot>
        <template v-else>{{ props.label }}</template>
      </div>
    </a-col>
    <a-col :span="props.wrapperCol.span">
      <slot />
    </a-col>
  </a-row>
</template>
<style lang="less" scoped>
.column-container {
  width: 100%;
}
.label {
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
}
</style>
