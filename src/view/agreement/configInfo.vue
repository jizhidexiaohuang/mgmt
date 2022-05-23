<template>
    <div>
        <Row class="detail-header">
            <span>证据回购费用（线上）</span>
        </Row>
        <Row class="detail-content" style="margin-top:0">
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">公证取证费：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.obtainEvidenceFee)}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.timeStamp)}}</Col></Row>
                        <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.notarizationCloud)}}</Col></Row>
                        <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.ip360)}}</Col></Row>
                        <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.multimedia)}}</Col></Row>
                        <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOnline.otherElectronicEvidence)}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <Row>
                            <Col span="16" class="left-label">侵权目标是生产商且首次报备奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.firstReportManufacture)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">销量超过10万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.salesVolumeExceed10)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">销售量超过30万（不与10万叠加）奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.salesVolumeExceed30)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">同本公证书（包含多款产品），每增加一款奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.oneNotarialDeedStep)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">销售额100万内每增加10万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.salesVolumeEncourage)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">销售额超100万每增加100万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.salesVolumeMoreEncourage)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">转案日起7日内标记“取证中”奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.evidencePromptly)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">标记“取证中”日起20日内出书奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.notarialPromptly)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">标记“取证中”日起30日内完成主体披露：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOnline.litigantPromptly)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">购物费：</Col>
                            <Col span="5" class="right-content">{{configDetail.configOnline.shoppingFee?'超100的部分':'无'}}</Col>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>证据回购费用（线下）</span>
        </Row>
        <Row class="detail-content" style="margin-top:0">
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content" v-for="(item,index) in configDetail.configOffline.gradeConfigList" :key="index">
                        <Row class="block-content-title">
                            <span>{{item.grade}}等级</span>
                        </Row>
                        <Row class="block-content-grey">
                            <Row><Col span="5" class="left-label">发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(item.subList[0].amount)}}</Col></Row>
                            <Row><Col span="5" class="left-label">欠发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(item.subList[1].amount)}}</Col></Row>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOffline.timeStamp)}}</Col></Row>
                        <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOffline.notarizationCloud)}}</Col></Row>
                        <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOffline.ip360)}}</Col></Row>
                        <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOffline.multimedia)}}</Col></Row>
                        <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">{{common.formateNumber(configDetail.configOffline.otherElectronicEvidence)}}</Col></Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <Row>
                            <Col span="16" class="left-label">侵权目标是生产商且首次报备奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOffline.firstReportManufacture)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">侵权目标注册资本超过500万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOffline.registeredCapitalExceed500)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">同本公证书（包含多款产品），每增加一款奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOffline.oneNotarialDeedStep)}}</Col>
                        </Row>
                        <!-- <Row>
                            <Col span="16" class="left-label">销售额100万内每增加10万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOffline.salesVolumeEncourage)}}</Col>
                        </Row>
                        <Row>
                            <Col span="16" class="left-label">销售额超100万每增加100万奖励：</Col>
                            <Col span="5" class="right-content">{{common.formateNumber(configDetail.configOffline.salesVolumeMoreEncourage)}}</Col>
                        </Row> -->
                        <Row>
                            <Col span="16" class="left-label">购物费：</Col>
                            <Col span="5" class="right-content">{{configDetail.configOffline.shoppingFee?'超100的部分':'无'}}</Col>
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
    props: ['configDetail'],
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
</style>
<style lang="sass">
@import './lawyerAgreementForm.scss';
</style>
