<template>
    <div style="height:100%">
        <Row v-if="jurisdictionalProtestInfo" class="detail-content">
            <Row><Col span="5" class="left-label">申请时间：</Col><Col span="16" class="right-content">{{jurisdictionalProtestInfo.applicationTimeStr}}</Col></Row>
            <Row><Col span="5" class="left-label">申请人：</Col><Col span="16" class="right-content">{{jurisdictionalProtestInfo.applicant}}</Col></Row>
            <Row><Col span="5" class="left-label">上诉人：</Col><Col span="16" class="right-content">{{jurisdictionalProtestInfo.appellant}}</Col></Row>
            <Row><Col span="5" class="left-label">裁定结果：</Col><Col span="16" class="right-content">{{jurisdictionalProtestInfo.judgmentResultName}}</Col></Row>
            <Row><Col span="5" class="left-label" v-if="jurisdictionalProtestInfo.judgmentResult=='S'">转派法院：</Col><Col span="16" class="right-content">{{jurisdictionalProtestInfo.courtId}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">裁定书：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="jurisdictionalProtestInfo.attachmentList || []" 
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
            jurisdictionalProtestInfo:''
        }
    },
    props: ['processId'],
    methods: {
        //获取详情
        getJurisdictionalProtestInfo(){
            let url = '/business/case/opposition/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.jurisdictionalProtestInfo = res.data || "";
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getJurisdictionalProtestInfo()
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
