<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <div v-if="!paymentCtrl">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Dropdown @on-click="exportOption">
                            <Button style="padding:0 15px" type="primary">
                                导出
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="all">全部导出</DropdownItem>
                                <DropdownItem :disabled="idList.length==0" name="part">勾选导出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="结算单编号/案件编号" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payState" placeholder="请选择付款状态">
                                        <Option v-for="item in payStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    申请团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="teamSelect"
                                        :path="'/base/teams'"
                                        :placeholder="'请选择申请团队'"
                                        :placeholderInput="'请输入团队名称'"
                                        :keyName="'team'"
                                        :params="{teamType:'I'}"
                                        @getValue="getTeamId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    审核状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state" placeholder="请选择审核状态">
                                        <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                        <template slot-scope="{ row, index }" slot="more-actions">
                            <Dropdown @on-click="option(row,$event)" v-if="row.state === 'P' || (row.state === 'E' && row.payState === 'P')">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="pass" v-if="row.state === 'P'">通过</DropdownItem>
                                    <DropdownItem name="rejected" v-if="row.state === 'P'">驳回</DropdownItem>
                                    <DropdownItem name="apply" v-if="row.state === 'E' && row.payState === 'P'">申请付款</DropdownItem>
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
            <payment-detail ref="paymentDetail" v-if="paymentCtrl" :defaultData="''" :settlementData="idObjList" :refundData="idRefundObjList" @closeDetail="closeCtrl">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="add">生成付款单</DropdownItem>
                            <DropdownItem name="print">打印付款单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="paymentCtrl=false;" type="md-close"/>
                </div>
            </payment-detail>
        </div>
        <!-- 结算单详情 -->
        <statement-detail v-if="infoCtrl" :statementDetailId="id">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
        </statement-detail>
        <!-- 驳回 -->
        <Modal v-model="rejectCtrl" title="提示" class-name="vertical-center-modal" :footer-hide="true" width="400">
            <p>是否驳回选中结算单？</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                <FormItem label="驳回原因" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="驳回原因"></Input>
                </FormItem>
                <FormItem class="do-sn-div">
                    <Button type="primary" class="do-div-btn" @click="settlementRemove('formValidate')">确认</Button>
                    <Button class="do-div-btn" @click="rejectCtrl=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 退款单 -->
        <Modal v-model="refundCtrl" title="选择退款单" class-name="vertical-center-modal" :footer-hide="true" width="600">
            <checkbox-table :columns="refundColumns" :data="refundData" 
                ref="checkboxRefundTable"
                :tableLoading="tableLoading" @refreshList="getRefundIdList($event)">
                </checkbox-table>
            <div class="do-sn-div">
                <Button type="primary" class="do-div-btn" @click="refundChoose">确认</Button>
                <Button class="do-div-btn" @click="refundCtrl=false">取消</Button>
            </div>
        </Modal>

        <Modal v-model="passCtrl" title="提示" class-name="vertical-center-modal" :footer-hide="true" width="300">
            <p style="margin-bottom:15px;font-size:14px;">是否通过该结算单？</p>
            <Row style="text-align:center;">
                <Button type="primary" class="do-div-btn" @click="passSettlement">确认</Button>
                <Button class="do-div-btn" @click="passCtrl=false">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import statementDetail from './statementDetail.vue';
import paymentDetail from './paymentDetail.vue';
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            searchForm:{ //搜索
                keyword:'',
                payState:'',
                teamId:'',
                state:'',
            },
            projectStateArr:[],//筛选条件
            idList:[], //结算单id组
            idObjList:[],
            idRefundList:[], //退款id组
            idRefundObjList:[],
            data:[],
            id:'',//结算单id
            infoCtrl:false,
            tableLoading:false,
            operateCtrl:false,
            paymentCtrl:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            formValidate:{
                desc:''
            },
            ruleValidate: {
                desc: [
                    { required: true, message: '请输入驳回理由', trigger: 'blur' }
                ]
            },
            addDrawerCtrl:false,
            searchBoxCtrl:false,
            rejectCtrl:false,// 驳回
            refundCtrl:false,// 退款单
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"结算单号",
                    key:"code",
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{ "textover":true },
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.getStatementDetail(params.row.id);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:'申请日期',
                    key:'createTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1))
                    }
                },
                {
                    title:'审核通过时间',
                    key:'auditTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.auditTime,1)|| '-')
                    }
                },
                {
                    title:'案件数量',
                    key:'caseNum'
                },
                {
                    title:'申请团队',
                    key:'teamName'
                },
                {
                    title:"结算金额",
                    key:"totalAmount",
                    render:(h,params)=>{
                       return h('span',this.common.formateNumber(params.row.totalAmount))
                    }
                },
                {
                    title:"审核状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待审核";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "审核通过";
                                break;
                            case 'R':
                                color = 'errorColor';
                                text = "审核驳回";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text)
                        
                    }
                },
                {
                    title:"付款状态",
                    key:"payState",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.payState;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待申请";
                                break;
                            case 'S':
                                color = 'successColor';
                                text = "已付款";
                                break;
                            case 'E':
                                color = 'errorColor';
                                text = "已申请";
                                break;
                        }
                        
                        if(params.row.state === 'E'){
                            return h('Tag',{
                                class:'textover',
                                attrs:{
                                    title:text,
                                    color:styles[color]
                                },
                                style:{
                                    borderRadius:'11px'
                                }
                            },text)
                        }
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            refundColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title: '退款单号',
                    key:'code',
                },
                {
                    title: '服务费退款金额',
                    key:'totalServiceAmount',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalServiceAmount));
                    }
                },
                {
                    title: '公证费退款金额',
                    key:'totalEvidAmount',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalEvidAmount));
                    }
                },
            ], // 退款列表
            refundData:[], // 退款数据
            stateArr:[], //审核状态
            payStateArr:[], //付款状态
            casePurchaseStatement:{ //通过/驳回
                id:'',
                auditRemark:''
            },
            passCtrl:false
        }
    },
    props: [''],
    methods: {
        // 导出
        exportOption(name){
            console.log(name);
        },
        getData(){
            let url = '/settlement/trade/purchase/mgmt/statement'
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword='';
            this.searchForm.payState='';
            this.searchForm.state='';
            this.$refs.teamSelect.clearSelected();
            this.reloadTable();
        },
        /*--------------------start---------------------*/
        // 结算单列表
        getIdList(list){
            this.idObjList = [];
            this.idList = list.map(item=>{
                this.idObjList.push(item);
                return item.id
            });
        },
        // 退款单列表
        getRefundIdList(list){
            this.idRefundObjList = [];
            this.idRefundList = list.map(item=>{
                this.idRefundObjList.push(item);
                return item.id
            })
        },
        getRepeatRefundList(row){
            this.$refs.checkboxRefundTable.clearSelected();
            let url = `/settlement/trade/purchase/refund/mgmt`;
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                teamId:row.teamId,
                payState:"P",
                state:"E"
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    if(res.data.records.length!=0){
                        this.refundData = res.data.records;
                        this.refundCtrl = true;
                    }else{
                        this.paymentCtrl = true;
                    }
                }
            })
        },
        closeCtrl(){
            this.paymentCtrl = false;
            this.reloadTable();
        },
        /*--------------------end---------------------*/
        option(row,name){
            this.id = row.id;
            switch (name) {
                case 'pass':
                    this.passCtrl = true;
                    break;
                case 'rejected':
                    this.rejectedSettlement(row)
                    break;
                case 'apply':
                    this.idObjList = [row];
                    this.getRepeatRefundList(row);
                    break;
                case 'add':
                    this.$refs.paymentDetail.handleSumbit();
                    break;
                default:
                    break;
            }
        },
        //结算单审核通过
        passSettlement(){
            let url = '/settlement/mgmt/purchase-statement/pass'
            let ajaxData = {
                id: this.id 
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.passCtrl = false;
                    // 重新获取数据
                    this.getData();
                }
            })
        },
        //结算单驳回
        rejectedSettlement(data){
            this.rejectCtrl = true
            this.id = data.id
        },
        //确认驳回
        settlementRemove(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let url = '/settlement/mgmt/purchase-statement/rejected';
                    let ajaxData = {
                        id: this.id,
                        auditRemark: this.formValidate.desc
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.rejectCtrl = false;
                            // 重新获取数据
                            this.getData()
                        }
                    })
                } else {
                    this.$Message.error('操作失败!');
                }
            })
        },
        // 退款单选择
        refundChoose(){
            this.refundCtrl = false;
            this.paymentCtrl = true;
        },
        //获取申请团队id
        getTeamId(data){
            this.searchForm.teamId = data.teamId
        },
        //获取字典数据接口
        async getDictionary(){
            this.stateArr = await this.common.getDictionaryItems('audit_state');
            this.payStateArr = await this.common.getDictionaryItems('purchase_pay_state');
        },
        //查看结算单详情
        getStatementDetail(detailId){
            this.infoCtrl = true;
            this.id = detailId
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        this.getData();
    },
    activated(){
        this.reloadTable();
    },
    updated(){},
    components: {
        statementDetail,
        paymentDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
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
</style>
