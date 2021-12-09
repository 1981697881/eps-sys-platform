<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >

        <template slot="btn-group">
            <el-button icon="el-icon-plus" @click="$router.push('add')">新增</el-button>
            <el-button icon="el-icon-edit"  @click.stop="handleEdit">编辑</el-button>
            <el-button icon="el-icon-delete" @click.native="handleBatchDelete">删除</el-button>
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
        </template>

        <template slot="search-form">

            <el-form-item class="search-form-item" label="优惠券编号">
                <el-input v-model="searchForm.number" placeholder="请输入优惠券编号"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="优惠券名称">
                <el-input v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
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
                        prop="total"
                        label="总数量"
                >
                    <template scope="scope">
                        {{scope.row.total}}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="surplus"
                        label="可领取数量"
                >
                    <template scope="scope">
                        {{scope.row.surplus}}
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
                        prop="giveMethod"
                        label="派送方式"
                >
                    <template scope="scope">
                        {{getGiveMethodName(scope.row.giveMethod)}}
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
                        label="操作">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="handleEdit(scope.row)" :underline="false">编辑</el-link>
                        <el-link type="primary" @click="goToReceiveList(scope.row)" :underline="false" style="margin-left: 10px;">领取记录</el-link>
                        <el-link type="danger"  @click="handleDelete(scope.row)" :underline="false" style="margin-left: 10px;">删除</el-link>
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
                    list:this.$api.coupon.list,
                    delete:this.$api.coupon.delete,
                    batchDelete:this.$api.coupon.batchDelete,
                },
                searchForm: {name: '',number:''},
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
                        name: "正常派送",
                        key: "NORMAL",
                    }, {
                        name: "暂停派送",
                        key: "STOP",
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
            goToReceiveList(e) {
                if(e && e.code){
                    this.$router.push({path:'receive-list',query:{couponCode:e.code}});
                }
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
                this.searchParams.pageIndex = vm.pager.pageIndex;
                this.searchParams.pageSize = vm.pager.pageSize;
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
        },
        created() {

            for (let key in this.searchForm){
                 if(this.$route.query[key]){
                     this.searchForm[key]= this.$route.query[key];
                 }
            }
        }
    }
</script>

<style scoped>

</style>
