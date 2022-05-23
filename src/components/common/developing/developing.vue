<template>
    <div class="waitting-page">
        <img :src="waittingSrc" alt="">
        <p>程序猿GG正在日追月赶的制作中，敬请期待...</p>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                waittingSrc:require('../../../assets/images/dev-ing.png')
            }
        },
        props: [''],

        methods: {

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

        },
        watch: {

        }
    }
</script>
<style scoped lang="scss">
 .waitting-page{
     background: #fff;
     height: 100%;
     width:100%;
     text-align: center;
     p{
         font-size: 26px;
     }
 }
</style>
