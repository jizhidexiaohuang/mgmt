<template>
    <div>
        <Row class="title">付款信息</Row>
        <Row class="expand-row" v-for="(item,index) in row" :key="item.id">
            <Col span="5">
                <span class="expand-key">{{index+1}}. 付款批次:</span>
                <span class="expand-value code-span" @click="checkPaymentBatch(item.id)">{{item.code}}</span>
            </Col>
            <Col span="3">
                <span class="expand-key">总价: </span>
                <span class="expand-value">{{common.formateNumber(item.saleFee)}}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">已支付金额: </span>
                <span class="expand-value">{{common.formateNumber(item.amount)}}</span>
            </Col>
            <Col span="4">
                <span class="expand-key">支付方式: </span>
                <span class="expand-value">{{item.payModeName}}</span>
            </Col>
            <Col span="4" v-if="item.payMode=='offline'">
                <span class="expand-key">批次状态: </span>
                <span class="expand-value">{{item.auditStateName}}</span>
            </Col>
            <Col span="4" v-if="item.payMode=='offline'">
                <span class="expand-key check-voucher" @click="checkVoucher(item.id)">查看凭证</span>
            </Col>
        </Row>

        <!-- 查看凭证 -->
        <Modal
            v-model="voucherCtrl"
            title="查看凭证"
            :width="450"
            :footer-hide="true">
            <voucher-detail v-if="voucherCtrl" :voucherId="voucherId" @refresh="closeVoucher"></voucher-detail>
        </Modal>
    </div>
</template>
<script>
import voucherDetail from './voucherDetail.vue';
export default {
    data () {
        return {
            voucherCtrl:false,
            voucherId:'',
        }
    },
    props:{
        row: Object|Array
    },
    methods: {
        // 查看付款凭证
        checkVoucher(id){
            this.voucherId = id;
            this.voucherCtrl = true;
        },
        // 查看付款批次
        checkPaymentBatch(id){
            this.$emit('checkOrderInfo',id);
        },
        closeVoucher(){
            this.voucherCtrl = false;
            this.$emit('reloadList')
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {voucherDetail},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
 .title{
     line-height: 24px;
 }
 .expand-row{
     line-height: 30px;
 }
 .check-voucher{
     cursor: pointer;
     color:$globalMainColor;
 }
 .code-span{
     color:$globalMainColor;
     cursor: pointer;
 }
</style>
