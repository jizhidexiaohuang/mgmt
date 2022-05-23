<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :label-width="80">
            <FormItem label="邮寄类型">
                <RadioGroup v-model="formValidate.type">
                    <Radio label="M">快递邮寄</Radio>
                    <Radio label="F">当面签收</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem 
                v-if="formValidate.type=='M'" 
                label="快递公司"
                key="type"
                prop="courierCompany"
                :rules="[{required: true, message: '请选择快递公司', trigger: 'blur'}]">
                <Select v-model="formValidate.courierCompany" placeholder="请选择快递公司">
                    <Option v-for="item in courierCompanyArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                </Select>
            </FormItem>
            <FormItem 
                v-if="formValidate.type=='M'" 
                label="快递单号" 
                key="courierNumber"
                prop="courierNumber"
                :rules="[{required: true, message: '请选择快递单号', trigger: 'blur'}]">
                <Input v-model="formValidate.courierNumber" placeholder="请填写快递单号"></Input>
            </FormItem>
            <FormItem label="邮寄时间" prop="postDate"
                key="postDate"
                :rules="[{required: true, message: '请选择邮寄时间', trigger: 'blur'}]">
                <DatePicker type="date" :value="formValidate.postDate" @on-change="getDate" style="width:100%" placement="bottom-start" placeholder="请选择邮寄时间"></DatePicker>
            </FormItem>
            <FormItem key="attachmentList" v-if="formValidate.type=='F'" label="签收凭证" prop="attachmentList">
                <file-upload
                    ref="fileUpload"
                    :defaultList="defaultList" 
                    :uploadConfig="uploadConfig"
                    @getFileList="getAttachmentList"></file-upload>
            </FormItem>
        </Form>
        <Row style="text-align:center;">
            <Button type="primary" @click="submitData">确认</Button>
            <Button @click="$emit('closeModal',false)" style="margin-left: 8px">取消</Button>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            courierCompanyArr:[],
            formValidate:{
                type:"M",
                postDate:"",
                courierCompany:"",
                courierNumber:"",
                attachmentList:[]
            },
            defaultList:[],
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:false
            },
        }
    },
    props: ['caseList','defaultData','receiveId'],
    methods: {
        getAttachmentList(arr){
            this.formValidate.attachmentList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
            });
        },
        getDate(value){
            this.formValidate.postDate = value;
        },
        giveDefaultData(){
            this.formValidate.type = this.defaultData.type;
            this.formValidate.postDate = this.defaultData.postDate;
            this.formValidate.courierCompany = this.defaultData.courierCompany;
            this.formValidate.courierNumber = this.defaultData.courierNumber;
            this.defaultData.attachmentList.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formValidate.attachmentList.push(item);
            })
        },
        submitData(){
            let url = '/settlement/order-mailing';
            let ajaxData = {
                type:this.formValidate.type,
                postDate:this.formValidate.postDate,
                saleOrderMailingDetailList:this.caseList,
                receiverInfoId:this.receiveId
            }
            if(this.formValidate.type=="M"){
                ajaxData.courierCompany = this.formValidate.courierCompany;
                ajaxData.courierNumber = this.formValidate.courierNumber
            }
            this.$refs["formValidate"].validate((valid) => {
                if (valid) {
                    if(this.defaultData){
                        ajaxData.id = this.defaultData.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功！");
                                this.$emit("closeModal",true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功！");
                                this.$emit("closeModal",true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.courierCompanyArr = await this.common.getDictionaryItems('courier_company');
        },
    },
    created(){},
    beforeMount(){
        if(this.defaultData){
            this.giveDefaultData();
        }
        this.getDictionary();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
