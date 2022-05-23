<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>线索信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="客户名称" prop="customerName">
                    <tianyancha v-if="detailsCtrl" :defaultName="formData.customerName" @getCustomerName="getCustomerInfo" />
                </FormItem>
                <FormItem label="客户性质" prop="customerType">
                    <RadioGroup v-model="formData.customerType" placeholder="请选择客户性质">
                        <Radio :label="item.value" v-for="item in customerTypeArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="法人代表" prop="legalPerson" v-if="formData.customerType!='P'"
                    :rules="[{required: true, message: '法定代表人不能为空', trigger: 'blur'},
                        {max:32,message:'不能超过32个字符',trigger:'blur'}]">
                    <Input v-model.trim="formData.legalPerson" placeholder="请输入法定代表人"></Input>
                </FormItem>
                <FormItem :label="formData.customerType=='P'?'身份证号':'信用代码'" prop="license"
                    :rules="[{required: formData.customerType=='P'?false:true,validator:this.validateLicense, trigger: 'blur'}]">
                    <Input v-model.trim="formData.license" :placeholder="formData.customerType=='P'?'请输入身份证号':'请输入信用代码'"></Input>
                </FormItem>
                <FormItem label="主营业务" prop="business">
                    <Input v-model.trim="formData.business" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入主营业务"></Input>
                </FormItem>
                <FormItem label="所属区域" prop="province">
                    <City ref="transEvent" v-if="detailsCtrl" v-on:listenCity="getCity" :cityList="cityList"></City>
                </FormItem>
                <FormItem label="详细地址" prop="address"
                    :rules="[{required: formData.customerType=='P'?false:true, message: '详细地址不能为空', trigger: 'blur'},
                    {max:255,message:'不能超过255个字符',trigger:'blur'}]">
                    <Input v-model.trim="formData.address" type="textarea" :row="4" placeholder="请输入详细地址"></Input>
                </FormItem>
                <FormItem label="所属行业" prop="industryId">
                    <mySelect ref="industrySelect"
                        :path="'/base/industry'"
                        :placeholder="'请选择行业名称'"
                        :placeholderInput="'请输入行业名称'"
                        :keyName="'industryName'"
                        :defaultObj="defaultObj"
                        @getValue="getIndustryId">
                    </mySelect>
                </FormItem>
                <FormItem label="客户来源" prop="customerSource">
                    <Select v-model="formData.customerSource" placeholder="请选择客户来源">
                        <Option v-for="item in customerSourceArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>联系人信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="姓名" prop="name">
                    <Input v-model.trim="formData.name" type="text" placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="固定电话" prop="telphone">
                    <Input v-model.trim="formData.telphone" type="text" placeholder="请输入固定电话"></Input>
                </FormItem>
                <FormItem label="手机号" prop="mobile" style="position:relative;">
                    <Input v-model.trim="formData.mobile" type="text" placeholder="请输入手机号"></Input>
                    <span v-show="mobileError" class="mobile-error">手机号已存在<a href="javaScript:void(0);" @click="mobileModalCtrl=true">点击查看</a></span>
                </FormItem>
                <FormItem label="邮箱" prop="email"
                    :rules="formData.customerType!='P'?[{required: true, validator:validateTelEmail,trigger:'blur'}]:[{ pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: 'blur' }]">
                    <Input v-model.trim="formData.email" type="text" placeholder="请输入邮箱"></Input>
                    <span v-show="emailError" class="mobile-error">邮箱已存在<a href="javaScript:void(0);" @click="emailModalCtrl=true">点击查看</a></span>
                </FormItem>
                <FormItem label="职务" prop="position"
                    :rules="formData.customerType!='P'?[{ required: true, message: '请填写职务', trigger: 'blur' },
                        { max:32,message:'不能超过32个字符',trigger:'blur' }]:{}">
                    <Input v-model.trim="formData.position" type="text" placeholder="请输入职务"></Input>
                </FormItem>
                <Row class="detail-btn-box">
                    <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewCustomer('formData')">保存</Button>
                    <Button @click="$emit('changeEditCtrl',false,false);">取消</Button>
                </Row>
            </Row>
        </Form>
        <!-- 手机号冲突 -->
        <Modal
            v-model="mobileModalCtrl"
            title="冲突信息"
            :width="'80%'"
            :footer-hide="true">
            <conflict-table v-if="mobileModalCtrl" :id="customerDetail.id" :mobile="formData.mobile"></conflict-table>
        </Modal>
        <!-- 邮箱冲突 -->
        <Modal
            v-model="emailModalCtrl"
            title="冲突信息"
            :width="'80%'"
            :footer-hide="true">
            <conflict-table v-if="emailModalCtrl" :id="customerDetail.id" :email="formData.email"></conflict-table>
        </Modal>
    </div>
</template>
<script>
import conflictTable from './conflictTable.vue';
export default {
    data () {
        const validateCustomerName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('客户名称不能为空'));
            }
            if(value.length>64){
                return callback(new Error('长度不能超过64个字符'));
            }
            let url = '/base/customer-clue/check-name';
            let ajaxData = {
                name:this.formData.customerName,
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
        const validateTelPhone = (rule ,value, callback) => {
            if(!value) {
                return callback(new Error('固定电话不能为空'))
            }
            if(value.length>32){
                return callback(new Error('长度不能超过32个字符'))
            }
            if(!(/^(\d{3,4}-)\d{7,14}$/.test(value))){
                return callback (new Error('固话格式填写有误！格式：0755-8888888'))
            }
            callback();
        }
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写联系方式'));
            }
            if( value.length != 11 ){
                return callback(new Error('请填写正确的手机号码'));
            }
            let url = '/base/customer-clue/check-mobile';
            let ajaxData = {
                email: "",
                mobile: value,
                id: this.customerDetail?this.customerDetail.id:''
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0&&(!res.data)){
                    this.mobileError = false;
                    callback()
                }else{
                    this.mobileError=true
                    callback(new Error());
                }
            })
        };
        const validateTelEmail = (rule, value, callback) => {
            if(!value) {
                return callback(new Error('邮箱不能为空'))
            }
            if(value.length>32){
                return callback(new Error('长度不能超过32个字符'))
            }
            if(!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))){
                return callback (new Error('邮箱格式填写有误！'))
            }
            let url = '/base/customer-clue/check-email';
            let ajaxData = {
                email: value,
                mobile: "",
                id: this.customerDetail?this.customerDetail.id:''
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0&&(!res.data)){
                    this.emailError=false;
                    callback()
                }else{
                    this.emailError=true;
                    callback(new Error());
                }
            })
        }
        const validateLicense = (rule,value,callback) => {
            if(!value&&this.formData.customerType!=='P'){
                return callback(new Error('请输入企业信用代码'))
            }
            if(value&&value.legnth>32){
                return callback(new Error('长度不能超过32个字符'));
            }
            if(value&&this.formData.customerType==='P'){
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
            validateTelPhone:validateTelPhone,
            validateTelEmail:validateTelEmail,
            validateLicense:validateLicense,
            formData:{
                customerName:"",
                customerType:"E",
                legalPerson:"",
                license:"",
                province:"",
                city:'',
                area:'',
                address:"",
                industryId:"",
                business:"",
                customerSource:"",
                name:'',
                telphone:'',
                mobile:'',
                email:'',
                position:''
            },
            ruleValidate:{
                customerName:[
                    {required: true,validator:validateCustomerName,trigger:'blur'}
                ],
                customerType:[{required: true, message: '客户性质不能为空', trigger: 'change'}],
                province:[{required: true, message: '省市区不能为空', trigger: 'change'}],
                industryId:[{required: true,type:"number", message: '所属行业不能为空', trigger: 'change'}],
                business:[
                    {required: true, message: '主营业务不能为空', trigger: 'blur'},
                    {max:1024,message:'不能超过1024个字符',trigger:'blur'}
                ],
                customerSource:[{required: true, message: '客户来源不能为空', trigger: 'change'}],
                name:[
                    { required: true, message: "请填写姓名", trigger: "blur" },
                    { max:32,message:'不能超过32个字符',trigger:'blur' }
                ],
                mobile:[ 
                    { required: true,validator:validatePhone, trigger: "blur" },
                    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                telphone:[ { pattern: /^(\d{3,4}-)\d{7,14}$/, message: '请输入正确的固定电话', trigger: 'blur' }]
            },
            customerTypeArr:[],
            industryArr:[],
            customerSourceArr:[],
            detailsCtrl:false,
            cityList:[],
            isSubmit:false,
            mobileError:false,
            emailError:false,
            mobileModalCtrl:false,
            emailModalCtrl:false,
            defaultObj:{}
        }
    },
    props: ['customerDetail'],
    methods: {
        submitNewCustomer(name){
            let url = '/base/customer-clue';
            let ajaxData = {
                name:this.formData.customerName,
                customerNature:this.formData.customerType,
                legalRepresentative:this.formData.legalPerson,
                certificateNumber:this.formData.license,
                business:this.formData.business,
                province:this.formData.province,
                city:this.formData.city,
                area:this.formData.area,
                address:this.formData.address,
                industryId:this.formData.industryId,
                source:this.formData.customerSource,
                contact:this.formData.name,
                phone:this.formData.telphone,
                mobile:this.formData.mobile,
                email:this.formData.email,
                position:this.formData.position
            }
            console.log(this.formData);
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.customerDetail){
                        ajaxData.id = this.customerDetail.id;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success("操作成功!");
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success("操作成功!");
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            })
        },
        // 获取行业id
        getIndustryId(data){
            this.formData.industryId = data.id;
        },
        //天眼查 获取客户信息
        getCustomerInfo(data){
            // console.log(data);
            this.formData.customerName = data.compayName.trim();
            this.formData.legalPerson = data.legalPersonName;
            this.formData.license = data.creditCode;
            this.formData.business = data.businessScope;
            this.formData.address = data.regLocation;
            if(data.address){
                this.cityList = [data.address.provinceCode,data.address.cityCode,data.address.areaCode];
                this.$nextTick(function(){
                    this.$refs.transEvent.uploadData()
                })
            }
            this.$refs.formData.validateField('customerName');
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
        //获取字典数据接口
        async getDictionary(){
            this.customerTypeArr = await this.common.getDictionaryItems('customer_nature');
            this.customerSourceArr = await this.common.getDictionaryItems('customer_source');
            this.industryArr = await this.common.getDictionaryItems('industry_type');
        },
        //赋值
        getCustomerDetail(data){
            this.formData.customerName = data.name;
            this.formData.customerType = data.customerNature;
            this.formData.legalPerson = data.legalRepresentative;
            this.formData.license = data.certificateNumber;
            this.formData.address = data.address;
            this.cityList = [data.province,data.city,data.area];
            this.formData.industryId = data.industryId;
            this.defaultObj = {
                id:data.industryId,
                name:data.industryName
            }
            this.formData.business = data.business;
            this.formData.customerSource = data.source;
           
            this.formData.name = data.contact;
            this.formData.telphone = data.phone;
            this.formData.mobile = data.mobile;
            this.formData.email = data.email;
            this.formData.position = data.position;
            this.detailsCtrl = true;

            this.$nextTick(()=>{
                this.$refs.industrySelect.voluation();
            })
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        if(this.customerDetail){
            this.getCustomerDetail(this.customerDetail);
        }else{
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {conflictTable},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
 .mobile-error{
    color: #ff5555;
    position: absolute;
    bottom: -18px;
    left: 0px;
    width: auto;
    line-height: 1;
 }
</style>
