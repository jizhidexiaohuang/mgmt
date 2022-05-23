<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>基本信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="案例行业" prop="industryId">
                    <mySelect ref="industrySelect"
                        :path="'/base/industry'"
                        :placeholder="'请选择行业名称'"
                        :placeholderInput="'请输入行业名称'"
                        :keyName="'industryName'"
                        :defaultObj="industryObj"
                        @getValue="getIndustryId">
                    </mySelect>
                </FormItem>
                <FormItem label="案例名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入案例名称"></Input>
                </FormItem>
                <FormItem label="案例类型" prop="type">
                    <Select v-model="formData.type" placeholder="请选择案例类型">
                        <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="案例客户" prop="custId">
                    <mySelect ref="customerSelect"
                        :path="'/base/customers'"
                        :placeholder="'请选择案例客户'"
                        :params="{type:'G'}"
                        :keyName="'name'"
                        :inputKey="'name'"
                        :defaultObj="customerObj"
                        @getValue="getCustomerId">
                    </mySelect>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>详细信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="维权起因" prop="reason">
                    <Input v-model.trim="formData.reason" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写维权起因"></Input>
                </FormItem>
                <FormItem label="维权过程" prop="course">
                    <Input v-model.trim="formData.course" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写维权过程"></Input>
                </FormItem>
                <FormItem label="维权结果" prop="result">
                    <Input v-model.trim="formData.result" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写维权结果"></Input>
                </FormItem>
                <FormItem label="案例图片" prop="custCaseAttachList">
                    <file-upload 
                    :defaultList="defaultList" 
                    @getFileList="getAttachmentList"></file-upload>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewCase('formData')">保存</Button>
                <Button @click="$emit('changeEditCtrl',false)">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isSubmit:false,
            formData:{
                industryId:'',
                name:'',
                type:'',
                custId:'',
                reason:'',
                course:'',
                result:'',
                custCaseAttachList:[]
            },
            ruleValidate:{
                industryId:[
                    {required:true,type:'number',message:'请选择案例行业',trigger:'change'}
                ],
                name:[
                    {required: true, message: '案例名称不能为空', trigger: 'blur'},
                    {max:64, message:'不能超过64个字符', trigger:'blur'}
                ],
                type:[
                    {required: true, message: '案例类型不能为空', trigger: 'change'}
                ],
                custId:[
                    {required: true, message: '客户名称不能为空', trigger: 'change'}
                ],
                reason:[
                    {required: true, message: '维权起因不能为空', trigger: 'blur'},
                    {max:1024, message:'不能超过1024个字符', trigger:'blur'}
                ],
                course:[
                    {required: true, message: '维权过程不能为空', trigger: 'blur'},
                    {max:1024, message:'不能超过1024个字符', trigger:'blur'}
                ],
                result:[
                    {required: true, message: '维权结果不能为空', trigger: 'blur'},
                    {max:1024, message:'不能超过1024个字符', trigger:'blur'}
                ]
            },
            typeArr:[],
            defaultList:[],
            industryObj:{},
            customerObj:{}
        }
    },
    props: ['caseDetail'],
    methods: {
        // 获取行业名称
        getIndustryId(data){
            this.formData.industryId = data.id;
            this.$refs.formData.validateField('industryId');
        },
        //获取客户
        getCustomerId(data){
            this.formData.custId = data.id;
            this.$refs.formData.validateField('custId');
        },
        getAttachmentList(arr){
            this.formData.custCaseAttachList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formData.custCaseAttachList.push(obj);
            });
        },
        submitNewCase(name){
            let url = '/base/cust-case';
            let ajaxData = {};
            Object.assign(ajaxData,this.formData);
            if(this.caseDetail){
                ajaxData.id = this.caseDetail.id;
            }
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.isSubmit = true;
                    if(this.caseDetail){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                                this.$Message.success('操作成功!');
                            }
                            this.isSubmit = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                                this.$Message.success('操作成功!');
                            }
                            this.isSubmit = false;
                        })
                    }
                }
            })
        },
        getDetail(data){
            for(let key in this.formData){
                this.formData[key] = data[key]
            }
            this.formData.custCaseAttachList = data.custCaseAttachList && data.custCaseAttachList.map(item=>{
                return {
                    mediaType:item.mediaType,
                    url:item.url,
                    fileName:item.fileName
                }
            })
            this.defaultList = data.custCaseAttachList;
            this.customerObj = {
                id:data.custId,
                name:data.customerName
            }
            this.industryObj = {
                id:data.industryId,
                name:data.industryName
            }
            this.$nextTick(function(){
                this.$refs.customerSelect.voluation();
                this.$refs.industrySelect.voluation();
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.typeArr = await this.common.getDictionaryItems('skill_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        if(this.caseDetail){
            this.getDetail(this.caseDetail);
        }
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
