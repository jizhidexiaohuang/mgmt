<template>
    <div class="setup-case">
        <Row class="detail-header">
            <span>结案</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData">
                <Row><Col span="5" class="left-label">结案时间：</Col><Col span="16" class="right-content">{{defaultData.closeTime || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">结案内容：</Col><Col span="16" class="right-content">{{defaultData.content || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">案件分析：</Col><Col span="16" class="right-content">{{defaultData.litigationAnalysis || ""}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">结案文件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
            <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            defaultData:"",
        }
    },
    props: ['caseId','processId'],
    methods: {
        // 获取受理详情
        getDetail(){
            let url = '/business/case/administrative/closing/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0&&res.data){
                    this.defaultData = res.data;
                }
            });
        },
    },
    created(){},
    beforeMount(){
        this.getDetail();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../../civilCase/caseCommon.scss';
</style>
