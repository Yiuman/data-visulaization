import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VCharts from 'v-charts-v2'


Vue.use(ElementUI);
Vue.use(VCharts);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
