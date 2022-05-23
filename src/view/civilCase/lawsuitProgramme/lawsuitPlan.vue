<template>
    <div style="height:100%">
        <Row class="add-btn" v-if="lawsuitPlanInfo.state=='P'" v-permission="[$route.path]">
            <Button type="primary" @click="audit('agree')">通过</Button>
            <Button @click="audit('reject')">驳回</Button>
        </Row>
        <Row v-if="lawsuitPlanInfo" class="detail-content">
            <Row><Col span="5" class="left-label">侵权产品：</Col><Col span="16" class="right-content">{{lawsuitPlanInfo.tortProduct}}</Col></Row>
            <Row><Col span="5" class="left-label">案由：</Col><Col span="16" class="right-content">{{programReason}}</Col></Row>
            <Row><Col span="5" class="left-label">侵权权利：</Col><Col span="16" class="right-content">{{ipRights}}</Col></Row>
            <Row><Col span="5" class="left-label">对方当事人：</Col><Col span="16" class="right-content">{{litigant}}</Col></Row>
            <Row><Col span="5" class="left-label">代理律师：</Col><Col span="16" class="right-content">{{lawyers}}</Col></Row>
            <Row><Col span="5" class="left-label">诉讼标的：</Col><Col span="16" class="right-content">{{common.formateNumber(lawsuitPlanInfo.amount)}}</Col></Row>
            <Row><Col span="5" class="left-label">合理支出：</Col><Col span="16" class="right-content">{{common.formateNumber(lawsuitPlanInfo.reasonable)}}</Col></Row>
            <Row><Col span="5" class="left-label">管辖法院：</Col><Col span="16" class="right-content">{{lawsuitPlanInfo.courtJurisdiction}}</Col></Row>
            <Row v-for="(item,index) in lawsuitPlanInfo.caseProgramWritList" :key="index">
                <Col span="5" class="left-label">{{item.name}}：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="item.attachmentList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">审核状态：</Col>
                <Col span="16" class="right-content">
                    <Tag style="border-radius:11px;" :color="getTagColor(lawsuitPlanInfo.state)">
                        <span v-if="lawsuitPlanInfo.state=='P'">待审核</span>
                        <span v-if="lawsuitPlanInfo.state=='E'">审核通过</span>
                        <span v-if="lawsuitPlanInfo.state=='R'">审核驳回</span>
                    </Tag>
                </Col>
            </Row>
            <Row v-if="lawsuitPlanInfo.state=='R'"><Col span="5" class="left-label">审核备注：</Col><Col span="16" class="right-content">{{lawsuitPlanInfo.auditRemark}}</Col></Row>
        </Row>
        <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        <!-- 审核 -->
        <Modal
            v-model="auditCtrl"
            :title="title"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="auditType=='agree'">请问是否审核通过这份诉讼方案？</Row>
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
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            editId:'',
            infoCtrl:true,
            lawsuitPlanInfo:'',
            auditCtrl:false,
            formData:{
                remark:''
            },
            auditType:'',
            title:''
        }
    },
    props: ['processId','caseId','projectId'],
    computed:{
        programReason(){
            let str = '';
            this.lawsuitPlanInfo.programReasonList?this.lawsuitPlanInfo.programReasonList.map(item=>{
                str += item.name + ',';
            }):''
            return str.slice(0,-1);
        },
        ipRights(){
            let str = '';
            this.lawsuitPlanInfo.ipRightsList?this.lawsuitPlanInfo.ipRightsList.map(item=>{
                str += item.name + ',';
            }):''
            return str.slice(0,-1);
        },
        litigant(){
            let str = '';
            this.lawsuitPlanInfo.litigantList?this.lawsuitPlanInfo.litigantList.map(item=>{
                str += item.name + ',';
            }):''
            return str.slice(0,-1);
        },
        lawyers(){
            let str = '';
            this.lawsuitPlanInfo.lawyerList?this.lawsuitPlanInfo.lawyerList.map(item=>{
                str += item.name + ',';
            }):''
            return str.slice(0,-1);
        }
    },
    methods: {
        //获取详情
        getLawsuitPlanInfo(type){
            let url = '/business/case/program/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0&&res.data){
                    this.editId = res.data.id;
                    this.lawsuitPlanInfo = res.data;
                    this.$emit('getAuditState',true);
                    this.infoCtrl = true;
                }else{
                    this.$emit('getAuditState',false);
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
        //赋值
        getDetail(data){
            this.editId = data.id;
            this.formValidate.tortProduct = data.tortProduct;
            this.formValidate.programReasonList = data.programReasonList?data.programReasonList.map(item=>{
                return item.code;
            }):[]
            this.formValidate.programRightsList = data.ipRightsList?data.ipRightsList.map(item=>{
                return item.id;
            }):[]
            this.formValidate.litigantIdList = data.litigantList?data.litigantList.map(item=>{
                return item.id;
            }):[]
            this.formValidate.amount = data.amount;
            this.formValidate.reasonable = data.reasonable;
            this.formValidate.lawyerIdList = data.lawyerList?data.lawyerList.map(item=>{
                return item.id;
            }):[]
            this.formValidate.courtJurisdiction = Number(data.courtJurisdiction);
            this.$nextTick(function(){
                this.$refs.courtSelect.voluation();
            })
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
                url = `/business/case/program/${this.editId}/audit`;
                this.$patch(url).then(res=>{
                    this.auditCtrl = false;
                    if(res.code===0){
                        this.getLawsuitPlanInfo()
                        this.$Message.success('操作成功');
                    }else{
                        this.$Message.error('操作失败');
                    }
                })
            }else{
                url = `/business/case/program/${this.editId}/reject`;
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.$patch(url,{auditRemark:this.formData.remark}).then(res=>{
                            this.auditCtrl = false;
                            if(res.code===0){
                                this.getLawsuitPlanInfo()
                                this.$Message.success('操作成功');
                            }else{
                                this.$Message.error('操作失败');
                            }
                        })
                    }
                })
            }
        },
    },
    created(){},
    beforeMount(){
        this.getLawsuitPlanInfo()
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../caseCommon.scss';
.attorney-agent{
    float: left;
    width:calc(100% - 27px);
}
.add-btn{
    margin-top:-64px;
    &:nth-of-type(2){
        margin-right:100px;
    }
    &:nth-of-type(3){
        margin-right:200px;
    }
}
</style>
