<template>
  <el-container class="question">
    <el-header>
      <img src="../../assets/question.png" alt="" class="question-logo">
      <h3>星云问卷</h3>
    </el-header>
    <el-container class="body">
      <el-aside width="200px" class="side-bar">
        <el-menu
          router
          :default-active="onRoutes"
          class="el-menu-vertical-demo"
        >
          <el-menu-item :index="menuList">
            <i class="el-icon-menu"></i>
            <span slot="title">问卷列表</span>
          </el-menu-item>
          <el-menu-item :index="menuCreate">
            <i class="el-icon-document"></i>
            <span slot="title">新建问卷</span>
          </el-menu-item>
          <el-menu-item :index="menuHelp">
            <i class="el-icon-setting"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="content">
          <router-view></router-view>
        </el-main>
        <el-footer>
          <p>
            <span>Powered By 星云激励计划</span>
            <a class="link" href="https://incentive.nebulas.io/cn/signup.html?invite=IwLHS">| 提交DApp得100NAS</a>
          </p>
        </el-footer>
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
    },
    menuList () {
      return this.$route.path.split('/').length > 3 ? '/question/list' : 'list';
    },
    menuCreate () {
      return this.$route.path.split('/').length > 3 ? '/question/create' : 'create';
    },
    menuHelp () {
      return this.$route.path.split('/').length > 3 ? '/question/help' : 'help';
    }
  }
};
</script>

<style>

.question-logo {
  width: 32px;
  height: 32px;
}

.el-header {
  color: #409EFF;
  line-height: 200px;
  display: flex;
  align-items: center;
  padding: 0 50px;
}

body {
  height: 100%;
}

.question {
  height: 100%;
}
.el-footer {
  background-color:#409EFF;
  color: #FFF;
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

.link {
  color: #FFF;
}
</style>
