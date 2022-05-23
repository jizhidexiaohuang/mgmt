<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>项目信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="项目名称" prop="name">
                    <Input v-model.trim="formData.name" type="text" placeholder="请输入项目名称"></Input>
                </FormItem>
                <FormItem label="客户名称" prop="customerId">
                    <mySelect ref="customerSelect" v-if="!flag"
                        :path="'/base/customers'"
                        :placeholder="'请选择客户'"
                        :params="{type:'G'}"
                        :keyName="'name'"
                        :inputKey="'name'"
                        :pagingMode="true"
                        :defaultObj="defaultCust"
                        @getValue="getCustomerId"></mySelect>
                    <Input v-model="defaultCust.name" v-if="flag" :disabled="flag" type="text"></Input>
                </FormItem>
                <FormItem label="项目等级" prop="rank">
                    <RadioGroup v-model="formData.rank" type="button">
                        <Radio v-for="(item,index) in rankArr" :key="index" :label="item.value">{{item.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="项目周期" prop="startDate">
                    <DatePicker 
                        type="daterange" 
                        placement="bottom-start" 
                        placeholder="请选择项目周期"
                        style="width:100%;"
                        :value="timeRange"
                        @on-change="getTime"></DatePicker>
                </FormItem>
                <!-- <FormItem label="上级项目" prop="parentId">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects/my'"
                        :placeholder="'请选择上级项目'"
                        :params="{flag:false,customerId:formData.customerId||''}"
                        :keyName="'name'"
                        :pagingMode="true"
                        :method="'GET'"
                        :defaultObj="defaultProj"
                        @getValue="getProjectId"></mySelect>
                </FormItem> -->
                <FormItem label="上级项目" prop="parentId">
                    <Select :disabled="flag" v-model="formData.parentId" clearable :placeholder="formData.customerId==''?'请先选择客户':'请选择上级项目'">
                        <Option v-for="item in projectList" :value="item.id" :key="item.id" :label="item.name">
                            <span class="select-click-content">{{ item.name }}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="负责人" prop="manager">
                    <div class="tag">
                        <Tag class="tag-style" v-for="(item,index) in personInChargeArr" :key="index" type="border" :color="mainColor.globalMainColor" closable @on-close="clearOptions()">{{item.name}}</Tag>
                        <Button icon="ios-add" type="dashed" size="small" @click="personInChargeCtrl=true" v-show="personInChargeArr.length==0">添加负责人</Button>
                    </div>
                </FormItem>
                <FormItem label="协作人" prop="cooperator">
                    <div class="tag">
                        <Tag class="tag-style" v-for="(item,index) in collaboratorArr" :key="index" type="border" :color="mainColor.globalMainColor" closable @on-close="clearCollaborator(item,index)">{{item.name}}</Tag>
                        <Button icon="ios-add" type="dashed" size="small" @click="collaboratorCtrl=true">添加协作人</Button>
                    </div>
                </FormItem>
                <FormItem label="项目描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入项目描述"></Input>
                </FormItem>
                <FormItem label="客户协议" prop="agreementPriceId">
                    <Select v-model="formData.agreementPriceId" clearable :placeholder="formData.customerId==''?'请先选择客户':'请选择客户结算协议'">
                        <Option v-for="item in custPriceList" :value="item.id" :key="item.id" :label="item.name">
                            <span class="select-click-content">{{ item.name }}</span>
                        </Option>
                    </Select>
                    <p class="select-click-text" v-if="formData.agreementPriceId" @click="seeAgreementDetail()">查看</p>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewCustomer()">保存</Button>
                <Button @click="$emit('changeEditCtrl',false)">取消</Button>
            </Row>
        </Form>
        <!-- 选择负责人 -->
        <Modal
            v-model="personInChargeCtrl"
            title="选择负责人"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="TreePersonInCharge"
                @getValue="getPrevPersonInCharge"
                :rightHide="false"
                :single="true"
                :defaultData="defaultPersonInCharge"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="getPersonInCharge">确认</Button>
                <Button @click="personInChargeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <!-- 选择协作人 -->
        <Modal
            v-model="collaboratorCtrl"
            title="选择协作人"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="TreeCollaborator"
                @getValue="getPrevCollaborator"
                :rightHide="false"
                :single="false"
                :defaultData="defaultCollaborator"
                :disabledList="disabledList"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="getCollaborator">确认</Button>
                <Button @click="collaboratorCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <!-- 客户协议详情 -->
        <Modal 
            title="协议内容"
            :width="600"
            v-model="agreementCtrl" 
            :footer-hide="true">
            <Row :style="{height:`${clientHeight}px`,overflow:'auto',margin:'-16px',}">
                <cust-agreement-info v-if="agreementCtrl" :custAgreementDetail="custAgreementDetail"></cust-agreement-info>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import custAgreementInfo from './../agreement/custAgreementInfo.vue';
export default {
    data () {
        return {
            mainColor:styles,
            timeRange:[],
            rankArr:[],
            formData:{
                name:'',
                customerId:'',
                rank:'N',
                startDate:'',
                endDate:'',
                parentId:'',
                manager:'',
                cooperator:[],
                remark:'',
                agreementPriceId:''
            },
            ruleValidate:{
                name:[
                    {required: true, message: '项目名称不能为空', trigger: 'blur'},
                    {max:32,message:'不能超过32个字符',trigger:'blur'}
                ],
                customerId:[
                    {required: true,type:'number', message: '客户名称不能为空', trigger: 'blur'}
                ],
                manager:[{required: true, message: '负责人不能为空', trigger: 'change'}],
                remark:[
                    {max:512,message:'不能超过512个字符',trigger:'blur'}
                ],
                agreementPriceId:[
                    {required: true,type:'number', message: '客户协议不能为空', trigger: 'blur'}
                ]
            },
            custPriceList:[],
            projectList:[],
            defaultCust:{},
            // defaultProj:[],
            personInChargeCtrl:false,
            collaboratorCtrl:false,
            defaultPersonInCharge:[],
            defaultCollaborator:[],
            personInChargeArr:[],
            collaboratorArr:[],
            disabledList:[],
            agreementCtrl:false,
            isSubmit:false,
            clientHeight:'',
            flag:false,
            choosePersonInChargeObj:"",
            chooseCollaboratorArr:[]
        }
    },
    props: {
        projectDetail:{
            type:Object|String
        },
        addType:{
            type:String,
            default:''
        }
    },
    methods: {
        submitNewCustomer(){
            let url = '/business/project';
            let ajaxData = {};
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    for(let key in this.formData){
                        if(key=='cooperator'&&this.formData.cooperator){
                            ajaxData[key] = this.formData.cooperator.join(',');
                        }else{
                            ajaxData[key] = this.formData[key];
                        }
                    }
                    if(this.addType==='edit'){
                        url = '/business/project/'+this.projectDetail.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.$emit('changeEditCtrl',true);
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.$emit('changeEditCtrl',true);
                            }
                        })
                    }
                }
            })
        },
        //获取客户
        getCustomerId(data){
            this.formData.customerId = Number(data.id);
            this.getCustPriceList();
            this.getProjectList();
        },
        //获取主项目
        getProjectList(){
            let url = '/business/projects/my';
            let ajaxData = {
                current: 1,
                size: 1000,
                flag:false,
                customerId:this.formData.customerId
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.projectList = res.data.records || [];
                }
            })
        },
        //获取可用的客户价格表
        getCustPriceList(){
            let url = '/settlement/agreements';
            let ajaxData = {
                current: 1,
                size: 1000,
                custId:this.formData.customerId
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.custPriceList = res.data.records || [];
                }
            })
        },
        getPrevPersonInCharge(data){
            this.choosePersonInChargeObj = data;
        },
        getPrevCollaborator(data){
            this.chooseCollaboratorArr = data;
        },
        //获取负责人
        getPersonInCharge(){
            this.personInChargeArr = [];
            this.formData.manager = '';
            this.disabledList = [];
            if(this.choosePersonInChargeObj){
                this.personInChargeArr.push(this.choosePersonInChargeObj);
                this.formData.manager = this.choosePersonInChargeObj.id;
                this.disabledList.push(this.choosePersonInChargeObj.id);
            }
            this.personInChargeCtrl = false;
        },
        //获取协作人
        getCollaborator(){
            this.collaboratorArr = [];
            this.formData.cooperator = [];
            if(this.chooseCollaboratorArr.length>0){
                this.collaboratorArr = this.chooseCollaboratorArr;
                this.formData.cooperator = this.chooseCollaboratorArr.map(item=>{
                    return item.id;
                });
            }
            this.collaboratorCtrl = false;
            console.log("进来了");
        },
        //清除负责人
        clearOptions(){
            this.$refs.TreePersonInCharge.clearSelect();
            this.$nextTick(()=>{
                this.getPersonInCharge();
            })
        },
        //清除协作人
        clearCollaborator(item,index){
            this.$refs.TreeCollaborator.clearOneSelect(item.id);
            this.$nextTick(()=>{
                this.getCollaborator();
            })
        },
        getTime(date){
            this.formData.startDate = date[0];
            this.formData.endDate = date[1];
        },
        //查看客户协议
        seeAgreementDetail(){
            let url = '/settlement/agreement/'+this.formData.agreementPriceId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.agreementCtrl = true;
                    this.custAgreementDetail = res.data;
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.rankArr = await this.common.getDictionaryItems('project_rank');
        },
        getProjectDetail(data){
            for(let key in this.formData){
                this.formData[key] = data[key];
            }
            this.timeRange = [data.startDate,data.endDate];
            this.defaultCust = {
                name:this.projectDetail.customerName,
                id:this.projectDetail.customerId
            }
            this.defaultPersonInCharge = data.manager?[data.manager]:[];
            this.defaultCollaborator = data.cooperator?data.cooperator.split(','):[];
            this.$nextTick(function(){
                this.formData.customerId = this.projectDetail.customerId;
                this.getCustPriceList();
                this.getProjectList();
            })
            this.flag = true;
            setTimeout(()=>{
                this.getPersonInCharge();
                this.getCollaborator();
            },400)
        }
    },
    created(){},
    beforeMount(){
        this.clientHeight = (document.body.clientHeight - 55)*0.7;
        this.getDictionary();
    },
    mounted(){
        if(this.addType==='addSub'){
            this.defaultCust = {
                name:this.projectDetail.customerName,
                id:this.projectDetail.customerId
            }
            this.$nextTick(function(){
                this.formData.customerId = this.projectDetail.customerId;
                this.getCustPriceList();
                this.getProjectList();
                this.formData.parentId = this.projectDetail.id;
            })
            this.flag = true;
        }else if(this.addType==='edit'){
            this.getProjectDetail(this.projectDetail)
        }
    },
    updated(){},
    components: {custAgreementInfo},
    watch: {}
}
</script>
<style scoped lang="scss">
@import './../../assets/globalStyle.scss';
.detail-form{
    .tag{
        height: auto;
        border:1px solid $borderColor;
        padding: 4px 7px;
    }
}
.select-click-text{
    line-height: 28px;
    position: absolute;
    top:3px;
    right:35px;
    cursor: pointer;
    color:$globalMainColor;
}
</style>
