<template>
    <div class="print-box">
        <Icon class="close-modal-icon" v-if="printStyle" @click="$emit('closeModal')" type="md-close"/>
        <div class="table-box">
            <div>
                <table class="subject-header-table subject-table print-table long-table">
                    <thead>
                        <tr>
                            <th colspan="8">邮寄清单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tl" colspan="8">快递公司：{{defaultData.companyName || ""}}</td>
                        </tr>
                        <tr>
                            <td class="tl" colspan="8">快递单号：{{defaultData.courierNumber || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color" rowspan="2">案件编号</td>
                            <td class="subject-table-color" rowspan="2">对方当事人</td>
                            <td class="subject-table-color" rowspan="2">线索名称</td>
                            <td class="subject-table-color" rowspan="2">店铺名称</td>
                            <td class="subject-table-color" rowspan="2">公证书</td>
                            <td class="subject-table-color" colspan="3">是否邮寄</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">公证书</td>
                            <td class="subject-table-color">公证物</td>
                            <td class="subject-table-color">公证费发票</td>
                        </tr>
                        <tr v-for="item in defaultData.saleOrderMailingDetailList" :key="item.code">
                            <td>{{item.caseCode}}</td>
                            <td>{{item.litigantNames}}</td>
                            <td>{{item.missionName}}</td>
                            <td>{{item.storeName}}</td>
                            <td>{{item.certificateNo}}</td>
                            <td>{{item.certificateNo?"是":"否"}}</td>
                            <td>{{item.notary?"是":"否"}}</td>
                            <td>{{item.notaryInvoice?"是":"否"}}</td>
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
@import "./../buySettlement/refundDetail.scss";
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
