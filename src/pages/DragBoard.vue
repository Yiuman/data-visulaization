<template>
    <div class="home">
        <el-container v-show="!isPreview">
            <el-header>
                <div class="sys-title">
                    Data-Visualization
                </div>
                <el-row class="top-button-row">
                    <el-button @click="preview" type="info" icon="el-icon-view" circle/>
                    <el-button @click="fullWindow" type="info" icon="el-icon-full-screen" circle/>
                    <el-button @click="saveDataVisualiew" type="info" icon="el-icon-finished" circle/>
                </el-row>

            </el-header>
            <el-main>
                <div class="drag-root">
                    <div class="drag-board-row">
                        <!--拖拽组件区-->
                        <div class="draggable-list">
                            <DraggableItem v-on:dragstart="dragstart" v-on:dragend="dragend"/>
                        </div>
                        <!--拖拽中心,非预览状态-->
                        <div class="drag-container" ref="drag-container">
                            <div id="drop-zone" ref="drop-zone"
                                 :style="dropZoneStyle" @drop="drop"
                                 @dragenter="dragenter"
                                 @dragleave="dragleave"
                                 @dragover.prevent>
                                <div class="datav-item-block"
                                     v-for="(dataVComponent,index) in dataVComponents"
                                     :key="index"
                                     :id="dataVComponent.domId"
                                     :class="index===selectedIndex?'datav-item-selected':''"
                                     :style="dataVComponent.style"
                                     style="padding: 15px"
                                     :ref="dataVComponent.domId"
                                     :index="index"
                                     :isChartType="dataVComponent.componentName.startsWith('ve')"
                                     @click="selectDataVItem(index)">
                                    <div class="datav-item-close"
                                         :ref="dataVComponent.domId+'close'"
                                         :style="index===selectedIndex?'':'display: none;'">
                                        <i class="el-icon-close" aria-hidden="true" @click="deleteDataVItem(index)"/>
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
                            <div class="data-view-setting">
                                <el-collapse v-model="configActiveName" accordion>
                                    <el-collapse-item title="全局样式" name="global">
                                        <FieldRender :field-define="configSettings.globalStyle"
                                                     :bind-key="viewId"
                                                     :bind-data="dropZoneStyle"
                                                     @beforeUpload="beforeUpload"/>
                                    </el-collapse-item>
                                    <div v-if="dataVComponents[selectedIndex]">
                                        <el-collapse-item title="组件样式" name="style">
                                            <FieldRender :field-define="configSettings.componentStyle"
                                                         :bind-data="dataVComponents[selectedIndex].style"
                                                         :bind-key="dataVComponents[selectedIndex].componentId"
                                                         @beforeUpload="beforeUpload">
                                            </FieldRender>
                                        </el-collapse-item>

                                        <el-collapse-item title="组件配置项" name="config"
                                                          v-if="configSettings.componentSettings[dataVComponents[selectedIndex].type]">
                                            <FieldRender
                                                    :field-define="configSettings.componentSettings[dataVComponents[selectedIndex].type] || {}"
                                                    :bind-data="dataVComponents[selectedIndex].data"
                                                    :bind-key="dataVComponents[selectedIndex].componentId"
                                                    @beforeUpload="beforeUpload">
                                            </FieldRender>
                                        </el-collapse-item>

                                        <el-collapse-item title="组件数据源"
                                                          name="dataSource"
                                                          v-if="dataVComponents[selectedIndex].useDataSource
                                                          &&dataVComponents[selectedIndex].dataField">

                                            <FieldRender :field-define="configSettings.dataSource"
                                                         :bind-data="dataVComponents[selectedIndex].dataSource">
                                            </FieldRender>
                                            <!--静态数据-->
                                            <FieldRender v-if="dataVComponents[selectedIndex].dataField
                                            && dataVComponents[selectedIndex].dataSource.type==='STATIC'"
                                                         :field-define="selectedComponentStaticFieldDefine"
                                                         :bind-data="dataVComponents[selectedIndex].data">
                                            </FieldRender>
                                        </el-collapse-item>
                                    </div>
                                </el-collapse>
                            </div>
                        </div>

                    </div>
                </div>
            </el-main>
        </el-container>

        <!--视图区划，用于预览-->
        <div class="data-view-root" ref="data-view-root" id="data-view-root" v-show="isPreview">
            <DataView ref="data-view-component"
                      :dataVStyle="previewStyle"
                      :dataVComponents="dataVComponents"/>
        </div>
    </div>
</template>

<script>
    import interact from 'interactjs'
    import DraggableItem from '../components/DraggableItem'
    import DataView from "../components/DataView";
    import FieldRender from '../components/FieldRender'
    import {DEFAULT_DATA} from "../constant";
    import {getDataView, saveView, deleteComponent, request} from '../request'
    import {fullScreen, getProportion, isFullScreen, getSizeNumberWithUnit, transDataVComponentsStyle} from '../visual'
    import {COMPONENT_SETTINGS, DATA_SOURCE, GLOBAL_STYLE, COMPONENT_STYLE} from '../component_config_settings.js';


    export default {
        name: "DrawBoard",
        components: {
            DataView,
            DraggableItem,
            FieldRender
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
                viewId: null,
                configActiveName: '',
                configSettings: {
                    componentSettings: COMPONENT_SETTINGS,
                    globalStyle: GLOBAL_STYLE,
                    dataSource: DATA_SOURCE,
                    componentStyle: COMPONENT_STYLE
                }
            }
        },
        mounted() {
            //初始化拖拽中心
            if (!this.isPreview) {
                this.initDropZone();
            }

            //若传入视图ID，则获取视图数据进行渲染及初始化操作
            const viewId = this.$route.query.viewId;
            if (viewId) {
                this.viewId = viewId;
                getDataView(viewId).then(result => {
                    this.dropZoneStyle = result.style;
                    this.dataVComponents = result.components;
                    this.dataVComponents.forEach(component => {
                        this.initDraggable(component.domId);
                        if (component.dataSource.type === 'API') {
                            //获取组件数据
                            request(component.dataSource.api).then(result => {
                                if (result) {
                                    component.data[component.dataField] = JSON.parse(result);
                                } else {
                                    component.data.dataEmpty = true
                                }
                            }).catch(error => {
                                window.console.warn("组件数据获取异常", error);
                            })
                        }
                    })
                }).catch(error => {
                    this.$notify({message: error, type: "warning"})
                })
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
                    dataField: dragItem.dataField,
                    useDataSource: dragItem.useDataSource || true,
                    data: JSON.parse(JSON.stringify(DEFAULT_DATA[dragItem.type])),
                };

                if (dataVComponent.useDataSource) {
                    dataVComponent.dataSource = {
                        type: 'STATIC'
                    }
                }

                //取得拖拽中心长宽，与分辨率作比例，拿到比例值处理拖拽长宽
                let zoneWidth = Number(getSizeNumberWithUnit(this.dropZoneStyle.width));
                let zoneHeight = Number(getSizeNumberWithUnit(this.dropZoneStyle.height));
                let xprop = getProportion(zoneWidth, screen.width);
                let yprop = getProportion(zoneHeight, screen.height);

                let offsetX = (zoneWidth - event.offsetX < itemWidth) ? (zoneWidth - itemWidth) : event.offsetX;
                let offsetY = (zoneHeight - event.offsetY < itemHeight) ? (zoneHeight - itemHeight) : event.offsetY;

                let positionX = (offsetX).toFixed(4);
                let positionY = (offsetY).toFixed(4);
                dataVComponent.style.width = `${((itemWidth / xprop).toFixed() * xprop).toFixed(4)}px`;
                dataVComponent.style.height = `${((itemHeight / yprop).toFixed() * yprop).toFixed(4)}px`;
                dataVComponent.style.transform = `translate(${positionX}px,${positionY}px)`;
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
            deleteDataVItem(index) {
                const dataVComponents = this.dataVComponents;
                const indexComponent = dataVComponents[index];
                if (indexComponent.componentId) {
                    this.$confirm('此操作将永久删除此该组件，是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteComponent(indexComponent.componentId).then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            dataVComponents.splice(index, 1);
                        }).catch(error => {
                            this.$message({type: 'warning', message: error})
                        });
                    }).catch(() => {

                    })
                } else {
                    dataVComponents.splice(index, 1);
                }
            },
            //配置组件上传附件前触发,上传文件前应先保存视图，确保附件对象有关联对象ID
            beforeUpload(file, extend, callback) {
                if (!extend.bindKey) {
                    saveView({
                        viewId: this.viewId,
                        style: {...this.dropZoneStyle, 'border-style': ''},
                        components: this.dataVComponents
                    }).then(result => {
                        this.viewId = result;
                        callback(result)
                    })
                } else {
                    callback(true);
                }

            },
            /**
             * 预览
             */
            preview() {
                const vm = this;
                //主屏幕是否已经全屏模式
                const isRootFullScreen = isFullScreen();
                let style = {};
                Object.assign(style, this.dropZoneStyle);
                style.width = '100%';
                style.height = '100%';
                vm.previewStyle = style;
                vm.isPreview = true;

                //视图全屏
                const dataVRoot = document.getElementById('data-view-root');
                fullScreen(dataVRoot);
                //按屏幕比例改变组件样式
                transDataVComponentsStyle(vm.isPreview, vm.dropZoneStyle, vm.dataVComponents);

                //监听全屏变化
                const dataFullChangeListener = (isRootFullScreen) => {
                    if (!isFullScreen()) {
                        //要执行的动作
                        vm.isPreview = false;
                        transDataVComponentsStyle(vm.isPreview, vm.dropZoneStyle, vm.dataVComponents);
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
            /**
             * 保存视图
             */
            saveDataVisualiew() {
                if (this.dataVComponents.length === 0) {
                    this.$notify.info({title: '请添加组件编辑视图'});
                    return;
                }
                saveView({
                    viewId: this.viewId,
                    style: {...this.dropZoneStyle, 'border-style': ''},
                    components: this.dataVComponents
                }).then(result => {
                    this.viewId = result;
                    this.$message({message: '保存成功', type: "success"})
                }).catch(error => {
                    this.$message({message: error, type: 'warning'})
                })
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
                this.$refs['drop-zone'].style['border-style'] = 'solid';
                this.$refs['drop-zone'].style['border-image'] = 'linear-gradient(#26d9b3,#5a84fd) 30 30';

            },
            dragleave(event) {
                event.preventDefault();
                this.$refs['drop-zone'].style['border-style'] = '';
                this.$refs['drop-zone'].style['border-color'] = '#aaa';
                this.$refs['drop-zone'].style['border-image'] = '';
            },
            dragstart() {
                this.$refs['drop-zone'].style['border-color'] = '#aaa';
            },
            dragend() {
                this.$refs['drop-zone'].style['border-color'] = '';
                this.$refs['drop-zone'].style['border-style'] = 'dashed';
                this.$refs['drop-zone'].style['border-image'] = '';
            }
        },
        computed: {
            //选中组件的数据字段定义
            selectedComponentStaticFieldDefine: function () {
                let dataField = String(this.dataVComponents[Number(this.selectedIndex)]['dataField']);
                return {
                    [`${dataField}`]:
                        {
                            type: "codemirror",
                            name: "静态数据",
                            options: {
                                tabSize: 4,
                                smartIndent: true,
                                mode: "application/json",
                                theme: "rubyblue",
                                lineNumbers: true,
                                line: true,
                                lineWrapping: true
                            }
                        }
                }
            }
        }

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
        height: 100%;
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
        /*background-color: #fff;*/
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

    /*拖拽中心的margin与padding都不要设置，因为会影响视图放大缩小的倍数*/
    #drop-zone {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        border: dashed 2px transparent;
        border-radius: 5px;
        width: 80%;
        margin: auto;
        transition: background-color 0.3s;
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
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0);
        border-radius: 5px;
        border: 1px solid #eee;
        width: 200px;
        background-color: #fff;
    }

    /deep/ .el-color-picker {
        padding: 0 5px;
        top: 4px
    }

    /deep/ .el-collapse-item__content {
        padding-bottom: 0;
    }

    .data-view-setting {
        width: 100%;
        height: 10%;
    }


    .color-container {
        border-radius: 0 4px 4px 0;
        border: 1px solid #DCDFE6;
    }

    .setting-container {
        margin-bottom: 5px;
    }


</style>
