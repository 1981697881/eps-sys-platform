import Index from 'fastboot-admin/src/views/common/Index.vue'

export default [
    {

        path: '/epssys',
        name: 'index',
        meta: {tab: false},
        component: Index,
        // eslint-disable-next-line no-sparse-arrays
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import(/* webpackChunkName: "views" */ '../views/home/Home'),
            }, {
                path: '/home/task-list',
                name: 'task-list',
                meta: {title: '楼栋派送任务', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/home/TaskList'),
            } ,{
                path: '/home/task-detail',
                name: 'task-detail',
                meta: {title: '楼栋派送任务详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/home/TaskDetail'),
            },
            {

                path: '/building-manager/list',
                name: 'building-manager-list',
                meta: {title: '区域楼栋列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/building-manager/List'),
            }, {

                path: '/building-manager/add',
                name: 'building-manager-add',
                meta: {title: '区域楼栋新增', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/building-manager/Add'),
            }, {

                path: '/building-manager/edit',
                name: 'building-manager-edit',
                meta: {title: '区域楼栋编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/building-manager/Edit'),
            }, {
                path: '/exception-template-manager/list',
                name: 'exception-template-manager-list',
                meta: {title: '异常原因模板列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/exception-template-manager/List'),
            }, {

                path: '/exception-template-manager/add',
                name: 'exception-template-manager-add',
                meta: {title: '异常原因模板新增', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/exception-template-manager/Add'),
            }, {

                path: '/exception-template-manager/edit',
                name: 'exception-template-manager-edit',
                meta: {title: '异常原因模板编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/exception-template-manager/Edit'),
            }, {
                path: '/delivery-time-manager/list',
                name: 'delivery-time-manager-list',
                meta: {title: '配送时间段列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-time-manager/List'),
            }, {

                path: '/delivery-time-manager/add',
                name: 'delivery-time-manager-add',
                meta: {title: '配送时间段新增', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-time-manager/Add'),
            }, {

                path: '/delivery-time-manager/edit',
                name: 'delivery-time-manager-edit',
                meta: {title: '配送时间段编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-time-manager/Edit'),
            }, {
                path: '/eps-employee-manager/list',
                name: 'eps-employee-manager-list',
                meta: {title: '员工列表', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/eps-employee-manager/List'),
            }, {

                path: '/eps-employee-manager/add',
                name: 'eps-employee-manager-add',
                meta: {title: '员工新增', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/eps-employee-manager/Add'),
            }, {

                path: '/eps-employee-manager/edit',
                name: 'eps-employee-manager-edit',
                meta: {title: '员工编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/eps-employee-manager/Edit'),
            }, {
                path: '/coupon-manager/list',
                name: 'coupon-manager-list',
                meta: {title: '优惠卷列表', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/coupon-manager/List'),
            }, {
                path: '/coupon-manager/receive-list',
                name: 'coupon-manager-receive-list',
                meta: {title: '优惠劵领取记录', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/coupon-manager/ReceiveList'),
            }, {

                path: '/coupon-manager/add',
                name: 'coupon-manager-add',
                meta: {title: '优惠卷新增', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/coupon-manager/Add'),
            }, {

                path: '/coupon-manager/edit',
                name: 'coupon-manager-edit',
                meta: {title: '优惠卷编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/coupon-manager/Edit'),
            }, {
                path: '/member-manager/list',
                name: 'member-manager-list',
                meta: {title: '会员列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/List'),
            }, {

                path: '/member-manager/receiving-list',
                name: 'member-manager-receiving-list',
                meta: {title: '会员寄件记录', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/ReceivingList'),
            }, {

                path: '/member-manager/refuse-list',
                name: 'member-manager-refuse-list',
                meta: {title: '会员预拒收记录', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/RefuseList'),
            }, {

                path: '/member-manager/receiving-detail',
                name: 'member-manager-receiving-detail',
                meta: {title: '会员寄件详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/ReceivingDetail'),
            }, {

                path: '/member-manager/delivery-list',
                name: 'member-manager-delivery-list',
                meta: {title: '会员收件记录', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/DeliveryList'),
            }, {

                path: '/member-manager/delivery-detail',
                name: 'member-manager-delivery-detail',
                meta: {title: '会员收件记录详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/DeliveryDetail'),
            }, {

                path: '/member-manager/detail',
                name: 'member-manager-detail',
                meta: {title: '会员详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/Detail'),
            }, {

                path: '/member-manager/delivery-verify',
                name: 'member-manager-delivery-verify',
                meta: {title: '会员快件核销', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/member-manager/DeliveryVerify'),
            }
            , {

                path: '/receiving-record-manager/list',
                name: 'receiving-record-manager-list',
                meta: {title: '揽件列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/receiving-record-manager/List'),
            }, {

                path: '/receiving-record-manager/detail',
                name: 'receiving-record-manager-detail',
                meta: {title: '揽件详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/receiving-record-manager/Detail'),
            }, {

                path: '/receiving-record-manager/edit',
                name: 'receiving-record-manager-edit',
                meta: {title: '揽件编辑', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/receiving-record-manager/Edit'),
            }
            , {
                path: '/delivery-record-manager/list',
                name: 'delivery-record-manager-list',
                meta: {title: '配送件列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-record-manager/List'),
            },
            , {

                path: '/delivery-record-manager/verify',
                name: 'delivery-record-manager-verify',
                meta: {title: '配送件核销', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-record-manager/Verify'),
            }, {

                path: '/delivery-record-manager/detail',
                name: 'delivery-record-manager-detail',
                meta: {title: '配送件详情', tab: true},
                component: () => import(/* webpackChunkName: "views" */ '../views/delivery-record-manager/Detail'),
            },{
                path: '/extreme-speed-manager/list',
                name: 'extreme-speed-manager-list',
                meta: {title: '极速达列表', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/extreme-speed-manager/List'),
            },{
                path: '/work-order-management/list',
                name: 'work-order-management-list',
                meta: {title: '工单管理', tab: true,keepAlive:true},
                component: () => import(/* webpackChunkName: "views" */ '../views/work-order-management/List'),
            },
        ]
    },
    {

        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "views" */ '../views/Login'),
    }
]
;
