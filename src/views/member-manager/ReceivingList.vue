<template>
    <fb-list-body :pager="pager"
                  @handlePagerSizeChange="handlePagerSizeChange"
                  @handlePagerIndexChange="handlePagerIndexChange"
    >
        <template slot="btn-group">
            <el-button icon="el-icon-edit"  @click.stop="handleEdit">编辑</el-button>
            <el-button icon="el-icon-delete" @click.native="handleBatchDelete">删除</el-button>
            <el-button icon="el-icon-search" @click.stop="handleSearch">查询</el-button>
        </template>

        <template slot="search-form">

            <el-form-item class="search-form-item" label="寄件人">
                <el-input v-model="searchForm.senderKeyword" placeholder="请输入姓名/手机"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="收件人">
                <el-input v-model="searchForm.addresseeKeyword" placeholder="请输入姓名/手机"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="揽件人">
                <el-input v-model="searchForm.waiterKeyword" placeholder="请输入姓名/手机"></el-input>
            </el-form-item>

            <el-form-item class="search-form-item" label="揽件方式">
                <el-select v-model="searchForm.receivingMethod" placeholder="请选择揽件方式">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="上门揽件" value="RECEIVING"></el-option>
                    <el-option label="网点自寄" value="SELF"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="寄件楼栋">
                <el-cascader
                        ref="searchBuildings"
                        :props="{value:'code',label:'name', checkStrictly: true }"
                        v-model="searchForm.buildingCode"
                        :options="tree"
                        @change="handleBuildingChange"></el-cascader>
            </el-form-item>

            <el-form-item class="search-form-item" label="状态">
                <el-select v-model="searchForm.state" placeholder="请选择状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未支付" value="UNPAID"></el-option>
                    <el-option label="已揽件" value="RECEIVED"></el-option>
                    <el-option label="未揽件" value="NOT_RECEIVED"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="search-form-item" label="揽件时段">
                <el-select v-model="searchForm.deliveryTimeCode" placeholder="请选择揽件时段">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-bind:key="time.code" v-for="time in deliveryTimes" :label="$moment(time.startTime).format('HH:mm:ss') + ' - ' + $moment(time.endTime).format('HH:mm:ss')" :value="time.code"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="下单时间" prop="times">
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
                        label="寄件人信息"
                        width="220"
                >
                    <template scope="scope">
                        <div>姓名：{{scope.row.sender}}</div>
                        <div>手机号：{{scope.row.senderMobileNumber}}</div>
                        <div>地址：{{scope.row.senderAreaName + scope.row.senderAddress}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="收件人信息"
                        width="220"
                        >
                    <template scope="scope">
                        <div>姓名：{{scope.row.addressee}}</div>
                        <div>手机号：{{scope.row.addresseeMobileNumber}}</div>
                        <div>地址：{{scope.row.addresseeAreaName + scope.row.addresseeAddress}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="快递单号"
                        width="150"
                        >
                    <template scope="scope">
                        {{scope.row.trackingNumber ? scope.row.trackingNumber :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="快递厂商"
                >
                    <template scope="scope">
                        {{scope.row.business ? getBusinessName(scope.row.business) :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="物品信息"
                >
                    <template scope="scope">
                        {{scope.row.articleInfo ? scope.row.articleInfo :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="备注"
                >
                    <template scope="scope">
                        {{scope.row.remarks ? scope.row.remarks :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="预估费用（￥）"
                >
                    <template scope="scope">
                        {{scope.row.budget ? scope.row.budget :'-' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="实际费用（￥）"
                >
                    <template scope="scope">
                        {{scope.row.amount ? scope.row.amount :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                         label="揽件方式"
                >
                    <template scope="scope">
                        {{scope.row.receivingMethod ? getReceivingMethodName(scope.row.receivingMethod ) :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="揽件人信息"
                        width="180"
                >
                    <template scope="scope">
                        <div>姓名：{{scope.row.waiter}}</div>
                        <div>手机号：{{scope.row.waiterMobileNumber}}</div>
                    </template>
                </el-table-column>

                <el-table-column
                        label="揽件时间段"
                        width="150"
                >
                    <template scope="scope">
                        {{($moment(scope.row.receivingStartTime).format('HH:mm:ss')) + ' - ' + $moment(scope.row.receivingEndTime).format('HH:mm:ss')}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="付款方式"
                >
                    <template scope="scope">
                        {{scope.row.payMethod ? getPayMethodName(scope.row.payMethod ) :'-' }}
                    </template>
                </el-table-column>

                <el-table-column
                        label="付款状态"
                >
                    <template scope="scope">
                        {{scope.row.payState ? getPayStateName(scope.row.payState) :'-' }}
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
                        label="下单时间"
                        width="150"
                >
                    <template scope="scope">
                        {{ scope.row.orderCreateTime | dateFormat("yyyy-MM-dd hh:mm:ss") }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="揽件日期"
                        width="160"
                >
                    <template scope="scope">
                        {{ scope.row.receivedDate | dateFormat("yyyy-MM-dd") }}
                    </template>
                </el-table-column>


                <el-table-column
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
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
                    list:this.$api.receivingRecord.list,
                    tree:this.$api.building.tree,
                    timeList:this.$api.deliveryTime.list,
                    delete:this.$api.receivingRecord.delete,
                    export:this.$api.receivingRecord.export,
                    batchDelete:this.$api.receivingRecord.batchDelete,
                },
                deliveryTimes: [],
                businesses: [],
                receivingMethods: [
                    {
                        name: "上门揽件",
                        value: "RECEIVING",
                    },
                    {
                        name: "网点自寄",
                        value: "SELF",
                    }
                ],
                searchForm: {
                    memberCode: '',
                    senderKeyword: '',
                    addresseeKeyword: '',
                    waiterKeyword:'',
                    buildingCode:'',
                    receivingMethod:'',
                    state:'',
                    deliveryTimeCode:'',
                    buildingCodes: [],
                    times: [],
                },
                orderMethods: [
                    {
                        name: "小程序",
                        value: "MINIAPP",
                    },
                    {
                        name: "网点",
                        value: "OUTLETS",
                    }
                ],
                payMethods: [
                    {
                        name: "微信",
                        value: "WX",
                    },
                    {
                        name: "支付宝",
                        value: "ZFB",
                    },
                ],
                states: [
                    {
                        name: "已揽件",
                        value: "RECEIVED",
                    },{
                        name: "未揽件",
                        value: "NOT_RECEIVED",
                    },{
                        name: "已取消",
                        value: "CANCELLED",
                    },{
                        name: "已寄件",
                        value: "SEND_OUT",
                    },
                ],
                payStates: [
                    {
                        name: "已支付",
                        value: "PAID",
                    },
                    {
                        name: "未支付",
                        value: "UNPAID",
                    },{
                        name: "支付失败",
                        value: "PAID_FAIL",
                    },
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
            getPayStateName(value) {
                for (let i = 0; i < this.payStates.length; i++) {
                    if (this.payStates[i].value === value) {
                        return this.payStates[i].name
                    }
                }
            },
            getPayMethodName(value) {
                for (let i = 0; i < this.payMethods.length; i++) {
                    if (this.payMethods[i].value === value) {
                        return this.payMethods[i].name
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
            handleExport(exportType) {
                let vm = this;
                window.location.href = vm.api.export + '?exportType=' + exportType;
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
                sessionStorage.setItem("detailReceivingRecord", JSON.stringify(e))
                if(e && e.code){
                    this.$router.push({path:'receiving-detail',query:{code:e.code}});
                    return;
                }

                this.$router.push({path:'detail',query:{code:this.selection[0].code}});
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
                let memberCode = this.$route.query['memberCode'];
                this.$http.post(this.api.list,this.$qs.stringify({
                    senderKeyword: vm.searchForm.senderKeyword,
                    addresseeKeyword: vm.searchForm.addresseeKeyword,
                    memberCode: memberCode,
                    pageIndex: vm.pager.pageIndex,
                    pageSize: vm.pager.pageSize,
                    waiterKeyword: vm.searchForm.waiterKeyword,
                    buildingCodes: vm.searchForm.buildingCodes,
                    receivingMethod: vm.searchForm.receivingMethod,
                    state: vm.searchForm.state,
                    deliveryTimeCode: vm.searchForm.deliveryTimeCode,
                    orderStartTime: vm.searchForm.times[0] ? vm.$moment(vm.searchForm.times[0]).format('yyyy-MM-DD HH:mm:ss'):"",
                    orderEndTime: vm.searchForm.times[1] ? vm.$moment(vm.searchForm.times[1]).format('yyyy-MM-DD HH:mm:ss'):"",
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
