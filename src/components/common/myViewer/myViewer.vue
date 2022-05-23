<template>
    <div class="my-viewer">
        <div class="viewer-sort" v-show="sortCtrl">
            <ul :id="unitKey" :style="{'width':(imgData.length*30+imgData.length)+'px','transform':`translateX(${screenWidth*0.5-imgActiveIndex*31-15}px)`}">
                <li v-for="(item,index) in imgData" :class="index==imgActiveIndex?'active-li':''" :key="index">
                    <img @click="viewImg(index)" :src="item.url || ''" :alt="item.name">
                </li>
            </ul>
        </div>
        <viewer :options="options" @inited="inited" v-if="imgData.length!=0">
            <div class="detailed-box" v-for="(itemAttach,itemIndex) in imgData" :key="itemIndex" v-show="itemIndex < (maxShowLength || 100)">
                <img :src="itemAttach.url+'?imageView2/1/w/80/h/80'" :style="{width:(width || 80)+'px',height:(height || 80)+'px'}" :data-source="itemAttach.url" :alt="itemAttach.fileName">
            </div>         
        </viewer>
    </div>
</template>
<script>
export default {
    data() {
        return {
            screenWidth:"",
            unitKey:"",
            imgData:[],
            imgActiveIndex:"",   //当前查看图片的index
            opera:"add",         //操作 add代表添加操作 remove代表移除操作      
            sortCtrl:false,      //左侧排序选择框控制是否显示
            options: {           //v-viewer配置 具体api 中文文档https://mirari.cc/categories/%E9%A1%B9%E7%9B%AE/Vue/ 原作者英文文档https://github.com/fengyuanchen/viewerjs#methods
                url: "data-source",
                view: function(currentItem) {
                    let t = this;
                    setTimeout(function(){
                        t.viewer.options.title(t.viewer.image,t.viewer.imageData,t.viewer.index);    
                    },50);
                    return currentItem;
                },
                title:(image, imageData, index) => {
                    if(index || index == 0){
                        this.imgActiveIndex = index;
                    }
                    return `<span style="display:none;" id="index"></span>${image.alt}(${imageData.naturalWidth} × ${imageData.naturalHeight})`
                },
                show:(data) => {
                    this.sortCtrl = true;
                    if(this.isSort){
                        this.renderDrag();
                    }
                },
                hide:() => {
                    this.sortCtrl = false;
                },
                className:"text-viewer-img",
            },
            //已经勾选的图片
            chooseImg: [],
        };
    },
    props: [
            "listData",    //data为数据(arr)
            "imgId",       //图片id字段(可传可不传，默认‘id’)
            "isSort",      //是否展示左侧排序模块(bool)(可传可不传，默认为不展示，传true则会展示)
            "width",       //width为展示小图片的宽度(num)(可传可不传，默认为80)
            "height",      //height为展示小图片的高度(num)(可传可不传，默认为80)
            "clueId",
            "maxShowLength"//最大展示图片数
        ],
    methods: {
        //监听viewer组件
        inited(viewer) {
            this.$viewer = viewer;
        },
        renderDrag(){
            let t = this;
            var $ul = document.getElementById(this.unitKey);
            new Sortable($ul, {
                onUpdate:function(event){
                    let oldObj = t.imgData[event.oldIndex];
                    let newObj = t.imgData[event.newIndex];
                    let newIndex = event.newIndex,
                        oldIndex = event.oldIndex,
                        $li = $ul.children[newIndex],
                        $oldLi = $ul.children[oldIndex]
                    // 先删除移动的节点
                    $ul.removeChild($li)    
                    // 再插入移动的节点到原有节点，还原了移动的操作
                    if(newIndex > oldIndex) {
                        $ul.insertBefore($li,$oldLi)
                    } else {
                        $ul.insertBefore($li,$oldLi.nextSibling)
                    }
                    // 更新items数组
                    t.$set(t.imgData,event.oldIndex,newObj);
                    t.$set(t.imgData,event.newIndex,oldObj);
                },
                onEnd(event){
                    let oldObj = t.imgData[event.oldIndex];
                    let newObj = t.imgData[event.newIndex];
                    setTimeout(function(){
                        t.$viewer.update();
                        t.viewImg(event.newIndex);
                    },100);
                    t.loadSort(newObj.id,event.newIndex);
                },
                animation: 150,
            })
        },
        viewImg(index){
            this.$viewer.view(index);
        },
        // 拖拽结束
        loadSort(id,index){
            let url = '/business/clue/picture/sort';
            let ajaxData = {
                clueId:this.clueId,
                attachId:id,
                sort:index+1,
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){}
            })
        }
    },
    created() {},
    beforeMount() {},
    mounted() {
        this.unitKey = Math.floor(Math.random()*10000)+"darg";
        this.screenWidth = document.body.clientWidth;
        if(this.listData){
            this.imgData = this.listData.filter((item,index)=>{
                return item.mediaType.indexOf('image')!=-1
            })
        }else{
            this.imgData=[];
        }
    },
    updated() {},
    components: {},
    watch: {}
};
</script>
<style lang="scss">
.text-viewer-img{
    .viewer-footer{
        .viewer-navbar{
            opacity: 0;
        }
    }
}
</style>
<style scoped lang="sass">
@import "./myViewer"
</style>
