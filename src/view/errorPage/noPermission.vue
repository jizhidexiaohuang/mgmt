<template>
    <div class="error-page-box">
        <div class="error-img-box">
            <img src="./../../assets/images/404.png" alt="">
            <p>抱歉，你无权访问该页面</p>
        </div>
        <div class="back-btn">
            <Button type="primary" to="/home">返回首页</Button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props: [''],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./errorPage.scss";
</style>
