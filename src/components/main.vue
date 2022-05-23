<template>
    <Layout style="height: 100%" class="main">
        <Header></Header>
        <Sider v-show="router!=='/developing' && router!=='/home' && router!=='/500' && router!=='/404'" hide-trigger collapsible :width="185" :collapsed-width="50" v-model="isCollapsed" class="left-sider" :style="{overflow: 'hidden'}">
            <sider-menu :isCollapsed="isCollapsed"></sider-menu>  
        </Sider>
        <Content :style="{height:'100%',background:'#F4F5F9',padding:'47px 15px 0px 15px',position:'relative'}" v-if="headerCtrl">
            <!-- 页签 -->
            <div class="header-tab">
                <ul class="header-tab-ul">
                    <li v-for="(item,index) in maxTagMenuArr" :key="index" 
                        :style="{paddingLeft:padding+'px',paddingRight:padding+'px'}"
                        @contextmenu.prevent="contextMenu(item, $event)"
                        :class="[item.path==menu.currentPageName?'active':'text-over']" @click="choseTab(item.path)">
                        <span>{{item.name}}</span>&nbsp;<Icon v-if="item.path==menu.currentPageName" type="md-close" class="close-tab" @click.stop="deleteItem(item)" />
                    </li>
                </ul>
                <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px',width:'80px'}" class="contextmenu">
                    <li v-for="(item, key) of rightClickEvent" @click="handleTagsOption(key)" :key="key">{{item}}</li>
                </ul>
            </div>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </Content>
    </Layout>
</template>
<script>
    import Header from './header/header.vue';
    import siderMenu from './siderMenu/siderMenu.vue'
    export default {
    data () {
       return {
            tabCtrl:2,
            list:[0,1,2,3,4,5,6,7,8,9,10],
            menu: {
                currentPageName: this.$route.fullPath,//页签样式显示的标识
                tagMenuPathArr:[],//保存页签,防止重复
                tagMenuArr:[],//遍历该数组生成页签
            },
            rightClickEvent: {
                others: '关闭其他',
                all: '关闭所有'
            },
            contextMenuLeft: 0,
            contextMenuTop: 0,
            visible: false,
            index:'',
            padding:10,
            headerCtrl:false
       }
     },
    props: [''],
    computed: {
        isCollapsed(){
            return this.$store.getters.toggleCollapsed;
        },
        router(){
            return this.$route.path;
        },
        openTagMenu(){
            return this.$store.getters.openTagMenu;
        },
        menuJson(){
            return this.$store.state.permission.menu;
        },
        maxTagMenuArr(){
            let leng = this.menu.tagMenuArr.length;
            return (leng <= 20) ? this.menu.tagMenuArr : this.menu.tagMenuArr.splice(leng -20 ,leng - 1);
        }
    },
     methods: {
        //选中item,切换路由
        choseTab(path){
            if(path!=this.$route.path){
                this.$router.push({path:path});
            }
        },
        //删除tag item,删除数组
        deleteItem(item){
            let index = this.menu.tagMenuPathArr.indexOf(item.path);
            this.menu.tagMenuPathArr.splice(index,1);
            this.menu.tagMenuArr.splice(index,1);
            this.$store.commit('openTagMenu',this.menu);
            let len = this.menu.tagMenuPathArr.length==index?(this.menu.tagMenuPathArr.length-1):index;
            if(item.path == this.$route.path){
                this.$router.push(this.menu.tagMenuPathArr[len]);
            }
            console.log(this.menu.tagMenuArr);
        },
        //右键事件
        contextMenu (item, e) {
            console.log(item)
            if (item.name === '/home') {
                return
            }
            this.visible = true;
            const offsetLeft = this.$el.getBoundingClientRect().left;
            this.contextMenuLeft = e.clientX - offsetLeft + 10;
            this.contextMenuTop = e.clientY;
            this.tempItem = item;
        },
        //关闭其他and所有
        handleTagsOption (type) {
            console.log(type)
            if (type.includes('all')) {
                // 关闭所有，除了home
                this.menu.tagMenuArr = [];
                this.menu.tagMenuPathArr = [];
                this.$router.push({path:'/'});
            } else if (type.includes('others')) {
                this.menu.tagMenuPathArr = [this.tempItem.path];
                this.menu.tagMenuArr = [];
                this.menu.tagMenuArr.push({name:this.tempItem.name,path:this.tempItem.path});
                this.$router.push(this.menu.tagMenuPathArr[0]);
            }
            this.$store.commit('openTagMenu',this.menu);
        },
        //关闭右键ul
        closeMenu () {
            this.visible = false
        },
        updateBadge(){
            // 更新菜单的徽标
            let path = this.$route.path;
            if(path.indexOf("relationship")!=-1 || path.indexOf("contract")!=-1){
                this.$store.dispatch('getOpportunitieCount');
                this.$store.dispatch('getCountWaitAuditLegal');
                this.$store.dispatch('getCountWaitAuditPresident');
            }else if(path.indexOf("cooperationTeam")!=-1){
                this.$store.dispatch('getUnauditInvestigatorCount');
                this.$store.dispatch('getUnauditLawyerCount');
                this.$store.dispatch('getUnauditLawyerAccountCount');
                this.$store.dispatch('getUnauditInvestAccountCount');
            }else if(path.indexOf("project")!=-1 || path.indexOf("agreement")!=-1){
                this.$store.dispatch('getUnauditInvestAgreementCount');
                this.$store.dispatch('getUnauditLawyerAgreementCount');
            }else if(path.indexOf("task")!=-1 || path.indexOf("clue")!=-1){
                this.$store.dispatch('getUnauditCluesCount');
                this.$store.dispatch('getMissionCount');
            }
        }
     },
    
     created(){

     },
     beforeMount(){
        
     },
     mounted(){
        // console.log(this.$route)
        if(this.$route.path=='/500'||this.$route.path=='/404'){
            this.headerCtrl = true;
        }else{
            this.menu.tagMenuPathArr.push(this.$route.path)
            this.menu.tagMenuArr.push({path:this.$route.path,name:this.$route.name})
            this.$store.commit('openTagMenu',this.menu);

            if(Object.keys(this.menuJson).length!==0){
                this.headerCtrl = true;
            }else{
                // this.headerCtrl = true;
                // this.$router.push('/home')
            }
            this.updateBadge();
        }
     },
     updated(){
     },
     components: {
        Header,
        siderMenu,
     },
     watch: {
        $route(to, from) {
            this.menu.currentPageName = to.path;
            this.menu.tagMenuPathArr = this.openTagMenu.tagMenuPathArr;
            this.menu.tagMenuArr = this.openTagMenu.tagMenuArr;
            
            this.updateBadge();
        },
        visible(value){
            if (value){
                document.body.addEventListener('click', this.closeMenu)
            }else{
                document.body.removeEventListener('click', this.closeMenu)
            }
        },
        menuJson:{
            deep:true,
            handler(newVal,oldVal){
                if(newVal){
                    this.headerCtrl = true;
                }
            }
        }
     }
   }
</script>
<style lang="scss" scoped>
@import './../assets/globalStyle.scss';
.main{
    box-sizing: border-box;
    padding-top:50px;
}
.ivu-layout-header{
    height: 50px;
    padding:0;
}
.left-sider{
    height: 100%;
}
.header-tab{
    position: absolute;
    left: 15px;
    top: 15px;
    z-index: 99;
    width:calc(100% - 30px);
    ul.header-tab-ul{
        width:auto;
        max-width:100%;
        height: 33px;
        overflow: hidden;
        border-radius: 5px 5px 0px 0px;
        display: flex;
        li{
            position: relative;
            line-height: 32px;
            height: 33px;
            font-size: 12px;
            background: #dcdee2;
            padding:0px 15px;
            border-radius: 5px 5px 0px 0px;
            cursor: pointer;
            transition: all 0.2s ease;
            border:1px solid $borderColor;
            border-bottom:none;
            border-left:none;
            &:first-child{
                border-left:1px solid $borderColor;
            }
            &.text-over{
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            &:nth-of-type(1){
                &::before{
                    display: none;
                }
            }
            &.active{
                color:$globalMainColor;
                background: #fff;
            }
           
            .close-tab{
                vertical-align: baseline;
            }
        }
    }
}
.contextmenu {
    position: fixed;
    margin: 0;
    padding: 5px 0;
    background: #fff;
    z-index: 1000;
    list-style-type: none;
    border-radius: 2px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .1);
    li {
        margin: 0;
        padding: 5px 15px;
        cursor: pointer;
        &:hover {
            background: #eee;
        }
    }
}
</style>
