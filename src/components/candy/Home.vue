<template>
  <div class="layout">
    <div class="app-container">
      <mu-drawer :open.sync="open" :docked="docked" :z-depth='zDepth' class="mu-app-drawer">
        <div class="mu-app-drawer-content">
          <mu-appbar :z-depth='zDepth' class='mu-app-drawer-header' :class="{'is-open': (open && docked)}">
            <div class="logo">
                <a href="https://nebulas.io/cn/incentive.html"><img src="../../assets/candy.png" alt=""></a>
            </div>
            <router-link to="/candy/home">星云糖果助手</router-link>
          </mu-appbar>
          <mu-divider />
          <mu-list>
            <mu-list-item button to='/candy' exact-active-class='selected'>
              <mu-list-item-title>糖果列表</mu-list-item-title>
            </mu-list-item>
            <mu-list-item button to='/candy/add' active-class='selected'>
              <mu-list-item-title>添加糖果</mu-list-item-title>
            </mu-list-item>
            <mu-list-item button to='/candy/about' active-class='selected'>
              <mu-list-item-title>帮助</mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </div>
      </mu-drawer>
      <mu-appbar class="app-header" color="primary">
        <mu-button v-if="!docked" icon slot="left" @click="toggleMenu">
          <mu-icon size="24" value="menu"/>
        </mu-button>
        <mu-button href="https://github.com/YanYuanFE/nebulas-app" icon slot="right">
          <i class="mudocs-icon-custom-github"></i>
        </mu-button>
      </mu-appbar>
      <div class="app-content"  :class="{'is-open': (open && docked)}">
        <router-view />
      </div>
    </div>
    <div class="footer" :class="{'is-open': (open && docked)}">
       ©2018 Created by Nebulas
    </div>

  </div>
</template>
<script>

import { isDesktop } from '../../utils/utils';

export default {
  data () {
    return {
      zDepth: 0,
      open: false,
      docked: isDesktop()
    };
  },
  computed: {
    path () {
      return this.$route && this.$route.path;
    }
  },
  watch: {
    path () {
      console.log(this.path);
      if (!this.docked) this.open = false;
    }
  },
  mounted () {
    this.changeNav();
    this.handleResize = () => {
      this.changeNav();
    };
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    toggleMenu () {
      this.open = !this.open;
    },
    changeNav () {
      const desktop = isDesktop();
      this.docked = desktop;
      if (!desktop && this.desktop && this.open) {
        this.open = false;
      }
      if (desktop && !this.desktop && !this.open) {
        this.open = true;
      }
    }
  }
};
</script>
<style scoped>
.layout{
  background-color: #fff;
  min-height: 100%;
  position: relative;
}

.app-container, .app-content {
  height: 100%;
}

.footer{
  padding: 20px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgb(236, 236, 236);
}

.footer.is-open {
  left: 256px;
  width: calc(100% - 256px);
}

.mu-app-drawer {
    border-right: 1px solid rgba(0,0,0,.12);
}

.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.app-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  overflow: hidden;
  background: #ff4081;
}

.app-header.is-open {
  left: 256px;
}

.app-content{
  padding-top: 64px;
  padding-bottom: 100px;
}

.app-content.is-open{
  padding-left: 256px;
}

.header{
  background-color: #2196f3;
}

.title{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.logo {
  display: inline-block;
  vertical-align: middle;
}

.github {
  display: inline-block;
  float: right;
  padding-right: 20px;
}

.github i {
  color: #FFF;
  font-size: 34px;
}

.logo img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
}

.nav{
  display: inline-block;
  width: calc(100% - 150px);
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0);
}

.content{
  width: 100%;
  margin: 0 auto;
  padding-bottom:100px;
}

.breadcrumb{
  margin: 10px 0;
}

</style>
