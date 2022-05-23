<template>
    <div class="investigative-action">
        <Row class="detail-header">
            <span>侦查行动</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData">
                <Row><Col span="5" class="left-label">行动时间：</Col><Col span="16" class="right-content">{{defaultData.investigateDate}}</Col></Row>
                <Row><Col span="5" class="left-label">结果：</Col><Col span="16" class="right-content">{{defaultData.results}}</Col></Row>
                <Row><Col span="5" class="left-label">查处主体：</Col><Col span="16" class="right-content">{{defaultData.subject}}</Col></Row>
                <Row><Col span="5" class="left-label">查处当事人：</Col><Col span="16" class="right-content">{{defaultData.litigant}}</Col></Row>
                <Row><Col span="5" class="left-label">查处地址：</Col><Col span="16" class="right-content">{{defaultData.address}}</Col></Row>
                <Row><Col span="5" class="left-label">执法部门：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcement}}</Col></Row>
                <Row><Col span="5" class="left-label">执法联系人：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcementContact}}</Col></Row>
                <Row><Col span="5" class="left-label">执法地址：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcementAddress}}</Col></Row>
                <Row v-if="!defaultData.turnType"><Col span="5" class="left-label">是否转换案件类型：</Col><Col span="16" class="right-content">未转</Col></Row>
                <Row v-if="defaultData.turnType">
                    <Col span="5" class="left-label">是否转换案件类型：</Col>
                    <Col span="16" class="right-content notice">已转成编号为&nbsp; <strong>{{defaultData.caseCode}}</strong> &nbsp;的{{defaultData.turnType=='CL'?'民事':'刑事'}}案件</Col>
                </Row>
                <Row v-if="defaultData.turnType"><Col span="5" class="left-label">转案原因：</Col><Col span="16" class="right-content">{{defaultData.stopRemark}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">行动文件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
            <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            defaultData:"",
        }
    },
    props: ['processId','caseId'],
    methods: {
        getDetail(type){
            let url = '/business/case/administrative/investigation/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0&&res.data){
                    this.defaultData = res.data;
                }
            })
        },
    },
    created(){},
    beforeMount(){

    },
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
