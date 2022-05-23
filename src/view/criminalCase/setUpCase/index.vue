<template>
    <div class="setup-case">
        <Row class="detail-header">
            <span>立案</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">报案日期：</Col><Col span="16" class="right-content">{{defaultData.reportDate || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">受理机关：</Col><Col span="16" class="right-content">{{defaultData.unit || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">办案人：</Col><Col span="16" class="right-content">{{defaultData.principal || ""}}--{{defaultData.position || ""}}--{{defaultData.phone || ""}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">办案材料：</Col>
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
            acceptedDefaultList:[]
        }
    },
    props: ['caseId','processId'],
    methods: {
        // 获取受理详情
        getDetail(){
            let url = '/business/case/criminal/filing?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                    this.isDetailLoad = true;
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
