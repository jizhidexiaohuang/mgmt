<template>
    <div class="plan-form">
        <Row class="follow-record-form">
            <Form 
                :model="formItem" 
                ref="planForm" 
                :rules="formValidate" 
                :label-width="60" 
                class="clearfix" style="padding:5px 10px;">
                <Row>
                    <Col span="11">
                        <FormItem label="亲密度" prop="starLevel">
                            <Rate v-model="formItem.starLevel" custom-icon="icon-star-01" />
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="姓名" prop="name">
                            <Input placeholder="请输入姓名" v-model.trim="formItem.name"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="职务" prop="position">
                            <Input placeholder="请输入职务" v-model.trim="formItem.position"/>
                        </FormItem>
                    </Col>
                    <Col span="12" offset="1">
                        <FormItem label="手机号" prop="mobile">
                            <Input placeholder="请输入手机号" v-model.trim="formItem.mobile"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="邮箱" prop="email">
                        <Input placeholder="请输入邮箱" v-model.trim="formItem.email"/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="备注" prop="remark">
                        <Input type="textarea" placeholder="请输入备注" v-model.trim="formItem.remark"/>
                    </FormItem>
                </Row>
            </Form>
        </Row>
        <Row class="plan-edit-form-btn">
            <Button type="primary" :loading="btnLoading" @click="savePlan()">保存</Button>
            <Button type="default" @click="cancelSavePlan()">取消</Button>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const validateStar = (rule, value, callback) => {
            if(value<=0){
                return callback(new Error('请标注亲密度'));
            }
                
            callback();
        };
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写联系方式'));
            }
            if( value.length != 11 ){
                return callback(new Error('请填写正确的手机号码'));
            }
            callback();
        };
        return {
            mainColor:styles,
            metionPersonCtrl:false,
            selectCtrl:false,
            btnLoading:false,
            formItem:{
                starLevel:0,
                name:"",
                position:"",
                mobile:"",
                email:"",
                remark:"",
            },
            //表单验证规则
            formValidate: {
                starLevel:[{ required: true,validator:validateStar, trigger: "change" }],
                name:[
                    { required: true, message: "请填写姓名", trigger: "blur" },
                    { max:32,message:'不能超过32个字符',trigger:'blur' }
                ],
                position:[
                    { required: true,message: "请填写职务", trigger: "blur" },
                    { max:32,message:'不能超过32个字符',trigger:'blur' }
                    ],
                mobile:[ 
                    { required: true,validator:validatePhone, trigger: "blur" },
                    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
                email:[
                    { required: true, message: "请填写邮箱", trigger: "blur" },
                    { pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: 'blur' },
                    { max:32,message:'不能超过32个字符',trigger:'blur' }
                    ],
                remark:[
                    { required: true, message: "请填写备注", trigger: "blur" },
                    { max:512,message:'不能超过512个字符',trigger:'blur' }
                    ],
            }
        }
    },
    props: ['index','custId','defaultData'],
    methods: {
        giveDefaultData(data){
            this.formItem.starLevel = this.defaultData.starLevel;
            this.formItem.name = this.defaultData.name;
            this.formItem.position = this.defaultData.position;
            this.formItem.mobile = this.defaultData.mobile;
            this.formItem.email = this.defaultData.email;
            this.formItem.remark = this.defaultData.remark;
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
                    let url = '/base/customer-contact';
                    let ajaxData = {
                        custId:this.custId
                    }
                    if(this.defaultData){
                        ajaxData.id = this.defaultData.id;
                    }
                    Object.assign(ajaxData,this.formItem);
                    this.btnLoading = true;
                    if(this.defaultData){
                        this.$patch(url,ajaxData).then(res=>{
                            this.btnLoading = false;
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                this.cancelSavePlan(true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.btnLoading = false;
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                this.cancelSavePlan(true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            });
        },
        cancelSavePlan(bool){
            if(this.defaultData){
                this.$emit("closeEdit",this.index,bool);
            }else{
                this.$emit("closeEdit",null,bool);
            }
        }
    },
    created(){},
    beforeMount(){

    },
    mounted(){
        if(this.defaultData){
            this.giveDefaultData();
        }else{
            this.selectCtrl = true;
        }
    },
    updated(){},
    components: {
    },
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