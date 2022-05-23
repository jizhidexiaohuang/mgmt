<template>
    <div v-if="investigatorDetail">
        <Row class="detail-header" v-if="tabsActive==='baseInfo'">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content"  v-if="tabsActive==='baseInfo'">
            <Row><Col span="5" class="left-label">姓名：</Col><Col span="16" class="right-content">{{investigatorDetail.name}}</Col></Row>
            <Row><Col span="5" class="left-label">性别：</Col><Col span="16" class="right-content">{{investigatorDetail.sexName}}</Col></Row>
            <Row><Col span="5" class="left-label">证件类型：</Col><Col span="16" class="right-content">{{investigatorDetail.certificateTypeName}}</Col></Row>
            <Row><Col span="5" class="left-label">证件号码：</Col><Col span="16" class="right-content">{{investigatorDetail.certificateNumber}}</Col></Row>
            <Row><Col span="5" class="left-label">机构名称：</Col><Col span="16" class="right-content">{{investigatorDetail.company}}</Col></Row>
            <Row><Col span="5" class="left-label">手机号：</Col><Col span="16" class="right-content">{{investigatorDetail.mobile}}</Col></Row>
            <Row><Col span="5" class="left-label">电子邮箱：</Col><Col span="16" class="right-content">{{investigatorDetail.mail}}</Col></Row>
            <Row><Col span="5" class="left-label">地址：</Col><Col span="16" class="right-content">{{investigatorDetail.provinceName}}{{investigatorDetail.cityName}}{{investigatorDetail.areaName}}{{investigatorDetail.address}}</Col></Row>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='businessInfo'">
            <span>分类信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='businessInfo'">
            <Row><Col span="5" class="left-label">行业偏好：</Col><Col span="16" class="right-content">{{industry}}</Col></Row>
            <Row><Col span="5" class="left-label">研发能力：</Col><Col span="16" class="right-content">{{investigatorDetail.teamInfo.hasResearchDevelopAbilityName}}</Col></Row>
            <!-- <Row><Col span="5" class="left-label">业务优势：</Col><Col span="16" class="right-content">{{businessForte}}</Col></Row> -->
            <Row><Col span="5" class="left-label">级别：</Col><Col span="16" class="right-content">{{investigatorDetail.teamInfo.levelName}}</Col></Row>
            <Row><Col span="5" class="left-label">调查区域：</Col><Col span="16" class="right-content">{{location}}</Col></Row>
        </Row>
        <Row class="detail-header" v-if="tabsActive==='businessInfo'">
            <span>补充信息</span>
        </Row>
        <Row class="detail-content" v-if="tabsActive==='businessInfo'" style="margin-bottom:20px;">
            <Row><Col span="5" class="left-label">内外属性：</Col><Col span="16" class="right-content">{{investigatorDetail.teamInfo.externalName}}</Col></Row>
            <Row><Col span="5" class="left-label">备注信息：</Col><Col span="16" class="right-content">{{investigatorDetail.teamInfo.note}}</Col></Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isEditInvestigator:false,
        }
    },
    props: ['investigatorDetail','tabsActive'],
    computed:{
        industry(){
            if(this.investigatorDetail.teamInfo.industryList&&this.investigatorDetail.teamInfo.industryList.length>0){
                let industry = this.investigatorDetail.teamInfo.industryList.map(item=>{
                    return item.industryName;
                })
                return industry.join('，');
            }else{
                return '';
            }
        },
        businessForte(){
            let businessForte = this.investigatorDetail.businessForteList.map(item=>{
                return item.businessForteName;
            })
            return businessForte.join('，');
        },
        location(){
            if(this.investigatorDetail.teamInfo.locationList&&this.investigatorDetail.teamInfo.locationList.length>0){
                let location = [],json={};
                this.investigatorDetail.teamInfo.locationList.forEach(item=>{
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
                return "";
            }
        }
    },
    methods: {
        
    },
    created(){},
    beforeMount(){},
    mounted(){console.log(this.investigatorDetail)},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
