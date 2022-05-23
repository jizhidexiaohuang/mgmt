<template>
    <div class="case-detail">
        <div class="back-btn">
            <Button @click="goBack">返回</Button>
        </div>
        <div class="case-info">
            <h5 class="case-number">[P201709150013] 华为HUAWEI商标专用权维权（店招）</h5>
            <Row>
                <Col span="6" class="prodetail-header">分组：萌力星球</Col>
                <Col span="6" class="prodetail-header">创建人：管理员</Col>
                <Col span="6" class="prodetail-header">项目状态：进行中</Col>
                <Col span="6" class="prodetail-header">任务周期：2017/07/11 - 2018/08/02</Col>
                <Col span="6" class="prodetail-header">客户：厦门萌力星球网络有限公司</Col>
                <Col span="6" class="prodetail-header">维权档案：萌力星球维权档案</Col>
                <Col span="6" class="prodetail-header">负责人：张伟</Col>
                <Col span="6" class="prodetail-header">协作人：江巾平, 管理员</Col>
                <!-- <Col span="6"><span class="case-approver">安盾审批人：江巾平</span>
                    <Tooltip content="55458855455" theme="light">
                        <i class="icon icon-qq-01"></i>
                    </Tooltip><Tooltip content="jiangjinping" theme="light">
                        <i class="icon icon-wechat-01"></i>
                    </Tooltip>
                    <Tooltip content="jiangjinping@andunip.com" theme="light">
                        <i class="icon icon-email-01"></i>
                    </Tooltip>
                    <Tooltip content="15989096637" theme="light">
                        <i class="icon icon-phone-01"></i>
                    </Tooltip>
                </Col> -->
                <Col span="24">项目备注：厦门萌力星球网络有限公司厦门萌力星球网络有限公司厦门萌力星球网络有限公司厦门萌力星球网络有限公司厦门萌力星球网络有限公司</Col>
            </Row>
        </div>
        <!-- <Tabs value="name1" :animated="false">
            <TabPane label="详情" name="name1">
                <case-info style="padding:15px 0px 0px 35px;"></case-info>
            </TabPane>
            <TabPane label="线索详情" name="name2">
                <clue-result style="padding:15px 0px 0px 35px;"></clue-result>
            </TabPane>
            <TabPane label="对方当事人" name="name3">
                <party></party>
            </TabPane>
            <TabPane label="进程" name="name4">
                <case-process></case-process>
            </TabPane>
            <TabPane label="案件文档" name="name5">
                <case-document></case-document>
            </TabPane>
            <TabPane label="案件日志" name="name6">
                <case-log></case-log>
            </TabPane>
        </Tabs> -->
        <Row>
            <ul class="tabs-bar clearfix">
                <li :class="[tabsType==='one'?'active':'','flexWidth']" @click="tabsType='one'">任务统计</li>
                <li :class="[tabsType==='two'?'active':'','flexWidth']" @click="tabsType='two'">任务列表</li>
                <li :class="[tabsType==='three'?'active':'','flexWidth']" @click="tabsType='three'">项目材料</li>
            </ul>
        </Row>
        <Row v-if="tabsType==='one'" class="project-detail-content">
            <Row class="project-detail-outside">
                <Col span="6" class="project-detail-col">
                    <h1 style="color:#f36a5c">0%</h1>
                    <p>线索结果通过率</p>
                </Col>
                <Col span="6" class="project-detail-col">
                    <h1 style="color:#4988eb">0%</h1>
                    <p>案件转换率</p>
                </Col>
                <Col span="6" class="project-detail-col">
                    <h1 style="color:#7cd59b">0%</h1>
                    <p>立案率</p>
                </Col>
                <Col span="6" class="project-detail-col">
                    <h1 style="color:#ff9d0a">0%</h1>
                    <p>结案率</p>
                </Col>
            </Row>
        </Row>
        <Row v-if="tabsType==='two'" class="project-detail-content">
            <Row class="project-detail-outside table-project">
                <p>侵权发现</p>
                <Table :columns="discoverColumns" :data="discoverData" :show-header="false"></Table>
                <Row class="page-box">
                    <Page
                        :total="table.totalRecords" show-total 
                        :current="table.currentPage"
                        :page-size="table.pageSize"
                        show-elevator
                        show-total
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                    ></Page>
                </Row>
            </Row>
            <Row class="project-detail-outside table-project">
                <p>案件列表</p>
                <Table :columns="listColumns" :data="listData" :show-header="false"></Table>
                <Row class="page-box">
                    <Page
                        :total="table.totalRecords" show-total 
                        :current="table.currentPage"
                        :page-size="table.pageSize"
                        show-elevator
                        show-total
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                    ></Page>
                </Row>
            </Row>
        </Row>
        <Row v-if="tabsType==='three'" class="project-detail-content">
            <Row class="case-document">
                <!-- <case-document :infoId="avtiveid"></case-document>             -->
            </Row>
        </Row>
    </div>
</template>
<script>
// import caseInfo from './caseInfo.vue';
// import clueResult from './clueResult.vue';
// import party from './party.vue';
// import caseLog from './caseLog.vue';
// import caseDocument from './caseDocument.vue';
// import caseProcess from './caseProcess.vue';
export default {
    data () {
        return {
            avtiveid:"",
            tabsType:"one",
            discoverColumns:[
                {
                    key:"data1"
                },
                {
                    key:"data2"
                },
                {
                    key:"data3"
                }
            ],
            discoverData:[
                {
                    data1:"富乐思“钻石音箱”外观设计专利维权  - 侵权线索调查",
                    data2:"全国",
                    data3:"夏晶",
                }
            ],
            listColumns:[
                {
                    key:"data1"
                },
                {
                    key:"data2"
                },
                {
                    key:"data3"
                }
            ],
            listData:[
                {
                    data1:"A201811150516",
                    data2:"武汉瑞嘉玺电子商务有限公司",
                    data3:"罗德江团队"
                },
                {
                    data1:"A201811150516",
                    data2:"武汉瑞嘉玺电子商务有限公司",
                    data3:"罗德江团队"
                },
                {
                    data1:"A201811150516",
                    data2:"武汉瑞嘉玺电子商务有限公司",
                    data3:"罗德江团队"
                },
                {
                    data1:"A201811150516",
                    data2:"武汉瑞嘉玺电子商务有限公司",
                    data3:"罗德江团队"
                },
                {
                    data1:"A201811150516",
                    data2:"武汉瑞嘉玺电子商务有限公司",
                    data3:"罗德江团队"
                },
            ],
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                currentPage:1,
                totalRecords:1
            },
        }   
    },
    props: [''],

    methods: {
        goBack(){
            this.$router.go(-1)
        },
        changePage(){},
        changePageSize(){}
    },
    created(){

    },
    beforeMount(){
        this.avtiveid = this.$route.params.id;
    },
    mounted(){

    },
    updated(){

    },
    components: {
        // clueResult,
        // party,
        // caseLog,
        caseDocument,
        // caseProcess,
        // caseInfo
    },
    watch: {

    }
}
</script>
<style scoped lang="sass">
@import  './projectDetail'
</style>
