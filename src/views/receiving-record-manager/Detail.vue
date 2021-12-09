<template>
    <fb-form-body>

        <el-form :inline="true" :model="formData" :rules="rules" ref="form" label-width="130px">
            <el-row>
                <el-form-item label="揽件方式：">
                    <div class="width180">
                        {{formData.type === 'SYSTEM'? getReceivingMethodName(formData.receivingMethod):'-'}}
                    </div>
                </el-form-item>

                <el-form-item label="快递单号：">
                    <div class="width180">
                        {{formData.trackingNumber?formData.trackingNumber:'-'}}
                    </div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="寄件人：" >
                    <div class="width180">
                        {{formData.type === 'SYSTEM'? formData.sender:'-'}}
                    </div>
                </el-form-item>
                <el-form-item label="寄件人手机：">
                    <div class="width180">
                        {{formData.type === 'SYSTEM'? formData.senderMobileNumber:''}}
                    </div>
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="寄件人地址：">
                    {{formData.type === 'SYSTEM'? (formData.senderAreaName + formData.senderAddress):'-'}}
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="收件人：">
                    <div class="width180">
                        {{formData.type === 'SYSTEM'?formData.addressee:'-'}}
                    </div>
                </el-form-item>
                <el-form-item label="收件人手机：">
                    <div class="width180">
                        {{formData.type === 'SYSTEM'?formData.addresseeMobileNumber:'-'}}
                    </div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="收件人详细地址：">
                    {{formData.type === 'SYSTEM'?(formData.addresseeAreaName + formData.addresseeAddress):'-'}}
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item class="search-form-item" label="揽件时段:">
                    <div class="width180">
                        {{formData.type === 'SYSTEM'?($moment(formData.receivingStartTime).format('HH:mm:ss') + ' - ' + $moment(formData.receivingEndTime).format('HH:mm:ss')):'-'}}
                    </div>

                </el-form-item>
                <el-form-item label="物品重量(Kg)：">
                    <div class="width180"> {{formData.type === 'SYSTEM'?formData.weight:'-'}}</div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="物品信息：">
                    {{formData.type === 'SYSTEM'?formData.articleInfo:'-'}}
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="备注：">
                    {{formData.type === 'SYSTEM'?formData.remarks:'-'}}
                </el-form-item>
            </el-row>
            <el-row>

                <el-form-item label="快递费用（¥）：">
                    <div class="width180">{{formData.budget?formData.budget:'-'}}</div>
                </el-form-item>

                <el-form-item label="快递类型：">
                    {{formData.business ? getBusinessName(formData.business) :'-' }}
                </el-form-item>

            </el-row>

            <el-row>

                <el-form-item label="揽件人：">
                    <div class="width180">{{formData.waiter}}</div>
                </el-form-item>

                <el-form-item label="揽件人手机：">
                    <div class="width180">{{formData.waiterMobileNumber}}</div>
                </el-form-item>

            </el-row>
            <el-row>
                <el-form-item label="状态：">
                    <div class="width180">{{formData.state?getStateName(formData.state):"-"}}</div>

                </el-form-item>
                <el-form-item label="类型：">
                    <div class="width180">{{formData.type?getTypeName(formData.type):"-"}}</div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="揽件记录：">
                    <div v-if="formData.receivingHistory && formData.receivingHistory.length > 0">
                        <div v-bind:key="index" v-for="(h,index) in formData.receivingHistory">
                            <span>{{ h.time}}</span>
                            <span style="margin-left: 30px">{{h.desc}}</span>
                        </div>
                    </div>
                    <div v-else>
                        暂无揽件记录...
                    </div>
                </el-form-item>
            </el-row>

            <el-form-item>
                <el-button type="danger" @click="handleCancel">取消揽件</el-button>

                <el-button v-if="formData.type === 'SYSTEM'" @click="handleEdit">编辑</el-button>
<!--                <el-button type="info" @click="dialogVisible=true">揽件历史</el-button>-->
            </el-form-item>
        </el-form>
<!--        <el-dialog-->
<!--                title="揽件历史"-->
<!--                :visible.sync="dialogVisible"-->
<!--                width="30%">-->
<!--            <div>-->

<!--            </div>-->
<!--        </el-dialog>-->
    </fb-form-body>
</template>

<script>

    export default {
        name: "ExceptionTemplateAdd",
        data() {
            return {
                api: {
                    detail: this.$api.receivingRecord.detail,
                    updateState: this.$api.receivingRecord.updateState
                },
                formErrorMsg: {},
                receivingMethods: [
                    {
                        name: "上门揽件",
                        value: "RECEIVING",
                    },
                    {
                        name: "网点自寄",
                        value: "SELF",
                    }
                ],
                dialogVisible: false,
                exceptionTemplates: [],
                formData: {
                    receivingMethod: '',
                    trackingNumber: '',
                    receivingStartTime: '',
                    receivingEndTime: '',
                    sender: '',
                    senderMobileNumber: '',
                    senderAddress: '',
                    senderAreas: [],
                    addressee: '',
                    addresseeMobileNumber: '',
                    addresseeAreas: [],
                    addresseeAddress: '',
                    weight: '',
                    articleInfo: '',
                    remarks: '',
                    budget: '',
                    business: '',
                    waiterMobileNumber: '',
                    waiterCode: '',
                    deliveryTimeCode: '',
                },
                states: [
                    {
                        name: "已揽件",
                        value: "RECEIVED",
                    }, {
                        name: "未揽件",
                        value: "NOT_RECEIVED",
                    }, {
                        name: "已取消",
                        value: "CANCELLED",
                    }, {
                        name: "已寄件",
                        value: "SEND_OUT",
                    },
                ],
                payStates: [
                    {
                        name: "已支付",
                        value: "PAID",
                    },
                    {
                        name: "未支付",
                        value: "UNPAID",
                    }, {
                        name: "支付失败",
                        value: "PAID_FAIL",
                    },
                ],
                types:[
                    {
                        name: "系统件",
                        value: "SYSTEM",
                    }, {
                        name: "自揽件",
                        value: "EMPLOYEE_SELF",
                    },
                ],
                businesses: []
            }

        }
        ,
        methods: {
            handleCancel() {
                let vm = this;

                vm.$confirm('您现在正在取消揽件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(this.api.updateState,this.$qs.stringify({
                        code: vm.formData.code,
                        state: 'CANCELLED'
                    })).then((resp)=>{
                        if(resp.data.status === 200){
                            vm.$message({type:'success',message:resp.data.desc});
                            vm.loadDetail();
                        }else{
                            vm.$message({type:'error',message:resp.data.desc});

                        }
                    })



                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });

            },
            getReceivingMethodName(value) {
                for (let i = 0; i < this.receivingMethods.length; i++) {
                    if (this.receivingMethods[i].value === value) {
                        return this.receivingMethods[i].name
                    }
                }
            },
            getBusinessName(value) {
                for (let i = 0; i < this.businesses.length; i++) {
                    if (this.businesses[i].value === value) {
                        return this.businesses[i].name
                    }
                }
            },
            getTypeName(value) {
                for (let i = 0; i < this.types.length; i++) {
                    if (this.types[i].value === value) {
                        return this.types[i].name
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
            loadDetail() {
                let vm = this;
                this.$http.post(this.api.detail, this.$qs.stringify(this.$route.query)).then(function (resp) {
                    // 赋值
                    vm.formData = resp.data.data.receivingRecord

                    vm.formData.receivingHistory = vm.formData.receivingHistory?JSON.parse(vm.formData.receivingHistory):[]
                });
            },
            handleEdit() {
                let vm = this
                vm.$router.push({path:'edit',query:{code: vm.formData.code}})
            }
        },
        created() {
            let vm = this;
            vm.loadDetail()
            // let item = sessionStorage.getItem("detailReceivingRecord");
            // if (item) {
            //     vm.formData = JSON.parse(item)
            //     vm.formData.receivingHistory = vm.formData.receivingHistory?JSON.parse(vm.formData.receivingHistory):[]
            // }
            this.$http.post(this.$api.common.loadBusiness, {}).then((resp) => {
                vm.businesses = resp.data.data.businesses;
            })

            this.$http.post(this.$api.exceptionTemplate.list, {onPage:false}).then((resp) => {
                vm.exceptionTemplates = resp.data.data.exceptionTemplates;
            })
        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;

    }

    .width180 {
        width: 180px;
    }


</style>