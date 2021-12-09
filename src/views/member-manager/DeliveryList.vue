<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >

        <template slot="btn-group">
            <el-button icon="el-icon-plus" @click="handleBatchVerify">快件核销</el-button>
            <el-button icon="el-icon-delete" @click.native="handleBatchDelete">删除</el-button>
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
            <el-button icon="el-icon-tickets" @click.stop="handleExport()">异常件导出</el-button>
        </template>

        <template slot="search-form">

            <el-form-item class="search-form-item" label="快递单号">
                <el-input v-model="searchForm.trackingNumber" placeholder="请输入快递单号"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="派送方式">
                <el-select v-model="searchForm.deliveryMethod" placeholder="请选择揽件方式">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="送货上门" value="DELIVERY"></el-option>
                    <el-option label="自取" value="SELF"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="状态">
                <el-select v-model="searchForm.state" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已签收" value="SIGNED"></el-option>
                    <el-option label="派送中" value="DELIVERING"></el-option>
                    <el-option label="待派送" value="WAIT"></el-option>
                    <el-option label="异常" value="EXCEPTION"></el-option>
                    <el-option label="拒收" value="REFUSE"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="派送时段">
                <el-select v-model="searchForm.deliveryTimeCode" placeholder="请选择揽件时段">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-bind:key="time.code" v-for="time in deliveryTimes" :label="$moment(time.startTime).format('HH:mm:ss') + ' - ' + $moment(time.endTime).format('HH:mm:ss')" :value="time.code"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="录入时间" prop="times">
                <el-date-picker
                        v-model="searchForm.times"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
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
                        label="快递单号"
                        width="170"
                >
                    <template scope="scope">
                        {{scope.row.trackingNumber ? scope.row.trackingNumber :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="快递类型"
                >
                    <template scope="scope">

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
                        width="150"
                >
                    <template scope="scope">
                      {{scope.row.addresseeMobileNumber ? scope.row.addresseeMobileNumber :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="派送方式"
                >
                    <template scope="scope">
                        {{scope.row.deliveryMethod ? getDeliveryMethodName(scope.row.deliveryMethod):'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="派送人"
                >
                    <template scope="scope">
                        {{scope.row.deliveryman ? scope.row.deliveryman :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="派送人手机号码"
                >
                    <template scope="scope">
                        {{scope.row.deliverymanMobileNumber ? scope.row.deliverymanMobileNumber :'-' }}
                    </template>
                </el-table-column>
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
                        label="派送时间段"
                        width="150"
                >
                    <template scope="scope">
                        {{scope.row.deliveryStartTime | dateFormat("hh:mm:ss")}}
                        {{' - '}}
                        {{scope.row.deliveryEndTime | dateFormat("hh:mm:ss")}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="异常配送次数"
                >
                    <template scope="scope">
                        {{scope.row.exceptionCount ? scope.row.exceptionCount :'0' }}
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
                        label="核销状态"
                >
                    <template scope="scope">
                        {{scope.row.verifyState ? getVerifyStateName(scope.row.verifyState) :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="录入时间"
                        width="160"
                >
                    <template scope="scope">
                        {{ scope.row.createTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="签收时间"
                        width="160"
                >
                    <template scope="scope">
                        {{ scope.row.signedTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="派送日期"
                        width="160"
                >
                    <template scope="scope">
                        {{ scope.row.deliveryDate | dateFormat("yyyy-MM-dd") }}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        width="140"
                        label="操作">
                    <template slot-scope="scope">
                        <el-link style="margin-left: 10px;" type="primary" @click="handleVerifyState(scope.row, scope.$index)" :underline="false">核销</el-link>
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
                    list:this.$api.deliveryRecord.list,
                    updateVerifyState:this.$api.deliveryRecord.updateVerifyState,
                    tree:this.$api.building.tree,
                    timeList:this.$api.deliveryTime.list,
                    delete:this.$api.deliveryRecord.delete,
                    batchVerify:this.$api.deliveryRecord.batchVerify,
                    exportException:this.$api.deliveryRecord.exportException,
                    batchDelete:this.$api.deliveryRecord.batchDelete,
                },
                deliveryTimes: [],
                businesses: [],
                searchForm: {
                    trackingNumber: '',
                    deliveryMethod:'',
                    state:'',
                    deliveryTimeCode:'',
                    times: [],
                },
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
                verifyStates: [
                    {
                        name: "已核销",
                        value: "VERIFIED",
                    },
                    {
                        name: "未核销",
                        value: "NOT_VERIFIED",
                    },{
                        name: "未签收",
                        value: "NOT_SIGNED",
                    },
                ],
                tableData:[],
                tree:[],
                selection:[],
                pager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                },
                deliveryMethods: [
                    {
                        name: "送货上门",
                        value: "DELIVERY",
                    },
                    {
                        name: "自取",
                        value: "SELF",
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
            handleExport() {
                let vm = this;
                let memberCode = this.$route.query['memberCode'];
                window.location.href = vm.api.exportException + '?memberCode=' + memberCode;
            },
            getDeliveryMethodName (value) {
                for (let i = 0; i < this.deliveryMethods.length; i++) {
                    if (this.deliveryMethods[i].value === value) {
                        return this.deliveryMethods[i].name
                    }
                }
            },
            handleBuildingChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.searchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes,buildingCodes)
                if (buildingCodes.length === 1 && buildingCodes[0] === '') {
                    vm.searchForm.buildingCodes = []
                } else {
                    vm.searchForm.buildingCodes = buildingCodes
                }
            },
            getStateName(value) {
                for (let i = 0; i < this.states.length; i++) {
                    if (this.states[i].value === value) {
                        return this.states[i].name
                    }
                }
            },
            getVerifyStateName(value) {
                for (let i = 0; i < this.verifyStates.length; i++) {
                    if (this.verifyStates[i].value === value) {
                        return this.verifyStates[i].name
                    }
                }
            },
            getReceivingMethodName(value) {
                for (let i = 0; i < this.receivingMethods.length; i++) {
                    if (this.receivingMethods[i].value === value) {
                        return this.receivingMethods[i].name
                    }
                }
            },
            getBusinessName(value) {
                for (let i = 0; i < this.businesses.length; i++) {
                    if (this.businesses[i].value === value) {
                        return this.businesses[i].name
                    }
                }
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
                    this.$router.push({path:'delivery-detail',query:{code:e.code}});
                    return;
                }

                this.$router.push({path:'detail',query:{code:this.selection[0].code}});
            },
            handleBatchVerify(){
                let vm = this;
                if(!this.selection.length){
                    this.$message({type:'warning',message:'未选择记录'});
                    return ;
                }
                let codes = [];
                this.selection.forEach((e)=>{
                    codes.push(e.code);
                });
                this.$confirm('您现在正在进行批量核销操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(this.api.batchVerify,codes).then((resp)=>{
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
            handleVerifyState(row,index){
                let vm = this;
                let memberCode = this.$route.query['memberCode'];
                vm.$router.push({path:'delivery-verify',query:{memberCode:memberCode,index:index}});
                sessionStorage.setItem("deliveryListSearchForm", JSON.stringify(vm.searchForm));

                // vm.$confirm('您现在正在核销, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     vm.$http.post(vm.api.updateVerifyState,vm.$qs.stringify({code:row.code})).then((resp)=>{
                //         if(resp.data.status === 200){
                //             vm.$message({type:'success',message:resp.data.desc});
                //             vm.handleSearch();
                //         }else{
                //             vm.$message({type:'error',message:resp.data.desc});
                //
                //         }
                //     })
                // }).catch(() => {
                //     // this.$message({
                //     //     type: 'info',
                //     //     message: '已取消删除'
                //     // });
                // });
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
                let memberCode = this.$route.query['memberCode'];
                this.$http.post(this.api.list,this.$qs.stringify({
                    memberCode: memberCode,
                    deliveryMethod: vm.searchForm.deliveryMethod,
                    trackingNumber: vm.searchForm.trackingNumber,
                    state: vm.searchForm.state,
                    pageIndex: vm.pager.pageIndex,
                    pageSize: vm.pager.pageSize,
                    deliveryTimeCode: vm.searchForm.deliveryTimeCode,
                    startCreateTime: vm.searchForm.times[0] ? vm.$moment(vm.searchForm.times[0]).format('yyyy-MM-DD HH:mm:ss'):"",
                    endCreateTime: vm.searchForm.times[1] ? vm.$moment(vm.searchForm.times[1]).format('yyyy-MM-DD HH:mm:ss'):"",
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
            let sform = sessionStorage.getItem("deliveryListSearchForm");
            if (sform) {
                this.searchForm = JSON.parse(sform);
            }else {
                for (let key in this.searchForm){
                    if(this.$route.query[key]){
                        this.searchForm[key]= this.$route.query[key];
                    }
                }
            }

            this.$http.post(this.api.tree,{}).then((resp)=>{
                vm.tree = resp.data.data.buildings;
                vm.tree.unshift({name: "全部", code: ""})
            })

            this.$http.post(this.$api.common.loadBusiness,{}).then((resp)=>{
                vm.businesses = resp.data.data.businesses;
            })
            this.$http.post(this.api.timeList,vm.$qs.stringify({onPage:false})).then((resp)=>{
                vm.deliveryTimes = resp.data.data.deliveryTimes;
            })

        }
    }
</script>

<style scoped>

</style>
