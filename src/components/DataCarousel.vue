<template>
    <div class="data-view-carousel" ref="dataVcarousel">
        <span v-if="title.label" class="demonstration" :style="title.style">{{title.label}}</span>
        <el-carousel style="width: 100%;margin: 10px 0;overflow: hidden" :height="autoHeight"
                     v-bind="carouselBind">
            <el-carousel-item v-for="(carouselItem,index) in carouselItems" :key="index" class="carousel-item">
                <div class="comp-container">
                    <component :is="carouselItem.componentName" v-bind="carouselItem.data">
                    </component>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: "DataCarousel",
        props: {
            dataVComponent: {
                type: Object,
                default() {
                    return {}
                }
            },
            title: {
                type: Object,
                default() {
                    return {}
                },
            },
            carouselItems: {
                type: Array,
                default() {
                    return []
                }
            },
            carouselBind: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data(){
            return {
                autoHeight:''
            }
        },
        //监听拖拽组件高度变化处理走马灯高度（elementUi走马灯的高度不会变化的~~~坑）
        watch: {
            dataVComponent:{
                handler(newValue){
                    let componentHeight = newValue.style.height;
                    let componentHeightNum = Number(componentHeight.substring(0,componentHeight.length-2));
                    this.autoHeight =  `${componentHeightNum-80}px`;  //使用app1的数据进行计算
                },
                deep:true
            }
        }
    }


</script>

<style scoped>
    .carousel-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .data-view-carousel ,.comp-container {
        text-align: center;
        width: 100%;
        height: 100%;
    }

</style>
