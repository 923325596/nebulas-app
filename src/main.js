// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MuseUI from 'muse-ui';
import FastClick from 'fastclick';
// import VConsole from 'vconsole';
import VueQuillEditor from 'vue-quill-editor';
import 'typeface-roboto';
import viserVue from 'viser-vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import progress from './common/progress';

// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'muse-ui/dist/muse-ui.css';
import theme from 'muse-ui/lib/theme';
import './assets/style.css';

theme.use('light');
Vue.use(MuseUI);
Vue.use(ElementUI);
Vue.use(viserVue);
Vue.use(VueQuillEditor /* { default global options } */);
// const vConsole = new VConsole();

if (navigator && navigator.userAgent.toLowerCase().indexOf('mobile') !== -1) FastClick.attach(document.body);
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  progress.start();
  next();
});

router.afterEach(() => {
  progress.end();
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
