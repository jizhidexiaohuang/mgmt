<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="16">结算确认单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tl" colspan="16">结算单号：{{defaultData.code || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="16">所属项目：{{defaultData.projName || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="6">案件信息</td>
                            <td colspan="4">收入明细</td>
                            <td colspan="5">乙方报酬</td>
                            <td>结算金额</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">案件编号</td>
                            <td class="subject-table-color">对方当事人</td>
                            <td class="subject-table-color">案号</td>
                            <td class="subject-table-color">寄送诉讼材料日期</td>
                            <td class="subject-table-color">立案日期</td>
                            <td class="subject-table-color">结案方式</td>
                            <td class="subject-table-color">赔偿款</td>
                            <td class="subject-table-color">诉讼退费</td>
                            <td class="subject-table-color">收款人</td>
                            <td class="subject-table-color">到账日期</td>
                            <td class="subject-table-color">律师所得</td>
                            <td class="subject-table-color">滞纳金</td>
                            <td class="subject-table-color">安盾奖励</td>
                            <td class="subject-table-color">代理费</td>
                            <td class="subject-table-color">返回退费</td>
                            <td class="subject-table-color">结算金额</td>
                        </tr>
                        <tr v-for="(item,index) in defaultData.settlementDetailList" :key="index">
                            <td>{{item.caseCode || ""}}</td>
                            <td>{{item.caseExtend?item.caseExtend.litigantNames: ""}}</td>
                            <td>{{item.caseNo || ""}}</td>
                            <td>{{common.formatTime(item.sentTime,1)}}</td>
                            <td>{{common.formatTime(item.filingDate,1)}}</td>
                            <td>{{item.closeTypeName || ""}}</td>
                            <td>{{common.formateNumber(item.paymentFee || 0)}}</td>
                            <td>{{common.formateNumber(item.refundFee || 0)}}</td>
                            <td>{{item.receiptName || ""}}</td>
                            <td>{{item.receiptTime || ""}}</td>
                            <td>{{common.formateNumber(item.incomeFee || 0)}}</td>
                            <td>{{common.formateNumber(item.penaltyFee || 0)}}</td>
                            <td>{{common.formateNumber(item.rewardFee || 0)}}</td>
                            <td>{{common.formateNumber(item.agentFee || 0)}}</td>
                            <td>{{common.formateNumber(item.returnRefundFee || 0)}}</td>
                            <td>{{common.formateNumber(item.settleFee || 0)}}</td>
                        </tr>
                        <tr>
                            <td class="tr" colspan="6">合计：</td>
                            <td colspan="4">{{common.formateNumber(incomeAmount)}}</td>
                            <td colspan="5"></td>
                            <td>{{common.formateNumber(defaultData.settleFee)}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="16">结算备注：{{defaultData.remark || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="16">
                                <p>乙方账户信息</p>
                                <p>账户名称：{{defaultData.bankUser}}</p>
                                <p>银行帐号：{{defaultData.cardNumber}}</p>
                                <p>开户行：{{defaultData.bankName}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="tl mes-box" colspan="16">
                                <p>甲方开票信息</p>
                                <p>单位名称：{{defaultData.invoice.companyName || ""}}</p>
                                <p>开户银行：{{defaultData.invoice.bankName || ""}}</p>
                                <p>银行帐号：{{defaultData.invoice.bankAccount || ""}}</p>
                                <p>纳税人识别号：{{defaultData.invoice.identificationNum || ""}}</p>
                                <p>地址：{{defaultData.invoice.address || ""}}</p>
                                <p>电话：{{defaultData.invoice.phone || ""}}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tc btn-box" v-if="printStyle">
                <Button type="primary" @click="printPage">打印</Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            printStyle:true
        }
    },
    props: ['defaultData'],
    computed:{
        incomeAmount(){
            let num = 0;
            let arr = this.defaultData.settlementDetailList || [];
            arr.forEach((item,index)=>{
                num += (item.paymentFee || 0);
            })
            return num
        }
    },
    methods: {
        printPage(){
            this.printStyle = false;
            this.$nextTick(()=>{
                this.printStyle = true;
                window.print();
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "../../../tradingCenter/buySettlement/refundDetail.scss";
.print-box{
    padding:10px 20px;
}
.mes-box{
    >p{
        margin-bottom: 5px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
</style>
