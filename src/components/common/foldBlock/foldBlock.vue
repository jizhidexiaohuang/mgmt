<template>
    <div style="display:inline-block;">
        <span :class="{'block-text':true,'click-text':allowClick}" :title="item" v-for="(item,index) in renderArr" :key="index" @click="clickEvent(item)">{{splitName(item)}}</span>
        <Poptip :placement="placement" padding="0px 0px" :width="width" trigger="hover" :word-wrap="true" v-if="textArray.length>maxNum">
            <span class="block-text click-btn" v-if="textArray.length>1">共{{textArray.length>100?'99+':textArray.length}}{{this.unit}}</span>
            <div slot="content" :style="{'max-height':maxHeight+'px','padding':'8px 12px','overflow':'auto'}">
                <span :class="{'block-text':true,'click-text':allowClick}" v-for="(item,index) in textArray" :title="item" :key="index" @click="clickEvent(item)">{{item}}</span>
            </div>  
        </Poptip>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    props: {
        // 需要展示的对象
        text:{
            type:String,
            default:""
        },
        // 最大展示数
        maxNum:{
            type:String | Number,
            default:5
        },
        maxTextLenth:{
            type:Number,
            default:300
        },
        unit:{
            type:String,
            default:"个"
        },
        width:{
            type:String | Number,
            default:400
        },
        maxHeight:{
            type:String | Number,
            default:500
        },
        placement:{
            type:String,
            default:"bottom-end"
        },
        allowClick:{
            type:Boolean,
            default:false
        }
    },
    methods: {
        splitName(item){
            let str = "";
            if(item&&item.length>this.maxTextLenth){
                str = item.substring(0,this.maxTextLenth) + "...";
                return str
            }else{
                return item
            }
        },
        clickEvent(name){
            this.$emit("clickEvent",name);
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    computed:{
        textArray(){
            if(this.text){
                return this.text.split(",");
            }else{
                return []
            }  
        },
        renderArr(){
            let arr = [];
            if(this.textArray.length>this.maxNum){
                arr = this.textArray.filter((item,index)=>{
                    return index<this.maxNum
                })
            }else{
                return this.textArray
            }
            return arr
        }
    },
    watch: {}
}
</script>
<style lang="scss">
@import "./foldBlock.scss";
</style>
