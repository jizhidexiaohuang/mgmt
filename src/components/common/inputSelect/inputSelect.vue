<template>
  <div style="position:relative;">
    <div @click="openTreeInput" :class="['tree-input' , {'select-drop-active':treeInputCtrl}]">
        <span v-if="!multiple">{{upperDepart}}</span>
        <span v-else>
            {{upperDepart}}
            <span class="tag" v-for="item in selectArr" :key="item.id">{{common.cutString(item.title,10)}}<Icon type="ios-close" @click.stop="deleteTag(item.id)" size="16" /></span>
        </span>
        <Icon type="ios-arrow-down" size="14" :class="['input-drow-icon' , {'input-drow':IconDrow ,'input-up':!IconDrow}]"/>
    </div>
    <transition name="input-select-fade">
        <Row class="hidden-tree" v-if="treeInputCtrl">
            <Tree 
            :data="departArr" 
            transfer 
            @on-select-change="selectTreeChange" 
            :multiple="multiple"></Tree>
        </Row>
    </transition>
  </div>
</template>
<script>
export default {
    data() {
        return {
            upperDepart: "请选择部门",         //树形控件展示文字
            treeInputCtrl: false,             //控制tree组件是否显示
            IconDrow: true,                   //下拉选择框选择展示的下拉框icon
            selectArr:[],                     //多选时已经选择的obj集合
            idArr:[],                         //多选时已经选择的id集合
            departArr:[]
        };
    },
    props: ["treeList","multiple","value"],   //treeList数据的结构请移步view官网树形控件处查看,value默认参数可以为string，可以为arr
    methods: {
        // 获取部门人员数据
        getData(){
            let url = "/base/organizations";
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.departArr = [];
                    this.checkIsPerson([res.data]);
                }
            })
        },
        // 返回数组做处理
        checkIsPerson(orginArr){
            if(!orginArr){return}
            orginArr.forEach((item,index)=>{
                item.title = this.common.cutString(item.name,15);
                item.expand = item.open;
                if(item.children && item.children.length!=0){
                    this.checkIsPerson(item.children);
                }

                if(!Array.isArray(this.value)){
                    if(item.id == this.value){
                        item.selected = true;
                        this.upperDepart = this.common.cutString(item.name,15);
                    }
                }else{
                    this.value.forEach((itemVlaue,itemIndex)=>{
                        if(item.id == itemVlaue){
                            item.selected = true;
                            this.selectArr.push(item);
                            this.idArr.push(item.id);
                        }
                    })
                }

                if(item.parentId==0){
                    this.departArr.push(item);
                }
            })
        },
        //打开树形下拉控件
        openTreeInput() {
            this.treeInputCtrl = !this.treeInputCtrl;
            this.IconDrow = !this.IconDrow;
        },
        //选择下拉控件并且返回给父组件所选值的id
        selectTreeChange(arr,currentItem) {
            let pass = true;
            if(currentItem.children && currentItem.children.length!=0){
                currentItem.children.forEach((item,index)=>{
                    if(this.idArr.indexOf(item.id)!=-1){
                        pass = false;
                        currentItem.selected = false;
                        return
                    }
                })
            }
            if(!pass){return}
            //单选则返回一个id给父组件，多选则返回一个选中数组的集合给父组件
            if (!this.multiple){
                this.upperDepart = currentItem.title;
                this.treeInputCtrl = !this.treeInputCtrl;
                this.IconDrow = !this.IconDrow;
                this.$emit("returnData", currentItem.id);
            } else {
                if(this.idArr.indexOf(currentItem.parentId)!=-1){
                    this.deleteTag(currentItem.parentId);
                }
                if (this.idArr.indexOf(currentItem.id) != -1){
                    this.deleteTag(currentItem.id);
                    return
                } else {
                    this.selectArr.push(currentItem);
                    this.idArr.push(currentItem.id);
                }
                this.$emit("returnData", this.idArr);
            }
        },
        // 单选时删除已选
        clearOnly(){
            this.upperDepart = '请选择部门'
            this.$emit("returnData", '');
        },
        //多选时删除特定的已选
        clearOne(arr,id){
            if (!id || !arr){return}
            arr.forEach((item,index)=>{
                if (item.id == id) {
                    item.selected = false;
                    return
                }
                if (item.children && item.children.length != 0) {
                    this.clearOne(item.children,id);
                }
            })
        },
        //清除已选
        clearSelect(arr) {
            if (!arr){return}
            this.selectArr = [];
            this.idArr = [];
            arr.forEach((item,index)=>{
                if (item.selected) {
                    item.selected = false;
                }
                if (item.children && item.children.length != 0) {
                    this.clearSelect(item.children);
                }
            });
            this.treeInputCtrl = false;
        },
        //多选时，删除已选
        deleteTag(id){
            if (!id){return}
            let deleteIndex;
            if(this.idArr.indexOf(id) != -1){
                deleteIndex = this.idArr.indexOf(id);
            }
            this.clearOne(this.departArr,id);
            this.selectArr.splice(deleteIndex,1);
            this.idArr.splice(deleteIndex,1);
            this.$emit("returnData", this.idArr);
        }
    },
    created() {},
    beforeMount() {},
    mounted() {
        this.getData();
        document.addEventListener('click',e => {
            if(!this.$el.contains(e.target)){
                this.treeInputCtrl = false//点击其他区域关闭
            }
        })
    },
    activated(){
        this.getData();
    },
    updated() {},
    components: {},
    watch: {
        treeList(newVal, oldVal) {
            this.clearSelect(newVal);
        },
        selectArr(newVal, oldVal){
            if(!this.multiple){return}
            if (newVal.length == 0){
                this.upperDepart="请选择部门";
            } else {
                this.upperDepart="";
            }
        }
    }
};
</script>
<style lang="sass" scoped>
@import "./inputSelect"
</style>
<style lang="scss">
.hidden-tree li{
    line-height: 18px;
}
</style>



