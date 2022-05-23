<template>
    <div class="mediate">
        <Row class="detail-header">
            <span>和解</span>
            <Row style="float:right;" v-if="defaultData.auditState=='P'" v-permission="[$route.path]">
                <Button type="primary" :disabled="isSubmit" @click="auditCtrl=true;auditType='agree'">通过</Button>
                <Button :disabled="isSubmit" @click="auditCtrl=true;auditType='reject'">驳回</Button>
            </Row>
        </Row>
        <Row class="case-content">
            <!-- 和解详情 -->
            <Row class="detail-content" v-if="isDetailLoad&&defaultData">
                <Row><Col span="5" class="left-label">和解对象：</Col><Col span="16" class="right-content">{{defaultData.litigantNames || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">和解备注：</Col><Col span="16" class="right-content">{{defaultData.content || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">和解金额：</Col><Col span="16" class="right-content">{{common.formateNumber(defaultData.amount || "")}}</Col></Row>
                <Row v-if="defaultData.auditState">
                    <Col span="5" class="left-label">审核结果：</Col>
                    <Col span="16" class="right-content">
                        <Tag style="border-radius:11px;" :color="getTagColor(defaultData.auditState)">{{defaultData.auditStateName}}</Tag>
                    </Col>
                </Row>
                <Row v-if="defaultData.auditState&&defaultData.auditState!='P'">
                    <Col span="5" class="left-label">审核备注：</Col>
                    <Col span="16" class="right-content">{{defaultData.auditRemark}}</Col>
                </Row>
                <Row v-if="defaultData.succeed">
                    <Col span="5" class="left-label">和解结果：</Col>
                    <Col span="16" class="right-content">{{defaultData.succeed?"成功":"失败"}}</Col>
                </Row>
                <Row v-if="defaultData.succeed">
                    <Col span="5" class="left-label">和解协议：</Col>
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
            title="和解审核"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否审核{{auditType=="agree"?"通过":"驳回"}}这份和解方案？</Row>
            <Form ref="auditFormData" :model="formData" :label-width="80">
                <FormItem label="审核备注" prop="auditRemark" 
                    :rules="[{ max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formData.auditRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写审核备注(不超过512个字符)'></Input>
                </FormItem>
            </Form>
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
            auditType:"",
            isSubmit:false,
            isDetailLoad:false,
            defaultData:"",
            formData:{
                auditRemark:""
            },
        }
    },
    props: ['processId'],
    methods: {
        //获取调解详情
        getDetail(){
            let url = '/business/case/reconcile/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.defaultData = res.data || "";
                    this.isDetailLoad = true;
                }
            })
        },
        getTagColor(state){
            let obj = {
                "P":styles.warningColor,
                "E":styles.successColor,
                "R":styles.errorColor,
            }
            return obj[state]
        },
        // 审核
        agreeSubmit(){
            let url = '';
            let ajaxData = { auditRemark:this.formData.auditRemark };
            if(this.auditType=='agree'){
                url = `/business/case/reconcile/${this.defaultData.id}/audit`;
                this.$patch(url,ajaxData).then(res=>{
                    this.auditCtrl = false;
                    this.isSubmit = true;
                    if(res.code===0){
                        this.getDetail();
                        this.$Message.success('操作成功');
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.isSubmit = false;
                })
            }else{
                url = `/business/case/reconcile/${this.defaultData.id}/reject`;
                this.$patch(url,ajaxData).then(res=>{
                    this.auditCtrl = false;
                    this.isSubmit = true;
                    if(res.code===0){
                        this.getDetail();
                        this.$Message.success('操作成功');
                    }else{
                        this.$Message.error(res.message);
                    }
                    this.isSubmit = false;
                })
            }
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
