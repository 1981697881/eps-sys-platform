const utils = {}

// discernTrackingNumber
utils.dtn = function (trackingNumber) {

    let business = ""

    // 判断是否是圆通
    let yt = /^[YT|DD|G].*/
    if (yt.test(trackingNumber)) {
        return "YT"
    }

    // 判断是否是顺丰
    let sf = /^[SF].*/
    if (sf.test(trackingNumber)) {
        return "SF"
    }

    let length12 = function (trackingNumber){
        console.log(12)
        // 判断是否是中通
        let zt = /^5.*/
        if (zt.test(trackingNumber)) {
            return "ZTO"
        }

        // 判断是否是申通
        let st = /^1.*/
        if (st.test(trackingNumber)) {
            return "STO"
        }

        // 默认返回顺丰
        return "SF"
    }

    let length13 = function (trackingNumber){
        console.log(13)
        // 判断是否是韵达
        let zt = /^[3|4|5|6|7|8].*/
        if (zt.test(trackingNumber)) {
            return "YD"
        }

        // 默认返回顺丰
        return "SF"
    }

    let length14 = function(trackingNumber){
        console.log(14)
        // 判断是否是中通
        let zt = /^7.*/
        if (zt.test(trackingNumber)) {
            return "ZTO"
        }

        // 默认返回顺丰
        return "SF"
    }

    let length15 = function(trackingNumber){
        console.log(15)
        // 判断是否是申通
        let zt = /^7.*/
        if (zt.test(trackingNumber)) {
            return "STO"
        }

        // 默认返回顺丰
        return "SF"
    }

    switch (trackingNumber.length) {
        case 12:
            business = length12(trackingNumber);
            break;
        case 13:
            business = length13(trackingNumber);
            break;
        case 14:
            business = length14(trackingNumber);
            break;
        case 15:
            business = length15(trackingNumber);
            break;
    }

    return business
}

export default Object.assign(
    utils
)