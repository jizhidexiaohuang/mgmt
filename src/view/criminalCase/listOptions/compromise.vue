<template>
    <div class="mediate">
        <Row class="detail-header">
            <span>和解</span>
        </Row>
        <Row class="case-content">
            <!-- 和解详情 -->
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">和解对象：</Col><Col span="16" class="right-content">{{defaultData.litigantNames || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">和解备注：</Col><Col span="16" class="right-content">{{defaultData.content || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">和解金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.amount || "")}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">和解结果：</Col>
                    <Col span="16" class="right-content">{{defaultData.resultName}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">和解协议：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
        </Row>
        <h3 v-if="!defaultData&&isDetailLoad" style="text-align:center;margin-top:10px;">暂无相关信息</h3>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            isDetailLoad:false,
            defaultData:"",
        }
    },
    props: ['processId','caseId','nodeId'],
    methods: {
        //获取调解详情
        getDetail(){
            let url = '/business/case/criminal/reconcile?type=RE&processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.defaultData = res.data || "";
                    this.isDetailLoad = true;
                }
            })
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
@import '../../civilCase/caseCommon.scss';
</style>
