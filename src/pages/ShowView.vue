<template>
    <div class="show-view">
        <div class="data-view-show" ref="data-view-show" id="data-view-show">
            <DataView v-if="loaded"
                      :dataVComponents="dataVComponents"
                      :dataVStyle="dataVStyle">
            </DataView>
        </div>
    </div>

</template>

<script>
    import DataView from '../components/DataView'
    import {request, getDataView} from '../request'
    import {initWebSocket, transDataVComponentsStyle} from '../visual'

    export default {
        name: "ShowView",
        components: {
            DataView
        },
        data() {
            return {
                dataVComponents: [],
                dataVStyle: {},
                loaded: false,
                webSockets: []
            }
        },
        mounted() {
            const viewId = this.$route.params.viewId;
            //获取视图
            if (viewId) {
                this.initDataVComponents(viewId);
            }
        },
        beforeDestroy() {
            this.webSockets.forEach(websocket => {
                websocket.onclose();
            })
        },
        methods: {
            /**
             * 初始化视图组件
             * @param viewId 视图ID
             */
            initDataVComponents(viewId) {
                getDataView(viewId)
                    .then(result => {
                        this.dataVComponents = result.components;
                        this.dataVStyle = result.style;
                        //如果数据源为静态数据则不需要请求数据
                        this.dataVComponents.forEach(item => {
                            if (item.dataSource.type === 'API') {
                                request(item.dataSource.api).then(result => {
                                    if (result) {
                                        item.data[item.dataField] = JSON.parse(result);
                                    } else {
                                        item.data.dataEmpty = true
                                    }

                                }).catch(error => {
                                    window.console.warn("组件数据获取异常", error);
                                })
                            } else if (item.dataSource.type === 'WebSocket') {
                                this.webSockets.push(initWebSocket(this, item))
                            }
                        });

                        let dataViewShow = this.$refs['data-view-show'];
                        transDataVComponentsStyle(
                            true,
                            this.dataVStyle,
                            this.dataVComponents,
                            {
                                width: dataViewShow.offsetWidth,
                                height: dataViewShow.offsetHeight - 10
                            }
                        );
                        this.loaded = true;
                    })
                    .catch(error => {
                        window.console.warn(error);
                        this.$message({message: error, type: 'warning'});
                    })
            }
        }
    }
</script>

<style scoped>
    /deep/ .echarts {
        width: 100% !important;
        height: 100% !important;
    }

    .data-view-show {
        width: 100%;
        height: 100%;
    }

</style>
