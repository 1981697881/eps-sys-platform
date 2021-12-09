<template>
    <fb-form-body>
        <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="fb-form">
            <el-form-item label="工号" prop="number" :error="formErrorMsg.number">
                <el-input v-model="formData.number" placeholder="请输入工号"></el-input>
            </el-form-item>

            <el-form-item label="员工姓名" prop="realName" :error="formErrorMsg.realName">
                <el-input v-model="formData.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="gender" :error="formErrorMsg.gender">
                <el-select v-model="formData.gender" placeholder="请选择性别">
                    <el-option label="男" value="MAN"></el-option>
                    <el-option label="女" value="MADAM"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="手机号码" prop="mobileNumber" :error="formErrorMsg.mobileNumber">
                <el-input v-model="formData.mobileNumber"  placeholder="请输入手机号码"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" :error="formErrorMsg.password">
                <el-input v-model="formData.password" placeholder="默认为原密码"></el-input>
            </el-form-item>

            <el-form-item label="角色" prop="roleFlags" :error="formErrorMsg.roleFlags">
                <el-checkbox-group v-model="formData.roleFlags" @change="changeRole">
                    <el-checkbox v-bind:key="role.flag" v-for="role in roles" :label="role.flag" value="">{{role.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item v-if="showDeliveryBuilding" label="派送区域楼栋" prop="deliveryBuildingCodes" :error="formErrorMsg.deliveryBuildingCodes">
                <el-tree
                        :data="buildings"
                        show-checkbox
                        :default-expanded-keys="formData.deliveryBuildingCodes"
                        ref="deliveryBuildings"
                        node-key="code"
                        :props="{children: 'children',label: 'name' }">
                </el-tree>
            </el-form-item>


            <el-form-item v-if="showReceivingBuilding" label="揽件区域楼栋" prop="receivingBuildingCodes" :error="formErrorMsg.receivingBuildingCodes">
                <el-tree
                        :data="buildings"
                        show-checkbox
                        :default-expanded-keys="formData.receivingBuildingCodes"
                        ref="receivingBuildings"
                        node-key="code"
                        :props="{children: 'children',label: 'name' }">
                </el-tree>
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
                    update: this.$api.epsEmployee.update,
                    detail: this.$api.epsEmployee.detail,
                    tree: this.$api.building.tree
                },
                showDeliveryBuilding: false,
                showReceivingBuilding: false,
                formErrorMsg: {},
                formData: {
                    realName: '',
                    number: '',
                    gender: '',
                    mobileNumber: '',
                    password: '',
                    roleFlags: []
                },
                buildings: [],
                roles: [
                    {
                        flag: 'SORTER',
                        name: '分拣员'
                    },
                    {
                        flag: 'COURIER',
                        name: '派送员'
                    },
                    {
                        flag: 'COLLECTOR',
                        name: '揽件员'
                    }
                ],
                rules: {
                    number: [
                        {required: true, message: '请输入工号', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    mobileNumber: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {

                                if (!value) {
                                    callback();
                                    return;
                                }

                                let reg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
                                if (!reg.test(value)) {
                                    callback("手机号码错误！")
                                } else {
                                    callback()
                                }

                            }, trigger: 'blur'
                        }
                    ]

                },
            }
        },
        methods: {
            changeRole(state) {
                let vm = this
                vm.showDeliveryBuilding = false
                vm.showReceivingBuilding = false
                for (let i = 0; i < vm.formData.roleFlags.length; i++) {
                    if (vm.formData.roleFlags[i] === 'COURIER') {
                        vm.showDeliveryBuilding = true
                    }
                    if (vm.formData.roleFlags[i] === 'COLLECTOR') {
                        vm.showReceivingBuilding = true
                    }
                }

                if (state) {
                    setTimeout(()=> {
                        if (vm.showDeliveryBuilding && vm.$refs.deliveryBuildings) {
                            this.$refs.deliveryBuildings.setCheckedKeys(vm.formData.deliveryBuildingCodes,true)
                        }
                        if (vm.showReceivingBuilding && vm.$refs.receivingBuildings) {
                            this.$refs.receivingBuildings.setCheckedKeys(vm.formData.receivingBuildingCodes,true)
                        }
                    },200)
                }
            },
            getRoleFlagString() {
                let vm = this
                let str = ""
                for (let i = 0; i < vm.formData.roleFlags.length; i++) {
                    str+=vm.formData.roleFlags[i]
                    if (!(i === vm.formData.roleFlags.length -1)) {
                        str+=","
                    }
                }
                return str
            },
            getLastCodes(nodes) {
                let codes = []
                for (let i = 0; i < nodes.length; i++) {
                    if (!nodes[i].children) {
                        codes.push(nodes[i].code)
                    }
                }
                return codes
            },
            handleSubmit(form)
            {

                let vm = this;

                let deliveryBuildingCodes = []
                if (vm.showDeliveryBuilding && vm.$refs.deliveryBuildings && vm.$refs.deliveryBuildings.getCheckedNodes()) {
                    deliveryBuildingCodes = vm.getLastCodes(vm.$refs.deliveryBuildings.getCheckedNodes())
                }
                let receivingBuildingCodes = []
                if (vm.showReceivingBuilding && vm.$refs.receivingBuildings && vm.$refs.receivingBuildings.getCheckedNodes()) {
                    receivingBuildingCodes = vm.getLastCodes(vm.$refs.receivingBuildings.getCheckedNodes())
                }
                console.log(vm.formData)
                vm.$refs[form].validate((valid) => {
                    if (valid) {
                        vm.$http.post(vm.api.update, {
                            realName: vm.formData.realName,
                            code: vm.formData.code,
                            password: vm.formData.password,
                            gender: vm.formData.gender,
                            number: vm.formData.number,
                            roleFlags: vm.getRoleFlagString(),
                            mobileNumber: vm.formData.mobileNumber,
                            deliveryBuildingCodes: deliveryBuildingCodes,
                            receivingBuildingCodes: receivingBuildingCodes,
                        }).then((resp) => {

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
            handleReset(form) {
                this.$refs[form].resetFields();
            }
        },

        created() {
            let vm = this;
            this.$http.post(this.api.tree,this.$qs.stringify(this.searchParams)).then((resp)=>{
                vm.buildings= resp.data.data['buildings'];
            })
        },
        mounted() {
            let vm = this;
            this.$http.post(this.api.detail,this.$qs.stringify(this.$route.query)).then(function (resp) {

                // 赋值
                vm.formData = {
                    realName: resp.data.data.epsEmployee.realName,
                    code: resp.data.data.epsEmployee.code,
                    number: resp.data.data.epsEmployee.number,
                    password: '',
                    gender: resp.data.data.epsEmployee.gender,
                    roleFlags: resp.data.data.epsEmployee.roleFlags.split(","),
                    mobileNumber: resp.data.data.epsEmployee.mobileNumber,
                    deliveryBuildingCodes: resp.data.data.epsEmployee.deliveryBuildingCodes,
                    receivingBuildingCodes: resp.data.data.epsEmployee.receivingBuildingCodes,
                }
                // 显示区域
                vm.changeRole(true)

            });
        }
    }
</script>

<style lang="scss" scoped>

    .fb-form {
        max-width: 500px;
    }

</style>