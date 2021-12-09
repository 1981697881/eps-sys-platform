<template>
    <div class="home-box">

        <el-row>
            <el-col :span="6">
                <el-card class="top-count">
                    <div class="top-count-title">总派件数量</div>
                    <div class="top-count-size">{{taskCount.allDeliveryRecordCount}}</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="top-count">
                    <div class="top-count-title">待派件数量</div>
                    <div class="top-count-size">{{taskCount.allWaitDeliveryRecordCount}}</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="top-count">
                    <div class="top-count-title">总揽件数量</div>
                    <div class="top-count-size">{{taskCount.allReceivingRecordCount}}</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="top-count">
                    <div class="top-count-title">待揽件数量</div>
                    <div class="top-count-size">{{taskCount.allWaitReceivingRecordCount}}</div>
                </el-card>
            </el-col>
        </el-row>

        <el-row>
            <div class="btn-box" style="margin-bottom: 0;">
                <el-button type="info" @click="showSendMsgBox()">发送消息通知</el-button>
            </div>

        </el-row>

        <el-row>
            <div class="btn-box">上午（派/揽）件情况</div>

            <fb-list-body :pager="morningPager"
                          @handlePagerSizeChange="handleMorningPagerSizeChange"
                          @handlePagerIndexChange="handleMorningPagerIndexChange">
                <template slot="btn-group">
                    <div></div>
                </template>
                <template slot="search-form">
                    <div>
                        <el-form>
                            <el-form-item class="search-form-item" label="区域楼栋">
                                <el-cascader
                                        ref="morningSearchBuildings"
                                        :props="{value:'code',label:'name', checkStrictly: true }"
                                        v-model="morningSearchForm.buildingCode"
                                        :options="tree"
                                        @change="handleMorningChange"></el-cascader>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template slot="table">
                    <el-table
                            v-loading="morningLoading"
                            :data="morningTables"
                            border
                            ref="mTable"
                            column-key="buildingName"
                            :filter-method="filterBuildingName">
                        <el-table-column
                                fixed
                                prop="buildingName"
                                label="楼栋名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="deliveryRecordCount"
                                label="总派件数">
                        </el-table-column>
                        <el-table-column
                                prop="signedDeliveryRecordCount"
                                label="已派件数">
                        </el-table-column>
                        <el-table-column
                                prop="waitDeliveryRecordCount"
                                label="待派件数">
                        </el-table-column>
                        <el-table-column
                                prop="receivingRecordCount"
                                label="总揽件数">
                        </el-table-column>
                        <el-table-column
                                prop="receivedReceivingRecordCount"
                                label="已揽件数">
                        </el-table-column>
                        <el-table-column
                                prop="waitReceivingRecordCount"
                                label="待揽件数">
                        </el-table-column>

                        <el-table-column
                                v-bind:key="item.code"
                                v-for="item in morningHeads"
                                :prop="item.code"
                                :label="item.times">
                            <template slot-scope="scope">
                                <div>待派/已派：{{getDeliveryDesc(scope.row, item)}}件</div>
                                <div>待揽/已揽：{{getReceivingDesc(scope.row, item)}}件</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="address"
                                label="操作"
                                width="180">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="handleBuildingTaskList(scope.row)" :underline="false">
                                    楼栋任务
                                </el-link>
                            </template>
                        </el-table-column>

                    </el-table>
                </template>

            </fb-list-body>

        </el-row>

        <el-row>
            <div class="btn-box">下午（派/揽）件情况</div>
            <fb-list-body :pager="afternoonPager"
                          @handlePagerSizeChange="handleAfternoonPagerSizeChange"
                          @handlePagerIndexChange="handleAfternoonPagerIndexChange">
                <template slot="btn-group">
                    <div></div>
                </template>
                <template slot="search-form">
                    <div>
                        <el-form>
                            <el-form-item class="search-form-item" label="区域楼栋">
                                <el-cascader
                                        ref="afternoonSearchBuildings"
                                        :props="{value:'code',label:'name', checkStrictly: true }"
                                        v-model="afternoonSearchForm.buildingCode"
                                        :options="tree"
                                        @change="handleAfternoonChange"></el-cascader>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template slot="table">
                    <el-table
                            v-loading="afternoonLoading"
                            :data="afternoonTables"
                            border
                            ref="aTable"
                            column-key="buildingName">
                        <el-table-column
                                fixed
                                prop="buildingName"
                                label="楼栋名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="deliveryRecordCount"
                                label="总派件数">
                        </el-table-column>
                        <el-table-column
                                prop="signedDeliveryRecordCount"
                                label="已派件数">
                        </el-table-column>
                        <el-table-column
                                prop="waitDeliveryRecordCount"
                                label="待派件数">
                        </el-table-column>
                        <el-table-column
                                prop="receivingRecordCount"
                                label="总揽件数">
                        </el-table-column>
                        <el-table-column
                                prop="receivedReceivingRecordCount"
                                label="已揽件数">
                        </el-table-column>
                        <el-table-column
                                prop="waitReceivingRecordCount"
                                label="待揽件数">
                        </el-table-column>

                        <el-table-column
                                v-bind:key="item.code"
                                v-for="item in afternoonHeads"
                                :prop="item.code"
                                :label="item.times">
                            <template slot-scope="scope">
                                <div>待派/已派：{{getDeliveryDesc(scope.row, item)}}件</div>
                                <div>待揽/已揽：{{getReceivingDesc(scope.row, item)}}件</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="address"
                                label="操作"
                                width="180">
                            <template slot-scope="scope">
                                <el-link type="primary" @click="handleBuildingTaskList(scope.row)" :underline="false">
                                    楼栋任务
                                </el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </fb-list-body>

        </el-row>


        <el-dialog title="发送消息通知" :visible.sync="showSendMsg">
            <el-form :model="msgForm">
                <el-form-item placeholder="请选择楼栋" class="search-form-item" label="楼栋区域" label-width="80px">
                    <el-cascader
                            style="width: 300px"
                            ref="searchBuildings"
                            :props="{value:'code',label:'name', checkStrictly: true }"
                            v-model="msgForm.buildingCode"
                            :options="tree"
                            @change="handleBuildingChange"></el-cascader>
                </el-form-item>

                <el-form-item label="时间段" label-width="80px">
                    <el-checkbox-group v-model="msgForm.deliveryTimeCodes">
                        <el-checkbox v-bind:key="time.code" v-for="time in deliveryTimes" :value="time.code"
                                     :label="time.times"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="户号" label-width="80px">
                    <el-select v-model="msgForm.houseNumber" placeholder="请选择户号" style="width: 300px">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-bind:key="number" v-for="number in houseNumbers" :label="number"
                                   :value="number"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通知类型" label-width="80px">
                    <el-checkbox-group v-model="msgForm.types">
                        <el-checkbox label="到站通知" value="MP_ARRIVE_NOTICE"></el-checkbox>
                        <el-checkbox label="派件通知" value="MP_DELIVERY_NOTICE"></el-checkbox>
                        <el-checkbox label="派件异常通知" value="MP_DELIVERY_EXCEPTION_NOTICE"></el-checkbox>
                        <el-checkbox label="揽件通知" value="MP_RECEIVING_NOTICE"></el-checkbox>
                        <el-checkbox label="揽件异常通知" value="MP_RECEIVED_EXCEPTION_NOTICE"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showSendMsg = false">取 消</el-button>
                <el-button type="primary" @click="send">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: {},
        data() {
            return {
                showSendMsg: false,
                msgForm: {
                    types: [],
                    deliveryTimeCodes: [],
                    houseNumber: '',
                    buildingCodes:  []
                },
                morningSearchForm: {
                    buildingCode: '',
                    buildingCodes: [],
                },
                afternoonSearchForm: {
                    buildingCode: '',
                    buildingCodes: []
                },
                tree: [],
                houseNumbers: [],
                deliveryTimes: [],
                morningHeads: [],
                afternoonHeads: [],
                morningTableData: [],
                afternoonTableData: [],
                afternoonLoading: true,
                morningLoading: true,
                taskCount: {},
                buildingCodes: [],
                morningPager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                },
                afternoonPager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                },
                morningBuildingNameKeyword: '',
                afternoonBuildingNameKeyword: '',
            }
        },
        watch: {
            "morningPager.pageIndex": {
                handler() {
                    this.loadMorningCount();
                },
                deep: true,
                immediate: true
            },
            "morningPager.pageSize": {
                handler() {
                    this.loadMorningCount();
                },
                deep: true
            },
            "afternoonPager.pageIndex": {
                handler() {
                    this.loadAfternoonCount();
                },
                deep: true,
                immediate: true
            },
            "afternoonPager.pageSize": {
                handler() {
                    this.loadAfternoonCount();
                },
                deep: true
            }
        },
        methods: {
            handleAfternoonChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.afternoonSearchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes,buildingCodes);
                vm.afternoonSearchForm.buildingCodes = buildingCodes;
                vm.loadAfternoonCount();
            },
            handleMorningChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.morningSearchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes,buildingCodes);
                vm.morningSearchForm.buildingCodes = buildingCodes;
                vm.loadMorningCount();
            },
            send() {
                let vm = this;
                let buildingCode = "";
                if (vm.msgForm.buildingCodes && vm.msgForm.buildingCodes.length > 0) {
                    buildingCode = vm.msgForm.buildingCodes[vm.msgForm.buildingCodes.length - 1]
                }
                vm.$http.post(vm.$api.messageNoticeRecord.sendAll, {
                    types: vm.msgForm.types,
                    deliveryTimeCodes: vm.msgForm.deliveryTimeCodes,
                    houseNumber: vm.msgForm.houseNumber,
                    buildingCode: buildingCode
                }).then((resp) => {
                    if(resp.data.status === 200){
                        vm.$message({type:'success',message:resp.data.desc});
                    }else{
                        vm.$message({type:'error',message:resp.data.desc});
                    }
                })
            },
            handleAfternoonPagerSizeChange(e) {
                this.afternoonPager.pageSize = e;
            },
            handleAfternoonPagerIndexChange(e) {
                this.afternoonPager.pageIndex = e;
            },
            handleMorningPagerSizeChange(e) {
                this.morningPager.pageSize = e;
            },
            handleMorningPagerIndexChange(e) {
                this.morningPager.pageIndex = e;
            },
            showSendMsgBox() {
                let vm = this;
                vm.showSendMsg = true;
                vm.loadBuildingTree();
            },
            houseNumberList() {
                let vm = this;
                vm.msgForm.houseNumber = ''
                vm.$http.post(vm.$api.building.houseNumberList, vm.$qs.stringify(
                    {
                        code: vm.buildingCodes[vm.buildingCodes.length - 1]
                    }
                )).then((resp) => {
                    vm.houseNumbers = resp.data.data.houseNumbers;
                })
            },
            loadBuildingTree() {
                let vm = this;
                vm.$http.post(vm.$api.building.tree, {}).then((resp) => {
                    vm.tree = resp.data.data.buildings;
                    vm.tree.unshift({name: "全部", code: ""})
                })
            },
            loadChildren(nodes, arr) {
                let vm = this
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].children && nodes[i].children.length > 0) {
                        vm.loadChildren(nodes[i].children, arr)
                    }
                    arr.push(nodes[i].value)
                }
            },
            handleBuildingChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.searchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes, buildingCodes)
                if (buildingCodes.length === 1 && buildingCodes[0] === '') {
                    vm.buildingCodes = []
                    vm.houseNumbers = []
                } else {
                    vm.buildingCodes = buildingCodes
                    vm.houseNumberList();
                }
            },
            filterBuildingName() {

            },
            handleBuildingTaskList(item) {
                this.$router.push({path: '/home/task-list', query: {buildingCode: item.buildingCode}});
            },
            getReceivingDesc(row, item) {
                return row[item.code].waitReceivingCount + '/' + row[item.code].receivedReceivingCount;
            },
            getDeliveryDesc(row, item) {
                return row[item.code].waitDeliveryCount + '/' + row[item.code].signedDeliveryCount;
            },
            loadTimeList() {
                let vm = this;
                vm.$http.post(vm.$api.deliveryTime.list, vm.$qs.stringify({onPage: false})).then((resp) => {
                    vm.deliveryTimes = resp.data.data.deliveryTimes;
                    // 区分上午下午
                    let m = [];
                    let a = [];
                    for (let i = 0; i < vm.deliveryTimes.length; i++) {
                        if (vm.deliveryTimes[i].type === 'MORNING') {
                            m.push(vm.deliveryTimes[i])
                        } else if (vm.deliveryTimes[i].type === 'AFTERNOON') {
                            a.push(vm.deliveryTimes[i])
                        }
                    }
                    vm.morningHeads = m;
                    vm.afternoonHeads = a;
                    this.loadCount()
                })
            },
            loadMorningCount() {
                let vm = this;
                vm.morningLoading = true
                vm.$http.post(vm.$api.count.loadMorningTaskCount, vm.$qs.stringify({
                    onPage: true,
                    pageIndex: vm.morningPager.pageIndex,
                    codes: vm.morningSearchForm.buildingCodes,
                    pageSize: vm.morningPager.pageSize
                })).then((resp) => {
                    vm.morningTableData = resp.data.data.taskCount.morningCounts;
                    vm.morningPager.pageIndex = resp.data.data.pager.pageIndex;
                    vm.morningPager.pageSize = resp.data.data.pager.pageSize;
                    vm.morningPager.itemCount = resp.data.data.pager.itemCount;
                    vm.morningLoading = false
                    vm.$nextTick(() => {
                        vm.$refs.mTable.doLayout();
                        vm.morningLoading = false
                    });
                })
            },
            loadAfternoonCount() {
                let vm = this;
                vm.afternoonLoading = true
                vm.$http.post(vm.$api.count.loadAfternoonTaskCount, vm.$qs.stringify({
                    onPage: true,
                    pageIndex: vm.afternoonPager.pageIndex,
                    codes: vm.afternoonSearchForm.buildingCodes,
                    pageSize: vm.afternoonPager.pageSize
                })).then((resp) => {
                    vm.afternoonTableData = resp.data.data.taskCount.afternoonCounts;
                    vm.afternoonPager.pageIndex = resp.data.data.pager.pageIndex;
                    vm.afternoonPager.pageSize = resp.data.data.pager.pageSize;
                    vm.afternoonPager.itemCount = resp.data.data.pager.itemCount;
                    vm.afternoonLoading = false
                    vm.$nextTick(() => {
                        vm.$refs.mTable.doLayout();
                    });
                })
            },
            loadCount() {
                let vm = this;
                vm.$http.post(vm.$api.count.loadTaskCount, {}).then((resp) => {
                    vm.taskCount = resp.data.data.taskCount;
                })

                vm.loadMorningCount();
                vm.loadAfternoonCount();
            }
        },
        mounted() {

            this.loadTimeList()
        },
        created() {
            let vm = this;
            this.$http.post(vm.$api.building.tree,{}).then((resp)=>{
                vm.tree = resp.data.data.buildings;
            })
        },
        computed: {
            afternoonTables() {
                let vm = this;

                if (vm.afternoonBuildingNameKeyword) {
                    return vm.afternoonTableData.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).indexOf(vm.afternoonBuildingNameKeyword) > -1;
                        })
                    })
                }
                return vm.afternoonTableData;
            },
            morningTables() {
                let vm = this;

                if (vm.morningBuildingNameKeyword) {
                    return vm.morningTableData.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).indexOf(vm.morningBuildingNameKeyword) > -1;
                        })
                    })
                }
                return vm.morningTableData;
            }
        }
    };
</script>

<style scoped>
    .top-count {
        width: 90%;
        height: 140px;
        text-align: center;
    }

    .top-count-title {
        font-size: 28px;
        margin-top: 10px;
        margin-bottom: 20px;
        color: #666666;
    }

    .top-count-size {
        font-size: 24px;
    }

    .btn-box {
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 20px;
    }
</style>