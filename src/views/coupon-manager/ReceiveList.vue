<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >
        <template slot="btn-group">
            <el-button icon="el-icon-delete" @click.native="handleBatchDelete">删除</el-button>
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
        </template>

        <template slot="search-form">

            <el-form-item class="search-form-item" label="会员昵称">
                <el-input v-model="searchForm.nickname" placeholdr="请输入会员昵称"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="会员姓名">
                <el-input v-model="searchForm.realName" placeholdr="请输入会员姓名"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="会员手机号码">
                <el-input v-model="searchForm.mobileNumber" placeholdr="请输入会员手机号码"></el-input>
            </el-form-item>


        </template>

        <template slot="table">


            <el-table :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleEdit">

                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>

                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>

                <el-table-column
                        prop="number"
                        label="优惠券编号"
                        >
                    <template scope="scope">
                        {{scope.row.number ? scope.row.number :'(无)' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="优惠券名称"
                        >
                    <template scope="scope">
                        {{scope.row.name ? scope.row.name :'(无)' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="discountAmount"
                        label="优惠金额"
                >
                    <template scope="scope">
                        {{scope.row.discountAmount}}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="startingAmount"
                        label="起用金额"
                >
                    <template scope="scope">
                        {{scope.row.startingAmount}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="250"
                        label="有效期"
                >
                    <template scope="scope">
                        {{ scope.row.startTime | dateFormat("yyyy-MM-dd")}}
                        {{' 至 '}}
                        {{ scope.row.endTime | dateFormat("yyyy-MM-dd")}}
                    </template>
                </el-table-column>


                <el-table-column
                        prop="nickname"
                        label="微信昵称"
                >
                    <template scope="scope">
                        {{scope.row.nickname}}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="realName"
                        label="姓名"
                >
                    <template scope="scope">
                        {{scope.row.realName}}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="mobileNumber"
                        label="手机号码"
                >
                    <template scope="scope">
                        {{scope.row.mobileNumber}}
                    </template>
                </el-table-column>


                <el-table-column
                        prop="giveMethod"
                        label="派送方式"
                >
                    <template scope="scope">
                        {{getGiveMethodName(scope.row.giveMethod)}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="领取时间"
                >
                    <template scope="scope">
                        {{ scope.row.createTime | dateFormat("yyyy-MM-dd")}}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="state"
                        label="状态"
                >
                    <template scope="scope">
                        {{getStateName(scope.row.state)}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-link type="danger"  @click="handleDelete(scope.row)" :underline="false" >删除</el-link>
                        <el-link type="primary" @click="handleUpdateState(scope.row)" :underline="false" style="margin-left: 10px;">核销</el-link>
                    </template>
                </el-table-column>


            </el-table>
        </template>


    </fb-list-body>
</template>

<script>

    export default {
        name: "ExceptionTemplateList",
        components: {},
        props:{
          timestamp:{type:Number,default:function () {
                  return new Date().getTime()
              }},
        },
        data() {
            return {
                api:{
                    list:this.$api.memberCoupon.list,
                    updateStateUse:this.$api.memberCoupon.updateStateUse,
                    delete:this.$api.memberCoupon.delete,
                    batchDelete:this.$api.memberCoupon.batchDelete,
                },
                searchForm: {
                    nickname:'',
                    realName:'',
                    mobileNumber:'',
                    couponCode:'',
                },
                tableData:[],
                selection:[],
                pager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
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
                        name: "未使用",
                        key: "NOT_USED",
                    },
                    {
                        name: "已使用",
                        key: "USED",
                    }, {
                        name: "已过期",
                        key: "EXPIRED",
                    }
                ]
            }
        },
        computed: {
            searchParams() {
                return Object.assign({}, this.$route.query,this.searchForm,this.pager);
            }
        },
        watch:{
            timestamp(){
              this.handleSearch();
            },
            "pager.pageIndex":{
                handler() {
                    this.$router.updateQuery({path: this.$route.path, query: this.searchParams});
                    this.handleSearch();

                },
                deep:true,
                immediate:true
            },
            "pager.pageSize":{
                handler() {

                    this.$router.updateQuery({path: this.$route.path, query: this.searchParams});
                    this.handleSearch();

                },
                deep:true
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
            handleUpdateState(row) {
                let vm = this;

                vm.$confirm('您现在正在进行核销操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(vm.api.updateStateUse,vm.$qs.stringify({code:row.code})).then((resp)=>{
                        if(resp.data.status === 200){
                            vm.$message({type:'success',message:resp.data.desc});
                            vm.handleSearch();
                        }else{
                            vm.$message({type:'error',message:resp.data.desc});

                        }
                    })



                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
            },
            handleEdit(e) {

                if(e && e.code){
                    this.$router.push({path:'edit',query:{code:e.code}});
                    return;
                }

                if(!this.selection.length){
                    this.$message({type:'warning',message:'未选择记录'});
                    return ;
                }

                if(this.selection.length > 1){
                    this.$message({type:'warning',message:'一次只能编辑一条数据'});
                    return ;
                }

                this.$router.push({path:'edit',query:{code:this.selection[0].code}});
            },
            handleDelete(row){
                let vm = this;

                vm.$confirm('您现在正在进行删除操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(vm.api.delete,vm.$qs.stringify({code:row.code})).then((resp)=>{
                        if(resp.data.status === 200){
                            vm.$message({type:'success',message:resp.data.desc});
                            vm.handleSearch();
                        }else{
                            vm.$message({type:'error',message:resp.data.desc});

                        }
                    })



                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });

            },
            handleBatchDelete() {


                let vm = this;

                if(!this.selection.length){
                    this.$message({type:'warning',message:'未选择记录'});
                    return ;
                }


                let codes = [];

                this.selection.forEach((e)=>{
                    codes.push(e.code);
                });


                this.$confirm('您现在正在进行批量删除操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(this.api.batchDelete,codes).then((resp)=>{
                        if(resp.data.status === 200){
                            vm.$message({type:'success',message:resp.data.desc});
                            vm.handleSearch();
                        }else{
                            vm.$message({type:'error',message:resp.data.desc});

                        }
                    })



                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });




            },
            handleSelectionChange(selection){
                console.log(selection);
                this.selection = selection;
            },
            handlePagerSizeChange(e){
                this.pager.pageSize = e;
            },
            handlePagerIndexChange(e){
                this.pager.pageIndex = e;
            },
            handleSearch() {
                let vm = this;
                if (vm.searchForm.couponCode) {
                    this.$http.post(this.api.list,this.$qs.stringify(this.searchParams)).then((resp)=>{

                        for(let key in resp.data.data){
                            if(resp.data.data[key] instanceof Array){
                                vm.tableData = resp.data.data[key];
                            }
                        }

                        //处理分页
                        vm.pager.pageIndex = resp.data.data.pager.pageIndex;
                        vm.pager.pageSize = resp.data.data.pager.pageSize;
                        vm.pager.itemCount = resp.data.data.pager.itemCount;

                    })
                }
            }
        },
        created() {
            let vm = this;
            vm.searchForm.couponCode = this.$route.query['couponCode'];
            vm.handleSearch()
        }
    }
</script>

<style scoped>

</style>
