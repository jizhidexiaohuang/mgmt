<template>
    <div class="case-detail">
        <div class="more-options" v-if="optionsCtrl">
            <Dropdown transfer class="edit-icon" @on-click="option(caseDetail,$event)" v-permission="[$route.path]">
                <a href="javascript:void(0)">
                    <Icon type="ios-more" size="20"/>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="terminated" v-if="caseDetail.state==='HH'">终止</DropdownItem>
                    <DropdownItem name="recovery" v-if="caseDetail.state==='TN'">恢复</DropdownItem>
                    <DropdownItem name="auditStopApply" v-if="caseDetail.terminationState==='P'">审核终止申请</DropdownItem>
                    <DropdownItem name="related">关联案件</DropdownItem>
                    <DropdownItem name="caseNotes">备忘</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <slot name='close-icon'></slot>
        <div class="case-title">{{caseDetail.code}}</div>
        <div class="case-content">
            <Row class="case-detail-row">
                <Col span="2" class="right-label">项目：</Col><Col span="6" class="right-content">{{caseDetail.projectName}}</Col>
                <Col span="2" class="right-label">承办团队：</Col><Col span="14" class="right-content">{{caseDetail.caseTakerName}}</Col>
                <Col span="2" class="right-label">案件备注：</Col><Col span="21" class="right-content">{{caseDetail.remark}}</Col>
            </Row>
        </div>
        <div class="case-detail-box" :style="{height:'calc(100% - '+otherHeight+')'}">
            <Row class="case-detail-tabs">
                <ul class="tabs-bar common-tabs-bar">
                    <li :class="[tabsActive=='clueInfo'?'active':'']" @click="tabsActive='clueInfo';">线索详情</li>
                    <li :class="[tabsActive=='litigant'?'active':'']" @click="tabsActive='litigant';">对方当事人</li>
                    <li :class="[tabsActive=='caseEvidence'?'active':'']" @click="tabsActive='caseEvidence';">案件证据</li>
                    
                    <li v-if="caseDetail.type=='CL'" :class="[tabsActive=='civilCase'?'active':'']" @click="tabsActive='civilCase';">案件流程</li>
                    <li v-if="caseDetail.type=='AC'" :class="[tabsActive=='administrativeCase'?'active':'']" @click="tabsActive='administrativeCase';">案件流程</li>
                    <li v-if="caseDetail.type=='CC'" :class="[tabsActive=='criminalCase'?'active':'']" @click="tabsActive='criminalCase';">案件流程</li>

                    <li :class="[tabsActive=='agreement'?'active':'']" @click="tabsActive='agreement';">案件结算协议</li>
                    <li :class="[tabsActive=='caseJournal'?'active':'']" @click="tabsActive='caseJournal';">案件日志</li>
                    <li :class="[tabsActive=='caseNotes'?'active':'']" @click="tabsActive='caseNotes';">案件备忘</li>
                </ul>
            </Row>
            <Row class="case-detail-container">
                <clue-info v-if="tabsActive==='clueInfo'" :clueDetail="clueDetail">
                    <Row slot="code-label">
                        <Col span="3" class="left-label">线索编号：</Col>
                        <Col span="8" class="right-content">{{clueDetail.code}}</Col>
                        <Col span="3" class="left-label">报备团队：</Col>
                        <Col span="8" class="right-content">{{clueDetail.team}}团队</Col>
                    </Row>
                </clue-info>
                <litigant v-if="tabsActive==='litigant'" :caseId="caseDetail.id"></litigant>
                <case-evidence v-if="tabsActive==='caseEvidence'" :caseId="caseDetail.id" :clueDetail="clueDetail"></case-evidence>

                <civil-case-progress v-if="tabsActive==='civilCase'" :caseId="caseDetail.id" :projectId="caseDetail.projectId"></civil-case-progress>
                <administrative-case-progress v-if="tabsActive==='administrativeCase'" :caseId="caseDetail.id" :projectId="caseDetail.projectId"></administrative-case-progress>
                <criminal-case-progress v-if="tabsActive==='criminalCase'" :caseId="caseDetail.id" :projectId="caseDetail.projectId"></criminal-case-progress>

                <div v-if="tabsActive==='agreement'">
                    <Tabs :animated="false" style="padding-top:10px;">
                        <TabPane label="调查协议">
                            <investigator-agreement-info v-if="tabsActive==='agreement'" :detail="investAgreementDetail"></investigator-agreement-info>
                        </TabPane>
                        <TabPane label="律师协议">
                            <lawyer-agreement-info v-if="tabsActive==='agreement'" :agreementDetail="agreementDetail"></lawyer-agreement-info>
                        </TabPane>
                    </Tabs>
                </div>
                <case-journal v-if="tabsActive==='caseJournal'" :caseId="caseDetail.id"></case-journal>
                <case-notes v-if="tabsActive==='caseNotes'" :caseId="caseDetail.id"></case-notes>
            </Row>
        </div>

        <list-options :id="caseDetail.id" :type="type" :applicationNote="caseDetail.applicationNote" @reloadList="changeCtrl"></list-options>
    </div>
</template>
<script>
import clueInfo from './../clue/myManage/clueInfo.vue';
import litigant from './litigant.vue';
import caseEvidence from './caseEvidence.vue';
import investigatorAgreementInfo from './../agreement/investigatorAgreementInfo';
import lawyerAgreementInfo from "./../agreement/lawyerAgreementInfo.vue";
import caseJournal from './caseJournal.vue';
import caseNotes from './caseNotes.vue';
import listOptions from './plugins/listOptions.vue';
import civilCaseProgress from '../civilCase/index.vue';
import administrativeCaseProgress from '../administrativeCase/index.vue';
import criminalCaseProgress from '../criminalCase/index.vue';
export default {
    data () {
        return {
            tabsActive:'clueInfo',
            clueDetail:'',
            investAgreementDetail:'',
            agreementDetail:'',
            type:'',
            otherHeight:'',
        }
    },
    props: ['caseDetail','optionsCtrl'],
    methods: {
        option(row,name){
            this.type = name;
        },
        //关闭弹框
        changeCtrl(isReload){
            if(this.tabsActive==='caseNotes'&&this.type==='caseNotes'){
                this.$eventBus.$emit('refresh');
            }
            this.type = '';
        },
        getClueDetail(){
            let url = '/business/clue/view/'+this.caseDetail.clueId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.clueDetail = res.data;
                }
            })
        },
        getLawyerArgreement(){
            let url = `/settlement/agreement-price-lawyers/${this.caseDetail.lawyerPriceId}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.agreementDetail = res.data;
                }
            })
        },
        getInvestigatorArgreement(){
            let url = `/settlement/agreement-price-investigator/${this.caseDetail.investigatorPriceId}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.investAgreementDetail = res.data;
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.otherHeight = (document.getElementsByClassName('case-content')[0].offsetHeight + 45) + 'px';
        this.tabsActive = this.caseDetail.type=='CL'?'civilCase':(this.caseDetail.type=='AC'?'administrativeCase':'criminalCase');
        this.getClueDetail();
        this.getLawyerArgreement();
        this.getInvestigatorArgreement();
    },
    updated(){},
    components: {
        clueInfo,
        litigant,
        caseEvidence,
        investigatorAgreementInfo,
        lawyerAgreementInfo,
        caseNotes,
        caseJournal,
        listOptions,
        civilCaseProgress,
        administrativeCaseProgress,
        criminalCaseProgress
    },
    watch: {}
}
</script>
<style scoped lang="scss">
 @import './caseDetail.scss';
</style>