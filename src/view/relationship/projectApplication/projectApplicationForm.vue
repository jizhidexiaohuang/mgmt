<template>
    <div style="height:100%;">
        <div class="project-app-form">
            <Row class="step-box">
                <div class="step-icon-box" @click="toPrev(1)">
                    <i class="icon-correct-01" :style="(step>=1||projectDetail)?iconStyle:''"></i>
                    <p>客户基本信息</p>
                </div>
                <div class="step-line">
                    <i></i>
                </div>
                <div class="step-icon-box" @click="toNext(2)">
                    <i class="icon-correct-01" :style="(step>=2||projectDetail)?iconStyle:''"></i>
                    <p>知产与调研信息</p>
                </div>
                <!-- <div class="step-line">
                    <i></i>
                </div>
                <div class="step-icon-box" v-if="!projectDetail">
                    <i class="icon-correct-01" :style="step==3?iconStyle:''"></i>
                    <i class="icon-down-01" v-if="false"></i>
                    <p>审核</p>
                </div>
                <div class="step-icon-box" v-else>
                    <i class="icon-correct-01" v-if="projectDetail.state=='E'" :style="iconStyle"></i>
                    <i class="icon-down-01" v-else-if="projectDetail.state=='R'||projectDetail.state=='T'" :style="iconErrorStyle"></i>
                    <i class="icon-error-01" v-else></i>
                    <i class="icon-down-01" v-if="false"></i>
                    <p>{{projectState}}</p>
                </div> -->
            </Row>
            <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="120">
                <!-- 第一步申请 start -->
                <Row v-show="step==1">
                    <Row class="detail-header">
                        <span>基本信息</span>
                    </Row>
                    <Row class="detail-form">
                        <FormItem label="客户名称" prop="custId">
                            <Row>
                                <my-select ref="custEvent"
                                    :path="'/base/customer/opportunities'"
                                    :keyName="'name'"
                                    :params="{type:'G'}"
                                    :placeholder="'请选择客户'"
                                    :inputKey="'name'"
                                    :defaultObj="selectDefaultObj"
                                    @getValue="getCustomerId"
                                    ></my-select>
                            </Row>
                        </FormItem>
                        <Row class="detail-content" v-if="formData.custId">
                            <Row>
                                <Col span="5" class="left-label" style="width:120px;padding-right:12px;">客户标签</Col>
                                <Col span="16" class="right-content">
                                    <Tag :color="mainColor.globalMainColor" v-for="(item,index) in customerDetail.tags" class="cust-info-tag" :key="index" type="border">{{item}}</Tag>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="5" class="left-label" style="width:120px;padding-right:12px;">客户性质</Col>
                                <Col span="16" class="right-content">{{customerDetail.customerNatureName}}</Col>
                            </Row>
                            <Row>
                                <Col span="5" class="left-label" style="width:120px;padding-right:12px;">所属区域</Col>
                                <Col span="16" class="right-content">{{customerDetail.provinceName || ""}}{{customerDetail.cityName || ""}}{{customerDetail.areaName || ""}}</Col>
                            </Row>
                            <Row>
                                <Col span="5" class="left-label" style="width:120px;padding-right:12px;">客户等级</Col>
                                <Col span="16" class="right-content">{{customerDetail.level}}</Col>
                            </Row>
                        </Row>
                    </Row>
                    <Row class="detail-header">
                        <span>客户需求</span>
                    </Row>
                    <Row class="detail-form">
                        <FormItem label="主要产品" prop="product">
                            <Input v-model.trim="formData.product" placeholder="请输入主要产品"></Input>
                        </FormItem>
                        <FormItem label="自有品牌情况" prop="brandCondition">
                            <Input v-model.trim="formData.brandCondition" type="textarea" :row="4" placeholder="请输入自有品牌情况"></Input>
                        </FormItem>
                        <FormItem label="授权品牌情况" prop="brandAuthCondition">
                            <Input v-model.trim="formData.brandAuthCondition" type="textarea" :row="4" placeholder="请输入授权品牌情况"></Input>
                        </FormItem>
                        <FormItem label="代工贴牌情况" prop="brandOemCondition">
                            <Input v-model.trim="formData.brandOemCondition" type="textarea" :row="4" placeholder="主要指专利的代工贴牌"></Input>
                        </FormItem>
                        <FormItem label="正品销售渠道" prop="salesChannel">
                            <Select v-model="formData.salesChannel" multiple placeholder="请选择正品销售渠道">
                                <Option v-for="item in distriChannelArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="渠道备注信息" prop="salesChannelRemark" v-if="formData.salesChannel.indexOf('Other')!=-1">
                            <Input v-model.trim="formData.salesChannelRemark" type="textarea" :row="4" placeholder="请输入渠道备注信息"></Input>
                        </FormItem>
                        <FormItem label="维权态度" prop="attitude">
                            <RadioGroup v-model="formData.attitude">
                                <Radio v-for="item in attitudeArr" :label="item.value" :key="item.value">{{ item.nameZh }}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="诉求" prop="appeal">
                            <Select v-model="formData.appeal" multiple placeholder="请选择诉求">
                                <Option v-for="item in appealArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="流程管控要求" prop="procedureControllRequirement">
                            <Input v-model.trim="formData.procedureControllRequirement" type="textarea" :row="4" placeholder="请输入流程管控要求"></Input>
                        </FormItem>
                        <FormItem label="主要权利" prop="mainRight">
                            <Select v-model="formData.mainRight" multiple placeholder="请选择主要权利">
                                <Option v-for="item in mainRightArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="主要权利备注" prop="mainRightRemark">
                            <Input v-model.trim="formData.mainRightRemark" type="textarea" :row="4" placeholder="请输入备注信息"></Input>
                        </FormItem>
                        <FormItem label="授权情况" prop="authorizationScope">
                            <Input v-model.trim="formData.authorizationScope" type="textarea" :row="4" placeholder="销售及生产商白名单"></Input>
                        </FormItem>
                        <FormItem label="鉴假方法" prop="identificationMethod">
                            <Input v-model.trim="formData.identificationMethod" type="textarea" :row="4" placeholder="请输入识假鉴别方法"></Input>
                        </FormItem>
                        <FormItem label="调查取证要求" prop="locationType">
                            <RadioGroup v-model="formData.locationType">
                                <Radio label="all">全国</Radio>
                                <Radio label="part">区域</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="调查区域" prop="locationList" v-if="formData.locationType=='part'">
                            <choose-city v-on:listenLocation="getLocation" :defaultLocation="defaultLocation"></choose-city>
                        </FormItem>
                        <FormItem label="其他维权代理商" prop="otherAgentScope">
                            <Input v-model.trim="formData.otherAgentScope" type="textarea" :row="4" placeholder="与安盾合作后，是否有其他代理商共同参与维权，如有，请输入各代理商授权区域及范围"></Input>
                        </FormItem>
                        <FormItem label="居间授权/加盟/许可需求" prop="cooperateRequirement">
                            <Input v-model.trim="formData.cooperateRequirement" type="textarea" :row="4" placeholder="请输入居间授权、加盟、许可等需求"></Input>
                        </FormItem>
                        <FormItem label="对客户的承诺" prop="promise">
                            <Input v-model.trim="formData.promise" type="textarea" :row="4" placeholder="请输入市场部对客户的承诺内容"></Input>
                        </FormItem>
                        <FormItem label="其它要求" prop="otherRequirement">
                            <Input v-model.trim="formData.otherRequirement" type="textarea" :row="4" placeholder="请输入其他要求"></Input>
                        </FormItem>
                    </Row>
                </Row>
                <!-- 第一步申请 end -->
                <!-- 第二步可行性分析 start -->
                <Row v-show="step==2">
                    <Row class="detail-header">
                        <span>知产情况</span>
                    </Row>
                    <Row class="detail-form">
                        <FormItem label="知名商标" prop="custTrademarkList"
                        :rules="{required:step==2?true:false, type:'array', message:'知名商标不能为空',trigger:'blur'}">
                            <div class="tag">
                                <Tag class="tag-style" v-for="item in formData.custTrademarkList" 
                                    :key="item" type="border" 
                                    :color="mainColor.globalMainColor" 
                                    :name="item" closable @on-close="handleClose2">{{item}}</Tag>
                                <Button icon="ios-add" type="dashed" size="small" @click="showTagInput" v-show="tagCtrl">添加标签</Button>
                                <Input v-model.trim="tagName" ref="input" style="width:120px;" maxlength="30" v-show="!tagCtrl" @on-blur="addTag" @on-enter="addTag"></Input>
                            </div>
                        </FormItem>
                    </Row>
                    <Row class="detail-header">
                        <span>线上店铺调研</span>
                    </Row>
                    <Row class="detail-form">
                        <FormItem label="关键字" prop="onlineKeyword"
                            :rules="{required: step==2?true:false,message: '关键字不能为空',trigger:'blur'}">
                            <Input type="text" v-model.trim="formData.onlineKeyword" placeholder="请输入关键字"></Input>
                            <span :style="{'color':mainColor.labelColor}">多个关键字请使用英文","进行分隔，例如：品牌,产品</span>
                        </FormItem>
                    </Row>
                    <Row class="detail-header">
                        <span>线下店铺调研</span>
                    </Row>
                    <Row class="detail-form">
                        <FormItem label="是否有线下店铺检索信息" prop="isShopSearch"
                            :rules="{required: step==2?true:false,message: '是否有线下检索信息不能为空',trigger:'change'}">
                            <RadioGroup v-model="formData.isShopSearch">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="关键字" prop="offlineKeyword" v-if="formData.isShopSearch=='1'"
                            :rules="{required: step==2?true:false,message: '关键字不能为空',trigger:'blur'}">
                            <Input type="text" v-model.trim="formData.offlineKeyword" placeholder="请输入关键字"></Input>
                            <span :style="{'color':mainColor.labelColor}">多个关键字请使用英文","进行分隔，例如：品牌,产品</span>
                        </FormItem>
                    </Row>
                    <Row class="detail-header">
                        <span>添加案例</span>
                    </Row>
                    <Row class="detail-form">
                        <Row v-for="(itemCase,index) in formData.caseList" :key="index" v-if="false">
                            <Col span="12">
                                <div class="require-tips">*</div>
                                <FormItem :label="'案例'+(index+1)" :prop="'caseList.'+index+'.industry'" style="width:calc(100% - 10px)">
                                    <Select v-model="itemCase.industry" placeholder="请选择案例行业">
                                        <Option v-for="item in appealArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem :label-width="0" :prop="'caseList.'+index+'.custCaseId'" :rules="step==2?ruleValidate.subject:{required:false}" style="width:calc(100% - 32px);float:left">
                                    <my-select :ref="'caseEvent'+index"
                                        :path="'/base/cust-case'"
                                        :keyName="'name'"
                                        :params="{}"
                                        :placeholder="'请选择案例'"
                                        :defaultObj="defaultCustCaseId[index]"
                                        @getValue="getCaseExampleId($event,index)"
                                        ></my-select>
                                </FormItem>
                                <span v-if="index==0" @click="addItem" class="icon-increase-01 add-icon"></span>
                                <span v-if="index!=0" @click="removeItem(index)" class="icon-down-01 remove-icon"></span>
                            </Col>
                        </Row>
                        <Row v-for="(itemCase,index) in formData.caseList" :key="index">
                            <div class="require-tips">*</div>
                            <FormItem
                                :label="'案例'+(index+1)" 
                                :prop="'caseList.'+index+'.custCaseId'" 
                                :rules="step==2?ruleValidate.subject:{required:false}">
                                <my-select :ref="'caseEvent'+index"
                                    style="width:calc(100% - 32px);"
                                    :path="'/base/cust-case'"
                                    :keyName="'name'"
                                    :params="{}"
                                    :placeholder="'请选择案例'"
                                    :defaultObj="defaultCustCaseId[index]"
                                    @getValue="getCaseExampleId($event,index)">
                                </my-select>
                                <span v-if="index==0" @click="addItem" class="icon-increase-01 add-icon"></span>
                                <span v-if="index!=0" @click="removeItem(index)" class="icon-down-01 remove-icon"></span>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
            </Form>
        </div>
        <div class="bottom-btn">
            <Button type="primary" @click="toPrev('')" v-show="step>1">上一步</Button>
            <Button type="primary" @click="toNext('')" v-show="step<2">下一步</Button>
            <!-- 新增 -->
            <span v-show="!projectDetail">
                <Button type="primary" @click="submitData('D')" v-show="step==2">存为草稿</Button>
                <Button type="primary" @click="submitData('E')" v-permission="['market-center:opportunities:audit:audit-']" v-show="step==2">生成项目建议书</Button>
                <Button type="primary" @click="submitData('P')" v-permission="['market-center:opportunities:audit:audit-',false]" v-show="step==2">生成项目建议书</Button>
            </span>
            <span v-show="projectDetail">
                <Button type="primary" @click="submitData('D')" v-show="step==2 && (projectDetail.state=='D' || projectDetail.state=='P')">保存</Button>
                <Button type="primary" @click="submitData('E')" v-permission="['market-center:opportunities:audit:audit-']" v-show="step==2 && (projectDetail.state!='E')">生成项目建议书</Button>
                <Button type="primary" @click="submitData('P')" v-permission="['market-center:opportunities:audit:audit-',false]" v-show="step==2 && (projectDetail.state!='E')">生成项目建议书</Button>
            </span>
            <Button @click="$emit('changeEditCtrl',false);" >取消</Button>
        </div>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const isUnquiueCust = (rule, value, callback) => {
            if(!this.formData.custId){
                return callback(new Error('客户名称不能为空'));
            }
            if(this.prevCustId==this.formData.custId){
                return callback();
            }
            let url = `/base/customer-opportunitie/${this.formData.custId}/check-name`;
            this.$get(url).then(res=>{
                if(res.code==0&&(!res.data)){
                    callback()
                }else{
                    return callback(new Error('该客户已申请立项'));
                }
            })
        };
        const caseExampleIdValid = (rule, value, callback) => {
            let arr = rule.fullField.split(".");
            let prop = arr[0];
            let index = arr[1];
            let attr = arr[2];
            if(attr=='custCaseId'){
                if(!!!this.formData[prop][index].custCaseId){
                    return callback(new Error('请选择案例'))
                }
            }
            callback()
        }
        return {
            mainColor:styles,
            iconStyle:{
                color:styles.globalMainColor
            },
            iconErrorStyle:{
                color:styles.errorColor
            },
            customerDetail:{},
            step:1,
            formData:{
                custId:"",
                product:"",
                brandCondition:"",
                brandAuthCondition:"",
                brandOemCondition:"",
                salesChannel:"",
                salesChannelRemark:"",
                attitude:"A",
                appeal:"",
                procedureControllRequirement:"",
                mainRight:"",
                mainRightRemark:"",
                authorizationScope:"",
                identificationMethod:"",
                locationList:[],
                otherAgentScope:"",
                cooperateRequirement:"",
                promise:"",
                otherRequirement:"",
                rightAnalysis:"",
                locationType:"all",
                custTrademarkList:[],
                onlineKeyword:'',
                isShopSearch:'1',
                offlineKeyword:'',
                caseList:[
                    {
                        industry:'',
                        custCaseId:'',
                    }
                ]
            },
            ruleValidate:{
                custId:[{required: true,validator:isUnquiueCust, trigger: 'change'}],
                product:[{required: true, message: '主要产品不能为空', trigger: 'change'}],
                brandCondition:[{required: true, message: '自有品牌不能为空', trigger: 'change'}],
                brandAuthCondition:[{required: true, message: '授权品牌不能为空', trigger: 'change'}],
                salesChannel:[{required: true,type:"array",message:"正品销售渠道不能为空",trigger:'change'}],
                salesChannelRemark:[{required: true, message: '渠道备注信息不能为空', trigger: 'change'}],
                attitude:[{required: true, message: '维权态度不能为空', trigger: 'change'}],
                appeal:[{required: true,type:"array",message:"诉求不能为空",trigger:'change'}],
                procedureControllRequirement:[{required: true,message: '流程管控要求不能为空',trigger:'change'}],
                mainRight:[{required: true,type:"array",message:"主要权利不能为空",trigger:'change'}],
                locationType:[{required: true,message:"客户调查取证要求范围", trigger: "blur" }],
                locationList:[{required: true,type:"array",message: "客户调查取证要求范围不能为空",trigger: "blur" }],

                subject:[{validator:caseExampleIdValid}],
            },
            selectedSalesChannel:[],
            selectedAppeal:[],
            selectedMainRight:[],
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:false
            },
            uploadContractConfig:{
                fileName:'',
                readOnly:true
            },
            selectDefaultObj:{},
            defaultLocation:[],         //区域多选默认值
            distriChannelArr:[],
            attitudeArr:[],
            appealArr:[],
            mainRightArr:[],
            prevCustId:"",
            tagCtrl:true,
            tagName:'',
            defaultCustCaseId:[],
            xidaToken:''
        }
    },
    props: ['projectDetail'],
    methods: {
        showTagInput(){
            this.tagCtrl = false;
            this.$nextTick(()=>{
                this.$refs.input.focus();
            })
        },
        //添加客户标签
        addTag(){
            if(this.tagName){
                if(this.formData.custTrademarkList.indexOf(this.tagName)==-1){
                    this.formData.custTrademarkList.push(this.tagName);
                    this.tagName = '';
                    this.tagCtrl = true;
                }else{
                    this.$Message.error('请输入一个不存在的标签!');
                }
            }else{
                this.tagCtrl = true;
            }
        },
        handleClose2 (event, name) {
            const index = this.formData.custTrademarkList.indexOf(name);
            this.formData.custTrademarkList.splice(index, 1);
        },
        addItem(){
            this.formData.caseList.push({
                industry:'',
                custCaseId:''
            })
        },
        removeItem(index){
            this.formData.caseList.splice(index,1);
        },
        // 获取客户id
        getCustomerId(obj){
            this.formData.custId = obj.id;
            this.getCustomerDetail();
            this.$refs.formData.validateField('custId');
        },
        // 获取客户详情
        getCustomerDetail(){
            let url = '/base/customer/'+this.formData.custId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.customerDetail = res.data;
                    if(this.projectDetail){
                        this.selectDefaultObj.name = this.customerDetail.name;
                        this.selectDefaultObj.id = this.customerDetail.id;
                    }
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
        // 将对应下拉多选转化为字符串逗号分割
        getString(key,arr){
            let str = "";
            arr.forEach((item,index)=>{
                if(index==arr.length-1){
                    str += item;
                }else{
                    str += `${item},`;
                }
            })
            this.formData[key] = str;
        },
        // 获取案例
        getCaseExampleId(data,index){
            this.formData.caseList[index].custCaseId = data.id;
        },
        // 上一步
        toPrev(page){
            if(page){
                this.step = page;
            }else{
                this.step--;
            }
        },
        // 下一步
        toNext(page){
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    if(page){
                        this.step = page;
                    }else{
                        this.step++;
                    }
                }
            })
        },
        // 提交
        submitData(state){
            let url = '/base/customer-opportunitie';
            let ajaxData = {
                state:state
            }
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    if(this.projectDetail){
                        ajaxData.id = this.projectDetail.id;
                    }
                    Object.assign(ajaxData,this.formData);
                    if(ajaxData.locationType=="all"){
                        ajaxData.locationList = [];
                    }

                    delete ajaxData.locationType;

                    ajaxData.salesChannel = ajaxData.salesChannel.join(",");
                    ajaxData.appeal = ajaxData.appeal.join(",");
                    ajaxData.mainRight = ajaxData.mainRight.join(",");

                    ajaxData.isShopSearch = Number(ajaxData.isShopSearch);

                    // 去重
                    let list = this.common.removeDuplication(ajaxData.caseList,'custCaseId');
                    ajaxData.opportunitiesCaseRelationList = list.map(item=>{
                        return {custCaseId: item.custCaseId}
                    })
                    delete ajaxData.caseList;
                    
                    ajaxData.token = this.xidaToken;
                 
                    if(!this.projectDetail){
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else{
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            })
        },
        // 赋默认值
        giveProjectDetail(){
            
            let projectDetail = this.projectDetail;
            for(let key in this.formData){
                this.formData[key] = projectDetail[key]
            }
            this.formData.custId = projectDetail.custId + "";
            // this.formData.product = projectDetail.product;
            // this.formData.brandCondition = projectDetail.brandCondition;
            // this.formData.brandAuthCondition = projectDetail.brandAuthCondition;
            this.formData.salesChannel = projectDetail.salesChannel?projectDetail.salesChannel.split(","):[];
            // this.formData.salesChannelRemark = projectDetail.salesChannelRemark;
            // this.formData.attitude = projectDetail.attitude;
            this.formData.appeal = projectDetail.appeal?projectDetail.appeal.split(","):[];
            // this.formData.procedureControllRequirement = projectDetail.procedureControllRequirement;
            this.formData.mainRight = projectDetail.mainRight?projectDetail.mainRight.split(","):[];
            // this.formData.mainRightRemark = projectDetail.mainRightRemark;
            // this.formData.authorizationScope = projectDetail.authorizationScope;
            // this.formData.identificationMethod = projectDetail.identificationMethod;
            this.formData.locationList = projectDetail.locationList || [];
            // this.formData.otherAgentScope = projectDetail.otherAgentScope;
            // this.formData.cooperateRequirement = projectDetail.cooperateRequirement
            // this.formData.promise = projectDetail.promise;
            // this.formData.otherRequirement = projectDetail.otherRequirement;

            // this.formData.rightAnalysis = projectDetail.rightAnalysis;

            if(projectDetail.locationList && projectDetail.locationList.length>0){
                this.formData.locationType = "part";
            }else{
                this.formData.locationType = "all";
            }

            this.defaultLocation = projectDetail.locationList.length>0?projectDetail.locationList.map(item=>{
                return {
                    code:item.city,
                    name:item.cityName,
                    provinceCode:item.province,
                    province:item.provinceName
                }
            }):[];

            this.prevCustId = projectDetail.custId + "";

            this.selectDefaultObj = {
                id:projectDetail.custId+"",
                name:projectDetail.custName
            }
            if(projectDetail.opportunitiesCaseRelationList&&projectDetail.opportunitiesCaseRelationList.length>0){
                this.formData.caseList = projectDetail.opportunitiesCaseRelationList.map((item,index)=>{
                    this.defaultCustCaseId[index] = {
                        id:item.custCaseId,
                        name:item.name
                    }
                    this.$nextTick(function(){
                        this.$refs['caseEvent'+index][0].voluation();
                    })
                    return {
                        industry:'',
                        custCaseId:item.custCaseId,
                    }
                })
            }else{
                this.formData.caseList = [
                    {
                        industry:'',
                        custCaseId:'',
                    }
                ]
            }
            this.$nextTick(function(){
                this.$refs.custEvent.voluation();
            })

            this.getCustomerDetail();
        },
        //获取字典数据接口
        async getDictionary(){
            this.distriChannelArr = await this.common.getDictionaryItems('customer_sales_channel');
            this.attitudeArr = await this.common.getDictionaryItems('customer_attitude');
            this.appealArr = await this.common.getDictionaryItems('customer_appeal');
            this.mainRightArr = await this.common.getDictionaryItems('customer_right');
        },
    },
    created(){},
    beforeMount(){
        this.xidaToken = this.common.getCookie("xdtoken");
        this.getDictionary();
    },
    mounted(){
        if(this.projectDetail){
            this.giveProjectDetail();
        }
    },
    updated(){},
    components: {},
    computed:{
        projectState(){
            if(this.projectDetail){
                switch (this.projectDetail.state){
                    case 'P':return '待审核';break;
                    case 'E':return '通过';break;
                    case 'R':return '驳回';break;
                    case 'T':return '终止';break;
                    default:return '草稿';break;
                }
            }
        }
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./step.scss";
.project-app-form{
    height: calc(100% - 51px);
    overflow: auto;
    .left-label{
        width:100px;
    }
}
.bottom-btn{
    width: 100%;
    text-align: center;
    line-height: 50px;
    border-top:1px solid $borderColor;
    box-shadow: 10px 12px 15px #888888;
}
</style>
