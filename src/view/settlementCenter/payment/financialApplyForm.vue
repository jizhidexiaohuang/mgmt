<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="收款账户">
                    <span>{{objList[0].bankUser}}</span>
                </FormItem>
                <FormItem label="收款账号">
                    <span>{{objList[0].cardNumber}}</span>
                </FormItem>
                <FormItem label="开户行">
                    <span>{{objList[0].bankName}}</span>
                </FormItem>
                <FormItem label="">
                    <Row v-if="tableObj.projectList.length!=0" class="table-box">
                        <Table :columns="projectColumns" :data="tableObj.projectList"></Table>
                    </Row>
                    <Row v-if="tableObj.bizList.length!=0" class="table-box">
                        <Table :columns="settlementColumns" :data="tableObj.bizList"></Table>
                    </Row>
                    <Row v-if="tableObj.caseDetailList.length!=0" class="table-box">
                        <Table :columns="caseColumns" :data="tableObj.caseDetailList"></Table>
                    </Row>
                    <Row class="count-box">
                        <span>总计:</span>
                        <span class="count-text">{{common.formateNumber(tableObj.allAmount)}}</span>
                    </Row>
                </FormItem>
                <FormItem label="付款时间" prop="paymentDate">
                    <DatePicker :value="formData.paymentDate" @on-change="getPayDate" style="width:100%" type="date" placeholder="请填写付款时间"></DatePicker>
                </FormItem>
                <FormItem label="流水单号" prop="flowNum">
                    <Input v-model.trim="formData.flowNum" placeholder="请输入流水单号"></Input>
                </FormItem>
                <FormItem label="付款凭证" prop="attachmentList">
                    <file-upload
                        :defaultList="formData.attachmentList || []" 
                        :uploadConfig="{}"
                        @getFileList="getAttachmentList"></file-upload>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model.trim="formData.remark" :autosize="{minRows: 3,maxRows: 8}" type="textarea" placeholder="请输入备注"></Input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" @click="preview">保存</Button>
                <Button @click="$emit('closeModal',false)">取消</Button>
            </Row>
        </Form>
        
        <Modal
            v-model="confirmCtrl"
            title="提示"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">状态一经确认不可修改，是否继续</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="sumbit" :disabled="isSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formData:{
                paymentDate:"",
                flowNum:"",
                attachmentList:[],
                remark:"",
            },
            projectColumns:[
                {
                    title:"项目名称",
                    key:"projectName",
                    render:(h,params)=>{
                        return h("span",{
                            class:"textover",
                            attrs:{
                                title:params.row.projectName
                            }
                        },params.row.projectName)
                    }
                },
                {
                    title:"付款金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.amount))
                    }
                },
            ],
            caseColumns:[
                {
                    title:"案件编号",
                    key:"caseCode"
                },
                {
                    title:"付款金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.amount))
                    }
                },
            ],
            settlementColumns:[
                {
                    title:"结算单号",
                    key:"settlementCode"
                },
                {
                    title:"付款金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.amount))
                    }
                }
            ],
            ruleValidate:{
                paymentDate:[{required: true,message:'付款日期不能为空',trigger:'blur'}]
            },
            isSubmit:false,
            confirmCtrl:false,
            objArr:[]
        }
    },
    props: ['paymentIdList','objList'],
    computed:{
        tableObj(){
            let obj = {
                allAmount:0,
                bizList:[],
                caseDetailList:[],
                projectList:[]
            }
            this.objList.forEach((item,index)=>{
                obj.bizList = obj.bizList.concat(item.financePaymentBizList || []);
                // 没有casecode代表是根据项目申请的付款
                if(item.financePaymentDetailList.length==1&&!item.financePaymentDetailList[0].caseCode){
                    obj.projectList = obj.projectList.concat(item.financePaymentDetailList);
                }else{
                    obj.caseDetailList = obj.caseDetailList.concat(item.financePaymentDetailList || []);
                }
                obj.allAmount += item.amount || 0
            })
            return obj
        }
    },
    methods: {
        getPayDate(value){
            this.formData.paymentDate = value;
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
        preview(){
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.confirmCtrl = true;
                }
            })
        },
        sumbit(){
            this.isSubmit = true;
            let url = '/settlement/finance-payment-record';
            let ajaxData = {
                paymentIdList:this.paymentIdList,
            }
            Object.assign(ajaxData,this.formData);
            this.$post(url,ajaxData).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    this.$Message.success('操作成功');
                    this.$emit('closeModal',true);
                }else{
                    this.$Message.error(res.message)
                }
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
@import "@/assets/globalStyle.scss";
.table-box{
    border:1px solid #dcdee2;
    border-bottom:0;
}
.count-box{
    text-align: right;
    border:1px solid #dcdee2;
    border-top:0;
    padding:0 10px;
    font-size: 14px;
    .count-text{
        color:#ffa43b;
    }
}
</style>