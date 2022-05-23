<template>
    <div>
        <Row class="detail-header">
            <span>付款单信息</span>
            <slot name='operate-box'></slot>
        </Row>
        <div class="table-box">
            <table class="subject-noheader-table subject-table">
                <tbody>
                    <tr>
                        <td class="subject-table-color">付款单编号</td>
                        <td>{{defaultData.code}}</td>
                        <td class="subject-table-color">申请日期</td>
                        <td>{{common.formatTime(defaultData.createTime,1)}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">公证费账户信息</td>
                        <td>
                            <span v-if="defaultData">{{defaultData.bankUserCertificate}}-{{defaultData.bankNameCertificate}}-{{defaultData.cardNumberCertificate}}</span>
                            <span v-else>{{settlementData[0].bankUserCertificate}}--{{settlementData[0].bankNameCertificate}}--{{settlementData[0].cardNumberCertificate}}</span>
                        </td>
                        <td class="subject-table-color">服务费账户信息</td>
                        <td>
                            <span v-if="defaultData">{{defaultData.bankUserService}}-{{defaultData.bankNameService}}-{{defaultData.cardNumberService}}</span>
                            <span v-else>{{settlementData[0].bankUserService}}--{{settlementData[0].bankNameService}}--{{settlementData[0].cardNumberCertificate}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="subject-header-table subject-table" v-if="settlementData.length!=0">
                <thead>
                    <tr>
                        <th width="16.66%">结算单号</th>
                        <th width="16.66%">申请日期</th>
                        <th width="16.66%">审核通过日期</th>
                        <th width="16.66%">服务费结算金额</th>
                        <th width="16.66%">公证费结算金额</th>
                        <th width="16.66%">合计结算金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in settlementData" :key="item.code">
                        <td>{{item.code || ""}}</td>
                        <td>{{common.formatTime(item.createTime || "",1)}}</td>
                        <td>{{common.formatTime(item.auditTime || "",1)}}</td>
                        <td>{{common.formateNumber(item.totalServiceAmount || 0)}}</td>
                        <td>{{common.formateNumber(item.totalEvidAmount || 0)}}</td>
                        <td>{{common.formateNumber(item.totalAmount || 0)}}</td>
                    </tr>
                    <tr>
                        <td class="tr" colspan="3">合计：</td>
                        <td>{{common.formateNumber(totalObj.totalServiceAmount)}}</td>
                        <td>{{common.formateNumber(totalObj.totalEvidAmount)}}</td>
                        <td>{{common.formateNumber(totalObj.totalAmount)}}</td>
                    </tr>
                </tbody>
            </table>
            <table class="subject-header-table subject-table" v-if="refundData.length!=0">
                <thead>
                    <tr>
                        <th width="16.66%">退款单号</th>
                        <th width="16.66%">申请日期</th>
                        <th width="16.66%">审核通过日期</th>
                        <th width="16.66%">服务费退款金额</th>
                        <th width="16.66%">公证费退款金额</th>
                        <th width="16.66%">合计退款金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in refundData" :key="item.code">
                        <td>{{item.code || ""}}</td>
                        <td>{{common.formatTime(item.createTime || "",1)}}</td>
                        <td>{{common.formatTime(item.confirmTime || "",1)}}</td>
                        <td>{{common.formateNumber(item.totalServiceAmount || 0)}}</td>
                        <td>{{common.formateNumber(item.totalEvidAmount || 0)}}</td>
                        <td>{{common.formateNumber(item.totalAmount || 0)}}</td>
                    </tr>
                    <tr>
                        <td class="tr" colspan="3">合计：</td>
                        <td>{{common.formateNumber(totalRefundObj.totalRefundServiceAmount)}}</td>
                        <td>{{common.formateNumber(totalRefundObj.totalRefundEvidAmount)}}</td>
                        <td>{{common.formateNumber(totalRefundObj.totalRefundAmount)}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="count-div">
                应付服务费金额：<span>{{common.formateNumber(totalObj.totalServiceAmount - totalRefundObj.totalRefundServiceAmount,"")}}</span>元&nbsp;&nbsp;
                应付公证费金额：<span>{{common.formateNumber(totalObj.totalEvidAmount - totalRefundObj.totalRefundEvidAmount,"")}}</span>元&nbsp;&nbsp;
                合计支付金额： <span>{{common.formateNumber(totalAmount,"")}}</span>元
            </div>
        </div>
        <Row class="detail-header spec-header">
            <span>开票信息</span>
        </Row>
        <Row>
            <div class="bill-box">
                <p>甲方开票信息</p>
                <p>单位名称：{{invoiceData.companyName}}</p>
                <p>开户银行：{{invoiceData.bankName}}</p>
                <p>银行账户：{{invoiceData.bankAccount}}</p>
                <p>纳税人识别号：{{invoiceData.identificationNum}}</p>
            </div>
        </Row>
        <Row class="detail-header spec-header">
            <span>备注</span>
        </Row>
        <div class="bill-box">
            <div v-if="defaultData">{{defaultData.remark}}</div>
            <Form ref="formData" v-else :model="formData" :label-width="0">
                <FormItem label="" prop="remark" :rules="[{ max:500,message:'不能超过500个字符',trigger:'blur'}]">
                    <Input v-model="formData.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注(不能超过500个字符)" />
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formData:{
                remark:""
            },
            invoiceData:{}
        }
    },
    props: ['settlementData','refundData','defaultData'],
    computed:{
        totalObj(){
            let obj = {
                totalServiceAmount:0,
                totalEvidAmount:0,
                totalAmount:0
            };
            this.settlementData.forEach((item,index)=>{
                obj.totalServiceAmount += item.totalServiceAmount;
                obj.totalEvidAmount += item.totalEvidAmount;
                obj.totalAmount += item.totalAmount
            })
            return obj
        },
        totalRefundObj(){
            let obj = {
                totalRefundServiceAmount:0,
                totalRefundEvidAmount:0,
                totalRefundAmount:0
            };
            this.refundData.forEach((item,index)=>{
                obj.totalRefundServiceAmount += item.totalServiceAmount;
                obj.totalRefundEvidAmount += item.totalEvidAmount;
                obj.totalRefundAmount += item.totalAmount;
            })
            return obj
        },
        totalAmount(){
            let sum = this.totalObj.totalAmount - this.totalRefundObj.totalRefundAmount
            return sum
        }
    },
    methods: {
        getInvoice(){
            let url = '/settlement/trade/purchase/purchase-invoice'
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.invoiceData = res.data;
                }
            })
        },
        handleSumbit(){
            let url = '/settlement/trade/purchase/purchase-payment';
            let settlementIds = "",refundIds="";
            let settleArr = this.settlementData;
            let refundArr = this.refundData;
            settleArr.forEach((item,index)=>{
                settlementIds += item.id;
                if(index!=this.settlementData.length-1){
                    settlementIds += ",";
                }
            })
            refundArr.forEach((item,index)=>{
                refundIds += item.id;
                if(index!=this.refundData.length-1){
                    refundIds += ",";
                }
            })
            let ajaxData = {
                bankNameCertificate:settleArr[0].bankNameCertificate,
                bankNameService:settleArr[0].bankNameService,
                bankUserCertificate:settleArr[0].bankUserCertificate,
                bankUserService:settleArr[0].bankUserService,
                cardNumberCertificate:settleArr[0].cardNumberCertificate,
                cardNumberService:settleArr[0].cardNumberService,
                settlementIds:settlementIds,
                refundIds:refundIds,
                serviceAmount:this.totalServiceAmount,
                evidAmount:this.totalEvidAmount,
                refundServiceAmount:this.totalRefundServiceAmount,
                refundEvidAmount:this.totalRefundEvidAmount,
                payAmount:this.totalAmount,
                remark:this.formData.remark
            };
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$Message.success("操作成功!");
                            this.$emit("closeDetail");
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
    },
    created(){},
    beforeMount(){
        this.getInvoice();
        if(this.defaultData){
            this.formData.remark = this.defaultData.remark;
        }
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./refundDetail.scss";
.spec-header{
    margin:20px 0 10px 0;
}
.bill-box{
    border:1px solid #ECECEE;
    padding:20px;
    p{
        margin-bottom: 10px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
.count-div{
    padding:10px 20px;
    font-size: 14px;
    text-align: right;
    >span{
        color:#ffa43b;
    }
}
.count-span{
    color:#ffa43b;
}
</style>
