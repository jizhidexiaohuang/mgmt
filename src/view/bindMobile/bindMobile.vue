<template>
   <div class="login-bg">
        <div class="login-box">
            <div class="login-box-left">
                <img :src="loginLog" alt="">
                <h2>绑定手机号</h2>
                <div class="login-form">
                    <div class="mobilephone" style="margin-top:7%;">
                        <div class="input-box">
                            <input type="text" placeholder="请输入手机号" v-model="mobile">
                            <span class="icon icon-Phone-01"></span>
                        </div>
                        <div class="input-box">
                            <input type="text" placeholder="请输入验证码" v-model="smCode">
                            <span class="icon icon-password-01"></span>
                            <span class="text send-verification-code" @click="sendCode()" v-if="!sendCodeCtrl">发送验证码</span>
                            <span class="text resend" v-if="sendCodeCtrl">重新发送（{{second}}S）</span>
                        </div>
                    </div>
                    <Button class="login-btn" type="primary" :disabled="!mobile||!smCode" @click="handleSubmit()">绑定手机号</Button>
                </div>
            </div>
            <div class="login-box-right"></div>
        </div>
   </div>
</template>
<script>
    export default {
        data () {
            return {
                loginLog:require('../../assets/images/login-logo.png'),
                second:'',
                mobile:'',
                smCode:'',
                sendCodeCtrl:false,
            }
        },
        props: [''],
        methods: {
             handleSubmit() {
                let url = '/auth/login';
                let ajaxData = {
                    grantType:'password',
                    username: this.account,
                    password: this.password,
                };
                console.log(ajaxData);
                this.$post(url,ajaxData).then(res=>{
                    console.log(res)
                })
            },
            sendCode(){
                this.sendCodeCtrl = true;
                this.second = 9;
                let timeId = null;
                timeId = setInterval(()=>{
                    this.second--;
                    if(this.second<0){
                        clearInterval(timeId);
                        this.sendCodeCtrl = false;
                    }
                },1000)
            }
        },
        created(){

        },
        beforeMount(){

        },
        mounted(){

        },
        updated(){

        },
        components: {

        }
    }
</script>
<style lang="sass" scoped>
@import "../login/login.scss"
</style>

