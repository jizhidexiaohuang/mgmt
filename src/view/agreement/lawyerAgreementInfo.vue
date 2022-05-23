<template>
    <div>
        <Row class="detail-header">
            <span>律师协议信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">所属项目：</Col><Col span="16" class="right-content">{{agreementDetail.projectName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">协议名称：</Col><Col span="16" class="right-content">{{agreementDetail.name || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">生效日期：</Col><Col span="16" class="right-content">{{agreementDetail.beginDate || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">描述：</Col><Col span="16" class="right-content">{{agreementDetail.remark || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">协议状态：</Col><Col span="16" class="right-content">{{agreementDetail.stateZh || ""}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>结算规则</span>
        </Row>
        <Row class="detail-content">
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">代理费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">有无代理费：</Col><Col span="16" class="right-content">{{agreementDetail.agentFee?"有":"无"}}</Col></Row>
                        <Row v-if="agreementDetail.agentFee"><Col span="5" class="left-label">代理费金额：</Col><Col span="16" class="right-content">{{common.formateNumber(agreementDetail.agentFee || "")}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">分成比例</Row>
                    <Row class="block-content block-info-content">
                        <Row class="block-content-title">
                            <Row>
                                <div class="title-begin">金额下限</div>
                                <div class="title-end">金额上限</div>
                                <div class="title-proportion">比例</div>
                            </Row>
                        </Row>
                        <Row v-for="(item,index) in agreementDetail.ratioList" :label-width="0" :key="index">
                            <Row class="fee-loop-list">
                                <Row class="fee-loop-content">
                                    <div class="fee-loop-begin">
                                        {{common.formateNumber(item.minAmount)}}
                                    </div>
                                    <div class="fee-loop-end">
                                        {{item.maxAmount?common.formateNumber(item.maxAmount):"无"}}
                                    </div>
                                    <div class="fee-loop-proportion">
                                        {{`${item.ratio}%`}}
                                    </div>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">奖励费用</Row>
                    <Row class="block-content block-info-content">
                        <Row class="block-content-title">
                            <Row>
                                <div class="title-select">条件</div>
                                <div class="title-select-fee">奖励</div>
                            </Row>
                        </Row>
                        <Row v-for="(item,index) in rewardFee" :label-width="0" :key="index">
                            <Row class="fee-loop-list">
                                <Row class="fee-loop-content">
                                    <div class="fee-loop-select">
                                        {{item.feeItemName || ""}}
                                    </div>
                                    <div class="fee-loop-select-prencent">
                                        {{item.ratio?`${item.ratio}%`:common.formateNumber(item.fixedAmount || "")}}
                                    </div>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加管理费用</Row>
                    <Row class="block-content block-info-content">
                        <Row class="block-content-title">
                            <Row>
                                <div class="title-select">条件</div>
                                <div class="title-select-fee">附加费</div>
                            </Row>
                        </Row>
                        <Row v-for="(item,index) in additionalFee" :label-width="0" :key="index">
                            <Row class="fee-loop-list">
                                <Row class="fee-loop-content">
                                    <div class="fee-loop-select">
                                        {{item.feeItemName || ""}}
                                    </div>
                                    <div class="fee-loop-select-prencent">
                                        {{item.ratio?`${item.ratio}%`:common.formateNumber(item.fixedAmount || "")}}
                                    </div>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">安盾终止补偿</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">安盾终止—立案前：</Col><Col span="16" class="right-content">{{common.formateNumber(agreementDetail.terminationCaseBeforeAmount || "")}}</Col></Row>
                        <Row>
                            <Col span="5" class="left-label">安盾终止—立案后：</Col>
                            <Col span="16" class="right-content">
                                {{agreementDetail.terminationCaseAfterRatio?`${agreementDetail.terminationCaseAfterRatio}%`:common.formateNumber(agreementDetail.terminationCaseAfterFixedAmount || "")}}
                            </Col>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props: ['agreementDetail'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    computed:{
        additionalFee(){
            if(!this.agreementDetail.additionalFeeList){return []}
            return this.agreementDetail.additionalFeeList.filter((item,index)=>{
                return item.feeType=="S"
            })
        },
        rewardFee(){
            if(!this.agreementDetail.additionalFeeList){return []}
            return this.agreementDetail.additionalFeeList.filter((item,index)=>{
                return item.feeType=="R"
            })
        }
    },
    components: {},
    watch: {}
}
</script>
<style lang="scss">
@import "./lawyerAgreementForm.scss";
</style>
