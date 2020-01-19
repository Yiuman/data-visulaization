<template>
    <div class="data-view-field">
        <div v-for="(key,index) in Object.keys(fieldDefine)" :key="index" class="setting-container">
            <!--如果是层级结构则递归-->
            <field-render v-if="!fieldDefine[key].type" :field-define="fieldDefine[key]"
                          :bind-data="bindData[key]">
            </field-render>

            <!--有条件的情况渲染-->
            <field-render v-if=" (fieldDefine[key].with
                              && String(bindData[`${fieldDefine[key].with.split('=')[0]}`]) === `${fieldDefine[key].with.split('=')[1]}`) "
                          :bind-data="bindData" :field-define="{[key]:{...fieldDefine[key],with:''}}">
            </field-render>

            <!--无条件渲染-->
            <template v-if="!fieldDefine[key].with">
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
                                  :type="fieldDefine[key].inputType?fieldDefine[key].inputType:'text'">
                            <template slot="prepend">{{fieldDefine[key].name}}</template>
                        </el-input>
                    </div>
                </div>

                <!--颜色选择器-->
                <div v-if="fieldDefine[key].type==='color'" style="display: inline-table;">
                    <div class="el-input-group__prepend" style="height: 40px;line-height: 40px">
                        {{fieldDefine[key].name}}
                    </div>
                    <div class="color-container">
                        <el-color-picker size="small" v-model="bindData[key]">
                        </el-color-picker>
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
                    <div class="el-input-group__prepend" style="height: 40px;line-height: 40px">
                        {{fieldDefine[key].name}}
                    </div>
                    <div class="switch-container">
                        <el-switch v-model="bindData[key]" style="margin:0 10px">
                        </el-switch>
                    </div>
                </div>

                <!--代码器-->
                <div v-if="fieldDefine[key].type==='codemirror'" class="color-container">
                    <codemirror :value="cmInputComputed(key)"
                                :options="fieldDefine[key].options"
                                @input="onCmInput($event,key)"
                                style="width: 100%;overflow-x: hidden"
                                @ready="onCmReady">
                    </codemirror>
                </div>

                <!--上传-->
                <div v-if="fieldDefine[key].type==='upload'">
                    <el-upload style="width: 100%"
                               drag
                               list-type="picture-card"
                               :data="{'mark':key,'bindKey':bindKey}"
                               v-bind="fieldDefine[key].options"
                               :on-success="uploadSuccess"
                               :before-upload="beforeUpload"
                               :on-remove="removeFile"
                               :file-list="keyFileList[key]"
                               :on-preview="handlePreview">
                        <div class="el-upload__text" style="color: #909399">{{fieldDefine[key].name}}</div>
                        <i class="el-icon-upload"/>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div v-if="fieldDefine[key].options.accept" class="el-upload__tip" slot="tip">
                            只能上传({{ [key].options.accept}})文件，且不超过500kb
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </div>

            </template>
        </div>
    </div>
</template>

<script>
    import {getFileList} from '../request'
    import {codemirror} from 'vue-codemirror'
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/mode/javascript/javascript.js'
    import 'codemirror/mode/sql/sql.js'
    import {get, set} from '../visual'

    export default {
        name: "FieldRender",
        components: {
            codemirror
        },
        props: {
            //绑定对象的属性key值，用于做该对象相关的操作记录（如上传文件等）
            bindKey: {
                type: String
            },
            //属性定义，绑定对象的属性定义，用于关联绑定对象，动态修改绑定对象的值
            fieldDefine: {
                type: Object,
                default() {
                    return {}
                }
            },
            //绑定对象
            bindData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                keyFileList: {}
            }
        },
        mounted() {
            //加载已上传的附件
            if (this.bindKey) {
                Object.keys(this.fieldDefine).forEach(key => {
                    if (this.fieldDefine[key].type && this.fieldDefine[key].type === 'upload') {
                        this.keyFileList[key] = this.loadFileList(key) || [];
                    }
                })
            }

        },
        methods: {
            arrayInput(value, key) {
                this.bindData[key] = value.split(",")
            },
            onCmInput(value, key) {
                if (this.fieldDefine[key].options.mode === 'application/json') {
                    try {
                        set(this.bindData, key, JSON.parse(value));
                    } catch (e) {
                        window.console.warn(e);
                    }

                } else {
                    set(this.bindData, key, value);
                }
            },
            onCmReady(cm) {
                require(`codemirror/theme/${cm.options.theme}.css`)
            },
            beforeUpload(item) {
                const vm = this;
                return new Promise(((resolve) => {
                    this.$emit('beforeUpload', item, {bindKey: this.bindKey, mark: this.mark}, (result) => {
                        if (result) {
                            vm.$nextTick(() => {
                                resolve(item);
                            })
                        }
                    });
                }));

            },
            uploadSuccess(response) {
                this.$set(this.bindData, response.data.mark, 'url(' + response.data.url + ')')
            },
            removeFile(file) {
                this.$set(this.bindData, file.response.data.key, '');
            },
            handlePreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true
            },
            loadFileList(key) {
                let fileList = [];
                if (this.bindKey) {
                    getFileList(key, this.bindKey)
                        .then(result => {
                            fileList = result
                        })
                        .catch((error => {
                            this.$message({type: 'warning', message: error})
                        }))
                }
                return fileList;
            },
            cmInputComputed(key) {
                let value = get(key.split("."), this.bindData);
                if (this.fieldDefine[key].options.mode === 'application/json') {
                    return JSON.stringify(value)
                }
                return value;
            }
        }

    }
</script>

<style scoped>

    .data-view-field {
        width: 100%;
        height: 100%;
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

    /deep/ .el-upload-dragger {
        width: 100%;
        height: 100%;
    }

    /deep/ .el-upload {
        display: block;
    }
</style>
