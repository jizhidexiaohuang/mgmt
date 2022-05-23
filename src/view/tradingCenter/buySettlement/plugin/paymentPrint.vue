<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="6">服务费、公证费付款申请书</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tl" colspan="6">编号：{{defaultData.code || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="6">申请日期：{{common.formatTime(defaultData.createTime,1)}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="3">公证费收款账号信息：{{defaultData.cardNumberCertificate || ""}}--{{defaultData.bankNameCertificate || ""}}</td>
                            <td class="tl" colspan="3">服务费收款账号信息：{{defaultData.cardNumberService || ""}}--{{defaultData.bankNameService || ""}}</td>
                        </tr>
                        <tr v-if="settlementData.length!=0">
                            <td class="subject-table-color">结算单号</td>
                            <td class="subject-table-color">申请日期</td>
                            <td class="subject-table-color">审核通过日期</td>
                            <td class="subject-table-color">服务费结算金额</td>
                            <td class="subject-table-color">公证费结算金额</td>
                            <td class="subject-table-color">合计结算金额</td>
                        </tr>
                        <tr v-if="settlementData.length!=0" v-for="item in settlementData" :key="item.code">
                            <td>{{item.code}}</td>
                            <td>{{common.formatTime(item.createTime,1)}}</td>
                            <td>{{common.formatTime(item.confirmTime,1)}}</td>
                            <td>{{common.formateNumber(item.totalServiceAmount)}}</td>
                            <td>{{common.formateNumber(item.totalEvidAmount)}}</td>
                            <td>{{common.formateNumber(item.totalAmount)}}</td>
                        </tr>
                        <tr v-if="settlementData.length!=0">
                            <td class="tr" colspan="3">合计：</td>
                            <td>{{common.formateNumber(defaultData.serviceAmount)}}</td>
                            <td>{{common.formateNumber(defaultData.evidAmount)}}</td>
                            <td>{{common.formateNumber(defaultData.serviceAmount+defaultData.evidAmount)}}</td>
                        </tr>
                        <tr v-if="refundData.length!=0">
                            <td class="subject-table-color">退款单号</td>
                            <td class="subject-table-color">申请日期</td>
                            <td class="subject-table-color">审核通过日期</td>
                            <td class="subject-table-color">服务费退款金额</td>
                            <td class="subject-table-color">公证费退款金额</td>
                            <td class="subject-table-color">合计退款金额</td>
                        </tr>
                        <tr v-if="refundData.length!=0" v-for="item in refundData" :key="item.code">
                            <td>{{item.code}}</td>
                            <td>{{common.formatTime(item.createTime,1)}}</td>
                            <td>{{common.formatTime(item.confirmTime,1)}}</td>
                            <td>{{common.formateNumber(item.totalServiceAmount)}}</td>
                            <td>{{common.formateNumber(item.totalEvidAmount)}}</td>
                            <td>{{common.formateNumber(item.totalAmount)}}</td>
                        </tr>
                        <tr v-if="refundData.length!=0">
                            <td class="tr" colspan="3">合计：</td>
                            <td>{{common.formateNumber(defaultData.refundServiceAmount)}}</td>
                            <td>{{common.formateNumber(defaultData.refundEvidAmount)}}</td>
                            <td>{{common.formateNumber(defaultData.refundServiceAmount+defaultData.refundEvidAmount)}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="6">
                                <p>总支付金额：{{common.formateNumber(defaultData.payAmount)}}</p>
                                <p>总支付金额大写：{{common.toChinesNum(defaultData.payAmount)}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="6">备注：{{defaultData.remark}}</td>
                        </tr>
                        <tr class="no-inside-border">
                            <td class="clearfix tl" colspan="6">
                                <div class="underline-box">
                                    <span>项目审批：</span>
                                </div>
                                <div class="underline-box">
                                    <span>财务审批：</span>
                                </div>
                                <div class="underline-box">
                                    <span>会计主管：</span>
                                </div>
                                <div class="underline-box">
                                    <span>复核：</span>
                                </div>
                                <div class="underline-box">
                                    <span>制单：</span>
                                </div>
                                <div class="underline-box">
                                    <span>签收：</span>
                                </div>
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
        settlementData(){
            return this.defaultData.purchaseStatementVOList || []
        },
        refundData(){
            return this.defaultData.purchaseRefundInfoVOList || []
        },
        totalAmount(){
            let sum = this.totalServiceAmount + this.totalEvidAmount + this.totalRefundServiceAmount + this.totalRefundEvidAmount
            return sum
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
@import "./../refundDetail.scss";
</style>
