<template>
    <div>
        <Row style="text-align:center;margin:10px 0px 14px;">
            <table class="subject-noheader-table subject-table">
                <tr>
                    <td colspan="6" class="text-l">订单编号：{{data.orderCode}}</td>
                </tr>
                <tr>
                    <td colspan="3">案件信息</td>
                    <td colspan="3">收入明细</td>
                </tr>
                <tr>
                    <td>案件编号</td>
                    <td>所属项目</td>
                    <td>付款时间</td>
                    <td>公证费</td>
                    <td>代理费(开票金额)</td>
                    <td>总金额</td>
                </tr>
                <tr v-for="(item,index) in invoiceItemList" :key="index">
                    <td>{{item.caseCode}}</td>
                    <td>{{item.projectName}}</td>
                    <td>{{common.formatTime(item.payTime)}}</td>
                    <td style="width:130px">
                        <span v-if="operate=='info'">{{common.formateNumber(item.amountCert)}}</span>
                        <my-input v-else ref="myInput" class="num-input"
                            appendText="￥" 
                            :defaultData="item.amountCert"
                            :toFixed="2"
                            @getValue="getInputValue($event,index)"
                        ></my-input>
                        
                    </td>
                    <td>{{common.formateNumber(item.amount-item.amountCert)}}</td>
                    <td>{{common.formateNumber(item.amount)}}</td>
                </tr>
                <tr>
                    <td colspan="3" class="text-r">合计：</td>
                    <td>{{common.formateNumber(amountCertTotal)}}</td>
                    <td>{{common.formateNumber(amountTotal-amountCertTotal)}}</td>
                    <td>{{common.formateNumber(amountTotal)}}</td>
                </tr>
                <tr>
                    <td colspan="6" class="text-l">
                        <Row style="line-height:30px">
                            <p>单位名称：{{data.companyName}}</p>
                            <p>开户银行：{{data.bankName}}</p>
                            <p>银行账号：{{data.bankAccount}}</p>
                            <p>纳税人识别号：{{data.identificationNum}}</p>
                        </Row>
                    </td>
                </tr>
            </table>
            <Row style="margin-top:10px;" v-if="printStyle">
                <span v-if="operate!='info'">
                    <Button type="primary" style="margin-right: 8px" @click="billingSubmit('N')">保存开票申请</Button>
                    <Button type="primary" style="margin-right: 8px" @click="billingSubmit('Y')">确认开票完成</Button>
                </span>
                <Button type="primary" style="margin-right: 8px" @click="printInfo">打印</Button>
                <Button type="primary" style="margin-right: 8px" v-if="invoiceId" @click="downloadInfo">导出</Button>
                <Button @click="$emit('reloadList',false);">取消</Button>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            data:'',
            invoiceItemList:[],
            printStyle:true
        }
    },
    props:{
        orderId:{ //订单id
            type:String | Number
        },
        caseIdList:{ //开票case
            type:Array
        },
        invoiceId:{ //详情id
            type:String | Number
        },
        operate:{
            type:String
        }
    },
    computed:{
        amountCertTotal(){
            if(this.invoiceItemList.length==0){
                return 0;
            }
            return this.invoiceItemList.map(item=>{
                return item.amountCert
            }).reduce(function(total,item){
                return Number(total) + Number(item);
            },0)
        },
        amountTotal(){
            if(this.invoiceItemList.length==0){
                return 0;
            }
            return this.invoiceItemList.map(item=>{
                return item.amount
            }).reduce(function(total,item){
                return Number(total) + Number(item);
            },0)
        },
    },
    methods: {
        //预览开票信息
        previewBillingData(){
            let url = '/settlement/trade/sale/order/invoice/preview';
            let ajaxData = {
                orderId: this.orderId,
                orderItemIdList: this.caseIdList
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.data = res.data;
                    this.invoiceItemList = res.data.invoiceItemList;
                }
            }) 
        },
        // 公证费用
        getInputValue(data,index){
            this.invoiceItemList[index].amountCert = Number(data);
            this.invoiceItemList[index].amountAgent= this.invoiceItemList[index].amount - Number(data);
        },
        // 开票
        billingSubmit(state){
            let url = '/settlement/trade/sale/order/invoice';
            this.data.state = state;
            this.data.amountCert = this.amountCertTotal;
            this.data.amount = this.amountTotal;
            this.data.amountAgent = this.amountTotal - this.amountCertTotal;
            console.log(this.data)
            if(this.operate=='edit'){
                this.$patch(url,this.data).then(res=>{
                    if(res.code==0){
                        this.$Message.success('操作成功')
                        this.$emit('reloadList',true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }else{
                this.$post(url,this.data).then(res=>{
                    if(res.code==0){
                        this.$Message.success('操作成功')
                        this.$emit('reloadList',true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }
        },
        //开票详情
        getBillingDetail(){
            let url = `/settlement/trade/sale/order/invoice/${this.invoiceId}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.data = res.data;
                    this.invoiceItemList = res.data.invoiceItemList;
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        // 打印
        printInfo(){
            this.printStyle = false;
            this.$nextTick(()=>{
                this.printStyle = true;
                window.print();
            })
        },
        // 导出
        downloadInfo(){
            let url = '/settlement/trade/sale/order/invoice/export/'+this.invoiceId;
            this.$exportGet(url).then(res=>{
                if(res.code==0){}
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        if(this.orderId){
            this.previewBillingData();
        }
        if(this.invoiceId){
            this.getBillingDetail();
        }
    },
    updated(){
        
    },
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "../../buySettlement/refundDetail.scss";
.subject-noheader-table .subject-table-color{
    width:auto;
}
.money-td{
    font-weight: 600;
    color:$warningColor;
}
.subject-noheader-table.subject-table td{
    padding:13px 10px;
}
.text-r{
    text-align: right;
}
.subject-noheader-table.subject-table .text-l{
    text-align: left;
    padding-left:20px;
}
</style>
