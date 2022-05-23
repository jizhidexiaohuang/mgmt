<template>
    <div class="my-input">
        <Poptip trigger="hover" v-if="tips">
            <Input v-model="inputData" :disabled="disabled" @on-blur="toFixedNumber" style="height:30px;">
                <span v-if="prependText" slot="prepend">{{prependText}}</span>
                <span slot="append">{{appendText}}</span>
            </Input>
            <div slot="content">{{tips}}</div>
        </Poptip>
        <Input v-model="inputData" @on-blur="toFixedNumber" :disabled="disabled" :placeholder="placeholder" v-else>
            <span v-if="prependText" slot="prepend">{{prependText}}</span>
            <span slot="append">{{appendText}}</span>
        </Input>
    </div>
</template>
<script>
export default {
    data () {
        return {
            inputData:""
        }
    },
    props: {
        defaultData:{
            type:Number | String
        },
        disabled:{
            type:Boolean,
            default:false
        },
        prependText:{       //输入框前缀
            type:String
        },
        appendText:{        //输入框后缀
            type:String,
            default:"%"
        },
        toFixed:{           //格式化几位小数
            type:Number,
            default:0
        },
        tips:{              //气泡提示
            type:String
        },
        placeholder:{
            type:String,
            default:'请输入金额'
        }
    },
    methods: {
        toFixedNumber(){
            // 判断是否为自然数
            let reg  = /^[+|-]{0,1}(\d+)$|^[+|-]{0,1}(\d+\.\d+)$/;
            if(!reg.test(this.inputData)){
                this.inputData = "";
                this.$emit("getValue",this.inputData);
                return
            }
            this.inputData = Number(this.inputData).toFixed(this.toFixed);
            this.$emit("getValue",this.inputData);
        },
        //清除数值
        clearValue(){
            this.inputData = ''
            this.$emit("getValue",this.inputData);
        },
    },
    created(){},
    beforeMount(){
        if(this.defaultData){
            this.inputData = this.defaultData;
            this.toFixedNumber();
        }
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss">
.my-input{
    line-height: 1;
    .ivu-input-group-prepend, .ivu-input-group-append{
        background: #fff;
    }
    .ivu-poptip,.ivu-poptip-rel{
        width: 100%;
    }
}
</style>
