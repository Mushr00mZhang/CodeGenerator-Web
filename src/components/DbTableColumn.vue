<template>
  <ElRow>
    <ElForm ref="columnFormRef" :model="newColumn" :rules="rules" label-width="auto">
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="序号" prop="index">
            <ElInputNumber v-model="newColumn.index" :min="1" :disabled="newColumn.isDefaultProp" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="名称" prop="name">
            <ElInput type="text" v-model="newColumn.name" :disabled="newColumn.isDefaultProp" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="描述" prop="desc">
            <ElInput type="text" v-model="newColumn.desc" :disabled="newColumn.isDefaultProp" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="数据类型" prop="type">
            <ElSelect
              v-model="newColumn.type"
              value-key="name"
              :disabled="newColumn.isDefaultProp && !newColumn.isPrimary"
              @change="typeChanged"
            >
              <template
                v-for="t in newColumn.isPrimary ? dbTableColumnPkTypes : dbTableColumnTypes"
              >
                <ElOption :label="t.name" :value="t" />
              </template>
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="长度" prop="size" v-show="newColumn.type?.size">
            <ElInputNumber v-model="newColumn.size" :min="1" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="小数位数" prop="scale" v-show="newColumn.type?.scale">
            <ElInputNumber v-model="newColumn.scale" :min="1" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="必填" prop="isRequired">
            <ElRadioGroup v-model="newColumn.isRequired" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="唯一" prop="isUnique">
            <ElRadioGroup v-model="newColumn.isUnique" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem
            label="获取字段"
            prop="isGetProp"
            v-show="newColumn.isRequired && newColumn.isUnique"
          >
            <ElRadioGroup v-model="newColumn.isGetProp" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="搜索字段" prop="isListProp">
            <ElRadioGroup v-model="newColumn.isListProp" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="精确匹配" prop="isFullyMatch" v-show="newColumn.isListProp">
            <ElRadioGroup v-model="newColumn.isFullyMatch" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="创建字段" prop="isCreateProp">
            <ElRadioGroup v-model="newColumn.isCreateProp" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="更新字段" prop="isUpdateProp">
            <ElRadioGroup v-model="newColumn.isUpdateProp" :disabled="newColumn.isDefaultProp">
              <ElRadioButton :value="true">是</ElRadioButton>
              <ElRadioButton :value="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem>
        <ElButton type="primary" @click="submit">提交</ElButton>
        <ElButton @click="reset">重置</ElButton>
      </ElFormItem>
    </ElForm>
  </ElRow>
</template>
<script setup lang="ts">
import {
  computed,
  type Ref,
  ref,
  reactive,
  onMounted,
  useTemplateRef,
  onActivated,
  watch,
  watchEffect,
} from 'vue';
import {
  DbTable,
  DbTableColumn,
  type DbTableFormRule,
  type DbTableColumnFormRule,
  DbTableColumnTypes,
} from '@/models/DbTable';
import {
  ElConfigProvider,
  ElMessage,
  ElMessageBox,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElRow,
  ElCol,
  ElRadioButton,
  ElRadioGroup,
  ElSwitch,
  ElSelect,
  ElOption,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElInputNumber,
  ElCollapse,
  ElCollapseItem,
  ElDrawer,
  ElTable,
  ElTableColumn,
  type FormRules,
  type FormInstance,
} from 'element-plus';
const columnFormRef = useTemplateRef('columnFormRef');
/** 字段表单规则列表 */
const rules = reactive<FormRules<DbTableColumnFormRule>>({
  name: [{ required: true, message: '请填写名称' }],
  desc: [{ required: true, message: '请填写描述' }],
  type: [{ required: true, message: '请选择数据类型' }],
  size: [{ required: true, message: '请填写长度' }],
  scale: [{ required: true, message: '请填写精度' }],
  isRequired: [{ required: true, message: '请选择是否必填' }],
  isUnique: [{ required: true, message: '请选择是否唯一' }],
  isListProp: [{ required: true, message: '请选择是否列表搜索字段' }],
  isFullyMatch: [{ required: true, message: '请选择是否精确匹配' }],
  isGetProp: [{ required: true, message: '请选择是否获取字段' }],
  isCreateProp: [{ required: true, message: '请选择是否创建字段' }],
  isUpdateProp: [{ required: true, message: '请选择是否更新字段' }],
  isImportProp: [{ required: true, message: '请选择是否导入字段' }],
});
const dbTableColumnTypes = reactive(DbTableColumnTypes);
const dbTableColumnPkTypes = reactive(DbTableColumnTypes.filter((i) => i.isPrimary));
const newColumn = ref<DbTableColumn>(new DbTableColumn({}));
const typeChanged = () => {
  if (rules.size && 0 in rules.size) rules.size[0].required = newColumn.value?.type?.size;
  if (rules.scale && 0 in rules.scale) rules.scale[0].required = newColumn.value?.type?.scale;
};
const submit = async () => {
  const res = await columnFormRef.value?.validate();
  if (!res) return;
  emit('submit', newColumn.value);
};
const reset = () => {
  newColumn.value = new DbTableColumn(props.column);
  columnFormRef.value?.clearValidate();
};
type Props = {
  column?: DbTableColumn;
};
const props = withDefaults(defineProps<Props>(), {
  column: () => new DbTableColumn({}),
});
type Emits = {
  submit: [DbTableColumn | undefined];
};
const emit = defineEmits<Emits>();
defineExpose({ reset });
watch(() => props.column.name, reset);
onMounted(reset);
</script>
