<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="8">退款确认单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tl" colspan="8">单号：{{defaultData.code || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="6">案件信息</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>案件编号</td>
                            <td>公证书编号</td>
                            <td>店铺名称</td>
                            <td>法人信息</td>
                            <td>工商主体信息</td>
                            <td>生产商</td>
                            <td>服务费</td>
                            <td>公证费</td>
                        </tr>
                        <tr v-for="item in defaultData.casePurchaseRefundDetailList" :key="item.code">
                            <td>{{item.caseCode}}</td>
                            <td>{{item.certificateNo}}</td>
                            <td>{{item.storeName}}</td>
                            <td>{{item.legalRepresentative}}</td>
                            <td>{{item.sellerName}}</td>
                            <td>{{item.manufacturerName}}</td>
                            <td>{{common.formateNumber(item.totalServiceAmount)}}</td>
                            <td>{{common.formateNumber(item.totalEvidAmount)}}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="tr">合计：</td>
                            <td>{{common.formateNumber(defaultData.totalServiceAmount)}}</td>
                            <td>{{common.formateNumber(defaultData.totalEvidAmount)}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="8">结算备注：{{defaultData.remark}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="4">
                                <div class="fix-height">甲方（安盾印戳）：</div>
                                <div>时间：</div>
                            </td>
                            <td class="tl" colspan="4">
                                <div class="fix-height">乙方（律师印戳）：</div>
                                <div>时间：</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="4">制单日期：</td>
                            <td class="tl" colspan="4">制单人：</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tc btn-box" v-if="printStyle">
                <Button type="primary" @click="printPage">打印</Button>
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
    props: ['defaultData'],
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
@import "./../refundDetail.scss";
.print-box{
    padding:10px 40px;
    position: inherit;
}
.close-icon{
    position: absolute;
    right: 10px;
    top:10px;
    font-size: 20px;
    color: #999;
    cursor: pointer;
}
</style>
