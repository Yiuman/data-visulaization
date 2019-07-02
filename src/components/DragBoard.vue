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
                                               :data="dataVComponent.chartData"
                                               width="100%"
                                               height="100%"></component>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>

        <DataView v-show="isPreview" :dataVStyle="previewStyle" :dataVComponents="dataVComponents" ref="data-view-com"></DataView>
    </div>


</template>

<script>
    import interact from 'interactjs'
    import DraggableItem from './DraggableItem'
    import DataView from "./DataView";
    import {DEFAULT_DATA} from "../constant";

    export default {
        name: "DrawBoard",
        components: {
            DataView,
            DraggableItem,
        },
        data() {
            return {
                // 拖拽中心样式，即面板样式
                dropZoneStyle: {
                    width: '',
                    height: '',
                    'background-color': '#ccc'
                },
                //拖拽的数据组件
                dataVComponents: [],
                //选中组件的下标
                selectedIndex: 0,
                isPreview: false,
                previewStyle: {}
            }
        },
        mounted() {
            //初始化拖拽中心
            if (!this.isPreview) {
                this.initDropZone();
            }

        },
        methods: {
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
                this.$set(this.dropZoneStyle, 'border-color', '#fff');
            },
            dragleave(event) {
                event.preventDefault();
                this.$set(this.dropZoneStyle, 'border-style', '');
                this.$set(this.dropZoneStyle, 'border-color', '#aaa');
            },
            dragstart() {
                this.$set(this.dropZoneStyle, 'border-color', '#aaa');
            },
            dragend() {
                this.$set(this.dropZoneStyle, 'border-color', '');
                this.$set(this.dropZoneStyle, 'border-style', 'dashed');
            },
            initDataVComponent(event) {
                let dragItem = JSON.parse(event.dataTransfer.getData('dragItem'));
                let domId = dragItem.type + '_' + new Date().getTime();
                let dataVComponent = {
                    domId: domId,
                    componentName: 've-line',
                    style: {},
                    chartData: DEFAULT_DATA[dragItem.type]
                };

                let zoneWidth = this.dropZoneStyle.width;
                let zoneHeight = this.dropZoneStyle.height;
                let xprop = getProportion(Number(zoneWidth.substr(0, zoneWidth.length - 2)), screen.width);
                let yprop = getProportion(Number(zoneHeight.substr(0, zoneHeight.length - 2)), screen.height);
                let positionX = (event.offsetX * xprop).toFixed(4);
                let positionY = (event.offsetY * yprop).toFixed(4);
                dataVComponent.style.width = `${((225 / xprop).toFixed() * xprop).toFixed(4)}px`;
                dataVComponent.style.height = `${((105 / yprop).toFixed() * yprop).toFixed(4)}px`;
                dataVComponent.style.transform = `translate(${positionX}px,${positionY}px)`;
                dataVComponent.style['-webkit-transform'] = dataVComponent.style.transform;
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
            preview() {

                let style = {};
                Object.assign(style, this.dropZoneStyle);
                style.width = '100%';
                style.height = '100%';
                style.border = 'none';
                this.previewStyle = style;
                this.isPreview = true;
                this.fullWindow();
                let vm = this;
                document.onfullscreenchange = () => {
                    if (!isFullScreen()) {
                        //要执行的动作
                        vm.isPreview = false
                    }
                }

            },
            /**
             * 全屏
             */
            fullWindow() {
                let ele = document.documentElement;
                if (ele.requestFullscreen) {
                    ele.requestFullscreen();
                } else if (ele.mozRequestFullScreen) {
                    ele.mozRequestFullScreen();
                } else if (ele.webkitRequestFullscreen) {
                    ele.webkitRequestFullscreen();
                } else if (ele.msRequestFullscreen) {
                    ele.msRequestFullscreen();
                }
            },
            saveView() {

            }
        },

    }

    //获取两个值的比例
    function getProportion(divisor, dividend) {
        return (Number(divisor) / dividend).toFixed(4);
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


    .el-container {
        height: 100%;
    }

    .el-header {
        background: linear-gradient(to right, rgb(40, 48, 72), rgb(133, 147, 152));
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
        padding: 0;
    }

    .sys-title {
        font-size: 20px;
        font-weight: bold;
        float: left;
        height: 60px;
        margin: auto;
        background-size: contain;
        background: linear-gradient(to right, white, blue);
        text-align: center;
        line-height: 60px;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
    }

    .top-button-row {
        float: right;
    }

    body > .el-container {
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
        width: 12%;
    }

    .drag-board-row {
        display: flex;
        flex-direction: row;
        flex-grow: 100;
    }

    .drag-container {
        display: flex;
        flex-direction: column;
        flex-grow: 100;
        background-color: gainsboro;
    }

    .datav-item-block {
        box-sizing: border-box;
        touch-action: none;
        position: absolute;
    }

    .datav-item-block:hover, .datav-item-selected {
        border-radius: 5px;
        border: 1px solid #2185d0;
        background-color: gainsboro;
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

    .datav-item-close:hover{
        color: indianred;
    }

    #drop-zone {
        background-color: #ccc;
        border: dashed 4px transparent;
        border-radius: 4px;
        padding: 10px;
        width: 80%;
        margin: auto;
        transition: background-color 0.3s;
    }


</style>