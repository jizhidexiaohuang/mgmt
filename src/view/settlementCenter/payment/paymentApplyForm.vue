<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="支出类目" prop="category">
                    <span>{{formData.categoryName}}</span>
                </FormItem>
                <FormItem label="付款类型" prop="payType">
                    <Select v-model="formData.payType" clearable>
                        <Option v-for="item in payTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属项目" prop="projectId">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目'"
                        :keyName="'name'"
                        @getValue="getProjectId">
                    </mySelect>
                </FormItem>
                <FormItem label="案件信息" prop="financePaymentDetailList">
                    <Button type="primary" @click="openSelectCase">选择案件</Button>
                    <Row class="table-box">
                        <Table :columns="columns" :data="formData.financePaymentDetailList">
                            <template slot-scope="{ row, index }" slot="action">
                                <span @click="deleteCase(row)" title="删除" class="del-icon icon-down-01"></span>
                            </template>
                        </Table>
                    </Row>
                </FormItem>
                <FormItem label="具体金额" prop="amount">
                    <my-input
                        v-if="formData.financePaymentDetailList.length==0"
                        appendText="￥" 
                        :defaultData="formData.amount"
                        :toFixed="2"
                        @getValue="getInputValue"
                    ></my-input>
                    <span v-else>{{common.formateNumber(formData.amount)}}</span>
                </FormItem>
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
                <FormItem label="附件" prop="attachmentList">
                    <file-upload
                        :defaultList="formData.attachmentList || []" 
                        :uploadConfig="{}"
                        @getFileList="getAttachmentList"></file-upload>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="preview">预览</Button>
                <Button @click="$emit('changeEditCtrl',false)">取消</Button>
            </Row>
        </Form>

        <!-- 选择案件 -->
        <Modal
            v-model="selectCaseCtrl"
            title="选择案件"
            :width="800"
            :footer-hide="true">
            <select-case ref="selectCase" :params="{projectId:formData.projectId}" mainKey="id" path="/settlement/finance-payment/case-detail" v-if="selectCaseCtrl" 
                :objArr="formData.financePaymentDetailList" :defaultData="caseIdList"></select-case>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="getSelectedCase">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        
        <!-- 结算单预览/打印 -->
        <Modal
            v-model="printCtrl"
            width="700"
            :closable="false"
            :footer-hide="true">
            <cust-apply-print :defaultData="payData" :isInfo="isPrintnfo" :categoryObj="categoryObj" @closeModal="printCtrl=false">
                <Button slot="sumbitBtn" type="primary" @click="sumbit">生成</Button>
            </cust-apply-print>
        </Modal>
    </div>
</template>
<script>
import selectCase from "./../../tradingCenter/buySettlement/plugin/selectCase.vue";
import custApplyPrint from "./../settlement/plugin/custApplyPrint.vue";
export default {
    data () {
        const validateMoney = (rule, value, callback) => {
            if(!value){
                return callback(new Error('请填写金额'));
            }
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback()
        }
        return {
            selectCaseCtrl:false,
            payTypeArr:[],
            caseIdList:[],
            formData:{
                category:"",
                categoryName:"",
                projectId:"",
                payType:"",
                bankUser:"",
                cardNumber:"",
                bankName:"",
                remark:"",
                amount:"",
                financePaymentDetailList:[],
                attachmentList:[]
            },
            paymentCategoryName:"",
            ruleValidate:{
                amount:[{required: true,validator:validateMoney,trigger:'blur'}],
                paymentCategory:[{required: true,message:'支出类目不能为空',trigger:'blur'}],
                payType:[{required: true,message:'付款类型不能为空',trigger:'blur'}],
                projectId:[{required: true,type:"number",message:'所属项目不能为空',trigger:'blur'}],
                bankUser:[{required: true,message:'收款账户不能为空',trigger:'blur'},{max:64,message:'不能超过64个字符',trigger:'blur'}],
                cardNumber:[{required: true,message:'收款帐号不能为空',trigger:'blur'},{max:32,message:'不能超过32个字符',trigger:'blur'}],
                bankName:[{required: true,message:'开户行不能为空',trigger:'blur'},{max:64,message:'不能超过64个字符',trigger:'blur'}],
                remark:[{max:512,message:'不能超过512个字符',trigger:'blur'}],
            },
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode"
                },
                {
                    title:"对方当事人",
                    key:"litigantNames"
                },
                {
                    title:"具体金额",
                    key:"amount",
                    render:(h,params)=>{
                        let inputDom = h('my-input',{
                            props:{
                                appendText:'￥',
                                toFixed:2
                            },
                            style:{
                                width:'80%'
                            },
                            on:{
                                'getValue':(data)=>{
                                    this.formData.financePaymentDetailList[params.index].amount = Number(data);
                                    this.countAmount();
                                }
                            }
                        })
                        return inputDom;
                    }
                },
                {
                    title:"操作",
                    width:60,
                    slot: 'action',
                    align:"center"
                },
            ],
            isSubmit:false,
            printCtrl:false,
            payData:"",
            isPrintnfo:false,
        }
    },
    props: ['categoryObj'],
    methods: {
        getInputValue(value){
            this.formData.amount = value;
        },
        openSelectCase(){
            this.$refs.formData.validateField('projectId')
            if(this.formData.projectId){
                this.selectCaseCtrl = true;
            }
        },
        deleteCase(row){
            this.formData.financePaymentDetailList.splice(row._index,1);
            this.caseIdList = this.formData.financePaymentDetailList.map(item=>{
                return item.id;
            })
            this.countAmount();
        },
        //选择所属项目
        getProjectId(data){
            if(this.formData.projectId != data.id){
                this.formData.financePaymentDetailList = [];
                this.caseIdList = [];
                this.countAmount();
            }
            this.formData.projectId = data.id;
        },
        getSelectedCase(){
            this.formData.financePaymentDetailList = this.$refs.selectCase.idObjList;
            this.caseIdList = this.$refs.selectCase.idList;
            this.selectCaseCtrl = false;
            this.countAmount();
        },
        //获取图片列表
        getAttachmentList (arr) {
            this.formData.attachmentList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formData.attachmentList.push(obj);
            })
        },
        //取消
        cancel(){
            this.selectCaseCtrl = false;
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        countAmount(){
            this.formData.amount = 0;
            this.formData.financePaymentDetailList.forEach((item,index)=>{
                this.formData.amount += (item.amount || 0);
            })
            this.$refs.formData.validateField('amount');
        },
        preview(){
            let url = '/settlement/finance-payment/generate';
            let ajaxData = {};
            Object.assign(ajaxData,this.formData);
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.payData = res.data || "";
                            this.payData.creatorName = this.payData.userName;
                            this.isPrintnfo = false;
                            this.printCtrl = true;
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
                    this.$emit("closeModal",true);
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.payTypeArr = await this.common.getDictionaryItems('pay_type');
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        if(this.categoryObj){
            this.formData.category = this.categoryObj.value;
            this.formData.categoryName = this.categoryObj.name;
        }  
    },
    mounted(){},
    updated(){},
    components: {
        selectCase,
        custApplyPrint
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.table-box{
    border:1px solid #dcdee2;
    border-bottom:0;
    margin:10px 0 5px 0;
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