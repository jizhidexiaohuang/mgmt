<template>
    <div>
        <Table :columns="columns" :data="data"></Table>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            columns:[
                {
                    title:"客户名称",
                    key:"name",
                    width:200,
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.contractNo
                            },
                        },params.row.name)
                    }
                },
                {
                    title:"客户性质",
                    key:"customerNatureName"
                },
                {
                    title:"区域",
                    key:"startDateStr",
                    render:(h,params)=>{
                        let str = (params.row.provinceName || "") + (params.row.cityName || "") + (params.row.areaName || "");
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.contractNo
                            }
                        },str)
                        return h("span",str);
                    }
                },
                {
                    title:"行业",
                    key:"industryName",
                },
                {
                    title:"联系人",
                    key:"contact",
                },
                {
                    title:"联系人电话",
                    key:"mobile",
                    render:(h,params)=>{
                        if(this.mobile){
                            return h('span',{
                                style:{
                                    color:styles.errorColor
                                }
                            },params.row.mobile)
                        }else{
                            return h('span',params.row.mobile)
                        }
                    }
                },
                {
                    title:"联系人邮箱",
                    key:"email",
                    render:(h,params)=>{
                        if(this.email){
                            return h('span',{
                                style:{
                                    color:styles.errorColor
                                }
                            },params.row.email)
                        }else{
                            return h('span',params.row.email)
                        }
                    }
                },
                {
                    title:"职务",
                    key:"position"
                },
                {
                    title:"来源",
                    key:"sourceName"
                }
            ],
            data:[]
        }
    },
    props: {
        id:{
            type:[Number,String]
        },
        mobile:{
            type:[Number,String],
            default(){
                return ''
            }
        },
        email:{
            type:[Number,String],
            default(){
                return ''
            }
        }
    },
    methods: {
        getConflictMes(){
            let url, ajaxData;
            if(!!this.mobile){
                url = '/base/customer-clue/mobile';
                ajaxData = {
                    email: "",
                    mobile: this.mobile,
                    userId: this.id
                }
            }else if(!!this.email){
                url = '/base/customer-clue/email';
                ajaxData = {
                    email: this.email,
                    mobile: "",
                    userId: this.id
                }
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.data = res.data;
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getConflictMes();
    },
    updated(){
    },
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
