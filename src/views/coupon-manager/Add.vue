<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="fb-form">

            <el-form-item label="优惠券编号" prop="number" :error="formErrorMsg.number">
                <el-input v-model="formData.number"></el-input>
            </el-form-item>

            <el-form-item label="优惠券名称" prop="name" :error="formErrorMsg.name">
                <el-input  v-model="formData.name"></el-input>
            </el-form-item>

            <el-form-item label="总数量" prop="total" :error="formErrorMsg.total">
                <el-input v-model="formData.total"></el-input>
            </el-form-item>

            <el-form-item label="有效时间" prop="times" :error="formErrorMsg.times">
                <el-date-picker
                        v-model="formData.times"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="派送方式" prop="giveMethod" :error="formErrorMsg.giveMethod">
                <el-radio-group v-model="formData.giveMethod">
                    <el-radio label="REGISTER">注册送</el-radio>
                    <el-radio label="LOGIN">登陆送</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="优惠劵用途" prop="purpose" :error="formErrorMsg.purpose">
                <el-radio-group v-model="formData.purpose">
                    <el-radio label="MAIL">寄件</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="优惠金额" prop="discountAmount" :error="formErrorMsg.discountAmount">
                <el-input v-model="formData.discountAmount"></el-input>
            </el-form-item>

            <el-form-item label="起用金额" prop="startingAmount" :error="formErrorMsg.startingAmount">
                <el-input v-model="formData.startingAmount"></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="state" :error="formErrorMsg.state">
                <el-select v-model="formData.state" placeholder="请选择频次">
                    <el-option label="正常派送" value="NORMAL"></el-option>
                    <el-option label="暂停派送" value="STOP"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
                <el-button @click="handleReset('form')">重置</el-button>
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
                    add: this.$api.coupon.add
                },
                formErrorMsg: {},
                formData: {
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
                rules: {
                    number: [
                        {required: true, message: '请输入优惠劵编号', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入优惠劵名称', trigger: 'blur'}
                    ],
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
                    giveMethod: [
                        {required: true, message: '请选择派送方式', trigger: 'blur'}
                    ],
                    times: [
                        {required: true, message: '请选择有效时间', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    startingAmount: [
                        {required: true, message: '请输入起用金额', trigger: 'blur'},
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
                    discountAmount: [
                        {required: true, message: '请输入优惠金额', trigger: 'blur'},
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
                    ]

            },
        }

    }
    ,
    methods: {
        handleSubmit(form)
        {

            let vm = this;
            vm.$refs[form].validate((valid) => {
                if (valid) {
                    vm.$http.post(vm.api.add, vm.$qs.stringify({
                        number: this.formData.number,
                        name: this.formData.name,
                        state: this.formData.state,
                        total: this.formData.total,
                        purpose: this.formData.purpose,
                        giveMethod: this.formData.giveMethod,
                        discountAmount: this.formData.discountAmount,
                        startingAmount: this.formData.startingAmount,
                        startTime: vm.$moment(this.formData.times[0]).format('YYYY-MM-DD HH:mm:ss'),
                        endTime: vm.$moment(this.formData.times[1]).format('YYYY-MM-DD HH:mm:ss')
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
        }
    }
    ,
    created()
    {
        // let vm = this;

    }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>