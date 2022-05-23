<template>
    <Menu active-name="1-2" width="auto">
        <!-- 左侧菜单展开时 -->
        <menu-show v-if="!isCollapsed" :menuList="menuList" ref="menuShow"></menu-show>
        <!-- 左侧菜单收缩时 -->
        <menu-hide v-if="isCollapsed" :menuList="menuList"></menu-hide>
    </Menu>
</template>
<script>
    import MenuShow from "./../menuShow/menuShow.vue";
    import MenuHide from "./../menuHide/menuHide.vue";
    export default {
    data () {
    return {
    
    }
    },
    props: ['isCollapsed'],
    methods: {

    },
    computed: {
        menuList(){
            return this.$store.getters.changeMenu;
        }
    },
    created(){

    },
    beforeMount(){
        
    },
    mounted(){

    },
    updated(){
    },
    components: {
        MenuHide,
        MenuShow
    },
    watch: {
    
    }
   }
</script>
<style lang="sass" scoped>
 @import './siderMenu.scss'
</style>
