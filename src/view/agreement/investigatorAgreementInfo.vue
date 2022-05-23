<template>
    <div>
        <Row class="detail-header">
            <span>调查协议信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">所属项目：</Col><Col span="16" class="right-content">{{detail.projectName}}</Col></Row>
            <Row><Col span="5" class="left-label">调查配置：</Col><Col span="16" class="right-content">{{detail.configName}}</Col></Row>
            <Row><Col span="5" class="left-label">协议名称：</Col><Col span="16" class="right-content">{{detail.name}}</Col></Row>
            <Row><Col span="5" class="left-label">生效日期：</Col><Col span="16" class="right-content">{{detail.beginDate}}</Col></Row>
            <Row><Col span="5" class="left-label">描述：</Col><Col span="16" class="right-content">{{detail.remark}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>证据回购费用（线上）</span>
        </Row>
        <Row class="detail-content" style="margin-top:0px">
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">公证取证费：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.obtainEvidenceFee:"")}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.timeStamp:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.notarizationCloud:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.ip360:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.multimedia:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.otherElectronicEvidence:"")}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <Row v-if="detail.online?detail.online.firstReportManufacture:false">
                            <Col span="5" class="left-label">侵权目标是生产商且首次报备奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.firstReportManufacture:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.salesVolumeExceed10:false">
                            <Col span="5" class="left-label">销量超过10万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.salesVolumeExceed10:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.salesVolumeExceed30:false">
                            <Col span="5" class="left-label">销售量超过30万（不与10万叠加）奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.salesVolumeExceed30:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.oneNotarialDeedStep:false">
                            <Col span="5" class="left-label">同本公证书（包含多款产品），每增加一款奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.oneNotarialDeedStep:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.salesVolumeEncourage:false">
                            <Col span="5" class="left-label">销售额100万内每增加10万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.salesVolumeEncourage:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.salesVolumeMoreEncourage:false">
                            <Col span="5" class="left-label">销售额超100万每增加100万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.salesVolumeMoreEncourage:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.evidencePromptly:false">
                            <Col span="5" class="left-label">转案日起7日内标记“取证中”奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.evidencePromptly:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.notarialPromptly:false">
                            <Col span="5" class="left-label">标记“取证中”日起20日内出书奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.notarialPromptly:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.litigantPromptly:false">
                            <Col span="5" class="left-label">标记“取证中”日起30日内完成主体披露：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.online?detail.online.litigantPromptly:0)}}</Col>
                        </Row>
                        <Row v-if="detail.online?detail.online.shoppingFee:false">
                            <Col span="5" class="left-label">购物费：</Col>
                            <Col span="16" class="right-content">{{detail.online?(detail.online.shoppingFee!=0?'超100的部分':'无'):'无'}}</Col>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>证据回购费用（线下）</span>
        </Row>
        <Row class="detail-content" style="margin-top:0px">
            <Row class="detail-form-block" style="padding-bottom:0">
                <Row class="detail-form-item" style="margin-bottom:0">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content">
                        <Row class="block-content-radio">
                            <span>{{detail.offline?detail.offline.gradeConfig.grade:""}}等级</span>
                        </Row>
                        <Row class="block-content-grey">
                            <Row><Col span="5" class="left-label">发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.gradeConfig.subList[0].amount:"")}}</Col></Row>
                            <Row><Col span="5" class="left-label">欠发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.gradeConfig.subList[1].amount:"")}}</Col></Row>
                        </Row>
                    </Row>
                </Row>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.timeStamp:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.notarizationCloud:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.ip360:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.multimedia:"")}}</Col></Row>
                        <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.otherElectronicEvidence:"")}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <Row v-if="detail.offline?detail.offline.firstReportManufacture:false">
                            <Col span="5" class="left-label">侵权目标是生产商且首次报备奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.firstReportManufacture:"")}}</Col>
                        </Row>
                        <Row v-if="detail.offline?detail.offline.registeredCapitalExceed500:false">
                            <Col span="5" class="left-label">侵权目标注册资本超过500万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.registeredCapitalExceed500:"")}}</Col>
                        </Row>
                        <Row v-if="detail.offline?detail.offline.oneNotarialDeedStep:false">
                            <Col span="5" class="left-label">同本公证书（包含多款产品），每增加一款奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.oneNotarialDeedStep:"")}}</Col>
                        </Row>
                        <!-- <Row v-if="detail.offline?detail.offline.salesVolumeEncourage:false">
                            <Col span="5" class="left-label">销售额100万内每增加10万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.salesVolumeEncourage:"")}}</Col>
                        </Row>
                        <Row v-if="detail.offline?detail.offline.salesVolumeMoreEncourage:false">
                            <Col span="5" class="left-label">销售额超100万每增加100万奖励：</Col>
                            <Col span="16" class="right-content">{{common.formateNumber(detail.offline?detail.offline.salesVolumeMoreEncourage:"")}}</Col>
                        </Row> -->
                        <Row v-if="detail.offline?detail.offline.shoppingFee:false">
                            <Col span="5" class="left-label">购物费：</Col>
                            <Col span="16" class="right-content">{{detail.offline?(detail.offline.shoppingFee!=0?'超100的部分':'无'):"无"}}</Col>
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
    props: ['detail'],
    methods: {
        
    },
    created(){},
    beforeMount(){
        
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
 .mobile-error{
    color: #ff5555;
    position: absolute;
    bottom: -18px;
    left: 0px;
    width: auto;
    line-height: 1;
 }
 .fee-label-list{
    .ivu-form-item{
        margin-bottom: 0;
    }
}
.block-content .ivu-form-item-content .ivu-checkbox-group .ivu-checkbox-wrapper span.ivu-checkbox{
    float: left;
}
</style>
<style lang="sass">
@import './lawyerAgreementForm.scss';
</style>
