<template>
    <div class="mediate">
        <Row class="detail-header">
            <span>调解</span>
        </Row>
        <Row class="case-content">
            <!-- 调解详情 -->
            <Row class="detail-content" v-if="defaultData&&isDetailLoad">
                <Row><Col span="5" class="left-label">调解对象：</Col><Col span="16" class="right-content">{{defaultData.litigantNames || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">调解内容：</Col><Col span="16" class="right-content">{{defaultData.content || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">调解金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.amount || "")}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">调解结果：</Col>
                    <Col span="16" class="right-content">{{defaultData.resultName}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">调解协议：</Col>
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
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            isDetailLoad:false,
            defaultData:"",
        }
    },
    props: ['processId'],
    methods: {
        //获取调解详情
        getDetail(){
            let url = '/business/case/criminal/reconcile?type=ME&processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                     this.defaultData = res.data || "";
                    this.isDetailLoad = true;
                }
            })
        },
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
