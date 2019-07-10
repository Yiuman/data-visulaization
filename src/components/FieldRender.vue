<template>
    <div class="data-view-field">
        <div v-for="(key,index) in Object.keys(fieldDefine)" :key="index" class="setting-container">
            <!--如果是层级结构则递归-->
            <field-render v-if="!fieldDefine[key].type" :field-define="fieldDefine[key]"
                          :bind-data="bindData[key]">
            </field-render>

            <!--输入框-->
            <div v-if="fieldDefine[key].type === 'input'">
                <div v-if="fieldDefine[key].dataType && fieldDefine[key].dataType===Array">
                    <el-input :placeholder="fieldDefine[key].tips?fieldDefine[key].tips:'请输入内容'"
                              :value="bindData[key].join(',')"
                              :type="fieldDefine[key].inputType?fieldDefine[key].inputType:'text'"
                              @input="arrayInput($event,key)">
                        <template slot="prepend">{{fieldDefine[key].name}}</template>
                    </el-input>
                </div>
                <div v-else>
                    <el-input :placeholder="fieldDefine[key].tips?fieldDefine[key].tips:'请输入内容'"
                              v-model="bindData[key]"
                              v-if="!fieldDefine[key].with || (fieldDefine[key].with
                              && String(bindData[`${fieldDefine[key].with.split('=')[0]}`]) === `${fieldDefine[key].with.split('=')[1]}`) "
                              :type="fieldDefine[key].inputType?fieldDefine[key].inputType:'text'">
                        <template slot="prepend">{{fieldDefine[key].name}}</template>
                    </el-input>
                </div>
            </div>


            <!--颜色选择器-->
            <div v-if="fieldDefine[key].type==='color'" style="display: inline-table;">
                <div class="el-input-group__prepend" style="height: 40px;line-height: 40px">{{fieldDefine[key].name}}
                </div>
                <div class="color-container">
                    <el-color-picker size="small" v-model="bindData[key]"></el-color-picker>
                </div>
            </div>

            <!--下拉选择器-->
            <div v-if="fieldDefine[key].type==='select'">
                <el-select v-model="bindData[key]"
                           :placeholder="fieldDefine[key].tips?fieldDefine[key].tips:'请选择'">
                    <el-option
                            v-for="item in fieldDefine[key].values"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <!--开关、是/否-->
            <div v-if="fieldDefine[key].type==='switch'" style="display: inline-table;">
                <div class="el-input-group__prepend" style="height: 40px;line-height: 40px">{{fieldDefine[key].name}}
                </div>
                <div class="switch-container">
                    <el-switch v-model="bindData[key]" style="margin:0 10px"></el-switch>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "FieldRender",
        props: {
            fieldDefine: {
                type: Object,
                default() {
                    return {}
                }
            }, bindData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        methods: {
            arrayInput(value, key) {
                window.console.warn("value:", value, "key:", key)
                this.bindData[key] = value.split(",")
            }
        }
    }
</script>

<style scoped>
    .data-view-field {
        text-align: left;
    }

    .setting-container {
        padding-bottom: 10px;
    }

    .color-container {
        border-radius: 0 4px 4px 0;
        border: 1px solid #DCDFE6;
    }

    .switch-container {
        border-radius: 0 4px 4px 0;
        border: 1px solid #DCDFE6;
        height: 40px;
        line-height: 40px;
    }
</style>
