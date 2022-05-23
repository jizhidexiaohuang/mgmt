<template>
    <div class="material-form" v-if="detail">
        <!-- 预览文件 -->
        <preview-file ref="perviewFile"></preview-file>

        <div class="card-style">
            <Row class="detail-header">
                <span>材料清单明细</span>
            </Row>
            <div class="more-options" slot="more-options">
                <Dropdown @on-click="option(detail,$event)" >
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-permission="['case:material-bill:manage:-']" :disabled="mailIdList.length<=0" name="addMailInfo">添加邮寄信息</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <slot name='close-icon'></slot>
            <!-- 预览的头部 -->
            <Row class="preview">
                <div class="material-info">
                    <strong>{{detail.projectName}}</strong>
                    <span class="left-label"></span>
                    <span class="right-content">
                        本清单共包含<span class="warning-color">{{detail.caseNum}}</span>个案件，
                        待审：<span class="warning-color">{{detail.beAuditedNum}}</span>个，
                        被驳回：<span class="error-color">{{detail.rejectNum}}</span>个，
                        已通过<span class="success-color">{{detail.auditNum	}}</span>个</span>
                        <span class="global-main-color express-msg" v-if="detail.lawyerSendState=='E'" @click="getExpressMes(detail)">物流信息</span>
                </div>
                <p>
                    <span class="left-label">清单编号：</span><span class="right-content">{{detail.code}}</span>
                    <span class="left-label">申请人：</span><span class="right-content">{{detail.applicant}}</span>
                    <span class="left-label">联系电话：</span><span class="right-content">{{detail.lawyerMobile}}</span>
                    <span class="left-label">地址：</span><span class="right-content">{{detail.lawyerAddress}}</span>
                </p>
            </Row>
            <!-- 四个表格 -->
            <Row style="margin-top:10px;" id="demo">
                <Row class="table-row" v-if="programDetailList.length!=0">
                    <Row class="detail-title">
                        <span class="main-title">诉讼方案阶段审核/盖章材料</span>
                        <Button style="float:right;" v-permission="['case:material-bill:manage:-']" :disabled="prosecuteListId.length<=0" @click="batchAudit">批量审核</Button>
                        <span class="text-tip">注：仅诉讼方案阶段的材料需要审核</span>
                    </Row>
                    <Row style="border:1px solid #dcdee2;border-bottom:0;">
                        <checkbox-table :columns="prosecuteColumns" :data="programDetailList" :keyId="'caseId'" 
                            :loading="tableLoading" @refreshList="getIdList($event,'prosecute')">
                            <div slot="more-actions" slot-scope="{ row }">
                                <Dropdown @on-click="option(row,$event)" v-if="row.managerSendState=='E'||row.auditState=='P'">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-more" size="20"/>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-if="row.managerSendState=='E'" name="checkLogistics">查看物流</DropdownItem>
                                        <DropdownItem v-permission="['case:material-bill:manage:-']" v-if="row.auditState=='P'" name="agree">通过</DropdownItem>
                                        <DropdownItem v-permission="['case:material-bill:manage:-']" v-if="row.auditState=='P'" name="reject">驳回</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </checkbox-table>
                    </Row>
                </Row>
                <Row class="table-row" v-if="selectOrNo(detail.courtTrialDetailList,'managerSendState','E').length!=0">
                    <Row class="detail-title">
                        <span class="main-title">庭审阶段盖章材料</span>
                    </Row>
                    <Row style="border:1px solid #dcdee2;border-bottom:0;">
                        <checkbox-table :columns="trailColumns" :data="selectOrNo(detail.courtTrialDetailList,'managerSendState','E')" 
                            :loading="tableLoading" @refreshList="getIdList($event,'trail')"></checkbox-table>
                    </Row>
                </Row>
                <Row class="table-row" v-if="selectOrNo(detail.enforceDetailList,'managerSendState','E').length!=0">
                    <Row class="detail-title">
                        <span class="main-title">执行阶段审核/盖章材料</span>
                    </Row>
                    <Row style="border:1px solid #dcdee2;border-bottom:0;">
                        <checkbox-table :columns="carryColumns" :data="selectOrNo(detail.enforceDetailList,'managerSendState','E')" 
                            :loading="tableLoading" @refreshList="getIdList($event,'carry')"></checkbox-table>
                    </Row>
                </Row>
                <Row class="table-row" v-if="selectOrNo(detail.settlementDetailList,'managerSendState','E').length!=0">
                    <Row class="detail-title">
                        <span class="main-title">领款阶段盖章材料</span>
                    </Row>
                    <Row style="border:1px solid #dcdee2;border-bottom:0;">
                        <checkbox-table :columns="paymentColumns" :data="selectOrNo(detail.settlementDetailList,'managerSendState','E')" 
                            :loading="tableLoading" @refreshList="getIdList($event,'payment')"></checkbox-table>
                    </Row>
                </Row>
            </Row>
        </div>

        <!-- 邮寄信息 -->
        <Modal
            v-model="addMailInfoCtrl"
            title="新建邮寄信息"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="收件人" prop="recipient">
                    <Input v-model="formValidate.recipient" placeholder="请填写收件人的名称"></Input>
                </FormItem>
                <FormItem label="寄件时间" prop="sentTime">
                    <DatePicker :value="formValidate.sentTime" @on-change="getSentTime" style="width:100%" type="date" placeholder="请填写寄件时间"></DatePicker>
                </FormItem>
                <FormItem label="快递公司" prop="courierCompany">
                    <Select v-model="formValidate.courierCompany" placeholder="请选择快递公司">
                        <Option v-for="item in courierCompanyArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="快递单号" prop="expressNo">
                    <Input v-model="formValidate.expressNo" placeholder="请填写快递单号"></Input>
                </FormItem>
                <Row style="text-align:center;">
                    <Button type="primary" :disabled="isSubmit" @click="addMailingInformation('formValidate')">确认</Button>
                    <Button @click="addMailInfoCtrl=false;" style="margin-left: 8px">取消</Button>
                </Row>
            </Form>
        </Modal>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+this.expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>

        <!-- 批量审核 -->
        <Modal
            v-model="auditCtrl"
            :title="auditTitle"
            :width="350"
            :footer-hide="true">
            <Form ref="formData" :model="formData" :label-width="100">
                <Row class="modal-tips" v-if="formData.auditState=='E'&&(!batchCtrl)">请问是否{{auditTitle}}此案件的诉讼方案？</Row>
                <FormItem label="批量审核" prop="auditState" v-if="batchCtrl">
                    <RadioGroup v-model="formData.auditState">
                        <Radio label="E">全部通过</Radio>
                        <Radio label="R">全部驳回</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核备注" prop="auditRemark" v-if="formData.auditState=='R'"
                    :rules="[{required:true,message:'请填写审核备注',trigger:'blur'}]">
                    <Input v-model.trim="formData.auditRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请填写审核备注"></Input>
                </FormItem>
                <Row style="text-align:center;">
                    <Button type="primary" :disabled="isSubmit" @click="submitAudit('formData')">确认</Button>
                    <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
                </Row>
            </Form>
        </Modal>


        <!-- 添加收据信息 -->
        <Modal
            v-model="activeCtrl"
            title="收据信息"
            :width="450"
            :footer-hide="true">
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">收款时间：</Col><Col span="16" class="right-content">{{activeData.recieveTime}}</Col></Row>
                <Row><Col span="5" class="left-label">收款单位名称：</Col><Col span="16" class="right-content">{{activeData.payee}}</Col></Row>
                <Row><Col span="5" class="left-label">收款案件编号：</Col><Col span="16" class="right-content">{{activeData.materialBillId}}</Col></Row>
                <Row><Col span="5" class="left-label">收款金额：</Col><Col span="16" class="right-content">{{this.common.formateNumber(activeData.amount)}}</Col></Row>
            </Row>
        </Modal>

        <!-- 案件详情 -->
        <case-detail v-if="caseDetailInfo" :style="{top:'0px'}" :caseDetail="caseDetail" :optionsCtrl="false">
            <div class="close-icon" slot="close-icon" @click="caseDetailInfo=false;"><Icon type="md-close" /></div>
        </case-detail>
    </div>
</template>
<script>
import caseDetail from './../case/caseDetail.vue';
export default {
    data () {
        return {
            tabActive:'prosecute',
            detail:'',
            searchForm:{
                projectId:'',
                caseType:''
            },
            caseTypeArr:[],
            activeCtrl:false,
            activeData:"",
            addMailInfoCtrl:false,
            formValidate:{
                recipient:"",
                sentTime:"",
                courierCompany:'',
                expressNo:''
            },
            ruleValidate:{
                recipient:[{ required: true, message: '收件人不能为空', trigger: 'change' }],
                sentTime:[{ required: true, message: '寄送时间不能为空', trigger: 'change' }],
                courierCompany:[{ required: true, message: '快递公司不能为空', trigger: 'change' }],
                expressNo:[
                    { required: true, message: '快递单号不能为空', trigger: 'blur' },
                    { max:16, message: '长度不能超过16个字符', trigger: 'blur' }
                ]
            },
            courierCompanyArr:[],
            isSubmit:false,
            logisticsCtrl:false,
            expressNo:'',
            company:'',
            prosecuteColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:120,
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover",'global-mian-color'],
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
                    title:"对方当事人",
                    key:"litigantNames",
                    render:(h,params)=>{
                        return h('span',
                            {
                                class:'textover',
                                attrs:{
                                    title:params.row.litigantNames
                                }
                            },
                        params.row.litigantNames)
                    }
                },
                {
                    title:"诉讼标的",
                    key:"amount",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.amount))
                    }
                },
                {
                    title:"侵权产品",
                    key:"tortProduct",
                },
                {
                    title:"管辖法院",
                    key:"court",
                    render:(h,params)=>{
                        return h('span',
                            { 
                                class:'textover' ,
                                attrs:{
                                    title:params.row.court
                                }
                            },params.row.court);
                    }
                },
                {
                    title:"授权委托书",
                    key:"authorizationLetterNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'authorizationLetterNum','authorizationLetterAttachment');
                    }
                },
                {
                    title:"起诉状",
                    key:"indictmentNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'indictmentNum','indictmentAttachment');
                    }
                },
                {
                    title:"主体材料",
                    key:"mainMaterialNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'mainMaterialNum','mainMaterialAttachment');
                    }
                },
                {
                    title:"审核状态",
                    key:"auditStateName",
                    render:(h,params)=>{
                        return h('Tag',{
                            attrs:{
                                color:params.row.auditState=='P'?'warning':(params.row.auditState=='E'?'success':'error')
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.auditStateName)
                    }
                },
                {
                    title:'操作',
                    slot:'action'
                }
            ],
            trailColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:120,
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover",'global-mian-color'],
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
                    title:'案件负责人',
                    key:'caseManager'
                },
                {
                    title:"管辖法院",
                    key:"court",
                    render:(h,params)=>{
                        return h('span',
                            { 
                                class:'textover' ,
                                attrs:{
                                    title:params.row.court
                                }
                            },params.row.court);
                    }
                },
                {
                    title:"当前代理律师",
                    key:"lawyer",
                },
                {
                    title:"律所名称",
                    key:"lawOffice",
                },
                // {
                //     title:"变更后代理律师",
                //     key:"court",
                // },
                // {
                //     title:"变更后律所名称",
                //     key:"court",
                // },
                {
                    title:"变更代理人申请书",
                    key:"agentChangeNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'agentChangeNum','agentChangeAttachment');
                    }
                },
                {
                    title:'邮寄状态',
                    key:'action',
                    render:(h,params)=>{
                        if(params.row.managerSendState=='P'){
                            return h('span','待邮寄')
                        }else{
                            return h('span',{
                                class:'global-main-color',
                                style:{
                                    cursor:'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.getExpressMes(params.row);
                                    }
                                }
                            },'查看物流')
                        }
                    }
                }
            ],
            carryColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:120,
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover",'global-mian-color'],
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
                    title:'案件负责人',
                    key:'caseManager'
                },
                {
                    title:"执行标的",
                    key:"amount",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.amount))
                    }
                },
                {
                    title:"管辖法院",
                    key:"court",
                    render:(h,params)=>{
                        return h('span',
                            { 
                                class:'textover' ,
                                attrs:{
                                    title:params.row.court
                                }
                            },params.row.court);
                    }
                },
                {
                    title:"授权代理书",
                    key:"authorizationAgentNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'authorizationAgentNum','authorizationAgentAttachment');
                    }
                },
                {
                    title:"执行申请书",
                    key:"enforceApplyNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'enforceApplyNum','enforceApplyAttachment');
                    }
                },
                {
                    title:'邮寄状态',
                    key:'action',
                    render:(h,params)=>{
                        if(params.row.managerSendState=='P'){
                            return h('span','待邮寄')
                        }else{
                            return h('span',{
                                class:'global-main-color',
                                style:{
                                    cursor:'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.getExpressMes(params.row);
                                    }
                                }
                            },'查看物流')
                        }
                    }
                }
            ],
            paymentColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover",'global-mian-color'],
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
                    title:'案件负责人',
                    key:'caseManager'
                },
                {
                    title:"退费申请书",
                    key:"returnFeeNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'returnFeeNum','returnFeeAttachment');
                    }
                },
                {
                    title:"账户信息确认书",
                    key:"accountConfirmNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'accountConfirmNum','accountConfirmAttachment');
                    }
                },
                {
                    title:"授权代理书",
                    key:"authorizationAgentReceiveNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'authorizationAgentReceiveNum','authorizationAgentReceiveAttachment');
                    }
                },
                {
                    title:"收据信息",
                    key:"receiptNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'receiptNum','caseMaterialBillReceipt');
                    }
                },
                {
                    title:"结案申请书",
                    key:"caseCloseApplyNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'caseCloseApplyNum','caseCloseApplyAttachment');
                    }
                },
                {
                    title:"代收款账户证明",
                    key:"accountAgentNum",
                    render:(h,params)=>{
                        return this.editCell(h,params,'accountAgentNum','accountAgentAttachment');
                    }
                },
                {
                    title:'邮寄状态',
                    key:'action',
                    render:(h,params)=>{
                        if(params.row.managerSendState=='P'){
                            return h('span','待邮寄')
                        }else{
                            return h('span',{
                                class:'global-main-color',
                                style:{
                                    cursor:'pointer'
                                },
                                on:{
                                    click:()=>{
                                        this.getExpressMes(params.row);
                                    }
                                }
                            },'查看物流')
                        }
                    }
                }
            ],
            tableLoading:false,
            auditCtrl:false,
            auditTitle:'审核通过',
            rejectCtrl:false,
            batchCtrl:false,
            formData:{
                auditState:'E',
                auditRemark:''
            },
            prosecuteId:'',
            prosecuteListId:[],
            downloadMaterialCtrl:false,
            printStyle:true,
            mailIdList:[],
            json:{},
            caseDetailInfo:false,
            caseDetail:'',
        }
    },
    props: ['materialBillId'],
    computed:{
        programDetailList(){
            let arr = this.detail.programDetailList;
            if(arr.length>0){
                for(var i=0;i<arr.length;i++){
                    if(arr[i].auditState!=='P'&&arr[i].managerSendState=='E'){
                        arr[i]._disabled = true;
                    }
                }
            }
            return arr;
        }
    },
    methods: {
        // 获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseDetailInfo = true;
                }
            })
        },
        editCell(h,params,key,attachment){
            if(params.row[key]==0){
                return h("span","暂无附件");
            }
            if(attachment && params.row[attachment]){
                let spanDom = h('span',{
                    class:'global-main-color',
                    style:{
                        cursor:'pointer',
                        fontWeight:600
                    },
                    on:{
                        click:()=>{
                            if(key=="receiptNum"){
                                this.activeData = params.row[attachment];
                                this.activeCtrl = true; 
                            }else{
                                let previewData = params.row[attachment];
                                this.$refs.perviewFile.preview(previewData);
                            }
                        }
                    }
                },params.row[key]+'份');
                return [spanDom];
            }else{
                return h('span',params.row[key]+'份');
            }
        },
        // 查看材料清单
        getMaterialDetail(){
            let url = '/business/case-material-bills/'+this.materialBillId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.detail = res.data;
                }
            })
            this.json = {};
            this.mailIdList = [];
            this.prosecuteListId = [];
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        // 添加邮寄信息
        option(row,name){
            this.$refs.formData.resetFields();
            this.$refs.formValidate.resetFields();
            this.prosecuteId = row.caseId;
            switch (name) {
                case 'addMailInfo': 
                    this.$refs["formValidate"].resetFields();
                    this.addMailInfoCtrl = true;
                break;
                case 'checkLogistics':this.getExpressMes(row);break;
                case 'agree': 
                    this.auditTitle = '审核通过';
                    this.formData.auditState = 'E';
                    this.rejectCtrl = false;
                    this.auditCtrl = true; 
                    this.batchCtrl = false; break;
                case 'reject': 
                    this.auditTitle = '审核驳回';
                    this.formData.auditState = 'R';
                    this.rejectCtrl = true;
                    this.auditCtrl = true; 
                    this.batchCtrl = false; break;
            }
        },
        // 获取快递信息
        getExpressMes(row){
            this.expressNo = row.caseMaterialBillSent.expressNo;
            this.company = row.caseMaterialBillSent.courierCompany;
            this.logisticsCtrl = true;
        },
        // 批量审核
        batchAudit(){
            this.$refs.formData.resetFields();
            this.auditTitle = '批量审核';
            this.formData.auditState = 'E';
            this.auditCtrl = true;
            this.batchCtrl = true;
        },
        getSentTime(value){
            this.formValidate.sentTime = value;
        },
        // 提交审核
        submitAudit(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    let url;
                    let ajaxData = {
                        materialBillId:this.detail.id,
                        caseIds:[]
                    }
                    if(this.batchCtrl){
                        ajaxData.caseIds = this.prosecuteListId;
                    }else{
                        ajaxData.caseIds = [this.prosecuteId];
                    }
                    if(this.formData.auditState=='E'){
                        url = '/business/case-material-bill/audit/'+this.detail.id;
                    }else{
                        url = '/business/case-material-bill/reject/'+this.detail.id;
                        ajaxData.auditRemark = this.formData.auditRemark;
                    }
                    console.log(ajaxData)
                    this.$patch(url,ajaxData).then(res=>{
                        this.isSubmit = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.auditCtrl = false;
                            this.getMaterialDetail();
                        }else{
                            this.$Message.error(res.message)
                        }
                    })
                }
            })
        },
        // 添加邮寄信息
        addMailingInformation(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    let url = '/business/case-material-bills/send/mgmt';
                    let ajaxData = {
                        billId:this.detail.id,
                        caseIdList:this.mailIdList
                    }
                    Object.assign(ajaxData,this.formValidate);
                    this.$patch(url,ajaxData).then(res=>{
                        this.isSubmit = false;
                        if(res.code===0){
                            this.$Message.success('操作成功');
                            this.addMailInfoCtrl = false;
                            this.getMaterialDetail();
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        // 获取字典数据接口
        async getDictionary(){
            this.courierCompanyArr = await this.common.getDictionaryItems('courier_company');
        },
        getIdList(list,name){
            this.json[name+'ListId'] = list.map(item=>{
                return item.caseId;
            });
            this.prosecuteListId = name==='prosecute'?list.map(item=>{
                if(item.auditState=='P'){
                    return item.caseId
                }
            }):[];
            this.mailIdList = [];
            for(let key in this.json){
                this.mailIdList = this.mailIdList.concat(this.json[key])
            }
        },
        /*--------------------批量操作start---------------------*/
        // 每请求一页的时候判断是否被选中
        selectOrNo(){
            let argus = arguments;
            let arr = argus[0];
            let key = argus[1];
            let value = argus[2];
            for(var i=0;i<arr.length;i++){
                if(arr[i][key]==value){
                    arr[i]._disabled = true;
                }
            }
            return arr;
        },
        /*--------------------批量操作end---------------------*/
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getMaterialDetail();
    },
    mounted(){
        console.log(this.detail)
    },
    updated(){},
    components: {
        caseDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import './materialListInfo.scss';
</style>
<style media="print">
@page {
    margin-bottom:1mm;
    margin-top: 2mm;
}
</style>
