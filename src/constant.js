import map from './data/map'
// 树图数据
const treeData = {
    name: 'f',
    value: 1,
    link: 'https://ele.me',
    children: [
        {
            name: 'a',
            value: 1,
            link: 'https://ele.me',
            children: [
                {
                    name: 'a-a',
                    link: 'https://ele.me',
                    value: 2
                },
                {
                    name: 'a-b',
                    link: 'https://ele.me',
                    value: 2
                }
            ]
        },
        {
            name: 'b',
            value: 1,
            link: 'https://ele.me',
            children: [
                {
                    name: 'b-a',
                    link: 'https://ele.me',
                    value: 2
                },
                {
                    name: 'b-b',
                    link: 'https://ele.me',
                    value: 2
                }
            ]
        },
        {
            name: 'c',
            value: 3,
            link: 'https://ele.me',
            children: [
                {
                    name: 'c-a',
                    link: 'https://ele.me',
                    value: 4
                },
                {
                    name: 'c-b',
                    link: 'https://ele.me',
                    value: 2
                }
            ]
        },
        {
            name: 'd',
            value: 3,
            link: 'https://ele.me',
            children: [
                {
                    name: 'd-a',
                    link: 'https://ele.me',
                    value: 4
                },
                {
                    name: 'd-b',
                    link: 'https://ele.me',
                    value: 2
                }
            ]
        }
    ]
};

// 可拖拽模块配置
export const DRAGGABLE_ITEMS = [
    {
        id: '1',
        title: '统计图',
        icon: 'el-icon-pie-chart',
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
            img: require('./assets/images/histogram.jpg'),
            componentName: 'e-charts'
        }, {
            id: '4',
            name: '散点图',
            type: 'scatter',
            componentName: 've-scatter'
        }, {
            id: '5',
            name: '环图',
            type: 'pie',
            img: require('./assets/images/ring.jpg'),
            componentName: 've-ring'
        }, {
            id: '6',
            name: '雷达图',
            type: 'radar',
            componentName: 've-radar'
        }, {
            id: '7',
            name: '瀑布图',
            type: 'waterfall',
            componentName: 've-waterfall'
        }, {
            id: '8',
            name: '漏斗图',
            type: 'funnel',
            componentName: 've-funnel'
        }, {
            id: '9',
            name: '热力图',
            type: 'heatmap',
            componentName: 've-heatmap'
        }, {
            id: '10',
            name: 'K线图',
            type: 'candle',
            componentName: 've-candle'
        }, {
            id: '11',
            name: '仪表盘',
            type: 'gauge',
            componentName: 've-gauge'
        }, {
            id: '12',
            name: '树图',
            type: 'tree',
            componentName: 've-tree'
        }, {
            id: '13',
            name: '桑基图',
            type: 'sankey',
            componentName: 've-sankey'
        }, {
            id: '14',
            name: '地图',
            type: 'map',
            componentName: 'e-charts'
        }
        ]
    },
    {
        id: '2',
        icon: 'el-icon-s-data',
        title: '数据',
        dragItems: [
            {
                id: '1',
                name: '表格',
                type: 'dataTable',
                componentName: 'data-table'
            },
            {
                id: '2',
                name: '走马灯',
                type: 'dataCarousel',
                componentName: 'carousel'
            }
            ,
            {
                id: '3',
                name: '文本框',
                height: 60,
                type: 'dataText',
                img: require('./assets/images/dataText.png'),
                componentName: 'data-text'
            }
        ]

    },
    {
        id: '3',
        icon: 'el-icon-brush',
        title: '装饰',
        dragItems: [
            {
                id: '1',
                name: '图片',
                type: 'picture',
                componentName: 'data-custom'
            }
        ]

    }
];

// 默认数据配置，对应上面的可拖拽模块的type
export const DEFAULT_DATA = {
    //折线图
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
        settings: {
            dimension: ['日期'],
            metrics: ['访问用户', '下单用户', '下单率'],
            area: false
        }

    },
    //饼图
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
    //柱状图
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
    scatter: {
        data: {
            columns: ['日期', '访问用户', '下单用户', '年龄'],
            rows: {
                '上海': [
                    {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
                    {'日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344},
                    {'日期': '1/3', '访问用户': 7123, '年龄': 9, '下单用户': 3245},
                    {'日期': '1/4', '访问用户': 4123, '年龄': 12, '下单用户': 4355},
                    {'日期': '1/5', '访问用户': 3123, '年龄': 15, '下单用户': 4564},
                    {'日期': '1/6', '访问用户': 2323, '年龄': 20, '下单用户': 6537}
                ],
                '北京': [
                    {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
                    {'日期': '1/2', '访问用户': 1273, '年龄': 6, '下单用户': 2344},
                    {'日期': '1/3', '访问用户': 3123, '年龄': 15, '下单用户': 4564},
                    {'日期': '1/4', '访问用户': 2123, '年龄': 9, '下单用户': 3245},
                    {'日期': '1/5', '访问用户': 4103, '年龄': 12, '下单用户': 4355},
                    {'日期': '1/6', '访问用户': 7123, '年龄': 10, '下单用户': 3567}
                ],
                '广州': [
                    {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
                    {'日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344},
                    {'日期': '1/3', '访问用户': 2123, '年龄': 30, '下单用户': 3245},
                    {'日期': '1/5', '访问用户': 4123, '年龄': 12, '下单用户': 4355},
                    {'日期': '1/4', '访问用户': 5123, '年龄': 18, '下单用户': 4564},
                    {'日期': '1/6', '访问用户': 3843, '年龄': 30, '下单用户': 4850}
                ]
            }
        },
        width: '100%',
        height: '100%',
    },
    // 雷达图
    radar: {
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
    // 瀑布图
    waterfall: {
        data: {
            columns: ['活动', '时间'],
            rows: [
                {'活动': '吃饭', '时间': 4},
                {'活动': '睡觉', '时间': 10},
                {'活动': '打豆豆', '时间': 5}
            ]
        },
        width: '100%',
        height: '100%',

    },
    // 漏斗图
    funnel: {
        data: {
            columns: ['状态', '数值'],
            rows: [
                {'状态': '展示', '数值': 900},
                {'状态': '访问', '数值': 600},
                {'状态': '点击', '数值': 300},
                {'状态': '订单', '数值': 100}
            ]
        },
        width: '100%',
        height: '100%',

    },
    // 热力图
    heatmap: {
        data: {
            columns: ['时间', '地点', '人数'],
            rows: [
                {'时间': '星期一', '地点': '北京', '人数': 1000},
                {'时间': '星期二', '地点': '上海', '人数': 400},
                {'时间': '星期三', '地点': '杭州', '人数': 800},
                {'时间': '星期二', '地点': '深圳', '人数': 200},
                {'时间': '星期三', '地点': '长春', '人数': 100},
                {'时间': '星期五', '地点': '南京', '人数': 300},
                {'时间': '星期四', '地点': '江苏', '人数': 800},
                {'时间': '星期三', '地点': '北京', '人数': 700},
                {'时间': '星期三', '地点': '上海', '人数': 300},
                {'时间': '星期二', '地点': '杭州', '人数': 500}
            ]
        },
        settings: {
            xAxisList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            yAxisList: ['北京', '上海', '杭州', '深圳', '长春', '南京', '江苏']
        },
        width: '100%',
        height: '100%',
    },
    //K线图
    candle: {
        data: {
            columns: ['日期', 'open', 'close', 'lowest', 'highest', 'vol'],
            rows: [
                {
                    '日期': '2004-01-05',
                    open: 10411.85,
                    close: 10544.07,
                    lowest: 10411.85,
                    highest: 10575.92,
                    vol: 221290000
                },
                {
                    '日期': '2004-01-06',
                    open: 10543.85,
                    close: 10538.66,
                    lowest: 10454.37,
                    highest: 10584.07,
                    vol: 191460000
                },
                {
                    '日期': '2004-01-07',
                    open: 10535.46,
                    close: 10529.03,
                    lowest: 10432.12,
                    highest: 10587.55,
                    vol: 225490000
                },
                {
                    '日期': '2004-01-08',
                    open: 10530.07,
                    close: 10592.44,
                    lowest: 10480.59,
                    highest: 10651.99,
                    vol: 237770000
                },
                {
                    '日期': '2004-01-09',
                    open: 10589.25,
                    close: 10458.89,
                    lowest: 10420.52,
                    highest: 10603.48,
                    vol: 223250000
                },
                {
                    '日期': '2004-01-12',
                    open: 10461.55,
                    close: 10485.18,
                    lowest: 10389.85,
                    highest: 10543.03,
                    vol: 197960000
                },
                {
                    '日期': '2004-01-13',
                    open: 10485.18,
                    close: 10427.18,
                    lowest: 10341.19,
                    highest: 10539.25,
                    vol: 197310000
                },
                {
                    '日期': '2004-01-14',
                    open: 10428.67,
                    close: 10538.37,
                    lowest: 10426.89,
                    highest: 10573.85,
                    vol: 186280000
                },
                {
                    '日期': '2004-01-15',
                    open: 10534.52,
                    close: 10553.85,
                    lowest: 10454.52,
                    highest: 10639.03,
                    vol: 260090000
                },
                {
                    '日期': '2004-01-16',
                    open: 10556.37,
                    close: 10600.51,
                    lowest: 10503.71,
                    highest: 10666.88,
                    vol: 254170000
                },
                {
                    '日期': '2004-01-20',
                    open: 10601.42,
                    close: 10528.66,
                    lowest: 10447.92,
                    highest: 10676.96,
                    vol: 224300000
                },
                {
                    '日期': '2004-01-21',
                    open: 10522.77,
                    close: 10623.62,
                    lowest: 10453.11,
                    highest: 10665.72,
                    vol: 214920000
                },
                {
                    '日期': '2004-01-22',
                    open: 10624.22,
                    close: 10623.18,
                    lowest: 10545.03,
                    highest: 10717.41,
                    vol: 219720000
                },
                {
                    '日期': '2004-01-23',
                    open: 10625.25,
                    close: 10568.29,
                    lowest: 10490.14,
                    highest: 10691.77,
                    vol: 234260000
                },
                {
                    '日期': '2004-01-26',
                    open: 10568.12,
                    close: 10702.51,
                    lowest: 10510.44,
                    highest: 10725.18,
                    vol: 186170000
                },
                {
                    '日期': '2004-01-27',
                    open: 10701.11,
                    close: 10609.92,
                    lowest: 10579.33,
                    highest: 10748.81,
                    vol: 206560000
                },
                {
                    '日期': '2004-01-28',
                    open: 10610.07,
                    close: 10468.37,
                    lowest: 10412.44,
                    highest: 10703.25,
                    vol: 247660000
                },
                {
                    '日期': '2004-01-29',
                    open: 10467.41,
                    close: 10510.29,
                    lowest: 10369.92,
                    highest: 10611.56,
                    vol: 273970000
                },
                {
                    '日期': '2004-01-30',
                    open: 10510.22,
                    close: 10488.07,
                    lowest: 10385.56,
                    highest: 10551.03,
                    vol: 208990000
                },
                {
                    '日期': '2004-02-02',
                    open: 10487.78,
                    close: 10499.18,
                    lowest: 10395.55,
                    highest: 10614.44,
                    vol: 224800000
                },
                {
                    '日期': '2004-02-03',
                    open: 10499.48,
                    close: 10505.18,
                    lowest: 10414.15,
                    highest: 10571.48,
                    vol: 183810000
                },
                {
                    '日期': '2004-02-04',
                    open: 10503.11,
                    close: 10470.74,
                    lowest: 10394.81,
                    highest: 10567.85,
                    vol: 227760000
                },
                {
                    '日期': '2004-02-05',
                    open: 10469.33,
                    close: 10495.55,
                    lowest: 10399.92,
                    highest: 10566.37,
                    vol: 187810000
                },
                {
                    '日期': '2004-02-06',
                    open: 10494.89,
                    close: 10593.03,
                    lowest: 10433.74,
                    highest: 10634.81,
                    vol: 182880000
                },
                {
                    '日期': '2004-02-09',
                    open: 10592.41,
                    close: 10579.03,
                    lowest: 10433.72,
                    highest: 10634.81,
                    vol: 160720000
                },
                {
                    '日期': '2004-02-10',
                    open: 10578.74,
                    close: 10613.85,
                    lowest: 10511.18,
                    highest: 10667.03,
                    vol: 160590000
                },
                {
                    '日期': '2004-02-11',
                    open: 10605.48,
                    close: 10737.72,
                    lowest: 10561.55,
                    highest: 10779.41,
                    vol: 277850000
                },
                {
                    '日期': '2004-02-12',
                    open: 10735.18,
                    close: 10694.07,
                    lowest: 10636.44,
                    highest: 10775.03,
                    vol: 197560000
                },
                {
                    '日期': '2004-02-13',
                    open: 10696.22,
                    close: 10627.85,
                    lowest: 10578.66,
                    highest: 10755.47,
                    vol: 208340000
                },
                {
                    '日期': '2004-02-17',
                    open: 10628.88,
                    close: 10714.88,
                    lowest: 10628.88,
                    highest: 10762.07,
                    vol: 169730000
                },
                {
                    '日期': '2004-02-18',
                    open: 10706.68,
                    close: 10671.99,
                    lowest: 10623.62,
                    highest: 10764.36,
                    vol: 164370000
                },
                {
                    '日期': '2004-02-19',
                    open: 10674.59,
                    close: 10664.73,
                    lowest: 10626.44,
                    highest: 10794.95,
                    vol: 219890000
                },
                {
                    '日期': '2004-02-20',
                    open: 10666.29,
                    close: 10619.03,
                    lowest: 10559.11,
                    highest: 10722.77,
                    vol: 220560000
                },
                {
                    '日期': '2004-02-23',
                    open: 10619.55,
                    close: 10609.62,
                    lowest: 10508.89,
                    highest: 10711.84,
                    vol: 229950000
                },
                {
                    '日期': '2004-02-24',
                    open: 10609.55,
                    close: 10566.37,
                    lowest: 10479.33,
                    highest: 10681.41,
                    vol: 225670000
                },
                {
                    '日期': '2004-02-25',
                    open: 10566.59,
                    close: 10601.62,
                    lowest: 10509.42,
                    highest: 10660.73,
                    vol: 192420000
                },
                {
                    '日期': '2004-02-26',
                    open: 10598.14,
                    close: 10580.14,
                    lowest: 10493.71,
                    highest: 10652.96,
                    vol: 223230000
                },
                {
                    '日期': '2004-02-27',
                    open: 10581.55,
                    close: 10583.92,
                    lowest: 10519.03,
                    highest: 10689.55,
                    vol: 200050000
                }
            ]
        },
        settings: {
            showMA: true,
            showVol: true
        },
        width: '100%',
        height: '100%',
    },
    // 仪表盘
    gauge: {
        data: {
            columns: ['type', 'a', 'b', 'value'],
            rows: [
                {type: '速度', value: 80, a: 1, b: 2}
            ]
        },
        width: '100%',
        height: '100%',

    },
    // 树图
    tree: {
        data: {
            columns: ['name', 'value'],
            rows: [
                {
                    name: 'tree1',
                    value: [treeData]
                },
                {
                    name: 'tree2',
                    value: [treeData]
                }
            ]
        },
        settings: {
            seriesMap: {
                tree1: {
                    top: '5%',
                    left: '7%',
                    bottom: '2%',
                    right: '60%'
                },
                tree2: {
                    top: '20%',
                    left: '60%',
                    bottom: '22%',
                    right: '18%'
                }
            }
        },
        width: '100%',
        height: '100%',

    },
    // 桑基图
    sankey: {
        data: {
            columns: ['页面', '访问量'],
            rows: [
                {'页面': '首页', '访问量': 100000},
                {'页面': '列表页a', '访问量': 20000},
                {'页面': '列表页b', '访问量': 80000},
                {'页面': '内容页a-1', '访问量': 10000},
                {'页面': '内容页a-2', '访问量': 10000},
                {'页面': '内容页b-1', '访问量': 60000},
                {'页面': '内容页b-2', '访问量': 20000}
            ]
        },
        settings: {
            links: [
                {source: '首页', target: '列表页a', value: 0.5},
                {source: '首页', target: '列表页b', value: 0.5},
                {source: '列表页a', target: '内容页a-1', value: 0.1},
                {source: '列表页a', target: '内容页a-2', value: 0.4},
                {source: '列表页b', target: '内容页b-1', value: 0.2},
                {source: '列表页b', target: '内容页b-2', value: 0.3}
            ]
        },
        width: '100%',
        height: '100%',
    },
    //地图
    map: {
        options: map,
        initOptions: {
            renderer: 'canvas'
        },
        autoresize: true,
    },
    //数据表格
    dataTable: {
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
        }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
        }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        }],
        tableTitles: [
            {
                prop: "date",
                label: "日期",
                width: "180"
            },
            {
                prop: "name",
                label: "姓名",
                width: "180"
            },
            {
                prop: "address",
                label: "地址",
            }
        ]
    },
    //图片走马灯
    dataCarousel: {
        title: {
            label: '走马灯',
            style: {
                color: '#111'
            }
        },
        carouselItems: [
            {
                componentName: 'el-image',
                data: {
                    src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                    fit: 'fill'
                }
            },
            {
                componentName: 'el-image',
                data: {
                    src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                    fit: 'fill'
                }
            },
            {
                componentName: 'el-image',
                data: {
                    src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                    fit: 'fill'
                }
            }
        ],
        carouselBind: {
            indicatorPosition: "outside"
        }
    },
    //文本
    dataText: {
        text: {
            label: '文本、标题',
            style: {
                'text-align': 'center',
                color: '#111',
                'font-size': '16px'
            }
        }
    },
    //图片
    picture: {
        title: {
            label: '图标标题',
            style: {
                color: '#111'
            }
        },
        customMix: [
            {
                componentName: 'el-image',
                data: {
                    src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                    fit: 'fill'
                }
            }
        ]
    }
};


function randomize() {
    return [0, 0, 0].map(() => {
        return Math.round(300 + Math.random() * 700) / 10
    })
}




