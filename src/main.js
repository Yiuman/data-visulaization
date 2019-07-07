import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'

import VueRouter from 'vue-router'
import router from "./router";
import 'echarts'
import theme from './assets/echarts-theme/theme'
import DataTable from './components/DataTable'
import Carousel from './components/DataCarousel'
import DataText from './components/DataText'
import DataCustomSlot from './components/DataCustomSlot'

import ECharts from 'vue-echarts'
// Map of China
import chinaMap from './data/china.json'
Vue.use(ECharts);
// registering map data
ECharts.registerMap('china', chinaMap);
ECharts.registerTheme('ovilia-green', theme);

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.component('e-charts',ECharts);
Vue.component('data-table',DataTable);
Vue.component('carousel',Carousel);
Vue.component('data-text',DataText);
Vue.component('data-custom',DataCustomSlot);
Vue.use(VCharts);
Vue.config.productionTip = false;



new Vue({
    render: h => h(App),
    router
}).$mount('#app');
