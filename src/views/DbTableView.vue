<template>
  <section class="db-table">
    <ElContainer>
      <ElMain>
        <ElRow :gutter="16">
          <ElCol :span="12" class="db-table-form">
            <ElForm ref="dbTableFormEl" :model="dbTable" :rules="dbTableRules" label-width="auto">
              <ElFormItem label="名称" prop="name">
                <ElInput type="text" v-model="dbTable.name" />
              </ElFormItem>
              <ElFormItem label="描述" prop="desc">
                <ElInput type="text" v-model="dbTable.desc" />
              </ElFormItem>
              <ElFormItem label="数据库" prop="db">
                <ElInput type="text" v-model="dbTable.db" />
              </ElFormItem>
              <ElFormItem label="架构" prop="schema">
                <ElInput type="text" v-model="dbTable.schema" />
              </ElFormItem>
              <ElFormItem label="命名空间" prop="namespace">
                <ElInput type="text" v-model="dbTable.namespace" />
              </ElFormItem>
            </ElForm>
          </ElCol>
          <ElCol :span="12">
            <ElButton type="primary" @click="addDbTableColumn">新增字段</ElButton>
            <ElButton type="success" @click="getDbTableCreationSql">生成创建表SQL</ElButton>
            <ElButton type="warning" @click="getDbTableCsModel">生成C#模型</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElTable
              :data="dbTable.columns.sort((a, b) => a.index - b.index)"
              @row-click="editDbTableColumn"
            >
              <ElTableColumn prop="index" label="序号" width="64" fixed />
              <ElTableColumn prop="name" label="名称" width="144" fixed />
              <ElTableColumn prop="desc" label="描述" min-width="144" fixed />
              <ElTableColumn prop="sqlType" label="数据类型" min-width="144" fixed />
              <ElTableColumn prop="isRequiredName" label="必填" width="64" />
              <ElTableColumn prop="isUniqueName" label="唯一" width="64" />
              <ElTableColumn prop="isListPropName" label="搜索字段" width="80" />
              <ElTableColumn prop="isGetPropName" label="获取字段" width="80" />
              <ElTableColumn prop="isCreatePropName" label="创建字段" width="80" />
              <ElTableColumn prop="isUpdatePropName" label="更新字段" width="80" />
              <ElTableColumn prop="isImportPropName" label="导入字段" width="80" />
              <ElTableColumn label="操作" width="72">
                <template #default="{ row }: { row: DbTableColumn }">
                  <template v-if="!isDefaultColumn(row)">
                    <ElButton type="danger" @click="dbTable.columns.remove(row)" size="small">
                      删除
                    </ElButton>
                  </template>
                </template>
              </ElTableColumn>
            </ElTable>
          </ElCol>
        </ElRow>
      </ElMain>
    </ElContainer>
    <ElDrawer
      v-model="drawer.show"
      @close="drawerClosed"
      direction="rtl"
      class="db-table-drawer"
      size="75%"
    >
      <DbTableColumnComponent
        ref="dbTableColumnRef"
        v-show="drawer.type === 'column'"
        :column="drawer.column.value"
        @submit="submitDbTableColumn"
      />
      <ElInput
        v-show="drawer.type === 'textarea'"
        type="textarea"
        v-model="drawer.textarea.value"
      />
    </ElDrawer>
  </section>
</template>
<script setup lang="ts">
import { computed, type Ref, ref, reactive, useTemplateRef } from 'vue';
import {
  DbTable,
  DbTableColumn,
  type DbTableFormRule,
  type DbTableColumnFormRule,
  DbTableColumnTypes,
} from '@/models/DbTable';
import DbTableColumnComponent from '@/components/DbTableColumn.vue';
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
  ElCollapse,
  ElCollapseItem,
  ElDrawer,
  ElTable,
  ElTableColumn,
  type FormRules,
  type FormInstance,
  ElInputNumber,
} from 'element-plus';
const dbTable = ref(new DbTable({}));
/** 数据表表单dom元素 */
const dbTableFormEl = ref<FormInstance>();
/** 数据表表单规则列表 */
const dbTableRules = reactive<FormRules<DbTableFormRule>>({
  name: [{ required: true, message: '请填写名称' }],
  desc: [{ required: true, message: '请填写描述' }],
  db: [{ required: true, message: '请填写数据库' }],
  schema: [{ required: true, message: '请填写架构' }],
  namespace: [{ required: true, message: '请填写命名空间' }],
});
const drawer = reactive({
  show: false,
  type: '' as '' | 'column' | 'textarea',
  column: {
    value: undefined as undefined | DbTableColumn,
  },
  textarea: {
    value: '',
  },
});
const dbTableColumnRef = useTemplateRef('dbTableColumnRef');
const addDbTableColumn = () => {
  drawer.show = true;
  drawer.type = 'column';
  drawer.column.value = undefined;
  dbTableColumnRef.value?.reset();
};
const editDbTableColumn = (column: DbTableColumn) => {
  drawer.show = true;
  drawer.type = 'column';
  drawer.column.value = column;
};
const submitDbTableColumn = (column?: DbTableColumn) => {
  drawer.show = false;
  drawer.type = '';
  if (!column) return;
  if (drawer.column.value) {
    drawer.column.value.name = column.name;
    drawer.column.value.desc = column.desc;
    drawer.column.value.index = column.index;
    drawer.column.value.type = column.type;
    drawer.column.value.size = column.size;
    drawer.column.value.scale = column.scale;
    drawer.column.value.isPrimary = column.isPrimary;
    drawer.column.value.isRequired = column.isRequired;
    drawer.column.value.default = column.default;
    drawer.column.value.isUnique = column.isUnique;
    drawer.column.value.isListProp = column.isListProp;
    drawer.column.value.isFullyMatch = column.isFullyMatch;
    drawer.column.value.isGetProp = column.isGetProp;
    drawer.column.value.isCreateProp = column.isCreateProp;
    drawer.column.value.isUpdateProp = column.isUpdateProp;
    drawer.column.value.isImportProp = column.isImportProp;
    drawer.column.value = undefined;
  } else {
    dbTable.value.columns.push(column);
  }
};
const openTextarea = (text: string) => {
  drawer.show = true;
  drawer.type = 'textarea';
  drawer.textarea.value = text;
};
const drawerClosed = () => {
  drawer.type = '';
  drawer.column.value = undefined;
  drawer.textarea.value = '';
};
const getDbTableCreationSql = () => {
  openTextarea(dbTable.value.creationSql);
};
const getDbTableCsModel = () => {
  openTextarea(dbTable.value.csModel);
};
function isDefaultColumn(dbTableColumn: DbTableColumn) {
  return ['ID', 'CREATEBY', 'CREATETIME', 'MODIFYBY', 'MODIFYTIME', 'DELETEFLAG'].includes(
    dbTableColumn.name.toUpperCase()
  );
}
/** 初始化 */
async function init() {}
init();
</script>
<style lang="scss">
.db-table {
  &-drawer {
    .el-textarea {
      height: 100%;
      textarea {
        height: 100%;
        resize: none;
      }
    }
  }
}
</style>
