<template>
    <div v-if="lawyerDetail">
        <Row class="detail-header" v-if="tabsActive==='baseInfo'">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='baseInfo'">
            <Row><Col span="5" class="left-label">姓名：</Col><Col span="16" class="right-content">{{lawyerDetail.name}}</Col></Row>
            <Row><Col span="5" class="left-label">性别：</Col><Col span="16" class="right-content">{{lawyerDetail.sexName}}</Col></Row>
            <Row><Col span="5" class="left-label">证件类型：</Col><Col span="16" class="right-content">{{lawyerDetail.certificateTypeName}}</Col></Row>
            <Row><Col span="5" class="left-label">证件号码：</Col><Col span="16" class="right-content">{{lawyerDetail.certificateNumber}}</Col></Row>
            <Row><Col span="5" class="left-label">律所机构：</Col><Col span="16" class="right-content">{{lawyerDetail.practiceInfo.lawOffice}}</Col></Row>
            <Row><Col span="5" class="left-label">联系方式：</Col><Col span="16" class="right-content">{{lawyerDetail.mobile}}</Col></Row>
            <Row><Col span="5" class="left-label">电子邮箱：</Col><Col span="16" class="right-content">{{lawyerDetail.mail}}</Col></Row>
            <Row><Col span="5" class="left-label">地址：</Col><Col span="16" class="right-content">{{lawyerDetail.provinceName}}{{lawyerDetail.cityName}}{{lawyerDetail.areaName}}{{lawyerDetail.address}}</Col></Row>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='baseInfo'">
            <span>执业信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='baseInfo'">
            <Row><Col span="5" class="left-label">执业证号：</Col><Col span="16" class="right-content">{{lawyerDetail.practiceInfo.lawLicense}}</Col></Row>
            <Row><Col span="5" class="left-label">执业领域：</Col><Col span="16" class="right-content">{{skill}}</Col></Row>
            <Row><Col span="5" class="left-label">个人简介：</Col><Col span="16" class="right-content">{{lawyerDetail.remark}}</Col></Row>
            <Row><Col span="5" class="left-label">上传证件：</Col>
                <Col span="16" class="right-content">
                    <file-upload :defaultList="lawyerDetail.qualifications || []" :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='baseInfo'">
            <span>历史单位</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='baseInfo'">
            <Row v-for="item in lawyerDetail.officeList" :key="item.id">
                <Col span="5" class="left-label">{{item.startDate}}</Col>
                <Col span="2" style="text-align:center;">至</Col>
                <Col span="5" class="right-content">{{item.endDate}}</Col>
                <Col span="11">{{item.lawOffice}}</Col>
            </Row>
            <Col offset="2" span="5" style="margin-bottom:10px;" v-if="lawyerDetail.officeList.length==0">暂无</Col>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='businessInfo'">
            <span>能力信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='businessInfo'">
            <Row><Col span="5" class="left-label">行业偏好：</Col><Col span="16" class="right-content">{{industry}}</Col></Row>
            <Row><Col span="5" class="left-label">调查能力：</Col><Col span="16" class="right-content">{{lawyerDetail.teamInfo.inquiryAbilityName}}</Col></Row>
            <Row><Col span="5" class="left-label">调查类型：</Col><Col span="16" class="right-content">{{inquiryType}}</Col></Row>
            <Row><Col span="5" class="left-label">调查区域：</Col><Col span="16" class="right-content">{{location}}</Col></Row>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='businessInfo'">
            <span>补充信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='businessInfo'" style="margin-bottom:20px;">
            <Row><Col span="5" class="left-label">内外属性：</Col><Col span="16" class="right-content">{{lawyerDetail.teamInfo.externalName}}</Col></Row>
            <Row><Col span="5" class="left-label">售卖权利：</Col><Col span="16" class="right-content">{{lawyerDetail.teamInfo.isToSaleName}}</Col></Row>
            <Row><Col span="5" class="left-label">备注信息：</Col><Col span="16" class="right-content">{{lawyerDetail.teamInfo.note}}</Col></Row>
        </Row>
    </div>
</template>
<script>
import fileUpload from '../../../components/common/fileUpload/fileUpload'
export default {
    data () {
        return {
            isEditLawyer:false,
            uploadConfig:{
                readOnly:true
            },
        }
    },
    props: ['lawyerDetail','tabsActive'],
    computed:{
        skill(){
            if(this.lawyerDetail.skillList&&this.lawyerDetail.skillList.length>0){
                let skill = this.lawyerDetail.skillList.map(item=>{
                    return item.skillName;
                })
                return skill.join('，');
            }else{
                return "";
            }
        },
        industry(){
            if(this.lawyerDetail.teamInfo.industryList&&this.lawyerDetail.teamInfo.industryList.length>0){
                let industry = this.lawyerDetail.teamInfo.industryList.map(item=>{
                    return item.industryName;
                })
                return industry.join('，');
            }else{
                return '';
            }
        },
        inquiryType(){
            if(this.lawyerDetail.teamInfo.inquiryTypeList&&this.lawyerDetail.teamInfo.inquiryTypeList.length>0){
                let inquiryType = this.lawyerDetail.teamInfo.inquiryTypeList.map(item=>{
                    return item.inquiryTypeName;
                })
                return inquiryType.join('，');
            }else{
                return '';
            }
        },
        location(){
            if(this.lawyerDetail.teamInfo.locationList&&this.lawyerDetail.teamInfo.locationList.length>0){
                let location = [],json={};
                this.lawyerDetail.teamInfo.locationList.forEach(item=>{
                    if(item.flag){
                        if(!json[item.province]){
                            json[item.province] = item.provinceName;
                        }
                    }else{
                        location.push(item.cityName)
                    }
                })
                for(let key in json){
                    location.push(json[key]);
                }
                return location.join('，');
            }else{
                return '';
            }
        }
    },
    methods: {
        
    },
    created(){},
    beforeMount(){},
    mounted(){console.log(this.lawyerDetail)},
    updated(){},
    components: {fileUpload},
    watch: {}
}
</script>
<style>
 
</style>
