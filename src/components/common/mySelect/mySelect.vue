<template>
    <div class="selected" :style="{width:(width?width+'px':'100%')}">
        <div class="select-container" @click="openCtrl=!openCtrl" @mouseenter="mouseenter" @mouseleave="closeIconCtrl=false;">
            <p class="select-placeholder" v-show="(selectArr.length==0&&type==='multiple')||(!selectedObj[keyName]&&type==='single')">{{this.placeholder}}</p>
            <Icon type="ios-arrow-down" :class="arrowDownClass" size="16" v-show="!closeIconCtrl"/>
            <Icon type="ios-close-circle" class="clear-selected" @click.stop="clearSelected" v-if="closeIconCtrl" />
            <!-- 多选样式 -->
            <div class="select-tag" v-for="(item,index) in selectArr" :key="index" v-if="type=='multiple'">
                <span class="tag-text">{{item[keyName]}}</span><Icon type="ios-close" class="ios-close" @click.stop="deleteItem(item[keyId])" size="16" />
            </div>
            <!-- 单选样式 -->
            <p v-if="type=='single'" class="selected-text textover">{{selectedObj[keyName]}}</p>
        </div>
        <!-- 搜索框 -->
        <Input type="text" class="select-search" v-show="openCtrl" @on-keyup="searchKeyword" v-model="keyword" :placeholder="placeholderInput" />
        <!-- scroll列表 -->
        <div :class="selectListClass" :style="{bottom:data.length==0&&openCtrl?'-84px':-(this.height+32)+'px'}">
            <Scroll :on-reach-bottom="handleReachBottom" :height="height" v-if="data.length!=0"
                :distance-to-edge="10" v-show="openCtrl">
                <div :class="[(tempIdArr.indexOf(item[keyId])>-1||selectedObj[keyId]==item[keyId])?'list-item-active':'',
                        (tempDisabledIdArr&&tempDisabledIdArr.indexOf(item[keyId])>-1||tempDisabledIdArr[0]==item[keyId])?'list-item-disabled':'',
                        'list-item']" 
                    v-for="(item, index) in data" :key="index" 
                    @click="(tempDisabledIdArr&&tempDisabledIdArr.indexOf(item[keyId])>-1||tempDisabledIdArr[0]==item[keyId])?'':chooseItem(item)">

                    <div>
                        <p style="line-height:18px;">{{item[keyName]}}<br/>
                        <slot name="moreText" :item="item"></slot>
                        </p>
                    </div>
                    <Icon type="md-checkmark" class="checked-icon" />
                </div>
            </Scroll>
            <Row v-if="data.length==0&&openCtrl" class="no-data">暂无数据</Row>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            openCtrl:false,
            selectArr:[],   //多选数组
            tempIdArr:[],
            tempDisabledIdArr:[],
            selectedObj:{}, //单选对象
            keyword:'', //关键字
            closeIconCtrl:false,
            inputScroll:{
                pageNum:1,
                pageSize:this.config.pageSize,
                total:0
            },        //分页参数
            data:[], //初始数据
            timer:0
        }
    },
    props: {
        path:{
            type:String,
            required:true
        },
        keyName:{
            type:String,    //需要渲染的字段
            required:true
        },
        keyId:{
            type:String,    //需要渲染的字段
            default:'id'
        },
        placeholder:{
            type:String,            
            default:"请选择成员组"
        },
        placeholderInput:{
            type:String,
            default:"请输入关键字搜索"
        },
        type:{
            type:String,
            default:'single' //multiple  single 类型
        },
        height:{
            type:[Number,String],
            default:200  //高度
        },
        width:{
            type:Number
        },
        params:{  //除了keyword是否还有另外的参数
            type:Object
        },
        pagingMode:{ //是否分页
            type:Boolean,
            default:true
        },
        defaultObj:{
            type:[Object,Array] //赋默认值
        },
        inputKey:{ //搜索框的key值
            type:String,
            default:"keyword"
        },
        method:{
            type:String,
            default:'GET'
        },
        disabledList:{ //禁用的id
            type:Array
        }
    },
    computed:{
        arrowDownClass(){
            return [
                'arrow-down',
                {
                    'arrow-down-visible':this.openCtrl
                }
            ]
        },
        selectListClass(){
            return [
                'select-list',
                {
                    'select-list-open':this.openCtrl
                }
            ]
        }
    },
    methods: {
        //请求成员组列表数据
        getMemberGroupList(keyword,flag){
            if(flag){
                this.inputScroll.pageNum = 1;
            }
            let url = this.path;
            let ajaxData = {
                current: this.inputScroll.pageNum,        
                size: this.inputScroll.pageSize,
                [this.inputKey]:keyword||''
            }
            if(!!this.params){
                for(let key in this.params){
                    ajaxData[key] = this.params[key];
                }
            }
            if((this.inputScroll.pageNum-1)*this.inputScroll.pageSize>this.inputScroll.total){
                return
            }
            if(this.method==='GET'){
                this.$get(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.data = flag?res.data.records:this.data.concat(res.data.records);
                        this.inputScroll.pageNum = res.data.current+1;
                        this.inputScroll.total = res.data.total;
                    }
                })
            }else{
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.data = flag?res.data.records:this.data.concat(res.data.records);
                        this.inputScroll.pageNum = res.data.current+1;
                        this.inputScroll.total = res.data.total;
                    }
                })
            }
        },
        //下拉加载数据
        handleReachBottom () {
            return new Promise(resolve => {
                this.getMemberGroupList(this.keyword,false);
                resolve();
            });
        },
        //单个选中
        chooseItem(item){
            if(this.type=='multiple'){
                let index = this.tempIdArr.indexOf(item[keyId]);
                if(index>-1){
                    this.selectArr.splice(index,1);
                    this.tempIdArr.splice(index,1);
                }else{
                    this.selectArr.push(item);
                    this.tempIdArr.push(item[keyId]);
                }
                this.$emit('getValue',this.selectArr);
            }else{
                this.selectedObj = item;
                this.openCtrl = false;
                this.$emit('getValue',this.selectedObj);
            }
            if(this.keyword){
                this.keyword = '';
                //因为关键字搜索之后需要重新加载第一页数据  不能删
                this.getMemberGroupList(this.keyword,true);
            }
        },
        //删除单个
        deleteItem(id){
            let index = this.tempIdArr.indexOf(id);
            this.selectArr.splice(index,1);
            this.tempIdArr.splice(index,1);
            this.$emit('getValue',this.selectArr);
        },
        //清除所有
        clearSelected(){
            if(this.type=='multiple'){
                this.tempIdArr.splice(0);
                this.selectArr.splice(0);
                this.$emit('getValue',this.selectArr);
            }else{
                this.selectedObj = {}
                this.$emit('getValue',this.selectedObj);
            }
        },
        //搜索关键词 重新定位到第一页
        searchKeyword(){
            this.timer = new Date().getTime();
            setTimeout(()=>{
                if(new Date().getTime() - this.timer >= 1000){
                    this.getMemberGroupList(this.keyword,true);
                }
            },1000)
        },
        mouseenter(){
            if(this.selectArr.length>0||this.selectedObj.name){
                this.closeIconCtrl = true;
            }else{
                this.closeIconCtrl = false;
            }
        },
        voluation(){
            if(this.type==='single'&&this.defaultObj){
                this.selectedObj[this.keyName] = this.defaultObj.name;
                this.selectedObj[this.keyId] = this.defaultObj.id;
            }else if(this.type!='single'&&this.defaultObj){
                let key = this.keyName;
                this.tempIdArr = [];
                this.selectArr = this.defaultObj.map(item=>{
                    this.tempIdArr.push(item[this.keyId]);  
                    return {[key]:item.name,id:item[this.keyId]};
                })
            }
            if(this.disabledList&&this.disabledList.length>0){
                this.tempDisabledIdArr = this.disabledList.map(item=>{
                    return item;
                });
            }
        }
    },
    created(){},
    beforeMount(){
        this.getMemberGroupList('',true);
    },
    mounted(){
        document.addEventListener('click',e => {
            if(!this.$el.contains(e.target)){
                this.openCtrl = false//点击其他区域关闭
            }
        })
    },
    updated(){},
    components: {},
    watch: {
        path(newVal,oldVal){
            this.getMemberGroupList('',true);
        },
        params:{
            deep:true,
            handler(newVal,oldVal){
                if(JSON.stringify(newVal)!==JSON.stringify(oldVal)){
                    this.getMemberGroupList('',true);
                }
            }
        }
    }
}
</script>
<style scoped lang="sass">
 @import './mySelect.scss'
</style>
