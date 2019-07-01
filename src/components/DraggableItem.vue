<template>
    <div>
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-submenu v-for=" (dragMenuItem , index) in dragMenuItems" :key="dragMenuItem.id"
                        :index="String(index+1)">

                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{dragMenuItem.title}}</span>
                </template>
                <el-menu-item-group v-for="dragItem in dragMenuItem.dragItems" :title="dragItem.name"
                                    v-bind:key="dragItem.id">
                    <div class="draggable" draggable="true" @dragstart="dragstart($event,dragItem)"  @dragend="dragend">
                        <el-image style="width: 100px; height: 100px"
                                  :src="dragItem.img"
                                  fit="fit">
                        </el-image>
                    </div>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "DraggableItem",
        data() {
            return {
                dragMenuItems: [{
                    id: '1',
                    title: '饼图',
                    dragItems: [
                        {
                            id: '1',
                            name: '饼图',
                            img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                            type:'pie'
                        }
                    ]
                }]
            }
        },
        methods:{
            dragstart(event,dragItem){
                this.$emit("dragstart")
                window.console.warn("dragstartdragstartdragstart");
                event.dataTransfer.setData('dragItem',JSON.stringify(dragItem));

            },
            dragend(event){
                this.$emit("dragend")
                event.dataTransfer.clearData();
            },
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>