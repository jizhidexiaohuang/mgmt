<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="收款账户" prop="bankUser">
                    <Input v-model.trim="formData.bankUser" placeholder="请输入收款账户"></Input>
                </FormItem>
                <FormItem label="收款帐号" prop="cardNumber">
                    <Input v-model.trim="formData.cardNumber" placeholder="请输入收款帐号"></Input>
                </FormItem>
                <FormItem label="开户行" prop="bankName">
                    <Input v-model.trim="formData.bankName" placeholder="请输入开户行"></Input>
                </FormItem>
                <FormItem label="付款描述" prop="remark">
                    <Input v-model.trim="formData.remark" :autosize="{minRows: 3,maxRows: 8}" type="textarea" placeholder="请输入付款描述"></Input>
                </FormItem>
            </Row>
        </Form>
        <Row class="batch-box">
            <Row class="table-box">
                <Table :columns="columns" :data="idObjList"></Table>
            </Row>
            <p class="sum-text">
                合计结算金额：<span>{{this.common.formateNumber(allAmount,"")}}</span> 元
            </p>
        </Row>
        <Row class="detail-btn-box">
            <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="perviewPayment">预览</Button>
            <Button @click="$emit('changeEditCtrl',false)">取消</Button>
        </Row>

        <!-- 结算单预览/打印 -->
        <Modal
            v-model="printCtrl"
            width="700"
            :closable="false"
            :footer-hide="true">
            <cust-apply-print :defaultData="payData" :isInfo="isPrintnfo" @closeModal="printCtrl=false">
                <Button slot="sumbitBtn" type="primary" @click="sumbit">生成</Button>
            </cust-apply-print>
        </Modal>

        <!-- 预览结算单 -->
        <Modal
            v-model="previewCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <cust-settlement-print :defaultData="settlementData" v-if="previewCtrl" @closeModal="previewCtrl=false"></cust-settlement-print>
        </Modal>
    </div>
</template>
<script>
import custApplyPrint from "./plugin/custApplyPrint.vue";
import custSettlementPrint from "./plugin/custSettlementPrint.vue";
export default {
    data () {
        return {
            isSubmit:false,
            formData:{
                bankUser:"",
                cardNumber:"",
                bankName:"",
                remark:"",
                settlementIdList:[]
            },
            ruleValidate:{
                bankUser:[{required:true,message:"收款账户不能为空",trigger:"blur"},{max:64,message:'不能超过64个字符',trigger:'blur'}],
                cardNumber:[{required:true,message:"收款帐号不能为空",trigger:"blur"},{max:32,message:'不能超过32个字符',trigger:'blur'}],
                bankName:[{required:true,message:"开户行不能为空",trigger:"blur"},{max:64,message:'不能超过64个字符',trigger:'blur'}],
                remark:[{max:512,message:'不能超过512个字符',trigger:'blur'}],
                settlementIdList:[{required:true,type:"array",message:"请选择结算单",trigger:"blur"}]
            },
            tableData:[],
            columns:[
                {
                    title:"结算单号",
                    key:"code",
                    width:130,
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getDetail(params.row.id);
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1));
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNumber"
                },
                {
                    title:"结算金额",
                    key:"actualPay",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.actualPay));
                    }
                }
            ],
            printCtrl:false,
            previewCtrl:false,
            isPrintnfo:false,
            payData:"",
            settlementData:""
        }
    },
    props: {
        //是否批量申请付款
        idObjList:{
            type:Array,
            default(){
                return []
            }
        }
    },
    computed:{
        allAmount(){
            let num = 0;
            this.idObjList.forEach((item,indx)=>{
                num += (item.actualPay || 0)
            })
            return num
        }
    },
    methods: {
        // 获取结算单详情
        getDetail(id){
            let url = `/settlement/finance-cust-settlement/${id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.settlementData = res.data || "";
                    this.previewCtrl = true;
                }
            })
        },
        perviewPayment(){
            let url = `/settlement/finance-cust-settlement/generate/payment`;
            this.$refs["formData"].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    this.$post(url,this.formData).then(res=>{
                        this.isSubmit = false;
                        if(res.code==0){
                            this.payData = res.data || "";
                            this.payData.creatorName = this.payData.userName;
                            this.isPrintnfo = false;
                            this.printCtrl = true;
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        sumbit(){
            let url = '/settlement/finance-payment';
            this.$post(url,this.payData).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功!");
                    this.printCtrl = false;
                    this.$emit("changeEditCtrl",true);
                }else{
                    this.$Message.error(res.message);
                }
            })
        }
    },
    created(){},
    beforeMount(){
        console.log(this.idObjList);
        this.idObjList.forEach((item,index)=>{
            this.formData.settlementIdList.push(item.id);
        })
    },
    mounted(){},
    updated(){},
    components: {
        custApplyPrint,
        custSettlementPrint
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.batch-box{
    padding:0 20px;
    .table-box{
        border:1px solid #dcdee2;
        border-bottom:0;
        margin:10px 0 5px 0;
    }
    .sum-text{
        margin:10px 0 20px 0;
        font-size: 14px;
        >span{
            color:#ffa43b;
        }
    }
}
.page-box{
    text-align:center;
}
.del-icon{
    color:$errorColor;
    font-size: 14px;
    cursor: pointer;
}
</style>
