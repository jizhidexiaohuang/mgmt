<template>
    <div class="plan-form">
        <Row class="follow-record-form">
            <Form 
                :model="formItem" 
                ref="planForm" 
                :rules="formValidate" 
                :label-width="70" 
                :class="[isFromPlan?'clearfix':'clearfix plan-form-padding']">
                <Row>
                    <Col span="11">
                        <FormItem label="关注程度" prop="starLevel">
                            <Rate v-model="formItem.starLevel" custom-icon="icon-star-01" />
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="跟进时间" prop="vistTime">
                            <DatePicker 
                                type="date" 
                                format="yyyy-MM-dd" 
                                placeholder="请选择跟进时间"
                                :value="formItem.vistTime"
                                @on-change="getTime"
                                style="width:100%;"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="跟进人员" prop="vistUserIds">
                            <div class="tag">
                                <Tag 
                                    class="render-tag-style tag-style" 
                                    v-for="(item,index) in renderMetionArr" 
                                    :key="index" 
                                    type="border" 
                                    :color="mainColor.globalMainColor" 
                                    closable 
                                    @on-close="clearMetionPerson(index)">{{common.cutString(item.name,4)}}</Tag>
                                <span class="add-btn add-tag" @click="metionPersonCtrl=true">
                                    <Icon type="ios-add" />
                                    <span>添加</span>
                                </span>
                            </div>
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="跟进方式" prop="vistType">
                            <Select v-model="formItem.vistType">
                                <Option v-for="item in visitTypeArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="关联计划">
                            <my-select
                                v-if="!isFromPlan && selectCtrl"
                                :path="'/base/customer-plans'"
                                :keyName="'name'"
                                :params="mySelectParams"
                                :placeholder="'请选择关联计划'"
                                :defaultObj="selectDefaultObj"
                                @getValue="getPlanCode"
                                ></my-select>
                            <Input v-model="planName" disabled v-if="isFromPlan" />
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="跟进名称" prop="visitName">
                            <Input placeholder="请输入跟进名称" v-model.trim="formItem.visitName"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="跟进内容" prop="note">
                            <Input type="textarea" placeholder="请输入跟进内容" v-model.trim="formItem.note"/>
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="相关文件">
                            <div style="max-height:200px;overflow:auto;">
                                <file-upload 
                                :defaultList="defaultList" 
                                :uploadConfig="uploadConfig"
                                :size="60"
                                @getFileList="getAttachmentList"></file-upload>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Row>
        <Row :class="[isFromPlan?'plan-center-form-btn':'plan-edit-form-btn']">
            <Button type="primary" :disabled="submitLoading" :loading="submitLoading" @click="savePlan()">保存</Button>
            <Button type="default" @click="cancelSavePlan()">取消</Button>
        </Row>

        <Modal
            v-model="metionPersonCtrl"
            title="选择跟进人"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                v-if="isShowTree"
                ref="TreePersonInCharge"
                :defaultData="formItem.vistUserIds"
                @getValue="getPersonInCharge"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="metionPersonCtrl=false;">确认</Button>
                <Button @click="metionPersonCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const validateStar = (rule, value, callback) => {
            if(value<=0){
                return callback(new Error('请标注关注程度'));
            }
                
            callback();
        };
        const validateTime = (rule, value, callback) => {
            if(!this.formItem.startTime){
                return callback(new Error('请选择计划开始时间'));
            }
            if(!this.formItem.endTime){
                return callback(new Error('请选择计划结束时间'));
            }
            if (!this.formItem.startTime && !this.formItem.endTime) {
                return callback(new Error('请选择计划时间'));
            } 
                
            callback();
        };
        return {
            mainColor:styles,
            metionPersonCtrl:false,
            isShowTree:true,
            selectCtrl:false,
            renderMetionArr:[],
            visitTypeArr:[],
            timeRange:[],
            selectDefaultObj:{},
            planName:"",
            formItem:{
                vistUserIds:[],
                visitName:"",
                note:"",
                starLevel:0,
                vistType:"",
                vistTime:"",
                attachmentList:[],
                planId:""
            },
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:false
            },
            //表单验证规则
            formValidate: {
                starLevel:[{ required: true,validator:validateStar, trigger: "change" }],
                visitName:[
                    { required: true, message: "请填写计划名称", trigger: "blur" },
                    { max:60,message:'不能超过60个字符',trigger:'blur' }
                    ],
                vistTime:[{ required: true,message: "请选择跟进时间", trigger: "blur" }],
                vistUserIds:[{ required: true,type:"array", message: "请选择跟进人员", trigger: "blur" }],
                note:[
                    { required: true, message: "请填写跟进内容", trigger: "blur" },
                    { max:1024,message:'不能超过1024个字符',trigger:'blur'}
                    ],
                attachmentList:[{ required: true,type:"array", message: "请上传相关文件", trigger: "blur" }],
                planId:[{ required: true, message: "请选择关联计划", trigger: "blur" }],
                vistType:[{ required: true, message: "请选择跟进方式", trigger: "blur" }]
            },
            mySelectParams:{
                custId:this.custId
            },
            defaultList:[],
            submitLoading:false
        }
    },
    props: {
        //跟进记录查询详情的id
        recordId:{
            type:String | Number,
            default:""
        },
        //用于通知列表修改的是是哪一个
        index:{
            type:Number,
            default:0
        },
        //客户id
        custId:{
            type:String | Number,
            default:""
        },
        //是否在沟通计划转跟进记录
        isFromPlan:{
            type:Boolean,
            default:false
        },
        //沟通计划的id（用于渲染默认的关联计划，跟进人员）（用于操作完成之后改更新关联计划的状态）
        transferPlanId:{
            type:String | Number,
            default:""
        }
    },
    methods: {
        // 获取提醒人员
        getPersonInCharge(data){
            this.formItem.vistUserIds = [];
            this.renderMetionArr = data;
            data.forEach((item,index)=>{
                this.formItem.vistUserIds.push(item.id);
            })
        },
        // 获取Record详情
        getRecordDetail(){
            let url = "/base/customer-visit-record/"+this.recordId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.giveDefaultData(res.data);
                }
            })
        },
        giveDefaultData(data){
            this.defaultList = [];
            this.formItem.starLevel = data.starLevel;
            this.formItem.vistTime = data.vistTimeStr;
            this.formItem.visitName = data.visitName;
            this.formItem.vistType = data.vistType;
            this.formItem.note = data.note;
            this.formItem.planId = data.planId;
            data.users.forEach((item,index)=>{
                this.renderMetionArr.push(item);
                this.formItem.vistUserIds.push(item.id);
            });
            this.formItem.attachmentList = data.attachmentList;
            this.formItem.attachmentList.forEach((item,index)=>{
                this.defaultList.push(item);
            })
            this.selectDefaultObj = {
                id:data.planId,
                name:data.planName
            };
            this.selectCtrl = true;
        },
        getTime(date){
           this.formItem.vistTime = date;
        },
        getAttachmentList(arr){
            this.formItem.attachmentList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formItem.attachmentList.push(obj);
            })
        },
        savePlan(){
            this.$refs["planForm"].validate((valid) => {
                if(valid){
                    let url = '/base/customer-visit-record';
                    let ajaxData = {
                        custId:this.custId
                    }
                    if(this.recordId){
                        ajaxData.id = this.recordId;
                        this.formItem.attachmentList.forEach((item,index)=>{
                            delete item.id
                        })
                    }
                    Object.assign(ajaxData,this.formItem);
                    this.submitLoading = true;
                    if(this.recordId){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                if(this.isFromPlan){
                                    this.changePlanStatus();
                                    return
                                }
                                this.cancelSavePlan(true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.submitLoading = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                if(this.isFromPlan){
                                    this.changePlanStatus();
                                    return
                                }
                                this.cancelSavePlan(true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.submitLoading = false;
                        })
                    }
                }
            });
        },
        cancelSavePlan(bool){
            if(this.isFromPlan){
                this.$emit("closeTransfer",bool);
                return
            }

            if(this.recordId){
                this.$emit("closeEdit",this.index,bool);
            }else{
                this.$emit("closeEdit",null,bool);
            }
        },
        getPlanCode(obj){
            this.formItem.planId = obj.id;
        },
        changePlanStatus(){
            let url = "/base/customer-plan/"+this.transferPlanId;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.cancelSavePlan(true);
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getPlanDetail(){
            this.isShowTree = false;
            let url = "/base/customer-plan/"+this.transferPlanId;
            this.$get(url).then(res=>{
                this.isShowTree = true;
                if(res.code==0){
                    let data = res.data;
                    data.users.forEach((item,index)=>{
                        this.renderMetionArr.push(item);
                        this.formItem.vistUserIds.push(item.id);
                    })
                    this.formItem.visitName = data.name;
                    this.formItem.note = data.content;
                    this.formItem.planId = data.id;
                    this.planName = data.name;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        clearMetionPerson(index){
            let id = this.renderMetionArr[index].id;
            this.$refs.TreePersonInCharge.clearOneSelect(id);
        },
        // 获取字典数据接口
        async getDictionary(){
            this.visitTypeArr = await this.common.getDictionaryItems('visit_type');
        },
    },
    created(){},
    beforeMount(){

    },
    mounted(){
        if(this.recordId){
            this.getRecordDetail();
        }else{
            this.selectCtrl = true;
        }
        if(this.isFromPlan){
            this.getPlanDetail();
        }
        this.getDictionary();
    },
    updated(){},
    components: {},
    watch: {
    }
}
</script>
<style lang="sass" scoped>
@import "./../communicationPlan/planForm.scss"
</style>
<style lang="scss">
@import "./../../../../assets/globalStyle";
.follow-record-form .ivu-rate{
    font-size: 12px;
    line-height: 15px;
    vertical-align: text-bottom;
}
.follow-record-form .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first, .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second{
    color: $globalMainColor!important;
}
</style>