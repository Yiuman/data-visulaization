/**
 * 数据处理器，拖拽组件的数据字段处理通过这里配置的处理器进行处理
 * 用于保存视图后，再次渲染数据的时候进行处理
 */
export const process = {
    lineProcesser: (data) => {
        return data.map(({...data,userProcess:true}))
    }
};
