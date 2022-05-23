<template>
  <div class="transfer-tree clearfix">
    <div :class="[ 'transfer-left',{ 'transfer-full-screen':rightHide } ]">
        <div class="transfer-left-input">
            <Input search @on-change="searchUser" v-model="userKeyWord" @on-search="searchUser" placeholder="请输入人员姓名"/>
        </div>
        <div class="transfer-left-search" v-if="userRenderArr.length!=0">
            <RadioGroup 
            v-model="singleSelect" 
            style="width:100%;"
            @on-change="singleChange">
                <ul class="transfer-common-list transfer-left-render-list">
                    <li v-for="(item,index) in userRenderArr" :key="index">
                        <img :src="item.icon?item.icon:defaultIcon">
                        <div class="clearfix">
                            <span>{{item.title}}</span>
                            <Checkbox v-model="item.checked" v-if="!single" class="transfer-single-checkbox" @on-change="checkClick(item)">
                                <span></span>
                            </Checkbox>
                            <Radio v-if="single" :label="item.nodeKey" class="transfer-single-checkbox">
                                <span></span>
                            </Radio>
                        </div>
                    </li>
                </ul>
            </RadioGroup>
        </div>
        <RadioGroup 
            v-model="singleSelect" 
            style="width:100%;"
            @on-change="singleChange">
            <Tree 
                v-if="departArr.length!=0"
                ref="tree" 
                class="transfer-left-tree"
                v-show="userRenderArr.length==0"
                :data="departArr" 
                @on-check-change="checkFunc" 
                :show-checkbox="single?false:true" 
                :render="renderContent">
            </Tree>
        </RadioGroup>
    </div>
    <div class="transfer-right" v-if="!rightHide">
        <div class="transfer-right-summary">
            <p>已选择<span class="transfer-right-summary-text">{{selectIdArr.length}}</span>个联系人</p>
        </div>
        <ul class="transfer-common-list">
            <li v-for="(item,index) in selectObjArr" :key="index">
                <img :src="item.icon?item.icon:defaultIcon">
                <div class="clearfix">
                    <span>{{common.cutString(item.title,9)}}</span>
                    <i class="icon-down-01 transfer-delete-icon" @click="handleCheck(item.id,false)"></i>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
import styles from "./../../../assets/globalStyle.scss";
import defaultIcon from "@/assets/images/card-02.png";
export default {
    data() {
        return {
            departArr:[],         // 树形结构数据 
            selectObjArr:[],      // 已勾选的obj数组
            selectIdArr:[],       // 已勾选的id数组
            userKeyWord:"",       // 搜索关键字
            userArr:[],           // 所有用户的数组
            userRenderArr:[],     // 渲染搜索的数组
            userRenderIdArr:[],   // 渲染搜索的数组
            globalMainColor:styles.globalMainColor,
            singleSelect:"",
            defaultIcon:defaultIcon,
            isShowTree:true
        };
    },
    props: ["rightHide","single","defaultData","disabledList"],       // rightHide是否隐藏右边的已选列表框 singles是否单选 defaultData默认值单选多选都是传数组
    methods: {
        // 获取部门人员数据
        getData(){
            let url = "/base/mgmt-users/organization";
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.originalArr = [JSON.parse(JSON.stringify(res.data))];
                    this.checkIsPerson([res.data]);
                }
            })
        },
        // 返回数组做处理
        checkIsPerson(orginArr){
            if(!orginArr){return}
            orginArr.forEach((item,index)=>{
                item.title = item.name;
                item.expand = item.open;
                if(item.isUser){
                    if(this.defaultDataArr){               //如果有默认值则渲染默认值
                        this.defaultDataArr.forEach((defaultItem,defaultIndex)=>{
                            if(defaultItem == item.id){
                                if(this.single){
                                    this.singleSelect = defaultItem;
                                }else{
                                    item.checked = true;
                                }
                                if(this.selectIdArr.indexOf(item.id)==-1){
                                    this.selectIdArr.push(defaultItem+"");
                                    this.selectObjArr.push(item);
                                }
                                return
                            }
                        })
                    }
                    if(this.disabledList){
                        this.disabledList.forEach((disabledItem,disabledIndex)=>{
                            if(disabledItem == item.id){
                                item.disableCheckbox = true;
                                item.disabled = true;
                                return
                            }
                        })
                    }
                    this.userArr.push(item);
                    return
                }
                if(item.userList){
                    if(!item.children){item.children=[]}
                    let childrenArr = []
                    item.userList.forEach((itemChild,indexChild)=>{
                        itemChild.isUser = true;
                        itemChild.parentId = item.id;
                        childrenArr.push(itemChild);
                    })
                    item.children = childrenArr.concat(item.children);
                }
                if(item.children && item.children.length!=0){
                    this.checkIsPerson(item.children);
                }
                if(item.parentId==0){
                    this.departArr.push(item);
                }
            })
        },
        // 树形渲染数据方法
        renderContent(h, { root, node, data }) {
            let parentId = (data.parentId || data.parentId!=0) ? data.parentId : "";
            let firstTextStyle = {
                fontSize:"13px",
                lineHeight:"30px"
            }
            let firstBigIcon = h("div",{
                                    style:{
                                        background:this.globalMainColor,
                                        width:"30px",
                                        height:"30px",
                                        textAlign:"center",
                                        display:"inline-block",
                                        marginRight:"10px",
                                        verticalAlign:"middle"
                                    }
                                },[
                                    h("i",{
                                        attrs:{ 
                                            class:["icon-market-01"]
                                         },
                                        style:{ 
                                            color:"#fff", 
                                            fontSize:"18px",
                                            lineHeight:"30px"
                                        }
                                    })
                                ]);
            let iconDom = h("Icon", {
                            props: {
                                type:"ios-folder",
                                size:"18"
                            },
                            style: {
                                marginRight:"8px",
                                color:this.globalMainColor
                            }
                        });
            let imgDom = h("img", {
                            attrs: {
                                src:data.icon?data.icon:defaultIcon
                            },
                            style: {
                                width:"24px",
                                height:"24px",
                                verticalAlign:"middle",
                                marginRight:"8px",
                                marginLeft:"18px"
                            }
                        });
            let radioBoxDom = h("Radio", {
                                props: {
                                    label:node.nodeKey
                                },
                                attrs:{
                                    disabled:data.disabled
                                },
                                style: {
                                   float:"right",
                                   marginRight:"-20px"
                                }
                            },[h("span","")]);
            let contentBox = h("div",{
                                style: {
                                    paddingRight:"20px",
                                    lineHeight:"24px"
                                }
                            }, 
                            [   
                                parentId==0?firstBigIcon:(data.isUser?imgDom:iconDom),
                                h("span",{
                                    attrs:{
                                        title:data.title
                                    },
                                    style:parentId==0?firstTextStyle:{}
                                }, this.common.cutString(data.title,9)),
                                (data.isUser && this.single)?radioBoxDom:"",
                            ]) 
            return h("div",{
                    style: {
                        display: "inline-block",
                        width: "100%",
                        marginLeft: data.isUser?"-16px":0
                    }
                    },[contentBox]
            );
        },
        // 组件勾选方法
        checkFunc(arr,currentItem){
            let id = currentItem.id;
            if(!currentItem.isUser){
                this.pickUser(currentItem.children,currentItem.checked);
                return
            }
            if(currentItem.checked){
                if(this.selectIdArr.indexOf(id)==-1){
                    this.selectIdArr.push(id);
                    this.selectObjArr.push(currentItem);
                    this.defaultDataArr.push(id);
                }
                this.userArr.forEach((item,index)=>{
                    if(currentItem.id == item.id && item.nodeKey != currentItem.nodeKey && !item.checked){
                        this.$refs.tree.handleCheck({checked:true,nodeKey:item.nodeKey});
                    }
                })
            }else{
                let siteIndex = this.selectIdArr.indexOf(id);
                if(siteIndex==-1){return}
                this.selectIdArr.splice(siteIndex,1);
                this.selectObjArr.splice(siteIndex,1);
                for(let i=0;i<this.defaultDataArr.length;i++){
                    if(this.defaultDataArr[i]==id){
                        this.defaultDataArr.splice(i,1);
                        break;
                    }
                }
                this.userArr.forEach((item,index)=>{
                    if(currentItem.id == item.id && item.nodeKey != currentItem.nodeKey && item.checked){
                        this.$refs.tree.handleCheck({checked:false,nodeKey:item.nodeKey});
                    }
                })
            }
        },
        // 找到数组中的员工
        pickUser(arr,bool){
            if(!arr){return}
            arr.forEach((item,index)=>{
                let siteIndex = this.selectIdArr.indexOf(item.id);
                if(this.disabledList && this.disabledList.indexOf(item.id) != -1){
                    this.handleCheck(item.id,false);
                    return
                }
                if(!item.isUser){
                    this.pickUser(item.children,bool);
                    return
                }
                if(bool){   //添加
                    if(siteIndex == -1){
                        this.selectIdArr.push(item.id);
                        this.selectObjArr.push(item);
                    }
                    this.userArr.forEach((userItem,userIndex)=>{
                        if(item.id == item.id && userItem.nodeKey != item.nodeKey && !userItem.checked){
                            this.$refs.tree.handleCheck({checked:true,nodeKey:item.nodeKey});
                        }
                    })
                }else{      //删除
                    if(siteIndex != -1){
                        this.selectIdArr.splice(siteIndex,1);
                        this.selectObjArr.splice(siteIndex,1);
                    }
                    this.userArr.forEach((userItem,index)=>{
                        if(item.id == userItem.id && userItem.nodeKey != item.nodeKey && userItem.checked){
                            this.$refs.tree.handleCheck({checked:false,nodeKey:item.nodeKey});
                        }
                    })
                }
            })
        },
        // 手动触发勾选
        handleCheck(id,bool,nodeKey){
            let isSelectArr = this.$refs.tree.getCheckedNodes();
            if(this.single){
                if(bool){
                    this.singleSelect = id;
                }else{
                    this.clearSelect();
                }
                return
            }

            if(bool){
                this.$refs.tree.handleCheck({checked:bool,nodeKey:nodeKey})
            }else{
                isSelectArr.forEach((item,index)=>{
                    if(item.id == id){
                        this.$refs.tree.handleCheck({checked:bool,nodeKey:item.nodeKey})
                    }
                })
            }
        },
        // 搜索框回调
        searchUser(){
            this.userRenderArr = [];
            this.userRenderIdArr = [];
            if(this.userKeyWord){
                this.userArr.forEach((item,index)=>{
                    if(item.name.indexOf(this.userKeyWord)!=-1 && this.userRenderIdArr.indexOf(item.id)==-1){
                        this.userRenderIdArr.push(item.id);
                        this.userRenderArr.push(item);
                    }
                });
            }
        },
        // 搜索列表checkbox点击
        checkClick(obj){
            if(obj.checked){
                this.handleCheck(obj.id,true,obj.nodeKey);
            }else{
                this.handleCheck(obj.id,false);
            }
        },
        // 获取所选的参数
        returnValue(){
            let data = this.selectObjArr.concat();
            if(this.single){
                this.$emit("getValue",data[0]);
            }else{
                this.$emit("getValue",data);
            }
        },
        // 单选时得到的数据
        singleChange(data){
            this.selectIdArr = [];
            this.selectObjArr = [];
            this.userArr.forEach((item,index)=>{
                if(item.nodeKey == data){
                    this.selectObjArr.push(item);
                    this.selectIdArr.push(data);
                }
            })
        },
        // 清除所选的对象
        clearSelect(){
            if(this.single){
                this.singleSelect = "";
                this.selectObjArr = [];
                this.selectIdArr = [];
            }else{
                this.$refs.tree.handleCheck({checked:false,nodeKey:this.departArr[0].nodeKey});
            }
        },
        // 清除某个对象
        clearOneSelect(id){
            this.handleCheck(id,false);
        }
    },
    created() {},
    beforeMount() {
        this.getData();
    },
    mounted() {
    },
    updated() {},
    components: {},
    computed:{
        defaultDataArr(){
            if(!this.defaultData){return []}
            return this.defaultData.map((item,index)=>{
                return item
            })
        }
    },
    watch: {
        selectIdArr(newVal,oldVal){
            this.returnValue();
        },
        disabledList:{
            deep:true,
            handler(newVal,oldVal){
                this.departArr = [];
                this.userArr = [];
                if(this.defaultData.length!=0){
                    this.selectObjArr = [];
                    this.selectIdArr = [];
                }
                if(this.originalArr){
                    let copyData = JSON.parse(JSON.stringify(this.originalArr));
                    this.checkIsPerson(copyData);
                }
            }
        }
    }
};
</script>
<style scoped lang="sass">
@import "./transgerTree" 
</style>
<style lang="scss">
.transfer-tree .transfer-left .transfer-left-tree{
    .ivu-checkbox-wrapper{
        margin-right:0px;
        position:absolute;
        right:0px;
        top:3px;
    }
}
.transfer-tree .transfer-left-tree ul{
    li{
        position: relative;
    }
}
.transfer-tree .transfer-left-tree>ul{
    >li{
        &:first-child{
            >span.ivu-tree-arrow{
                display: none;
            }
        }
    }
}
.transfer-left-render-list .ivu-checkbox-wrapper{
    margin-right: 0;
}
.transfer-tree .ivu-tree-title{
    width:100%;
}
</style>