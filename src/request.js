import axios from 'axios';

axios.defaults.baseURL = '';

/**
 * 获取视图
 * @param viewId 视图ID
 */
export const getDataView = (viewId) => {
    return request(`/api/dataV/view/${viewId}`);
};

/**
 * 保存视图
 * @param dataVisualView 视图对象
 */
export const saveView = dataVisualView => {
    return request('/api/dataV/saveView', dataVisualView, 'POST');
};

/**
 * 获取组件
 * @param componentId 组件ID
 */
export const getComponentData = componentId => {
    return request(`/api/dataV/component/${componentId}`);
};

/**
 * 获取文件列表
 * @param mark 标志位，标志这个是属于什么文件
 * @param bingKey 关联对象的主键
 */
export const getFileList = (mark, bingKey) => {
    return request('/api/dataV/getFileList', {mark: mark, bindKey: bingKey})
};

/**
 * 删除组件
 */
export const deleteComponent = componentId => {
    return request(`/api/dataV/component/delete/${componentId}`, {}, 'POST');
};

/**
 * 获取数据源类型
 */
export const getDataSourceType = () => {
    return request('/api/dataV/sources');
};

export const request = (url, params = {}, type = 'GET') => {
    return new Promise((resolve, reject) => {
        if (type === 'GET') {
            // 准备url query参数数据
            let dataStr = '' ;//数据拼接字符串
            Object.keys(params).forEach(key => {
                let val = params[key];
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    //数组
                    val.forEach(item => dataStr += key + '=' + item + '&')
                } else if (Object.prototype.toString.call(val) === "[object Object]") {
                    Object.keys(val).forEach(k => dataStr += `${key}.${k}=${val[k]}`)
                } else {
                    dataStr += key + '=' + params[key] + '&'
                }
            });
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            // 发送get请求
        }

        let promise = type === 'GET' ? axios.get(url) : axios.post(url, params);
        promise.then(result => {
            if (result.data.code === 0) {
                resolve(result.data.data)
            } else {
                reject(result.data.message)
            }
        }).catch(reason => {
            reject(reason.message)
        })
    })
};
