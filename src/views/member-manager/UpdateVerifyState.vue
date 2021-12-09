<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="150px" class="fb-form">


            <el-form-item label="快递单号：" >
                {{formData.trackingNumber}}
            </el-form-item>
            <el-form-item label="收件人：" >
                {{formData.addressee}}
            </el-form-item>
            <el-form-item label="手机号码：">
                {{formData.addresseeMobileNumber}}
            </el-form-item>
            <el-form-item label="楼栋名称：" >
                {{formData.buildingName}}
            </el-form-item>
            <el-form-item label="户号：" >
                {{formData.memberHouseNumber}}
            </el-form-item>
            <el-form-item label="派送方式：" >
                {{formData.deliveryMethod}}
            </el-form-item>
            <el-form-item label="派送员：" >
                {{formData.deliveryman}}
            </el-form-item>
            <el-form-item label="派送员手机：" >
                {{formData.deliverymanMobileNumber}}
            </el-form-item>
            <el-form-item label="通知情况：" >
                {{formData.noticeState}}
            </el-form-item>
            <el-form-item label="状态：" >
                {{formData.state}}
            </el-form-item>
            <el-form-item label="派件异常次数：" >
                {{formData.exceptionCount}}
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit('form')">用户签收</el-button>
                <el-button @click="handleReset('form')">配送异常</el-button>
                <el-button @click="handleReset('form')">修改配送方式/时间</el-button>
                <el-button @click="handleReset('form')">查看配送历史</el-button>
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
                    detail: this.$api.deliveryRecord.detail
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