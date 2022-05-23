<template>
    <div class="adjudicate">
        <Row class="detail-header">
            <span>判决</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">判决时间：</Col><Col span="16" class="right-content">{{defaultData.judgmentDate}}</Col></Row>
                <Row><Col span="5" class="left-label">签收时间：</Col><Col span="16" class="right-content">{{defaultData.signDate}}</Col></Row>
                <Row><Col span="5" class="left-label">判决机构：</Col><Col span="16" class="right-content">{{defaultData.agency}}</Col></Row>
                <Row><Col span="5" class="left-label">判决摘录：</Col><Col span="16" class="right-content">{{defaultData.remark}}</Col></Row>
                <Row><Col span="5" class="left-label">判决结果：</Col><Col span="16" class="right-content">{{defaultData.result?"判刑":"无罪释放"}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">判决书：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
        </Row>
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
            let url = '/business/case/criminal/judgment?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0&&res.data){
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
