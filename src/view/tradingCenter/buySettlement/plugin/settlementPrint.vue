<template>
    <div class="long-table">
        <!-- <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/> -->
        <div class="table-box">
            <table class="subject-header-table subject-table print-table">
                <thead>
                    <tr>
                        <th colspan="24">结算确认单</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="tl" colspan="24">单号：{{settlementDetail.code}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color" colspan="24">线上案件</td>
                    </tr>
                    <tr>
                        <td>案件编号</td>
                        <td>项目名称</td>
                        <td>公证书编号</td>
                        <td>店铺名称</td>
                        <td>渠道</td>
                        <td>法人信息</td>
                        <td>工商主体</td>
                        <td>生产商</td>
                        <td>基本服务费</td>
                        <td>超过100元购物费</td>
                        <td>侵权目标是生产商且首次报备的</td>
                        <td>其它公证奖励(已包含在基础服务费)</td>
                        <td>销量超10w奖励</td>
                        <td>销量超30w奖励</td>
                        <td>销售额奖励</td>
                        <td>含多款侵权产品</td>
                        <td>取证及时奖励</td>
                        <td>出书及时奖励</td>
                        <td>披露及时奖励</td>
                        <td>总服务费</td>
                        <td>公证费</td>
                    </tr>
                    <tr v-for="item in settlementDetail.onlinePurchaseStatementDetailList" :key="item.caseId">
                        <td>{{item.casePurchaseStatementDetailExtend.caseCode || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.projectName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.certificateNo || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.storeName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.channelTypeZh || '-'}}</td>
                        <td>{{item.legalRepresentative || '-'}}</td>
                        <td>{{item.sellerName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.manufacturerName || '-'}}</td>
                        <td>{{common.formateNumber(item.baseFee,'')}}</td>
                        <td>{{common.formateNumber(item.shoppingFee,'')}}</td>
                        <td>{{common.formateNumber(item.firstReportManufactureFee,'')}}</td>
                        <td>{{common.formateNumber(item.otherCertificateFee,'')}}</td>
                        <td>{{common.formateNumber(item.salesVolumeExceed10Fee,'')}}</td>
                        <td>{{common.formateNumber(item.salesVolumeExceed30Fee,'')}}</td>
                        <td>{{common.formateNumber(item.salesRewardFee,'')}}</td>
                        <td>{{common.formateNumber(item.infringProductFee,'')}}</td>
                        <td>{{common.formateNumber(item.evidTimelyFee,'')}}</td>
                        <td>{{common.formateNumber(item.notarialTimelyFee,'')}}</td>
                        <td>{{common.formateNumber(item.disclosureTimelyFee,'')}}</td>
                        <td>{{common.formateNumber(item.totalServiceAmount,'')}}</td>
                        <td>{{common.formateNumber(item.totalEvidAmount,'')}}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="tr">合计：</td>
                        <td>{{common.formateNumber(onlineTotal.baseFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.shoppingFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.firstReportManufactureFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.otherCertificateFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.salesVolumeExceed10FeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.salesVolumeExceed30FeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.salesRewardFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.infringProductFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.evidTimelyFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.notarialTimelyFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.disclosureTimelyFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.totalServiceAmountTotal,'')}}</td>
                        <td>{{common.formateNumber(onlineTotal.totalEvidAmountTotal,'')}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="subject-header-table subject-table print-table" style="transform: translateY(-1px)">
                <tbody>
                    <tr>
                        <td class="subject-table-color" colspan="16">线下案件</td>
                    </tr>
                    <tr>
                        <td>案件编号</td>
                        <td>项目名称</td>
                        <td>公证书编号</td>
                        <td>店铺名称</td>
                        <td>渠道</td>
                        <td>法人信息</td>
                        <td>工商主体</td>
                        <td>生产商</td>
                        <td>基本服务费</td>
                        <td>超过100元购物费</td>
                        <td>侵权目标是生产商且首次报备的</td>
                        <td>其它公证奖励(已包含在基础服务费)</td>
                        <td>含多款侵权产品</td>
                        <td>侵权目标注册资本超500万</td>
                        <td>总服务费</td>
                        <td>公证费</td>
                    </tr>
                    <tr v-for="item in settlementDetail.offlinePurchaseStatementDetailList" :key="item.caseId">
                        <td>{{item.casePurchaseStatementDetailExtend.caseCode || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.projectName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.certificateNo || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.storeName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.channelTypeZh || '-'}}</td>
                        <td>{{item.legalRepresentative || '-'}}</td>
                        <td>{{item.sellerName || '-'}}</td>
                        <td>{{item.casePurchaseStatementDetailExtend.manufacturerName || '-'}}</td>
                        <td>{{common.formateNumber(item.baseFee,'')}}</td>
                        <td>{{common.formateNumber(item.shoppingFee,'')}}</td>
                        <td>{{common.formateNumber(item.firstReportManufactureFee,'')}}</td>
                        <td>{{common.formateNumber(item.otherCertificateFee,'')}}</td>
                        <td>{{common.formateNumber(item.infringProductFee,'')}}</td>
                        <td>{{common.formateNumber(item.capitalExcessFee,'')}}</td>
                        <td>{{common.formateNumber(item.totalServiceAmount,'')}}</td>
                        <td>{{common.formateNumber(item.totalEvidAmount,'')}}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="tr">合计：</td>
                        <td>{{common.formateNumber(offlineTotal.baseFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.shoppingFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.firstReportManufactureFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.otherCertificateFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.infringProductFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.capitalExcessFeeTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.totalServiceAmountTotal,'')}}</td>
                        <td>{{common.formateNumber(offlineTotal.totalEvidAmountTotal,'')}}</td>
                    </tr>
                    <tr>
                        <td rowspan="2">账户信息</td>
                        <td colspan="3">公证费：{{common.formateNumber(settlementDetail.totalEvidAmount,'')}}</td>
                        <td colspan="4">收款单位：{{settlementDetail.bankUserCertificate}}</td>
                        <td colspan="4">账户：{{settlementDetail.cardNumberCertificate}}</td>
                        <td colspan="4">开户行：{{settlementDetail.bankNameCertificate}}</td>
                    </tr>
                    <tr>
                        <td colspan="3">代理费：{{common.formateNumber(settlementDetail.totalServiceAmount,'')}}</td>
                        <td colspan="4">收款单位：{{settlementDetail.bankUserService}}</td>
                        <td colspan="4">账户：{{settlementDetail.cardNumberService}}</td>
                        <td colspan="4">开户行：{{settlementDetail.bankNameService}}</td>
                    </tr>
                    <tr>
                        <td>结算备注</td>
                        <td colspan="15">
                            {{settlementDetail.remark}}
                        </td>
                    </tr>
                </tbody>
            </table>
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
            printStyle:true,
            onlineTotal: {
                baseFeeTotal: 0, //基本服务费合计
                shoppingFeeTotal: 0, //超过100元购物费
                firstReportManufactureFeeTotal: 0, //侵权目标是生产商且首次报备的
                otherCertificateFeeTotal: 0, //其它公证奖励
                salesVolumeExceed10FeeTotal: 0, //销量超10w奖励
                salesVolumeExceed30FeeTotal: 0, //销量超30w奖励
                salesRewardFeeTotal: 0, //销售额奖励
                infringProductFeeTotal: 0,//含多款侵权产品
                evidTimelyFeeTotal: 0, //取证及时奖励
                notarialTimelyFeeTotal: 0, //出书及时奖励
                disclosureTimelyFeeTotal: 0, //披露及时奖励
                totalServiceAmountTotal: 0, //总服务费
                totalEvidAmountTotal: 0 //公证费
            },
            offlineTotal: {
                baseFeeTotal: 0, //基本服务费合计
                shoppingFeeTotal: 0, //超过100元购物费
                firstReportManufactureFeeTotal: 0, //侵权目标是生产商且首次报备的
                otherCertificateFeeTotal: 0, //其它公证奖励
                infringProductFeeTotal: 0,//含多款侵权产品
                capitalExcessFeeTotal: 0, //侵权目标注册资本超500万
                totalServiceAmountTotal: 0, //总服务费
                totalEvidAmountTotal: 0 //公证费
            }
        }
        
    },
    props: ['settlementDetail'],
    methods: {
        printPage(){
            this.printStyle = false;
            this.$nextTick(()=>{
                this.printStyle = true;
                window.print();
            })
        },
        // 统计线上费用
        getOnlineTotal(){
            this.settlementDetail.onlinePurchaseStatementDetailList.forEach(item=>{
                this.onlineTotal.baseFeeTotal = item.baseFee
                this.onlineTotal.shoppingFeeTotal = item.shoppingFee
                this.onlineTotal.firstReportManufactureFeeTotal = item.firstReportManufactureFee
                this.onlineTotal.otherCertificateFeeTotal = item.otherCertificateFee
                this.onlineTotal.salesVolumeExceed10FeeTotal = item.salesVolumeExceed10Fee
                this.onlineTotal.salesVolumeExceed30FeeTotal = item.salesVolumeExceed30Fee
                this.onlineTotal.salesRewardFeeTotal = item.salesRewardFee
                this.onlineTotal.infringProductFeeTotal = item.infringProductFee
                this.onlineTotal.evidTimelyFeeTotal = item.evidTimelyFee
                this.onlineTotal.notarialTimelyFeeTotal = item.notarialTimelyFee
                this.onlineTotal.disclosureTimelyFeeTotal = item.disclosureTimelyFee
                this.onlineTotal.totalServiceAmountTotal = item.totalServiceAmount
                this.onlineTotal.totalEvidAmountTotal = item.totalEvidAmount
            })
        },
        // 统计线下费用
        getOfflineTotal(){
            this.settlementDetail.offlinePurchaseStatementDetailList.forEach(item=>{
                this.offlineTotal.baseFeeTotal += item.baseFee
                this.offlineTotal.shoppingFeeTotal += item.shoppingFee
                this.offlineTotal.firstReportManufactureFeeTotal += item.firstReportManufactureFee
                this.offlineTotal.otherCertificateFeeTotal += item.otherCertificateFee
                this.offlineTotal.infringProductFeeTotal += item.infringProductFee
                this.offlineTotal.capitalExcessFeeTotal += item.capitalExcessFee
                this.offlineTotal.totalServiceAmountTotal += item.totalServiceAmount
                this.offlineTotal.totalEvidAmountTotal += item.totalEvidAmount
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getOnlineTotal()
        this.getOfflineTotal()
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./../refundDetail.scss";
.print-box{
    padding:10px 40px;
    position: inherit;
}
</style>
