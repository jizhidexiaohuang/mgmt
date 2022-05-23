<template>
    <div class="customer-form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Row class="detail-header">
                <span>基本信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="姓名" prop="name">
                    <Input v-model="formValidate.name" disabled placeholder="请输入律师姓名"></Input>
                </FormItem>
                <FormItem label="性别" prop="sex">
                    <RadioGroup v-model="formValidate.sex">
                        <Radio v-for="item in sexArr" :key="item.id" :label="item.value">{{item.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="证件类型" prop="certificateType">
                    <Select v-model="formValidate.certificateType" placeholder="请选择你的证件类型" disabled>
                        <Option v-for="item in certificateTypeArr" :key="item.id" :value="item.value">{{item.nameZh}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="证件编号" prop="certificateNumber">
                    <Input v-model="formValidate.certificateNumber" disabled placeholder="请输入证件编号" />
                </FormItem>
                <FormItem label="机构名称" prop="lawOffice">
                    <Input v-model.trim="formValidate.lawOffice" placeholder="请输入机构名称"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="mobile">
                    <Input v-model="formValidate.mobile" disabled placeholder="请输入联系方式"></Input>
                </FormItem>
                <FormItem label="电子邮箱" prop="mail" :rules="[
                    { pattern:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, message:'请输入正确的邮箱', trigger:'blur'},
                    { max:32,message:'不能超过32个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.mail" placeholder="请输入电子邮箱"></Input>
                </FormItem>
                <FormItem label="地区" prop="area">
                    <City ref="transEvent" v-if="detailsCtrl" v-on:listenCity="getCity" :cityList="cityList" style="width:100%;"></City>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model.trim="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" show-word-limit placeholder="请输入地址"></Input>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>执业信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="执业证号" prop="lawLicense">
                    <Input v-model="formValidate.lawLicense" disabled placeholder="请输入执业证号"></Input>
                </FormItem>
                <FormItem label="执业领域" prop="skill">
                    <CheckboxGroup v-model="formValidate.skill">
                        <Checkbox v-for="item in skillArr" :key="item.id" :label="item.value"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="个人简介" prop="remark">
                    <Input v-model.trim="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入个人简介"></Input>
                </FormItem>
                <FormItem label="上传证件" prop="qualifications">
                    <file-upload :defaultList="defaultList" :uploadConfig="uploadConfig" @getFileList="getFileList"></file-upload>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>历史单位</span>
            </Row>
            <Row class="detail-form">
                <div 
                    v-for="(item, index) in formValidate.jobTime"
                    :label-width="0"
                    :key="index">
                    <FormItem 
                        label="执业时间" 
                        class="form-add">
                        <DatePicker type="daterange" v-model="item.usedTime" placement="bottom-end" placeholder="请选择执业时间" style="width:calc(100% - 80px)"></DatePicker>
                        <Button class="addBtn" type="primary" v-if="index==0" @click="handleAdd">添加</Button>
                        <Button class="addBtn" type="error" v-if="index!=0" @click="handleRemove(index)">删除</Button>
                    </FormItem>
                    <FormItem label="过往律所" :rules="{ max:100,message:'不能超过100个字符',trigger:'blur'}">
                        <Input v-model.trim="item.office" placeholder="请输入过往律所"/>
                    </FormItem>
                </div>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" @click="handleSubmit('formValidate')">保存</Button>
                <Button @click="$emit('changeEditCtrl',false);">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            sexArr:[],
            skillArr:[],         //擅长领域
            certificateTypeArr:[], //身份证or护照
            index:1,
            // 基本信息
            formValidate:{
                name:"",
                sex:"M",
                certificateType:"",
                certificateNumber:"",
                lawOffice:"",
                mobile:'',
                mail:"",
                province:"",
                city:"",
                area:"",
                address:"",

                lawLicense:"",
                skill:[],
                remark:'',
                qualifications:[],
                jobTime:[
                    {
                        usedTime:"",
                        office:""
                    }
                ],
            },
            ruleValidate:{
                name:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                sex:[{ required: true, message: '请选择性别', trigger: 'change' }],
                // certificateType:[{ required: true, message: '请选择证件类型', trigger: 'change' }],
                mobile:[{ required: true, pattern:/^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入手机号码', trigger: 'blur' }],
                province:[{required: true, message: '省份不能为空', trigger: 'change'}],
                city:[{required: true, message: '城市不能为空', trigger: 'change'}],
                // area:[{required: true, message: '地区不能为空', trigger: 'change'}],
                address:[
                    { required: true, message: '详细地址不能为空', trigger: 'blur' },
                    { max:128,message:'不能超过128个字符',trigger:'blur'}
                ],
                lawOffice:[
                    { required: true, message: '执业律所不能为空', trigger: 'blur' },
                    { max:32,message:'不能超过32个字符',trigger:'blur'}
                ],
                qualifications:[{required: true,type:'array', message: '证件不能为空', trigger: 'blur'}],
                remark:[{ max:255,message:'不能超过255个字符',trigger:'blur'}],
                lawLicense:[{ required: true, message: '执业编号不能为空', trigger: 'blur' }],
                skill:[{ required: true, type: 'array', min: 1, message: '请选择擅长领域', trigger: 'change' }],
            },
            cityList:[],
            //默认证件list
            defaultList:[],
            uploadConfig:{fileName:'license',maxNum:9},
            detailsCtrl:false,
            editId:''
        }
    },
    props: ['lawyerDetail'],
    methods: {
        // 搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.formValidate.province = data[0].value;
                    this.formValidate.city = '';
                    this.formValidate.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.formValidate.province = data[0].value;
                    this.formValidate.city = data[1].value;
                    this.formValidate.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.formValidate.province = data[0].value;
                    this.formValidate.city = data[1].value;
                    this.formValidate.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.formValidate.province = '';
                this.formValidate.city = '';
                this.formValidate.area = '';
                area = '';
            }
        },
        //获取文件list
        getFileList(data){
            this.formValidate.qualifications = [];
            if(data.length>0){
                data.forEach((item,index)=>{
                    let obj = {
                        fileName:item.fileName,
                        mediaType:item.mediaType,
                        smallUrl:item.smallUrl,
                        url:item.url
                    }
                    this.formValidate.qualifications.push(obj);
                })
            }
        },
        // 编辑
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let offices = this.formValidate.jobTime.map((item)=>{
                        console.log(item)
                        if(item.office){
                            return {
                                startDate:this.common.formatTime(item.usedTime[0],1),
                                endDate:this.common.formatTime(item.usedTime[1],1),
                                lawOffice:item.office 
                            }
                        }else{
                            return;
                        }
                    })
                    //在这里提交数据
                    let url = '/base/lawyer/'+this.editId+'/base';
                    let ajaxData = {
                        name:this.formValidate.name,
                        sex:this.formValidate.sex,
                        certificateType:this.formValidate.certificateType,
                        certificateNumber:this.formValidate.certificateNumber,
                        mobile:this.formValidate.mobile,
                        mail:this.formValidate.mail,
                        province:this.formValidate.province,
                        city:this.formValidate.city,
                        area:this.formValidate.area,
                        address:this.formValidate.address,

                        practiceInfo:{
                            lawOffice:this.formValidate.lawOffice,
                            lawLicense:this.formValidate.lawLicense
                        },
                        skillList:this.formValidate.skill.map(item=>{return {skill:item}}),
                        qualifications:this.formValidate.qualifications,
                        remark:this.formValidate.remark,

                        officeList:offices[0]?offices:[],
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            //关闭侧边栏，刷新列表
                            this.$emit('changeEditCtrl',false);
                        }
                    })
                }
            })
        },
        // 执业信息添加按钮
        handleAdd(){
            this.formValidate.jobTime.push({
                usedTime:"",
                office:""
            });
        },
        // 执业信息删除按钮
        handleRemove(index){
            this.formValidate.jobTime.splice(index,1);
        },
        //获取字典数据接口
        async getDictionary(){
            this.sexArr = await this.common.getDictionaryItems('sex');
            this.skillArr = await this.common.getDictionaryItems('skill_type');
            this.certificateTypeArr = await this.common.getDictionaryItems('certificate_type');
        },
        //赋值
        getDetails(lawyerDetail){
            let base = lawyerDetail;
            //基本信息
            this.editId = base.id;
            this.formValidate.name = base.name;
            this.formValidate.sex = base.sex;
            this.formValidate.certificateType = base.certificateType;
            this.formValidate.certificateNumber = base.certificateNumber;
            this.formValidate.lawOffice = lawyerDetail.practiceInfo.lawOffice;
            this.formValidate.mobile = base.mobile;
            this.formValidate.mail = base.mail;
            this.cityList = [base.province,base.city,base.area];
            this.formValidate.address = base.address;
            //执业信息
            this.formValidate.lawLicense = lawyerDetail.practiceInfo.lawLicense;
            this.formValidate.skill = lawyerDetail.skillList.length>0?lawyerDetail.skillList.map(item=>{return item.skill}):[];
            this.formValidate.remark = base.remark;
            this.formValidate.qualifications = base.qualifications || [];
            this.defaultList = base.qualifications || [];
            
            //历史单位
            this.formValidate.jobTime = [];
            this.formValidate.jobTime = lawyerDetail.officeList&&lawyerDetail.officeList.map((item,index)=>{
                return {
                    office:item.lawOffice,
                    usedTime:[item.startDate,item.endDate]
                }
            })
            if(this.formValidate.jobTime.length==0){
                this.formValidate.jobTime.push({
                    office:"",
                    usedTime:[]
                })
            }
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getDetails(this.lawyerDetail)
    },
    mounted(){
       
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.addBtn{
    position:absolute;
    right:0px;
    top:0;
}
.form-add{
    position: relative;
    margin-bottom:10px;
}
</style>
<style lang="sass" scoped>
@import "../../relationship/customerManage/customerForm.scss"
</style>

