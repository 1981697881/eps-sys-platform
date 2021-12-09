<template>
    <div>
        <fb-list-body :pager="pager"
                      @handlePagerSizeChange="handlePagerSizeChange"
                      @handlePagerIndexChange="handlePagerIndexChange"
        >   <template slot="btn-group">
            <el-button icon="el-icon-search" @click.stop="handleSearch(1)">查询</el-button>
        </template>
            <template slot="search-form">
                <!--<el-form-item class="search-form-item" label="快递单号">
                    <el-input v-model="searchForm.trackingNumber" placeholder="请输入快递单号"></el-input>
                </el-form-item>
                <el-form-item class="search-form-item" label="收件人">
                    <el-input v-model="searchForm.addresseeKeyword" placeholder="请输入姓名/手机"></el-input>
                </el-form-item>
                <el-form-item class="search-form-item" label="派件人">
                    <el-input v-model="searchForm.deliverymanKeyword" placeholder="请输入姓名/手机"></el-input>
                </el-form-item>-->
                <el-form-item class="search-form-item" label="寄件楼栋">
                    <el-cascader
                            ref="searchBuildings"
                            :props="{value:'code',label:'name', checkStrictly: true }"
                            v-model="searchForm.buildingCode"
                            :options="tree"
                            @change="handleBuildingChange"></el-cascader>
                </el-form-item>
                <!--<el-form-item class="search-form-item" label="状态">
                    <el-select v-model="searchForm.state" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已签收" value="SIGNED"></el-option>
                        <el-option label="派送中" value="DELIVERING"></el-option>
                        <el-option label="待派送" value="WAIT"></el-option>
                        <el-option label="异常" value="EXCEPTION"></el-option>
                        <el-option label="拒收" value="REFUSE"></el-option>
                        <el-option label="超时" value="TIMEOUT"></el-option>
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
                </el-form-item>-->
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
                            {{scope.row.jsdOrderNumber ? scope.row.jsdOrderNumber :'-' }}
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="收件人">
                        <template scope="scope">
                            {{scope.row.realName ? scope.row.realName :'-' }}
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="收件人手机号"
                            width="150"
                    >
                        <template scope="scope">
                            {{scope.row.userPhone ? scope.row.userPhone :'-' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="派送楼栋"
                    >
                        <template scope="scope">
                            {{scope.row.userAddress ? scope.row.userAddress :'-' }}
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
                            fixed="right"
                            width="140"
                            label="操作">
                        <template slot-scope="scope">
                            <el-link style="margin-left: 10px;" type="primary" @click="handleVerifyState(scope.row)"
                                     :underline="false">编辑
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </fb-list-body>
        <el-dialog
                title="指定派送人"
                :visible.sync="showSender"
                width="30%">
            <el-form :inline="true">
                <el-row>
                    <el-form-item label="派送方式">
                        <el-select @change="showSenderUser" v-model="Sender" placeholder="请选择派送人">
                            <el-option v-bind:key="user.code" v-for="user in senderArray"
                                       :label="user.realName"
                                       :value="user.mobileNumber"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="showSender = false">取 消</el-button>
            <el-button type="primary" @click="updateDeliveryMethodTime">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components: {},
        props: {
            timestamp: {
                type: Number, default: function () {
                    return new Date().getTime()
                }
            },
        },
        data() {
            return {
                api: {
                    list: this.$api.extremeSpeed.list,
                    update: this.$api.extremeSpeed.update,
                    tree: this.$api.building.tree,
                  /*  timeList: this.$api.deliveryTime.list,*/
                },
                deliveryTimes: [],
                senderArray: [],
                file: null,
                Sender: null,
                businesses: [],
                showImportVerify: false,
                showSender: false,
                solicitationForm:{},
                searchForm: {
                    trackingNumber: '',
                    addresseeKeyword: '',
                    deliverymanKeyword: '',
                    buildingCode: '',
                    state: '',
                    buildingCodes: [],
                    times: [],
                },
                states: [
                    {
                        name: "已签收",
                        value: "SIGNED",
                    }, {
                        name: "派送中",
                        value: "DELIVERING",
                    }, {
                        name: "待派送",
                        value: "WAIT",
                    }, {
                        name: "待取货",
                        value: "WAIT_SIGNED",
                    }, {
                        name: "异常",
                        value: "EXCEPTION",
                    }, {
                        name: "拒收",
                        value: "REFUSE",
                    }, {
                        name: "超时",
                        value: "TIMEOUT",
                    }
                ],
                tableData: [],
                tree: [],
                selection: [],
                pager: {
                    pageSize: 10
                    , pageIndex: 1,
                    itemCount: 0
                },

            }
        },
        computed: {
            searchParams() {
                return Object.assign({}, this.$route.query, this.searchForm, this.pager);
            }
        },
        watch: {
            timestamp() {
                this.handleSearch();
            },
            "pager.pageIndex": {
                handler() {
                    this.$router.updateQuery({path: this.$route.path, query: this.searchParams});
                    this.handleSearch();
                },
                deep: true,
                immediate: true
            },
            "pager.pageSize": {
                handler() {
                    this.$router.updateQuery({path: this.$route.path, query: this.searchParams});
                    this.handleSearch();
                },
                deep: true
            }

        },
        methods: {
            showSenderUser(){
            },
            updateDeliveryMethodTime() {
                let vm = this;
                vm.showSender = true;
                this.$http.post(this.api.update, vm.$qs.stringify({
                    jsdOrderNumber: vm.solicitationForm.jsdOrderNumber,
                    userAddress: vm.solicitationForm.userAddress,
                    userPhone: vm.solicitationForm.userPhone,
                    mobile: vm.Sender,
                })).then((resp) => {
                    vm.showSender = false;
                    if (resp.data.status === 200) {
                        vm.$message({
                            type: 'success',
                            message: resp.data.desc
                        });
                    } else {
                        vm.$message({
                            type: 'error',
                            message: resp.data.desc
                        });
                    }
                })
            },
            handleBatchVerify() {
                let vm = this;
                if (!this.selection.length) {
                    this.$message({type: 'warning', message: '未选择记录'});
                    return;
                }
                let codes = [];
                this.selection.forEach((e) => {
                    codes.push(e.code);
                });
                this.$confirm('您现在正在进行批量核销操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(this.api.batchVerify, codes).then((resp) => {
                        if (resp.data.status === 200) {
                            vm.$message({type: 'success', message: resp.data.desc});
                            vm.handleSearch();
                        } else {
                            vm.$message({type: 'error', message: resp.data.desc});
                        }
                    })
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });

            },
            handleVerifyState(row) {
                let vm = this;
                vm.showSender = true;
                vm.solicitationForm = row;
              /*  vm.$router.push({path: 'verify', query: {index: index}});
                sessionStorage.setItem("deliveryListSearchForm", JSON.stringify(vm.searchForm));*/

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
            getDeliveryMethodName(value) {
                for (let i = 0; i < this.deliveryMethods.length; i++) {
                    if (this.deliveryMethods[i].value === value) {
                        return this.deliveryMethods[i].name
                    }
                }
            },
            handleImportVerify() {
                let vm = this
                let handleImportVerifyFileObj = vm.$refs.handleImportVerifyFile;
                handleImportVerifyFileObj.click();
            },
            changeImportVerifyFile() {
                let vm = this
                let handleImportVerifyFileObj = vm.$refs.handleImportVerifyFile;
                let files = handleImportVerifyFileObj.files;
                if (files.length > 0) {
                    let formData = new FormData();
                    formData.append("file",files[0]);
                    this.$http.post(this.api.importVerify, formData).then((resp) => {
                        if (resp.data.data && resp.data.data.fileName) {

                            let createFile = function (base64Str){
                                let bstr = atob(base64Str);
                                let n = bstr.length;
                                let u8arr = new Uint8Array(n);
                                while (n--) {
                                    u8arr[n] = bstr.charCodeAt(n);
                                }
                                return new Blob([u8arr], {type: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64'});
                            }

                            let fileData  = resp.data.data.importResult;

                            let file = createFile(fileData);

                            if (navigator.appVersion.toString().indexOf(".NET") > 0) {//ie兼容处理
                                window.navigator.msSaveBlob(file, resp.data.data.fileName);
                            } else {
                                let a = document.createElement("a");
                                a.href = window.URL.createObjectURL(file);
                                a.download = resp.data.data.fileName ;
                                a.click();
                                document.body.appendChild(a);
                                setTimeout(function () { //延时释放
                                    window.URL.revokeObjectURL(file); //用URL.revokeObjectURL()来释放这个object URL
                                }, 100);
                            }

                        }
                    })
                }
            },
            handleBuildingChange() {
                let vm = this
                let buildingCodes = []
                let checkedNodes = vm.$refs.searchBuildings.getCheckedNodes();
                vm.loadChildren(checkedNodes, buildingCodes)
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
            handleExport() {
                let vm = this;
                window.location.href = vm.api.exportException
            },
            handleAllExport() {
                let vm = this;
                // eslint-disable-next-line no-unused-vars
                let buildingCodes = "";
                if (vm.searchForm.buildingCodes) {
                    for (let i = 0; i < vm.searchForm.buildingCodes.length; i++) {
                        buildingCodes+=vm.searchForm.buildingCodes[i];
                        if (i < vm.searchForm.buildingCodes.length - 1) {
                            buildingCodes+=",";
                        }
                    }
                }

                window.location.href = vm.api.export
                    + "?addresseeKeyword=" + vm.searchForm.addresseeKeyword
                    + "&deliverymanKeyword=" + vm.searchForm.deliverymanKeyword
                    + "&buildingCodes=" + vm.searchForm.buildingCodes
                    + "&deliveryMethod=" + vm.searchForm.deliveryMethod
                    + "&trackingNumber=" + vm.searchForm.trackingNumber
                    + "&business=" + vm.searchForm.business
                    + "&state=" + vm.searchForm.state
                    + "&verifyState=" + vm.searchForm.verifyState
                    + "&deliveryTimeCode=" + vm.searchForm.deliveryTimeCode
                    + "&startCreateTime=" + (vm.searchForm.times[0] ? vm.$moment(vm.searchForm.times[0]).format('YYYY-MM-DD HH:mm:ss') : "")
                    + "&endCreateTime=" + (vm.searchForm.times[1] ? vm.$moment(vm.searchForm.times[1]).format('YYYY-MM-DD HH:mm:ss') : "");

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
            handleEdit(e) {

                if (e && e.code) {
                    this.$router.push({path: 'edit', query: {code: e.code}});
                    return;
                }

                if (!this.selection.length) {
                    this.$message({type: 'warning', message: '未选择记录'});
                    return;
                }

                if (this.selection.length > 1) {
                    this.$message({type: 'warning', message: '一次只能编辑一条数据'});
                    return;
                }

                this.$router.push({path: 'edit', query: {code: this.selection[0].code}});
            },

            handleBatchDelete() {


                let vm = this;

                if (!this.selection.length) {
                    this.$message({type: 'warning', message: '未选择记录'});
                    return;
                }


                let codes = [];

                this.selection.forEach((e) => {
                    codes.push(e.code);
                });


                this.$confirm('您现在正在进行批量删除操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    vm.$http.post(this.api.batchDelete, codes).then((resp) => {
                        if (resp.data.status === 200) {
                            vm.$message({type: 'success', message: resp.data.desc});
                            vm.handleSearch();
                        } else {
                            vm.$message({type: 'error', message: resp.data.desc});

                        }
                    })


                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });


            },
            handleSelectionChange(selection) {
                console.log(selection);
                this.selection = selection;
            },
            handlePagerSizeChange(e) {
                this.pager.pageSize = e;
            },
            handlePagerIndexChange(e) {
                this.pager.pageIndex = e;
            },
            handleSearch(index) {
                let vm = this;
                if (index) {
                    vm.pager.pageIndex = index;
                }
                this.$http.post(this.api.list, this.$qs.stringify({
                   /* addresseeKeyword: vm.searchForm.addresseeKeyword,
                    deliverymanKeyword: vm.searchForm.deliverymanKeyword,
                    buildingCodes: vm.searchForm.buildingCodes,
                    deliveryMethod: vm.searchForm.deliveryMethod,
                    trackingNumber: vm.searchForm.trackingNumber,
                    business: vm.searchForm.business,
                    state: vm.searchForm.state,
                    verifyState: vm.searchForm.verifyState,
                    pageIndex: vm.pager.pageIndex,
                    pageSize: vm.pager.pageSize,
                    deliveryTimeCode: vm.searchForm.deliveryTimeCode,
                    startCreateTime: vm.searchForm.times[0] ? vm.$moment(vm.searchForm.times[0]).format('YYYY-MM-DD HH:mm:ss') : "",
                    endCreateTime: vm.searchForm.times[1] ? vm.$moment(vm.searchForm.times[1]).format('YYYY-MM-DD HH:mm:ss') : "",*/
                })).then((resp) => {
                    console.log(resp.data.data.deliveryRecords)
                    vm.tableData = resp.data.data.houseTasks;
                    //处理分页
                    vm.pager.pageIndex = resp.data.data.pager.pageIndex;
                    vm.pager.pageSize = resp.data.data.pager.pageSize;
                    vm.pager.itemCount = resp.data.data.pager.itemCount;

                })
            }
        },
        created() {
            let vm = this;
            for (let key in this.searchForm) {
                if (this.$route.query[key]) {
                    this.searchForm[key] = this.$route.query[key];
                }
            }
            this.$http.post(this.api.tree, {}).then((resp) => {
                vm.tree = resp.data.data.buildings;
                vm.tree.unshift({name: "全部", code: ""})
            })

            this.$http.post(this.$api.common.loadBusiness, {}).then((resp) => {
                vm.businesses = resp.data.data.businesses;
            })
            this.$http.post(this.$api.epsEmployee.list,this.$qs.stringify({
                onPage: false,
               /* roleFlag:'COLLECTOR'*/
            })).then((resp)=>{
                vm.senderArray =  resp.data.data.epsEmployees;
            })
           /* this.$http.post(this.api.timeList, vm.$qs.stringify({onPage: false})).then((resp) => {
                vm.deliveryTimes = resp.data.data.deliveryTimes;
            })*/

        }
    }
</script>

<style scoped>

</style>
