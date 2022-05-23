<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="2">付款申请单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="defaultData.category">
                            <td style="width:50%;" v-if="defaultData.code" class="tl">编号：{{defaultData.code || ""}}</td>
                            <td style="width:50%;" class="tl">支出类目：{{defaultData.categoryName || ""}}</td>
                        </tr>
                        <tr v-else>
                            <td class="tl" colspan="2" v-if="defaultData.code">编号：{{defaultData.code || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl">申请日期：{{common.formatTime(defaultData.createTime)}}</td>
                            <td class="tl">收款账户：{{defaultData.bankUser}}</td>
                        </tr>
                        <tr>
                            <td class="tl">开户行：{{defaultData.bankName}}</td>
                            <td class="tl">开户账户：{{defaultData.cardNumber}}</td>
                        </tr>
                        <tr>
                            <td class="tl">金额：{{common.formateNumber(defaultData.amount)}}</td>
                            <td class="tl">大写金额：{{defaultData.amountInwords || common.toChinesNum(defaultData.amount)}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="2">备注：{{defaultData.remark || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl">
                                <p style="height:100px">项目审批：</p>
                            </td>
                            <td class="tl">
                                <p style="height:100px">财务审批：</p>
                            </td>
                        </tr>
                        <tr class="no-inside-border">
                            <td class="clearfix tl" colspan="2">
                                <div class="underline-box">
                                    <span>会计主管：</span>
                                </div>
                                <div class="underline-box">
                                    <span>复核：</span>
                                </div>
                                <div class="underline-box" style="border:none">
                                    <span>制单人：{{defaultData.creatorName || defaultData.applyUser}}</span>
                                </div>
                                <div class="underline-box">
                                    <span>签收人：</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tc btn-box" v-if="printStyle">
                <Button type="primary" v-if="isInfo" @click="printPage">打印</Button>
                <slot name="sumbitBtn" v-else></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            printStyle:true
        }
    },
    props:{
        defaultData:{
            type:String | Object,
        },
        isInfo:{
            type:Boolean
        },
        //付款类型
        categoryObj:{
            type:String | Object,
            default:""
        }
    },
    computed:{},
    methods: {
        printPage(){
            this.printStyle = false;
            this.$nextTick(()=>{
                this.printStyle = true;
                window.print();
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./../../../tradingCenter/buySettlement/refundDetail.scss";
.print-box{
    padding:10px 20px;
}
.mes-box{
    >p{
        margin-bottom: 5px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
.underline-box{
    width: calc(25% - 12.5px);
}
</style>
