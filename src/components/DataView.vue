<template>
    <div class="datav-view" :style="dataVStyle">
        <div class="datav-container" style="padding: 10px">
            <div class="datav-view-block"
                 v-for="(dataVComponent,index) in dataVComponents"
                 :key="index"
                 :id="dataVComponent.domId+'_view'"
                 :style="dataVComponent.style"
                 :ref="dataVComponent.domId"
                 :index="index"
                 :isChartType="dataVComponent.componentName.startsWith('ve')">
                <component :is="dataVComponent.componentName"
                           :ref="'dataV_'+index+''"
                           v-bind="dataVComponent.data"
                           width="100%"
                           height="100%">
                </component>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DataView",
        props: {
            dataVStyle: {
                type: Object,
                default() {
                    return {
                        width: screen.width,
                        height: screen.height
                    }
                }
            },
            dataVComponents: {
                type: Array,
                default() {
                    return []
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

    .datav-view-block {
        box-sizing: border-box;
        touch-action: none;
        position: absolute;
    }


</style>
