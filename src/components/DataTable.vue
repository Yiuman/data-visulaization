<template>
    <div class="data-view-table">
        <el-table
                :data="tableData"
                style="width: 100%;height: 100%"
                :border="border">
            <el-table-column v-for="(titleItem,index) in tableTitles"
                             v-bind="titleItem"
                             :key="index">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "DataTable",
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableTitles: {
                type: Array,
                default() {
                    return []
                }
            },
            border: {
                type: Boolean,
                default() {
                    return true
                }
            }
        }
    }
</script>

<style scoped>
    .data-view-table {
        width: 100%;
        height: 100%;
    }
</style>
