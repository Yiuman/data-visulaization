<template>
    <div class="home">
        <el-container v-show="!isPreview">
            <el-header>
                <div class="sys-title">
                    Data-Visualization
                </div>
                <el-row class="top-button-row">
                    <el-button @click="preview" type="info" icon="el-icon-view" circle></el-button>
                    <el-button @click="fullWindow" type="info" icon="el-icon-full-screen" circle></el-button>
                    <el-button @click="saveView" type="info" icon="el-icon-finished" circle></el-button>
                </el-row>

            </el-header>
            <el-main>
                <div class="drag-root">
                    <div class="drag-board-row">
                        <!--拖拽组件区-->
                        <div class="draggable-list">
                            <DraggableItem v-on:dragstart="dragstart" v-on:dragend="dragend"></DraggableItem>
                        </div>
                        <!--拖拽中心,非预览状态-->
                        <div class="drag-container" ref="drag-container">
                            <div id="drop-zone" ref="drop-zone" :style="dropZoneStyle" @drop="drop"
                                 @dragenter="dragenter"
                                 @dragleave="dragleave" @dragover.prevent>
                                <div class="datav-item-block"
                                     v-for="(dataVComponent,index) in dataVComponents"
                                     :class="index===selectedIndex?'datav-item-selected':''"
                                     :key="index"
                                     :id="dataVComponent.domId"
                                     :style="dataVComponent.style"
                                     style="padding: 15px"
                                     :ref="dataVComponent.domId"
                                     :index="index"
                                     :isChartType="dataVComponent.componentName.startsWith('ve')"
                                     @click="selectDataVItem(index)">
                                    <div class="datav-item-close"
                                         :ref="dataVComponent.domId+'close'"
                                         :style="index===selectedIndex?'':'display: none;'">
                                        <i class="el-icon-close" aria-hidden="true" @click="closeDataVItem(index)"></i>
                                    </div>
                                    <component :is="dataVComponent.componentName"
                                               :ref="'chart_'+index"
                                               v-bind="dataVComponent.data"
                                               :dataVComponent="dataVComponent">
                                    </component>
                                </div>
                            </div>
                        </div>

                        <!--组件属性配置区划-->
                        <div class="data-view-config">
                            <ConfigSetting :dataVComponent="dataVComponents[selectedIndex]"
                                           :dropZoneStyle="dropZoneStyle"></ConfigSetting>
                        </div>
                    </div>
                </div>
            </el-main>


        </el-container>

        <!--视图区划，用于预览-->
        <div class="data-view-root" ref="data-view-root" id="data-view-root" v-show="isPreview">
            <DataView ref="data-view-component" :dataVStyle="previewStyle"
                      :dataVComponents="dataVComponents"></DataView>
        </div>

    </div>


</template>

<script>
    import interact from 'interactjs'
    import DraggableItem from './DraggableItem'
    import ConfigSetting from './ConfigSetting'
    import DataView from "./DataView";
    import {DEFAULT_DATA} from "../constant";

    export default {
        name: "DrawBoard",
        components: {
            DataView,
            DraggableItem,
            ConfigSetting
        },
        data() {
            return {
                // 拖拽中心样式，即面板样式
                dropZoneStyle: {
                    width: '',
                    height: '',
                    'background-color': '#fff'
                },
                //拖拽的数据组件
                dataVComponents: [],
                //选中组件的下标
                selectedIndex: 0,
                isPreview: false,
                previewStyle: {},
            }
        },
        mounted() {
            //初始化拖拽中心
            if (!this.isPreview) {
                this.initDropZone();
            }

        },
        methods: {
            /**
             * 初始化拖拽中心
             */
            initDropZone() {
                let dragContainer = this.$refs['drag-container'];
                let zoneWith = (dragContainer.offsetWidth * 0.9).toFixed();
                this.dropZoneStyle.width = `${zoneWith}px`;
                this.dropZoneStyle.height = `${(zoneWith * ((screen.height / screen.width).toFixed(4))).toFixed()}px`;
            },
            /**
             * 拖拽落下
             */
            drop(event) {
                event.preventDefault();
                this.initDataVComponent(event);
            },
            dragenter(event) {
                event.preventDefault();
                this.$set(this.dropZoneStyle, 'border-style', 'solid');
                this.$set(this.dropZoneStyle, 'border-image', 'linear-gradient(#26d9b3,#5a84fd) 30 30 ');
            },
            dragleave(event) {
                event.preventDefault();
                this.$set(this.dropZoneStyle, 'border-style', '');
                this.$set(this.dropZoneStyle, 'border-color', '#aaa');
                this.$set(this.dropZoneStyle, 'border-image', '');
            },
            dragstart() {
                this.$set(this.dropZoneStyle, 'border-color', '#aaa');
            },
            dragend() {
                this.$set(this.dropZoneStyle, 'border-color', '');
                this.$set(this.dropZoneStyle, 'border-style', 'dashed');
                this.$set(this.dropZoneStyle, 'border-image', '');
            },
            /**
             * 初始化数据可视化组件
             * */
            initDataVComponent(event) {
                let dragItem = JSON.parse(event.dataTransfer.getData('dragItem'));
                let itemWidth = dragItem.width || 400;
                let itemHeight = dragItem.height || 400;
                let domId = dragItem.type + '_' + new Date().getTime();
                let dataVComponent = {
                    domId: domId,
                    componentName: dragItem.componentName,
                    type: dragItem.type,
                    style: {},
                    data: JSON.parse(JSON.stringify(DEFAULT_DATA[dragItem.type])),
                    dataSource: {
                        type: '',
                    }
                };

                //取得拖拽中心长宽，与分辨率作比例，拿到比例值处理拖拽长宽
                let zoneWidth = Number(this.dropZoneStyle.width.substr(0, this.dropZoneStyle.width.length - 2));
                let zoneHeight = Number(this.dropZoneStyle.height.substr(0, this.dropZoneStyle.height.length - 2));
                let xprop = getProportion(zoneWidth, screen.width);
                let yprop = getProportion(zoneHeight, screen.height);

                let offsetX = (zoneWidth - event.offsetX < itemWidth) ? (zoneWidth - itemWidth) : event.offsetX;
                let offsetY = (zoneHeight - event.offsetY < itemHeight) ? (zoneHeight - itemHeight) : event.offsetY;

                let positionX = (offsetX).toFixed(4);
                let positionY = (offsetY).toFixed(4);
                dataVComponent.style.width = `${((itemWidth / xprop).toFixed() * xprop).toFixed(4)}px`;
                dataVComponent.style.height = `${((itemHeight / yprop).toFixed() * yprop).toFixed(4)}px`;
                dataVComponent.style.transform = `translate(${positionX}px,${positionY}px)`;
                // dataVComponent.style['-webkit-transform'] = dataVComponent.style.transform;
                dataVComponent.positionX = positionX;
                dataVComponent.positionY = positionY;
                dataVComponent.style.color = '#FFFFFF';
                this.dataVComponents.push(dataVComponent);
                this.initDraggable(domId);
            },
            initDraggable(domId) {
                const vm = this;
                interact(`#${domId}`)
                    .draggable({
                        inertia: true,
                        modifiers: [
                            interact.modifiers.restrict({
                                restriction: '#drop-zone',
                                endOnly: true,
                                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                            })
                        ],
                        autoScroll: true,
                        onmove: vm.dragMoveListener
                    })
                    .resizable({
                        edges: {left: true, right: true, bottom: true, top: true},
                        modifiers: [
                            interact.modifiers.restrictEdges({
                                outer: '#drop-zone',
                                endOnly: true,
                            }),
                            interact.modifiers.restrictSize({
                                min: {width: 100, height: 50},
                            }),
                        ],
                        inertia: true

                    })
                    // 监听改变大小
                    .on('resizemove', (event) => {
                        let dataVComponents = vm.dataVComponents;
                        const target = event.target,
                            // xProportion = getProportion(screen.width, this.dropZoneStyle.width.substring(0, this.dropZoneStyle.width.length - 2)),
                            // yProportion = getProportion(screen.height, this.dropZoneStyle.height.substring(0, this.dropZoneStyle.height.length - 2)),
                            index = Number(target.getAttribute('index')),
                            isChartType = Boolean(target.getAttribute('isChartType')),
                            dataVComponent = dataVComponents[index],
                            x = (dataVComponent.positionX || 0) + event.deltaRect.left,
                            y = (dataVComponent.positionY || 0) + event.deltaRect.top;

                        dataVComponent.style.width = `${event.rect.width}px`;
                        dataVComponent.style.height = `${event.rect.height}px`;
                        dataVComponent.style.transform = `translate(${x}px,${y}px)`;
                        dataVComponent.positionX = x;
                        dataVComponent.positionY = y;
                        if (isChartType) {
                            vm.$nextTick(() => {
                                vm.$refs[`chart_${index}`][0].echarts.resize();
                            })
                        }
                    });
            },
            // 监听拖拽移动
            dragMoveListener(event) {
                const target = event.target,
                    index = Number(target.getAttribute('index')),
                    isChartType = Boolean(target.getAttribute('isChartType')),
                    dataVComponent = this.dataVComponents[index],
                    x = (Number(dataVComponent.positionX) || 0) + event.dx,
                    y = (Number(dataVComponent.positionY) || 0) + event.dy;
                dataVComponent.positionX = x;
                dataVComponent.positionY = y;
                dataVComponent.style.transform = `translate(${x}px,${y}px)`;
                this.$set(this.dataVComponents, index, dataVComponent);
                if (isChartType) {
                    this.$nextTick(() => {
                        this.$refs[`chart_${index}`][0].echarts.resize();
                    })
                }

            },
            /**
             * 选中拖拽组件
             * @param index 组件下标
             */
            selectDataVItem(index) {
                this.selectedIndex = index;
            },
            /**
             * 删除拖拽组件
             * @param index 组件下标
             */
            closeDataVItem(index) {
                const dataVComponents = this.dataVComponents;
                dataVComponents.splice(index, 1);
            },
            /**
             * 预览
             * */
            preview() {
                const vm = this;
                //主屏幕是否已经全屏模式
                const isRootFullScreen = isFullScreen();
                let style = {};
                Object.assign(style, this.dropZoneStyle);
                style.width = '100%';
                style.height = '100%';
                style.border = 'none';
                vm.previewStyle = style;
                vm.isPreview = true;

                //视图全屏
                const dataVRoot = document.getElementById('data-view-root');
                fullScreen(dataVRoot);
                //按屏幕比例改变组件样式
                vm.transDataVComponentsStyle(this.isPreview);

                //监听全屏变化
                const dataFullChangeListener = (isRootFullScreen) => {
                    if (!isFullScreen()) {
                        //要执行的动作
                        vm.isPreview = false;
                        vm.transDataVComponentsStyle(vm.isPreview);
                        if (isRootFullScreen) {
                            fullScreen();
                        }
                    } else {
                        //若一早就是全屏状态了，重新绘制ECHARTS视图
                        vm.$refs['data-view-component'].$children.forEach(child => {
                            if (child.echarts) {
                                child.echarts.resize();
                            }

                        });
                    }
                };
                dataVRoot.onfullscreenchange = () => {
                    dataFullChangeListener(isRootFullScreen)
                }
            },
            fullWindow() {
                fullScreen();
            },
            saveView() {

            },
            //全屏与退出全屏食，改变组件的比例大小缩放
            transDataVComponentsStyle(isPreview) {
                let xProportion = getProportion(screen.width, this.dropZoneStyle.width.substring(0, this.dropZoneStyle.width.length - 2)),
                    yProportion = getProportion(screen.height, this.dropZoneStyle.height.substring(0, this.dropZoneStyle.height.length - 2));
                this.dataVComponents.forEach(item => {
                    let style = item.style;
                    let realWidth = style.width.substring(0, style.width.length - 2);
                    let realHeight = style.height.substring(0, style.height.length - 2);
                    if (isPreview) {
                        style.width = `${xProportion * realWidth}px`;
                        style.height = `${yProportion * realHeight}px`;
                        style.transform = `translate(${item.positionX * xProportion}px,${item.positionY * yProportion}px)`
                    } else {
                        style.width = `${realWidth / xProportion}px`;
                        style.height = `${realHeight / yProportion}px`;
                        style.transform = `translate(${item.positionX}px,${item.positionY}px)`
                    }

                    item.style = style;
                });
            }
        },

    }

    /**
     * 全屏
     */
    function fullScreen(ele = document.documentElement) {
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
    }

    //获取两个值的比例
    function getProportion(divisor, dividend) {
        return (Number(divisor) / Number(dividend)).toFixed(4);
    }

    function isFullScreen() {
        return !!(
            document.fullscreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen ||
            document.webkitFullScreen ||
            document.msFullScreen
        );
    }

</script>

<style scoped>
    /deep/ .echarts {
        width: 100% !important;
        height: 100% !important;
    }

    .el-container {
        height: 100%;
    }

    .el-button--info {
        border: none;
        font-size: 24px;
        color: #fff;
        background-color: rgba(225, 225, 225, 0.0);
        /*border-color: #ffffff;*/
    }

    .el-button:hover {
        background-color: rgba(225, 225, 225, 0.3);
    }

    .el-button.is-circle {
        padding: 10px;
    }

    .el-header {
        height: 70px !important;
        background: -moz-linear-gradient(right, #26d9b3 0%, #5a84fd 100%);
        background: linear-gradient(to right, #26d9b3 0%, #5a84fd 100%);
        background: -webkit-linear-gradient(right, #26d9b3 0%, #5a84fd 100%);
        color: #333;
        text-align: center;
        line-height: 70px;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        text-align: center;
        /*line-height: 160px;*/
        padding: 0;
    }

    .sys-title {
        font-size: 30px;
        font-weight: bold;
        float: left;
        height: 70px;
        margin: auto;
        background-size: contain;
        background: #fff;
        text-align: center;
        line-height: 70px;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
    }

    .top-button-row {
        float: right;
    }

    body > .el-container {
        background-color: #fff;
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .drag-root {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .draggable-list {
        overflow-y: auto;
        height: 100%;
        width: 12%;
    }

    .drag-board-row {
        display: flex;
        flex-direction: row;
        flex-grow: 100;
    }

    .drag-container {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        flex-grow: 100;
        background-color: #f8f9fe;
    }

    .datav-item-block {
        box-sizing: border-box;
        touch-action: none;
        position: absolute;
    }

    .datav-item-block:hover, .datav-item-selected {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        border: 1px solid #eee;
        background-color: #fff;
    }

    .datav-item-close {
        cursor: pointer;
        display: grid;
        color: darkslategrey;
        height: 26px;
        position: absolute;
        text-align: right;
        padding-right: 5px;
        padding-top: 5px;
        z-index: 999;
        width: 20px;
        top: 0;
        right: 2px;
    }

    .datav-item-close:hover {
        color: indianred;
    }

    #drop-zone {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        border: dashed 2px transparent;
        border-radius: 5px;
        padding: 10px;
        width: 80%;
        margin: auto;
        transition: background-color 0.3s;
    }

    .data-view-root {
        width: 100%;
        height: 100%;
    }

    ::-webkit-scrollbar {
        width: 3px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.06);
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.12);
    }

    .data-view-config {
        overflow-y: auto;
        padding: 10px;
        /*position: absolute;*/
        /*top: 70px;*/
        /*right: 0;*/
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0);
        border-radius: 5px;
        border: 1px solid #eee;
        width: 200px;
        background-color: #fff;
    }


</style>
