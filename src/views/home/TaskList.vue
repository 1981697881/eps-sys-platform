<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >

        <template slot="btn-group">
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
        </template>

        <template slot="search-form">

            <el-form-item class="search-form-item" label="频次">
                <el-select v-model="searchForm.deliveryTimeType" placeholder="请选择频次">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="上午" value="MORNING"></el-option>
                    <el-option label="下午" value="AFTERNOON"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="户号">
                <el-input v-model="searchForm.houseNumber" placeholder="请输入户号"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="收件人">
                <el-input v-model="searchForm.addressee" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="手机号码">
                <el-input v-model="searchForm.addresseeMobileNumber" placeholder="请输入手机号码"></el-input>
            </el-form-item>

        </template>

        <template slot="table">


            <el-table :data="tableData" @selection-change="handleSelectionChange" @row-dblclick="handleEdit">

                <el-table-column
                        label="派送楼栋"
                >
                    <template scope="scope">
                        {{scope.row.buildingName ? scope.row.buildingName :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="户号"
                >
                    <template scope="scope">
                        {{scope.row.houseNumber ? scope.row.houseNumber :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="收件人">
                    <template scope="scope">
                        {{scope.row.addressee ? scope.row.addressee :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="收件人手机号"
                >
                    <template scope="scope">
                        {{scope.row.addresseeMobileNumber ? scope.row.addresseeMobileNumber :'-' }}
                    </template>
                </el-table-column>


                <el-table-column
                        label="快递单号"
                >
                    <template scope="scope">
                        {{scope.row.trackingNumber ? scope.row.trackingNumber :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="派送时间段"
                >
                    <template scope="scope">
                        {{scope.row.type ? getTypeName(scope.row.type) :'' }}
                        {{' '}}
                        {{scope.row.deliveryStartTime | dateFormat("hh:mm:ss")}}
                        {{' - '}}
                        {{scope.row.deliveryEndTime | dateFormat("hh:mm:ss")}}
                    </template>
                </el-table-column>


                <el-table-column
                        label="状态"
                >
                    <template scope="scope">
                        {{scope.row.state ? getStateName(scope.row.state) :'-' }}
                    </template>
                </el-table-column>


                <el-table-column
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-link style="margin-left: 10px;" type="primary" @click="handleDetail(scope.row)" :underline="false">详情</el-link>
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
                    list:this.$api.deliveryRecord.list,
                },
                deliveryTimes: [],
                businesses: [],
                searchForm: {
                    addressee: '',
                    buildingCode: '',
                    addresseeMobileNumber: '',
                    houseNumber: '',
                    deliveryTimeType:''
                },
                types: [
                    {
                        name: "上午",
                        key: "MORNING"
                    },
                    {
                        name: "下午",
                        key: "AFTERNOON"
                    }
                ],
                states: [
                    {
                        name: "已签收",
                        value: "SIGNED",
                    },{
                        name: "派送中",
                        value: "DELIVERING",
                    },{
                        name: "待派送",
                        value: "WAIT",
                    },{
                        name: "待取货",
                        value: "WAIT_SIGNED",
                    },{
                        name: "异常",
                        value: "EXCEPTION",
                    },{
                        name: "拒收",
                        value: "REFUSE",
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
            getTypeName(key) {
                for (let i = 0; i < this.types.length; i++) {
                    if (this.types[i].key === key) {
                        return this.types[i].name;
                    }
                }
            },


            getStateName(value) {
                for (let i = 0; i < this.states.length; i++) {
                    if (this.states[i].value === value) {
                        return this.states[i].name
                    }
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
                    this.$router.push({path:'task-detail',query:{code:e.code}});
                    return;
                }

                this.$router.push({path:'task-detail',query:{code:this.selection[0].code}});
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
                let buildingCode = this.$route.query['buildingCode'];
                this.$http.post(this.api.list,this.$qs.stringify({
                    addressee: vm.searchForm.addressee,
                    houseNumber: vm.searchForm.houseNumber,
                    addresseeMobileNumber: vm.searchForm.addresseeMobileNumber,
                    buildingCode: buildingCode,
                    pageIndex: vm.pager.pageIndex,
                    pageSize: vm.pager.pageSize,
                    deliveryTimeType: vm.searchForm.deliveryTimeType
                })).then((resp)=>{
                    console.log(resp.data.data.deliveryRecords)
                    vm.tableData = resp.data.data.deliveryRecords;

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

        }
    }
</script>

<style scoped>

</style>
