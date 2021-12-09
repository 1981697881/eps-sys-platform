<template>
    <fb-form-body>

        <el-form  :inline="true" :model="formData" :rules="rules" ref="form" label-width="130px">
            <el-row>
                <el-form-item label="揽件方式" prop="receivingMethod" >
                    <el-select style="width: 200px" v-model="formData.receivingMethod" placeholder="请选择揽件方式">
                        <el-option label="上门揽件" value="RECEIVING"></el-option>
                        <el-option label="网点自寄" value="SELF"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="快递单号" prop="trackingNumber">
                    <el-input @change="handleTrackingNumber" v-model="formData.trackingNumber" placeholder="请输入快递单号"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="寄件人" prop="sender">
                    <el-input  v-model="formData.sender" placeholder="请输入寄件人"></el-input>
                </el-form-item>
                <el-form-item label="寄件人手机" prop="senderMobileNumber">
                    <el-input  v-model="formData.senderMobileNumber" placeholder="请输入寄件人手机"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item class="search-form-item" label="寄件人地区">
                    <el-cascader :placeholder="formData.senderAreaName"  v-model="formData.senderAreaNumbers" style="width: 544px" :props="area"></el-cascader>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="寄件人详细地址" prop="senderAddress" >
                    <el-input placeholder="请输入寄件人详细地址" style="width: 544px"   v-model="formData.senderAddress"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="收件人" prop="addressee">
                    <el-input placeholder="请输入收件人" v-model="formData.addressee"></el-input>
                </el-form-item>
                <el-form-item label="收件人手机" prop="addresseeMobileNumber">
                    <el-input placeholder="请输入收件人手机" v-model="formData.addresseeMobileNumber"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item class="search-form-item" label="收件人地区">
                    <el-cascader :placeholder="formData.addresseeAreaName" v-model="formData.addresseeAreaNumbers" style="width: 544px"  :props="area"></el-cascader>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="收件人详细地址" prop="addresseeAddress" >
                    <el-input placeholder="请输入收件人详细地址" style="width: 544px"   v-model="formData.addresseeAddress"></el-input>
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item class="search-form-item" label="揽件时段" prop="deliveryTimeCode">
                    <el-select style="width: 200px" v-model="formData.deliveryTimeCode" placeholder="请选择揽件时段">
                        <el-option v-bind:key="time.code" v-for="time in deliveryTimes" :label="$moment(time.startTime).format('HH:mm:ss') + ' - ' + $moment(time.endTime).format('HH:mm:ss')" :value="time.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物品重量(Kg)" prop="weight" >
                    <el-input placeholder="请输入物品重量"  v-model="formData.weight"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="物品信息" prop="articleInfo">
                    <el-input placeholder="请输入物品信息"  style="width: 544px" type="textarea" v-model="formData.articleInfo"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="备注" prop="remarks">
                    <el-input placeholder="请输入备注" style="width: 544px" type="textarea" v-model="formData.remarks"></el-input>
                </el-form-item>
            </el-row>
            <el-row>

                <el-form-item label="快递费用" prop="budget" >
                    <el-input placeholder="请输入快递费用" v-model="formData.budget"></el-input>
                </el-form-item>

                <el-form-item label="快递类型" prop="business">
                    <el-select style="width: 200px" v-model="formData.business" placeholder="请选择快递类型">
                        <el-option v-bind:key="business.value" v-for="business in businesses" :label="business.name" :value="business.value"></el-option>
                    </el-select>
                </el-form-item>

            </el-row>

            <el-row>

                <el-form-item label="揽件人" prop="waiterCode">
                    <el-select @change="selectWaiter" style="width: 200px" v-model="formData.waiterCode" placeholder="请选择揽件人">
                        <el-option v-bind:key="epsEmployee.code" v-for="epsEmployee in epsEmployees" :label="epsEmployee.realName" :value="epsEmployee.code"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="揽件人手机" prop="waiterMobileNumber">
                    <el-input placeholder="请输入揽件人手机" v-model="formData.waiterMobileNumber"></el-input>
                </el-form-item>

            </el-row>

            <el-form-item >
                <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
<!--                <el-button @click="handleReset('form')">重置</el-button>-->
            </el-form-item>
        </el-form>

    </fb-form-body>
</template>

<script>

    export default {
        name: "ExceptionTemplateAdd",
        data() {
            return {
                api: {
                    detail: this.$api.receivingRecord.detail,
                    update: this.$api.receivingRecord.update
                },
                formErrorMsg: {},
                formData: {
                    receivingMethod: '',
                    trackingNumber: '',
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
                    senderAreaNumbers: [],
                    addresseeAreaNumbers: [],
                },
                deliveryTimes: [],
                businesses: [],
                epsEmployees: [],
                rules: {
                    receivingMethod: [
                        {required: true, message: '请选择揽件方式', trigger: 'blur'}
                    ],
                    trackingNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ],
                    sender: [
                        {required: true, message: '请输入寄件人', trigger: 'blur'}
                    ],
                    senderMobileNumber: [
                        {required: true, message: '请输入寄件人手机号', trigger: 'blur'}
                    ],
                    senderAddress: [
                        {required: true, message: '请输入寄件人详细地址', trigger: 'blur'}
                    ],
                    senderAreas: [
                        {required: true, message: '请输入寄件人地区', trigger: 'blur'}
                    ],
                    addressee: [
                        {required: true, message: '请输入收件人', trigger: 'blur'}
                    ],
                    addresseeMobileNumber: [
                        {required: true, message: '请输入收件人手机号', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                if (!value) {
                                    callback();
                                    return;
                                }

                                let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
                                if (!reg.test(value)) {
                                    callback("手机号码错误！")
                                } else {
                                    callback()
                                }

                            }, trigger: 'blur'
                        }
                    ],
                    addresseeAreas: [
                        {required: true, message: '请输入收件人地区', trigger: 'blur'}
                    ],
                    addresseeAddress: [
                        {required: true, message: '请输入收件人详细地址', trigger: 'blur'}
                    ],
                    weight: [
                        {required: true, message: '请输入物品重量', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                if (!value) {
                                    callback();
                                    return;
                                }

                                let reg = /^\d+(\.\d{2})?$/
                                if (!reg.test(value)) {
                                    callback("只能输入数字，最多两位小数")
                                } else {
                                    callback()
                                }

                            }, trigger: 'blur'
                        }
                    ],
                    articleInfo: [
                        {required: true, message: '请输入物品信息', trigger: 'blur'}
                    ],
                    budget: [
                        {required: true, message: '请输入快递费用', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                if (!value) {
                                    callback();
                                    return;
                                }

                                let reg = /^\d+(\.\d{2})?$/
                                if (!reg.test(value)) {
                                    callback("只能输入数字，最多两位小数")
                                } else {
                                    callback()
                                }

                            }, trigger: 'blur'
                        }
                    ],
                    business: [
                        {required: true, message: '选择快递厂商', trigger: 'blur'}
                    ],
                    waiterMobileNumber: [
                        {required: true, message: '请输入揽件人手机号', trigger: 'blur'}
                    ],
                    waiterCode: [
                        {required: true, message: '请选择揽件人', trigger: 'blur'}
                    ],
                    deliveryTimeCode: [
                        {required: true, message: '请选择揽件时间段', trigger: 'blur'}
                    ]

                },
                area: { }
            }

        }
        ,
        methods: {
            selectWaiter() {
                let vm = this
                for (let i = 0; i < vm.epsEmployees.length; i++) {
                    if (vm.formData.waiterCode === vm.epsEmployees[i].code) {
                        vm.formData.waiterMobileNumber = vm.epsEmployees[i].mobileNumber
                    }
                }

            },
            handleTrackingNumber() {
                let vm = this;
                vm.formData.business = vm.$utils.dtn(vm.formData.trackingNumber);
            },
            handleSubmit(form)
            {

                let vm = this;
                vm.$refs[form].validate((valid) => {

                    if (vm.formData.senderAreaNumbers && vm.formData.senderAreaNumbers.length < 1) {
                        vm.formData.senderAreaNumbers.push(vm.formData.senderAreaNumber)
                        console.log(vm.formData.senderAreaNumbers)

                    }

                    if (vm.formData.addresseeAreaNumbers && vm.formData.addresseeAreaNumbers.length < 1) {
                        vm.formData.addresseeAreaNumbers.push(vm.formData.addresseeAreaNumber)
                        console.log(vm.formData.addresseeAreaNumbers)
                    }

                    if (valid) {
                        vm.$http.post(vm.api.update, vm.$qs.stringify({
                            code: this.formData.code,
                            receivingMethod: this.formData.receivingMethod,
                            trackingNumber: this.formData.trackingNumber,
                            sender: this.formData.sender,
                            senderMobileNumber: this.formData.senderMobileNumber,
                            senderAddress: this.formData.senderAddress,
                            senderAreaNumber: this.formData.senderAreaNumbers[this.formData.senderAreaNumbers.length - 1],
                            addressee: this.formData.addressee,
                            addresseeMobileNumber: this.formData.addresseeMobileNumber,
                            addresseeAreaNumber: this.formData.addresseeAreaNumbers[this.formData.addresseeAreaNumbers.length - 1],
                            addresseeAddress: this.formData.addresseeAddress,
                            weight: this.formData.weight,
                            articleInfo: this.formData.articleInfo,
                            remarks: this.formData.remarks,
                            budget: this.formData.budget,
                            business: this.formData.business,
                            waiterMobileNumber: this.formData.waiterMobileNumber,
                            waiterCode: this.formData.waiterCode,
                            deliveryTimeCode: this.formData.deliveryTimeCode,
                        })).then((resp) => {

                            if (resp.data.status === 200) {
                                vm.$message({
                                    type: 'success',
                                    message: resp.data.desc
                                });
                                vm.$router.back();
                            } else if (resp.data.status === 400) {

                                console.log(vm.$refs[form]);


                                resp.data.data.errorFields.forEach(function (a) {

                                    vm.formErrorMsg[a.name] = '';
                                    vm.$nextTick(() => {
                                        vm.formErrorMsg[a.name] = a.message;
                                    });


                                });

                                if (resp.data.desc) {
                                    vm.$message({
                                        type: "error",
                                        message: resp.data.desc
                                    });
                                }


                            } else {
                                vm.$message({
                                    type: "error",
                                    message: resp.data.desc
                                })
                            }

                        });
                        return true;
                    } else {
                        return false;
                    }
                });

            }
            ,
            handleReset(form)
            {
                this.$refs[form].resetFields();
            },
            loadDetail() {
                let vm = this;
                this.$http.post(this.api.detail, this.$qs.stringify(this.$route.query)).then(function (resp) {
                    // 赋值
                    vm.formData = resp.data.data.receivingRecord
                    vm.formData.addresseeAreaNumbers = []
                    vm.formData.senderAreaNumbers = []
                    vm.formData.receivingHistory = vm.formData.receivingHistory?JSON.parse(vm.formData.receivingHistory):[]
                });
            },

        }
        ,
        created() {
            let vm = this;

            this.$http.post(this.$api.epsEmployee.list,this.$qs.stringify({
                onPage: false,
                roleFlag:'COLLECTOR'
            })).then((resp)=>{
                vm.epsEmployees =  resp.data.data.epsEmployees;
            })

            this.$http.post(vm.$api.deliveryTime.list,vm.$qs.stringify({onPage:false})).then((resp)=>{
                vm.deliveryTimes = resp.data.data.deliveryTimes;
            })
            this.$http.post(this.$api.common.loadBusiness,{}).then((resp)=>{
                vm.businesses = resp.data.data.businesses;
            })

            vm.area = {
                lazy: true,
                lazyLoad (node, resolve) {

                    const { level } = node;

                    vm.$http.post(vm.$api.common.loadAreaChildren,vm.$qs.stringify({parentNumber:node?node.value:""})).then((resp)=>{
                        const nodes = resp.data.data.areas.map(item => ({
                            value: item.number,
                            label: item.name,
                            leaf: level >= 2
                        }));
                        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                        resolve(nodes);
                    })

                }
            }

            vm.loadDetail();
        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>