<template>
    <fb-form-body>
        <el-form :model="formData" ref="form" label-width="150px" class="fb-form">


            <el-form-item label="快递单号：">
                {{formData.trackingNumber}}
            </el-form-item>
            <el-form-item label="收件人：">
                {{formData.addressee}}
            </el-form-item>
            <el-form-item label="手机号码：">
                {{formData.addresseeMobileNumber}}
            </el-form-item>
            <el-form-item label="楼栋名称：">
                {{formData.buildingName ? formData.buildingName : '-'}}
            </el-form-item>
            <el-form-item label="户号：">
                {{formData.houseNumber ? formData.houseNumber : '-'}}
            </el-form-item>
            <el-form-item label="派送方式：">
                {{formData.deliveryMethod ? getDeliveryMethodName(formData.deliveryMethod) : '-'}}
            </el-form-item>
            <el-form-item label="派送员：">
                {{formData.deliveryman ? formData.deliveryman : '-'}}
            </el-form-item>
            <el-form-item label="派送员手机：">
                {{formData.deliverymanMobileNumber ? formData.deliverymanMobileNumber : '-'}}
            </el-form-item>
            <el-form-item label="通知情况：">
                {{formData.noticeState ? getNoticeStateName(formData.noticeState) : '-'}}
            </el-form-item>
            <el-form-item label="状态：">
                {{formData.state ? getStateName(formData.state) : '-'}}
            </el-form-item>
            <el-form-item label="派件异常次数：">
                {{formData.exceptionCount}}
            </el-form-item>

        </el-form>
        <hr style="margin-bottom: 20px;">
        <div>
            <el-button type="primary" @click="showUpdateState=true">用户签收</el-button>
            <el-button type="danger" @click="showAddException()">配送异常</el-button>
            <el-button @click="showDeliveryTimes()">修改配送方式/时间</el-button>
            <el-button @click="showHistory=true">查看配送历史</el-button>
            <el-button @click="showSignedFile()">查看签名</el-button>
        </div>

        <el-dialog
                title="签名文件"
                :visible.sync="showSigned"
                width="300px">
            <el-image  style="width: 240px;height: 362px;" :src="api.downloadFile + '?code=' + formData.signedFileCode"></el-image>
        </el-dialog>

        <el-dialog
                title="配送历史"
                :visible.sync="showHistory"
                width="30%">
            <div style="margin-bottom: 20px;" v-bind:key="index" v-for="(item,index) in formData.deliveryHistory">
                <span>{{item.time}}</span>
                <span style="margin-left: 40px;">{{item.desc}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showHistory = false">取 消</el-button>
            <el-button type="primary" @click="showHistory = false">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
                title="用户签收"
                :visible.sync="showUpdateState"
                width="30%">
            <el-form :inline="true">
                <el-row>
                    <el-form-item label="签收结果">
                        <el-select v-model="updateStateForm.state" placeholder="请选择揽件方式">
                            <el-option label="正常签收" value="SIGNED"></el-option>
                            <el-option label="拒收" value="REFUSE"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="签收描述">
                        <el-input
                                style="width: 500px"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入内容"
                                v-model="updateStateForm.remarks">
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showUpdateState = false">取 消</el-button>
            <el-button type="primary" @click="updateState">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
                title="添加异常"
                :visible.sync="showExceptionList"
                width="30%">
            <el-table
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    :data="exceptionList">
                <el-table-column
                        prop="number"
                        label="原因码"
                >
                    <template scope="scope">
                        {{scope.row.number ? scope.row.number :'(无)' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="文字描述"
                >
                    <template scope="scope">
                        {{scope.row.description ? scope.row.description :'(无)' }}
                    </template>
                </el-table-column>

            </el-table>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showExceptionList = false">取 消</el-button>
            <el-button type="primary" @click="addException">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
                title="修改派送方式与时间"
                :visible.sync="showUpdateDeliveryMethodTime"
                width="30%">
            <el-form :inline="true">
                <el-row>
                    <el-form-item label="派送方式">
                        <el-select @change="showTime" v-model="updateDeliveryMethodTimeForm.deliveryMethod" placeholder="请选择揽件方式">
                            <el-option label="送货上门" value="DELIVERY"></el-option>
                            <el-option label="自取" value="SELF"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row v-if="showDeliveryTime">
                    <el-form-item label="派送日期">
                        <el-select @change="reloadTimes" v-model="updateDeliveryMethodTimeForm.dateType" placeholder="请选择揽日期">
                            <el-option label="今天" value="TODAY"></el-option>
                            <el-option label="明天" value="TOMORROW"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row v-if="showDeliveryTime">
                    <el-form-item label="派送时间">
                        <el-select v-model="updateDeliveryMethodTimeForm.deliveryTimeCode" placeholder="请选择揽件时段">
                            <el-option v-bind:key="time.code" v-for="time in timeList"
                                       :label="$moment(time.startTime).format('HH:mm:ss') + ' - ' + $moment(time.endTime).format('HH:mm:ss')"
                                       :value="time.code"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showUpdateDeliveryMethodTime = false">取 消</el-button>
            <el-button type="primary" @click="updateDeliveryMethodTime">确 定</el-button>
          </span>
        </el-dialog>

    </fb-form-body>
</template>

<script>
    export default {
        name: "ExceptionTemplateEdit",
        data() {
            return {
                api: {
                    downloadFile: this.$api.common.downloadFile,
                    detail: this.$api.deliveryRecord.detail,
                    updateState: this.$api.deliveryRecord.updateState,
                    timeList: this.$api.deliveryTime.list,
                    updateDeliveryMethodTime: this.$api.deliveryRecord.updateDeliveryMethodTime,
                },
                deliveryTimes: [],
                exceptionList: [],
                showSigned: false,
                showExceptionList: false,
                showUpdateDeliveryMethodTime: false,
                showHistory: false,
                showUpdateState: false,
                updateDeliveryMethodTimeForm: {
                    deliveryMethod: '',
                    deliveryTimeCode: '',
                    dataTypes: ''
                },
                formData: {},
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
                timeList: [],
                showDeliveryTime: false,
                currentExceptionCode: ''

            }

        },
        methods: {
            showSignedFile() {
                let vm = this;
                if (vm.formData.signedFileCode) {
                    vm.showSigned = true;
                } else {
                    vm.$message({
                        type: 'error',
                        message: "暂无签收文件"
                    });
                }
            },
            reloadTimes() {
                let vm = this;
                let list = [];
                if (vm.updateDeliveryMethodTimeForm.dateType === 'TODAY') {
                    for (let i = 0; i < vm.deliveryTimes.length; i++) {
                        if (new Date() > vm.deliveryTimes.startTime) {
                            list.push(vm.deliveryTimes[i]);
                        }
                    }
                    vm.timeList = list
                } else {
                    vm.timeList = vm.deliveryTimes
                }

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
                vm.showDeliveryTime = vm.updateDeliveryMethodTimeForm.deliveryMethod === 'DELIVERY';
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
            updateState() {
                let vm = this;
                this.$http.post(this.api.updateState, vm.$qs.stringify({
                    code: vm.formData.code,
                    state: vm.updateStateForm.state,
                    remarks: vm.updateStateForm.remarks
                })).then(function (resp) {
                    vm.showUpdateState = false

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
                    vm.updateDeliveryMethodTimeForm.deliveryMethod = vm.formData.deliveryMethod;
                    vm.updateDeliveryMethodTimeForm.deliveryTimeCode = vm.formData.deliveryTimeCode;
                });
            }
        },

        created() {
            let vm = this;
            vm.loadDetail();
        },
    }
</script>

<style lang="scss" scoped>
    .fb-form {
        max-width: 500px;
    }

</style>