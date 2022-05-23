<template>
    <div>
        <!-- <div v-if="btnCtrl.indexOf('clueDiscovery')>-1?true:false">
            <clue-btn></clue-btn>
        </div>
        <div v-if="btnCtrl.indexOf('protectionFile')>-1?true:false">
            <protect-file-btn></protect-file-btn>
        </div>
        <div v-if="btnCtrl.indexOf('projectManage')>-1?true:false">
            <add-project-btn></add-project-btn>
        </div> -->
        <div v-for="(item,index) in menuList" :key="index">
            <Dropdown transfer placement="right-start" :key="item.id" @on-click="changeMenu">
                <div :class="['hover-icon',item.id==activeId?'selectedIcon':'']" v-if="item.childList">
                    <i :class="item.menuLogo" :style="[{'fontSize':'20px'}]"></i>
                </div>
                <DropdownMenu slot="list" v-if="item.childList">
                    <template v-for="(child,i) in item.childList">
                        <DropdownItem v-if="!!!child.hasChildList" :name="child.href" :key="child.id" :selected="child.href==$route.path"><span style="padding-left:10px;">{{ child.name }}</span></DropdownItem>
                        <Dropdown transfer placement="right-start" v-if="!!child.hasChildList">
                            <DropdownItem style="width: 200px;" :selected="child.href==$route.path">
                                <span style="padding-left:10px;">{{ child.name }}<Icon style="position: absolute; right: 15px; top: 10px;" type="ios-arrow-forward"></Icon></span>
                            </DropdownItem>
                            <DropdownMenu slot="list">
                                <template v-for="(third) in child.childList">
                                    <DropdownItem :name="third.href" :key="third.id" :selected="child.href==$route.path">
                                        <span style="padding-left:10px;">{{ third.name }}</span>
                                    </DropdownItem>
                                </template>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </DropdownMenu>
                <Tooltip transfer v-else placement="right">
                    <div :class="['hover-icon',item.id==activeId?'selectedIcon':'']">
                        <i :class="item.menuLogo" style="font-size:20px;" @click="changeMenuTool(item.href)"></i>
                    </div>
                    <div slot="content">
                        {{item.name}}
                        <Badge :count="$store.state.unauditedTask" v-if="item.hasBadge"></Badge>
                    </div>
                </Tooltip>
            </Dropdown> 
        </div>
    </div>
</template>
<script>
// import clueBtn from '../../view/case/clueDiscovery/clueBtn/clueBtn';
// import protectFileBtn from '@/view/project/protectionFile/protectFileBtn/protectFileBtn';
// import addProjectBtn from '@/view/project/projectManage/addProjectBtn/addProjectBtn';
export default {
    name: 'menuShrink',
    props: ['menuList'],
    data () {
        return {
            btnCtrl:'',
            activeId:''
        }
    },
    computed: {
        openTagMenu(){
            return this.$store.getters.openTagMenu;
        }
    },
    methods: {
        changeMenu (active) {
            this.$router.push({
                path: active
            });
        },
        changeMenuTool(href){
            this.$router.push({
                path: href
            });
        },
        getActiveId(arr,parentId){
            if(!arr){return}
            arr.forEach((item,index)=>{
                if(item.childList){
                    this.getActiveId(item.childList,item.parentId);
                }
                if(item.href && item.href == this.$route.path){
                    this.activeId = parentId?item.parentId:item.id;
                }
            })
        },
        //tag页签
        addItem(){
            let path = this.$route.fullPath;
            let name = this.$route.meta.name;
            let type = this.$route.meta.type;
            let tagMenuPathArr = this.openTagMenu.tagMenuPathArr;
            let tagMenuArr = this.openTagMenu.tagMenuArr;
            if(tagMenuPathArr.indexOf(path) == -1&&type=="菜单"){
                tagMenuArr.push({path:path,name:name});
                tagMenuPathArr.push(path);
                this.$store.commit('openTagMenu',{tagMenuArr:tagMenuArr,tagMenuPathArr:tagMenuPathArr});
            }
        },
    },
    mounted() {
        this.btnCtrl = this.$route.path;
        this.getActiveId(this.menuList);
    },
    components:{
        // clueBtn,
        // protectFileBtn,
        // addProjectBtn
    },
    watch:{
        $route(to, from) {  
            this.btnCtrl = to.fullPath;
            this.getActiveId(this.openTagMenu.menuList);
            this.addItem();
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./../../assets/globalStyle.scss";
.hover-icon{
    width:50px;
    padding:10px 0;
    text-align: center;
    cursor: pointer;
}
.selectedIcon{
    background: #dfe5ed;
    i{
        color:$globalMainColor;
    }
}
</style>

