<template>
    <transition name="el-fade-in-linear">
        <div id="login-page" @keyup.enter="login">
            <div class="login-box">

                <div class="slider-banner-box">
                    <img src="../assets/logo_banner.jpg" width="100%" height="100%" alt="">
                </div>

                <div class="login-form">

                    <div style="display: inline-block;text-align: left;width: 80%">

                        <div class="title">
                            <img v-if="appInfo.logo" :src="`${$api.commonFile.download}?code=${appInfo.logo}`" style="height: 50px;" alt="">
                            <img v-else src="../assets/cloudgo_logo.png" style="height: 50px;" alt="">
                        </div>

                        <el-form ref="form" :rules="formRules" :model="form">

                            <el-form-item prop="account">

                                <div class="input-group">
                                    <el-input
                                            prefix-icon="el-icon-user"
                                            :autofocus="true"
                                            placeholder="请输入用户名"
                                            v-model="form.account">
                                    </el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="password">
                                <div class="input-group">
                                    <el-input
                                            prefix-icon="el-icon-lock"
                                            placeholder="请输入密码"
                                            type="password"
                                            v-model="form.password">
                                    </el-input>
                                </div>
                            </el-form-item>

                            <el-form-item prop="verifyCode" :error="formErrorMsg.verifyCode">
                                <div class="input-group">
                                    <el-input
                                            prefix-icon="el-icon-circle-check"
                                            placeholder="请输入图形验证码"
                                            class="verify-input"
                                            v-model="form.verifyCode"
                                    >
                                    </el-input>

                                    <img @click="handleRefreshVerifyCode" class="verify-img" :src="verifyCodeUrl" style="cursor: pointer"
                                         alt="">
                                </div>
                            </el-form-item>






<!--                            <div class="input-group" style="margin-bottom: 20px;">-->
<!--                                <label>记住我？</label>-->
<!--                                <el-switch-->
<!--                                        v-model="rememberMe"-->
<!--                                        on-text=""-->
<!--                                        off-text="">-->
<!--                                </el-switch>-->
<!--                            </div>-->
                            <div class="input-group">
                                <el-button @click.native="login" type="primary" :loading="isBtnLoading">{{btnText}}
                                </el-button>
                            </div>

                        </el-form>


                    </div>

                </div>


                <div class="login-footer" style="">
                    Copyright © {{new Date().getFullYear()}} {{appInfo.company ? appInfo.company :'CloudGo'}}.
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                appInfo:{},
                form:{
                    account:'',
                    password:'',
                    verifyCode:'',
                },
                formErrorMsg:{
                    account:'',
                    password:'',
                    verifyCode:'',
                },
                formRules:{
                    account: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    verifyCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                    ]
                },
                rememberMe: false,
                isBtnLoading: false,
                verifyCodeUrl:this.$api.auth.verifyCode,
            };
        },
        computed: {
            btnText() {
                if (this.isBtnLoading) return '登录中...';
                return '登录';
            }
        },
        methods: {

            handleRefreshVerifyCode(){
                this.verifyCodeUrl = (this.$api.auth.verifyCode  + "?t=" + new Date().getTime());
            },

            login() {

                this.isBtnLoading = true;
                let vm = this;

                this.$refs.form.validate((valid)=>{

                    if(valid){

                        vm.$http.post(vm.$api.auth.login,vm.$qs.stringify(vm.form)).then((resp)=>{

                            if(resp.data.status === 200){

                                //存储登录用户信息
                                sessionStorage.setItem('login-user-info',JSON.stringify(resp.data.data.passport));
                                sessionStorage.setItem('remember-me',JSON.stringify(vm.rememberMe));

                                vm.$router.push({path: '/'});
                            }else if (resp.data.status === 400) {


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
                                vm.isBtnLoading = false;



                            } else{
                                vm.$message({
                                    type:'error',
                                    message:resp.data.desc
                                });
                                vm.isBtnLoading = false;
                            }

                        });

                    }else{
                        vm.isBtnLoading = false;
                    }

                });


            }
        },
        created() {
            this.appInfo = window.appInfo ? window.appInfo : {} ;
            this.handleRefreshVerifyCode();
        }
    }
</script>

<style lang="scss">


    #login-page {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url("../assets/login_bg.png");
        background-position: center;
        background-size: 100%;

        /*.el-form-item{*/
        /*     margin-bottom: 0;*/
        /*}*/


        .login-box {
            position: relative;
            display: flex;
            /*flex-direction: column;*/
            /*align-items: center;*/
            width: 930px;
            height: 420px;
            /*border-radius: 10px;*/
            background: rgba(255, 255, 255, 1);
            top: -40px;


            .slider-banner-box {
                width: 530px;
                display: inline-block;
                float: left
            }

            .login-form {
                width: calc(100% - 530px);
                float: left;
                display: inline-block;
                text-align: center;

                .title {
                    position: relative;
                    color: #c01920;
                    font-weight: bold;
                    font-size: 30px;
                    text-align: center;
                    line-height: 2.2;
                    margin-bottom: 20px;
                    margin-top: 20px;
                    width: 100%;
                    /*text-shadow: #000000 0 0 5px ;*/
                    display: inline-block;
                }


                .input-group {
                    /*margin-bottom: 20px;*/
                    display: inline-block;
                    width: 100%;

                    .verify-input {
                        width: 50%;
                        /*float: left*/
                    }

                    .verify-img {
                        height: 40px;
                        width: calc(50% - 10px);
                        display: inline-block;
                        vertical-align: bottom;
                        margin-left: 10px;
                        float: right;
                    }

                    button {
                        width: 100%;
                        border: none;
                    }
                }
            }


        }

        .login-footer {

            position: absolute;
            bottom: -40px;
            text-align: center;
            color: #242C37;
            font-weight: bold;
            width: 100%;
            left: 0px;

        }

    }

</style>
