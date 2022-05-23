<template>
    <div>
        <div class="detail-header">
            <span>定金付款</span>
        </div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">定金支付金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.prepaidFee)}}</Col></Row>
            <Row><Col span="5" class="left-label">定金支付途径：</Col><Col span="16" class="right-content">{{defaultData.prepaidPayModelName}}</Col></Row>
        </Row>
        <div class="detail-header">
            <span>尾款付款</span>
        </div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">尾款支付金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.balanceFee)}}</Col></Row>
            <Row><Col span="5" class="left-label">尾款支付途径：</Col><Col span="16" class="right-content">{{defaultData.balancePayModelName}}</Col></Row>
            <Row v-if="defaultData.saleReturnAdditional"><Col span="5" class="left-label">收款账户：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.accountName}}</Col></Row>
            <Row v-if="defaultData.saleReturnAdditional"><Col span="5" class="left-label">开户行：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.bank}}</Col></Row>
            <Row v-if="defaultData.saleReturnAdditional"><Col span="5" class="left-label">银行账户：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.bankAccount}}</Col></Row>
        </Row>
        <div class="detail-header">
            <span>订单付款信息</span>
        </div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">退回原因：</Col><Col span="16" class="right-content">{{defaultData.reasonName}}</Col></Row>
            <Row><Col span="5" class="left-label">退回备注：</Col><Col span="16" class="right-content">{{defaultData.refundRemark}}</Col></Row>
            <Row v-if="defaultData.auditState=='E'" >
                <Row>
                    <Col span="5" class="left-label">是否退款：</Col>
                    <Col span="16" class="right-content">{{defaultData.isRefund?"是":"否"}}</Col>
                </Row>
                <Row v-if="defaultData.isRefund">
                    <Col span="5" class="left-label">退款类型：</Col>
                    <Col span="16" class="right-content">{{defaultData.refundTypeName}}</Col>
                </Row>
                <Row v-if="defaultData.isRefund">
                    <Col span="5" class="left-label">退款金额：</Col>
                    <Col v-if="defaultData.refundType=='P'" span="16" class="right-content">{{common.formateNumber(defaultData.prepaidFee)}}</Col>
                    <Col v-if="defaultData.refundType=='B'" span="16" class="right-content">{{common.formateNumber(defaultData.balanceFee)}}</Col>
                    <Col v-if="defaultData.refundType=='A'" span="16" class="right-content">{{common.formateNumber(defaultData.prepaidFee+defaultData.balanceFee)}}</Col>
                </Row>
            </Row>
            <Row v-if="defaultData.auditState=='R'">
                <Col span="5" class="left-label">驳回原因：</Col>
                <Col span="16" class="right-content">{{defaultData.refundRemark}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">审核结果：</Col>
                <Col span="16" class="right-content">
                    <Tag v-if="defaultData.auditState=='P'" style="border-radius:11px;" :color="styles.warningColor">{{defaultData.auditStateName}}</Tag>
                    <Tag v-if="defaultData.auditState=='E'" style="border-radius:11px;" :color="styles.successColor">{{defaultData.auditStateName}}</Tag>
                    <Tag v-if="defaultData.auditState=='R'" style="border-radius:11px;" :color="styles.errorColor">{{defaultData.auditStateName}}</Tag>
                </Col>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            styles:styles
        }
    },
    props: ['defaultData'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
