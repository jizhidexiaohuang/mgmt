import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main'
import SharePage from '@/view/sharePage/shareList';

Vue.use(Router)

export const constantRoutes = [
    {
        path:"/login",
        name:"登陆",
        component: () => import('@/view/login/login.vue')
    },
    {
        path:"/bindMobile",
        name:"绑定手机号",
        component:() => import('@/view/bindMobile/bindMobile')
    },
    {
        path:"/404",
        name:"404页面",
        component: Main,
        children:[
            {
                path: '/404',
                name: '页面找不到啦~',
                component: () => import('@/view/errorPage/404'),
                meta:{
                    name:"页面丢失"
                }
            },
        ]
    },
    {
        path:"/500",
        name:"500页面",
        component: Main,
        children:[
            {
                path: '/500',
                name: '页面出错啦~',
                component: () => import('@/view/errorPage/500'),
                meta:{
                    name:"页面出错"
                }
            },
        ]
    },
    {
        path: '',
        name: '首页',
        redirect:'/home',
        component: Main,
        children: [
            {
                path: '/home',
                name: '工作台',
                component: () => import('@/view/home/index.vue'),
                meta:{
                    name:"工作台",
                    parentMenu:'home:-'
                }
            },
            {
                path: '/developing',
                name: '待开发',
                component: () => import('@/components/common/developing/developing.vue'),
            }
        ],
    },
    {
        path:"/",
        name:"分享页面",
        component:SharePage,
        children: [
            {
                path: '/shareList',
                name: '分享线索',
                component: () => import('@/view/sharePage/shareList.vue')
            }
        ]
    }
]

export const asyncRoutes = [
    {
        path: '/',
        name: '律师团队',
        component: Main,
        children: [
            {
                path: '/cooperationTeam/lawyer/examine',
                name: '律师审核',
                component: () => import('@/view/cooperationTeam/lawyer/examine.vue'),
                meta:{
                    type:"菜单",
                    name:"律师审核",
                    parentMenu:'cooperation:-'
                }
            },
            {
                path: '/cooperationTeam/lawyer/manage',
                name: '律师管理',
                component: () => import('@/view/cooperationTeam/lawyer/manage.vue'),
                meta:{
                    type:"菜单",
                    name:"律师管理",
                    parentMenu:'cooperation:-'
                }
            },
            {
                path: '/cooperationTeam/lawyer/bank',
                name: '审核结算账号',
                component: () => import('@/view/cooperationTeam/lawyer/bank.vue'),
                meta:{
                    type:"菜单",
                    name:"审核结算账号",
                    parentMenu:'cooperation:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '调查团队',
        component: Main,
        children: [
            {
                path: '/cooperationTeam/investigator/examine',
                name: '调查审核',
                component: () => import('@/view/cooperationTeam/investigator/examine.vue'),
                meta:{
                    type:"菜单",
                    name:"调查审核",
                    parentMenu:'cooperation:-'
                }
            },
            {
                path: '/cooperationTeam/investigator/manage',
                name: '调查管理',
                component: () => import('@/view/cooperationTeam/investigator/manage.vue'),
                meta:{
                    type:"菜单",
                    name:"调查管理",
                    parentMenu:'cooperation:-'
                }
            },
            {
                path: '/cooperationTeam/investigator/bank',
                name: '审核结算账号',
                component: () => import('@/view/cooperationTeam/investigator/bank.vue'),
                meta:{
                    type:"菜单",
                    name:"审核结算账号",
                    parentMenu:'cooperation:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '系统设置',
        component: Main,
        children: [
            {
                path: '/system/memberManage',
                name: '组织管理',
                component: () => import('@/view/system/memberManage/memberManage.vue'),
                meta:{
                    type:"菜单",
                    name:"组织管理",
                    parentMenu:'system:-'
                }
            },
            {
                path: '/system/positionManage', 
                name: '角色管理',
                component: () => import('@/view/system/positionManage/positionManage.vue'),
                meta:{
                    type:"菜单",
                    name:"角色管理",
                    parentMenu:'system:-'
                }
            },
            {
                path: '/system/timeService', 
                name: '定时服务',
                component: () => import('@/view/system/timeService/index.vue'),
                meta:{
                    type:"菜单",
                    name:"定时服务",
                    parentMenu:'system:-'
                }
            },
            {
                path: '/system/announcement', 
                name: '公告发布',
                component: () => import('@/view/system/announcement/index.vue'),
                meta:{
                    type:"菜单",
                    name:"公告发布",
                    parentMenu:'system:-'
                }
            },
            {
                path: '/system/test', 
                name: '开发组件测试页面',
                component: () => import('@/view/system/test/test.vue'),
            },
            {
                path: '/system/positionManage/main/operaPosition/:apartmentId', 
                name: '职务管理新增/修改',
                component: () => import('@/view/system/positionManage/operaPosition.vue'),
            }
        ],
    },
    {
        path: '/',
        name: '客户线索管理',
        component: Main,
        children: [
            {
                path: '/relationship/customerClue',
                name: '客户线索',
                component: () => import('@/view/relationship/customerClue/customerClue.vue'),
                meta:{
                    type:"菜单",
                    name:"客户线索",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '客户管理',
        component: Main,
        children: [
            {
                path: '/relationship/myClient',
                name: '负责客户',
                component: () => import('@/view/relationship/customerManage/myClient.vue'),
                meta:{
                    type:"菜单",
                    name:"负责客户",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/collaborativeCustomers',
                name: '协作客户',
                component: () => import('@/view/relationship/customerManage/collaborativeCustomers.vue'),
                meta:{
                    type:"菜单",
                    name:"协作客户",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/allCustomers',
                name: '全部客户',
                component: () => import('@/view/relationship/customerManage/allCustomers.vue'),
                meta:{
                    type:"菜单",
                    name:"全部客户",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '渠道管理',
        component: Main,
        children: [
            {
                path: '/relationship/myChannel',
                name: '负责渠道',
                component: () => import('@/view/relationship/channelManage/myChannel.vue'),
                meta:{
                    type:"菜单",
                    name:"负责渠道",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/cooperativeChannels',
                name: '协作渠道',
                component: () => import('@/view/relationship/channelManage/cooperativeChannels.vue'),
                meta:{
                    type:"菜单",
                    name:"协作渠道",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/allChannels',
                name: '全部渠道',
                component: () => import('@/view/relationship/channelManage/allChannels.vue'),
                meta:{
                    type:"菜单",
                    name:"全部渠道",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '商机管理',
        component: Main,
        children: [
            {
                path: '/relationship/projectApplication',
                name: '立项申请',
                component: () => import('@/view/relationship/projectApplication/index.vue'),
                meta:{
                    type:"菜单",
                    name:"立项申请",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/projectReview',
                name: '商机审核',
                component: () => import('@/view/relationship/projectReview/index.vue'),
                meta:{
                    type:"菜单",
                    name:"商机审核",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '合同模板管理',
        component: Main,
        children: [
            {
                path: '/relationship/contractTemplate',
                name: '合同模板',
                component: () => import('@/view/relationship/contractTemplate/index.vue'),
                meta:{
                    type:"菜单",
                    name:"合同模板",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '合同管理',
        component: Main,
        children: [
            {
                path: '/contract/myContract',
                name: '合同服务',
                component: () => import('@/view/contractManage/myContract.vue'),
                meta:{
                    type:"菜单",
                    name:"合同服务",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/contract/contractReview', 
                name: '合同审核',
                component: () => import('@/view/contractManage/contractReview.vue'),
                meta:{
                    type:"菜单",
                    name:"合同审核",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/contract/contractSignature', 
                name: '合同签字',
                component: () => import('@/view/contractManage/contractSignature.vue'),
                meta:{
                    type:"菜单",
                    name:"合同签字",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/contract/allContract', 
                name: '全部合同',
                component: () => import('@/view/contractManage/allContract.vue'),
                meta:{
                    type:"菜单",
                    name:"全部合同",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '案例管理',
        component: Main,
        children: [
            {
                path: '/relationship/industryManage',
                name: '行业管理',
                component: () => import('@/view/relationship/industryManage/index.vue'),
                meta:{
                    type:"菜单",
                    name:"行业管理",
                    parentMenu:'market-center:-'
                }
            },
            {
                path: '/relationship/caseManage',
                name: '案例管理',
                component: () => import('@/view/relationship/caseManage/index.vue'),
                meta:{
                    type:"菜单",
                    name:"案例管理",
                    parentMenu:'market-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '线索任务',
        component: Main,
        children: [
            {
                path: '/task/myTask',
                name: '我管理的任务',
                component: () => import('@/view/task/myTask/myTask.vue'),
                meta:{
                    type:"菜单",
                    name:"我管理的任务",
                    parentMenu:'clue:-'
                }
            },
            {
                path: '/task/auditTask', 
                name: '待审核任务',
                component: () => import('@/view/task/auditTask.vue'),
                meta:{
                    type:"菜单",
                    name:"待审核任务",
                    parentMenu:'clue:-'
                }
            },
            {
                path: '/task/rejectTask', 
                name: '被拒绝任务',
                component: () => import('@/view/task/rejectTask.vue'),
                meta:{
                    type:"菜单",
                    name:"被拒绝任务",
                    parentMenu:'clue:-'
                }
            },
            {
                path: '/task/allTask', 
                name: '全部任务',
                component: () => import('@/view/task/allTask.vue'),
                meta:{
                    type:"菜单",
                    name:"全部任务",
                    parentMenu:'clue:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '线索结果',
        component: Main,
        children: [
            {
                path: '/clue/myManage/reviewedClue',
                name: '我管理的-待审核',
                component: () => import('@/view/clue/myManage/reviewedClue.vue'),
                meta:{
                    type:"菜单",
                    name:"我管理的-待审核",
                    parentMenu:'clue:-'
                }
            },
            {
                path: '/clue/myManage/allClues',
                name: '我管理的-全部',
                component: () => import('@/view/clue/myManage/allClues.vue'),
                meta:{
                    type:"菜单",
                    name:"我管理的-全部",
                    parentMenu:'clue:-'
                }
            },
            {
                path: '/clue/allClues',
                name: '全部线索',
                component: () => import('@/view/clue/allClues.vue'),
                meta:{
                    type:"菜单",
                    name:"全部线索",
                    parentMenu:'clue:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '产品中心',
        component: Main,
        children: [
            {
                path:'/product/manage',
                name: "产品管理",
                component: () => import('@/view/relationship/productManage/index.vue'),
                meta:{
                    type:"菜单",
                    name:"产品管理",
                    parentMenu:'product-center:-'
                }
            },
            {
                path: '/agreement/cust',
                name: '客户协议',
                component: () => import('@/view/agreement/custAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"客户协议",
                    parentMenu:'product-center:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '项目',
        component: Main,
        children: [
            {
                path: '/project/myManage',
                name: '我负责的',
                component: () => import('@/view/projectManage/myManage.vue'),
                meta:{
                    type:"菜单",
                    name:"我负责的",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/project/collaborate', 
                name: '我协作的',
                component: () => import('@/view/projectManage/collaborateProj.vue'),
                meta:{
                    type:"菜单",
                    name:"我协作的",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/project/allProjects', 
                name: '全部',
                component: () => import('@/view/projectManage/allProjects.vue'),
                meta:{
                    type:"菜单",
                    name:"全部",
                    parentMenu:'project:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '律师协议',
        component: Main,
        children: [
            {
                path: '/agreement/lawyer/my',
                name: '我管理的',
                component: () => import('@/view/agreement/myLawyerAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"我管理的",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/agreement/lawyer/pending', 
                name: '待审核',
                component: () => import('@/view/agreement/pendingLawyerAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"待审核",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/agreement/lawyer', 
                name: '全部',
                component: () => import('@/view/agreement/lawyerAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"全部",
                    parentMenu:'project:-'
                }
            }
        ],
    },
    {
        path:'/',
        name:'调查协议配置',
        component:Main,
        children:[
            {
                path: '/config/investigator',
                name: '调查协议配置',
                component: () => import('@/view/agreement/configInvestigator.vue'),
                meta:{
                    type:"菜单",
                    name:"调查协议配置",
                    parentMenu:'project:-'
                }
            },
        ]
    },
    {
        path:'/',
        name:'区域等级配置',
        component:Main,
        children:[
            {
                path: '/config/region',
                name: '区域等级配置',
                component: () => import('@/view/agreement/region.vue'),
                meta:{
                    type:"菜单",
                    name:"区域等级配置",
                    parentMenu:'project:-'
                }
            },
        ]
    },
    {
        path: '/',
        name: '调查协议',
        component: Main,
        children: [
            {
                path: '/agreement/investigator/my',
                name: '我管理的',
                component: () => import('@/view/agreement/myInvestigatorAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"我管理的",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/agreement/investigator/pending', 
                name: '待审核',
                component: () => import('@/view/agreement/pendingInvestigatorAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"待审核",
                    parentMenu:'project:-'
                }
            },
            {
                path: '/agreement/investigator', 
                name: '全部',
                component: () => import('@/view/agreement/investigatorAgreement.vue'),
                meta:{
                    type:"菜单",
                    name:"全部",
                    parentMenu:'project:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '案件管理',
        component: Main,
        children: [
            {
                path: '/case/allCases',
                name: '全部案件',
                component: () => import('@/view/case/allCases.vue'),
                meta:{
                    type:"菜单",
                    name:"全部案件",
                    parentMenu:'case:-'
                }
            },
            {
                path: '/case/materialList',
                name: '材料清单',
                component: () => import('@/view/materialList/index.vue'),
                meta:{
                    type:"菜单",
                    name:"材料清单",
                    parentMenu:'case:-'
                }
            },
        ],
    },
    {
        path: '/',
        name: '我的案件',
        component: Main,
        children: [
            {
                path: '/case/civilCase',
                name: '民事案件',
                component: () => import('@/view/case/civilCase.vue'),
                meta:{
                    type:"菜单",
                    name:"民事案件",
                    parentMenu:'case:-'
                }
            },
            {
                path: '/case/administrativeCase',
                name: '行政案件',
                component: () => import('@/view/case/administrativeCase.vue'),
                meta:{
                    type:"菜单",
                    name:"行政案件",
                    parentMenu:'case:-'
                }
            },
            {
                path: '/case/criminalCase',
                name: '刑事案件',
                component: () => import('@/view/case/criminalCase.vue'),
                meta:{
                    type:"菜单",
                    name:"刑事案件",
                    parentMenu:'case:-'
                }
            }
        ],
    },
    {
        path: '/',
        name: '回购案件',
        component: Main,
        children: [
            {
                path: '/tradingCenter/buyBackInFullCase',
                name: '全部回购案件',
                component: () => import('@/view/tradingCenter/buyBack/buyBackInFullCase.vue'),
                meta:{
                    type:"菜单",
                    name:"全部回购案件",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/penddingCase',
                name: '待审核案件',
                component: () => import('@/view/tradingCenter/buyBack/penddingCase.vue'),
                meta:{
                    type:"菜单",
                    name:"待审核案件",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '回购结算',
        component: Main,
        children: [
            {
                path: '/tradingCenter/allSettlements',
                name: '全部结算单',
                component: () => import('@/view/tradingCenter/buySettlement/allSettlements.vue'),
                meta:{
                    type:"菜单",
                    name:"全部结算单",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/reviewedSettlement',
                name: '待审核结算单',
                component: () => import('@/view/tradingCenter/buySettlement/reviewedSettlement.vue'),
                meta:{
                    type:"菜单",
                    name:"待审核结算单",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/approvedStatement',
                name: '已通过结算单',
                component: () => import('@/view/tradingCenter/buySettlement/approvedStatement.vue'),
                meta:{
                    type:"菜单",
                    name:"已通过结算单",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '回购退款',
        component: Main,
        children: [
            {
                path: '/tradingCenter/refundApplication',
                name: '回购退款申请',
                component: () => import('@/view/tradingCenter/buySettlement/refundApplication.vue'),
                meta:{
                    type:"菜单",
                    name:"回购退款申请",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/paymentList',
                name: '回购付款列表',
                component: () => import('@/view/tradingCenter/buySettlement/paymentList.vue'),
                meta:{
                    type:"菜单",
                    name:"回购付款列表",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '邮寄列表',
        component: Main,
        children: [
            {
                path: '/tradingCenter/mailingList',
                name: '邮寄列表',
                component: () => import('@/view/tradingCenter/mailingList/index.vue'),
                meta:{
                    type:"菜单",
                    name:"邮寄列表",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '出售案件',
        component: Main,
        children: [
            {
                path: '/tradingCenter/casesForSale',
                name: '待出售案件',
                component: () => import('@/view/tradingCenter/sell/casesForSale.vue'),
                meta:{
                    type:"菜单",
                    name:"待出售案件",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/allSaleCases',
                name: '全部出售案件',
                component: () => import('@/view/tradingCenter/sell/allSaleCases.vue'),
                meta:{
                    type:"菜单",
                    name:"全部出售案件",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '案件包',
        component: Main,
        children: [
            {
                path: '/tradingCenter/publicPackage',
                name: '公共包',
                component: () => import('@/view/tradingCenter/sell/publicPackage.vue'),
                meta:{
                    type:"菜单",
                    name:"公共包",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/assignPackage',
                name: '指派包',
                component: () => import('@/view/tradingCenter/sell/assignPackage.vue'),
                meta:{
                    type:"菜单",
                    name:"指派包",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '订单管理',
        component: Main,
        children: [
            {
                path: '/tradingCenter/ongoingOrder',
                name: '进行中订单',
                component: () => import('@/view/tradingCenter/orderManage/ongoingOrder.vue'),
                meta:{
                    type:"菜单",
                    name:"进行中订单",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/completedOrder',
                name: '已完成订单',
                component: () => import('@/view/tradingCenter/orderManage/completedOrder.vue'),
                meta:{
                    type:"菜单",
                    name:"已完成订单",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/allOrder',
                name: '全部订单',
                component: () => import('@/view/tradingCenter/orderManage/allOrder.vue'),
                meta:{
                    type:"菜单",
                    name:"全部订单",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/additionalOrder',
                name: '附加订单',
                component: () => import('@/view/tradingCenter/orderManage/additionalOrder/index.vue'),
                meta:{
                    type:"菜单",
                    name:"附加订单",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '退回管理',
        component: Main,
        children: [
            {
                path: '/tradingCenter/returnRecord',
                name: '退回记录',
                component: () => import('@/view/tradingCenter/returnManage/returnRecord.vue'),
                meta:{
                    type:"菜单",
                    name:"退回记录",
                    parentMenu:'trade-center:-'
                }
            },
            {
                path: '/tradingCenter/refundRecord',
                name: '退款记录',
                component: () => import('@/view/tradingCenter/returnManage/refundRecord.vue'),
                meta:{
                    type:"菜单",
                    name:"退款记录",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '办案区域',
        component: Main,
        children: [
            {
                path: '/tradingCenter/caseArea',
                name: '办案区域',
                component: () => import('@/view/tradingCenter/caseArea/index.vue'),
                meta:{
                    type:"菜单",
                    name:"办案区域",
                    parentMenu:'trade-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '收款管理',
        component: Main,
        children: [
            {
                path: '/settlementCenter/realIncome',
                name: '实收录入',
                component: () => import('@/view/settlementCenter/collection/realIncome.vue'),
                meta:{
                    type:"菜单",
                    name:"实收录入",
                    parentMenu:'settlement-center:-'
                }
            },
            {
                path: '/settlementCenter/customerCollection',
                name: '客户收款',
                component: () => import('@/view/settlementCenter/collection/customerCollection.vue'),
                meta:{
                    type:"菜单",
                    name:"客户收款",
                    parentMenu:'settlement-center:-'
                }
            },
            {
                path: '/settlementCenter/collectionClaim',
                name: '实收认领',
                component: () => import('@/view/settlementCenter/collection/collectionClaim.vue'),
                meta:{
                    type:"菜单",
                    name:"实收认领",
                    parentMenu:'settlement-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '结算管理',
        component: Main,
        children: [
            {
                path: '/settlementCenter/lawyerSettlement',
                name: '律师结算',
                component: () => import('@/view/settlementCenter/settlement/lawyerSettlement.vue'),
                meta:{
                    type:"菜单",
                    name:"律师结算",
                    parentMenu:'settlement-center:-'
                }
            },
            {
                path: '/settlementCenter/compensationSettlement',
                name: '客户赔偿款结算',
                component: () => import('@/view/settlementCenter/settlement/compensationSettlement.vue'),
                meta:{
                    type:"菜单",
                    name:"客户赔偿款结算",
                    parentMenu:'settlement-center:-'
                }
            },
            {
                path: '/settlementCenter/agencyFeeSettlement',
                name: '客户代理费结算',
                component: () => import('@/view/settlementCenter/settlement/agencyFeeSettlement.vue'),
                meta:{
                    type:"菜单",
                    name:"客户代理费结算",
                    parentMenu:'settlement-center:-'
                }
            }
        ]
    },
    {
        path: '/',
        name: '付款管理',
        component: Main,
        children: [
            {
                path: '/settlementCenter/paymentApplication',
                name: '付款申请',
                component: () => import('@/view/settlementCenter/payment/paymentApplication.vue'),
                meta:{
                    type:"菜单",
                    name:"付款申请",
                    parentMenu:'settlement-center:-'
                }
            },
            {
                path: '/settlementCenter/financialPayment',
                name: '财务付款',
                component: () => import('@/view/settlementCenter/payment/financialPayment.vue'),
                meta:{
                    type:"菜单",
                    name:"财务付款",
                    parentMenu:'settlement-center:-'
                }
            }
        ]
    },
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
