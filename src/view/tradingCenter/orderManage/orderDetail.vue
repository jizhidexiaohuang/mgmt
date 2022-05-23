<template>
    <div>
        <Row class="detail-header">
            <span>订单信息</span>
            <slot name='operate-box'></slot>
        </Row>
        <Spin size="large" fix v-if="detailLoading"></Spin>
        <div class="table-box">
            <table class="subject-noheader-table subject-table">
                <tbody>
                    <tr>
                        <td class="subject-table-color">订单编号</td>
                        <td class="tl" colspan="3">{{defaultData.orderNo}}</td>
                        <td class="subject-table-color">创建时间</td>
                        <td class="tl" colspan="3">{{common.formatTime(defaultData.createTime)}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">购买团队</td>
                        <td class="tl">{{defaultData.teamName}}</td>
                        <td class="subject-table-color">预约案件</td>
                        <td class="tl">{{defaultData.prepayCaseNum || 0}}件</td>
                        <td class="subject-table-color">已出证案件</td>
                        <td class="tl">{{defaultData.evidencedCaseNum || 0}}件</td>
                        <td class="subject-table-color">已支付案件</td>
                        <td class="tl">{{defaultData.paidCaseNum || 0}}件</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">订单出售状态</td>
                        <td class="tl">{{defaultData.saleStateName}}</td>
                        <td class="subject-table-color">订单签收状态</td>
                        <td class="tl">{{defaultData.signStateName}}</td>
                        <td class="subject-table-color">订单总价</td>
                        <td class="tl money-td">{{common.formateNumber(defaultData.saleFee)}}</td>
                        <td class="subject-table-color">已支付</td>
                        <td class="tl money-td">{{common.formateNumber(defaultData.paidFee)}}</td>
                    </tr>
                </tbody>
            </table>
            <Row class="detail-header" style="margin:15px 0 10px 0" v-if="defaultData.paymentInfo">
                <span>付款批次详情</span>
                <div class="operate-box">
                    <Dropdown @on-click="option(defaultData.paymentInfo,$event)" v-if="defaultData.paymentInfo.payMode=='offline'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="checkVoucher">查看付款凭证</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Row>
            <table class="subject-noheader-table subject-table" v-if="defaultData.paymentInfo">
                <tbody>
                    <tr>
                        <td class="subject-table-color">付款批次编号</td>
                        <td class="tl">{{defaultData.paymentInfo.code}}</td>
                        <td class="subject-table-color">批次案件</td>
                        <td class="tl">{{defaultData.orderItems.length}}件</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">总价</td>
                        <td class="tl money-td">{{common.formateNumber(defaultData.paymentInfo.saleFee)}}</td>
                        <td class="subject-table-color">已支付</td>
                        <td class="tl money-td">{{common.formateNumber(defaultData.paymentInfo.amount)}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">支付方式</td>
                        <td class="tl">{{defaultData.paymentInfo.payModeName}}</td>
                        <td class="subject-table-color">批次状态</td>
                        <td class="tl">{{defaultData.paymentInfo.signStateName}}</td>
                    </tr>
                </tbody>
            </table>
            <Row class="detail-header" style="margin:15px 0 10px 0">
                <span>案件信息</span>
                <div class="operate-box">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="removeAbnormal">移除异常信息</DropdownItem>
                            <DropdownItem name="billing">开票</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Row>
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                    keyId="orderId" :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="email">邮寄信息</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </checkbox-table>
            </Row>
            <Row style="margin-top:10px;text-align:center;">
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

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="800"
            title="案件详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <case-info v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-info>
        </Drawer>

        <!-- 邮寄信息 -->
        <Modal
            v-model="emailCtrl"
            title="邮寄信息"
            width="450"
            :footer-hide="true">
            <Row><Col span="8" class="right-label">是否邮寄公证书：</Col><Col span="12" class="right-content">{{emailMes.isCertificate?'是':'否'}}</Col></Row>
            <Row><Col span="8" class="right-label">是否邮寄公证物：</Col><Col span="12" class="right-content">{{emailMes.isNotary?'是':'否'}}</Col></Row>
            <Row><Col span="8" class="right-label">是否邮寄公证费发票：</Col><Col span="12" class="right-content">{{emailMes.isNotaryInvoice?'是':'否'}}</Col></Row>
        </Modal>

        <!-- 移除异常 -->
        <Modal
            v-model="removeAbnormalCtrl"
            title="移出异常确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否移除案件异常？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="removeSubmit">确认</Button>
                <Button @click="removeAbnormalCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 开票 -->
        <Modal
            v-model="billingCtrl"
            title="案件开票确认单"
            :width="900"
            :footer-hide="true">
            <billing-form v-if="billingCtrl" :caseIdList="billingIds" :orderId="orderId" @reloadList="billingFinish"></billing-form>
        </Modal>

        <!-- 查看凭证 -->
        <Modal
            v-model="voucherCtrl"
            title="查看凭证"
            :width="450"
            :footer-hide="true">
            <voucher-detail v-if="voucherCtrl" :voucherId="voucherId" @refresh="closeVoucher"></voucher-detail>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseInfo from "./../buyBack/caseInfo.vue";
import billingForm from './billing/billingForm.vue';
import voucherDetail from './voucherDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            defaultData:'',
            tableLoading:false,
            selectCaseCtrl:false,
            refundreasonArr:[],
            caseDetail:"",
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:145,
                    render:(h,params)=>{
                        let txt = "";
                        if(params.row.returnState=="R"){
                            txt = params.row.returnAuditRemark;
                        }
                        let arr = [];
                        let iconDom = h("span",{
                            style:{
                                background: styles.errorColor,
                                color: '#fff',
                                width: '16px',
                                height: '16px',
                                lineHeight: '16px',
                                borderRadius: '4px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display:'inline-block',
                                float:'left',
                                marginTop:'14px',
                                fontSize:'12px'
                            }
                        },"退")
                        let txtDom = h("div",{},txt)
                        let contentDom = h("div",{slot:"content"},[txtDom])
                        let toolTip = h("Tooltip",{
                            props:{ theme:"light",maxWidth:150 },
                            style:{
                                float:"left"
                            }
                            },[iconDom,contentDom])
                        let aWidth = 0;
                        let abnormalIcon = h('Tooltip',{
                            props: {placement: 'bottom',trigger:"hover",theme:"light"},
                            style:{
                                fontSize:'16px',
                                cursor: 'pointer',
                                color:styles.errorColor,
                                float:'left',
                                lineHeight:'42px',
                                marginRight:'4px'
                            }
                        },[
                            h('Icon',{
                                attrs:{
                                    type:'ios-information-circle',
                                    title:params.row.abnormalStateName
                                },
                                style:{
                                    fontSize:'16px',
                                    cursor: 'pointer',
                                    verticalAlign: 'text-bottom'
                                }
                            }),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },params.row.abnormalStateName)
                        ])
                        if(params.row.returnState=='R'){
                            arr.push(toolTip);
                            aWidth = 20;
                        }else if(params.row.returnState=='P' || params.row.returnState=='E'){
                            arr.push(iconDom);
                            aWidth = 20;
                        }
                        if(params.row.abnormalStateName){
                            arr.push(abnormalIcon)
                            aWidth = 36;
                        }
                        let aDom = h("a",{
                            class:["textover"],
                            style:{
                                display:'inline-block',
                                width:`calc(100% - ${aWidth}px)`,
                                float:'left',
                                lineHeight:'42px'
                            },
                            on:{
                                click:()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode)
                        arr.push(aDom);
                        return h("div",{style:{}},arr)
                    }
                },
                {
                    title:"项目",
                    key:"projectName",
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
                    title:'案件区域',
                    key:'cityName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:(params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||'')
                            },
                        },
                        (params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||''))
                    }
                },
                {
                    title:"对方当事人",
                    key:"litigantNames",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.litigantNames
                            },
                        },params.row.litigantNames)
                    }
                },
                {
                    title:"取证状态",
                    key:"certState",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.certState){
                            case "P": color = "warning"; break;
                            case "W": color = "blue"; break;
                            case "A": color = "green"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            attrs:{ color:color }
                        },params.row.certStateName)
                    }
                },
                {
                    title:"取证团队",
                    key:"certTeamName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.certTeamName
                            },
                        },params.row.certTeamName)
                    }
                },
                {
                    title: '出售价格',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title: '出售状态',
                    key: 'purchaseState',//PR 待出售 S已出售
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.purchaseState){
                            case "PR": color = "warningColor"; break;
                            case "S": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.purchaseStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.purchaseStateName)
                    }
                },
                {
                    title: '回购状态',
                    key: 'buybackState',
                    render:(h,params)=>{ //PD 已回购  WP 待回购
                        let color = "";
                        switch(params.row.buybackState){
                            case "WP": color = "warningColor"; break;
                            case "PD": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.buybackStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.buybackStateName)
                    }
                },
                {
                    title: '开票状态',
                    key: 'invoiceState',
                    render:(h,params)=>{ //N 未开票  A 已申请 I已开票
                        let color = "";
                        switch(params.row.invoiceState){
                            case "N": color = "infoColor"; break;
                            case "A": color = "warningColor"; break;
                            case "I": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.invoiceStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.invoiceStateName)
                    }
                },
                {
                    title: '签收状态',
                    key: 'signState',
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.signState){
                            case "WS": color = "warningColor"; break;
                            case "SD": color = "successColor"; break;
                        }
                        if(!params.row.signState){
                            return h('span','')
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.signStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.signStateName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                }
            ],
            idList:[],
            defaultSelectData:[],
            data:[],
            teamObj:{},
            formData:{
                reason:"",
                teamId:""
            },
            caseInfoCtrl:false,
            emailCtrl:false,
            emailMes:'',
            removeAbnormalCtrl:false,
            removeAbnormalIds:[],
            billingCtrl:false,
            billingIds:[],
            voucherCtrl:false,
            voucherId:'',
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            detailLoading:false
        }       
    },
    props: ['orderId','batchId'],
    computed:{},
    methods: {
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
        option(row,name){
            switch(name){
                case "email":
                    this.getEmailMes(row.caseId);
                    break;
                case "removeAbnormal":
                    this.removeAbnormalIds = [];
                    this.idList.map(item=>{
                        if(!!item.abnormalState){
                            this.removeAbnormalIds.push(item.caseId);
                        }
                    })
                    if(this.removeAbnormalIds.length==0){
                        this.$Message.warning('勾选的案件都无异常');
                    }else{
                        this.removeAbnormalCtrl = true;
                    }
                    break;
                case 'billing':
                    this.billingIds = [];
                    this.idList.map(item=>{
                        if(item.purchaseState=='S'&&item.invoiceState=='N'){
                            this.billingIds.push(item.orderItemId);
                        }
                    })
                    if(this.billingIds.length==0){
                        this.$Message.warning('勾选的案件尚未达到开票条件');
                    }else{
                        this.billingCtrl = true;
                    }
                    break
                case 'checkVoucher':
                    this.voucherId = row.id;
                    this.voucherCtrl = true;
                    break;
            }
        },
        // 查看邮寄信息
        getEmailMes(caseId){
            let url = `/settlement/order-mailing/${caseId}/info`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.emailCtrl = true;
                    this.emailMes = res.data;
                }
            })
        },
        // 移除异常
        removeSubmit(){
            let url = '/settlement/order/remove/abnormal';
            this.$patch(url,this.removeAbnormalIds).then(res=>{
                if(res.code==0){
                    this.removeAbnormalCtrl = false;
                    this.$Message.success('操作成功！');
                    this.getOrderDetail();
                    this.removeAbnormalIds = [];
                    this.$refs.checkboxTable.clearSelected();
                }else{
                    this.$Message.error(res.message);
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
        getIdList(list){
            this.idList = list;
        },
        // 开票完成
        billingFinish(data){
            if(data){
                this.getOrderDetail();
            }
            this.billingCtrl = false;
            this.billingIds = [];
            this.$refs.checkboxTable.clearSelected();
            this.$emit('closeDetail',true)
        },
        // 查看订单详情
        getOrderDetail(){
            let url = '/settlement/order';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize,
                orderId:this.orderId,
                province:"",
                keyword:""
            }
            this.detailLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.detailLoading = false;
                if(res.code==0){
                    this.defaultData = res.data;
                    this.data = this.defaultData.orderItemsPage.records;
                    this.table.totalRecords = this.defaultData.orderItemsPage.total;
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        // 获取批次详情
        getBatchDetail(){
            let url = '/settlement/payment/'+this.batchId;
            this.detailLoading = true;
            this.$get(url).then(res=>{
                this.detailLoading = false;
                if(res.code==0){
                    this.defaultData = res.data;
                    this.data = this.defaultData.orderItems;
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        closeVoucher(){
            this.voucherCtrl = false;
            this.getBatchDetail();
            this.$emit('closeDetail',true);
        },
        //获取字典数据接口
        async getDictionary(){
            this.refundreasonArr = await this.common.getDictionaryItems('purchase_state');
        }
    },
    created(){},
    beforeMount(){
        if(this.orderId){
            this.getOrderDetail();
        }else if(this.batchId){
            this.getBatchDetail();
        }
    },
    mounted(){},
    updated(){},
    components: {
        caseInfo,
        billingForm,
        voucherDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "../buySettlement/refundDetail.scss";
.subject-noheader-table .subject-table-color{
    width:auto;
}
.money-td{
    font-weight: 600;
    color:$warningColor;
}
.text-r{
    text-align: right;
}
.text-l{
    text-align: left;
}
</style>
