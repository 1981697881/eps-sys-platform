<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="fb-form">

            <el-form-item label="父级区域" prop="parentCode" :error="formErrorMsg.parentCode">
                <el-cascader
                        :props="{value:'code',label:'name', checkStrictly: true }"
                        v-model="formData.parentCode"
                        :options="tree"
                        @change="handleChange"></el-cascader>
            </el-form-item>

            <el-form-item label="名称" prop="name" :error="formErrorMsg.name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="sort" :error="formErrorMsg.sort">
                <el-input v-model="formData.sort"></el-input>
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
        name: "BuildingEdit",
        data() {
            return {
                api: {
                    add: this.$api.building.update,
                    detail: this.$api.building.detail,
                    update: this.$api.building.update,
                    tree: this.$api.building.tree
                },
                formErrorMsg: {},
                tree: [],
                formData: {
                    code: '',
                    name: '',
                    parentCode: '',
                    sort: 0,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    sort: {
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

                },
            }
        },
        methods: {
            handleChange(code) {
                if (code && code.length > 0) {
                    this.formData.parentCode = code[code.length - 1]
                }

                console.log(this.formData.parentCode)
            },
            handleSubmit(form) {

                let vm = this;
                vm.$refs[form].validate((valid) => {
                    if (valid) {
                        vm.$http.post(vm.api.update,this.$qs.stringify(this.formData)).then((resp)=>{

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
                for(let key in resp.data.data){
                    for(let fKey in vm.formData){
                        vm.formData[fKey] = resp.data.data[key][fKey]
                    }
                }
            });

            this.$http.post(this.api.tree,this.$qs.stringify(this.searchParams)).then((resp)=>{
                vm.tree = resp.data.data.buildings;
            })

        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>