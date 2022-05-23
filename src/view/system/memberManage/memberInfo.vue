<template>
    <div>
        <Row v-if="!isEdit" class="detail-content">
            <Row><Col span="5" class="left-label">成员名称：</Col><Col span="16" class="right-content">{{userData.name}}</Col></Row>
            <Row><Col span="5" class="left-label">成员职务：</Col><Col span="16" class="right-content">{{userData.position}}</Col></Row>
            <Row><Col span="5" class="left-label">所在部门：</Col><Col span="16" class="right-content">{{userData.organizationName}}</Col></Row>
            <Row><Col span="5" class="left-label">所属角色：</Col><Col span="16" class="right-content">{{userData.roleName}}</Col></Row>
            <Row><Col span="5" class="left-label">联系方式：</Col><Col span="16" class="right-content">{{userData.mobile}}</Col></Row>
        </Row>
        <Row v-else>
            <Form ref="userForm" :model="userForm" :rules="userValidate" :label-width="80">
                <FormItem label="成员姓名" prop="name">
                    <Input v-model="userForm.name" placeholder="请输入成员姓名"></Input>
                </FormItem>
                <FormItem label="所在部门" prop="organizationIds">
                    <InputTree transfer @returnData="setFormData" ref="treeInput" :value="userForm.organizationIds" :multiple="true" v-if="showTree"></InputTree>
                </FormItem>
                <FormItem label="成员职务" prop="position">
                    <Input v-model="userForm.position" placeholder="请输入成员职务"></Input>
                </FormItem>
                <FormItem label="所属角色" prop="roleIds">
                    <Select v-model="userForm.roleIds" multiple transfer clearable>
                        <Option :value="item.value" v-for="item in positionArr" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="联系方式" prop="mobile">
                    <Input v-model="userForm.mobile" placeholder="请输入联系方式"></Input>
                </FormItem>
            </Form>
            <div class="drawer-style drawer-btn" style="text-align:center;">
                <Button type="primary" class="drawer-add-btn" :loading="confirmLoading" @click="userConfirm">确认</Button>
                <Button class="drawer-add-btn" @click="closeManageUser">取消</Button>
            </div>
        </Row>
    </div>
</template>
<script>
import InputTree from "@/components/common/inputSelect/inputSelect";
export default {
    data () {
         const validateOrganization = (rule, value, callback) => {
            if (value.length==0) {
                return callback(new Error('请选择部门'));
            } else {
                callback();
            }   
        };
        const validateRole = (rule, value, callback) => {
            if (value.length==0) {
                return callback(new Error('请选择角色'));
            } else {
                callback();
            }   
        };
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请填写联系方式'));
            }
            // 如果电话号码没有修改则不验证电话号码是否唯一
            if(this.prevNum==value){
                callback();
            }
            if( value.length != 11 ){
                return callback(new Error('请填写正确的手机号码'));
            }
            let url = "/base/mgmt-user/check-mobile/"+value;
            this.$get(url).then(res=>{
                if(!res.data){
                    callback();
                }else{
                    callback(new Error('联系方式已存在'));
                }
            })
        };
        return {
            userData:{},
            showTree:true,
            positionArr:[],
            formItemStyles:{
                marginBottom:"20px"
            },
            //员工form
            userForm:{
                name:"",                //姓名
                position:"",            //职务
                roleIds:[],             //角色
                mobile:"",              //联系方式
                organizationIds:[]      //部门
            },
            //表单验证规则
            userValidate: {
                name:[{ required: true, message: "姓名不能为空", trigger: "blur" }],
                position:[{ required: true, message: "职务不能为空", trigger: "blur" }],
                organizationIds:[
                    { required: true,validator:validateOrganization }
                ],
                // roleIds:[{ required: true,validator:validateRole }],
                mobile:[
                    { required: true, validator:validatePhone, trigger: "blur" },
                    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
                ]
            },
            prevNum:"",
            confirmLoading:false
        }
    },
    props: ['id',"isEdit"],
    methods: {
        // 获取员工详情
        getData(){
            let url = "/base/mgmt-user/"+this.id;
            this.showTree = false;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.userData = res.data;
                    this.userForm = {
                        id:res.data.id,
                        name:res.data.name,                
                        position:res.data.position,           
                        roleIds:res.data.roleIdStr?res.data.roleIdStr.split(","):[],             
                        mobile:res.data.mobile,              
                        organizationIds:res.data.organizationIdStr?res.data.organizationIdStr.split(","):[]   
                    }
                    this.prevNum = res.data.mobile;
                    this.showTree = true;
                }
            })
        },
        // 获取角色数据
        getRoleData(){
            let url = "/base/mgmt-roles";
            let ajaxData = { keyword:""};
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    res.data.forEach((item,index)=>{
                        let obj = {
                            label:item.name,
                            value:item.id
                        };
                        this.positionArr.push(obj);
                    })
                }
            })
        },
        setFormData(data){
            this.userForm.organizationIds = data;
        },
        clearForm(){
            this.userForm = {
                id:"",
                name:"",                //姓名
                position:"",            //职务
                roleIds:[],             //角色
                mobile:"",              //联系方式
                organizationIds:[]      //部门
            };
        },
        userConfirm(){
            this.$refs["userForm"].validate((valid) => {
                if(valid){
                    let url = "/base/mgmt-user";
                    let ajaxData = this.userForm;
                    this.confirmLoading = true;
                    this.$patch(url,ajaxData).then(res=>{
                        this.confirmLoading = false;
                        if(res.code==0){
                            this.$Message.success("操作成功");
                            this.$emit("closeModel",true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            });
        },
        closeManageUser(){
            this.$emit("closeModel");
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
        this.getRoleData();
    },
    updated(){},
    components: {
        InputTree
    },
    computed:{
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.user-info{
    font-size: 14px;
    span{
        float:left;
        line-height: 30px;
    }
    .user-info-label{
        width:80px;
        text-align: right;
    }
    .user-info-text{
        width:calc(100% - 90px);
        padding-left: 5px;
    }
}
</style>
