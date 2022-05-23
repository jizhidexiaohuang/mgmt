<template>
    <div class="payment-confirmation">
        <Row class="detail-header">
            <span>到款记录</span>
            <!-- <Button type="primary" class="add-btn" @click="addPaymentConfirmation">添加到款记录</Button> -->
        </Row>
        <Row class="table-container">
            <Row class="payment">应收金额：{{amountReceivable}} 实收金额：{{amountActuallyReceived}}</Row>
            <Row class="table-box">
                <Table :columns="columns" :data="data" :loading="tableLoading"></Table>
            </Row>
        </Row>
        
        <!-- 新增到款记录 -->
        <Modal
            v-model="addCtrl"
            title="新建到款记录"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" v-if="addCtrl">
                <FormItem label="付款主体" prop="paymentSubject">
                    <Input v-model.trim="formValidate.paymentSubject" placeholder="请输入付款主体"></Input>
                </FormItem>
                <FormItem label="付款时间" prop="paymentDate">
                    <DatePicker :value="formValidate.paymentDate" @on-change="getTime($event,'paymentDate')" style="width:100%" type="date" placeholder="请填写付款时间"></DatePicker>
                </FormItem>
                <FormItem label="赔偿金额" prop="paymentArrivalFee">
                    <my-input
                        appendText="￥" 
                        :defaultData="formValidate.paymentArrivalFee"
                        :toFixed="2"
                        @getValue="getInputValue($event,'paymentArrivalFee')"
                    ></my-input>
                </FormItem>
                <FormItem 
                    label="诉讼退费" 
                    prop="otherArrivalFee"
                    :rules="[{validator:overMillion, trigger: 'blur'}]">
                    <my-input
                        appendText="￥" 
                        :defaultData="formValidate.otherArrivalFee"
                        :toFixed="2"
                        @getValue="getInputValue($event,'otherArrivalFee')"
                    ></my-input>
                </FormItem>
                <FormItem label="收款方" prop="receipt">
                    <Select v-model="formValidate.receipt" placeholder="请选择收款方">
                        <Option v-for="item in receiptArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="收款时间" prop="receiptTime">
                    <DatePicker :value="formValidate.receiptTime" @on-change="getTime($event,'receiptTime')" style="width:100%" type="date" placeholder="请填写收款时间"></DatePicker>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" :disabled="isSubmit" @click="submit('formValidate')">确认</Button>
                    <Button @click="addCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 确认到款 -->
        <!-- 通过modal -->
        <Modal
            v-model="confirmCtrl"
            title="确认到款"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认这笔到款记录？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :disabled="isSubmit" @click="confirmation">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        const overMillion = (rule, value, callback) => {
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback();
        };
        const timeCheck = (rule, value, callback) => {
            if(new Date(value).getTime() - new Date(this.formValidate.paymentDate).getTime() < 0){
                return callback(new Error('收款时间不能早于付款时间'));
            }
            callback();
        };
        return {
            overMillion:overMillion,
            editId:'',
            id:'',
            tableLoading:false,
            data:[],
            columns: [
                {
                    title: '付款时间',
                    key: 'paymentDateStr'
                },
                {
                    title: '赔偿金额',
                    key: 'paymentArrivalFee',
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.paymentArrivalFee))
                    }
                },
                {
                    title: '结案方式',
                    key: 'closeTypeName'
                },
                {
                    title: '诉讼退费',
                    key: 'otherArrivalFee',
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.otherArrivalFee))
                    }
                },
                {
                    title: '付款主体',
                    key: 'paymentSubject'
                },
                {
                    title: '收款方',
                    key: 'receiptName'
                },
                {
                    title: '收款时间',
                    key: 'receiptTimeStr'
                },
                {
                    title: '状态',
                    key: 'stateName',
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='P':color = 'warningColor';break;
                            case state=='E':color = 'successColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateName)
                    }
                },
                // {
                //     title: '操作',
                //     render:(h,params)=>{
                //         let confirmBtn = h('Button',{
                //             attrs:{
                //                 size:'small',
                //                 type:'primary'
                //             },
                //             directives: [
                //                 {
                //                     name: 'permission',
                //                     value: [this.$route.path],
                //                 }
                //             ],
                //             on:{
                //                 click:()=>{
                //                     this.id = params.row.id;
                //                     this.confirmCtrl = true;
                //                 }
                //             }
                //         },'确认')
                //         let editBtn = h('Button',{
                //             attrs:{
                //                 size:'small',
                //                 type:'default'
                //             },
                //             directives: [
                //                 {
                //                     name: 'permission',
                //                     value: [this.$route.path],
                //                 }
                //             ],
                //             on:{
                //                 click:()=>{
                //                     this.addCtrl = true;
                //                     this.getDetail(params.row);
                //                 }
                //             }
                //         },'修改')
                //         if(params.row.state==='E'){
                //             return [];
                //         }else if(params.row.isCreator&&params.row.state==='P'){
                //             return [editBtn]
                //         }else if(!params.row.isCreator&&params.row.state==='P'){
                //             return [confirmBtn];
                //         }
                //     }
                // }
            ],
            addCtrl:false,
            receiptArr:[],
            formValidate:{
                paymentDate:'',
                paymentArrivalFee:'',
                otherArrivalFee:'',
                paymentSubject:'',
                receipt:'',
                receiptTime:''
            },
            ruleValidate:{
                paymentDate:[{ required: true, message: '付款时间不能为空', trigger: 'change' }],
                paymentArrivalFee:[
                    { required: true, message: '赔偿金额不能为空', trigger: 'blur' },
                    { validator:overMillion, trigger: 'blur' }
                ],
                paymentSubject:[
                    { required: true, message: '付款主体不能为空', trigger: 'blur' },
                    { max:32,message:'不能超过32个字符',trigger:'blur' }
                ],
                receipt:[{ required: true, message: '收款方不能为空', trigger: 'change' }],
                receiptTime:[
                    { required: true, message: '收款时间不能为空', trigger: 'change' }
                ],
            },
            isSubmit:false,
            confirmCtrl:false,
            amountReceivable:''
        }
    },
    props: ['caseId','processId'],
    computed:{
        amountActuallyReceived(){
            let sum = 0;
            this.data&&this.data.length>0?this.data.map(item=>{
                sum += item.paymentArrivalFee;
            }):0;
            return this.common.formateNumber(sum);
        }
    },
    methods: {
        // 获取应收金额
        getAmount(){
            let url = `/business/case/case-close/${this.caseId}/amount`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.amountReceivable = this.common.formateNumber(res.data.receivable);
                }
            });
        },
        getInputValue(data,name){
            this.formValidate[name] = data;
        },
        getTime(data,name){
            this.formValidate[name] = data;
        },
        addPaymentConfirmation(){
            this.addCtrl = true;
            this.formValidate = {
                paymentDate:'',
                paymentArrivalFee:'',
                otherArrivalFee:'',
                paymentSubject:'',
                receipt:'',
                receiptTime:''
            }
        },
        submit(){
            this.$refs['formValidate'].validate((vaild)=>{
                if(vaild){
                    this.isSubmit = true;
                    let url = '/business/case/payment-record';
                    let ajaxData = {};
                    Object.assign(ajaxData,this.formValidate);
                    ajaxData.processId = this.processId;
                    ajaxData.caseId = this.caseId;
                    if(this.editId){
                        ajaxData.id = this.editId;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功')
                                this.$emit('reloadProcess');
                            }else{
                                this.$Message.error(res.message)
                            }
                            this.isSubmit = false;
                            this.getData();
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功')
                                this.$emit('reloadProcess');
                            }else{
                                this.$Message.error(res.message)
                            }
                            this.isSubmit = false;
                            this.getData();
                        })
                    }
                }
            })
        },
        confirmation(){
            this.isSubmit = true;
            let url = `/business/case/payment-record/${this.id}/confirm`;
            this.$patch(url).then(res=>{
                this.isSubmit = false;
                if(res.code===0){
                    this.$Message.success('操作成功');
                    this.confirmCtrl = false;
                    this.getData();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //获取详情
        getData(){
            let url = '/business/case/payment-records/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.data = res.data;
                    this.addCtrl = false;
                }
            })
        },
        getDetail(value){
            let data = JSON.parse(JSON.stringify(value))
            this.editId = data.id;
            for(let key in this.formValidate){
                this.formValidate[key] = data[key];
            }
            this.formValidate.paymentDate = data.paymentDateStr;
            this.formValidate.receiptTime = data.receiptTimeStr;
        },
        //获取字典数据接口
        async getDictionary(){
            this.receiptArr = await this.common.getDictionaryItems('payee_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getAmount();
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
@import '../caseCommon.scss';
.payment-confirmation{
    .table-container{
        border-top:1px solid $borderColor;
    }
    .payment{
        padding:10px 0px;
        font-size: 12px;
        font-weight: 600;
    }
}
</style>
