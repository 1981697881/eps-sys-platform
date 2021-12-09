<template>
    <el-card shadow="never" style="width: 1200px">
        <el-row>
            <el-col :span="19">
                <el-row>
                    <div style="text-align: center;font-size: 32px;margin-bottom: 30px;">{{formData.businessName}}</div>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <div @click="upPage">
                            <i style="font-size: 72px;line-height: 160px;" class="el-icon-arrow-left"></i>
                        </div>

                    </el-col>
                    <el-col :span="8">
                        <el-image style="width: 100%"
                                  :src="api.loadBarCode + '?trackingNumber=' + formData.trackingNumber"></el-image>
                    </el-col>
                    <el-col :span="8" style="text-align: right">
                        <div @click="nextPage">
                            <i style="font-size: 72px;line-height: 160px;" class="el-icon-arrow-right"></i>
                        </div>

                    </el-col>
                </el-row>
                <el-row>
                    <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="trackingNumber"
                                label="快递单号">
                        </el-table-column>
                        <el-table-column
                                prop="businessName"
                                label="快递类型">
                        </el-table-column>
                        <el-table-column
                                prop="addressee"
                                label="收件人名称">
                        </el-table-column>
                        <el-table-column
                                prop="addresseeMobileNumber"
                                label="收件人手机">
                        </el-table-column>
                        <el-table-column
                                prop="buildingName"
                                label="地址">
                        </el-table-column>
                        <el-table-column
                                prop="signedTime"
                                label="签收时间">
                            <template scope="scope">
                                {{ scope.row.signedTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="verifyState"
                                label="核销状态">
                            <template scope="scope">
                                {{scope.row.verifyState ? getVerifyStateName(scope.row.verifyState) :'-' }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row>
                    <div style="margin-top: 30px;text-align: center;">
                        <el-button type="info" style="margin-right: 60px;" @click="handleUpdateVerifyState('VERIFIED')">
                            确认核销
                        </el-button>
                        <el-button type="danger" @click="handleUpdateVerifyState('NOT_VERIFIED')">取消核销</el-button>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="5">
                <el-image  style="width: 240px;height: 362px;" :src="api.downloadFile + '?code=' + formData.signedFileCode">
                    <div slot="error" style="width: 240px;height: 362px;text-align: center;color: #999999;line-height: 362px;">
                        暂无签名
                    </div>
                </el-image>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    export default {
        name: "ExceptionTemplateEdit",
        data() {
            return {
                api: {
                    detail: this.$api.deliveryRecord.detail,
                    downloadFile: this.$api.common.downloadFile,
                    updateState: this.$api.deliveryRecord.updateState,
                    loadBarCode: this.$api.deliveryRecord.loadBarCode,
                    updateVerifyState: this.$api.deliveryRecord.updateVerifyState,
                    timeList: this.$api.deliveryTime.list,
                    list: this.$api.deliveryRecord.list,
                    updateDeliveryMethodTime: this.$api.deliveryRecord.updateDeliveryMethodTime,
                },
                deliveryTimes: [],
                exceptionList: [],
                showSignedFile: false,
                showExceptionList: false,
                showUpdateDeliveryMethodTime: false,
                showHistory: false,
                showUpdateState: false,
                updateDeliveryMethodTimeForm: {
                    deliveryMethod: '',
                    deliveryTimeCode: ''
                },
                formData: {},
                searchForm: {
                    trackingNumber: '',
                    addresseeKeyword: '',
                    business: '',
                    deliverymanKeyword: '',
                    buildingCode: '',
                    verifyState: '',
                    deliveryMethod: '',
                    state: '',
                    deliveryTimeCode: '',
                    buildingCodes: [],
                    times: [],
                },
                updateStateForm: {},
                states: [
                    {
                        name: "已签收",
                        value: "SIGNED",
                    }, {
                        name: "派送中",
                        value: "DELIVERING",
                    }, {
                        name: "待派送",
                        value: "WAIT",
                    }, {
                        name: "待取货",
                        value: "WAIT_SIGNED",
                    }, {
                        name: "异常",
                        value: "EXCEPTION",
                    }, {
                        name: "拒收",
                        value: "REFUSE",
                    }
                ],
                pager: {},
                verifyStates: [
                    {
                        name: "已核销",
                        value: "VERIFIED",
                    },
                    {
                        name: "未核销",
                        value: "NOT_VERIFIED",
                    }, {
                        name: "未签收",
                        value: "NOT_SIGNED",
                    },
                ], deliveryMethods: [
                    {
                        name: "送货上门",
                        value: "DELIVERY",
                    },
                    {
                        name: "自取",
                        value: "SELF",
                    }
                ]
                , noticeStates: [
                    {
                        name: "已发送",
                        value: "SUCCESS",
                    },
                    {
                        name: "未发送",
                        value: "NOT_SENT",
                    }
                    ,
                    {
                        name: "发送失败",
                        value: "FAIL",
                    }
                ],
                showDeliveryTime: false,
                currentExceptionCode: '',
                index: 1,
                tableData: []
            }

        },
        methods: {
            getBusinessName(value) {
                console.log(value)
                let vm = this;
                this.$http.post(this.$api.common.loadBusiness, {}).then((resp) => {
                    vm.businesses = resp.data.data.businesses;
                    for (let i = 0; i < this.businesses.length; i++) {
                        if (this.businesses[i].value === value) {
                            return this.businesses[i].name
                        }
                    }
                })

            },
            upPage() {
                let vm = this;
                console.log(vm.index)
                if (vm.index <= 1) {
                    vm.index = 1;
                    vm.$confirm('当前已是最前记录！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                    });
                    return;
                }
                vm.handleSearch(vm.index - 1);
            },
            nextPage() {
                let vm = this;
                console.log(vm.index)
                console.log(vm.pager.pageCount)
                console.log(vm.pager.pageCount <= vm.index)

                if (vm.pager.pageCount <= vm.index) {
                    vm.index = vm.pager.pageCount;
                    vm.$confirm('当前已是最后记录！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                    });
                    return;
                }
                vm.handleSearch(vm.index + 1);
            },
            updateDeliveryMethodTime() {
                let vm = this;
                vm.showUpdateDeliveryMethodTime = true;
                this.$http.post(this.api.updateDeliveryMethodTime, vm.$qs.stringify({
                    code: vm.formData.code,
                    deliveryMethod: vm.updateDeliveryMethodTimeForm.deliveryMethod,
                    deliveryTimeCode: vm.updateDeliveryMethodTimeForm.deliveryTimeCode,
                })).then((resp) => {
                    vm.showUpdateDeliveryMethodTime = false;
                    if (resp.data.status === 200) {
                        vm.$message({
                            type: 'success',
                            message: resp.data.desc
                        });
                    } else {
                        vm.$message({
                            type: 'error',
                            message: resp.data.desc
                        });
                    }
                    vm.loadDetail();
                })
            },
            showTime() {
                let vm = this;
                if (vm.updateDeliveryMethodTimeForm.deliveryMethod === 'DELIVERY') {
                    vm.showDeliveryTime = true;
                    vm.showDeliveryTimes();
                } else {
                    vm.showDeliveryTime = false;
                }
            },
            showDeliveryTimes() {
                let vm = this;
                vm.showUpdateDeliveryMethodTime = true;
                this.$http.post(this.api.timeList, vm.$qs.stringify({onPage: false})).then((resp) => {
                    vm.deliveryTimes = resp.data.data.deliveryTimes;
                })
            },
            addException() {
                let vm = this
                this.$http.post(vm.$api.deliveryRecord.addDeliveryException, vm.$qs.stringify({
                    code: vm.formData.code,
                    exceptionTemplateCode: vm.currentExceptionCode,
                })).then(function (resp) {
                    vm.exceptionList = resp.data.data.exceptionTemplates;
                    if (resp.data.status === 200) {
                        vm.$message({
                            type: 'success',
                            message: resp.data.desc
                        });
                    } else {
                        vm.$message({
                            type: 'error',
                            message: resp.data.desc
                        });
                    }
                    vm.loadDetail();
                });
                vm.showExceptionList = false;
            },
            handleCurrentChange(val) {
                let vm = this;
                if (val && val.code) {
                    vm.currentExceptionCode = val.code
                }

            },
            showAddException() {
                let vm = this;
                vm.showExceptionList = true;
                vm.currentExceptionCode = ''
                vm.loadExceptionList();
            },
            loadExceptionList() {
                let vm = this;
                this.$http.post(vm.$api.exceptionTemplate.list, vm.$qs.stringify({
                    onPage: false
                })).then(function (resp) {
                    vm.exceptionList = resp.data.data.exceptionTemplates;
                });
            },
            handleSearch(index) {
                let vm = this;
                this.$http.post(this.api.list, this.$qs.stringify({
                    pageIndex: index,
                    pageSize: 1,
                    deliveryMethod: vm.searchForm.deliveryMethod,
                    trackingNumber: vm.searchForm.trackingNumber,
                    state: vm.searchForm.state,
                    verifyState: vm.searchForm.verifyState,
                    business: vm.searchForm.business,
                    deliveryTimeCode: vm.searchForm.deliveryTimeCode,
                    startCreateTime: vm.searchForm.times[0] ? vm.$moment(vm.searchForm.times[0]).format('yyyy-MM-DD HH:mm:ss') : "",
                    endCreateTime: vm.searchForm.times[1] ? vm.$moment(vm.searchForm.times[1]).format('yyyy-MM-DD HH:mm:ss') : "",
                })).then((resp) => {
                    console.log(resp.data.data.deliveryRecords)
                    vm.tableData = resp.data.data.deliveryRecords;
                    vm.formData = vm.tableData[0];
                    vm.index = resp.data.data.pager.pageIndex;
                    if (vm.formData.signedFileCode) {
                        vm.showSignedFile = true
                    } else {
                        vm.showSignedFile = false
                    }

                    //处理分页
                    vm.pager.pageIndex = resp.data.data.pager.pageIndex;
                    vm.pager.pageSize = resp.data.data.pager.pageSize;
                    vm.pager.itemCount = resp.data.data.pager.itemCount;
                    vm.pager.pageCount = resp.data.data.pager.pageCount;

                })
            },
            handleUpdateVerifyState(verifyState) {
                let vm = this;
                this.$http.post(this.api.updateVerifyState, vm.$qs.stringify({
                    code: vm.formData.code,
                    verifyState: verifyState,
                })).then(function (resp) {
                    vm.showUpdateState = false

                    if (resp.data.status === 200) {
                        vm.$message({
                            type: 'success',
                            message: resp.data.desc
                        });
                        vm.handleSearch(vm.index + 1);
                    } else {
                        vm.$message({
                            type: 'error',
                            message: resp.data.desc
                        });
                    }
                });

            },
            getNoticeStateName(value) {
                for (let i = 0; i < this.noticeStates.length; i++) {
                    if (this.noticeStates[i].value === value) {
                        return this.noticeStates[i].name
                    }
                }
            },
            getDeliveryMethodName(value) {
                for (let i = 0; i < this.deliveryMethods.length; i++) {
                    if (this.deliveryMethods[i].value === value) {
                        return this.deliveryMethods[i].name
                    }
                }
            },
            getStateName(value) {
                for (let i = 0; i < this.states.length; i++) {
                    if (this.states[i].value === value) {
                        return this.states[i].name
                    }
                }
            },
            getVerifyStateName(value) {
                for (let i = 0; i < this.verifyStates.length; i++) {
                    if (this.verifyStates[i].value === value) {
                        return this.verifyStates[i].name
                    }
                }
            },
            loadDetail() {
                let vm = this;
                this.$http.post(this.api.detail, this.$qs.stringify(this.$route.query)).then(function (resp) {
                    // 赋值
                    vm.formData = resp.data.data.deliveryRecord
                    // vm.updateDeliveryMethodTimeForm.deliveryMethod = vm.formData.deliveryMethod;
                    // vm.updateDeliveryMethodTimeForm.deliveryTimeCode = vm.formData.deliveryTimeCode;
                    console.log(vm.formData)
                });
            }
        },

        created() {
            let vm = this;
            let sform = sessionStorage.getItem("deliveryListSearchForm");
            if (sform) {
                this.searchForm = JSON.parse(sform);
            }
            let index = this.$route.query['index'];
            vm.pager.pageIndex = index
            vm.handleSearch(index + 1);

            //当前页面监视键盘输入
            document.onkeydown = function (event) {

                //键盘按键判断:左箭头-37;右箭头-39
                if (event) {
                    switch (event.keyCode) {
                        case 37:
                            vm.upPage();
                            break;
                        case 39:
                            vm.nextPage();
                            break;
                        default:
                            break;
                    }
                }

            }

        },
    }
</script>

<style lang="scss" scoped>
    .fb-form {
        max-width: 500px;
    }

</style>