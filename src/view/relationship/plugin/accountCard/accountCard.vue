<template>
    <div class="follow-record-form">
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80" v-if="!customerAccount">
             <FormItem label="客户账号" prop="customerAccount">
                <Input type="text" v-model.trim="formCustom.customerAccount"></Input>
            </FormItem>
            <FormItem label="客户密码" prop="passwd">
                <Input type="password" v-model="formCustom.passwd"></Input>
            </FormItem>
            <FormItem label="重新输入" prop="passwdCheck">
                <Input type="password" v-model="formCustom.passwdCheck"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
                <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
        <div class="detail-content" v-if="customerAccount">
            <Row>
                <Col span="5" class="left-label">客户账号：</Col>
                <Col span="16" class="right-content">{{customerAccount}}&nbsp;&nbsp;
                <Icon title="重置密码" style="vertical-align: middle;cursor:pointer" @click="resetPassword" type="ios-refresh" size="17" /></Col>
            </Row>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入密码'));
            } else if(value.length<6||value.length>32){
                return callback(new Error('密码不能少于6个字符且不能超过32个字符'));
            } else if(/[\u4E00-\u9FA5\uF900-\uFA2D\u0020]/.test(value)){
                callback(new Error('密码不能为中文字符和空格'));
            } else {
                if (this.formCustom.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwdCheck');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formCustom.passwd) {
                callback(new Error('两次密码不一样！'));
            } else {
                callback();
            }
        };
        const validateAccount = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('账号不能为空'));
            }
            if(value.length>32){
                return callback(new Error('长度不能超过32个字符'));
            }
            if(/^[^\d]*$|^[^a-zA-Z]*$|[^\da-zA-Z]/.test(value)){
                return callback(new Error('账号仅使用数字,大小写字母组合'));
            }
            let url = '/base/account/check?accountName='+value;
            this.$get(url).then(res=>{
                if(res.code==0&&(!res.data)){
                    callback()
                }else{
                    callback(new Error('客户账号已存在'));
                }
            })
        };
        return {
            formCustom: {
                customerAccount:'',
                passwd: '',
                passwdCheck: '',
            },
            ruleCustom: {
                customerAccount: [
                    { validator: validateAccount, trigger: 'blur' }
                ],
                passwd: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
            }
        }
    },
    props: ['id','customerAccount'],
    methods: {
        handleSubmit (name) {
            let url = '/base/customer/account';
            let ajaxData = {
                id:this.id,
                account:this.formCustom.customerAccount,
                password:this.formCustom.passwd
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$Message.success('操作成功!');
                            this.$emit('closeDrawer',true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        //重置密码
        resetPassword(){
            let url = `/base/customer/${this.id}/reset-password`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success('操作成功！')
                    this.$emit('closeDrawer',true);
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
 .follow-record-form{
    background: #f7f8fa;
    margin-top:20px;
    padding: 5px 10px;
    padding-top:10px;
 }
</style>
