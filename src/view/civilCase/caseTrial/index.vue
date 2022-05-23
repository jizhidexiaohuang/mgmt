<template>
    <div class="case-trial">
        <Row class="detail-header">
            <span>庭审</span>
        </Row>
        <Row v-if="defaultData" class="case-content">
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">开庭时间：</Col><Col span="16" class="right-content">{{defaultData.courtTime || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">原告代理人：</Col><Col span="16" class="right-content">{{defaultData.courtAgent || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">被告代理人：</Col><Col span="16" class="right-content">{{defaultData.otherAgent || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">对方当事人是否到场：</Col><Col span="16" class="right-content">{{defaultData.litigantArrive?"是":"否"}}</Col></Row>
                <Row><Col span="5" class="left-label">庭审内容：</Col><Col span="16" class="right-content">{{defaultData.content}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">庭审资料：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachments || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
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
        // 获取庭审详情
        getDetail(){
            let url = '/business/case/court-trial?processId='+this.processId;
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
