<template>
    <div class="data-view-setting">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="全局样式" name="global">
                <FieldRender :field-define="globalStyle" :bind-data="dropZoneStyle"></FieldRender>
            </el-collapse-item>
            <div v-if="dataVComponent!==null">
                <el-collapse-item title="样式" name="style">
                    <FieldRender :field-define="style" :bind-data="dataVComponent.style"></FieldRender>
                </el-collapse-item>

                <el-collapse-item title="组件配置项" name="config" v-if="Object.keys(configs).length>0">
                    <FieldRender :field-define="configs" :bind-data="dataVComponent.data"></FieldRender>
                </el-collapse-item>

                <el-collapse-item title="数据源" name="dataSource">
                    <FieldRender :field-define="dataSource" :bind-data="dataVComponent.dataSource"></FieldRender>
                </el-collapse-item>
            </div>

        </el-collapse>
    </div>
</template>

<script>
    //引入各种组件的字段配置，数据源选项配置，样式选项配置
    import {CONFIG_SETTINGS, DATA_SOURCE, GLOBAL_STYLE, STYLE} from '../component_config_settings.js';
    import FieldRender from './FieldRender'

    export default {
        name: "ConfigSetting",
        components: {
            FieldRender
        },
        props: {
            dataVComponent: {
                type: Object,
                default() {
                    return null
                }
            },
            dropZoneStyle: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                activeName: '1',
                configs: {},
                style: STYLE,
                dataSource: DATA_SOURCE,
                globalStyle: GLOBAL_STYLE
            }
        },
        watch: {
            dataVComponent: {
                deep: true,
                handler(newValue) {
                    if (newValue && newValue.type) {
                        this.configs = CONFIG_SETTINGS[newValue.type] || {}
                    }
                },
            }
        }
    }
</script>

<style scoped>

    /deep/ .el-color-picker {
        padding: 0 5px;
        top: 4px
    }

    /deep/ .el-collapse-item__content{
        padding-bottom: 0px;

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
