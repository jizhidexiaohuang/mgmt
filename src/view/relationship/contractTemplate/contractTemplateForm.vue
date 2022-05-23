<template>
    <div class="contract-form">
        <Row class="detail-header">
            <span>基本信息</span>
        </Row>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="合同模版名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入合同模版名称"></Input>
                </FormItem>
                <FormItem label="合同类型" prop="type">
                    <Select v-model="formData.type" placeholder="请选择合同类型">
                        <Option v-for="item in contractTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写描述"></Input>
                </FormItem>
            </Row>
            <Row class="detail-header" v-if="!contractDetail">
                <span>合同模版文本</span>
            </Row>
            <Row class="detail-form">
                <FormItem 
                    label="上传附件" 
                    prop="attachmentList" 
                    v-if="!contractDetail"
                    :rules='[{required: true,validator:validateAttachmentList, trigger: "blur" }]'>
                    <div>
                        <multi-file-upload
                            :defaultList="defaultList"
                            :uploadConfig="uploadConfig"
                            :format="['doc','dot','docx']"
                            :acceptType="'.doc,.dot,.docx'"
                            @getFileList="getAttachmentList"
                        ></multi-file-upload>
                    </div>
                </FormItem>
                <Row class="detail-btn-box">
                    <Button type="primary" style="margin-right:10px;" :disabled="savePRLoading" :loading="savePRLoading" @click="submitNewContract('formData')">提交</Button>
                    <Button @click="$emit('changeEditCtrl',false,false);">取消</Button>
                </Row>
            </Row>
        </Form>
    </div>
</template>
<script>
import Message from '@/components/common/message/message';
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const validateAttachmentList = (rule, value, callback) => {
            // 如果是修改并且合同名称没有修改则不验证电话号码是否唯一
            if(this.formData.docId || this.formData.attachmentList.length>0){
                callback();
            }else{
                callback(new Error('请上传附件'));
            }
        };
        return {
            mainColor:styles,
            uploadConfig:{
                multiple:false,
                fileName:'',
                readOnly:false,
                maxNum:1
            },
            prevContactName:"",
            detailsCtrl:false,
            defaultList:[],
            formData:{
                name:"",
                type:"",
                attachmentList:[],
                docId:"",
                docUrl:"",
                remark:""
            },
            contractTypeArr:[],
            ruleValidate:{
                name:[
                    {required:true,message:'请填写合同模版名称',trigger:'change'},
                    {max:64,message:'不能超过64个字符',trigger:'change'}
                ],
                type:[{required: true, message: '合同类型不能为空', trigger: 'change'}],
                remark:[{required: true, message: '合同描述不能为空', trigger: 'change'}],
            },
            savePRLoading:false,
            pervAttachmentList:[],
            validateAttachmentList:validateAttachmentList
        }
    },
    props: ['contractDetail'],
    methods: {
        getTime(date){
            this.formData.startDate = date[0];
            this.formData.endDate = date[1];
        },
        getAttachmentList(arr){
            this.formData.attachmentList = [];
            this.wpsUrlObj = {};
            this.formData.docId = "";
            arr.forEach((item,index)=>{
                if(item.type==1){
                    let obj = {
                        fileName:item.fileName,
                        mediaType:item.mediaType,
                        smallUrl:item.smallUrl,
                        url:item.url
                    }
                    this.formData.attachmentList.push(obj);
                }else if(item.type==2){
                    this.formData.docId = item.fileId;
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.contractTypeArr = await this.common.getDictionaryItems('contract_type');
        },
        //提交新增客户
        submitNewContract(name){
            let url = '/base/contract-template';
            let ajaxData = {
                name:this.formData.name,
                type:this.formData.type,
                remark:this.formData.remark
            }

            if(this.contractDetail){
                ajaxData.id = this.contractDetail.id;
            }else{
                ajaxData.attachment = this.formData.attachmentList[0];
                ajaxData.docId = this.formData.docId;
            }
            
            this.$refs[name].validate((valid) => {
                if(valid){
                    if(this.savePRLoading){
                        this.$Message.warning("请勿重复操作！");
                        return
                    }
                    this.savePRLoading = true;
                    if(this.contractDetail){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.savePRLoading = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.savePRLoading = false;
                        })
                    }
                }
            })
        },
        //赋默认值
        getCustomerDetail(data){
            this.formData.name = data.name;
            this.formData.type = data.type;
            this.formData.remark = data.remark;
            this.formData.attachment = data.attachment;
            this.formData.docId = data.docId;

            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        if(this.contractDetail){
            this.getCustomerDetail(this.contractDetail);
        }else{
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {
        Message,
    },
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./contractTemplateForm"
</style>