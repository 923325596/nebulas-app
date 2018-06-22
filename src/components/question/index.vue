<template>
  <el-container class="question">
    <el-header>星云问卷</el-header>
    <el-container class="body">
      <el-aside width="200px" class="side-bar">
        <el-menu
          router
          :default-active="onRoutes"
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="list">
            <i class="el-icon-menu"></i>
            <span slot="title">问卷列表</span>
          </el-menu-item>
          <el-menu-item index="create">
            <i class="el-icon-document"></i>
            <span slot="title">新建问卷</span>
          </el-menu-item>
          <el-menu-item index="help">
            <i class="el-icon-setting"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="content">
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {};
  },
  computed: {
    onRoutes () {
      return this.$route.path.split('/')[2];
    }
  }
};
</script>

<style>
body {
  height: 100%;
}

.question {
  height: 100%;
}
.el-header, .el-footer {
  background-color:#409EFF;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  /* text-align: center; */
}

body > .el-container {
  margin-bottom: 40px;
}

.side-bar {
  display: block;
}

.content {
}
</style>
