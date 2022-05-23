<template>
    <div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">证据分类：</Col><Col span="16" class="right-content">{{defaultData.info.evidTypeName || ""}}</Col></Row>
            <Row v-if="defaultData.info.evidType=='EC'">
                <Col span="5" class="left-label">固证工具：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.curingToolTypeName || ""}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">{{defaultData.info.evidType=='EC'?"证据编号":"公证书号"}}：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.notarialCode || ""}}</Col></Row>
            <Row v-if="defaultData.info.evidType!='EC'">
                <Col span="5" class="left-label">公证机构：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.notarialOffice || ""}}</Col>
            </Row>
            <Row v-if="defaultData.info.evidType=='EC'">
                <Col span="5" class="left-label">固证时间：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.curingTime || ""}}</Col>
            </Row>
            <Row v-if="defaultData.info.evidType!='EC'">
                <Col span="5" class="left-label">落款时间：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.notarialObtainDate || ""}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">侵权产品数量：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.productNum || ""}}</Col></Row>
            <Row v-if="clueDetail.tortType.indexOf('E')>-1">
                <Col span="5" class="left-label">单价：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.infoAddition.productPrice || "")}}</Col>
            </Row>
            <Row v-if="clueDetail.tortType.indexOf('E')>-1">
                <Col span="5" class="left-label">销量：</Col><Col span="16" class="right-content">{{defaultData.infoAddition.productSaleNum}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">取证时间：</Col><Col span="16" class="right-content">{{defaultData.info.evidDate}}</Col></Row>
            <Row><Col span="5" class="left-label">取证地点：</Col><Col span="16" class="right-content">{{defaultData.info.evidAddress}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">{{defaultData.info.evidType=='EC'?"取证费":"公证费"}}：</Col>
                <Col span="16" class="right-content">{{common.formateNumber(defaultData.info.notarialFees || "")}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">{{defaultData.info.evidType=='EC'?"取证费发票":"公证费发票"}}：</Col>
                <Col span="16" class="right-content">
                    <file-upload :defaultList="defaultData.notarialFeeAttachments || []" :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">购物费：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.info.shoppingFees || "")}}</Col></Row>
            <Row><Col span="5" class="left-label">购物费发票：</Col>
                <Col span="16" class="right-content">
                    <file-upload :defaultList="defaultData.shoppingFeeAttachments || []" :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">其它费用：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.info.otherFees || "")}}</Col></Row>
            <Row><Col span="5" class="left-label">公证书附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload :defaultList="defaultData.notarialDeedAttachments || []" :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">公证物附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload :defaultList="defaultData.evidAttachments || []" :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
    </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            uploadConfig:{
                readOnly:true
            },
        }
    },
    props: ['defaultData','clueDetail'],
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
