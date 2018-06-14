// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import MuseUI from 'muse-ui';
// import VConsole from 'vconsole';
import VueQuillEditor from 'vue-quill-editor';
import 'typeface-roboto';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

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
Vue.use(VueQuillEditor /* { default global options } */);
// const vConsole = new VConsole();

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
