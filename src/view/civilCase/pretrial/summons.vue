<template>
    <div style="height:100%">
        <Row v-if="summonsInfo" class="detail-content">
            <Row><Col span="5" class="left-label">开庭时间：</Col><Col span="16" class="right-content">{{summonsInfo.courtTimeStr}}</Col></Row>
            <Row><Col span="5" class="left-label">开庭法院：</Col><Col span="16" class="right-content">{{summonsInfo.courtAddress}}</Col></Row>
            <Row><Col span="5" class="left-label">审判长：</Col><Col span="16" class="right-content">{{summonsInfo.presidingJudge}}---{{summonsInfo.presidingJudgePhone}}</Col></Row>
            <Row><Col span="5" class="left-label">助理：</Col><Col span="16" class="right-content">{{summonsInfo.assistant}}---{{summonsInfo.assistantPhone}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">传票附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="summonsInfo.attachmentList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
        </Row>
        <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
    </div>
</template>
<script>
export default {
    data () {
        return {
            summonsInfo:"",
        }
    },
    props: ['processId'],
    methods: {
        //获取传票详情
        getSummonsInfo(){
            let url = '/business/case/summons/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.summonsInfo = res.data || "";
                }
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getSummonsInfo();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../caseCommon.scss';
.add-btn{
    margin-top:-64px;
}
</style>
