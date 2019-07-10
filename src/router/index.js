import Vue from "vue";

import Router from "vue-router";

Vue.use(Router);

import Home from "../pages/Home";

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
        }
    ]
});
