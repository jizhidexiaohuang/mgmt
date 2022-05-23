<template>
    <div class="project-info">
        <slot name='close-icon'></slot>
        <div class="project-title">{{detail.name}}</div>
        <div class="info-left">
            <slot name="options-box"></slot>
            <Row class="detail-content">
                <Row v-if="detail.parentName"><Col span="7" class="left-label">上级项目：</Col><Col span="16" class="right-content">{{detail.parentName}}</Col></Row>
                <Row><Col span="7" class="left-label">负责人：</Col><Col span="16" class="right-content">{{detail.managerName}}</Col></Row>
                <Row><Col span="7" class="left-label">协作人：</Col><Col span="16" class="right-content">{{detail.cooperatName}}</Col></Row>
                <Row><Col span="7" class="left-label">创建人：</Col><Col span="16" class="right-content">{{detail.createName}}</Col></Row>
                <Row><Col span="7" class="left-label">创建时间：</Col><Col span="16" class="right-content">{{detail.createTime.replace('T',' ')}}</Col></Row>
                <Row><Col span="7" class="left-label">项目等级：</Col><Col span="16" class="right-content">{{detail.rankName}}</Col></Row>
                <Row><Col span="7" class="left-label">项目状态：</Col><Col span="16" class="right-content">{{detail.stateName}}</Col></Row>
                <Row><Col span="7" class="left-label">项目周期：</Col><Col span="16" class="right-content">{{detail.startDateStr}}--{{detail.endDateStr}}</Col></Row>
                <Row><Col span="7" class="left-label">客户：</Col><Col span="16" class="right-content">{{detail.customerName}}</Col></Row>
                <Row><Col span="7" class="left-label">项目备注：</Col><Col span="16" class="right-content">{{detail.remark}}</Col></Row>
            </Row>
        </div>
        <div class="info-right">
            <Row class="info-right-tabs">
                <ul class="tabs-bar common-tabs-bar">
                    <li :class="[tabsActive=='overview'?'active':'']" @click="tabsActive='overview';">项目概况</li>
                    <li :class="[tabsActive=='property'?'active':'']" @click="tabsActive='property';">知识产权</li>
                    <li :class="[tabsActive=='materials'?'active':'']" @click="tabsActive='materials';">材料清单</li>
                    <li :class="[tabsActive=='custAgreement'?'active':'']" @click="tabsActive='custAgreement';">客户协议</li>
                    <li :class="[tabsActive=='tortMap'?'active':'']" @click="tabsActive='tortMap';">侵权地图</li>
                    <li :class="[tabsActive=='setting'?'active':'']" @click="tabsActive='setting';">项目配置</li>
                </ul>
            </Row>
            <Row style="height:calc(100% - 49px);overflow:auto;">
                <intellectual-property v-if="tabsActive=='property'" :projectId="detail.id" :isAdd="detail.state!='A'"></intellectual-property>
                <materials-checklist v-if="tabsActive=='materials'" :projectId="detail.id" :isAdd="detail.state!='A'"></materials-checklist>
                <project-overview v-if="tabsActive=='overview'" :projectId="detail.id"></project-overview>
                <cust-agreement-info v-if="tabsActive=='custAgreement'" :custAgreementDetail="custAgreementDetail"></cust-agreement-info>
                <tort-map v-if="tabsActive=='tortMap'" :projectId="detail.id"></tort-map>
                <project-setting v-if="tabsActive=='setting'" :projectId="detail.id"></project-setting>
            </Row>
        </div>
    </div>
</template>
<script>
import projectOverview from './plugin/projectOverview.vue'
import materialsChecklist from "./plugin/materialsChecklist.vue";
import custAgreementInfo from '../agreement/custAgreementInfo.vue';
import intellectualProperty from "./plugin/intellectualProperty.vue";
import tortMap from "./plugin/tortMap.vue";
import projectSetting from "./plugin/projectSetting.vue";
export default {
    data () {
        return {
            tabsActive:'overview',
            custAgreementDetail:'',
            id:''
        }
    },
    props: ['detail'],
    methods: {
        getAgreementDetail(){
            let url = '/settlement/agreement/'+this.detail.agreementPriceId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.custAgreementDetail = res.data;
                }
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        if(this.detail.agreementPriceId){
            this.getAgreementDetail();
        }
    },
    updated(){},
    components: {
        projectOverview,
        materialsChecklist,
        custAgreementInfo,
        intellectualProperty,
        tortMap,
        projectSetting
    },
    watch: {
        tabsActive(newVal,oldVal){
            if(newVal==='custAgreement'&&this.detail.agreementPriceId){
                this.getAgreementDetail();
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import './projectInfo.scss';
</style>
