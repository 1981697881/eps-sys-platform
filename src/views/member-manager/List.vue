<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >
        <template slot="btn-group">
<!--            <el-button icon="el-icon-plus" @click="$router.push('add')">新增</el-button>-->
<!--            <el-button icon="el-icon-edit"  @click.stop="handleEdit">编辑</el-button>-->
            <el-button icon="el-icon-delete" @click.native="handleBatchDelete">删除</el-button>
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
            <el-button icon="el-icon-tickets" @click.stop="handleExport(1)">导出全部</el-button>
            <el-button icon="el-icon-user-solid" @click.stop="handleExport(2)">导出会员</el-button>
            <el-button icon="el-icon-user" @click.stop="handleExport(3)">导出非会员</el-button>
        </template>
        <template slot="search-form">
            <el-form-item class="search-form-item" label="微信昵称">
                <el-input v-model="searchForm.nickname" placeholder="请输入微信昵称"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="姓名">
                <el-input v-model="searchForm.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="手机">
                <el-input v-model="searchForm.mobileNumber" placeholder="请输入手机"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="会员类型">
                <el-select v-model="searchForm.type" placeholder="请选择会员类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="会员" value="MEMBER"></el-option>
                    <el-option label="非会员" value="NONMEMBER"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="默认配送方式">
                <el-select v-model="searchForm.deliveryMethod" placeholder="请选择默认配送方式">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="上门派送" value="DELIVERY"></el-option>
                    <el-option label="到店自取" value="SELF"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="区域楼栋">
                <el-cascader
                        ref="searchBuildings"
                        :props="{value:'code',label:'name', checkStrictly: true }"
                        v-model="searchForm.buildingCode"
                        :options="tree"
                        @change="handleChange"></el-cascader>
            </el-form-item>

        </template>

        <template slot="table">


            <el-table :data="tableData" @selection-change="handleSelectionChange" >

                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>

                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="nickname"
                        label="微信昵称"
                >
                    <template scope="scope">
                        {{scope.row.nickname ? scope.row.nickname :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="realName"
                        label="姓名"
                        >
                    <template scope="scope">
                        {{scope.row.realName ? scope.row.realName :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="mobileNumber"
                        label="手机号码"
                >
                    <template scope="scope">
                        {{scope.row.mobileNumber ? scope.row.mobileNumber :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="会员类型"
                >
                    <template scope="scope">
                        {{scope.row.type ? getTypeName(scope.row.type) :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="deliveryMethod"
                        label="默认配送方式"
                        >
                    <template scope="scope">
                        {{scope.row.deliveryMethod ? getDeliveryMethodName(scope.row.deliveryMethod) :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        prop="buildingName"
                        label="楼栋区域"
                >
                    <template scope="scope">
                        {{scope.row.buildingName ? scope.row.buildingName :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="houseNumber"
                        label="户号"
                >
                    <template scope="scope">
                        {{scope.row.houseNumber ? scope.row.houseNumber :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="工作日不适合配送时段"
                >
                    <template scope="scope">
                        <div v-if="scope.row.weekdaysNoDeliveryTimes&&scope.row.weekdaysNoDeliveryTimes.length">
                            <div v-bind:key="index" v-for="(time,index) in scope.row.weekdaysNoDeliveryTimes">
                                {{ time }}
                            </div>
                        </div>
                        <div v-else>
                            -
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        label="节假日不适合配送时段"
                >
                    <template scope="scope">
                        <div v-if="scope.row.holidayNoDeliveryTimes&&scope.row.holidayNoDeliveryTimes.length">
                            <div v-bind:key="index" v-for="(time,index) in scope.row.holidayNoDeliveryTimes">
                                {{ time }}
                            </div>
                        </div>
                        <div v-else>
                            -
                        </div>

                    </template>
                </el-table-column>

                <el-table-column
                        prop="createTime"
                        label="注册时间"
                >
                    <template scope="scope">
                        {{ scope.row.registerTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>

                <el-table-column
                        width="300"
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-link  type="primary" @click="goToMemberDeliveryList(scope.row)" :underline="false">收件记录</el-link>
                        <el-link style="margin-left: 10px;" type="primary" @click="goToMemberReceivingList(scope.row)" :underline="false">寄件记录</el-link>
                        <el-link style="margin-left: 10px;" type="primary" @click="goToRefuseList(scope.row)" :underline="false">预拒收记录</el-link>
                        <el-link style="margin-left: 10px;" type="primary" @click="handleDetail(scope.row)" :underline="false">详情</el-link>
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
                    list:this.$api.member.list,
                    tree:this.$api.building.tree,
                    delete:this.$api.member.delete,
                    export:this.$api.member.export,
                    batchDelete:this.$api.member.batchDelete,
                },
                searchForm: {
                    nickname: '',
                    realName: '',
                    mobileNumber:'',
                    buildingCode:'',
                    deliveryMethod:'',
                    type:'',
                    buildingCodes: []
                },
                deliveryMethods: [
                    {
                        name: "上门派送",
                        value: "DELIVERY",
                    },
                    {
                        name: "到店自取",
                        value: "SELF",
                    }
                ],
                types: [
                    {
                        name: "会员",
                        value: "MEMBER",
                    },
                    {
                        name: "非会员",
                        value: "NONMEMBER",
                    }
                ],
                tableData:[],
                tree:[],
                selection:[],
                pager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                }
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
            goToRefuseList(item) {
                this.$router.push({path:'refuse-list',query:{memberCode:item.code}});
            },
            goToMemberDeliveryList(item) {
                this.$router.push({path:'delivery-list',query:{memberCode:item.code}});
            },
            goToMemberReceivingList(item) {
                this.$router.push({path:'receiving-list',query:{memberCode:item.code}});
            },
            getDeliveryMethodName(value) {
                for (let i = 0; i < this.deliveryMethods.length; i++) {
                    if (this.deliveryMethods[i].value === value) {
                        return this.deliveryMethods[i].name
                    }
                }
            },
            getTypeName(value) {
                for (let i = 0; i < this.types.length; i++) {
                    if (this.types[i].value === value) {
                        return this.types[i].name
                    }
                }
            },
            handleExport(exportType) {
                let vm = this;
                window.location.href = vm.api.export + '?exportType=' + exportType;
            },
            handleChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.searchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes,buildingCodes)
                vm.searchForm.buildingCodes = buildingCodes
            },
            loadChildren(nodes,arr) {
                let vm = this
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].children && nodes[i].children.length > 0) {
                        vm.loadChildren(nodes[i].children,arr)
                    }
                    arr.push(nodes[i].value)
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
            handleDetail(e) {

                if(e && e.code){
                    this.$router.push({path:'detail',query:{code:e.code}});
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
                this.$http.post(this.api.list,this.$qs.stringify({
                    nickname: vm.searchForm.nickname,
                    pageIndex: vm.pager.pageIndex,
                    pageSize: vm.pager.pageSize,
                    realName: vm.searchForm.realName,
                    mobileNumber: vm.searchForm.mobileNumber,
                    buildingCodes: vm.searchForm.buildingCodes,
                    type: vm.searchForm.type,
                    deliveryMethod: vm.searchForm.deliveryMethod,
                })).then((resp)=>{


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
            let vm = this;
            for (let key in this.searchForm){
                 if(this.$route.query[key]){
                     this.searchForm[key]= this.$route.query[key];
                 }
            }
            this.$http.post(this.api.tree,this.$qs.stringify(this.searchParams)).then((resp)=>{
                vm.tree = resp.data.data.buildings;
            })
        }
    }
</script>

<style scoped>

</style>
