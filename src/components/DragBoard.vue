<template>
    <div class="drag-root">
        <div class="drag-board-row">
            <!--拖拽组件区-->
            <div class="drag-menu">
                <DraggableItem v-on:dragstart="dragstart" v-on:dragend="dragend"></DraggableItem>
            </div>

            <!--拖拽中心-->
            <div class="drag-container" ref="drag-container">
                <div id="drag-zone" ref="drag-zone" :style="dragZoneStyle" @drop="drop" @dragenter="dragenter" @dragleave="dragleave" @dragover.prevent>
                    <div class="drag-item-block"
                         v-for="(dataVComponent,index) in dataVComponents" :key="index"
                         :id="dataVComponent.domId" :style="dataVComponent.style"
                         style="box-sizing: border-box;touch-action: none" :ref="dataVComponent.domId"
                         :index="index"
                         :isChartType="dataVComponent.componentName.startsWith('ve')">
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

</template>

<script>
    import interact from 'interactjs'
    import DraggableItem from './DraggableItem'

    export default {
        name: "DrawBoard",
        components: {
            DraggableItem,
        },
        data() {
            return {
                isCollapse: true,
                dataVComponents: [],
                dragZoneStyle: {
                    width: '',
                    height: ''
                }

            }
        },
        mounted() {
            //获取拖拽容器
            let dragContainer = this.$refs['drag-container'];
            this.dragZoneStyle.width = `${(dragContainer.offsetWidth * 0.9).toFixed()}px`;
            this.dragZoneStyle.height = `${(dragContainer.offsetHeight * ((screen.height / screen.width).toFixed(4))).toFixed()}px`;

        },
        methods: {
            /**
             * 拖拽落下
             */
            drop(event) {
                event.preventDefault();
                this._initDataVComponent(event);
            },
            dragenter(event){
                event.preventDefault();
                this.$set(this.dragZoneStyle,'border-style','solid');
                this.$set(this.dragZoneStyle,'border-color','#fff');
            },
            dragleave(event){
                event.preventDefault();
                this.$set(this.dragZoneStyle,'border-style','');
                this.$set(this.dragZoneStyle,'border-color','#aaa');
            },
            dragstart(){
                this.$set(this.dragZoneStyle,'border-color','#aaa');
            },
            dragend(){
                this.$set(this.dragZoneStyle,'border-color','');
                this.$set(this.dragZoneStyle,'border-style','dashed');
                // this.$set(this.dragZoneStyle,'border','');
            },
            _initDataVComponent(event) {
                let dragItem = JSON.parse(event.dataTransfer.getData('dragItem'));
                let domId = dragItem.type + '_' + new Date().getTime();
                let dataVComponent = {
                    domId: domId,
                    componentName: 've-line',
                    style: {},
                    chartData: {
                        columns: ['日期', '访问用户', '下单用户', '下单率'],
                        rows: [
                            {'日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32},
                            {'日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26},
                            {'日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76},
                            {'日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49},
                            {'日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323},
                            {'日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78}
                        ]
                    }
                };

                let zoneWidth = this.dragZoneStyle.width;
                let zoneHeight = this.dragZoneStyle.height;
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
                this._initDraggable(domId);
            },
            _initDraggable(domId) {
                const vm = this;
                interact(`#${domId}`)
                    .draggable({
                        inertia: true,
                        modifiers: [
                            interact.modifiers.restrict({
                                restriction: '#drag-zone',
                                endOnly: true,
                                elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                            })
                        ],
                        autoScroll: true,
                        onmove: vm._dragMoveListener
                    })
                    .resizable({
                        edges: {left: true, right: true, bottom: true, top: true},
                        modifiers: [
                            interact.modifiers.restrictEdges({
                                outer: '#drag-zone',
                                endOnly: true,
                            }),
                            interact.modifiers.restrictSize({
                                min: {width: 100, height: 50},
                            }),
                        ],
                        inertia: true

                    })
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
                        // vm.$set(, index, dataVComponent);
                        // vm.dataVComponents = dataVComponents;
                        if (isChartType) {
                            vm.$nextTick(() => {
                                vm.$refs[`chart_${index}`][0].echarts.resize();
                            })
                        }
                    });
            },
            _dragMoveListener(event) {
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

            }
        },
    }

    //获取两个值的比例
    function getProportion(divisor, dividend) {
        return (Number(divisor) / dividend).toFixed(4);
    }


</script>

<style scoped>
    .drag-root {
        display: flex;
        flex-direction: column;
        height: 100%;
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
        background-color: darkgrey;
    }

    .drag-item-block {
        position: absolute;
    }

    .drag-item-block:hover {
        border: 1px solid #2185d0;
        background-color: gainsboro;
    }

    #drag-zone {
        background-color: #ccc;
        border: dashed 4px transparent;
        border-radius: 4px;
        padding: 10px;
        width: 80%;
        margin: auto;
        transition: background-color 0.3s;
    }


</style>