<template>
    <div>
        <Form ref="userForm" :model="userForm" :rules="userValidate" :label-width="80">
            <FormItem label="成员姓名" prop="name">
                <Input v-model.trim="userForm.name" placeholder="请输入成员姓名"></Input>
            </FormItem>
            <FormItem label="所在部门" prop="organizationIds">
                <InputTree transfer @returnData="setFormData" ref="treeInput" :multiple="true" v-if="showTree"></InputTree>
            </FormItem>
            <FormItem label="成员职务" prop="position">
                <Input v-model.trim="userForm.position" placeholder="请输入成员职务"></Input>
            </FormItem>
            <FormItem label="所属角色" prop="roleIds">
                <Select v-model.trim="userForm.roleIds" multiple transfer clearable>
                    <Option :value="item.value" v-for="item in positionArr" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="联系方式" prop="mobile">
                <Input v-model.trim="userForm.mobile" placeholder="请输入联系方式"></Input>
            </FormItem>
        </Form>
        <div class="drawer-style drawer-btn" style="text-align:center;">
            <Button type="primary" class="drawer-add-btn" :loading="confirmLoading" @click="userConfirm">确认</Button>
            <Button class="drawer-add-btn" @click="closeManageUser">取消</Button>
        </div>
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
            showTree:true,
            positionArr:[],
            confirmLoading:false,
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
                name:[{ required: true, message: "请填写成员姓名", trigger: "blur" }],
                position:[{ required: true, message: "请选择成员职务", trigger: "blur" }],
                organizationIds:[
                    { required: true,validator:validateOrganization }
                ],
                // roleIds:[{ required: true,validator:validateRole }],
                mobile:[
                    { required: true,validator:validatePhone, trigger: "blur" },
                    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
                ]
            }
        }
    },
    props: ['data','isEdit'],
    methods: {
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
        userConfirm(){
            this.$refs["userForm"].validate((valid) => {
                if(valid){
                    let url = "/base/mgmt-user";
                    let ajaxData = this.userForm;
                    this.confirmLoading = true;
                    this.$post(url,ajaxData).then(res=>{
                        this.confirmLoading = false;
                        if(res.code==0){
                            this.$Message.success("操作成功");
                            this.$emit("closeModel",true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            });
        },
        closeManageUser(){
            this.$emit("closeModel")
        },
        clearForm(){
            this.userForm = {
                name:"",                //姓名
                position:"",            //职务
                roleIds:[],             //角色
                mobile:"",              //联系方式
                organizationIds:[]      //部门
            };
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getRoleData();
    },
    updated(){},
    components: {
        InputTree
    },
    watch: {}
}
</script>
<style>
 
</style>
