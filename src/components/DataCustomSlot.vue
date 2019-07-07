<!--自定义组件插槽-->
<template>
    <div class="data-view-custom">
        <div class="main-container">
            <div class="title-container">
                <span class="demonstration" :style="title.style">{{title.label}}</span>
            </div>

            <div class="custom-container" v-for="(custom,index) in customMix" :key="index">
                <component style="height: 100%;width: 100%;clear: both" class="custom-item" :is="custom.componentName"
                           v-bind="custom.data"></component>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "DataCustomSlot",
        props: {
            title: {
                type: Object,
                default() {
                    return {}
                },
            },
            customMix: {
                type: Array,
                default() {
                    return [];
                }
            }
        }
    }
</script>

<style scoped>
    .data-view-custom {
        width: 100%;
        height: 100%;
        text-align: center;

    }

    .main-container {
        width: 100%;
        height: 100%;
        clear: both;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .custom-container {
        margin: 10px 0;
        overflow: hidden;
    }

</style>
