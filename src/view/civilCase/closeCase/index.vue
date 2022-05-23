<template>
    <div class="case-trial">
        <Row class="detail-header">
            <span>结案</span>
            <Row class="add-btn" v-if="defaultData&&defaultData.auditState!='E'">
                <Button type="primary" v-permission="[$route.path]" @click="auditCtrl=true">确认</Button>
            </Row>
        </Row>
        <Row class="case-content">
            <Row v-if="defaultData" class="detail-content">
                <Row><Col span="5" class="left-label">结案时间：</Col><Col span="16" class="right-content">{{defaultData.closeTimeStr || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">结案方式：</Col><Col span="16" class="right-content">{{defaultData.closeTypeName || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">应收款：</Col><Col span="16" class="right-content">{{defaultData.amountReceivable || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">实收款：</Col><Col span="16" class="right-content">{{defaultData.amountReceived || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">结案内容：</Col><Col span="16" class="right-content">{{defaultData.content}}</Col></Row>
                <Row><Col span="5" class="left-label">诉讼分析：</Col><Col span="16" class="right-content">{{defaultData.litigationAnalysis}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">确认状态：</Col>
                    <Col span="16" class="right-content">
                        <Tag style="border-radius:11px;" v-if="defaultData.auditState!='E'" :color="styles.warningColor">待确认</Tag>
                        <Tag style="border-radius:11px;" v-else :color="styles.successColor">已确认</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">结案文书：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="defaultData.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
            <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        </Row>

        <!-- 审核 -->
        <Modal
            v-model="auditCtrl"
            title="确认结案"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认结案？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            auditCtrl:false,
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        // 获取庭审详情
        getDetail(){
            let url = '/business/case/case-close/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                }
            });
        },
        agreeSubmit(){
            let url = `/business/case/case-close/${this.defaultData.id}/audit`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.getDetail();
                    this.auditCtrl = false;
                }else{
                    this.$Message.error(res.message);
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
<style lang="scss" scoped>
@import '../caseCommon.scss';
</style>
