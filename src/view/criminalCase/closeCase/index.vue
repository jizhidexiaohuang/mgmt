<template>
    <div class="adjudicate">
        <Row class="detail-header">
            <span>结案</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">结案时间：</Col><Col span="16" class="right-content">{{defaultData.closeTime}}</Col></Row>
                <Row><Col span="5" class="left-label">结案方式：</Col><Col span="16" class="right-content">{{defaultData.typeName}}</Col></Row>
                <Row><Col span="5" class="left-label">结案内容：</Col><Col span="16" class="right-content">{{defaultData.content}}</Col></Row>
                <Row><Col span="5" class="left-label">诉讼分析：</Col><Col span="16" class="right-content">{{defaultData.litigationAnalysis}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">结案文书：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                                :defaultList="defaultData.attachmentList || []" 
                                :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
        </Row>
        <h3 v-if="!defaultData&&isDetailLoad" style="text-align:center;margin-top:10px;">暂无相关信息</h3>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isDetailLoad:false,
            defaultData:"",
        }
    },
    props: ['processId','caseId'],
    methods: {
        getDetail(){
            let url = '/business/case/criminal/closing/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data;
                    this.isDetailLoad = true;
                }
            });
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getDetail();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '../../civilCase/caseCommon.scss';
</style>
