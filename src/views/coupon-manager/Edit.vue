<template>
    <fb-form-body>
        <el-form :model="formData" inline ref="form" label-width="130px" class="fb-form">

            <el-row>
                <el-form-item label="优惠券编号：">
                    <div class="width120"></div>
                    {{formData.number}}
                </el-form-item>

                <el-form-item label="优惠券名称：" >
                    <div class="width120"></div>
                    {{formData.name}}
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="优惠劵用途：">
                    <div class="width120"></div>
                    {{formData.purpose === 'MAIL'?'寄件':'通用'}}
                </el-form-item>

                <el-form-item label="总数量：">
                    <div class="width120"></div>
                    {{formData.total}}
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="有效时间：">
                    {{ formData.startTime | dateFormat("yyyy-MM-dd")}}
                    {{' 至 '}}
                    {{ formData.endTime | dateFormat("yyyy-MM-dd")}}
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="优惠金额（￥）：">
                    <div class="width120"></div>
                    {{formData.discountAmount}}
                </el-form-item>

                <el-form-item label="起用金额（￥）：">
                    <div class="width120"></div>
                    {{formData.startingAmount}}
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="派送方式：" >
                    <div class="width120"></div>
                    {{getGiveMethodName(formData.giveMethod)}}
                </el-form-item>

                <el-form-item label="状态：">
                    <div class="width120"></div>
                    {{getStateName(formData.state)}}
                </el-form-item>
            </el-row>

           <hr>

        </el-form>

        <el-form :model="formData" inline ref="form" label-width="100px" class="fb-form">
            <el-row>
                <el-form-item label="有效时间" prop="times" :error="formErrorMsg.times">
                    <el-date-picker
                            v-model="formData.times"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="总数量" prop="total" :error="formErrorMsg.total">
                    <el-input v-model="formData.total"></el-input>
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item label="状态" prop="state" :error="formErrorMsg.state">
                    <el-select v-model="formData.state" placeholder="请选择频次">
                        <el-option label="正常派送" value="NORMAL"></el-option>
                        <el-option label="暂停派送" value="STOP"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>

            <el-row>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </fb-form-body>
</template>

<script>
    export default {
        name: "ExceptionTemplateEdit",
        data() {
            return {
                api: {
                    add: this.$api.coupon.update,
                    detail: this.$api.coupon.detail,
                    update: this.$api.coupon.update,
                },
                formErrorMsg: {},
                formData: {
                    code: '',
                    number: '',
                    name: '',
                    total: '0',
                    purpose: 'MAIL',
                    giveMethod: 'REGISTER',
                    discountAmount: '0',
                    startingAmount: '0',
                    state: '',
                    times: '',
                },
                giveMethods: [
                    {
                        name: "登录送",
                        key: "LOGIN",
                    }, {
                        name: "注册送",
                        key: "REGISTER",
                    }
                ],
                states: [
                    {
                        name: "正常派送",
                        key: "NORMAL",
                    }, {
                        name: "暂停派送",
                        key: "STOP",
                    }
                ],
                rules: {

                    total: [
                        {required: true, message: '请输入总数量', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                if (!value) {
                                    callback();
                                    return;
                                }

                                let reg = /^\d+$/;
                                if (!reg.test(value)) {
                                    callback("只能输入数字")
                                } else {
                                    callback()
                                }

                            }, trigger: 'blur'
                        }
                    ],
                    times: [
                        {required: true, message: '请选择有效时间', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            getStateName(key) {
                for (let i = 0; i < this.states.length; i++) {
                    if (this.states[i].key === key) {
                        return this.states[i].name
                    }
                }
            },
            getGiveMethodName(key) {
                for (let i = 0; i < this.giveMethods.length; i++) {
                    if (this.giveMethods[i].key === key) {
                        return this.giveMethods[i].name
                    }
                }
            },
            handleSubmit(form) {

                let vm = this;
                vm.$refs[form].validate((valid) => {
                    if (valid) {
                        vm.$http.post(vm.api.add, vm.$qs.stringify({
                            code: this.formData.code,
                            state: this.formData.state,
                            total: this.formData.total,
                            startTime: this.$moment(this.formData.times[0]).format('YYYY-MM-DD HH:mm:ss'),
                            endTime: this.$moment(this.formData.times[1]).format('YYYY-MM-DD HH:mm:ss')
                        })).then((resp) => {

                            if(resp.data.status === 200){
                                vm.$message({
                                    type:'success',
                                    message: resp.data.desc
                                });
                                vm.$router.back();
                            }else if(resp.data.status === 400){
                                resp.data.data.errorFields.forEach(function (a) {

                                    vm.formErrorMsg[a.name] = '';
                                    vm.$nextTick(() => {
                                        vm.formErrorMsg[a.name] = a.message;
                                    });


                                });
                                vm.$message({
                                    type:"error",
                                    message: resp.data.desc
                                });
                            }else{
                                vm.$message({
                                    type:"error",
                                    message: resp.data.desc
                                })
                            }

                        });
                        return true;
                    } else {
                        return false;
                    }
                });

            },
            handleReset(form) {
                this.$refs[form].resetFields();
            }
        },

        created() {

            let vm = this;
            this.$http.post(this.api.detail,this.$qs.stringify(this.$route.query)).then(function (resp) {
                vm.formData = resp.data.data.coupon
                vm.formData.times = [new Date(), new Date()]
                vm.formData.times[0].setTime(resp.data.data.coupon.startTime)
                vm.formData.times[1].setTime(resp.data.data.coupon.endTime)
            });

        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        /*max-width: 500px;*/
    }

    .width120 {
        width: 120px;
    }

</style>