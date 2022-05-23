<template>
    <div>
        <Row v-if="defaultData" class="detail-content">
            <Row><Col span="5" class="left-label">受理法院：</Col><Col span="16" class="right-content">{{defaultData.court || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">案号：</Col><Col span="16" class="right-content">{{defaultData.caseNumber || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">受理日期：</Col><Col span="16" class="right-content">{{defaultData.acceptDate || ""}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">举证期限：</Col>
                <Col span="16" class="right-content" v-if="defaultData.proofStartTime || defaultData.proofEndTime">{{defaultData.proofStartTime}} 至 {{defaultData.proofEndTime}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">受理费用：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.fees || "")}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">受理通知：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="defaultData.acceptedAttachments || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">缴费票据：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="defaultData.payAttachments || []" 
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
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        // 获取受理详情
        getDetail(){
            let url = '/business/case-filing-accepted?processId='+this.processId;
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

