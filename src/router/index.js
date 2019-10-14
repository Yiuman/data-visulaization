import Vue from "vue";

import Router from "vue-router";

Vue.use(Router);

import Home from "../pages/Home";
import ShowView from '../pages/ShowView'

export default new Router({
    mode: "hash",//去掉路径中的#
    routes: [
        {
            path: "/",
            redirect: {name: "home"}
        },
        //首页
        {
            path: "/home",
            name: "home",
            component: Home,
            meta: {
                // 标记是否为主页
                isMain: true
            }
        },
        //视图展示也
        {
            path: "/view/:viewId",
            name: "view",
            component: ShowView
        }
    ]
});
