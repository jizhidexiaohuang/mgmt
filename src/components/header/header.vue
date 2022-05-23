<template>
    <Header :style="{position: 'absolute', top:0, width: '100%',minWidth: '1024px'}">
        <!-- 切换按钮 -->
        <div :class="[!isCollapsed?'logo-large-icon':'logo-small-icon']">
            <div v-show="!isCollapsed" class="fl logo-div">
                <img :src="imgLogo" key="max-logo" />
                <p>安盾管理平台</p>
            </div>
            <div v-show="isCollapsed" class="fl logo-div">
                <img :src="imgLogo" key="min-logo" />
            </div>
        </div>
        <!-- navbar -->
        <div :class="[!isCollapsed?'navbar':'navbar-toggle']">
            <span @click="collapsedSider">
                <Icon class="toggle-tap" type="md-menu" size="18"></Icon>
            </span>
            <router-link to="/home" tag="span" :class="routerParentMenu=='home:-'?'active':''">工作台</router-link>

            <div v-if="headerCtrl">
                <router-link v-for="(menu,index) in menuList" :key="index"
                    v-modulesPermission="[menu.code]" 
                    :to="routerLinkTo(menu.code)" tag="span" 
                    :class="routerParentMenu==menu.code?'active':''">{{menu.name}}</router-link>
                    
                <!-- <router-link v-modulesPermission="['market-center:-']" :to="routerLinkTo('market-center:-')" tag="span" :class="routerParentMenu=='market-center:-'?'active':''">市场中心</router-link>
                <router-link v-modulesPermission="['product-center:-']" :to="routerLinkTo('product-center:-')" :class="routerParentMenu=='product-center:-'?'active':''" tag="span">产品中心</router-link>
                <router-link v-modulesPermission="['cooperation:-']" :to="routerLinkTo('cooperation:-')" tag="span" :class="routerParentMenu=='cooperation:-'?'active':''">合作团队</router-link>
                <router-link v-modulesPermission="['project:-']" :to="routerLinkTo('project:-')" :class="routerParentMenu=='project:-'?'active':''" tag="span">项目管理</router-link>
                <router-link v-modulesPermission="['clue:-']" :to="routerLinkTo('clue:-')" :class="routerParentMenu=='clue:-'?'active':''" tag="span">线索管理</router-link>
                <router-link v-modulesPermission="['case:-']" :to="routerLinkTo('case:-')" tag="span" :class="routerParentMenu=='case:-'?'active':''">案件管理</router-link>
                <router-link v-modulesPermission="['system:-']" :to="routerLinkTo('system:-')" tag="span" :class="routerParentMenu=='system:-'?'active':''">系统设置</router-link>
                <router-link v-modulesPermission="['trading-center:-']" :to="routerLinkTo('trading-center:-')" tag="span" :class="routerParentMenu=='trading-center:-'?'active':''">交易中心</router-link> -->

                <!-- <router-link v-modulesPermission="['contract:-']" :to="routerLinkTo('contract:-')" tag="span" :class="routerParentMenu=='contract:-'?'active':''">合同管理</router-link> -->
                <!-- <span @click="hideOrShow('project')" :class="router.indexOf('project')>-1?'active':''">
                    项目中心
                    <div class="inside-menu-tab" v-if="taskCtrl" style="width:180px;">
                        <router-link to="/project/protectionFile/protectionList" tag="div">
                            <Icon type="ios-locate-outline" size="24"/>
                            <h5>维权档案</h5>
                        </router-link>
                        <router-link to="/project/projectManage/myDuty" tag="div">
                            <Icon type="ios-bookmark-outline" size="24"/>
                            <h5>项目管理</h5>
                        </router-link>
                    </div>
                </span>
                <span @click="hideOrShow('case')" :class="router.indexOf('case')>-1?'active':''">
                    调查中心
                    <div class="inside-menu-tab" v-if="caseCtrl" style="width:270px;">
                        <router-link to="/case/clueDiscovery/myManageTask" tag="div">
                            <Icon type="ios-locate-outline" size="24"/>
                            <h5>线索发现</h5>
                        </router-link>
                        <router-link to="/case/propertyCase/publishedCase" tag="div">
                            <Icon type="ios-bookmark-outline" size="24"/>
                            <h5>知产案件</h5>
                        </router-link>
                        <router-link to="/case/transactionCase/unconfirmCase" tag="div">
                            <Icon type="ios-bookmark-outline" size="24"/>
                            <h5>案件交易</h5>
                        </router-link>
                    </div>
                </span> -->
            </div>
        </div>
        <!-- 通知、中英文、个人中心 -->
        <!-- 个人中心 -->
        <div class="header-right">
            <span :class="[infoCtrl?'active':'','head-img-box']" @click="hideOrShow('info')">
                <img :src="avatarSrc" alt="" :title="name">
                <Card class="more-router" v-show="infoCtrl" :padding="0">
                    <Col class="info-box">
                        <img class="head-img" :src="avatarSrc">
                        <p>{{name}}</p>
                        <!-- <p class="small-p">开发人员特派律师事务所</p> -->
                    </Col>
                    <Col class="info-btn-box">
                        <Button disabled>个人中心</Button>
                        <Button>修改密码</Button>
                        <Button @click="$router.push({path:'/login'});">退出</Button>
                    </Col>
                </Card>
            </span>
        </div>
    </Header>
</template>
<script>
import store from '@/store/store.js'
   export default {
     data () {
       return {
           isCollapsed:false,
           taskCtrl:false,
           caseCtrl:false,
           infoCtrl:false,
           imgLogo:require('@/assets/images/logoComputer.png'),
           avatarSrc:require('@/assets/images/jzdxh.jpg'),
           name:'',
           headerCtrl:false,
           menuList:[] //菜单list
       }
     },
     directives:{
        modulesPermission:{
            inserted:function(el,binding,vnode){
                const { value } = binding
                const menuJson = store.state.permission && store.state.permission.roles
                const headerBarList = Object.keys(menuJson)
                if (value && value instanceof Array && value.length > 0) {
                    const permissionRoles = value
                    const hasPermission = headerBarList.some(role => {
                        return permissionRoles.includes(role)
                    })
                    if (!hasPermission) {
                        el.parentNode && el.parentNode.removeChild(el)
                    }
                }else{
                    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
                }
            }
        }
     },
     props: [''],
     methods: {
        collapsedSider () {
            this.isCollapsed = !this.isCollapsed;
            this.$store.commit("toggleCollapsed",this.isCollapsed);
        },
        //控制路由
        getMenu(val){
            let menu = store.state.permission.roles;
            this.$store.commit('changeMenu',menu[val]);
        },
        hideOrShow(type){
            if(type === "project"){
                this.taskCtrl = !this.taskCtrl;
                this.caseCtrl = false;
                this.infoCtrl = false;
            }else if(type === "case"){
                this.caseCtrl = !this.caseCtrl;
                this.taskCtrl = false;
                this.infoCtrl = false;
            }else if(type === "info"){
                this.infoCtrl = !this.infoCtrl;
                this.taskCtrl = false;
                this.caseCtrl = false;
            }
        },
        routerLinkTo(val){
            let menuJson = store.state.permission && store.state.permission.roles;
            if(menuJson[val]){
                if(!menuJson[val][0]['hasChildList']){
                    return menuJson[val][0]['href']
                }else if(menuJson[val][0]['hasChildList']){
                    return menuJson[val][0]['childList'][0]['href']
                }
            }else{
                return ''
            }
        }
     },
     created(){

     },
     beforeMount(){
        if(window.localStorage.getItem('account')){
            this.name = JSON.parse(window.localStorage.getItem('account')).name;
        }
     },
     mounted(){
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)){
                this.taskCtrl = false;
                this.caseCtrl = false;
                this.infoCtrl = false;
            }
        })
        if(Object.keys(this.menuJson).length!==0){
            this.menuList = store.state.permission && store.state.permission.menu;
            this.headerCtrl = true;
        }
     },
     updated(){

     },
     components: {

     },
    computed:{
        routerParentMenu(){
            this.getMenu(this.$route.meta.parentMenu);
            return this.$route.meta.parentMenu;
        },
        menuJson(){
            return this.$store.state.permission.roles;
        },
    },
    watch:{
        // 'this.$route.meta.parentMenu': {
        //     handler(val) {
        //         console.log(val)
        //     },
        //     immediate: true,
        //     deep: true
        // }
        menuJson:{
            deep:true,
            handler(newVal,oldVal){
                if(newVal){
                    this.menuList = store.state.permission && store.state.permission.menu;
                    this.headerCtrl = true;
                }
            }
        }
    }
   }
</script>
<style lang="sass" scoped>
 @import './header.scss';
</style>
<style lang="scss">
    .notice-tips .ivu-cell-arrow {
        right: 5px;
    }
    .notice-tips .ivu-cell-title {
        line-height: normal;
    }
    .ivu-cell-title {
        line-height: 24px;
        font-size: 14px;
    }
    .notice-tips:last-child {
        border: none;
    }
    .more-router {
        z-index: 1;
        .ivu-card-head {
            padding: 7px 10px;
        }
        .ivu-scroll-loader:first-child {
            display: none;
        }
        .ivu-spin-text {
            i {
                opacity: 0;
            }
        }
    }
</style>