<template>
    <div>
        <div class="card-style">
            <Row class="header-common-right-box">
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="案件编号" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                项目名称
                            </Col>
                            <Col span="18">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目名称'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                申请团队
                            </Col>
                            <Col span="18">
                                <mySelect ref="applicantSelect"
                                    :path="'/base/lawyer-teams'"
                                    :keyName="'name'"
                                    placeholder="请选择律师团队"
                                    @getValue="getLawyerTeamsId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                是否退款
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.isRefund" clearable>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" v-show="searchForm.isRefund=='1'">
                            <Col span="6" class="header-common-col">
                                退回类型
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.refundType" clearable>
                                    <Option value="P">定金</Option>
                                    <Option value="B">尾款</Option>
                                    <Option value="A">全款</Option>
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
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" 
                    :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="row.auditState=='P'" name="audit">同意</DropdownItem>
                                <DropdownItem v-if="row.auditState=='P'" name="reject">驳回</DropdownItem>
                                <DropdownItem name="info">查看详情</DropdownItem>
                                <DropdownItem v-if="row.auditState=='E'&&row.mailingId&&!row.confirmState" name="mailConfirm">邮寄确认</DropdownItem>
                                <DropdownItem v-if="row.mailingId" name="mailInfo">邮寄详情</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </Table>
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
                    show-sizer show-elevator />
            </Row>
        </div>

        <!-- 退款申请详情 -->
        <Drawer
            v-model="returnCaseCtrl"
            :width="600"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span v-if="operateType!='info'">退回申请审核</span>
                <span v-if="operateType=='info'">退回申请详情</span>
                <Dropdown transfer @on-click="option(recordDetail,$event)" v-if="operateType=='info'" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-if="recordDetail.auditState=='P'" name="audit">同意</DropdownItem>
                        <DropdownItem v-if="recordDetail.auditState=='P'" name="reject">驳回</DropdownItem>
                        <DropdownItem v-if="recordDetail.auditState=='E'&&recordDetail.mailingId&&!recordDetail.confirmState" name="mailConfirm">邮寄确认</DropdownItem>
                        <DropdownItem v-if="recordDetail.mailingId" name="mailInfo">邮寄详情</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <return-case v-if="returnCaseCtrl&&operateType!='info'" :operateType="operateType" :defaultData="recordDetail" @changeEditCtrl="changeCtrl"></return-case>
            <return-info v-if="returnCaseCtrl&&operateType=='info'" :defaultData="recordDetail"></return-info>
        </Drawer>

        <Modal
            v-model="confirmCtrl"
            title="提示"
            :width="300"
            :footer-hide="true">
            <Row style="font-size:14px;">是否确认邮寄已完成</Row>
            <Row style="text-align:center;margin-top:10px;">
                <Button type="primary" @click="confirmMail">确定</Button>
                <Button @click="confirmCtrl=false">取消</Button>
            </Row>
        </Modal>

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="800"
            title="案件详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <case-info v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-info>
        </Drawer>

        <Modal
            v-model="mailingInfoCtrl"
            title="邮寄信息"
            :width="450"
            :footer-hide="true">
            <mail-info :defaultData="mailingInfo" v-if="mailingInfoCtrl"></mail-info>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import returnCase from "./returnCase.vue";
import returnInfo from "./returnInfo.vue";
import expandRow from './expandRow.vue';
import caseInfo from './../buyBack/caseInfo.vue';
import mailInfo from "./mailInfo.vue";
export default {
    data () {
        return {
            styles:styles,
            searchBoxCtrl:false,
            tableLoading:false,
            caseInfoCtrl:false,
            caseDetail:"",
            searchForm:{
                keyword:"",
                teamId:"",
                refundType:"",
                isRefund:"",
            },
            projectStateArr:[],
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                defaultData: params.row.caseSaleRefundList,
                                type:'return'
                            },
                            on:{
                                'checkOrderInfo':(batchId)=>{
                                    this.batchId = batchId;
                                    this.id = '';
                                    this.infoCtrl = true;
                                }
                            }
                        })
                    }
                },
                {
                    title:"退回案件编号",
                    key:"caseCode",
                    width:125,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"所属项目",
                    key:"projectName",
                    render:(h,params)=>{
                        return h('span',{
                            class:["textover"],
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                {
                    title:"当事人",
                    key:"litigants",
                    render:(h,params)=>{
                        return h('span',{
                            class:["textover"],
                            attrs:{
                                title:params.row.litigants
                            },
                        },params.row.litigants)
                    }
                },
                {
                    title:"申请时间",
                    key:"applyTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.applyTime))
                    }
                },
                {
                    title:"申请团队",
                    key:"applyTeamName",
                },
                {
                    title:"所属订单",
                    key:"orderCode",
                    render:(h,params)=>{
                        return h('span',{
                            class:["textover"],
                            attrs:{
                                title:params.row.orderCode
                            },
                        },params.row.orderCode)
                    }
                },
                {
                    title:"退回原因",
                    key:"reasonName",
                    render:(h,params)=>{
                        return h('span',{
                            class:["textover"],
                            attrs:{
                                title:params.row.reasonName
                            },
                        },params.row.reasonName)
                    }
                },
                {
                    title:"审核结果",
                    key:"auditState",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.auditState){
                            case "P": color = "warningColor"; break;
                            case "R": color = "errorColor"; break;
                            case "E": color = "successColor"; break;
                        }
                        if(!params.row.auditState){
                            return h('span','')
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.auditStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.auditStateName)
                    }
                },
                {
                    title:"已支付金额",
                    key:"paymentAmount",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.paymentAmount))
                    }
                },
                {
                    title:"退款金额",
                    key:"returnAmount",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.returnAmount))
                    }
                },
                {
                    title:"退款类型",
                    key:"refundTypeName"
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            id:"",
            returnCaseCtrl:false,
            recordDetail:"",
            operateType:"",
            confirmCtrl:false,
            mailingInfoCtrl:false,
            mailingInfo:""
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/settlement/case-sale-returns';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize
            }
            Object.assign(ajaxData,this.searchForm);
            if(ajaxData.isRefund){
                ajaxData.isRefund = ajaxData.isRefund=='1'?true:false;
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.tableLoading = false;
                    this.data = res.data.records;
                    this.data.forEach((item,index)=>{
                        if(item.caseSaleRefundList&&item.caseSaleRefundList.length==0){
                            item._disableExpand = true;
                        }
                    })
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        },
        getDetail(){
            let url = `/settlement/case-sale-return/${this.id}/detail`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.recordDetail = res.data;
                    this.returnCaseCtrl = true;
                }
            })
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        //筛选申请团队
        getLawyerTeamsId(data){
            this.searchForm.teamId = data.id;
        },
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.projectSelect.clearSelected();
            this.$refs.applicantSelect.clearSelected();
            this.reloadTable();
        },
        getMailInfo(id){
            let url = `/settlement/order-mailing/${id}/detail`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.mailingInfo = res.data || "";
                    this.mailingInfoCtrl = true;
                }
            })
        },
        option(row,name){
            this.id = row.id;
            this.operateType = name;
            switch(name){
                case "audit":
                    this.getDetail();
                    break;
                case "reject":
                    this.getDetail();
                    break;
                case "info":
                    this.getDetail();
                    break;
                case "mailConfirm":
                    this.confirmCtrl = true;
                    break;
                case "mailInfo":
                    this.getMailInfo(row.mailingId);
                    break;
            }
        },
        changeCtrl(reload){
            this.returnCaseCtrl = false;
            if(reload){
                this.reloadTable();
            }
        },
        confirmMail(){
            let url = `/settlement/case-sale-refund/${this.id}/confirm`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功!");
                    this.reloadTable();
                    this.confirmCtrl = false;
                }else{  
                    this.$Message.error(res.message);
                }
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    updated(){},
    components: {
        returnCase,
        returnInfo,
        caseInfo,
        mailInfo
    },
    watch: {}
}
</script>
<style>
 
</style>
