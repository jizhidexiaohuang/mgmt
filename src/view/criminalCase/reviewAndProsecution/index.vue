<template>
    <div class="review-and-prosecution">
        <Row class="detail-header">
            <span>审查起诉</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">构成刑事：</Col><Col span="16" class="right-content">{{defaultData.isCriminal?"是":"否"}}</Col></Row>
                <Row v-if="!defaultData.isCriminal">
                    <Col span="5" class="left-label">情况说明：</Col>
                    <Col span="16" class="right-content">{{defaultData.remark}}</Col>
                </Row>
                <Row v-if="defaultData.isCriminal">
                    <Row><Col span="5" class="left-label">起诉时间：</Col><Col span="16" class="right-content">{{defaultData.prosecutionDate}}</Col></Row>
                    <Row><Col span="5" class="left-label">法院名称：</Col><Col span="16" class="right-content">{{defaultData.court}}</Col></Row>
                    <Row><Col span="5" class="left-label">起诉内容：</Col><Col span="16" class="right-content">{{defaultData.content}}</Col></Row>
                    <Row><Col span="5" class="left-label">是否逮捕：</Col><Col span="16" class="right-content">{{defaultData.isCatch?"逮捕成功":"逮捕失败"}}</Col></Row>
                    <Row v-if="defaultData.isCatch"><Col span="5" class="left-label">逮捕当事人：</Col><Col span="16" class="right-content">{{defaultData.catchLitigant}}</Col></Row>
                    <Row>
                        <Col span="5" class="left-label">材料文件：</Col>
                        <Col span="16" class="right-content">
                            <file-upload
                                :defaultList="defaultData.attachments || []" 
                                :uploadConfig="{readOnly:true}"></file-upload>
                        </Col>
                    </Row>
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
            defaultList:[],
        }
    },
    props: ['processId','caseId'],
    methods: {
        getDetail(){
            let url = '/business/case/criminal/review-prosecution?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0&&res.data){
                    this.defaultData = res.data;
                    this.isDetailLoad = true;
                }
            });
        },
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
