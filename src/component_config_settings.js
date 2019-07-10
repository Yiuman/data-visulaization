//组件的配置项设置
export const CONFIG_SETTINGS = {
    //折线图配置
    line: {
        settings: {
            metrics: {
                type: 'input',
                name: '指标',
                dataType:Array,
            },
            dimension: {
                type: 'input',
                name: '维度',
                dataType:Array,
            },
            area: {
                type: 'switch',
                name: '显示面积',
            }
        }
    }
};

// 全局样色
export const GLOBAL_STYLE = {
    'background-color': {
        type: 'color',
        name: '背景颜色',
    }
};

//样式
export const STYLE = {
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
        values: [
            {
                value: 0,
                label: 'api接口'
            },
            {
                value: 1,
                label: '静态数据'
            },
            {
                value: 2,
                label: 'SQL'
            }
        ]
    },
    api: {
        type: 'input',
        name: '接口',
        value: '',
        inputType:'textarea',
        with:'type=0'
    },
    sql: {
        type: 'input',
        name: 'SQL脚本',
        value: '',
        inputType:'textarea',
        with:'type=2'
    }
};
