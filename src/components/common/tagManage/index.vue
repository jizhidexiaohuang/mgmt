<template>
    <div>
        <!-- <Row class="title">已订阅标签</Row> -->
        <Row>
            <Tag v-for="(item,index) in defaultList" :key="index" :color="item.color" @on-close="delTag(item,index)" closable>{{item.tagName}}</Tag>
        </Row>
        <Row class="title">点击添加标签</Row>
        <Row>
            <Tag class="tag" v-for="(item,index) in tagList" :key="index" :color="item.color" @click.native="addTag(item,index)">{{item.tagName}}</Tag>
        </Row>
        <Row class="btn-row"><Button type="primary" @click="changeTagSubmit">确定</Button></Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tagList:[]
        }
    },
    props: {
        caseId:{
            type:String | Number
        },
        defaultList:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    methods: {
        getTagList(){
            let url ='/business/taglib';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.tagList = res.data;
                    for(let i=0;i<this.tagList.length;i++){
                        for(let j=0; j<this.defaultList.length;j++){
                            if(this.tagList[i].taglibId==this.defaultList[j].taglibId){
                                this.tagList.splice(i,1);
                                i--;
                                break;
                            }else if(this.tagList[i].taglibId!=this.defaultList[j].taglibId && j==this.defaultList.length-1){
                                break;
                            }
                        }
                    }
                }
            })
        },
        delTag(item,index){
            this.defaultList.splice(index,1);
            this.tagList.push(item);
        },
        addTag(item,index){
            this.defaultList.push(item);
            this.tagList.splice(index,1);
        },
        changeTagSubmit(){
            this.$emit('changeTag',this.defaultList)
        }
    },
    created(){},
    beforeMount(){
        this.getTagList()
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
.title{
    font-size: 14px;
    font-weight: 600;
    padding:10px 0px;
}
.tag{
    cursor: pointer;
}
.btn-row{
    text-align:center;
    padding-top:15px;
}
</style>
