<template>
    <div>
        <Row class="detail-header">
            <span>付款申请明细</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">项目名称：</Col><Col span="16" class="right-content">{{defaultData.projectName}}</Col></Row>
            <Row><Col span="5" class="left-label">申请日期：</Col><Col span="16" class="right-content">{{common.formatTime(defaultData.createTime,1)}}</Col></Row>
            <Row><Col span="5" class="left-label">付款类型：</Col><Col span="16" class="right-content">{{defaultData.payTypeName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">支出类目：</Col><Col span="16" class="right-content">{{defaultData.categoryName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">收款人：</Col><Col span="16" class="right-content">{{defaultData.bankUser || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">支出金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.amount)}}</Col></Row>
            <Row><Col span="5" class="left-label">付款描述：</Col><Col span="16" class="right-content">{{defaultData.remark || ""}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">附件：</Col>
                <Col span="16" class="right-content">
                <file-upload 
                    :defaultList="defaultData.attachmentList || []" 
                    :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">付款申请单：</Col>
                <Col span="16" class="right-content">
                    <a href="javascript:void(0)" @click="getPayApplyDetail(defaultData.id)">{{defaultData.code}}</a>
                </Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">结算单：</Col>
                <Col span="16" class="right-content">
                    <a href="javascript:void(0)" style="margin-right:10px;" v-for="(item,index) in defaultData.financePaymentBizList" :key="index" @click="getSettlementDetail(defaultData.category,item.bizId)">{{item.settlementCode || ""}}</a>
                </Col>
            </Row>
            <Row style="border:1px solid #dcdee2;border-bottom:0;margin:0px 16px 16px;" 
                v-if="defaultData.financePaymentDetailList && defaultData.financePaymentDetailList.length>0">
                <Table :data="defaultData.financePaymentDetailList" :columns="columns"></Table>
            </Row>
            <Row class="detail-header" v-if="defaultData.financePaymentRecord">
                <span>付款确认明细</span>
            </Row>
            <Row class="detail-content" v-if="defaultData.financePaymentRecord">
                <Row><Col span="5" class="left-label">付款日期：</Col><Col span="16" class="right-content">{{common.formatTime(defaultData.financePaymentRecord.paymentDate,1)}}</Col></Row>
                <Row><Col span="5" class="left-label">流水单号：</Col><Col span="16" class="right-content">{{defaultData.financePaymentRecord.flowNum || ""}}</Col></Row>
                <Col span="5" class="left-label">付款凭证：</Col>
                <Col span="16" class="right-content">
                    <file-upload 
                        :defaultList="defaultData.financePaymentRecord.attachmentList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
                <Row><Col span="5" class="left-label">备注：</Col><Col span="16" class="right-content">{{defaultData.financePaymentRecord.remark || ""}}</Col></Row>
            </Row>
        </Row>

        <!-- 结算单预览/打印 -->
        <Modal
            v-model="printCtrl"
            width="700"
            :closable="false"
            :footer-hide="true">
            <cust-apply-print :defaultData="defaultData" :isInfo="true" @closeModal="printCtrl=false"></cust-apply-print>
        </Modal>

        <!-- 律师结算单打印 -->
        <Modal
            v-model="infoCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <lawyer-settlement-print :defaultData="settlementData" v-if="infoCtrl" @closeModal="closeModal"></lawyer-settlement-print>
        </Modal>

        <!-- 客户结算单预览 -->
        <Modal
            v-model="custInfoCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <cust-settlement-print :defaultData="custSettlementData" :isInfo="true" v-if="custInfoCtrl" @closeModal="custInfoCtrl=false"></cust-settlement-print>
        </Modal>
    </div>
</template>
<script>
import custApplyPrint from "./../settlement/plugin/custApplyPrint.vue";
import lawyerSettlementPrint from "./../settlement/plugin/lawyerSettlementPrint.vue";
import custSettlementPrint from './../settlement/plugin/custSettlementPrint.vue'
export default {
    data () {
        return {
            printCtrl:false,
            infoCtrl:false,
            custInfoCtrl:false,
            settlementData:"",
            columns:[
                {
                    title:'案件编号',
                    key:'caseCode'
                },
                {
                    title:'案件金额',
                    key:'amount'
                }
            ]
        }
    },
    props: ['defaultData'],
    methods: {
        getPayApplyDetail(){
            this.printCtrl = true;
        },
        getSettlementDetail(type,id){
            if(type=="A"){ //律师结算单
                let url = `/settlement/finance/case/settlement/${id}`;
                this.$get(url).then(res=>{
                    if(res.code==0){
                        this.settlementData = res.data || "";
                        this.infoCtrl = true;
                    }
                })
            }else if(type=='B'){ //客户结算单
                let url = `/settlement/finance-cust-settlement/${id}`;
                this.$get(url).then(res=>{
                    if(res.code==0){
                        this.custSettlementData = res.data || "";
                        this.custInfoCtrl = true;
                    }
                })
            }
        },
        closeModal(){
            this.infoCtrl = false;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        custApplyPrint,
        lawyerSettlementPrint,
        custSettlementPrint
    },
    watch: {}
}
</script>
<style lang-"scss" scoped>
</style>
