<template>
    <div class="adjudicate">
        <Row class="detail-header">
            <span>判决</span>
        </Row>
        <Row v-if="defaultData" class="case-content">
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">判决日期：</Col><Col span="16" class="right-content">{{defaultData.judgmentDate || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">签收日期：</Col><Col span="16" class="right-content">{{defaultData.signDate || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">判决金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.amount || "")}}</Col></Row>
                <Row><Col span="5" class="left-label">对方承担诉讼费金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.litigantFee || "")}}</Col></Row>
                <Row><Col span="5" class="left-label">判决摘录：</Col><Col span="16" class="right-content">{{defaultData.remark || ""}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">判决书：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachments || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">判决结果：</Col><Col span="16" class="right-content">{{defaultData.result?"胜诉":"败诉"}}</Col></Row>
            </Row>
        </Row>
        <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
    </div>
</template>
<script>
export default {
    data () {
        return {
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        // 获取判决详情
        getDetail(){
            let url = '/business/case/judgment?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                }
            });
        }
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
<style lang="scss" scoped>
@import '../caseCommon.scss';
</style>
