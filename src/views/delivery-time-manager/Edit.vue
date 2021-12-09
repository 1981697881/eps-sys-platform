<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="fb-form">

            <el-form-item label="时段" prop="times" :error="formErrorMsg.times">
                <el-time-picker
                        is-range
                        @input="elTimePickerChange"
                        v-model="formData.times"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                </el-time-picker>
            </el-form-item>

            <el-form-item label="频次" prop="type" :error="formErrorMsg.type">
                <el-select v-model="formData.type" placeholder="请选择频次">
                    <el-option label="上午" value="MORNING"></el-option>
                    <el-option label="下午" value="AFTERNOON"></el-option>
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
        name: "DeliveryTimeEdit",
        data() {
            return {
                api: {
                    add: this.$api.deliveryTime.update,
                    detail: this.$api.deliveryTime.detail,
                    update: this.$api.deliveryTime.update,
                },
                formErrorMsg: {},
                formData: {
                    times: [],
                    startTime: 1,
                    endTime: 1,
                    type: '',
                },
                rules: {
                    times: [
                        {required: true, message: '请选择时段', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择频次', trigger: 'blur'},
                    ]

                },
            }
        },
        methods: {
            elTimePickerChange(e){
                let _this =this
                console.log(e)
                _this.$nextTick(() => {
                    _this.$set(_this.formData, "times", [e[0], e[1]]);
                    _this.$forceUpdate();
                });
            },
            handleSubmit(form) {

                let vm = this;
                vm.$refs[form].validate((valid) => {
                    if (valid) {
                        vm.$http.post(vm.api.update,this.$qs.stringify({
                            type: this.formData.type,
                            code: this.formData.code,
                            startTime: this.$moment(this.formData.times[0]).format('HH:mm:ss'),
                            endTime: this.$moment(this.formData.times[1]).format('HH:mm:ss')
                        })).then((resp)=>{

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
                vm.formData = resp.data.data.deliveryTime
                vm.formData.times = [new Date(), new Date()]
                vm.formData.times[0].setTime(resp.data.data.deliveryTime.startTime)
                vm.formData.times[1].setTime(resp.data.data.deliveryTime.endTime)
            });


        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>