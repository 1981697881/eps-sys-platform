<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="fb-form">

            <el-form-item label="原因码" prop="number" :error="formErrorMsg.number">
                <el-input v-model="formData.number"></el-input>
            </el-form-item>

            <el-form-item label="原因描述" prop="description" :error="formErrorMsg.description">
                <el-input type="textarea" v-model="formData.description"></el-input>
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
                    add: this.$api.exceptionTemplate.add
                },
                formErrorMsg: {},
                formData: {
                    description: '',
                    number: '',
                },
                rules: {
                    description: [
                        {required: true, message: '请输入原因描述', trigger: 'blur'}
                    ],
                    number: [
                        {required: true, message: '请输入原因码', trigger: 'blur'},
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
                    vm.$http.post(vm.api.add, vm.$qs.stringify(this.formData)).then((resp) => {

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