// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store.js';
import iView from 'view-design';
import i18n from '@/locale';
import common from './libs/util.js';
import config from './libs/config.js';
import { get, post, postFormData,patch,del,put,exportGet,anpaiAjax } from './libs/axios';
import Viewer from 'v-viewer';
import * as echarts from 'echarts';
import * as WPS from './../static/wps/web-office-sdk-v1.1.5.es.js';

import permission from '@/directive/permission/index.js'
Vue.directive('permission',permission)
import './permission';
import my_UI from '@/components/common/index.js';
Vue.use(my_UI)

import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use( CKEditor );

import 'view-design/dist/styles/iview.css';
import 'viewerjs/dist/viewer.css';
import './../static/fontIcon/style.css';
import './assets/myTheme.less';
import './assets/common.scss';
//复制粘贴
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

Vue.use(iView,{
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Viewer);

Vue.config.productionTip = false
Vue.prototype.wps = WPS;
Vue.prototype.common = common;
Vue.prototype.config = config;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$patch = patch;
Vue.prototype.$del = del;
Vue.prototype.$put = put;
Vue.prototype.$exportGet = exportGet;
Vue.prototype.$anpaiAjax = anpaiAjax;
Vue.prototype.$eventBus = new Vue();
Vue.prototype.$echarts = echarts;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
