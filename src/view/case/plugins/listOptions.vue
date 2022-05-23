<template>
    <div style="opsition:absolute;z-index:9999;">
        <!-- 案件备忘 -->
        <Modal
            v-model="caseNotesCtrl"
            title="案件备忘"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="关注程度" prop="starLevel">
                    <Rate v-model="formValidate.starLevel" custom-icon="icon-star-01" />
                </FormItem>
                <FormItem label="是否公开" prop="isPublic">
                    <Select v-model="formValidate.isPublic" placeholder="是否公开">
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="note">
                    <Input v-model.trim="formValidate.note" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注信息(不超过512个字符)'></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="caseNoteSubmit('formValidate')">确认</Button>
                    <Button @click="caseNotesCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 关联案件 -->
        <Modal
            v-model="relatedCtrl"
            title="关联案件"
            :width="450"
            :footer-hide="true">
            <Form ref="formRelatedCase" :model="formRelatedCase" :label-width="80">
                <FormItem label="关联案件" prop="caseIdList"
                    :rules="{required: true,type:'number', message: '请选择关联案件', trigger: 'blur'}">
                    <mySelect ref="caseSelected"
                        :path="'/business/cases'"
                         :disabledList="disabledcaseList"
                        :keyName="'code'"
                        keyName2="caseExtend.litigantNames"
                        placeholder="请选择关联案件"
                        @getValue="getCaseId">
                    </mySelect>
                </FormItem>
                <!-- <FormItem label="备注" prop="remark" 
                    :rules="[{ max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formRelatedCase.remark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注信息(不超过512个字符)'></Input>
                </FormItem> -->
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="examineSubmit('formRelatedCase')">确认</Button>
                    <Button @click="relatedCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 终止/恢复 -->
        <Modal
            v-model="confirmCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="type!='terminated'">请问是否{{title}}此案件？</Row>
            <Form ref="formValidateStopCase" :model="formValidateStopCase" :label-width="80">
                <Row v-if="type==='terminated'">
                    <FormItem 
                        label="终止原因" 
                        prop="reason"
                        :rules="{required: true,  message: '请选择终止原因', trigger: 'change'}">
                        <Select v-model="formValidateStopCase.reason" placeholder="请选择终止原因">
                            <Option v-for="item in stopReasonArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem 
                        label="终止类型" 
                        prop="stopType"
                        :rules="{required: true,  message: '请选择终止类型', trigger: 'change'}">
                        <Select v-model="formValidateStopCase.stopType" placeholder="请选择终止类型">
                            <Option v-for="item in stopTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem 
                        label="终止备注" 
                        prop="stopRemark"
                        :rules="[{required: true,  message: '请填写终止备注', trigger: 'blur'},{ max:512,message:'不能超过512个字符',trigger:'blur'}]">
                        <Input v-model.trim="formValidateStopCase.stopRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注信息(不超过512个字符)'></Input>
                    </FormItem>
                </Row>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!--审核终止申请 -->
        <Modal
            v-model="auditApplyCtrl"
            title="审核案件终止"
            :width="360"
            :footer-hide="true">
            <Form ref="formAuditStopApply" :model="formAuditStopApply" :label-width="90">
                <Row>
                    <FormItem 
                        label="申请终止备注" 
                        prop="reason">
                        <span>{{formAuditStopApply.applyReason}}</span>
                    </FormItem>
                    <FormItem 
                        label="审核操作" 
                        prop="reason">
                        <RadioGroup v-model="formAuditStopApply.operate">
                            <Radio label="1">通过</Radio>
                            <Radio label="0">驳回</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem 
                        label="审核备注" 
                        prop="auditNote"
                        :rules="formAuditStopApply.operate==='0'?[{required: true,  message: '请填写审核备注', trigger: 'blur'},{ max:200,message:'不能超过200个字符',trigger:'blur'}]:[{ max:200,message:'不能超过200个字符',trigger:'blur'}]">
                        <Input v-model.trim="formAuditStopApply.auditNote" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写审核备注(不超过200个字符)'></Input>
                    </FormItem>
                </Row>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="auditApplySubmit">确认</Button>
                <Button @click="auditApplyCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        const validateStar = (rule, value, callback) => {
            if(value<=0){
                return callback(new Error('请标注关注程度'));
            }
            callback();
        };
        return {
            formValidate:{
                starLevel:0,
                isPublic:'1',
                note:''
            },
            ruleValidate:{
                starLevel:[{required: true, validator:validateStar, trigger: 'change'}],
                isPublic:[{required: true,  message: '请选择是否公开', trigger: 'change'}],
                note:[
                    {required: true,  message: '请填写备注', trigger: 'blur'},
                    {max:512,  message: '不能超过512个字符', trigger: 'blur'}
                ],
            },
            caseNotesCtrl:false, //备忘
            formRelatedCase:{
                caseIdList:'',
                // remark:''
            },
            disabledcaseList:[],
            relatedCtrl:false, //关联
            auditApplyCtrl:false, //终止
            formValidateStopCase:{
                reason:"",
                stopRemark:"",
                stopType:"",
            },
            formAuditStopApply:{
                operate:"1",
                auditNote:""
            },
            stopTypeArr:[],
            stopReasonArr:[],
            confirmCtrl:false,
            title:'',
        }
    },
    props: {
        id:{
            type:[String, Number],
            required:true
        },
        type:{
            type:String,
            required:true
        },
        applicationNote:{
            type:String
        }
    },
    methods: {
        //案件备忘
        caseNoteSubmit(name){
            let url = '/business/case-memo';
            let ajaxData = {
                caseId:this.id,
                star:this.formValidate.starLevel,
                memo:this.formValidate.note,
                isPublic:this.formValidate.isPublic==='1'?true:false
            }
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        this.caseNotesCtrl = false;
                        if(res.code===0){
                            this.$Message.success('操作成功！');
                            this.$emit('reloadList',true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        //获取案件id
        getCaseId(data){
            this.formRelatedCase.caseIdList = '';
            if(data){
                this.formRelatedCase.caseIdList = data.id;
            }
        },
        //案件关联
        examineSubmit(name){
            let url = '/business/case/correlation';
            let ajaxData = {
                caseId:this.id,
                correlationCaseIdList:this.formRelatedCase.caseIdList?[this.formRelatedCase.caseIdList]:[]
            }
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        this.relatedCtrl = false;
                        if(res.code===0){
                            this.$Message.success('操作成功！');
                            this.$emit('reloadList',true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        //案件终止和恢复
        agreeSubmit(){
            let url = "/business/case";
            let ajaxData = {
                caseId:this.id
            }
            if(this.type==='terminated'){
                url += `/termination`;
                Object.assign(ajaxData,this.formValidateStopCase);
                this.$refs["formValidateStopCase"].validate((valid) => {
                    if(valid){
                        this.$patch(url,ajaxData).then(res=>{
                            this.confirmCtrl = false;
                            if(res.code==0){
                                this.$emit('reloadList',true);
                                this.$Message.success('操作成功！');
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                })
            }else{
                url += `/processing?caseId=`+this.id;
                this.$patch(url).then(res=>{
                    this.confirmCtrl = false;
                    if(res.code==0){
                        this.$Message.success('操作成功！');
                        this.$emit('reloadList',true);
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        //审核终止申请
        auditApplySubmit(){
            let url = "/business/case/termination";
            url += this.formAuditStopApply.operate=="1"?"/audit":"/reject";
            let ajaxData = {
                caseId:this.id,
                auditNote:this.formAuditStopApply.auditNote
            }
            this.$refs["formValidateStopCase"].validate((valid) => {
                if(valid){
                    this.$patch(url,ajaxData).then(res=>{
                        this.auditApplyCtrl = false;
                        if(res.code==0){
                            this.$Message.success('操作成功！');
                            this.$emit('reloadList',true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.stopReasonArr = await this.common.getDictionaryItems('case_stop_reason');
            this.stopTypeArr = await this.common.getDictionaryItems('case_stop_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {
        type(val,oldVal){
            this.$refs['formValidateStopCase'].resetFields();
            if(this.type==='caseNotes'){
                this.$refs['formValidate'].resetFields();
                this.caseNotesCtrl = true;
            }else if(this.type==='related'){
                this.$refs['formRelatedCase'].resetFields();
                this.relatedCtrl = true;
                this.disabledcaseList = [Number(this.id)];
                this.$nextTick(function(){
                    this.$refs.caseSelected.clearSelected();
                    this.$refs.caseSelected.voluation();
                })
            }else if(this.type==='terminated'){
                this.title = '终止';
                this.confirmCtrl = true;
            }else if(this.type==='recovery'){
                this.title = '恢复';
                this.confirmCtrl = true;
            }else if(this.type==='auditStopApply'){
                this.$refs['formAuditStopApply'].resetFields();
                this.formAuditStopApply.applyReason = this.applicationNote;
                this.auditApplyCtrl = true;
            }
        },
        caseNotesCtrl(val){
            if(!val){
                this.$emit('reloadList',false)
            }
        },
        relatedCtrl(val){
            if(!val){
                this.$emit('reloadList',false)
            }
        },
        confirmCtrl(val){
            if(!val){
                this.$emit('reloadList',false)
            }
        },
        auditApplyCtrl(val){
            if(!val){
                this.$emit('reloadList',false)
            }
        },
    }
}
</script>
<style>
 
</style>
