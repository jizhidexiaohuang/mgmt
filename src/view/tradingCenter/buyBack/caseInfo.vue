<template>
    <div>
        <Row class="first-title">{{caseDetail.code}}-{{caseDetail.projectName}}</Row>
        <Row class="detail-content">
            <Col span="3" class="left-label">承办团队：</Col>
            <Col span="19" class="right-content">{{caseDetail.caseTakerName}}</Col>
            <Col span="3" class="left-label">案件备注：</Col>
            <Col span="19" class="right-content textover">{{caseDetail.remark}}</Col>
        </Row>
        <Row>
            <clue-Info v-if="clueDetail" :clueDetail="clueDetail"></clue-Info>
        </Row>
        <Row class="detail-header">
            <span>案件证据</span>
        </Row>
        <Row v-if="caseDetail.id" class="evidence-box">
            <case-evidence :caseId="caseDetail.id" :clueDetail="clueDetail"></case-evidence>
        </Row>
    </div>
</template>
<script>
import clueInfo from '../../clue/myManage/clueInfo.vue';
import caseEvidence from '../../case/caseEvidence.vue';
export default {
    data () {
        return {
            clueDetail:""
        }
    },
    props:['caseDetail'],
    methods: {
        getClueDetail(){
            let url = '/business/clue/view/'+this.caseDetail.clueId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.clueDetail = res.data;
                }
            })
        },
    },
    created(){

    },
    beforeMount(){
        this.getClueDetail();
    },
    mounted(){

    },
    updated(){

    },
    components: {
        clueInfo,
        caseEvidence
    },
    watch: {

    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/globalStyle.scss';
.first-title{
    font-size: 16px;
    margin:10px 0;
    padding-left: 40px;
    font-weight: 500;
    color:$globalMainColor;
}
.evidence-box{
    margin:-10px 0;
    padding:0 10px;
}
</style>