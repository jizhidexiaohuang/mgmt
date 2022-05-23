<template>
    <div>
        <Row class="detail-header">
            <span>结算单信息</span>
            <slot name='operate-box'></slot>
        </Row>
        <div class="table-box">
            <table class="subject-noheader-table subject-table">
                <tbody>
                    <tr>
                        <td class="subject-table-color">结算单号</td>
                        <td class="tl" colspan="3">{{defaultData.code || ""}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">所属项目</td>
                        <td class="tl">{{defaultData.projName || ""}}</td>
                        <td class="subject-table-color">合计结算金额</td>
                        <td class="tl">
                            <span v-if="defaultData">{{common.formateNumber(allAmount)}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">银行账号</td>
                        <td class="tl" colspan="3">
                            <Form v-if="!isInfo" :model="formData" ref="formData" :rules="ruleValidate" :label-width="0">
                                <FormItem label="" prop="bankId">
                                    <Select v-model="formData.bankId" placeholder="请选择银行账号" @on-change="getBankValue">
                                        <Option v-for="item in accountArr" :value="item.id" :key="item.id">{{item.accountOwner}}--{{item.bank}}--{{item.account}}</Option>
                                    </Select>
                                </FormItem>
                            </Form>
                            <span v-else>{{defaultData.bankUser}}--{{defaultData.bankName}}--{{defaultData.cardNumber}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Row class="detail-header spec-header">
                <span>案件信息</span>
                <div class="operate-box" v-if="!isInfo">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="remove">批量删除</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Row>
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="tableColumns" :data="formData.settlementDetailList"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)"></Table>
            </Row>
            <Row class="detail-header spec-header">
                <span>备注</span>
            </Row>
            <div class="remarks">
                <Input v-if="!isInfo" v-model="formData.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"></Input>
                <div v-else class="remarks-box">{{defaultData.remark}}</div>
            </div>
        </div>

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="900"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">案件详情</div>
            <case-detail style="top:0" v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-detail>
        </Drawer>

        <!-- 打印 -->
        <Modal
            v-model="previewCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <settlement-print :defaultData="defaultData" v-if="previewCtrl" @closeModal="closeModal"></settlement-print>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import settlementPrint from './plugin/lawyerSettlementPrint.vue';
import caseDetail from '../../case/caseDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            tableLoading:false,
            selectCaseCtrl:false,
            refundreasonArr:[],
            caseDetail:"",
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:125,
                    render:(h,params)=>{
                        let arr = [];
                        let icon = h('Tooltip',{
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
                        let aDom = h("a",{
                            style:{
                                width:"calc(100% - 20px)",
                                float:'left',
                                lineHeight:'42px'
                            },
                            attrs:{
                                title:params.row.caseCode,
                            },
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode)
                        let iconDom = h("span",{
                            attrs:{
                                title:`结算了${params.row.caseSettleNum}次`
                            },
                            style:{
                                background: styles.warningColor,
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
                        },params.row.caseSettleNum)
                        if(params.row.abnormalState){
                            arr.push(icon);
                        }
                        if(params.row.caseSettleNum&&params.row.caseSettleNum>1){
                            arr.push(iconDom);
                        }
                        arr.push(aDom);
                        return h("div",arr);
                    }
                },
                {
                    title:"案号",
                    key:"caseNo"
                },
                {
                    title:"对方当事人",
                    key:"caseExtend",
                    render:(h,params)=>{
                        let domArr = [];
                        let idArr = params.row.caseExtend.litigantIds?params.row.caseExtend.litigantIds.split(",") : [];
                        let categoryArr = params.row.caseExtend.litigantCategories?params.row.caseExtend.litigantCategories.split(",") : [];
                        let nameArr = params.row.caseExtend.litigantNames?params.row.caseExtend.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title:'材料寄送日期',
                    key:'sentTime',
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.sentTime,1))
                    }
                },
                {
                    title:'立案日期',
                    key:'filingDate',
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.filingDate,1))
                    }
                },
                {
                    title:"结案方式",
                    key:"closeTypeName"
                },
                {
                    title: '收款人',
                    key: 'receiptName',
                },
                {
                    title: '到账日期',
                    key: 'receiptTime',
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                title:params.row.receiptTime
                            }
                        },params.row.receiptTime)
                    }
                },
                {
                    title:"赔偿款",
                    key:"paymentFee",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.paymentFee || 0))
                    }
                },
                {
                    title: '诉讼退费',
                    key: 'refundFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.refundFee || 0))
                    }
                },
                {
                    title: '律师所得',
                    key: 'incomeFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.incomeFee || 0))
                    }
                },
                {
                    title: '滞纳金',
                    key: 'penaltyFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.penaltyFee || 0))
                    }
                },
                {
                    title: '办案奖励',
                    key: 'rewardFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.rewardFee || 0))
                    }
                },
                {
                    title: '代理费',
                    key: 'agentFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.agentFee || 0))
                    }
                },
                {
                    title: '返回退费',
                    key: 'returnRefundFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.returnRefundFee || 0))
                    }
                },
                {
                    title: '结算金额',
                    key: 'settleFee',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.settleFee))
                    }
                }
            ],
            tableColumns:[],
            idList:[],
            data:[],
            formData:{
                bankId:"",
                bankName:"",
                bankUser:"",
                cardNumber:"",
                settlementDetailList:[],
                remark:""
            },
            ruleValidate:{
                bankId:[{ required: true,type:"number", message: '银行账户不能为空', trigger: 'blur' }]
            },
            caseInfoCtrl:false,
            previewCtrl:false,
            settlementData:"",
            accountArr:[],
            sumbitData:"",
            delIdList:[],//修改时案件明细的id
        }       
    },
    props: ['defaultData','isInfo'],
    computed:{
        allAmount(){
            let num = 0;
            this.formData.settlementDetailList.forEach((item,index)=>{
                num += item.settleFee;
            })
            return num
        }
    },
    methods: {
        changeColumns(bool){
            let selectObj = { type: 'selection',width: 30,align: 'center'};
            let operateObj = {title:"操作",slot: 'action'};
            if(bool){
                this.tableColumns = this.columns;
            }else{
                this.tableColumns = [selectObj,...this.columns,operateObj];
            }
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
        option(row,name){
            switch(name){
                case "remove":
                    this.batchDeleteCase();
                    break;
            }
        },
        getIdList(list){
            this.idList = [];
            list.forEach((item,index)=>{
                this.idList.push(item.caseId)
            })
        },
        getBankValue(id){
            this.accountArr.forEach((item,index)=>{
                if(id==item.id){
                    this.formData.bankName = item.bank;
                    this.formData.bankUser = item.accountOwner;
                    this.formData.cardNumber = item.account;
                    return
                }
            })
        },
        pushDelId(id){
            if(this.delIdList.indexOf(id)==-1){
                this.delIdList.push(id);
            }
        },
        deleteCase(row){
            this.formData.settlementDetailList.splice(row._index,1);
            // 如果是编辑则需要记录删除的案件明细id
            if(this.defaultData.id){
                this.pushDelId(row.id);
            }
        },
        batchDeleteCase(){
            let newArr = this.formData.settlementDetailList.filter((item) => {
                return !this.idList.some((ele)=>{
                    // 如果是编辑则需要记录删除的案件明细id
                    if(ele===item.caseId && this.defaultData.id){
                        this.pushDelId(item.id);
                    }
                    return ele===item.caseId
                })
            });
            this.formData.settlementDetailList = newArr;
            this.idList = [];
        },
        handlePrint(){
            this.previewCtrl = true;
        },
        sumbit(){
            let url = '/settlement/finance/case/settlement';
            let ajaxData = {};
            if(this.defaultData.id){
                ajaxData.bankId = this.formData.bankId;
                ajaxData.bankUser = this.formData.bankUser;
                ajaxData.bankName = this.formData.bankName;
                ajaxData.cardNumber = this.formData.cardNumber;
                ajaxData.id = this.defaultData.id;
                ajaxData.deleteSettlementDetailIdList = this.delIdList;
                ajaxData.remark = this.formData.remark;
                this.$patch(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.$emit("changeEditCtrl",true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }else{
                for(let key in this.defaultData){
                    ajaxData[key] = this.defaultData[key];
                }
                ajaxData.settleFee = this.allAmount;
                ajaxData.settlementDetailList = this.formData.settlementDetailList;
                Object.assign(ajaxData,this.formData);
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.$emit("changeEditCtrl",true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }
        },
        closeModal(reload){
            this.previewCtrl = false;
            if(reload){
                this.$emit("closeModal",true);
            }
        },
        //赋默认值
        giveDefaultData(){
            this.formData.bankId = this.defaultData.bankId || "";
            this.formData.bankName = this.defaultData.bankName || "";
            this.formData.bankUser = this.defaultData.bankUser || "";
            this.formData.cardNumber = this.defaultData.cardNumber || "";
            this.formData.remark = this.defaultData.remark || "";
            this.formData.settlementDetailList = [];
            this.defaultData.settlementDetailList.forEach((item,index)=>{
                this.formData.settlementDetailList.push(item);
            })
        },
        //获取银行卡信息详情
        getBankData(){
            let url = '/base/lawyer-banks/my';
            let ajaxData = {
                current: 1,        
                size: 50
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.accountArr = res.data.records;
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.refundreasonArr = await this.common.getDictionaryItems('purchase_state');
        }
    },
    created(){},
    beforeMount(){
        this.getBankData();
        this.changeColumns(this.isInfo);
        if(this.defaultData){
            this.giveDefaultData();
        }
    },
    mounted(){},
    updated(){},
    components: {
        settlementPrint,
        caseDetail
    },
    watch: {
        isInfo(newVal,oldVal){
            this.changeColumns(newVal);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../tradingCenter/buySettlement/refundDetail.scss";
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
.ivu-form-item{
    margin-bottom: 5px;
}
.spec-header{
    margin:15px 0 10px 0;
}
</style>
