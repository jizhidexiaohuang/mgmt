<template>
    <div>
        <Tooltip class="tooltip-row" placement="left" theme="light">
            <div slot="content">
                <div class="base-fee-title" v-if="isBaseFee">
                    <p>基础费用：<span class="warning-color">{{common.formateNumber(row.baseFee*scale)}}</span></p>
                    <p>附加费用：<span class="warning-color">{{common.formateNumber(row.surchargeFee*scale)}}</span></p>
                    <i class="split-line"></i>
                    <p>附加费用明细</p>
                    <div>
                        <p v-if="row.tortCategory=='1'">注册资本超过500W：<span class="warning-color">{{common.formateNumber(surchargeObj.capitalExcessFee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">披露及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.disclosureTimelyFee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">取证及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.evidTimelyFee*scale)}}</span></p>
                        <p>首报生产商费：<span class="warning-color">{{common.formateNumber(surchargeObj.firstReportManufactureFee*scale)}}</span></p>
                        <p>侵权产品费：<span class="warning-color">{{common.formateNumber(surchargeObj.infringProductFee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">出书及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.notarialTimelyFee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">销售额奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesRewardFee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">销量超过10W奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesVolumeExceed10Fee*scale)}}</span></p>
                        <p v-if="row.tortCategory=='2'">销量超过30W奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesVolumeExceed30Fee*scale)}}</span></p>
                        <p>购物费：<span class="warning-color">{{common.formateNumber(surchargeObj.shoppingFee*scale)}}</span></p>
                        <p v-if="surchargeObj.otherFee">其他费用：<span class="warning-color">{{common.formateNumber(surchargeObj.otherFee*scale)}}</span></p>
                    </div>
                </div>
                <div v-else>
                    <p v-if="row.tortCategory=='1'">注册资本超过500W：<span class="warning-color">{{common.formateNumber(surchargeObj.capitalExcessFee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">披露及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.disclosureTimelyFee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">取证及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.evidTimelyFee)}}</span></p>
                    <p>首报生产商费：<span class="warning-color">{{common.formateNumber(surchargeObj.firstReportManufactureFee)}}</span></p>
                    <p>侵权产品费：<span class="warning-color">{{common.formateNumber(surchargeObj.infringProductFee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">出书及时奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.notarialTimelyFee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">销售额奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesRewardFee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">销量超过10W奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesVolumeExceed10Fee)}}</span></p>
                    <p v-if="row.tortCategory=='2'">销量超过30W奖励：<span class="warning-color">{{common.formateNumber(surchargeObj.salesVolumeExceed30Fee)}}</span></p>
                    <p>购物费：<span class="warning-color">{{common.formateNumber(surchargeObj.shoppingFee)}}</span></p>
                    <p v-if="surchargeObj.otherFee">其他费用：<span class="warning-color">{{common.formateNumber(surchargeObj.otherFee)}}</span></p>
                </div>
                <p v-if="surchargeObj.otherFee">备注：<span>{{surchargeObj.remark}}</span></p>
            </div>
            <Icon type="ios-information-circle" :color="styles.globalMainColor" size="16"></Icon>
        </Tooltip>
        <span v-if="!isBaseFee" class="span-row textover" :title="common.formateNumber(row.surchargeFee)">{{common.formateNumber(row.surchargeFee)}}</span>
        <span v-if="isBaseFee" class="span-row textover" :title="common.formateNumber(row.sellFee)">{{common.formateNumber(row.sellFee)}}</span>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            surchargeObj:''
        }
    },
    props: {
        row:{
            type:Object
        },
        isBaseFee:{
            type:Boolean,
            default(){
                return false
            }
        },
        scale:{
            type:Number
        }
    },
    methods: {},
    created(){},
    beforeMount(){
        this.surchargeObj = this.row.caseSaleBagItemExtend;
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.tooltip-row{
    line-height: 42px;
    cursor: pointer;
    vertical-align: middle;
    float: left;
}
.span-row{
    width:calc(100% - 20px);
    line-height: 42px;
    float: left;
}
.base-fee-title{
    font-size: 14px;
    position: relative;
    .split-line{
        position: absolute;
        left:0;
        right:0;
        height: 1px;
        background: rgb(144, 144, 144);
    }
    >p{
        &:nth-child(2){
            margin-bottom: 5px;
        }
        &:nth-child(4){
            padding-top: 5px;
        }
    }
    >div{
        p{
            font-size: 12px;
        }
    }
}
</style>
