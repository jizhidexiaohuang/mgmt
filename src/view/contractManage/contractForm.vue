<template>
    <div class="contract-form">
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>基本信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="合同名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入合同名称"></Input>
                </FormItem>
                <FormItem label="合同类型" prop="type">
                    <Select v-model="formData.type" placeholder="请选择合同类型">
                        <Option v-for="item in contractTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品" prop="product">
                    <Select v-model="formData.product" placeholder="请选择产品">
                        <Option v-for="item in productArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="有效期" prop="startDate">
                    <DatePicker 
                        type="daterange" 
                        placement="bottom-start" 
                        placeholder="请选择有效期"
                        style="width:100%;"
                        :value="timeRange"
                        @on-change="getTime"></DatePicker>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>合同主体</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="甲方主体" prop="firstParty">
                    <contract-subject
                        v-if="detailsCtrl"
                        defaultSubject="C"
                        @getValue="getFirstParty"
                        :disableType="formData.secondPartyType || 'A'"
                        :defaultData="firstPartyObj">
                    </contract-subject>
                </FormItem>
                <FormItem label="乙方主体" prop="secondParty">
                    <contract-subject 
                        v-if="detailsCtrl"
                        defaultSubject="A"
                        @getValue="getSecParty"
                        :disableType="formData.firstPartyType || 'C'"
                        :defaultData="secondPartyObj">
                    </contract-subject>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>合同文本</span>
            </Row>
            <Row class="detail-form">
                <FormItem 
                    label="上传附件" 
                    prop="attachmentList"
                    :rules='formData.docId?[]:[{ required: true,type:"array",message:"附件不能为空",trigger: "blur" }]'>
                    <div>
                        <multi-file-upload
                            :templateMode="true"
                            :templateUrl="'/base/contract-templates'"
                            :defaultList="defaultList"
                            :uploadConfig="uploadConfig"
                            :format="['doc','dot','docx']"
                            :acceptType="'.doc,.dot,.docx'"
                            @getFileList="getAttachmentList"
                        ></multi-file-upload>
                    </div>
                </FormItem>
                <Row class="detail-btn-box">
                    <Button type="primary" style="margin-right:10px;" :disabled="saveCDLoading" :loading="saveCDLoading" @click="submitNewContract('formData','CD')" v-if="!contractDetail||contractDetail.state=='CD'">存为草稿</Button>
                    <Button type="primary" style="margin-right:10px;" :disabled="savePRLoading" :loading="savePRLoading" @click="submitNewContract('formData','PR')">提交</Button>
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
        const validateContractName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写合同名称'));
            }
            // 如果是修改并且合同名称没有修改则不验证电话号码是否唯一
            if(this.contractDetail && this.prevContactName==value){
                callback();
            }

            let url = "/base/contract/check-name/"+value;
            this.$get(url).then(res=>{
                if(!res.data){
                    callback();
                }else{
                    callback(new Error('合同名称已存在'));
                }
            })
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
            timeRange:[],
            firstPartyObj:{},
            secondPartyObj:{},
            formData:{
                name:"",
                type:"",
                product:"",
                startDate:"",
                endDate:"",
                firstParty:"",
                firstPartyName:"",
                firstPartyType:"",
                secondParty:"",
                secondPartyName:"",
                secondPartyType:"",
                attachmentList:[],
                docId:"",
                docUrl:"",
                deleteId:""
            },
            contractTypeArr:[],
            productArr:[],
            ruleValidate:{
                name:[
                    {required: true,validator:validateContractName, trigger: "blur" },
                    {max:64,message:'不能超过64个字符',trigger:'change'}
                ],
                type:[{required: true, message: '合同类型不能为空', trigger: 'change'}],
                product:[{required: true, message: '产品不能为空', trigger: 'blur'}],
                startDate:[{required: true, message: '有效期不能为空', trigger: 'change'}],
                firstParty:[{required: true, message: '甲方主体不能为空', trigger: 'blur'}],
                secondParty:[{required: true, message: '乙方主体不能为空', trigger: 'blur'}]
            },
            saveCDLoading:false,
            savePRLoading:false,
            pervAttachmentList:[],
        }
    },
    props: ['contractDetail'],
    methods: {
        getTime(date){
            this.formData.startDate = date[0];
            this.formData.endDate = date[1];
        },
        //获取甲方主体
        getFirstParty(data){
            this.formData.firstParty = (data.id || "") + "";
            this.formData.firstPartyName = data.name;
            this.formData.firstPartyType = data.type;
        },
        //获取乙方主体
        getSecParty(data){
            this.formData.secondParty = (data.id || "") + "";
            this.formData.secondPartyName = data.name;
            this.formData.secondPartyType = data.type;
        },
        getAttachmentList(arr){
            this.formData.attachmentList = [];
            this.wpsUrlObj = {};
            this.formData.docId = "";
            this.formData.docUrl = "";
            arr.forEach((item,index)=>{
                if(item.type==1){
                    let obj = {
                        fileName:item.fileName,
                        mediaType:item.mediaType,
                        smallUrl:item.smallUrl,
                        url:item.url
                    }
                    if(item.id){obj.id = item.id}
                    this.formData.attachmentList.push(obj);
                }else if(item.type==2){
                    this.formData.docId = item.fileId;
                    this.formData.docUrl = item.url;
                }
            });
        },
        findDelete(prevArr,lastArr){
            for(let i=0;i<prevArr.length;i++){
                for(let k=0;k<lastArr.length;k++){
                    if(lastArr[k].id==prevArr[i].id){
                        prevArr.splice(i,1);
                        i--;
                        break;
                    }
                }
            }
        },
        //获取字典数据接口
        async getDictionary(){
            this.productArr = await this.common.getDictionaryItems('product');
            this.contractTypeArr = await this.common.getDictionaryItems('contract_type');
        },
        //提交新增合同
        submitNewContract(name,state){
            let url = '/base/contract';
            let ajaxData = {
                name:this.formData.name,
                type:this.formData.type,
                product:this.formData.product,
                startDate:this.formData.startDate,
                endDate:this.formData.endDate,
                firstParty:this.formData.firstParty + "",
                firstPartyType:this.formData.firstPartyType,
                firstPartyName:this.formData.firstPartyName,
                secondParty:this.formData.secondParty + "",
                secondPartyType:this.formData.secondPartyType,
                secondPartyName:this.formData.secondPartyName,
                attachmentList:this.formData.attachmentList,
                docId:this.formData.docId,
                docUrl:this.formData.docUrl,
                deleteId:this.formData.deleteId,
                state:state
            }

            console.log(this.formData);

            if(this.contractDetail){
                ajaxData.id = this.contractDetail.id;
            }
            
            ajaxData.attachmentList = ajaxData.attachmentList.filter((item,index)=>{
                return (!item.id)&&item
            })

            this.$refs[name].validate((valid) => {
                if(valid){
                    if(this.saveCDLoading || this.savePRLoading){
                        this.$Message.warning("请勿重复操作！");
                        return
                    }
                    if(state=="CD"){
                        this.saveCDLoading = true;
                    }else{
                        this.savePRLoading = true;
                    }
                    if(this.contractDetail){

                        this.findDelete(this.pervAttachmentList,this.formData.attachmentList);
                        let deleteArr = [];
                        deleteArr = this.pervAttachmentList.map((item)=>{return item.id});
                        ajaxData.deleteId = deleteArr.length>0?deleteArr[0]:"";
                        
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.saveCDLoading = false;
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
                            this.saveCDLoading = false;
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
            this.formData.product = data.product;
            this.formData.startDate = data.startDateStr;
            this.formData.endDate = data.endDateStr;
            this.formData.firstParty = data.firstParty + "";
            this.formData.firstPartyType = data.firstPartyType;
            this.formData.firstPartyName = data.firstPartyName;
            this.formData.secondParty = data.secondParty + "";
            this.formData.secondPartyType = data.secondPartyType;
            this.formData.secondPartyName = data.secondPartyName;
            this.formData.attachmentList = data.attachmentList;
            this.formData.docId = data.docId;
            this.formData.docUrl = data.docUrl;
            this.formData.state = data.state;

            //如果是上传附件，则attachmentList为空数组 给上传组件赋值用来展示
            if(data.attachmentList && data.attachmentList.length==0){
                let arr = [{
                        mediaType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        fileName:"",
                        url:data.docUrl,
                        fileId:data.docId
                    }];
                this.defaultList = arr;
            }else{  
                this.defaultList = data.attachmentList || [];
                this.defaultList[0].fileId = data.docId;
            }
            this.prevContactName = data.name;
            this.timeRange.push(data.startDateStr);
            this.timeRange.push(data.endDateStr);
            this.firstPartyObj.id = data.firstParty;
            this.firstPartyObj.type = data.firstPartyType;
            this.firstPartyObj.name = data.firstPartyName;
            this.secondPartyObj.id = data.secondParty;
            this.secondPartyObj.type = data.secondPartyType;
            this.secondPartyObj.name = data.secondPartyName;
            this.pervAttachmentList = data.attachmentList || [];

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
@import "./contractForm"
</style>