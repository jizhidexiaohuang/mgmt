<template>
    <div class="tianyancha" :style="{width:(width?width+'px':'100%')}" @click.stop="showOrHide">
        <Input type="text" @on-keyup="searchKeyword" v-model.trim="keyword" @on-blur="getName"></Input>
        <transition name="fade">
        <ul class="list-table" v-show="openCtrl">
            <li v-for="(item,index) in list" :key="index" 
                @click.stop="chooseItem(item,index)"
                :class="indexLi==index?'selected':''">
                <p v-html="item.name">{{item.name}}</p>
            </li>
            <li v-show="list.length==0"><p>{{searchLoading?'搜索中...':'无数据'}}</p></li>
        </ul>
        </transition>
    </div>
</template>
<script>
export default {
    data () {
        return {
            list:[],
            keyword:'',
            timer:0,
            openCtrl:false,
            indexLi:-1,
            searchLoading:false,
        }
    },
    props: {
        width:{
            type:Number
        },
        defaultName:{
            type:String
        }
    },
    methods: {
        getName(){
            let data = {
                compayName:this.keyword,
                legalPersonName:'',
                creditCode:'',
                businessScope:'',
                regLocation:'',
                address:''
            }
            this.$emit('getCustomerName',data)
        },
        chooseItem(item,index){
            this.openCtrl = !this.openCtrl;
            this.indexLi = index;
            this.keyword = item.name.replace(/\<span style=\"color:red\;\"\>/g,'').replace(/\<\/span\>/g,'');
            // let url = '/tianyancha/enterprise/getBaseInfo?name='+this.keyword;
            let url = '/base/company/company-information/'+this.keyword;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.$emit('getCustomerName',res.data);
                }
            })
        },
        getListByKeyword(){
            let url = '/tpi/quanweidu/enterprise/info?word='+this.keyword;
            if(this.keyword){
                this.$get(url).then(res=>{
                    if(res.code==0){
                        this.searchLoading = false;
                        this.openCtrl = true;
                        this.list = res.data.items.map(item=>{
                            if(item.name.indexOf('em')!=-1){
                                item.name = item.name.replace(/\<em\>/g,'<span style="color:red;">');
                                item.name = item.name.replace(/\<\/em\>/g,'</span>');
                            }
                            return item;
                        })
                    }else{
                        this.list = [];
                        this.searchLoading = false;
                    }
                })
            }
        },
        searchKeyword(){
            this.timer = new Date().getTime();
            this.searchLoading = true;
            setTimeout(()=>{
                if(new Date().getTime() - this.timer >= 500){
                    this.getListByKeyword();
                }
            },500)
        },
        showOrHide(){
            this.openCtrl = !this.openCtrl;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.keyword = this.defaultName;
        document.addEventListener('click',e => {
            if(!this.$el.contains(e.target)){
                this.openCtrl = false//点击其他区域关闭
            }
        })
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
.tianyancha{
    position: relative;
    .list-table{
        position: absolute;
        top:32px;
        left: 0px;
        background: #fff;
        width:100%;
        max-height: 200px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        padding:5px 0px;
        margin:5px 0px;
        z-index: 10;
        overflow-y: scroll;
        li{
            line-height: normal;
            padding: 7px 16px;
            color: #515a6e;
            font-size: 12px !important;
            white-space: nowrap;
            cursor: pointer;
            &:hover{
                background: #f3f3f3;
            }
            &.selected{
                background: #f3f3f3;
                color:$globalMainColor;
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: height opacity .2s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
        height: 0;
    }
}
</style>
