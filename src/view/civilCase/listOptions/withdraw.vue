<template>
    <div class="withdraw">
        <Row class="detail-header">
            <span>撤诉</span>
            <Row v-if="auditState" class="add-btn" v-permission="[$route.path]">
                <Button type="primary" @click="audit('agree')">通过</Button>
                <Button @click="audit('reject')">驳回</Button>
            </Row>
        </Row>
        <Row class="withdraw-form">
            <Row class="detail-content" v-if="infoCtrl&&withdrawInfo">
                <Row><Col span="5" class="left-label">撤诉对象：</Col><Col span="16" class="right-content">{{withdrawInfo.litigantNames}}</Col></Row>
                <Row><Col span="5" class="left-label">撤诉原因：</Col><Col span="16" class="right-content">{{withdrawInfo.reason}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">传票附件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="withdrawInfo.attachmentList || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
                <!-- <Row v-if="!auditState"><Col span="5" class="left-label">审核状态：</Col><Col span="16" class="right-content">审核通过</Col></Row> -->
                <Row>
                    <Col span="5" class="left-label">审核状态：</Col>
                    <Col span="16" class="right-content">
                        <Tag style="border-radius:11px;" :color="getTagColor(withdrawInfo.auditState)">
                            <span v-if="withdrawInfo.auditState=='P'">待审核</span>
                            <span v-if="withdrawInfo.auditState=='E'">审核通过</span>
                            <span v-if="withdrawInfo.auditState=='R'">审核驳回</span>
                        </Tag>
                    </Col>
                </Row>
                <Row v-if="withdrawInfo.auditState=='R'"><Col span="5" class="left-label">审核备注：</Col><Col span="16" class="right-content">{{withdrawInfo.auditRemark}}</Col></Row>
            </Row>
            <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        </Row>
        <!-- 审核 -->
        <Modal
            v-model="auditCtrl"
            :title="title"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="auditType=='agree'">请问是否审核通过这份撤诉申请？</Row>
            <Form ref="formData" v-else :model="formData" :label-width="80">
                <FormItem label="驳回原因" prop="remark" 
                    :rules="[{ max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写驳回原因(不超过512个字符)'></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <!-- 撤诉结果 -->
        <withdrawResult v-if="!auditState" :withdrawId="editId"></withdrawResult>
    </div>
</template>
<script>
import withdrawResult from './withdrawResult.vue';
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            editId:'',
            infoCtrl:false,
            withdrawInfo:'',
            auditCtrl:false,
            formData:{
                remark:''
            },
            auditType:'',
            title:'',
            auditState:true,
        }
    },
    props:['processId'],
    methods: {
        getTagColor(state){
            let obj = {
                "P":styles.warningColor,
                "E":styles.successColor,
                "R":styles.errorColor,
            }
            return obj[state]
        },
        audit(type){
            this.auditCtrl = true;
            this.auditType = type;
            this.title = type=='agree'?'审核通过':'审核驳回';
        },
        //审核
        agreeSubmit(){
            let url = '';
            if(this.auditType=='agree'){
                url = `/business/case/withdraw/${this.editId}/audit`;
                this.$patch(url).then(res=>{
                    this.auditCtrl = false;
                    if(res.code===0){
                        this.$Message.success('操作成功');
                        this.$emit('reloadProcess');
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else{
                url = `/business/case/withdraw/${this.editId}/reject`;
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.$patch(url,{auditRemark:this.formData.remark}).then(res=>{
                            this.auditCtrl = false;
                            if(res.code===0){
                                this.$Message.success('操作成功');
                                this.$emit('reloadProcess');
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                })
            }
        },
        //获取详情
        getWithdrawInfo(type){
            let url = `/business/case/withdraw/${this.processId}`;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.withdrawInfo = res.data || "";
                    this.auditState = res.data.auditState=='E'?false:true;
                    this.editId = res.data.id;
                    this.infoCtrl = true;
                }
            })
        },
    },
    created(){},
    beforeMount(){
        this.getWithdrawInfo();
    },
    mounted(){
        
    },
    updated(){},
    components: {withdrawResult},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
@import '../caseCommon.scss';
.withdraw{
    .add-btn{
        &:nth-of-type(2){
            margin-right:10px;
        }
    }
    .withdraw-form{
        // margin-top:10px;
        border-top:1px solid $borderColor;
        padding-top:10px;
    }
}
</style>