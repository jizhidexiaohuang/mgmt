<template>
    <div class="case-progress">
        <div class="case-progress-left">
            <!-- <Button @click="tabActive='LL'">发函</Button>
            <Button @click="tabActive='PN_BB'">诉讼方案</Button>
            <Button @click="tabActive='RR'">起诉</Button>
            <Button @click="tabActive='PL'">庭前准备</Button>
            <Button @click="tabActive='CG_CG'">庭审</Button>
            <Button @click="tabActive='JT_BB'">判决</Button>
            <Button @click="tabActive='CO_CO'">执行</Button>
            <Button @click="tabActive='ST_DL'">到款</Button>
            <Button @click="tabActive='EC_EC'">结案</Button>
            <Button @click="tabActive='ME_AP'">调解</Button>
            <Button @click="tabActive='RE_AP'">和解</Button>
            <Button @click="tabActive='WD_AP'">撤诉</Button> -->

            <Timeline class="time-line-body">
                <TimelineItem v-for="(item,index) in processList" :key="index">
                    <Icon v-if="item.state!=0" type="ios-radio-button-on" :size="18" :color="styles.globalMainColor" slot="dot"/>
                    <Icon v-else type="md-radio-button-off" :size="18" :color="styles.borderColor" slot="dot"/>
                    <Row class="line-content">
                        <Row class="line-right">
                            <span @click="item.state==0?'':chooseNode(item.code,item.processId,item.state)" :class="['line-name',item.state==0?'not-arrived':'']">{{item.name}}</span>
                        </Row>
                        <Row class="line-detail" v-for="log in item.logList" :key="log.id">
                            <span class="line-date">{{common.formatTime(log.operateTime,4)}}</span>
                            <span :class="['line-text',log.style]">{{log.content}}</span>
                        </Row>
                    </Row>
                </TimelineItem>
            </Timeline>
        </div>
        <div class="case-progress-right">
            <send-letter v-if="tabActive=='LL'" :processId="processId"></send-letter>
            <lawsuit-programme v-if="tabActive=='PN_BB'" :processId="processId" v-bind="$attrs" :caseId="caseId" :projectId="projectId"></lawsuit-programme>
            <prosecute v-if="tabActive=='RR'" :processId="processId" :processState="processState"></prosecute>
            <pretrial v-if="tabActive=='PL'" :processId="processId" :processState="processState"></pretrial>
            <case-trial v-if="tabActive=='CG_CG'" :processId="processId"></case-trial>
            <adjudicate v-if="tabActive=='JT_BB'" :processId="processId"></adjudicate>
            <carry-out v-if="tabActive=='CO_CO'" :processId="processId"></carry-out>
            <paymentConfirmation v-if="tabActive=='ST'" :processId="processId" :caseId="caseId" v-bind="$attrs" @reloadProcess="reloadProcess"></paymentConfirmation>
            <close-case v-if="tabActive=='EC_EC'" :processId="processId" v-bind="$attrs"></close-case>
            <mediate v-if="tabActive=='ME_AP'" :key="processId" :processId="processId" v-bind="$attrs"></mediate>
            <compromise v-if="tabActive=='RE_AP'" :key="processId" :processId="processId" v-bind="$attrs"></compromise>
            <withdraw v-if="tabActive=='WD_AP'" :key="processId" :processId="processId" v-bind="$attrs" @reloadProcess="reloadProcess"></withdraw>
        </div>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import carryOut from '../civilCase/carryOut/index.vue';
import caseTrial from '../civilCase/caseTrial/index.vue';
import sendLetter from '../civilCase/sendLetter/sendLetter.vue';
import lawsuitProgramme from '../civilCase/lawsuitProgramme/index.vue';
import prosecute from '../civilCase/prosecute/index.vue';
import pretrial from '../civilCase/pretrial/index.vue';
import adjudicate from '../civilCase/adjudicate/index.vue';
import paymentConfirmation from '../civilCase/paymentConfirmation/index.vue';
import closeCase from "../civilCase/closeCase/index.vue";
import mediate from "../civilCase/listOptions/mediate.vue";
import compromise from "../civilCase/listOptions/compromise.vue";
import withdraw from '../civilCase/listOptions/withdraw.vue';
export default {
    inheritAttrs:false,
    data () {
        return {
            styles:styles,
            tabActive:'',
            processId:'',
            processState:'',
            processList:[]
        }
    },
    props: ['caseId','projectId'],
    methods: {
        chooseNode(code,id,state){
            this.tabActive = code;
            this.processId = id;
            this.processState = state;
        },
        getCaseProcess(){
            let url = '/business/case/process?caseId='+this.caseId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.processList = res.data;
                    let index = 0;
                    for(let i = 0; i<this.processList.length; i++){
                        if(this.processList[i].state == 0){
                            index = i;
                            break;
                        }else{
                            index = this.processList.length;
                        }
                    }
                    this.tabActive = this.processList[index-1].code;
                    this.processId = this.processList[index-1].processId;
                    this.processState = this.processList[index-1].state;
                }
            })
        },
        reloadProcess(){
            this.tabActive = "";
            this.getCaseProcess();
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getCaseProcess();
    },
    updated(){},
    components: {
        carryOut,
        caseTrial,
        sendLetter,
        lawsuitProgramme,
        prosecute,
        pretrial,
        adjudicate,
        paymentConfirmation,
        closeCase,
        mediate,
        compromise,
        withdraw
    },
    watch: {}
}
</script>
<style scoped lang="scss">
 @import '../case/caseProgress.scss';
</style>
