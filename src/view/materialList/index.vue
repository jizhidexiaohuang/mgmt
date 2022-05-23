<template>
    <div class="have-drawer-style">
        <div v-if="!infoCtrl" class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <!-- 筛选框 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="案件编号/清单编号/对方当事人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click.stop="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                申请时间
                            </Col>
                            <Col span="18">
                                <DatePicker type="daterange" v-model="applicationTime" @on-change="getTime" split-panels placeholder="请选择申请时间" style="width: 190px"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                项目名称
                            </Col>
                            <Col span="18">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                律师团队
                            </Col>
                            <Col span="18">
                                <mySelect ref="applicantSelect"
                                    :path="'/base/lawyer-teams'"
                                    :keyName="'name'"
                                    :width="190"
                                    placeholder="请选择律师团队"
                                    @getValue="getLawyerTeamsId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" v-if="false">
                            <Col span="6" class="header-common-col">
                                案件类型
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.caseType" placeholder="请选择案件类型" clearable>
                                    <Option v-for="item in caseTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                            <Button type="primary" size="small" @click="reloadTable">确定</Button>
                            <Button size="small" @click="clearConditions">清空</Button>
                        </Row>
                    </div>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="tableData" :loading="tableLoading"></Table>
            </Row>
            <Row style="margin-top:30px;text-align:center;">
                <Page :total="table.totalRecords" show-total
                size="small"
                :current="table.pageNum"
                :page-size-opts="config.pageSizeOpts"
                :page-size="config.pageSize"
                prev-text="上一页" next-text="下一页"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-elevator show-sizer />
            </Row>
        </div>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+this.expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>

        <!-- 新增材料清单 -->
        <materialList-info v-if="infoCtrl" :materialBillId="materialBillId">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
        </materialList-info>

    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import materialListInfo from './materialListInfo.vue';
export default {
    data () {
        return {
            searchBoxCtrl:false,
            tableLoading:false,
            table:{
                recordsTotal:100,
                pageNum:1,
                pageSize:this.config.pageSize
            },
            searchForm:{
                keyword:'',
                projectId:"",
                teamId:"",
                applyStartTime:'',
                applyEndTime:'',
                // caseType:"",
            },
            caseTypeArr:[],
            applicationTime:[],
            columns: [
                {
                    title: '材料清单编号',
                    key: 'code',
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.materialBillId = params.row.id;
                                    this.infoCtrl = true;
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title: '所属项目',
                    key: 'projectName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                {
                    title: '申请类型',
                    key: 'applyTypeName'
                },
                {
                    title: '申请人',
                    key: 'applicant'
                },
                {
                    title: '申请日期',
                    key: 'applyTime'
                },
                {
                    title: '案件数量',
                    key: 'caseNum'
                },
                {
                    title: '审核状态',
                    key: 'programNum',
                    render:(h,params)=>{
                        return h('Tooltip', {
                            props: { placement: 'left' },
                            style:{width:'100%'},
                            class:'textover'
                        }, [
                            h('span',[
                                h('span',{class:'error-color'},params.row.programRejectNum+'/'),
                                h('span',{class:'success-color'},params.row.programPassNum+'/'),
                                h('span',params.row.programNum),
                            ]),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },'被驳回/通过/总数')
                        ])
                    }
                },
                {
                    title: '已回寄数量',
                    key: 'backSentNum'
                },
                {
                    title:'律师邮寄状态',
                    key:'lawyerSendState',
                    render:(h,params)=>{
                        if(params.row.lawyerSendState=='P'){
                            return h('span','待邮寄')
                        }else{
                            return h('span',{
                                class:'global-main-color',
                                style:{
                                    cursor:'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.getExpressMes(params.row.caseMaterialBillSent);
                                    }
                                }
                            },'物流信息')
                        }
                    }
                }
            ],
            tableData: [],
            addCtrl:false,
            logisticsCtrl:false,
            company:'',
            expressNo:'',
            addMailInfoCtrl:false,
            courierCompanyArr:[],
            infoCtrl:false,
            materialBillId:''
        }
    },
    props: [''],
    methods: {
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        //筛选申请人
        getLawyerTeamsId(data){
            this.searchForm.teamId = data.id;
        },
        getData(){
            this.tableLoading = true;
            let url = "/business/case-material-bills";
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize
            };
            Object.assign(ajaxData,this.searchForm);
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code===0){
                    this.tableData = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }else{
                    this.$Message.error(res.message); 
                }
            })
        },
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.teamId = "";
            this.searchForm.projectId = "";
            this.searchForm.caseType = "";
            this.searchForm.applyStartTime = "";
            this.searchForm.applyEndTime = "";
            this.applicationTime = [];
            this.$refs.projectSelect.clearSelected();
            this.$refs.applicantSelect.clearSelected();
            this.reloadTable();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        //获取时间
        getTime(value){
            this.searchForm.applyStartTime = value[0];
            this.searchForm.applyEndTime = value[1];
        },
        //获取物流信息
        getExpressMes(row){
            this.company = row.courierCompany;
            this.expressNo = row.expressNo;
            this.logisticsCtrl = true;
        },
        // 获取字典数据接口
        async getDictionary(){
            this.caseTypeArr = await this.common.getDictionaryItems('case_type');
            this.courierCompanyArr = await this.common.getDictionaryItems('courier_company');
        },
    },
    created(){

    },
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    updated(){

    },
    activated(){
        this.getData();
    },
    components: {
        materialListInfo
    },
    watch: {}
}
</script>
