<!--文本框组件-->
<template>
    <div class="data-view-text">
        <div :style="text.style">{{text.label}}</div>
    </div>
</template>

<script>
    export default {
        name: "DataText",
        props: {
            text: {
                type: Object,
                default() {
                    return {}
                }
            }
        }
    }
</script>

<style scoped>
    .data-view-text {
        width: 100%;
        height: 100%;
    }
</style>
