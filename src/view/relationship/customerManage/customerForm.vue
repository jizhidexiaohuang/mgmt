<template>
    <div class="customer-form">
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
        <Row class="detail-form">
            <FormItem label="客户性质" prop="customerNature">
                <RadioGroup v-model="formData.customerNature" placeholder="请选择客户性质">
                    <Radio :label="item.value" v-for="item in customerTypeArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="客户名称" prop="name">
                <tianyancha v-if="detailsCtrl" :defaultName="formData.name" @getCustomerName="getCustomerInfo" />
            </FormItem>
            <FormItem label="简称" prop="abbreviation" v-if="formData.customerNature=='E'"
                :rules="[{required: true,message: '客户简称不能为空',trigger:'blur'},
                        {max:32,message:'不能超过32个字符',trigger:'blur'}]">
                <Input type="text" v-model.trim="formData.abbreviation" placeholder="请输入客户的简称"></Input>
            </FormItem>
            <FormItem label="公司logo" prop="icon" v-if="formData.customerNature=='E'"
                :rules="[{required: true,message: '公司logo不能为空',trigger:'change'}]">
                <file-upload 
                    :defaultList="defaulLogoList" 
                    :uploadConfig="uploadConfig"
                    @getFileList="getLogoAttachmentList"></file-upload>
            </FormItem>
            <FormItem label="客户介绍" prop="introduce" v-if="formData.customerNature=='E'"
                :rules="[{required:true,message:'客户介绍不能为空',trigger:'blur'},
                        {max:512,message:'不能超过512个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.introduce" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入客户的介绍"></Input>
            </FormItem>
            <FormItem label="客户等级" prop="level">
                <Select v-model="formData.level" placeholder="请选择客户等级">
                    <Option v-for="item in customerLevelArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                </Select>
            </FormItem>
            <FormItem label="客户标签" prop="tags">
                <div class="tag">
                    <Tag class="tag-style" v-for="item in formData.tags" 
                        :key="item" type="border" 
                        :color="mainColor.globalMainColor" 
                        :name="item" closable @on-close="handleClose2">{{item}}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="showTagInput" v-show="tagCtrl">添加标签</Button>
                    <Input v-model.trim="tagName" ref="input" style="width:120px;" maxlength="30" v-show="!tagCtrl" @on-blur="addTag" @on-enter="addTag"></Input>
                </div>
            </FormItem>
            <FormItem label="法人代表" prop="legalRepresentative" v-if="formData.customerNature!='P'"
                :rules="[{required: true, message: '法定代表人不能为空', trigger: 'blur'},
                    {max:32,message:'不能超过32个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.legalRepresentative" placeholder="请输入法定代表人"></Input>
            </FormItem>
            <FormItem :label="formData.customerNature=='P'?'身份证号':'信用代码'" prop="certificateNumber"
                :rules="[{required: true,validator:this.validateLicense, trigger: 'blur'}]">
                <Input v-model.trim="formData.certificateNumber" :placeholder="formData.customerNature=='P'?'请输入身份证号':'请输入信用代码'"></Input>
            </FormItem>
            <FormItem label="经营范围" prop="business">
                <Input v-model.trim="formData.business" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入经营范围"></Input>
            </FormItem>
            <FormItem label="所属区域" prop="province">
                <City ref="cityEvent" v-if="detailsCtrl" v-on:listenCity="getCity($event)" :cityList="cityList"></City>
            </FormItem>
            <FormItem label="详细地址" prop="address"
                :rules="[{required: true, message: '详细地址不能为空', trigger: 'blur'},
                    {max:255,message:'不能超过255个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.address" type="textarea" :row="4" placeholder="请输入详细地址"></Input>
            </FormItem>
            <FormItem label="实际所属区域" prop="actualProvince" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '省市区不能为空', trigger: 'change'}]">
                <City ref="actualCityEvent" v-if="detailsCtrl" v-on:listenCity="getCity($event,'actual')" :cityList="actualCityList"></City>
                <span class="error-color">直辖市必须添加区，省、自治区必须添加市</span>
            </FormItem>
            <FormItem label="实际联系地址" prop="actualAddress" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '联系地址不能为空', trigger: 'blur'},
                    {max:255,message:'不能超过255个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.actualAddress" type="textarea" :row="4" placeholder="请输入联系地址"></Input>
            </FormItem>
            <FormItem label="是否上市" prop="isIpo" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '是否上市', trigger: 'change'}]">
                <RadioGroup v-model="formData.isIpo">
                    <Radio label="1">是</Radio>
                    <Radio label="0">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="行业地位" prop="positionInIndustry" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '行业地位不能为空', trigger: 'change'}]">
                <RadioGroup v-model="formData.positionInIndustry">
                    <Radio v-for="(item,index) in positionInIndustryArr" :key="index" :label="item.value">{{item.nameZh}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="运作方式" prop="modeOfOperation" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '运作方式不能为空', trigger: 'change'}]">
                <Select v-model="formData.modeOfOperation" placeholder="请选择运作方式">
                    <Option v-for="item in modeOfOperationArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                </Select>
            </FormItem>
        </Row>
        <Row class="detail-header">
            <span>业务信息</span>
        </Row>
        <Row class="detail-form">
            <FormItem label="所属行业" prop="industryId">
                <mySelect ref="industrySelect"
                    :path="'/base/industry'"
                    :placeholder="'请选择行业名称'"
                    :placeholderInput="'请输入行业名称'"
                    :keyName="'industryName'"
                    :defaultObj="industryObj"
                    @getValue="getIndustryId">
                </mySelect>
            </FormItem>
            <FormItem label="主营业务" prop="mainBusiness" v-if="formData.customerNature=='E'"
                :rules="[{required: true, message: '经营范围不能为空', trigger: 'blur'},
                    {max:1024,message:'不能超过1024个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.mainBusiness" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入主营业务"></Input>
            </FormItem>
            <FormItem label="负责人" prop="principalIds">
                <div class="tag">
                    <Tag class="tag-style" v-for="(item,index) in personInChargeArr" :key="index" type="border" :color="mainColor.globalMainColor" closable @on-close="clearOptions()">{{item.name}}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="personInChargeCtrl=true" v-show="personInChargeArr.length==0">添加负责人</Button>
                </div>
            </FormItem>
            <FormItem label="协作人" prop="assistIds">
                <div class="tag">
                    <Tag class="tag-style" v-for="(item,index) in collaboratorArr" :key="index" type="border" :color="mainColor.globalMainColor" closable @on-close="clearCollaborator(item,index)">{{item.name}}</Tag>
                    <Button icon="ios-add" type="dashed" size="small" @click="collaboratorCtrl=true">添加协作人</Button>
                </div>
            </FormItem>
        </Row>
        <Row class="detail-header">
            <span>合作信息</span>
        </Row>
        <Row class="detail-form">
            <FormItem label="客户来源" prop="source">
                <Select v-model="formData.source" placeholder="请选择客户来源">
                    <Option v-for="item in customerSourceArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                </Select>
            </FormItem>
            <FormItem label="渠道商" prop="channelId" 
                v-if="formData.source=='C'"
                :rules="{ required: true, message: '渠道商不能为空', trigger: 'blur' }">
                <mySelect ref="channelSelect"
                    :path="'/base/customers'"
                    :placeholder="'请选择渠道商'"
                    :params="{type:'C'}"
                    :keyName="'name'"
                    :defaultObj="channelObj"
                    @getValue="getChannelId">
                </mySelect>
            </FormItem>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewCustomer('formData')">保存</Button>
                <Button @click="cancel">取消</Button>
            </Row>
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
                @getValue="getPersonInCharge"
                :rightHide="false"
                :single="true"
                :defaultData="defaultPersonInCharge"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="personInChargeCtrl=false;">确认</Button>
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
                @getValue="getCollaborator"
                :rightHide="false"
                :single="false"
                :defaultData="defaultCollaborator"
                :disabledList="disabledList"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="collaboratorCtrl=false;">确认</Button>
                <Button @click="collaboratorCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <Message ref="message" :message="'此账号已存在系统中!'" :iconType="'error'"></Message>

        <!-- 行业切换modal -->
        <Modal
            v-model="confirmModal"
            title="行业切换确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips error-color">行业修改后，项目建议书会被删除</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="confirmSubmit">确认</Button>
                <Button @click="confirmModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import Message from '@/components/common/message/message';
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const validateCustomerName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('客户名称不能为空'));
            }
            if(value.legnth>64){
                return callback(new Error('长度不能超过64个字符'));
            }
            let url = '/base/customer/check-name';
            let ajaxData = {
                name:this.formData.name,
                id:this.customerDetail?this.customerDetail.id:''
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0&&(!res.data)){
                    callback()
                }else{
                    callback(new Error('客户已存在'));
                }
            })
        };
        const validateLicense = (rule,value,callback) => {
            if(!value&&this.formData.customerNature!=='P'){
                return callback(new Error('请输入企业信用代码'))
            }
            if(!value&&this.formData.customerNature==='P'){
                return callback(new Error('请输入身份证号码'))
            }
            if(value&&value.legnth>32){
                return callback(new Error('长度不能超过32个字符'));
            }
            if(value&&this.formData.customerNature==='P'){
                let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if(!reg.test(value)){
                    return callback(new Error('请输入正确的身份证号码'))
                }
            }
            if(value&&this.formData.customerNature!=='P'){
                let reg = /^[A-Za-z0-9]{18}$/;
                if(!reg.test(value)){
                    return callback(new Error('请输入正确的信用代码'))
                }
            }
            callback()
        };
        return {
            mainColor:styles,
            validateLicense:validateLicense,
            formData:{
                customerNature:"E",
                name:"",
                abbreviation:'',
                icon:'',
                tags:[],
                introduce:'',
                level:'',
                legalRepresentative:"",
                certificateNumber:"",
                business:"",
                province:"",
                city:'',
                area:'',
                address:"",
                actualProvince:'',
                actualCity:'',
                actualArea:'',
                actualAddress:'',
                isIpo:'1',
                positionInIndustry:'H',
                modeOfOperation:'',
                industryId:"",
                mainBusiness:'',
                principalIds:[],
                assistIds:[],
                source:"",
                channelId:"",
            },
            ruleValidate:{
                customerNature:[{required: true, message: '客户性质不能为空', trigger: 'change'}],
                name:[{required: true,validator:validateCustomerName,trigger:'blur'}],
                tags:[{required: true, type:'array', message: '客户标签不能为空', trigger: 'blur'}],
                // legalRepresentative:[
                //     {required: true, message: '法定代表人不能为空', trigger: 'blur'},
                //     {max:32,message:'不能超过32个字符',trigger:'blur'}
                // ],
                // certificateNumber:[
                //     {required: true, message: '信用代码不能为空', trigger: 'blur'},
                //     {max:32,message:'不能超过32个字符',trigger:'blur'}
                // ],
                province:[{required: true, message: '省市区不能为空', trigger: 'change'}],
                // address:[
                //     {required: true, message: '详细地址不能为空', trigger: 'blur'},
                //     {max:255,message:'不能超过255个字符',trigger:'blur'}
                // ],
                industryId:[{required: true, type:'number', message: '所属行业不能为空', trigger: 'change'}],
                business:[
                    {required: true, message: '主营业务不能为空', trigger: 'blur'},
                    {max:1024,message:'不能超过1024个字符',trigger:'blur'}
                ],
                principalIds:[{required: true, type:'array', message: '负责人不能为空', trigger: 'change'}],
                // assistIds:[{required: true, type:'array',message: '协作人不能为空', trigger: 'change'}],
                source:[{required: true, message: '客户来源不能为空', trigger: 'change'}],
                level:[{required: true, message: '客户等级不能为空', trigger: 'change'}],
            },
            tagCtrl:true,
            tagName:'',
            customerTypeArr:[],//客户类型
            customerSourceArr:[], //客户来源
            cooperationModeArr:[], //合作模式
            customerLevelArr:[],//客户等级
            personInChargeCtrl:false,//负责人弹框
            collaboratorCtrl:false, //协作人弹框
            personInChargeArr:[], //负责人
            collaboratorArr:[],//协作人
            timer:0,
            selectLoading:false,
            tianyanchaList:[],
            cityList:[],
            actualCityList:[],
            detailsCtrl:false,
            defaultPersonInCharge:[],//默认负责人
            defaultCollaborator:[],//默认协作人
            channelObj:{},
            industryObj:{},
            disabledList:[],//选完负责人之后  协作人不可选
            isSubmit:false,
            defaulLogoList:[],
            uploadConfig:{
                readOnly:false,
                maxNum:1
            },
            positionInIndustryArr:[],
            modeOfOperationArr:[],
            confirmModal:false,
            confirmFlag:true,
        }
    },
    props: ['customerDetail'],
    methods: {
        showTagInput(){
            this.tagCtrl = false;
            this.$nextTick(()=>{
                this.$refs.input.focus();
            })
        },
        // 客户logo
        getLogoAttachmentList(arr){
            this.formData.icon = '';
            if(arr&&arr.length>0){
                this.formData.icon = arr[0].url;
            }
        },
        //搜索条件省市区接口
        getCity(data,type){
            type = type?type:'';
            if(data.length!=0){
                if(data.length==1){
                    this.formData[type ? type+'Province':'province'] = data[0].value;
                    this.formData[type ? type+'City':'city'] = '';
                    this.formData[type ? type+'Area':'area'] = '';
                }else if(data.length==2){
                    this.formData[type ? type+'Province':'province'] = data[0].value;
                    this.formData[type ? type+'City':'city'] = data[1].value;
                    this.formData[type ? type+'Area':'area'] = '';
                }else if(data.length==3){
                    this.formData[type ? type+'Province':'province'] = data[0].value;
                    this.formData[type ? type+'City':'city'] = data[1].value;
                    this.formData[type ? type+'Area':'area'] = data[2].value;
                }
            }else{
                this.formData[type ? type+'Province':'province'] = '';
                this.formData[type ? type+'City':'city'] = '';
                this.formData[type ? type+'Area':'area'] = '';
            }
        },
        //添加客户标签
        addTag(){
            if(this.tagName){
                if(this.formData.tags.indexOf(this.tagName)==-1){
                    this.formData.tags.push(this.tagName);
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
            const index = this.formData.tags.indexOf(name);
            this.formData.tags.splice(index, 1);
        },
        //获取字典数据接口
        async getDictionary(){
            this.customerTypeArr = await this.common.getDictionaryItems('customer_nature');
            this.cooperationModeArr = await this.common.getDictionaryItems('coop_mode');
            this.customerSourceArr = await this.common.getDictionaryItems('customer_source');
            this.customerLevelArr = await this.common.getDictionaryItems('customer_level');
            this.positionInIndustryArr = await this.common.getDictionaryItems('position_in_industry');
            this.modeOfOperationArr = await this.common.getDictionaryItems('mode_of_operation');
        },
        // 获取行业id
        getIndustryId(data){
            this.formData.industryId = data.id;
            this.$refs.formData.validateField('industryId');
        },
        //获取负责人
        getPersonInCharge(data){
            this.personInChargeArr = [];
            this.formData.principalIds = [];
            this.disabledList = [];
            if(data){
                this.personInChargeArr.push(data);
                this.formData.principalIds.push(data.id);
                this.disabledList.push(data.id);
            }
        },
        //获取协作人
        getCollaborator(data){
            this.collaboratorArr = [];
            this.formData.assistIds = [];
            if(data.length>0){
                this.collaboratorArr = data;
                this.formData.assistIds = data.map(item=>{
                    return item.id;
                });
            }
        },
        //清除负责人
        clearOptions(){
            this.$refs.TreePersonInCharge.clearSelect();
        },
        //清除协作人
        clearCollaborator(item,index){
            this.$refs.TreeCollaborator.clearOneSelect(item.id);
        },
        //获取渠道商
        getChannelId(data){
            this.formData.channelId = data.id;
        },
        //天眼查 获取客户信息
        getCustomerInfo(data){
            if(!data){return}
            this.formData.name = data.compayName.trim();
            this.formData.legalRepresentative = data.legalPersonName;
            this.formData.certificateNumber = data.creditCode;
            this.formData.business = data.businessScope;
            this.formData.address = data.regLocation;
            if(data.address){
                this.cityList = [data.address.provinceCode,data.address.cityCode,data.address.areaCode];
                this.$nextTick(function(){
                    this.$refs.cityEvent.uploadData()
                })
            }
            this.$refs.formData.validateField('name');
        },
        //提交新增客户
        submitNewCustomer(name){
            let url = '/base/customer';
            let ajaxData = {
                type:'G'
            }
            Object.assign(ajaxData,this.formData);
            ajaxData.channelId = ajaxData.source=='C'?ajaxData.channelId:'';
            ajaxData.isIpo = Number(ajaxData.isIpo);
            if(this.customerDetail){
                ajaxData.id = this.customerDetail.id;
            }
            // console.log(ajaxData)
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.customerDetail){
                        if(this.customerDetail.industryId!==this.formData.industryId){
                            if(!this.confirmFlag){
                                this.confirmModal = true;
                            }else{
                                console.log('提交')
                                this.submitEdit(url,ajaxData);
                            }
                        }else{
                            console.log('提交')
                            this.submitEdit(url,ajaxData);
                        }
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                if(!this.customerDetail){
                                    this.$emit('closeDrawer',true);
                                }else{
                                    this.$emit('changeEdit',true)
                                }
                                this.$Message.success('操作成功!');
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.isSubmit = false;
                        })
                    }
                }
            })
        },
        // 提交编辑
        submitEdit(url,ajaxData){
            this.$patch(url,ajaxData).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    if(!this.customerDetail){
                        this.$emit('closeDrawer',true);
                    }else{
                        this.$emit('changeEdit',true)
                    }
                    this.$Message.success('操作成功!');
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        confirmSubmit(){
            this.confirmFlag = true;
            this.confirmModal = false;
            this.submitNewCustomer('formData');
        },
        cancel(){
            if(this.customerDetail){
                this.$emit('changeEdit',false);
            }else{
                this.$emit('closeDrawer',false);
            }
        },
        //赋默认值
        getCustomerDetail(data){
            for(let key in this.formData){
                this.formData[key] = data[key]
            }
            this.cityList = [data.province,data.city,data.area];
            this.actualCityList = [data.actualProvince,data.actualCity,data.actualArea];
            this.defaultPersonInCharge = data.principalUser.length>0?data.principalUser.map(item=>{
                return item.id;
            }):[];
            this.defaultCollaborator = data.helperUser.length>0?data.helperUser.map(item=>{
                return item.id;
            }):[];
            this.channelObj = {
                id:data.channelId,
                name:data.channeName
            }
            this.industryObj = {
                id:data.industryId,
                name:data.industryName
            }
            this.$nextTick(function(){
                if(data.source=='C'){
                    this.$refs.channelSelect.voluation();
                }
                this.$refs.industrySelect.voluation();
            })
            this.defaulLogoList = [
                { url:data.completeIcon }
            ]
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        if(this.customerDetail){
            this.getCustomerDetail(this.customerDetail);
        }else{
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {
        Message
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./customerForm";
</style>