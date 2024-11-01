<template>
  <ElForm>
    <ElFormItem> </ElFormItem>
  </ElForm>
</template>
<script setup lang="ts">
import type { DbTableColumnType } from '@/models/DbTable';
import { ElForm, ElFormItem } from 'element-plus';

type Props = {
  type: DbTableColumnType;
  scale: number;
  size: number;
};
const props = withDefaults(defineProps<Props>(), {});
</script>
