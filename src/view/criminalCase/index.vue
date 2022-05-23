<template>
    <div class="case-progress">
        <div class="case-progress-left">
            <!-- <Button @click="tabActive='LL'">刑事申请</Button>
            <Button @click="tabActive='PN_BB'">立案</Button>
            <Button @click="tabActive='RR'">侦查行动</Button>
            <Button @click="tabActive='PL'">审查起诉</Button>
            <Button @click="tabActive='CG_CG'">判决</Button>
            <Button @click="tabActive='JT_BB'">结案</Button> -->

            <Timeline class="time-line-body">
                <TimelineItem v-for="(item,index) in processList" :key="index">
                    <Icon v-if="item.state!=0" type="ios-radio-button-on" :size="18" :color="styles.globalMainColor" slot="dot"/>
                    <Icon v-else type="md-radio-button-off" :size="18" :color="styles.borderColor" slot="dot"/>
                    <Row class="line-content">
                        <Row class="line-right">
                            <span @click="item.state==0?'':chooseNode(item.code,item.processId,item.state)" :class="['line-name',item.state==0?'not-arrived':'']">{{item.name}}</span>

                            <Button @click="item.state==0?'':chooseOptionalNode(optional.code,item.processId,optional.id)" v-for="optional in item.optionalNode" :key="optional.id"
                                v-if="(!optional.flag)"
                             class="list-options" :disabled="item.state!==1" size="small" type="warning">{{optional.name}}</Button>
                        </Row>
                        
                        <Row class="line-detail" v-for="log in item.logList" :key="log.id">
                            <span class="line-date">{{common.formatTime(log.operateTime,4)}}</span>
                            <span :class="['line-text',log.style]">{{log.content}}</span>
                        </Row>

                        <Row class="line-detail" v-if="item.flag">
                            <Row class="judgment-result-text">判决后我方决定</Row>
                            <RadioGroup v-model="judgmentResult">
                                <Radio v-for="result in judgmentResultStatusArr" :key="result.id" :label="result.value">{{result.nameZh}}</Radio>
                            </RadioGroup>
                            <Button @click="checkJudgmentResult(item.processId)" size="small" type="warning">确定</Button>
                        </Row>
                    </Row>
                </TimelineItem>
            </Timeline>
        </div>
        <div class="case-progress-right">
            <criminal-apply v-if="tabActive=='CRAP'" :processId="processId" :caseId="caseId" @reloadProcess="reloadProcess"></criminal-apply>
            <set-up-case v-if="tabActive=='RR'" :processId="processId"></set-up-case>
            <investigative-action v-if="tabActive=='INVE'" :processId="processId"></investigative-action>
            <review-and-prosecution v-if="tabActive=='REPR'" :processId="processId"></review-and-prosecution>
            <adjudicate v-if="tabActive=='JT_BB'" :processId="processId"></adjudicate>
            <mediate v-if="tabActive=='ME_AP'" :key="processId" :processId="processId" :caseId="caseId" :nodeId="nodeId" :processState="processState"></mediate>
            <compromise v-if="tabActive=='RE_AP'" :key="processId" :processId="processId" :caseId="caseId" :nodeId="nodeId"></compromise>
            <payment-confirmation v-if="tabActive=='ST'" :processId="processId" :caseId="caseId" @reloadProcess="reloadProcess"></payment-confirmation>
            <close-case v-if="tabActive=='EC_EC'" :processId="processId"></close-case>
        </div>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import criminalApply from "./criminalApply/index.vue";
import setUpCase from "./setUpCase/index.vue";
import investigativeAction from "./investigativeAction/index.vue";
import reviewAndProsecution from "./reviewAndProsecution/index.vue";
import adjudicate from "./adjudicate/index.vue";
import mediate from "./listOptions/mediate.vue";
import compromise from "./listOptions/compromise.vue";
import paymentConfirmation from './paymentConfirmation/index.vue';
import closeCase from "./closeCase/index.vue";
export default {
    data () {
        return {
            styles:styles,
            tabActive:'',
            processId:'',
            nodeId:'',
            processState:'',
            processList:[],
            judgmentResultStatusArr:[],
            judgmentResult:'E'
        }
    },
    props: ['caseId','projectId'],
    methods: {
        //流程节点点击事件
        chooseNode(code,id,state){
            this.tabActive = code;
            this.processId = id;
            this.processState = state;
        },
        //节点options操作
        chooseOptionalNode(code,id,nodeId){
            this.tabActive = code;
            this.processId = id;
            this.nodeId = nodeId;
        },
        //获取案件进程节点
        getCaseProcess(){
            let url = '/business/case/process?caseId='+this.caseId;
            this.$get(url).then(async res=>{
                if(res.code===0){
                this.processList = res.data;
                    let index;
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
        criminalApply,
        setUpCase,
        investigativeAction,
        reviewAndProsecution,
        adjudicate,
        mediate,
        compromise,
        paymentConfirmation,
        closeCase
    },
    watch: {}
}
</script>
<style scoped lang="scss">
 @import '../case/caseProgress.scss';
</style>
