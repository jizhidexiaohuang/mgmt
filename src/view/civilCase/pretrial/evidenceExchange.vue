<template>
    <div style="height:100%">
        <Row v-if="evidenceInfo" class="detail-content">
            <Row><Col span="5" class="left-label">证据交换时间：</Col><Col span="16" class="right-content">{{evidenceInfo.exchangeTimeStr}}</Col></Row>
            <Row><Col span="5" class="left-label">地点：</Col><Col span="16" class="right-content">{{evidenceInfo.exchangeAddress}}</Col></Row>
            <Row><Col span="5" class="left-label">参与人员：</Col><Col span="16" class="right-content">{{evidenceInfo.participants}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">对方证据：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="evidenceInfo.attachmentList || []" 
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
            evidenceInfo:''
        }
    },
    props: ['processId'],
    methods: {
        //获取详情
        getEvidenceExchangeInfo(){
            let url = '/business/case/evidence-exchange/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.evidenceInfo = res.data || "";
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getEvidenceExchangeInfo();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
