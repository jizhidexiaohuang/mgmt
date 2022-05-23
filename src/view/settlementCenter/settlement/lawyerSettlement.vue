<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Button type="primary" :disabled="idList.length==0" @click="paymentApplyBatch">批量付款</Button>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="案件编号/结算单号/对方当事人" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    任务
                                </Col>
                                <Col span="18">
                                    <mySelect ref="missionSelect"
                                        :path="'/business/missions'"
                                        :placeholder="'请选择任务'"
                                        :placeholderInput="'请输入任务名称'"
                                        :keyName="'name'"
                                        @getValue="getMissionId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="lawyerSelect" style="width:190px"
                                        :path="'/base/lawyer-teams'"
                                        :keyName="'team'"
                                        :width="190"
                                        placeholder="请选择团队"
                                        @getValue="getTeamsId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    审核状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state" placeholder="请选择审核状态" clearable>
                                        <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payState" placeholder="请选择付款状态" clearable>
                                        <Option v-for="item in payStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                    <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                        :tableLoading="tableLoading" @refreshList="getIdList($event)">
                        <template slot-scope="{ row,index }" slot="more-actions">
                            <Dropdown @on-click="option(row,$event)" v-if="!(row.state=='R' || row.payState=='R')">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="agree" v-if="row.state=='P'">通过</DropdownItem>
                                    <DropdownItem name="reject" v-if="row.state=='P'">驳回</DropdownItem>
                                    <DropdownItem name="paymentApplication" v-if="row.state=='E'&&row.payState=='P'">付款申请</DropdownItem>
                                    <DropdownItem name="paymentSlip" v-if="row.payState=='E'||row.payState=='S'">查看付款单</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </checkbox-table>
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
            <!-- 通过/驳回 -->
            <Modal
                v-model="auditCtrl"
                :title="type=='agree'?'结算单审核':'审核驳回'"
                :width="350"
                :footer-hide="true">
                <Row v-if="type=='agree'" style="margin-bottom:12px;">审核一经通过，不可撤回，请确认是否审核通过？</Row>
                <Form ref="formValidate" :key="type" :model="formValidate" :label-width="80">
                    <FormItem label="驳回原因" prop="remark" v-if="type=='reject'"
                        :rules="[{required:true,message:'驳回原因不能为空',trigger:'blur'},
                            {max:512,message:'不能超过512个字符',trigger:'blur'}]">
                        <Input v-model.trim="formValidate.remark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写驳回原因(不超过512个字符)'></Input>
                    </FormItem>
                </Form>
                <Row style="text-align:center;">
                    <Button type="primary" :loading="trunCaseLoading" :disabled="trunCaseLoading"  @click="auditSubmit('formValidate')">确认</Button>
                    <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
                </Row>
            </Modal>
            <!-- 备注 -->
            <Modal
                v-model="paymentCtrl"
                :width="350"
                title="付款备注"
                :footer-hide="true">
                <Row style="margin-bottom:12px;">
                    <Col span="6" class="right-label" style="padding-right:10px;">备注</Col>
                    <Col span="18">
                        <Input v-model.trim="remark" maxlength="512" show-word-limit type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注'></Input>
                    </Col>
                </Row>
                <Row style="text-align:center;">
                    <Button type="primary" @click="getPaymentApplyInfo">确认</Button>
                    <Button @click="paymentCtrl=false;" style="margin-left: 8px">取消</Button>
                </Row>
            </Modal>
            <!-- 付款申请/查看付款单 -->
            <Modal
                v-model="paymentApplyCtrl"
                :width="800"
                :closable="false"
                :footer-hide="true">
                <payment-apply v-if="paymentApplyCtrl" :isInfo="!createPayment" :defaultData="paymentApplyDetail" @closeModal="closePayment">
                    <div slot="sumbitBtn" v-if="createPayment"><Button type="primary" @click="createPaymentApply">确认生成</Button></div>
                </payment-apply>
            </Modal>
            <!-- 查看结算单 -->
            <settlement-detail ref="settlementDetail" v-if="infoCtrl" :isInfo="true" :defaultData="settlementData" @changeEditCtrl="closeModal">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem v-if="true" name="print">打印结算单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="infoCtrl=false" type="md-close"/>
                </div>
            </settlement-detail>
        </div>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import paymentApply from './plugin/custApplyPrint.vue';
import settlementDetail from './lawyerSettlementDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            payId:'',
            searchForm:{
                keyword:'',
                missionId:'',
                teamId:'',
                state:'',
                payState:''
            },
            stateArr:[],
            payStateArr:[],
            idList:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns: [
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"结算单号",
                    key:"code",
                    width:110,
                    render:(h,params)=>{
                        let aDom = h("a",{
                            style:{
                                float:'left',
                                lineHeight:'42px'
                            },
                            attrs:{
                                title:params.row.code,
                            },
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getSettlementDetail(params.row.id);
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1))
                    }
                },
                {
                    title:"所属任务",
                    key:"missionName",
                    width:110,
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.missionName
                            }
                        },params.row.missionName)
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNum"
                },
                {
                    title:"申请团队",
                    key:"teamName"
                },
                {
                    title:"收款账号",
                    key:"bankUser",
                    width:110,
                    render:(h,params)=>{
                        let str = `${params.row.bankUser}(${params.row.bankName})-${params.row.cardNumber}`
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:str
                            }
                        },str)
                    }
                },
                {
                    title: '赔偿款',
                    key: 'compensationFee',
                    render:(h,params)=>{
                        let compensationFee = this.common.formateNumber(params.row.compensationFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:compensationFee
                            }
                        },compensationFee)
                    }
                },
                {
                    title: '结算金额',
                    key: 'settleFee',
                    render:(h,params)=>{
                        let settleFee = this.common.formateNumber(params.row.settleFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:settleFee
                            },
                            style:{
                                color:"#ffa43b"
                            }
                        },settleFee)
                    }
                },
                {
                    title: '审核状态',
                    key: 'state',
                    render:(h,params)=>{
                        let color;
                        let state = params.row.state;
                        switch (true){
                            case state=='P':color = 'orange';break;
                            case state=='E':color = 'green';break;
                            case state=='R':color = 'red';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateName,
                                color:color
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:'审核备注',
                    key:'auditRemark',
                    width:70,
                    render:(h,params)=>{
                        if((params.row.state=='R' ||params.row.payState=='R') && params.row.auditRemark){
                            let poptipDom = h('Poptip',{
                                props: {placement: 'bottom',trigger:"hover",width:'100px',wordWrap:true},
                            },[
                                h('Icon',{
                                    attrs:{
                                        type:'ios-information-circle',
                                    },
                                    style:{
                                        fontSize:'16px',
                                        cursor: 'pointer'
                                    }
                                }),
                                h('span', { 
                                    slot: 'content', 
                                    style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                                },params.row.auditRemark)
                            ])
                            return h('div',{style:{ textAlign:'center'}},[poptipDom])
                        }else{
                            return h('span','')
                        }
                    }
                },
                {
                    title: '付款状态',
                    key: 'payState',
                    render:(h,params)=>{
                        let color;
                        let state = params.row.payState;
                        switch (true){
                            case state=='P':color = 'warningColor';break;
                            case state=='E':color = 'successColor';break;
                            case state=='R':color = 'errorColor';break;
                            case state=='S':color = 'infoColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.payStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.payStateName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                }
            ],
            infoCtrl:false,
            auditCtrl:false,
            type:'',
            formValidate:{
                remark:''
            },
            trunCaseLoading:false,
            paymentCtrl:false,
            remark:'',
            paymentApplyCtrl:false,
            paymentApplyDetail:'',
            batchCtrl:false,
            infoCtrl:false,
            settlementData:'',
            createPayment:true,//创建付款单 || 取反=查看付款单详情
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance/case/settlement/mgmt';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records.map(item=>{
                        return {
                            _disabled:(item.state=='E'&&item.payState=='P')?false:true,    
                            ...item
                        }
                    }) || [];
                    this.table.totalRecords = res.data.total;
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
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        getTeamsId(data){
            this.searchForm.teamId = data.id;
        },
        getMissionId(data){
            this.searchForm.missionId = data.id;
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.lawyerSelect.clearSelected();
            this.$refs.missionSelect.clearSelected();
            this.reloadTable();
        },
        closeModal(reload){
            if(reload){
                this.reloadTable();
            }
        },
        // 关闭付款申请
        closePayment(){
            this.paymentCtrl = false;
            this.paymentApplyCtrl = false;
        },
        // 预览付款单
        getPaymentApplyInfo(){
            this.paymentCtrl = false;
            let url = '/settlement/finance/case/settlement/payment-preview';
            let listId = this.batchCtrl?this.idList.map(item=>{
                return item.id
            }):[this.id];
            this.$patch(url,listId).then(res=>{
                this.paymentApplyCtrl = true;
                this.createPayment = true;
                if(res.code==0){
                    this.paymentApplyDetail = res.data;
                    this.paymentApplyDetail.remark = this.remark;
                }
            })
        },
        // 确认生成付款单
        createPaymentApply(){
            let url = '/settlement/finance/case/settlement/payment-apply';
            let ajaxData = {
                idList:this.batchCtrl?this.idList.map(item=>{
                    return item.id
                }):[this.id],
                remark:this.remark
            }
            this.$patch(url,ajaxData).then(res=>{
                this.paymentApplyCtrl = false;
                if(res.code==0){
                    this.$Message.success('操作成功');
                    this.reloadTable()
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        // 批量付款 检查银行卡
        paymentApplyBatch(){
            let flag = true;
            if(this.idList && this.idList.length>0){
                let cardNumber = this.idList[0].cardNumber,
                    bankUser = this.idList[0].bankUser,
                    bankName = this.idList[0].bankName,
                    teamId = this.idList[0].teamId;
                this.idList.forEach(item=>{
                    if(item.cardNumber!==cardNumber || item.bankUser!==bankUser || item.bankName!==bankName || item.teamId!==teamId){
                        flag = false;
                        return;
                    }
                })
            }
            if(flag){
                this.batchCtrl = true;
                this.remark = '';
                this.paymentCtrl = true;
                this.createPayment = true;
            }else{
                this.$Message.error({
                    content:'只能对申请团队，收款银行，收款账户，银行卡号一致且审核通过的结算单发起付款申请！',
                    duration:2
                });
            }
        },
        // 获取结算单详情
        getSettlementDetail(id){
            let url = `/settlement/finance/case/settlement/${id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.settlementData = res.data || "";
                    this.infoCtrl = true;
                }
            })
        },
        // 查看付款单详情
        getPaymentDetail(id){
            let url = `/settlement/finance-payment/${id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.paymentApplyDetail = res.data || "";
                    this.paymentApplyCtrl = true;
                    this.createPayment = false;
                }
            })
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch (name) {
                case 'agree': 
                    this.auditCtrl = true;
                    break;
                case 'reject':
                    this.auditCtrl = true;
                    this.$refs['formValidate'].resetFields();
                    break;
                case 'paymentApplication':
                    this.batchCtrl = false;
                    this.remark = '';
                    this.paymentCtrl = true;
                    this.createPayment = true;
                    break;
                case 'paymentSlip':
                    this.getPaymentDetail(row.payId);
                    break;
                case 'print':
                    this.$refs.settlementDetail.handlePrint();
                    break;
            }
        },
        // 审核
        auditSubmit(name){
            let url ;
            let ajaxData = {
                id:this.id
            }
            if(this.type=='agree'){
                url = '/settlement/finance/case/settlement/audit';
            }else{
                url = '/settlement/finance/case/settlement/reject';
                ajaxData.auditRemark = this.formValidate.remark;
            }
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.trunCaseLoading = true;
                    this.$patch(url,ajaxData).then(res=>{
                        this.auditCtrl = false;
                        this.trunCaseLoading = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.reloadTable()
                        }else{
                            this.$Message.error(res.message)
                        }
                    })
                }
            })
        },
        getIdList(list){
            this.idList = list;
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.stateArr = await this.common.getDictionaryItems('audit_state');
            this.payStateArr = await this.common.getDictionaryItems('case_settle_pay_state');
        },
    },
    created(){},
    activated(){
        this.getData();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        
    },
    updated(){},
    components: {
        paymentApply,
        settlementDetail
    },
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
.operate-box{
    position: absolute;
    right:15px;
    top:3px;
    font-size:20px;
    cursor: pointer;
    .close-icon{
        margin-left: 10px;
    }
}
.close-icon{
    font-size: 20px;
    cursor: pointer;
}
</style>