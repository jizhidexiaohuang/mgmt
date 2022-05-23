<template>
    <div class="customer-form">
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
        <Row class="detail-form">
            <FormItem label="渠道名称" prop="name">
                <tianyancha v-if="detailsCtrl" :defaultName="formData.name" @getCustomerName="getCustomerInfo" />
            </FormItem>
            <FormItem label="渠道性质" prop="customerNature">
                <RadioGroup v-model="formData.customerNature" placeholder="请选择渠道性质">
                    <Radio :label="item.value" v-for="item in customerTypeArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="渠道标签" prop="tags">
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
            <FormItem label="所属区域" prop="province">
                <City ref="transEvent" v-if="detailsCtrl" v-on:listenCity="getCity" :cityList="cityList"></City>
            </FormItem>
            <FormItem label="详细地址" prop="address"
                :rules="[{required: true, message: '详细地址不能为空', trigger: 'blur'},
                    {max:255,message:'不能超过255个字符',trigger:'blur'}]">
                <Input v-model.trim="formData.address" type="textarea" :row="4" placeholder="请输入详细地址"></Input>
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
            <FormItem label="主营业务" prop="business">
                <Input v-model.trim="formData.business" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入主营业务"></Input>
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
            <FormItem label="渠道来源" prop="source">
                <Select v-model="formData.source" placeholder="请选择渠道来源">
                    <Option v-for="item in customerSourceList" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否维权" prop="safeguardLegelRights">
                <RadioGroup v-model="formData.safeguardLegelRights" placeholder="请选择渠道是否维权">
                    <Radio :label="item.value" v-for="item in safeguardLegalRightsArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                </RadioGroup>
            </FormItem>
            <!-- <FormItem label="合作模式" prop="cooperationMode">
                <Select v-model="formData.cooperationMode" placeholder="请选择合作模式">
                    <Option v-for="item in cooperationModeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                </Select>
            </FormItem> -->
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
                name:"",
                customerNature:"E",
                tags:[],
                legalRepresentative:"",
                certificateNumber:"",
                province:"",
                city:'',
                area:'',
                address:"",
                industryId:"",
                business:"",
                principalIds:[],
                assistIds:[],
                source:"",
                safeguardLegelRights:'Y',
                // cooperationMode:"",
            },
            ruleValidate:{
                name:[
                    {required: true,validator:validateCustomerName,trigger:'blur'}
                ],
                customerNature:[{required: true, message: '渠道性质不能为空', trigger: 'change'}],
                tags:[{required: true, type:'array', message: '渠道标签不能为空', trigger: 'blur'}],
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
                source:[{required: true, message: '渠道来源不能为空', trigger: 'change'}],
                safeguardLegelRights:[{required: true, message: '请选择是否维权', trigger: 'change'}],
                // cooperationMode:[{required: true, message: '合作模式不能为空', trigger: 'change'}],
            },
            tagCtrl:true,
            tagName:'',
            customerTypeArr:[],//客户类型
            industryObj:{}, //行业默认
            customerSourceArr:[], //客户来源
            safeguardLegalRightsArr:[], //是否维权
            cooperationModeArr:[], //合作模式
            personInChargeCtrl:false,//负责人弹框
            collaboratorCtrl:false, //协作人弹框
            personInChargeArr:[], //负责人
            collaboratorArr:[],//协作人
            timer:0,
            selectLoading:false,
            tianyanchaList:[],
            isEdit:false,
            cityList:[],
            detailsCtrl:false,
            defaultPersonInCharge:[],//默认负责人
            defaultCollaborator:[],//默认协作人
            disabledList:[],//选完负责人之后  协作人不可选
            isSubmit:false,
        }
    },
    computed:{
        customerSourceList(){
            let tempArr = []
            this.customerSourceArr.forEach(item=>{
                if(item.value!='C'){
                    tempArr.push(item);
                }
            })
            return tempArr;
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
        //搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.formData.province = data[0].value;
                    this.formData.city = '';
                    this.formData.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.formData.province = data[0].value;
                    this.formData.city = data[1].value;
                    this.formData.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.formData.province = data[0].value;
                    this.formData.city = data[1].value;
                    this.formData.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.formData.province = '';
                this.formData.city = '';
                this.formData.area = '';
                area = '';
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
            const index = this.customerTag.indexOf(name);
            this.formData.tags.splice(index, 1);
        },
        //获取字典数据接口
        async getDictionary(){
            this.customerTypeArr = await this.common.getDictionaryItems('customer_nature');
            this.cooperationModeArr = await this.common.getDictionaryItems('coop_mode');
            this.customerSourceArr = await this.common.getDictionaryItems('customer_source');
            this.safeguardLegalRightsArr = await this.common.getDictionaryItems('safeguard_legel_rights');
        },
        // 获取行业id
        getIndustryId(data){
            this.formData.industryId = data.id;
            this.$refs.formData.validateField('industryId');
        },
        //获取负责人
        getPersonInCharge(data){
            console.log(data)
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
            console.log(data)
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
        //天眼查 获取客户信息
        getCustomerInfo(data){
            // console.log(data);
            this.formData.name = data.compayName.trim();
            this.formData.legalRepresentative = data.legalPersonName;
            this.formData.certificateNumber = data.creditCode;
            this.formData.business = data.businessScope;
            this.formData.address = data.regLocation;
            if(data.address){
                this.cityList = [data.address.provinceCode,data.address.cityCode,data.address.areaCode];
                this.$nextTick(function(){
                    this.$refs.transEvent.uploadData()
                })
            }
            this.$refs.formData.validateField('name');
        },
        //提交新增客户
        submitNewCustomer(name){
            let url = '/base/customer';
            let ajaxData = {type:'C'}
            Object.assign(ajaxData,this.formData);
            if(this.customerDetail){
                ajaxData.id = this.customerDetail.id;
            }
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.customerDetail){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                if(!this.customerDetail){
                                    this.$emit('closeDrawer',true);
                                }else{
                                    this.$emit('changeEdit',false);
                                }
                                this.$Message.success('操作成功!');
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.isSubmit = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                if(!this.customerDetail){
                                    this.$emit('closeDrawer',true);
                                }else{
                                    this.$emit('changeEdit',false);
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
            this.defaultPersonInCharge = data.principalUser.length>0?data.principalUser.map(item=>{
                return item.id;
            }):[];
            this.defaultCollaborator = data.helperUser.length>0?data.helperUser.map(item=>{
                return item.id;
            }):[];
            this.formData.source = data.source;
            this.formData.safeguardLegelRights = data.isSafeguardLegelRights;
            this.industryObj = {
                id:data.industryId,
                name:data.industryName
            }
            this.$nextTick(function(){
                this.$refs.industrySelect.voluation();
            })
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        if(this.customerDetail){
            this.isEdit = true;
            this.getCustomerDetail(this.customerDetail);
        }else{
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {Message},
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./channelForm.scss";
</style>