<template>
    <div class="error-page-box">
        <div class="error-img-box">
            <img src="./../../assets/images/500.png" alt="">
            <p>抱歉，服务器出错啦~</p>
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
