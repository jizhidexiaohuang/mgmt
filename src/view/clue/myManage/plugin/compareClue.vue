<template>
    <Row class="compare-box">
        <Row class="conflict-alert-box">
            <div class="conflict-alert">
                <i class="icon-error-01"></i>
                <span>{{description}}</span>
            </div>
        </Row>
        <Row class="conflict-clue-box" :style="style">
            <Row class="error-clue-box">
                <compare-item ref="compareItem" :renderObj="meObj" :type="type" :isError="type=='conflict'?true:false">
                    <span slot="title">疑似{{titleName}}</span>
                </compare-item>
            </Row>          
            <Row class="compare-clue-box">
                <Carousel
                    v-model="acitveIndex"
                    dots="none"
                    arrow="never">
                    <CarouselItem v-for="(item,index) in conflictList" :key="index">
                        <compare-item :renderObj="item" :type="type">
                            <span slot="title">对比（{{acitveIndex+1}}/{{conflictList.length}}）</span>
                        </compare-item>
                    </CarouselItem>
                </Carousel>
            </Row>
        </Row>
        <Row class="page-bottom">
            <Page 
                :total="conflictList.length" 
                :page-size="1"
                size="small"
                @on-change="changePage"/>
        </Row>
    </Row>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import compareItem from "./compareItem.vue";
export default {
    data () {
        return {
            mainColor:styles,
            acitveIndex:0,
            style:{
                "maxHeight":"",
                "overflowY":"auto"
            },
            meObj:{},
            conflictList:{},
            description:""
        }
    },
    props: ['defaultData','type'],
    methods: {
        changePage(page){
            this.acitveIndex = page-1;
            let errIndex = this.conflictList[this.acitveIndex].conflictIndex;
            this.description = this.conflictList[this.acitveIndex].description;
            this.$refs.compareItem.update(this.conflictList[this.acitveIndex],this.defaultData.meList[errIndex]);
        },
    },
    created(){},
    computed:{
        titleName(){
            return this.type=='conflict'?'冲突':'关联'
        }
    },
    beforeMount(){
        this.style["maxHeight"] = document.body.clientHeight - 355 + "px";
        //处理数据
        if(this.defaultData.conflictList&&this.defaultData.conflictList.length>0){
            this.conflictList = this.defaultData.conflictList;
            let errorIndex = this.conflictList[0].conflictIndex || 0;
            this.meObj = this.defaultData.meList[errorIndex];
            this.meObj.conflictField = this.conflictList[0].conflictField;
            this.description = this.conflictList[0].description;
        }else{
            this.conflictList = [];
            this.meObj = {};
        }
    },
    mounted(){},
    updated(){},
    components: {
        compareItem
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./compareClue.scss";
</style>
<style lang="scss">
.compare-clue-box{
    .ivu-carousel{
        user-select:text;
    }
}
</style>
