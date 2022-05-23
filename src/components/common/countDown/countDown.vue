<template>
    <span>{{countTime}}</span>
</template>
<script>
export default {
    data () {
        return {
            timeInterval:"",
            countTime:""
        }
    },
    props: {
        // 秒数
        time:{
            type:Number | String
        }
    },
    methods: {
        countDown(date){
            let _this = this;
            let hour = Math.floor(date / 3600)<10?'0'+Math.floor(date / 3600):Math.floor(date / 3600);
            let minute = Math.floor((date%3600)/60)<10?'0'+Math.floor((date%3600)/60):Math.floor((date%3600)/60);
            let second = (date%3600)%60<10?'0'+(date%3600)%60:(date%3600)%60;
            if(date<=0){
                clearInterval(this.timeInterval);
                this.countTime = "00:00:00";
            }else{
                // if(hour/24>=1){
                //     this.countTime = Math.floor(hour/24) + '天';
                //     // $(".case-package-item text[timer-case-id='"+id+"']").html(str);
                // }else{
                    this.countTime = `${hour}:${minute}:${second}`;
                    // $(".case-package-item text[timer-case-id='"+id+"']").html(str);
                    if(this.timeInterval){
                        clearInterval(this.timeInterval);
                    }
                    this.timeInterval = setInterval(function(){
                        _this.countDown(--date);
                    },1000,date);
                // }
            }
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.countDown(this.time)
    },
    updated(){
    },
    components: {},
    watch: {
        time(newVal,oldVal){
            clearInterval(this.timeInterval);
            this.countDown(newVal);
        }
    }
}
</script>
<style>
 
</style>
