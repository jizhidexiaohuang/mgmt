<template>
    <div style="height:100%;">
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="所属项目" prop="projId">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects/list'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目名称 / 客户名称'"
                        :defaultObj="defaultProject"
                        :keyName="'name'"
                        @getValue="getProjectId">
                    </mySelect>
                </FormItem>
                <FormItem label="客户名称" prop="customerId">
                    <Input v-model="formData.customerName" disabled placeholder="请选择项目"></Input>
                </FormItem>
                <FormItem label="任务名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入任务名称"></Input>
                </FormItem>
                <FormItem label="调查范围" prop="missionScope">
                    <RadioGroup v-model="formData.missionScope" placeholder="请选择调查范围">
                        <Radio :label="item.value" v-for="item in missionScopeArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="调查区域" prop="locationList" v-if="formData.missionScope=='R'">
                    <choose-city v-on:listenLocation="getLocation" :defaultLocation="defaultLocation"></choose-city>
                </FormItem>
                <FormItem label="任务类型" prop="missionType">
                    <RadioGroup v-model="formData.missionType" placeholder="请选择任务类型">
                        <Radio :label="item.value" v-for="item in missionTypeArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="指派团队" prop="licensorList" v-if="formData.missionType=='A'">
                    <div class="tag">
                        <Tag class="tag-style" v-for="(item,index) in assignTeamArr" :key="index" type="border" 
                            :color="mainColor.globalMainColor" closable @on-close="clearAssignTeam(item,index)">{{item.team}}</Tag>
                        <Button icon="ios-add" type="dashed" size="small" @click="assignTeamCtrl=true">选择团队</Button>
                    </div>
                </FormItem>
                <FormItem label="截止日期" prop="endDate">
                    <DatePicker type="date" :options="dateOption" :value="formData.endDate" format="yyyy-MM-dd" @on-change="getEndDate" placeholder="请选择任务截止日期" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem label="任务介绍" prop="description">
                    <Ckeditor :defaultData="formData.description" :placeholder="'请输入任务介绍'" @input="getCkeditorData"></Ckeditor>
                </FormItem>
                <FormItem label="律师协议" prop="lawyerPriceId">
                    <Select :disabled="formData.projId=='' || (!!taskDetail.id&&taskDetail.state=='RD')" v-model="formData.lawyerPriceId" clearable :placeholder="formData.projId==''?'请先选择项目':'请选择律师结算协议'">
                        <Option v-for="item in lawyerPriceList" :value="item.id" :key="item.id" :label="item.name">
                            <span class="select-click-content">{{ item.name }}</span>
                        </Option>
                    </Select>
                    <p class="select-click-text" v-if="formData.lawyerPriceId" @click="seeAgreementDetail('lawyer')">查看</p>
                </FormItem>
                <FormItem label="调查协议" prop="investigatorPriceId">
                    <Select :disabled="formData.projId=='' || (!!taskDetail.id&&taskDetail.state=='RD')" v-model="formData.investigatorPriceId" clearable :placeholder="formData.projId==''?'请先选择项目':'请选择调查结算协议'">
                        <Option v-for="item in investigatorsPriceList" :value="item.id" :key="item.id" :label="item.name">
                            <span class="select-click-content">{{ item.name }}</span>
                        </Option>
                    </Select>
                    <p class="select-click-text" v-if="formData.investigatorPriceId" @click="seeAgreementDetail('investgator')">查看</p>
                </FormItem>
                <FormItem label="附件上传" prop="attachmentList">
                    <Dropdown @on-click="option($event)">
                        <Button type="primary">上传</Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="upload">上传</DropdownItem>
                            <DropdownItem name="selectMaterials">选择材料</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Row class="materials-info-box">
                        <materials-info ref="materialsInfo" :defaultList="formData.attachmentList || []" @getFileList="getMaterialsList"></materials-info>
                    </Row>
                    <file-upload
                        v-if="isBool"
                        v-show="false"
                        ref="fileUpload"
                        :defaultList="defaultList" 
                        :uploadConfig="uploadConfig"
                        @getFileList="getAttachmentList"></file-upload>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入备注"></Input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <!-- 新增 -->
                <span v-show="!taskDetail">
                    <Button type="primary" style="margin-right:10px;" @click="submitNewTask('DT')" :disabled="isSubmit">存为草稿</Button>
                    <Button type="primary" style="margin-right:10px;" v-permission="['mission:audit-']" :disabled="isSubmit" @click="submitNewTask('RD')">发布</Button>
                    <Button type="primary"  v-permission="['mission:audit-',false]" :disabled="isSubmit" @click="submitNewTask('BR')">发布</Button>
                </span>
                <!-- 编辑 -->
                <span v-show="taskDetail">
                    <Button v-show="getState()" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewTask('')">保存</Button>
                    <Button v-show="taskDetail.state!=='RD'" type="primary" style="margin-right:10px;" v-permission="['mission:audit-']" :disabled="isSubmit" @click="submitNewTask('RD')">发布</Button>
                    <Button v-show="taskDetail.state!=='RD'" type="primary"  v-permission="['mission:audit-',false]" :disabled="isSubmit" @click="submitNewTask('BR')">发布</Button>
                </span>
                <Button @click="$emit('closeDrawer',false)">取消</Button>
            </Row>
        </Form>

        <Modal
            v-model="attachmentCtrl"
            title="选择材料"
            :width="600"
            :footer-hide="true">
            <Row style="margin:-16px;">
                <Row style="padding:16px;">
                    <Row style="height:300px;">
                        <div v-if="!formData.projId" style="text-align:center;">请先选择项目</div>  
                        <materials-checklist ref="material" :projectId="formData.projId" :defaultData="selectMaterRialsArr || []" :check="true" v-else></materials-checklist>
                    </Row>
                </Row>
                <Row style="text-align:center;margin:30px 0px 14px;">
                    <Button type="primary" @click="getFinalAttachment">确认</Button>
                    <Button @click="attachmentCtrl=false" style="margin-left: 8px">取消</Button>
                </Row>
            </Row>
        </Modal>

        <!-- 指派团队 -->
        <Modal
            v-model="assignTeamCtrl"
            title="选择指派团队"
            :width="800"
            :footer-hide="true">
            <assignTeam ref="AssignTeam" v-if="formData.missionType==='A'&&assignTeamCtrl" 
                :defaultObjList="defaultTeamList" @refreshList="getIdList($event)"></assignTeam>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <Modal 
            title="协议内容"
            :width="600"
            v-model="agreementCtrl" 
            :footer-hide="true">
            <Row :style="{height:`${clientHeight}px`,overflow:'auto',margin:'-16px',}">
                <lawyer-agreement-info v-if="modalType=='lawyer'&&agreementCtrl" :agreementDetail="agreementDetail"></lawyer-agreement-info>
                <investigator-agreement-info v-if="modalType=='investgator'&&agreementCtrl" :detail="agreementDetail"></investigator-agreement-info>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import Ckeditor from '@/components/common/ckeditor/index.vue';
import lawyerAgreementInfo from "../../agreement/lawyerAgreementInfo.vue";
import investigatorAgreementInfo from '../../agreement/investigatorAgreementInfo';
import materialsChecklist from "./../../projectManage/plugin/materialsChecklist.vue";
import materialsInfo from "./../plugin/materialsInfo/materialsInfo.vue";
import assignTeam from './assignTeam.vue';
export default {
    data () {
        const dateValidate = (rule,value,callback) => {
            if(!value){
                return callback(new Error('请填写截止时间'));
            }
            if(new Date(value).getTime()<Date.now()){
                return callback(new Error('时间不能早于今天'))
            }
            callback()
        }
        return {
            clientHeight:400,
            id:'',
            mainColor:styles,
            missionTypeArr:[],
            missionScopeArr:[],
            costSettlementArr:[],
            assignTeamArr:[], //实际指派团队
            defaultTeamList:[],//默认指派团队
            assignTeamCtrl:false,
            attachmentCtrl:false,
            formData:{
                projId:'',
                project:'',
                name:'',
                customerName:'',
                customerId:'',
                missionType:'P',
                licensorList:[],
                missionScope:'N',
                locationList:[],
                endDate:'',
                description:'',
                priceId:'',
                attachmentList:[],
                remark:'',
                lawyerPriceId:"",
                investigatorPriceId:""
            },
            ruleValidate:{
                projId:[{required: true,message: '所属项目不能为空',type:'number', trigger: 'change'}],
                customerId:[{required: true,message: '客户名称不能为空',type:'number',  trigger: 'blur'}],
                name:[
                    {required: true,message: '任务名称不能为空', trigger: 'blur'},
                    { max:100,message:'不能超过100个字符',trigger:'blur'}
                    ],
                missionScope:[{required: true,message:"调查范围不能为空", trigger: "blur" }],
                locationList:[{required: true,type:"array",message: "调查区域不能为空",trigger: "blur" }],
                missionType:[{required: true,message: '任务类型不能为空', trigger: 'blur'}],
                licensorList:[{required: true,type:"array",message: "指派团队不能为空",trigger: "blur" }],
                endDate:[{required: true,validator:dateValidate, trigger: 'blur'}],
                description:[{required: true,message: '任务介绍不能为空', trigger: 'blur'}],
                // priceId:[{required: true,message: '费用结算不能为空',type:'number', trigger: 'blur'}],
                // attachmentList:[{required: true,type:'array',message: '附件不能为空', trigger: 'blur'}],
                lawyerPriceId:[{required: true,message: '律师协议不能为空',type:"number", trigger: 'blur'}],
                investigatorPriceId:[{required: true,message: '调查协议不能为空',type:"number", trigger: 'blur'}],
                remark:[
                    // {required: true,message: '备注不能为空', trigger: 'blur'},
                    { max:1024,message:'不能超过1024个字符',trigger:'blur'}
                ]
            },
            defaultList:[],
            defaultLocation:[],
            defaultLawyer:[],
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:false
            },
            defaultProject:{},
            isSubmit:false,
            dateOption:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
            lawyerPriceList:[],
            investigatorsPriceList:[],
            agreementCtrl:false,
            agreementDetail:"",
            modalType:"",
            isClickConfirm:false,
            selectMaterRialsArr:[],
            uploadList:[],
            prevMaterRialsArr:[],
            isBool:true
        }
    },
    props: ['taskDetail'],
    methods: {
        // 详情编辑下  DT 草稿 || BR  待审核 || RD 进行中 才有保存
        getState(){
            let state = this.taskDetail.state;
            if(state=='DT'||state=='BR'||state=='RD'){
                return true;
            }
        },
        //查看协议内容
        seeAgreementDetail(type){
            let url = "";
            this.modalType = type;
            if(type=="lawyer"){
                url = "/settlement/agreement-price-lawyers/" + this.formData.lawyerPriceId;
            }else if(type=="investgator"){
                url = "/settlement/agreement-price-investigator/" + this.formData.investigatorPriceId;
            }
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.agreementCtrl = true;
                    this.agreementDetail = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getProjectId(data){
            this.formData.projId = data.id || "";
            this.formData.project = data.name;
            this.formData.customerName = data.customerName;
            this.formData.customerId = data.customerId;
            // this.formData.lawyerPriceId = "";
            // this.formData.investigatorPriceId = "";
            this.$refs.formData.validateField('projId');

            //根据项目获取协议表
            if(this.formData.projId && !this.taskDetail.id){
                this.formData.lawyerPriceId = "";
                this.formData.investigatorPriceId = "";
                this.getLawyerPriceList();
                this.getInvestigatorsPriceList();
            }
        },
        getAttachmentList(arr){
            this.uploadList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                if(item.id){obj.id = item.id}
                this.uploadList.push({
                    attachment:obj,
                    type:""
                });
            });
            this.uploadData();
        },
        getCkeditorData(value){
            this.formData.description = value;
        },
        //获取可用的律师价格表
        getLawyerPriceList(){
            let url = '/settlement/agreement-price-lawyers/effective';
            let ajaxData = {
                projectId:this.formData.projId
            }
            if(this.id){
                ajaxData.missionId = this.id;
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.lawyerPriceList = res.data.records || [];
                }
            })
        },
        //获取可用的调查员价格表
        getInvestigatorsPriceList(){
            let url = '/settlement/agreement-price-investigators/effective';
            let ajaxData = {
                projectId:this.formData.projId
            }
            if(this.id){
                ajaxData.missionId = this.id;
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.investigatorsPriceList = res.data.records || [];
                }
            })
        },
        // 获取地区
        getLocation(data){
            this.formData.locationList = [];
            if(data.length>0){
                data.forEach(item=>{
                    item.cities.forEach(city=>{
                        this.formData.locationList.push({province:item.provinceCode,city:city.code})
                    })
                })
            }else{
                this.formData.locationList = [];
            }
        },
        option(name){
            switch (true) {
                case name=="upload":
                    this.$refs.fileUpload.handleClick();
                break;
                case name=="selectMaterials":
                    if(!this.formData.projId){
                        this.$Message.error("请先选择项目");
                        return
                    }
                    this.openSelectAttachment();
                break;
            }
        },
        openSelectAttachment(){
            this.isClickConfirm = false;
            this.attachmentCtrl = true;
            this.prevMaterRialsArr = JSON.parse(JSON.stringify(this.selectMaterRialsArr));
        },
        getFinalAttachment(){
            this.selectMaterRialsArr = this.$refs.material.selectObjArr;
            this.isClickConfirm = true;
            this.attachmentCtrl = false;
            this.uploadData();
        },
        uploadData(){
            let arr = this.uploadList.concat(this.selectMaterRialsArr);
            this.$refs.materialsInfo.uploadData(arr);
        },
        getMaterialsList(obj){
            this.isBool = false;
            this.defaultList = obj.upload;
            this.uploadList = obj.upload;
            this.selectMaterRialsArr = obj.materials;
            this.$refs.material.uploadCheck(this.selectMaterRialsArr);
            this.isBool = true;
        },
        //获取指派团队
        getIdList(data){
            this.assignTeamArr = data;
        },
        // 确定
        confirm(){
            this.assignTeamCtrl = false;
            this.defaultTeamList = this.assignTeamArr;
        },
        //取消
        cancel(){
            this.assignTeamCtrl = false;
            this.assignTeamArr = this.defaultTeamList;
        },
        //清除指派团队
        clearAssignTeam(item,index){
            this.assignTeamArr.splice(index,1);
            this.defaultTeamList = this.assignTeamArr;
        },
        //获取截止时间
        getEndDate(value){
            this.formData.endDate = value;
        },
        submitNewTask(state){
            let url = '/business/mission';
            this.formData.licensorList = this.assignTeamArr.map(item=>{
                return {teamId:item.teamId,licensorType:item.platformSourceType}
            })
            let ajaxData = this.formData;
            ajaxData.state = state?state:this.taskDetail.state;
            if(this.id){
                ajaxData.id = this.id;
            }
            ajaxData.attachmentList = [];
            let arr = this.uploadList.concat(this.selectMaterRialsArr);
            arr.forEach((item,index)=>{
                 ajaxData.attachmentList.push(item.attachment);
            })
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.id){
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code===0){
                                this.$emit('closeDrawer',true)
                                this.$Message.success('操作成功!');
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code===0){
                                this.$emit('closeDrawer',true)
                                this.$Message.success('操作成功!');
                            }
                        })
                    }
                }
            })
        },
        //赋值
        getTaskDetail(){
            let taskDetail = this.taskDetail;
            this.id = taskDetail.id;
            this.formData.projId = taskDetail.projId;
            this.formData.project = taskDetail.projName;
            this.formData.name = taskDetail.name;
            this.formData.customerName = taskDetail.customerName;
            this.formData.customerId = taskDetail.customerId;
            this.formData.missionType = taskDetail.missionType;
            this.formData.licensorList = taskDetail.licensorList;
            this.assignTeamArr = taskDetail.licensorList.map(item=>{
                return {
                    id:item.teamId+item.licensorType,
                    team:item.teamName,
                    teamId:item.teamId,
                    platformSourceType:item.licensorType
                }
            });
            this.defaultTeamList = this.assignTeamArr;
            this.formData.missionScope = taskDetail.missionScope;
            this.defaultLocation = taskDetail.locationList.length>0?taskDetail.locationList.map(item=>{
                return {
                    code:item.city,
                    name:item.cityName,
                    provinceCode:item.province,
                    province:item.provinceName
                }
            }):[];
            this.formData.endDate = taskDetail.endDate;
            this.formData.description = taskDetail.description;
            this.formData.lawyerPriceId = taskDetail.lawyerPriceId;
            this.formData.investigatorPriceId = taskDetail.investigatorPriceId;
            // this.defaultList = taskDetail.attachmentList;

            taskDetail.attachmentList.forEach((item,index)=>{
                if(!item.type){
                    this.defaultList.push(item.attachment);
                    this.uploadList.push(item);
                }else{
                    this.selectMaterRialsArr.push(item);
                }
            })
            this.formData.attachmentList = this.uploadList.concat(this.selectMaterRialsArr);
            // this.$refs.material.uploadCheck(this.selectMaterRialsArr);

            this.formData.remark = taskDetail.remark;
            this.defaultProject = {
                name:taskDetail.projName,
                id:taskDetail.projId
            }
            this.$nextTick(function(){
                this.$refs.projectSelect.voluation()
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.missionTypeArr = await this.common.getDictionaryItems('mission_type');
            this.missionScopeArr = await this.common.getDictionaryItems('mission_scope');
        }
    },
    created(){},
    beforeMount(){
        this.clientHeight = (document.body.clientHeight - 55)*0.7;
        this.getDictionary();
    },
    mounted(){
        if(this.taskDetail){
            this.getTaskDetail();
            this.getLawyerPriceList();
            this.getInvestigatorsPriceList();
        }
    },
    computed:{},
    updated(){},
    components: {
        Ckeditor,
        lawyerAgreementInfo,
        investigatorAgreementInfo,
        materialsChecklist,
        materialsInfo,
        assignTeam
    },
    watch: {
        attachmentCtrl(newVal,oldVal){
            if(!newVal && !this.isClickConfirm){
                this.selectMaterRialsArr = JSON.parse(JSON.stringify(this.prevMaterRialsArr));
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import "./../../../assets/globalStyle.scss";
.detail-form .tag{
    height: auto;
    border: 1px solid #ebeaf0;
    padding: 4px 7px;
}
.select-click-text{
    line-height: 28px;
    position: absolute;
    top:3px;
    right:35px;
    cursor: pointer;
    color:$globalMainColor;
}
.common-tabs-bar{
    width:100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    li{
        padding:0 8px;
    }
}
.materials-info-box{
    // overflow-y: auto;
}
</style>
