<template>
   <div class="login-bg">
        <div class="login-box">
            <img src="../../assets/images/mgmt-02.png" class="icon-hexagon" alt="">
            <div class="login-box-left">
                <img :src="loginLog" alt="">
                <h2>管理后台登录</h2>
                <div class="login-form">
                    <ul :style="{'marginBottom':tabCtrl=='qrcode'?'0px':''}">
                        <!-- <li @click="tabCtrl='mobilephone'" :class="[tabCtrl=='mobilephone'?'active':'']">手机验证码</li> -->
                        <li @click="getQrCode()" :class="[tabCtrl=='qrcode'?'active':'']">企业微信登录</li>
                        <li @click="tabCtrl='account'" :class="[tabCtrl=='account'?'active':'']">账号密码</li>
                    </ul>
                    <div class="mobilephone" v-show="tabCtrl=='mobilephone'">
                        <div class="input-box">
                            <input type="text" placeholder="请输入手机号" v-model="mobile">
                            <span class="icon icon-phone-01"></span>
                        </div>
                        <div class="input-box">
                            <input type="text" placeholder="请输入验证码" v-model="smCode">
                            <span class="icon icon-password-01"></span>
                            <span class="text send-verification-code" @click="sendCode()" v-if="!sendCodeCtrl" id="TencentCaptcha">发送验证码</span>
                            <span class="text resend" v-if="sendCodeCtrl">重新发送（{{second}}S）</span>
                        </div>
                    </div>
                    <div class="accout-password" v-show="tabCtrl=='account'">
                        <div class="input-box">
                            <input type="text" placeholder="请输入账号" v-model="userName">
                            <span class="icon icon-user-01"></span>
                        </div>
                        <div class="input-box">
                            <input type="password" placeholder="请输入密码" @keyup.enter="handleSubmit" v-model="password">
                            <span class="icon icon-password-01"></span>
                        </div>
                    </div>
                    <div class="qrcode-box" v-show="tabCtrl=='qrcode'">
                        <div id="login_container" v-show="!wechatError"></div>
                        <div v-show="wechatError" class="wechat-error">
                            获取微信二维码失败
                        </div>
                    </div>
                    <Button class="login-btn" type="primary"
                    v-show="tabCtrl!='qrcode'"
                    :disabled="(mobile&&smCode||userName&&password)?false:true" 
                    @click="handleSubmit()">登&nbsp;&nbsp;录</Button>
                </div>
            </div>
            <div class="login-box-right"><img :src="rightBg" alt=""></div>
        </div>
        <Message ref="message" :message="message" :iconType="'error'"></Message>
   </div>
</template>
<script>
import Message from '@/components/common/message/message';
    export default {
        data () {
            return {
                tabCtrl:'qrcode',
                loginLog:require('../../assets/images/login-logo.png'),
                rightBg:require('../../assets/images/mgmt-01.png'),
                second:59,
                sendCodeCtrl:false,
                mobile:'',
                smCode:'',
                userName:'',
                password:'',
                message:'',
                wechatError:false
            }
        },
        computed:{
            
        },
        props: [''],
        methods: {
            handleSubmit() {
                let url,ajaxData;
                if(this.tabCtrl=='mobilephone'){
                    if(!(/^1[3456789]\d{9}$/.test(this.mobile))){
                        this.$Message.error('手机号码有误，请重填');
                        return false;
                    }
                    url = '/authentication/auth/loginMobile';
                    ajaxData = {
                        grantType:'password',
                        loginType:'MOBILE',
                        mobile: this.mobile,
                        smsCode: this.smCode,
                    };
                }else if(this.tabCtrl=='account'){
                    url = '/authentication/auth/loginMgmt';
                    ajaxData = {
                        grantType:'password',
                        userName: this.userName,
                        password: this.password,
                    };
                }
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        window.localStorage.setItem('token',res.data.accessToken);
                        window.localStorage.setItem('refreshToken',res.data.refreshToken);
                        window.localStorage.setItem('expiryTime',new Date().getTime())
                        window.localStorage.setItem('account',JSON.stringify(res.data.additionalInformation.currentUser));
                        this.$router.push({path:'/'});
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            },
            sendCode(){
                if(!(/^1[3456789]\d{9}$/.test(this.mobile))){
                    this.$Message.error('手机号码有误，请重填');
                    return false;
                }
                let _this = this;
                let url = '/base/verify/getImageVerifyConfig';
                this.$get(url).then(res=>{
                    //先验证图形码
                    let captcha = new TencentCaptcha(res.data.appId+'',function(res) {
                        _this.getSmCode(res.ticket,res.randstr);
                    });
                    captcha.show();
                    document.getElementById('t_mask').style.background = '#fff';
                })
            },
            getSmCode(ticket,randstr){
                // 假装获取验证码
                let url = '/base/sms/getSmsCode?mobile='+this.mobile+'&ticket='+ticket+'&randStr='+randstr;
                this.$get(url).then(res=>{
                    if(res.code==0){
                        this.sendCodeCtrl = true;
                        this.second = 59;
                        let timeId = null;
                        timeId = setInterval(()=>{
                            this.second--;
                            if(this.second<0){
                                clearInterval(timeId);
                                this.sendCodeCtrl = false;
                            }
                        },1000)
                    }else{
                        this.message = res.message;
                        this.$refs.message.show();
                    }
                })
            },
            getQrCode(){
                this.tabCtrl = 'qrcode';
                document.getElementById('login_container').innerHTML = '';
                // let url = '/wechat/corpWechatProxy/getJsApiConfig';
                let url = '/wechat/corp/js-api-config';
                this.$get(url).then(res=>{
                    if(res.code==0){
                        window.WwLogin({
                            id:"login_container", 
                            appid: res.data.appId, 
                            agentid:res.data.agentId,
                            redirect_uri: encodeURIComponent(this.config.basePath+'/#/login'),
                            state: res.data.state,
                            href: "https://files.andunip.com/recoverQrcode.css"
                        });
                        document.getElementsByTagName('iframe')[0].style.height = '345px';
                    }else{
                        this.wechatError = true;
                    }
                }).catch(err=>{
                    this.wechatError = true;
                })
            },
            getUserId(){
                let _this = this;
                let url = '/wechat/corpWechatProxy/getWechatUserInfo?code='+this.code+'&state='+this.state;
                return new Promise(function(resolve,reject){
                    _this.$get(url).then(res=>{
                        if(res.code==0){
                            resolve(res.data)
                        }else{
                            reject(res.code)
                        }
                    })
                })
            },
            getAccessToken(){
                let url = '/authentication/auth/loginCorpWechat';
                let ajaxData = {
                    providerId:'corpWechat',
                    code:this.code,
                    state:this.state,
                    grantType:'password'
                }
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        window.localStorage.setItem('token',res.data.accessToken);
                        window.localStorage.setItem('refreshToken',res.data.refreshToken);
                        window.localStorage.setItem('expiryTime',new Date().getTime())
                        window.localStorage.setItem('account',JSON.stringify(res.data.additionalInformation.currentUser));
                        this.$router.push({path:'/'});
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            keydownEvent:function(e){
                // 兼容FF和IE和Opera
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    this.handleSubmit();
                }
            }
        },
        created(){

        },
        beforeMount(){

        },
        mounted(){
            this.$store.commit('permission/resetFlag',false)
            this.$store.commit('permission/setMenu',false)
            window.localStorage.setItem('token','');
            window.localStorage.setItem('refreshToken','');
            window.localStorage.setItem('expiryTime','');
            window.localStorage.setItem('account','');
            //回车事件
            document.addEventListener('keydown',this.keydownEvent);
            this.getQrCode();
        },
        beforeDestroy(){
            document.removeEventListener('keydown', this.keydownEvent);//移除监听事件的回调函数
        },
        updated(){

        },
        components: {
            Message
        },
        watch:{
            tabCtrl(val,oldVal){
                if(val=='mobilephone'){
                    this.userName = '';
                    this.password = '';
                }else if(val=='account'){
                    this.mobile = '';
                    this.smCode = '';
                }
            },
            $route(val,oldVal){
                if(val.fullPath.indexOf('?')!=-1){
                    this.code = val.query.code;
                    this.state = val.query.state;
                    this.getAccessToken();
                }
            }
        }
    }
</script>
<style lang="sass" scoped>
@import "login.scss"
</style>

