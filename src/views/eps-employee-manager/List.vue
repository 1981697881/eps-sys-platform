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

            <el-form-item class="search-form-item" label="姓名">
                <el-input v-model="searchForm.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="手机">
                <el-input v-model="searchForm.mobileNumber" placeholder="请输入手机"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="角色">
                <el-select v-model="searchForm.roleFlag" placeholder="请选择角色">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="分拣员" value="SORTER"></el-option>
                    <el-option label="派送员" value="COURIER"></el-option>
                    <el-option label="揽件员" value="COLLECTOR"></el-option>
                </el-select>
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
                        label="工号"
                >
                    <template scope="scope">
                        {{scope.row.number ? scope.row.number :'(无)' }}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="realName"
                        label="姓名"
                        >
                    <template scope="scope">
                        {{scope.row.realName ? scope.row.realName :'(无)' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="mobileNumber"
                        label="手机号码"
                        >
                    <template scope="scope">
                        {{scope.row.mobileNumber ? scope.row.mobileNumber :'(无)' }}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="roleFlags"
                        label="角色"
                >
                    <template scope="scope">
                        {{scope.row.roleFlags ? getRolesName(scope.row.roleFlags) :'(无)' }}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="createTime"
                        label="创建时间"
                >
                    <template scope="scope">
                        {{ scope.row.createTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="handleEdit(scope.row)" :underline="false">编辑</el-link>
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
                    list:this.$api.epsEmployee.list,
                    delete:this.$api.epsEmployee.delete,
                    batchDelete:this.$api.epsEmployee.batchDelete,
                },
                searchForm: {
                    realName: '',
                    mobileNumber:'',
                    roleFlag:''
                },
                tableData:[],
                selection:[],
                pager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                },
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
            getRolesName (flags) {
                const vm = this
                for (let i = 0; i < vm.roles.length; i++) {
                    flags = flags.replace(vm.roles[i].flag,vm.roles[i].name)
                }
                return flags
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
