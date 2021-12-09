<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="150px" class="fb-form">


            <el-form-item label="微信昵称：" >
                {{formData.nickname}}
            </el-form-item>
            <el-form-item label="姓名：" >
                {{formData.realName}}
            </el-form-item>
            <el-form-item label="手机号：">
                {{formData.mobileNumber}}
            </el-form-item>
            <el-form-item label="楼栋号：" >
                {{formData.buildingName}}
            </el-form-item>
            <el-form-item label="不适合配送时间：" >
                <div>工作日</div>
                <div v-if="formData.weekdaysNoDeliveryTimes && formData.weekdaysNoDeliveryTimes.length">
                    <div v-bind:key="index" v-for="(time,index) in formData.weekdaysNoDeliveryTimes">
                        {{ time }}
                    </div>
                </div>
                <div v-else>
                    -
                </div>
                <div>节假日</div>
                <div v-if="formData.holidayNoDeliveryTimes && formData.holidayNoDeliveryTimes.length">
                    <div v-bind:key="index" v-for="(time,index) in formData.holidayNoDeliveryTimes">
                        {{ time }}
                    </div>
                </div>
                <div v-else>
                    -
                </div>

            </el-form-item>

            <el-form-item label="注册时间：">
                {{ formData.registerTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
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
        name: "ExceptionTemplateEdit",
        data() {
            return {
                api: {
                    detail: this.$api.member.detail
                },
                formData: {}
            }

        },
        methods: {

        },

        created() {
            let vm = this;
            this.$http.post(this.api.detail,this.$qs.stringify(this.$route.query)).then(function (resp) {
                // 赋值
                vm.formData = resp.data.data.member
            });
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>