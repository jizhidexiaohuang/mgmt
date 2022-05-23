<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="9">结算确认单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tl" colspan="9">结算单号：{{defaultData.code || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="9">所属项目：{{defaultData.projectName || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="2">案件信息</td>
                            <td colspan="7">收入明细</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">案件编号</td>
                            <td class="subject-table-color">案号</td>
                            <td class="subject-table-color">赔偿款</td>
                            <td class="subject-table-color">诉讼退费</td>
                            <td class="subject-table-color">收款人</td>
                            <td class="subject-table-color">案件成本</td>
                            <td class="subject-table-color">风险代理费（含成本）</td>
                            <td class="subject-table-color">客户授权费</td>
                            <td class="subject-table-color">计算公式</td>
                        </tr>
                        <tr v-for="(item,index) in defaultData.custSettlementDetailList" :key="index">
                            <td>{{item.caseCode || ""}}</td>
                            <td>{{item.caseNo || ""}}</td>
                            <td>{{common.formateNumber(item.compensateAmount || 0)}}</td>
                            <td>{{common.formateNumber(item.returnAmount || 0)}}</td>
                            <td>{{item.payee || ""}}</td>
                            <td>{{common.formateNumber(item.showCostAmount || 0)}}</td>
                            <td>{{common.formateNumber(item.agent || 0)}}</td>
                            <td>{{common.formateNumber(item.authFee || 0)}}</td>
                            <td>{{item.settlementFormula}}</td>
                        </tr>
                        <tr>
                            <td class="tr" colspan="2">合计：</td>
                            <td>{{common.formateNumber(allAmount)}}</td>
                            <td colspan="3"></td>
                            <td>{{common.formateNumber(allAgent)}}</td>
                            <td>{{common.formateNumber(allAuthFee)}}</td>
                            <td v-if="defaultData.actualPay>0">乙方待支付甲方{{common.formateNumber(defaultData.actualPay || 0)}}</td>
                            <td v-if="defaultData.actualPay<0">甲方待支付乙方{{common.formateNumber(Math.abs(defaultData.actualPay || 0))}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="9">结算备注：{{defaultData.remark || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl mes-box" colspan="9">
                                <p>乙方开票信息</p>
                                <p>单位名称：{{defaultData.bankUser || ""}}</p>
                                <p>开户银行：{{defaultData.bankName || ""}}</p>
                                <p>银行帐号：{{defaultData.cardNumber || ""}}</p>
                                <p>纳税人识别号：{{defaultData.identifier || ""}}</p>
                                <p>地址：{{defaultData.address || ""}}</p>
                                <p>电话：{{defaultData.phone || ""}}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tc btn-box" v-if="printStyle">
                <Button type="primary" v-if="isInfo" @click="printPage">打印</Button>
                <slot name="sumbitBtn" v-else></slot>
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
    props: ['defaultData',"isInfo"],
    computed:{
        allAmount(){
            let num = 0;
            this.defaultData.custSettlementDetailList.forEach((item,index)=>{
                num += item.compensateAmount || 0;
            })
            return num
        },
        allAgent(){
            let num = 0;
            this.defaultData.custSettlementDetailList.forEach((item,index)=>{
                num += item.agent;
            })
            return num
        },
        allAuthFee(){
            let num = 0;
            this.defaultData.custSettlementDetailList.forEach((item,index)=>{
                num += item.authFee;
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
        }
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
@import "./../../../tradingCenter/buySettlement/refundDetail.scss";
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
