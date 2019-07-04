// 可拖拽模块配置
export const DRAGGABLE_ITEMS = [
    {
        id: '1',
        title: '统计图',
        icon: 'el-icon-picture-outline-round',
        dragItems: [{
            id: '1',
            name: '折线图',
            type: 'line',
            componentName: 've-line'
        }, {
            id: '2',
            name: '饼图',
            type: 'pie',
            componentName: 've-pie'
        }, {
            id: '3',
            name: '柱状图',
            type: 'bar',
            img: require('./assets/chart-type/histogram.jpg'),
            componentName: 'e-charts'
        }, {
            id: '4',
            name: '散点图',
            type: 'scatter',
            componentName: 've-scatter'
        },{
            id: '5',
            name: '环图',
            type: 'pie',
            img: require('./assets/chart-type/ring.jpg'),
            componentName: 've-ring'
        }]
    }
];

// 默认数据配置，对应上面的可拖拽模块的type
export const DEFAULT_DATA = {
    line: {
        data: {
            columns: ['日期', '访问用户', '下单用户', '下单率'],
            rows: [
                {'日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32},
                {'日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26},
                {'日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76},
                {'日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49},
                {'日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323},
                {'日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78}
            ]
        },
        width: '100%',
        height: '100%',

    },
    pie: {
        data: {
            columns: ['日期', '访问用户'],
            rows: [
                {'日期': '1/1', '访问用户': 1393},
                {'日期': '1/2', '访问用户': 3530},
                {'日期': '1/3', '访问用户': 2923},
                {'日期': '1/4', '访问用户': 1723},
                {'日期': '1/5', '访问用户': 3792},
                {'日期': '1/6', '访问用户': 4593}
            ]
        },
        width: '100%',
        height: '100%',
    },
    bar: {
        options: {
            legend: {},
            tooltip: {},
            dataset: {
                // Provide data.
                source: [
                    ['Product', '2015', '2016', '2017'],
                    ['Matcha Latte', ...randomize()],
                    ['Milk Tea', ...randomize()],
                    ['Cheese Cocoa', ...randomize()],
                    ['Walnut Brownie', ...randomize()]
                ]
            },
            // Declare X axis, which is a category axis, mapping
            // to the first column by default.
            xAxis: {type: 'category'},
            // Declare Y axis, which is a value axis.
            yAxis: {},
            // Declare several series, each of them mapped to a
            // column of the dataset by default.
            series: [{type: 'bar'}, {type: 'bar'}, {type: 'bar'}]
        },
        initOptions: {
            renderer: 'canvas'
        },
        autoresize: true,
        theme: 'ovilia-green'
    },
    scatter:{
        data:{
            columns: ['日期', '访问用户', '下单用户', '年龄'],
            rows: {
                '上海': [
                    { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
                    { '日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344 },
                    { '日期': '1/3', '访问用户': 7123, '年龄': 9, '下单用户': 3245 },
                    { '日期': '1/4', '访问用户': 4123, '年龄': 12, '下单用户': 4355 },
                    { '日期': '1/5', '访问用户': 3123, '年龄': 15, '下单用户': 4564 },
                    { '日期': '1/6', '访问用户': 2323, '年龄': 20, '下单用户': 6537 }
                ],
                '北京': [
                    { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
                    { '日期': '1/2', '访问用户': 1273, '年龄': 6, '下单用户': 2344 },
                    { '日期': '1/3', '访问用户': 3123, '年龄': 15, '下单用户': 4564 },
                    { '日期': '1/4', '访问用户': 2123, '年龄': 9, '下单用户': 3245 },
                    { '日期': '1/5', '访问用户': 4103, '年龄': 12, '下单用户': 4355 },
                    { '日期': '1/6', '访问用户': 7123, '年龄': 10, '下单用户': 3567 }
                ],
                '广州': [
                    { '日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244 },
                    { '日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344 },
                    { '日期': '1/3', '访问用户': 2123, '年龄': 30, '下单用户': 3245 },
                    { '日期': '1/5', '访问用户': 4123, '年龄': 12, '下单用户': 4355 },
                    { '日期': '1/4', '访问用户': 5123, '年龄': 18, '下单用户': 4564 },
                    { '日期': '1/6', '访问用户': 3843, '年龄': 30, '下单用户': 4850 }
                ]
            }
        },
        width: '100%',
        height: '100%',
    }
};


function randomize() {
    return [0, 0, 0].map(() => {
        return Math.round(300 + Math.random() * 700) / 10
    })
}



