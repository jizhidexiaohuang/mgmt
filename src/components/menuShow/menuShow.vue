<template>
    <Menu ref="leftMenu" width="auto" :replace="true" :active-name="menu.active" :theme="layout.theme2" :open-names="menu.open" :accordion="true">
        <!-- <div v-if="btnCtrl.indexOf('clueDiscovery')>-1?true:false">
            <clue-btn></clue-btn>
        </div>
        <div v-if="btnCtrl.indexOf('protectionFile')>-1?true:false">
            <protect-file-btn></protect-file-btn>
        </div>
        <div v-if="btnCtrl.indexOf('projectManage')>-1?true:false">
            <add-project-btn></add-project-btn>
        </div> -->
        <template v-for="item in menuList">
            <MenuItem :name="item.href" :to="item.href" v-if="!!!item.hasChildList" :key="item.id">
                <span class="layout-text" :key="item.id">
                    <i :class="item.menuLogo" :style="[{'fontSize':'14px'}]"></i>
                    {{ item.name }}
                    <Badge :count="$store.state[item.hasBadge]" v-if="item.hasBadge" class-name="badge-style"></Badge>
                </span>
            </MenuItem>
            <Submenu v-if="!!item.hasChildList" :name="item.name" :key="item.id">
                <template slot="title">
                    <span class="layout-text">
                        <i :class="item.menuLogo" :style="[{'fontSize':'14px'}]"></i>
                        {{ item.name }}
                    </span>
                </template>
                <template v-for="list in item.childList">
                    <MenuItem :name="list.href" v-if="!!!list.hasChildList" :to="list.href" :key="list.id">
                        <span class="layout-text">
                            {{ list.name }}
                            <Badge :count="$store.state[list.hasBadge]" v-if="list.hasBadge" class-name="badge-style"></Badge>
                        </span>
                    </MenuItem>
                    <Submenu v-if="!!list.hasChildList" :name="item.name" :key="list.id">
                        <template slot="title">
                            {{ list.name }}
                        </template>
                        <MenuItem :name="third.href" v-for="third in list.childList" :to="third.href" :key="third.id">{{ third.name }}</MenuItem>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>
<script>
// import clueBtn from '@/view/case/clueDiscovery/clueBtn/clueBtn';
// import protectFileBtn from '@/view/project/protectionFile/protectFileBtn/protectFileBtn';
// import addProjectBtn from '@/view/project/projectManage/addProjectBtn/addProjectBtn';
export default {
    props: ['menuList'],
    data () {
        return {
            collapsed:false,
            menu: {
                open: [this.$route.matched[0].name],//展开的 Submenu 的 name 集合
                active: this.$route.path,//激活菜单的 name 值
            },
            layout:{
                theme2: 'light',//菜单主题
            },
            btnCtrl:''
        }
    },
    computed: {
        openTagMenu(){
            return this.$store.getters.openTagMenu;
        }
    },
    methods: {
        /* 激活菜单 */
        fnMenuChange () {
            this.menu.open = [];
            this.$route.matched.forEach((item,index) => {
                if(index <= this.$route.matched.length-1){
                    this.menu.open.push(item.name);
                }
            })
            let n = this.nthIndexOf(this.$route.path,'/',3);
            if(n>0){
                this.menu.active = this.$route.path.slice(0,n);
            }else{
                this.menu.active = this.$route.path;
            }
            console.log(this.menu.active)
            this.$nextTick(function() {
                this.$refs.leftMenu.updateOpened();//手动更新展开的子目录
                this.$refs.leftMenu.updateActiveName();//手动更新当前选择项
            });
        },
        nthIndexOf(str,c,n){
            var x=str.indexOf(c);
            for(var i=0;i<n;i++){
                x=str.indexOf(c,x+1);
            }
            return x;
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
    mounted: function () {
        this.btnCtrl = this.$route.path;
        this.fnMenuChange();
        // console.log(this.menuList)
    },
    components:{
        // clueBtn,
        // protectFileBtn,
        // addProjectBtn
    },
    watch: {
        $route(to, from) {
            // console.log(to)
            this.btnCtrl = to.fullPath;
            this.addItem();
            this.fnMenuChange();
        },
    }
}
</script>
<style lang="scss" scoped>
.layout-text{
    i{
        margin-right: 8px;
    }
    display: inline-block;
    width:123px;
}
</style>

<style>
    .ivu-menu {
        font-size: 12px;
    }
    .ivu-menu-item {
        font-size: 12px;
    }
    .ivu-menu-vertical .ivu-menu-item,
    .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 14px 20px;
    }
    .ivu-menu-vertical .ivu-menu-submenu-title-icon {
        margin-right: 0px;
    }
</style>