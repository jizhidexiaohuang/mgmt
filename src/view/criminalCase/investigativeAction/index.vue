<template>
    <div class="investigative-action">
        <Row class="detail-header">
            <span>侦查行动</span>
        </Row>
        <Row class="case-content">
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">行动时间：</Col><Col span="16" class="right-content">{{defaultData.investigateDate}}</Col></Row>
                <Row><Col span="5" class="left-label">结果：</Col><Col span="16" class="right-content">{{defaultData.results}}</Col></Row>
                <Row><Col span="5" class="left-label">查处主体：</Col><Col span="16" class="right-content">{{defaultData.subject}}</Col></Row>
                <Row><Col span="5" class="left-label">查处当事人：</Col><Col span="16" class="right-content">{{defaultData.litigant}}</Col></Row>
                <Row><Col span="5" class="left-label">查处地址：</Col><Col span="16" class="right-content">{{defaultData.address}}</Col></Row>
                <Row><Col span="5" class="left-label">执法部门：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcement}}</Col></Row>
                <Row><Col span="5" class="left-label">执法联系人：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcementContact}}</Col></Row>
                <Row><Col span="5" class="left-label">执法地址：</Col><Col span="16" class="right-content">{{defaultData.lawEnforcementAddress}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">行动文件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                                :defaultList="defaultData.attachmentList || []" 
                                :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">构成刑事：</Col><Col span="16" class="right-content">{{defaultData.isCriminal?"是":"否"}}</Col></Row>
                <Row v-if="!defaultData.isCriminal"><Col span="5" class="left-label">情况说明：</Col><Col span="16" class="right-content">{{defaultData.remark}}</Col></Row>
            </Row>
            <h3 v-if="!defaultData&&isDetailLoad" style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isDetailLoad:false,
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        getDetail(){
            let url = '/business/case/criminal/investigation?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
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
