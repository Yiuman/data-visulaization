<template>
    <div class="draggable-component">
        <el-collapse v-model="activeNames">
            <el-collapse-item  v-for=" (draggableItem , index) in draggableItems" :key="draggableItem.id"
                              :index="String(index+1)" :name="String(index)">
                <template slot="title">
                    <div class="type-title" >
                        <i class="header-icon" :class="draggableItem.icon"></i>
                        {{draggableItem.title}}
                    </div>
                </template>
                <div class="drag-item-container">
                    <div v-for="dragItem in draggableItem.dragItems" :title="dragItem.name"
                         v-bind:key="dragItem.id">
                        <div class="draggable" draggable="true" @dragstart="dragstart($event,dragItem)" @dragend="dragend">
                            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                <img :src="dragItem.img?dragItem.img:require(`../assets/chart-type/${dragItem.type}.jpg`)" class="image">
                                <div class="item-title">
                                    <span>{{dragItem.name}}</span>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </div>

            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import {DRAGGABLE_ITEMS} from '../constant'
    export default {
        name: "DraggableItem",
        data() {
            return {
                activeNames: '0',
                draggableItems: DRAGGABLE_ITEMS
            }
        },
        methods: {
            dragstart(event, dragItem) {
                this.$emit("dragstart");
                event.dataTransfer.setData('dragItem', JSON.stringify(dragItem));

            },
            dragend(event) {
                this.$emit("dragend");
                event.dataTransfer.clearData();
            },
        }
    }
</script>

<style scoped>
    /deep/ .el-collapse-item__header {
        background-color: aliceblue;
    }

    .drag-item-container{
        height: 100%;
        overflow-y: auto;
    }

    .type-title{
        font-size: 16px;
        width: 100%;
        margin: auto;
    }

    .draggable{
        padding: 10px;
    }

    .item-title{
        width: 100%;
        text-align: center;
    }

    .image {
        width: 100%;
        display: block;
    }

</style>
