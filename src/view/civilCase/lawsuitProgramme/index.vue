<template>
    <div class="lawsuit-programme">
        <Row class="detail-header">
            <span>诉讼方案</span>
            <ButtonGroup size="small" class="lawsuit-btn">
                <Button @click="tabActive='lawsuitPlan'" :type="tabActive=='lawsuitPlan'?'primary':'default'">填写材料</Button>
                <Button @click="tabActive='senDdata'" :disabled="disabledCtrl" :type="tabActive=='senDdata'?'primary':'default'">材料寄送</Button>
            </ButtonGroup>
        </Row>
        <Row class="lawsuit-form">
            <lawsuit-plan v-if="tabActive=='lawsuitPlan'" v-bind="$attrs" :processId="processId" :caseId="caseId" :projectId="projectId" @getAuditState="getState"></lawsuit-plan>
            <send-data v-else :processId="processId" :caseId="caseId"></send-data>
        </Row>
    </div>
</template>
<script>
import lawsuitPlan from './lawsuitPlan.vue';
import sendData from './sendData.vue';
export default {
    data () {
        return {
            tabActive:'lawsuitPlan',
            disabledCtrl:true
        }
    },
    props: ['processId','caseId','projectId'],
    methods: {
        getState(state){
            if(state){
                this.disabledCtrl = false;
            }else{
                this.disabledCtrl = true;
            }
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
       
    },
    updated(){},
    components: {
        lawsuitPlan,
        sendData
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/globalStyle.scss';
@import '../caseCommon.scss';
.lawsuit-programme{
    .lawsuit-form{
        margin-top:10px;
        padding-top:10px;
        border-top:1px solid $borderColor;
    }
}
</style>
