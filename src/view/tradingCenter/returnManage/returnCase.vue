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
            <Row><Col span="5" class="left-label">收款账户：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.accountName}}</Col></Row>
            <Row><Col span="5" class="left-label">开户行：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.bank}}</Col></Row>
            <Row><Col span="5" class="left-label">银行账户：</Col><Col span="16" class="right-content">{{defaultData.saleReturnAdditional.bankAccount}}</Col></Row>
        </Row>
        <div class="detail-header">
            <span>订单付款信息</span>
        </div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">退回原因：</Col><Col span="16" class="right-content">{{defaultData.reasonName}}</Col></Row>
            <Row><Col span="5" class="left-label">退回备注：</Col><Col span="16" class="right-content">{{defaultData.remark}}</Col></Row>
            <Row v-if="operateType=='audit'">
                <Row>
                    <Col span="5" class="left-label">是否退款：</Col>
                    <Col span="16" class="right-content">
                        <RadioGroup v-model="returnForm.isRefund">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row v-if="returnForm.isRefund===1">
                    <Col span="5" class="left-label">退款类型：</Col>
                    <Col span="16" class="right-content">
                        <RadioGroup v-model="returnForm.refundType">
                            <Radio label="P">定金</Radio>
                            <Radio v-if="defaultData.balanceFee" label="B">尾款</Radio>
                            <Radio v-if="defaultData.balanceFee" label="A">全部</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row v-if="returnForm.isRefund===1">
                    <Col span="5" class="left-label">退款金额：</Col>
                    <Col v-if="returnForm.refundType=='P'" span="16" class="right-content">{{common.formateNumber(defaultData.prepaidFee)}}</Col>
                    <Col v-if="returnForm.refundType=='B'" span="16" class="right-content">{{common.formateNumber(defaultData.balanceFee)}}</Col>
                    <Col v-if="returnForm.refundType=='A'" span="16" class="right-content">{{common.formateNumber(defaultData.prepaidFee+defaultData.balanceFee)}}</Col>
                </Row>
            </Row>
            <Row v-if="operateType=='reject'">
                <Col span="5" class="left-label">驳回原因：</Col>
                <Col span="16" class="right-content">
                    <Input v-model.trim="returnForm.auditRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入驳回原因"></Input>
                </Col>
            </Row>
        </Row>
        <Row style="text-align:center;margin-top:20px;">
            <Button type="primary" :disabled="isSubmit" @click="confirm">确认</Button>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isSubmit:false,
            returnForm:{
                isRefund:1,
                refundType:"P",
                auditRemark:""
            }
        }
    },
    props: ['defaultData','operateType'],
    methods: {
        confirm(){
            let url = "";
            let ajaxData = {
                id:this.defaultData.id,
                refundType:this.returnForm.refundType,
                isRefund:this.returnForm.isRefund
            }
            if(this.operateType=="audit"){
                url = "/settlement/case-sale-return/audit";
                ajaxData.refundType = this.returnForm.refundType;
                ajaxData.isRefund = this.returnForm.isRefund;
            }else if(this.operateType=="reject"){
                url = "/settlement/case-sale-return/reject";
                ajaxData.auditRemark = this.returnForm.auditRemark;
            }
            this.isSubmit = true;
            this.$patch(url,ajaxData).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    this.$Message.success('操作成功');
                    this.$emit('changeEditCtrl',true);
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        //获取字典数据接口
        async getDictionary(){
            // this.saleStateArr = await this.common.getDictionaryItems('case_sale_state');
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
<style>
 
</style>
