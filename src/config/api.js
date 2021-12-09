//域名
const domain = window.location.host + "/web";
//端口
const port = null;
//路径
const root = window.location.protocol + "//" + domain + (port ? (":" + port) : "");
/*const root = 'http://gzfzdev.com:50025/api';*/
console.log(root)
console.log(domain)
//接口
const api = {
    building: {
        list: `${root}/building/list`,
        tree: `${root}/building/tree`,
        add: `${root}/building/add`,
        update: `${root}/building/update`,
        detail: `${root}/building/detail`,
        delete: `${root}/building/delete`,
        houseNumberList: `${root}/building/houseNumberList`,
        batchDelete: `${root}/building/batchDelete`
    },
    exceptionTemplate: {
        list: `${root}/exceptionTemplate/list`,
        add: `${root}/exceptionTemplate/add`,
        update: `${root}/exceptionTemplate/update`,
        detail: `${root}/exceptionTemplate/detail`,
        delete: `${root}/exceptionTemplate/delete`,
        batchDelete: `${root}/exceptionTemplate/batchDelete`
    },
    deliveryTime: {
        list: `${root}/deliveryTime/list`,
        listByType: `${root}/deliveryTime/listByType`,
        add: `${root}/deliveryTime/add`,
        update: `${root}/deliveryTime/update`,
        detail: `${root}/deliveryTime/detail`,
        delete: `${root}/deliveryTime/delete`,
        batchDelete: `${root}/deliveryTime/batchDelete`
    },
    epsEmployee: {
        list: `${root}/epsEmployee/list`,
        add: `${root}/epsEmployee/add`,
        update: `${root}/epsEmployee/update`,
        detail: `${root}/epsEmployee/detail`,
        delete: `${root}/epsEmployee/delete`,
        batchDelete: `${root}/epsEmployee/batchDelete`
    },
    coupon: {
        list: `${root}/coupon/list`,
        add: `${root}/coupon/add`,
        update: `${root}/coupon/update`,
        detail: `${root}/coupon/detail`,
        delete: `${root}/coupon/delete`,
        batchDelete: `${root}/coupon/batchDelete`,
    },
    memberCoupon: {
        list: `${root}/memberCoupon/list`,
        updateStateUse: `${root}/memberCoupon/updateStateUse`,
        delete: `${root}/memberCoupon/delete`,
        batchDelete: `${root}/memberCoupon/batchDelete`,
    },
    member: {
        list: `${root}/member/list`,
        add: `${root}/member/add`,
        update: `${root}/member/update`,
        detail: `${root}/member/detail`,
        delete: `${root}/member/delete`,
        export: `${root}/member/export`,
        batchDelete: `${root}/member/batchDelete`
    },
    common: {
        loadAreaChildren: `${root}/common/loadAreaChildren`,
        loadBusiness: `${root}/common/loadBusiness`,
        downloadFile: `${root}/commonFile/download`
    },
    receivingRecord: {
        list: `${root}/receivingRecord/list`,
        add: `${root}/receivingRecord/add`,
        updateState: `${root}/receivingRecord/updateState`,
        update: `${root}/receivingRecord/update`,
        detail: `${root}/receivingRecord/detail`,
        delete: `${root}/receivingRecord/delete`,
        export: `${root}/receivingRecord/export`,
        batchDelete: `${root}/receivingRecord/batchDelete`
    },
    deliveryRecord: {
        list: `${root}/deliveryRecord/list`,
        add: `${root}/deliveryRecord/add`,
        update: `${root}/deliveryRecord/update`,
        detail: `${root}/deliveryRecord/detail`,
        delete: `${root}/deliveryRecord/delete`,
        batchVerify: `${root}/deliveryRecord/batchVerify`,
        exportException: `${root}/deliveryRecord/exportException`,
        export: `${root}/deliveryRecord/export`,
        addDeliveryException: `${root}/deliveryRecord/addDeliveryException`,
        updateVerifyState: `${root}/deliveryRecord/updateVerifyState`,
        updateDeliveryMethodTime: `${root}/deliveryRecord/updateDeliveryMethodTime`,
        updateState: `${root}/deliveryRecord/updateState`,
        loadBarCode: `${root}/deliveryRecord/loadBarCode`,
        batchDelete: `${root}/deliveryRecord/batchDelete`,
        importVerify: `${root}/deliveryRecord/importVerify`
    },
    extremeSpeed: {
        list: `${root}/mobileReceivingRecord/jsdOrdersDetail`,
        update: `${root}/mobileDeliveryRecord/giveJSDOrder`,
    },  
    memberRefuseRecord: {
        list: `${root}/memberRefuseRecord/list`,
    },
    count: {
        loadTaskCount: `${root}/count/loadTaskCount`,
        loadMorningTaskCount: `${root}/count/loadMorningTaskCount`,
        loadAfternoonTaskCount: `${root}/count/loadAfternoonTaskCount`,
    },
    messageNoticeRecord: {
        sendAll: `${root}/messageNoticeRecord/sendAll`,
    }
};

export default Object.assign(
    {
        $base: {
            domain: domain,
            port: port,
            root: root,
        },
    },
    api
)
