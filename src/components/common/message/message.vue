<template>
    <transition name="l-message" v-if="messageCtrl">
    <div class="l-message-box">
        <div class="l-message">
            <span v-if="iconType=='error'" class="icon-error-01 l-icon"></span>
            <span v-if="iconType=='success'" class="icon-correct-01 l-icon"></span>
            <p class="text">{{message}}</p>
        </div>
    </div>
    </transition>
</template>
<script>
export default {
    name:'message',
    data () {
        return {
            messageCtrl:false
        }
    },
    props: {
        message:{
            type:String,
            default:''
        },
        iconType:{
            type:String,
            default:'error'
        },
        duration:{
            type:Number,
            default:1.5
        }
    },
    methods: {
        show(){
            this.messageCtrl = true;
            setTimeout(()=>{
                this.messageCtrl = false;
            },this.duration*1000)
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        
    },
    updated(){
        
    },
    components: {},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
@import '../../../assets/globalStyle.scss';
.l-message-enter,.l-message-leave-to{
    opacity: 0;
}
// 定义离开前与进入后状态
    .l-message-leave, .l-message-enter-to {
        opacity: 1;
    }
    // 定义进出过程
    .l-message-enter-active, .l-message-leave-active {
        transition: all .2s
    }
    .l-message-box{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        .l-message{
            position: absolute;
            width:auto;
            max-width: 33%;
            padding:38px 70px 38px 110px;
            background: #fff;
            text-align: left;
            line-height: 1;
            left: 50%;
            top:40%;
            transform: translate(-50%,-50%);
            box-shadow: 0px 2px 13px 0px 
            rgba(177, 177, 177, 0.34);
            border-radius: 4px;
        }
    }
    .l-icon{
        font-size: 24px;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        left: 70px;
    }
    p.text{
        color: $textColor;
        font-size: 16px;
        font-weight: bold;
    }
    .icon-error-01{
        color:$errorColor;
    }
    .icon-correct-01{
        color:$successColor;
    }
</style>
