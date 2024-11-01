<template>
  <ElConfigProvider :locale="zhCn">
    <ElTabs class="code-generator-tabs">
      <ElTabPane label="DbTable"><DbTableView /></ElTabPane>
    </ElTabs>
  </ElConfigProvider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { ElConfigProvider, ElTabs, ElTabPane } from 'element-plus';
// import { RouterLink, RouterView } from 'vue-router';
import DbTableView from '@/views/DbTableView.vue';
</script>
<style lang="scss" scoped>
.code-generator {
  // width: 100%;
  // height: 100%;
  // overflow: hidden;
  &-tabs {
    //   width: 100%;
    //   height: 100%;
    //   overflow: hidden;
    //   display: flex;
    //   flex-direction: column;
    //   :deep(.el-tabs__header) {
    //     flex: none;
    //     .el-tabs__nav-wrap {
    //       padding: 0 0.2rem;
    //     }
    //   }
    //   :deep(.el-tabs__content) {
    //     flex: 1;
    //     .el-tab-pane {
    //       width: 100%;
    //       height: 100%;
    //       overflow: hidden;
    //     }
    //   }
    //   :deep(.el-tabs__header) {
    //     margin: 0;
    //     background-color: whitesmoke;
    //   }
    //   :deep(.el-tab-pane) {
    //     overflow: hidden;
    //   }
  }
}
// #logo {
//   display: block;
//   width: 50%;
//   height: 50%;
//   margin: auto;
//   padding: 10% 0 0;
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
//   background-origin: content-box;
// }
</style>
