//组件的配置项设置
import {getDataSourceType} from "./request";

export const COMPONENT_SETTINGS = {
    //折线图配置
    line: {
        settings: {
            metrics: {
                type: 'input',
                name: '指标',
                dataType: Array,
            },
            dimension: {
                type: 'input',
                name: '维度',
                dataType: Array,
            },
            area: {
                type: 'switch',
                name: '显示面积',
            }
        }
    }
};

// 全局样式
export const GLOBAL_STYLE = {
    'background-color': {
        type: 'color',
        name: '背景颜色',
    },
    'background-image': {
        type: 'upload',
        name: '背景图',
        options: {
            name: 'file',
            action: '/api/dataV/upload',
            limit: 1
        },
    }
};

//样式
export const COMPONENT_STYLE = {
    'background-color': {
        type: 'color',
        name: '背景颜色',
    },
    'border-radius': {
        type: 'input',
        name: '边框弧度',
    },
    'border-color': {
        type: 'color',
        name: '边框颜色',
    },
    'border-width': {
        type: 'input',
        name: '边框宽度'
    },
    'border-style': {
        type: 'input',
        name: '边框类型',
    }
};

//数据源
export const DATA_SOURCE = {
    type: {
        name: '数据源类型',
        type: 'select',
        values: []
    },
    api: {
        type: 'input',
        name: 'api',
        value: '',
        with: 'type=API'
    },
    //静态数据直接保存在组件里面吧~
    // static: {
    //     type: 'codemirror',
    //     name: '静态数据',
    //     value: '',
    //     with: 'type=1',
    //     options: {
    //         tabSize: 4,
    //         mode: 'application/json',
    //         theme: 'rubyblue',
    //         lineNumbers: true,
    //         line: true,
    //     }
    // },
    sql: {
        type: 'codemirror',
        name: 'SQL脚本',
        value: '',
        inputType: 'textarea',
        with: 'type=SQL',
        options: {
            tabSize: 4,
            mode: 'text/x-sql',
            theme: 'rubyblue',
            lineNumbers: true,
            line: true,
            textWrapping: true
        }
    },
    webSocket: {
        type: 'input',
        name: '表名',
        value: '',
        with: 'type=WebSocket'
    }
};

function dataSourece() {
    getDataSourceType().then(result => {
        DATA_SOURCE.type.values = result;
    }).catch(err => {
        window.console.warn(err);
    })
}

dataSourece();
