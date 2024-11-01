<template>
  <section class="db-table">
    <ElContainer>
      <!-- <ElHeader>
        <ElRow :gutter="16" class="">
          <ElCol :span="8"> </ElCol>
          <ElCol :span="8"> </ElCol>
        </ElRow>
      </ElHeader> -->
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
            <!-- <ElButton @click="getTableSQLCreation">生成创建表SQL</ElButton> -->
            <!-- <ElButton @click="getTableCSModel">生成C#模型</ElButton> -->
          </ElCol>
          <!-- <ElCol :span="8" class="db-table-sql-creation">
              <ElInput type="textarea" v-model="sqlCreation" />
            </ElCol>
            <ElCol :span="8" class="db-table-cs-model">
              <ElInput type="textarea" v-model="csModel" />
            </ElCol> -->
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <ElTable
              :data="dbTable.dbTableColumns.sort((a, b) => a.index - b.index)"
              @row-click="editDbTableColumn"
            >
              <ElTableColumn prop="name" label="名称" width="144" />
              <ElTableColumn prop="desc" label="描述" min-width="144" />
              <ElTableColumn prop="sqlType" label="数据类型" min-width="144" />
              <ElTableColumn prop="isRequiredName" label="必填" width="64" />
              <ElTableColumn prop="isUniqueName" label="唯一" width="64" />
              <ElTableColumn prop="isListPropName" label="列表字段" width="80" />
              <ElTableColumn prop="isGetPropName" label="获取字段" width="80" />
              <ElTableColumn prop="isCreatePropName" label="创建字段" width="80" />
              <ElTableColumn prop="isUpdatePropName" label="更新字段" width="80" />
              <ElTableColumn prop="isImportPropName" label="导入字段" width="80" />
              <ElTableColumn label="操作" width="72">
                <template #default="{ row }: { row: DbTableColumn }">
                  <template v-if="!isDefaultColumn(row)">
                    <ElButton
                      type="danger"
                      @click="dbTable.dbTableColumns.remove(row)"
                      size="small"
                    >
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
        v-show="drawer.show && drawer.type === 'column' && drawer.column.value"
        :column="drawer.column.value"
        @submit="submitDbTableColumn"
      />
      <!-- <ElForm>
        <ElFormItem>
          <ElInput type="textarea" v-model="parser.content" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="parse">解析</ElButton>
          <ElButton @click="closeParser">取消</ElButton>
        </ElFormItem>
      </ElForm> -->
    </ElDrawer>
  </section>
</template>
<script setup lang="ts">
import { computed, type Ref, ref, reactive } from 'vue';
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
const newColumn = ref(new DbTableColumn({}));
const sqlCreation = ref('');
const csModel = ref('');
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
  type: '' as '' | 'column',
  column: {
    value: undefined as undefined | DbTableColumn,
  },
});
const editDbTableColumn = (column: DbTableColumn) => {
  drawer.show = true;
  drawer.type = 'column';
  drawer.column.value = column;
};
const submitDbTableColumn = (column?: DbTableColumn) => {
  drawer.show = false;
  drawer.type = '';
  if (!drawer.column.value || !column) return;
  drawer.column.value.name = column.name;
  drawer.column.value.desc = column.desc;
  drawer.column.value.index = column.index;
  drawer.column.value.type = column.type;
  drawer.column.value.size = column.size;
  drawer.column.value.scale = column.scale;
  drawer.column.value.isPrimary = column.isPrimary;
  drawer.column.value.default = column.default;
  drawer.column.value.isUnique = column.isUnique;
  drawer.column.value.isListProp = column.isListProp;
  drawer.column.value.isGetProp = column.isGetProp;
  drawer.column.value.isCreateProp = column.isCreateProp;
  drawer.column.value.isUpdateProp = column.isUpdateProp;
  drawer.column.value.isImportProp = column.isImportProp;
  drawer.column.value = undefined;
};
const drawerClosed = () => {
  drawer.type = '';
  drawer.column.value = undefined;
};
const parser: Ref<{ shown: boolean; type: 'dbTable' | 'json'; content: string }> = ref({
  shown: false,
  type: 'dbTable',
  content: '',
});
async function getTableSQLCreation() {
  sqlCreation.value = await dbTable.value.getSQLCreation();
}
async function getTableCSModel() {
  csModel.value = await dbTable.value.getCSModel();
}
function openParser(type: 'dbTable' | 'json') {
  parser.value.shown = true;
  parser.value.type = type;
  parser.value.content = '';
}
function closeParser() {
  parser.value.shown = false;
  parser.value.content = '';
}
function parse() {
  // let res = false;
  // switch (parser.value.type) {
  //   case 'dbTable':
  //     try {
  //       const _dbTableColumns = parser.value.content.split('\n').map((i) => {
  //         const [name, desc, type, , isRequired, def, isForeign, associated] = i.split('\t');
  //         return new DbTableColumn({
  //           name,
  //           desc,
  //           type,
  //           isRequired: isRequired === '是',
  //           default: def,
  //           isForeign: isForeign === '是',
  //           associated,
  //         });
  //       });
  //       dbTable.value.dbTableColumns = _dbTableColumns;
  //       res = true;
  //     } catch {}
  //     break;
  //   case 'json':
  //     try {
  //       const _dbTable = new Table(JSON.parse(parser.value.content));
  //       dbTable.value = _dbTable;
  //       res = true;
  //     } catch {}
  //     break;
  // }
  // if (res) closeParser();
  // else ElMessage.error('解析失败！');
}
function isDefaultColumn(dbTableColumn: DbTableColumn) {
  return ['ID', 'CREATEBY', 'CREATETIME', 'MODIFYBY', 'MODIFYTIME', 'DELETEFLAG'].includes(
    dbTableColumn.name.toUpperCase()
  );
}
function pushNewColumn() {
  if (
    dbTable.value.dbTableColumns
      .map(({ name }) => name.toUpperCase())
      .includes(newColumn.value.name.toUpperCase())
  ) {
    ElMessage.error('请勿重复添加属性');
    return;
  }
  dbTable.value.dbTableColumns.push(new DbTableColumn(newColumn.value));
  clearNewColumn();
}
function clearNewColumn() {
  newColumn.value = new DbTableColumn({});
}
/** 初始化 */
async function init() {}
init();
</script>
<style lang="scss" scoped>
// $dbTable-line-height: 0.32rem;
// $dbTable-font-size-base: 0.16rem;
// $el-tabs-header-height: calc(var(--el-tabs-header-height, 40px) - 1px);
// .db-table {
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   > .el-container {
//     width: 100%;
//     height: 100%;
//     overflow: hidden;
//     display: flex;
//     flex-direction: column;
//     > .el-header {
//       flex: none;
//       width: 100%;
//       height: 0.64rem;
//       padding: 0.16rem 0;
//     }
//     > .el-main {
//       flex: 1;
//       width: 100%;
//       overflow: hidden;
//       padding: 0;
//       > .el-row {
//         width: 100%;
//         height: 100%;
//         overflow: hidden;
//       }
//     }
//   }
//   :deep(.el-overlay) {
//     top: $el-tabs-header-height;
//     height: calc(100% - $el-tabs-header-height);
//   }
//   .db-table-form {
//     height: 100%;
//     overflow: hidden auto;
//   }
//   .db-table-sql-creation {
//     height: 100%;
//     overflow: hidden;
//     .el-textarea {
//       height: 100%;
//       :deep(textarea) {
//         height: 100%;
//       }
//     }
//   }
//   .db-table-cs-model {
//     height: 100%;
//     overflow: hidden;
//     .el-textarea {
//       height: 100%;
//       :deep(textarea) {
//         height: 100%;
//       }
//     }
//   }
//   .db-table-drawer {
//     .el-form {
//       height: 100%;
//       display: flex;
//       flex-direction: dbTableColumn;
//       .el-form-item:nth-child(1) {
//         flex: 1;
//       }
//       .el-form-item:nth-child(2) {
//         flex: none;
//       }
//       .el-textarea {
//         height: 100%;
//         :deep(textarea) {
//           height: 100%;
//         }
//       }
//     }
//   }
// }
</style>
