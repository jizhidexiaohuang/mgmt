<template>
    <div class="withdraw-result">
        <Row class="detail-content" v-if="infoCtrl">
            <Row><Col span="5" class="left-label">变更诉讼要求：</Col><Col span="16" class="right-content">{{withdrawResultInfo.changeState?'是':'否'}}</Col></Row>
            <Row v-if="withdrawResultInfo.changeState"><Col span="5" class="left-label">变更金额：</Col><Col span="16" class="right-content">{{common.formateNumber(withdrawResultInfo.changeAmout)}}</Col></Row>
            <Row v-if="withdrawResultInfo.changeState"><Col span="5" class="left-label">是否退费：</Col><Col span="16" class="right-content">{{withdrawResultInfo.returnState?'是':'否'}}</Col></Row>
            <Row v-if="withdrawResultInfo.changeState&&withdrawResultInfo.returnState"><Col span="5" class="left-label">退费金额：</Col><Col span="16" class="right-content">{{common.formateNumber(withdrawResultInfo.returnAmout)}}</Col></Row>
            <Row v-if="withdrawResultInfo.changeState">
                <Col span="5" class="left-label">相关附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="withdrawResultInfo.attachmentList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            editId:'',
            infoCtrl:false,
            withdrawResultInfo:'',
        }
    },
    props: ['withdrawId'],
    methods: {
        //获取详情
        getWithdrawResultInfo(){
            let url = `/business/case/withdraw/result/${this.withdrawId}`;
            this.$get(url).then(res=>{
                if(res.code===0&&res.data){
                    this.withdrawResultInfo = res.data;
                    this.editId = res.data.id;
                    this.infoCtrl = true;
                }else{
                    this.infoCtrl = false;
                }
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getWithdrawResultInfo();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
@import '../caseCommon.scss';
.withdraw-result{
    margin-top:10px;
    padding-top:10px;
    border-top:1px dashed $borderColor;
}
</style>
