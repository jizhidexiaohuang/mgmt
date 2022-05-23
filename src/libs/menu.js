const menuJson = {
    //市场中心
    relationList: [
        {
            name: "客户线索",
            hasChildList: false,
            href: "/relationship/customerClue",
            menuLogo: "icon-customer-01",
        },
        {
            name: "客户管理",
            hasChildList: true,
            href: "",
            menuLogo: "icon-managements-01",
            childList: [
                {
                    name: "负责客户",
                    hasChildList: false,
                    href: "/relationship/myClient",
                    menuLogo: "",
                },{
                    name: "协作客户",
                    hasChildList: false,
                    href: "/relationship/collaborativeCustomers",
                    menuLogo: "",
                },{
                    name: "全部客户",
                    hasChildList: false,
                    href: "/relationship/allCustomers",
                    menuLogo: "",
                }
            ]
        }, 
        {
            name: "渠道管理",
            hasChildList: true,
            href: "",
            menuLogo: "icon-channel-01",
            childList:[
                {
                    name: "负责渠道",
                    hasChildList: false,
                    href: "/relationship/myChannel",
                    menuLogo: "",
                },{
                    name: "协作渠道",
                    hasChildList: false,
                    href: "/relationship/cooperativeChannels",
                    menuLogo: "",
                },{
                    name: "全部渠道",
                    hasChildList: false,
                    href: "/relationship/allChannels",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "商机立项",
            hasChildList: true,
            href: "",
            menuLogo: "icon-transaction-01",
            childList:[
                {
                    name: "商机立项",
                    hasChildList: false,
                    href: "/relationship/projectApplication",
                    menuLogo: "",
                },{
                    name: "商机审核",
                    hasChildList: false,
                    href: "/relationship/projectReview",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "合同模板",
            hasChildList: false,
            href: "/relationship/contractTemplate",
            menuLogo: "icon-template-01",
        },
        {
            name: "合同管理",
            hasChildList: true,
            href: "",
            menuLogo: "icon-management-01",
            childList:[
                {
                    name: "我的合同",
                    hasChildList: false,
                    href: "/contract/myContract",
                    menuLogo: "",
                }, 
                {
                    name: "合同审核",
                    hasChildList: false,
                    href: "/contract/contractReview",
                    menuLogo: "",
                },
                {
                    name: "合同签字",
                    hasChildList: false,
                    href: "/contract/contractSignature",
                    menuLogo: "",
                },
                {
                    name: "全部合同",
                    hasChildList: false,
                    href: "/contract/allContract",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "行业管理",
            hasChildList: false,
            href: "/relationship/industryManage",
            menuLogo: "icon-template-01",
        },
        {
            name: "案例管理",
            hasChildList: false,
            href: "/relationship/caseManage",
            menuLogo: "icon-template-01",
        }
    ],
    //产品中心
    productList: [
        {
            name: "产品管理",
            hasChildList: false,
            href: "/product/manage",
            menuLogo: "icon-project-02",
        },
        {
            name: "客户协议",
            hasChildList: false,
            href: "/agreement/cust",
            menuLogo: "icon-agreement-01",
        }
    ],
    //团队合作
    cooperationTeamList: [
        {
            name: "律师团队",
            hasChildList: true,
            href: "",
            menuLogo: "icon-lawyer-01",
            childList: [
                {
                    name: "律师审核",
                    hasChildList: false,
                    href: "/cooperationTeam/lawyer/examine",
                    menuLogo: "",
                },
                {
                    name: "律师管理",
                    hasChildList: false,
                    href: "/cooperationTeam/lawyer/manage",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "调查团队",
            hasChildList: true,
            href: "",
            menuLogo: "icon-investigation-01",
            childList: [
                {
                    name: "调查审核",
                    hasChildList: false,
                    href: "/cooperationTeam/investigator/examine",
                    menuLogo: "",
                },
                {
                    name: "调查管理",
                    hasChildList: false,
                    href: "/cooperationTeam/investigator/manage",
                    menuLogo: "",
                }
            ]
        },
    ],
    //项目管理
    projectList: [
        {
            name: "项目",
            hasChildList: true,
            href: "",
            menuLogo: "icon-project-03",
            childList:[
                {
                    name: "我负责的",
                    hasChildList: false,
                    href: "/project/myManage",
                    menuLogo: "",
                },
                {
                    name: "我协作的",
                    hasChildList: false,
                    href: "/project/collaborate",
                    menuLogo: "",
                },
                {
                    name: "全部",
                    hasChildList: false,
                    href: "/project/allProjects",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "律师协议",
            hasChildList: true,
            href: "",
            menuLogo: "icon-agreement-02",
            childList:[
                {
                    name: "我管理的",
                    hasChildList: false,
                    href: "/agreement/lawyer/my",
                    menuLogo: "",
                },
                {
                    name: "待审核",
                    hasChildList: false,
                    href: "/agreement/lawyer/pending",
                    menuLogo: "",
                },
                {
                    name: "全部",
                    hasChildList: false,
                    href: "/agreement/lawyer",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "调查协议配置",
            hasChildList: false,
            href: "/config/investigator",
            menuLogo: "icon-agreement-04",
        },
        {
            name: "区域等级配置",
            hasChildList: false,
            href: "/config/region",
            menuLogo: "icon-agreement-04",
        },
        {
            name: "调查协议",
            hasChildList: true,
            href: "",
            menuLogo: "icon-agreement-03",
            childList:[
                {
                    name: "我管理的",
                    hasChildList: false,
                    href: "/agreement/investigator/my",
                    menuLogo: "",
                },
                {
                    name: "待审核",
                    hasChildList: false,
                    href: "/agreement/investigator/pending",
                    menuLogo: "",
                },
                {
                    name: "全部",
                    hasChildList: false,
                    href: "/agreement/investigator",
                    menuLogo: "",
                }
            ]
        }
    ],
    //线索管理
    clueList: [
        {
            name: "线索任务",
            hasChildList: true,
            href: "",
            menuLogo: "icon-task-02",
            childList:[
                {
                    name: "我管理任务",
                    hasChildList: false,
                    href: "/task/myTask",
                    menuLogo: "",
                },
                {
                    name: "待审核任务",
                    hasChildList: false,
                    href: "/task/auditTask",
                    menuLogo: "",
                },
                {
                    name: "被拒绝任务",
                    hasChildList: false,
                    href: "/task/rejectTask",
                    menuLogo: "",
                },
                {
                    name: "全部任务",
                    hasChildList: false,
                    href: "/task/allTask",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "线索结果",
            hasChildList: true,
            href: "",
            menuLogo: "icon-clue-01",
            childList:[
                {
                    name: "我管理的-待审核",
                    hasChildList: false,
                    href: "/clue/myManage/reviewedClue",
                    menuLogo: "",
                },
                {
                    name: "我管理的-全部",
                    hasChildList: false,
                    href: "/clue/myManage/allClues",
                    menuLogo: "",
                },
                {
                    name: "全部线索",
                    hasChildList: false,
                    href: "/clue/allClues",
                    menuLogo: "",
                }
            ]
        }
    ],
    //系统
    systemList: [
        {
            name: "组织管理",
            hasChildList: false,
            href: "/system/memberManage",
            menuLogo: "icon-organization-01",
        }, 
        {
            name: "角色管理",
            hasChildList: false,
            href: "/system/positionManage",
            menuLogo: "icon-authority-01",
        },
        {
            name:"定时服务",
            hasChildList:false,
            href:"/system/timeService",
            menuLogo:"icon-timer-01"
        },
        {
            name:"公告发布",
            hasChildList:false,
            href:"/system/announcement",
            menuLogo:"ios-notifications"
        },
        {
            name: "开发组件测试页面",
            hasChildList: false,
            href: "/system/test",
            menuLogo: "ios-contacts",
        }
    ],
    //案件管理
    caseList:[
        {
            name: "我管理的",
            hasChildList: true,
            matchName:"我管理的", //我管理的
            href: "",
            menuLogo: "icon-case-02",
            childList: [
                {
                    name: "民事案件", //民事案件
                    hasChildList: false,
                    href: "/case/civilCase",
                    menuLogo: "",
                },{
                    name: "行政案件", //行政案件
                    hasChildList: false,
                    href: "/case/administrativeCase",
                    menuLogo: "",
                },{
                    name: "刑事案件", //刑事案件
                    hasChildList: false,
                    href: "/case/criminalCase",
                    menuLogo: "",
                }
            ]
        },
        {
            name: "全部案件",
            hasChildList: false,
            href: "/case/allCases",
            menuLogo: "icon-case-03",
        },
        {
            name: "材料清单",//材料清单
            hasChildList: false,
            href: "/case/materialList",
            menuLogo: "icon-case-03",
        }
    ],
    tradingCenterList:[
        {
            name: "回购案件",
            hasChildList: true,
            matchName:"回购案件",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "全部回购案件",
                    hasChildList: false,
                    href: "/tradingCenter/buyBackInFullCase",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "待审核案件",
                    hasChildList: false,
                    href: "/tradingCenter/penddingCase",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "回购结算",
            hasChildList: true,
            matchName:"回购结算",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "全部结算案件",
                    hasChildList: false,
                    href: "/tradingCenter/settlementCase",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "待审核结算",
                    hasChildList: false,
                    href: "/tradingCenter/approvedSettlementCase",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "已通过",
                    hasChildList: false,
                    href: "/tradingCenter/reviewedCase",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "回购退款申请",
            hasChildList: false,
            href: "/tradingCenter/refundApplication",
            menuLogo: "icon-agreement-04",
        },
        {
            name: "回购付款列表",
            hasChildList: false,
            href: "/tradingCenter/paymentList",
            menuLogo: "icon-agreement-04",
        },
        {
            name:'邮寄列表',
            hasChildList:false,
            matchName:'邮寄列表',
            href:'/tradingCenter/mailingList',
            menuLogo:'icon-case-02'
        },
        {
            name: "出售案件",
            hasChildList: true,
            matchName:"出售案件",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "待出售案件",
                    hasChildList: false,
                    href: "/tradingCenter/casesForSale",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "全部出售案件",
                    hasChildList: false,
                    href: "/tradingCenter/allSaleCases",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "案件包",
            hasChildList: true,
            matchName:"案件包",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "公共包",
                    hasChildList: false,
                    href: "/tradingCenter/publicPackage",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "指派包",
                    hasChildList: false,
                    href: "/tradingCenter/assignPackage",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "订单管理",
            hasChildList: true,
            matchName:"订单管理",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "进行中订单",
                    hasChildList: false,
                    href: "/tradingCenter/ongoingOrder",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "已完成订单",
                    hasChildList: false,
                    href: "/tradingCenter/completedOrder",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "全部订单",
                    hasChildList: false,
                    href: "/tradingCenter/allOrder",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "附加订单",
                    hasChildList: false,
                    href: "/tradingCenter/additionalOrder",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "退回管理",
            hasChildList: true,
            matchName:"退回管理",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "退回记录",
                    hasChildList: false,
                    href: "/tradingCenter/returnRecord",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "退款记录",
                    hasChildList: false,
                    href: "/tradingCenter/refundRecord",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "办案区域",
            hasChildList: false,
            href: "/tradingCenter/caseArea",
            menuLogo: "icon-agreement-04",
        }
    ],
    settlementCenterList:[
        {
            name: "收款管理",
            hasChildList: true,
            matchName:"收款管理",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "实收录入",
                    hasChildList: false,
                    href: "/settlementCenter/realIncome",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "客户收款",
                    hasChildList: false,
                    href: "/settlementCenter/customerCollection",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "实收认领",
                    hasChildList: false,
                    href: "/settlementCenter/collectionClaim",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "结算管理",
            hasChildList: true,
            matchName:"结算管理",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "律师结算",
                    hasChildList: false,
                    href: "/settlementCenter/lawyerSettlement",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "客户赔偿款结算",
                    hasChildList: false,
                    href: "/settlementCenter/compensationSettlement",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "客户代理费结算",
                    hasChildList: false,
                    href: "/settlementCenter/agencyFeeSettlement",
                    menuLogo: "icon-agreement-04",
                }
            ]
        },
        {
            name: "付款管理",
            hasChildList: true,
            matchName:"付款管理",
            href: "",
            menuLogo: "icon-case-02",
            childList:[
                {
                    name: "付款申请",
                    hasChildList: false,
                    href: "/settlementCenter/paymentApplication",
                    menuLogo: "icon-agreement-04",
                },
                {
                    name: "财务付款",
                    hasChildList: false,
                    href: "/settlementCenter/financialPayment",
                    menuLogo: "icon-agreement-04",
                }
            ]
        }
    ]
  }

  export default {
    menuJson: menuJson
  }