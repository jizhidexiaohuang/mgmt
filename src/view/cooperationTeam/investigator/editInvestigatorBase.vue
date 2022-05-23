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
                <FormItem label="机构名称" prop="company">
                    <Input v-model.trim="formValidate.company" placeholder="请输入机构名称"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="mobile">
                    <Input v-model="formValidate.mobile" disabled placeholder="请输入联系方式"></Input>
                </FormItem>
                <FormItem label="电子邮箱" prop="mail" :rules="[
                    {required:true, pattern:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/, message:'请输入正确的邮箱', trigger:'blur'},
                    { max:32,message:'不能超过32个字符',trigger:'blur'}]">
                    <Input v-model="formValidate.mail" placeholder="请输入电子邮箱"></Input>
                </FormItem>
                <FormItem label="地区" prop="area">
                    <City ref="transEvent" v-if="detailsCtrl" v-on:listenCity="getCity" :cityList="cityList" style="width:100%;"></City>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model.trim="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入地址"></Input>
                </FormItem>
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
            certificateTypeArr:[], //身份证or护照
            // 基本信息
            formValidate:{
                name:"",
                sex:"M",
                certificateType:"",
                certificateNumber:"",
                company:"",
                mobile:'',
                mail:"",
                province:"",
                city:"",
                area:"",
                address:"",
            },
            ruleValidate:{
                name:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                // sex:[{ required: true, message: '请选择性别', trigger: 'change' }],
                // certificateType:[{ required: true, message: '请选择证件类型', trigger: 'change' }],
                company:[
                    { required: true, message: '机构名称不能为空', trigger: 'blur' },
                    { max:32,message:'不能超过32个字符',trigger:'blur'}
                ],
                mobile:[{ required: true, pattern:/^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入手机号码', trigger: 'blur' }],
                province:[{required: true, message: '省份不能为空', trigger: 'change'}],
                city:[{required: true, message: '城市不能为空', trigger: 'change'}],
                // area:[{required: true, message: '地区不能为空', trigger: 'change'}],
                address:[
                    { required: true, message: '详细地址不能为空', trigger: 'blur' },
                    { max:128,message:'不能超过128个字符',trigger:'blur'}
                ]
            },
            cityList:[],
            //图片上传默认
            defaultList:[],
            uploadConfig:[],
            teamId:'',
            detailsCtrl:false,
            editId:''
        }
    },
    props: ['investigatorDetail'],
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
        // 编辑
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //在这里提交数据
                    let url = '/base/investigator/'+this.editId+'/base';
                    let ajaxData = {
                        name:this.formValidate.name,
                        sex:this.formValidate.sex,
                        certificateType:this.formValidate.certificateType,
                        certificateNumber:this.formValidate.certificateNumber,
                        company:this.formValidate.company,
                        mobile:this.formValidate.mobile,
                        mail:this.formValidate.mail,
                        province:this.formValidate.province,
                        city:this.formValidate.city,
                        area:this.formValidate.area,
                        address:this.formValidate.address,
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        console.log(res);
                        if(res.code==0){
                            //关闭侧边栏，刷新列表
                            this.$emit('changeEditCtrl',false);
                        }
                    })
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.sexArr = await this.common.getDictionaryItems('sex');
            this.certificateTypeArr = await this.common.getDictionaryItems('certificate_type');
        },
        //赋值
        getDetails(investigatorDetail){
            let base = investigatorDetail;
            //基本信息
            this.editId = base.id;
            this.formValidate.name = base.name;
            this.formValidate.sex = base.sex;
            this.formValidate.certificateType = base.certificateType;
            this.formValidate.certificateNumber = base.certificateNumber;
            this.formValidate.company = base.company;
            this.formValidate.mobile = base.mobile;
            this.formValidate.mail = base.mail;
            this.cityList = [base.province,base.city,base.area];
            this.formValidate.address = base.address;
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getDetails(this.investigatorDetail);
    },
    mounted(){
        console.log(this.investigatorDetail);
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.addBtn{
    position:absolute;
    right:-15px;
    top:0;
}
.form-add{
    position: relative;
    margin-bottom:24px;
}
</style>
<style lang="sass" scoped>
@import "../../relationship/customerManage/customerForm.scss"
</style>

