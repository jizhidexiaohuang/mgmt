<template>
    <div style="height:100%">
        <Row v-if="noticeInfo" class="detail-content">
            <Row><Col span="5" class="left-label">公告形式：</Col><Col span="16" class="right-content">{{noticeInfo.noticeFrom}}</Col></Row>
            <Row><Col span="5" class="left-label">公告期：</Col><Col span="16" class="right-content">{{noticeInfo.startTime}}---{{noticeInfo.endTime}}</Col></Row>
            <Row><Col span="5" class="left-label">公告费用：</Col><Col span="16" class="right-content">{{noticeInfo.fee}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">公告材料：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="noticeInfo.attachmentList || []" 
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
            noticeInfo:''
        }
    },
    props: ['processId'],
    methods: {
        //获取详情
        getServiceOfNoticeInfo(){
            let url = '/business/case/notice/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.noticeInfo = res.data || "";
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getServiceOfNoticeInfo()
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
