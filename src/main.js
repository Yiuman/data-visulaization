import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'
import ECharts from 'vue-echarts'
import VueRouter from 'vue-router'
import router from "./router";
import 'echarts'
import theme from './assets/echarts-theme/theme'


ECharts.registerTheme('ovilia-green', theme);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(ECharts);
Vue.component('e-charts',ECharts);
Vue.use(VCharts);
Vue.config.productionTip = false;



new Vue({
    render: h => h(App),
    router
}).$mount('#app');
