const WEB_SOCKET_URL = 'localhost:8843';

//全屏与退出全屏食，改变组件的比例大小缩放
export function transDataVComponentsStyle(isPreview, zoneStyle, dataVComponents, screenSize = {
    width: screen.width,
    height: screen.height
}) {
    let xProportion = getProportion(screenSize.width, getSizeNumberWithUnit(zoneStyle.width)),
        yProportion = getProportion(screenSize.height, getSizeNumberWithUnit(zoneStyle.height));
    dataVComponents.forEach(item => {
        let style = item.style;
        let realWidth = style.width.substring(0, style.width.length - 2);
        let realHeight = style.height.substring(0, style.height.length - 2);
        if (isPreview) {
            style.width = `${xProportion * realWidth}px`;
            style.height = `${yProportion * realHeight}px`;
            style.transform = `translate(${item.positionX * xProportion}px,${item.positionY * yProportion}px)`
        } else {
            style.width = `${realWidth / xProportion}px`;
            style.height = `${realHeight / yProportion}px`;
            style.transform = `translate(${item.positionX}px,${item.positionY}px)`
        }

        item.style = style;
    });
}

/**
 * 全屏
 */
export function fullScreen(ele = document.documentElement) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    }
}

//获取两个值的比例
export function getProportion(divisor, dividend) {
    return (Number(divisor) / Number(dividend)).toFixed(4);
}

/**
 * 判断是否全屏
 * @returns {boolean}
 */
export function isFullScreen() {
    return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
    );
}

/**
 * 获取PX单位尺寸的数字
 * @param sizeObject PX单位
 * @param unit
 */
export function getSizeNumberWithUnit(sizeObject, unit = 'px') {
    return String(sizeObject).endsWith(unit)?sizeObject.substring(0, sizeObject.length - 2):sizeObject;

}

/**
 *
 * @param pathArray 对象属性层级的数组
 * @param obj 对象
 * @returns {*}
 */
export const get = (pathArray, obj) => pathArray.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj);


/**
 * 多层级嵌套赋值
 * @param obj 赋值的对象
 * @param path 需要赋值的属性 如：aaa.bbb
 * @param value 值
 */
export const set = (obj, path, value) => {
    let schema = obj;
    let pList = path.split('.');
    let len = pList.length;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem]) schema[elem] = {};
        schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
};

export const initWebSocket = (vm, component) => {
    if ('WebSocket' in window) {
        const websockt = new WebSocket("ws://" + WEB_SOCKET_URL + "/datavisual/service/DataVisualWSService!init.comet?key=" + component.componentId);

        websockt.onopen = (e) => {
            window.console.warn("onopen", e);
            websockt.send({key: component.componentId});
        };

        websockt.onmessage = (reuslt) => {
            window.console.warn(reuslt.data);
            let jsonResponse = JSON.parse(reuslt.data);
            set(component, `data.${component.dataField}`, jsonResponse.data);
            // component.data[component.dataField] = jsonRes.data;
        };

        websockt.onerror = (e) => {
            window.console.warn("onerror", e)
        };

        websockt.onclose = (e) => {
            window.console.warn("onclose", e)
        };

        return websockt;
    } else {
        vm.$message({message: 'Not support webSocket'});
    }
};

/**
 * 生成uuid
 * @param len  长度
 * @param radix 技术
 * @returns {string} uuid字符串
 */
export const uuid = (len = 32, radix = 16) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};

