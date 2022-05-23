<template>
    <div>
        <Row class="detail-header">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content">
            <slot name="code-label"></slot>
            <!-- template1 实体店铺 工厂 其他-->
            <div v-if="clueDetail.tortType&&clueDetail.tortType.indexOf('S')!='-1'">
                <Row>
                    <Col span="3" class="left-label">侵权方式：</Col>
                    <Col span="8" class="right-content">{{$t("tort_type."+clueDetail.tortType)}}</Col>
                    <Col span="3" class="left-label">店铺名称：</Col>
                    <Col span="8" class="right-content textover" :title="clueDetail.storeName">{{clueDetail.storeName}}</Col>
               
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">侵权产品：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.clueProduct" :title="clueDetail.clueProduct.productName">{{clueDetail.clueProduct.productName}}</Col>
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">销量：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{clueDetail.clueProduct.saleNum}}</Col>
              
                    <Col span="3" class="left-label" v-if="clueDetail.hasProduct">产品单价：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{common.formateNumber(clueDetail.clueProduct.price || "")}}</Col>
                    <Col span="3" class="left-label">调查时间：</Col>
                    <Col span="8" class="right-content">{{clueDetail.surveyDate}}</Col>
                    <Col span="3" class="left-label">调查地址：</Col>
                    <Col span="8" class="right-content textover" 
                        :title="clueDetail.provinceName+clueDetail.cityName+clueDetail.areaName+clueDetail.address">
                        {{clueDetail.provinceName}}{{clueDetail.cityName}}{{clueDetail.areaName}}{{clueDetail.address}}</Col>
                </Row>
            </div>
            <!-- template2 电商平台-->
            <div v-if="clueDetail.tortType=='E_EC'">
                <Row>
                    <Col span="3" class="left-label">侵权方式：</Col>
                    <Col span="8" class="right-content">{{$t("tort_type."+clueDetail.tortType)}}</Col>
                    <Col span="3" class="left-label">销售渠道：</Col>
                    <Col span="8" class="right-content">
                        {{$t("ec_channel."+clueDetail.channelType)}}
                    </Col>
                    <Col span="3" class="left-label" v-if="clueDetail.channelType=='OT'">平台名称：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.channelType=='OT'" :title="clueDetail.platformName">{{clueDetail.platformName}}</Col>

                    <Col span="3" class="left-label">店铺名称：</Col>
                    <Col span="8" class="right-content textover" :title="clueDetail.storeName">
                        {{clueDetail.storeName}} {{clueDetail.channelType=='TT'||clueDetail.channelType=='PD'?'---'+(clueDetail.dispenser || ''):''}}</Col>
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">侵权产品：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.clueProduct" :title="clueDetail.clueProduct.productName">{{clueDetail.clueProduct.productName}}</Col>
               
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">销量：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{clueDetail.clueProduct.saleNum}}</Col>
                    <Col span="3" class="left-label" v-if="clueDetail.channelType=='AL'">起批量：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.channelType=='AL'&&clueDetail.clueProduct">{{clueDetail.clueProduct.batchNum}}</Col>
               
                    <Col span="3" class="left-label">调查时间：</Col>
                    <Col span="8" class="right-content">{{clueDetail.surveyDate}}</Col>
                    <Col span="3" class="left-label">店铺链接：</Col>
                    <Col span="8" class="right-content textover" :title="clueDetail.storeUrl"><a :href="clueDetail.storeUrl" target="_blank">{{clueDetail.storeUrl}}</a></Col>
                
                    <Col span="3" class="left-label" v-if="clueDetail.hasProduct">产品链接：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.clueProduct" :title="clueDetail.clueProduct.productUrl">
                        <a :href="clueDetail.clueProduct.productUrl" target="_blank">{{clueDetail.clueProduct.productUrl}}</a>
                    </Col>
                    <Col span="3" class="left-label" v-if="clueDetail.hasProduct">产品单价：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{common.formateNumber(clueDetail.clueProduct.price || "")}}</Col>
                </Row>
            </div>
            <!-- template3 网页链接-->
            <div v-if="clueDetail.tortType=='E_WL'">
                <Row>
                    <Col span="3" class="left-label">侵权方式：</Col>
                    <Col span="8" class="right-content">{{$t("tort_type."+clueDetail.tortType)}}</Col>
                    <Col span="3" class="left-label">店铺名称：</Col>
                    <Col span="8" class="right-content textover" :title="clueDetail.storeName">{{clueDetail.storeName}}</Col>
               
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">侵权产品：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.clueProduct" :title="clueDetail.clueProduct.productName">{{clueDetail.clueProduct.productName}}</Col>
                    <Col span="3" class="left-label" v-if="clueDetail.clueProduct">销量：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{clueDetail.clueProduct.saleNum}}</Col>
               
                    <Col span="3" class="left-label">调查时间：</Col>
                    <Col span="8" class="right-content">{{clueDetail.surveyDate}}</Col>
                    <Col span="3" class="left-label">店铺链接：</Col>
                    <Col span="8" class="right-content textover" :title="clueDetail.storeUrl"><a :href="clueDetail.storeUrl" target="_blank">{{clueDetail.storeUrl}}</a></Col>
               
                    <Col span="3" class="left-label" v-if="clueDetail.hasProduct">产品链接：</Col>
                    <Col span="8" class="right-content textover" v-if="clueDetail.hasProduct" :title="clueDetail.clueProduct.productUrl">
                        <a :href="clueDetail.clueProduct.productUrl" target="_blank">{{clueDetail.clueProduct.productUrl}}</a>
                    </Col>
                    <Col span="3" class="left-label" v-if="clueDetail.hasProduct">产品单价：</Col>
                    <Col span="8" class="right-content" v-if="clueDetail.clueProduct">{{common.formateNumber(clueDetail.clueProduct.price || "")}}</Col>
                </Row>
            </div>
            <Row>
                <Col span="3" class="left-label">备注：</Col>
                <Col span="20" class="right-content textover" :title="clueDetail.remark">{{clueDetail.remark}}</Col>
            </Row>
            <Row>
                <Col span="3" class="left-label">附件：</Col>
                <Col span="20" class="right-content">
                    <file-upload 
                    :defaultList="clueDetail.attachmentList || []" 
                    :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
            <Row class="detail-header">
                <span>销售商</span>
            </Row>
            <Row v-for="(bussiness ,index) in tortList" :key="index">
                <tort-subject-info :defaultData="bussiness">
                    <div slot="info-title"><Col span="24" class="tortSubject-sub-title" :style="{color:mainColor.globalMainColor}">[ 销售商{{index+1}} ]</Col></div>
                </tort-subject-info>
            </Row>
            <Row class="no-tips" v-if="tortList.length==0">暂无销售商</Row>
            <Row class="detail-header">
                <span>生产商</span>
            </Row>
            <div v-if="clueManufacturerList">
                <Row v-for="(Manufacturer,index) in clueManufacturerList" :key="Manufacturer.id">
                    <tort-subject-info :defaultData="Manufacturer">
                        <div slot="info-title"><Col span="24" class="tortSubject-sub-title" :style="{color:mainColor.globalMainColor}">[ 生厂商{{index+1}} ]</Col></div>
                    </tort-subject-info>
                </Row>
            </div>
            <Row class="no-tips" v-if="clueManufacturerList.length==0">暂无生产商</Row>
        </Row>
    </div>
</template>
<script>
import fileContainer from '@/components/common/fileContainer/fileContainer.vue';
import tortSubjectInfo from '@/view/clue/myManage/plugin/tortSubjectInfo.vue';
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            mainColor:styles,
            detail:'',
            type:2,
            uploadConfig:{
                readOnly:true
            }
        }
    },
    computed:{
        tortList(){
            if(!this.clueDetail || !this.clueDetail.clueTortSubjectList){return []}
            return this.clueDetail.clueTortSubjectList.filter((item,index)=>{
                return item.category == "S"
            })
        },
        clueManufacturerList(){
            if(!this.clueDetail || !this.clueDetail.clueTortSubjectList){return []}
            return this.clueDetail.clueTortSubjectList.filter((item,index)=>{
                return item.category == "M"
            })
        }
    },
    props:['clueDetail'],

    methods: {
        
    },
    created(){

    },
    beforeMount(){

    },
    mounted(){

    },
    updated(){

    },
    components: {
        fileContainer,
        tortSubjectInfo
    },
    watch: {

    }
}
</script>
<style lang="scss" scoped>
.tortSubject-sub-title{
    padding:5px 0px 10px 20px;
    font-weight: 700;
}
</style>
<style scoped lang="sass">
 @import './clueInfo.scss'
</style>