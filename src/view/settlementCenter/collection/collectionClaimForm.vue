<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="收款编号">
                    <span>{{incomeDetail.code}}</span>
                </FormItem>
                <FormItem label="待认领金额">
                    <span>{{common.formateNumber(incomeDetail.pendingClaimAmount)}}</span>
                </FormItem>
                <FormItem label="认领类目" prop="category">
                    <Select v-model="formData.category" placeholder="请选择认领类目" style="width:100%" @on-change="getCategory">
                        <Option v-for="item in claimCategoryArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="认领模式" prop="claimType" v-if="formData.category=='A'"
                    :rules="[{required:true,message:'认领模式不能为空',trigger:'change'}]">
                    <RadioGroup v-model="formData.claimType">
                        <Radio v-for="item in claimTypeArr" :label="item.value" :key="item.value">{{item.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="认领项目" prop="projId">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects/list'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目'"
                        :keyName="'name'"
                        @getValue="getProjectId">
                    </mySelect>
                </FormItem>
                <FormItem label="结算单号" prop="custSettleId" v-if="formData.claimType=='B'"
                    :rules="[{required:true,type:'number',message:'结算单号不能为空',trigger:'change'}]">
                    <mySelect ref="projectSelect"
                        :path="'/settlement/finance/claim/cust-settles'"
                        :placeholder="'请选择结算单'"
                        :placeholderInput="'请输入关键字'"
                        :params="{projectId:this.formData.projId}"
                        :keyName="'code'"
                        @getValue="getCustSettleId">
                        <template slot-scope="{ item }" slot="moreText">剩余回款金额：{{item.remainReturnAmount}}---结算金额：{{item.actualPay}}</template>
                    </mySelect>
                </FormItem>
                <FormItem :label-width="0" label="" prop="caseIdList" class="row-form" v-if="formData.claimType!=='B'"
                    :rules="{ validator: caseIdListValid,trigger:'blur' }">
                    <Row class="row-btn">
                        <Button type="primary" :disabled="addCaseCtrl" @click="addCaseModal=true">选择案件</Button>
                    </Row>
                    <Row style="border:1px solid #dcdee2;border-bottom:0;">
                        <Table :columns="(formData.category!=='A'&&formData.category!='J')?columnsB:columnsA" :data="data">
                            <template slot-scope="{ row, index }" slot="action">
                                <Dropdown @on-click="option(index,$event)">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-more" size="20"/>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="delete">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </template>
                        </Table>
                    </Row>
                </FormItem>
                <FormItem label="认领金额" prop="amount" class="row-total"
                    :rules="[{validator:this.validateMoney,trigger:'blur'}]">
                    <p v-if="data.length!=0 || formData.claimType=='B'"><span>{{common.formateNumber(this.formData.amount)}}</span></p>
                    <my-input ref="myInput" class="num-input" v-else
                        appendText="￥" 
                        :toFixed="2"
                        @getValue="getInputValue($event)"
                    ></my-input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitClaim()">保存</Button>
                <Button @click="$emit('changeCtrl',false)">取消</Button>
            </Row>
        </Form>
        <!-- 添加案件 -->
        <Modal 
            v-model="addCaseModal" 
            :width="750"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">选择案件</div>
            <add-case-component v-if="addCaseModal" 
                :params="{category:this.formData.category,claimType:this.formData.claimType,projectId:this.formData.projId}"
                :defaultObjList="defaultCaseList"
                 @refreshList="getIdList($event)"></add-case-component>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import addCaseComponent from './addCaseModal.vue';
export default {
    data () {
        const validateMoney = (rule, value, callback) => {
            if(this.formData.category && this.formData.category=='A'){
                callback()
            }else if(this.formData.category && this.formData.category!='A' && this.data.length!=0){
                callback()
            }else{
                this.amountValid(rule, value, callback)
            }
            callback()
        }
        const amountValid = (rule, value, callback) => {
            if(!value){
                return callback(new Error('请填写金额'));
            }
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback();
        }
        const caseIdListValid = (rule, value, callback) => {
            if((this.formData.category=='A' && this.formData.claimType=='A')||this.formData.category=='J'){
                if(this.data && this.data.length==0){
                    return callback(new Error('请选择案件'))
                }
            }
            callback()
        }
        return {
            validateMoney:validateMoney,
            amountValid:amountValid,
            caseIdListValid:caseIdListValid,
            incomeDetail:'',
            formData:{
                category:'',
                claimType:'A',
                projId:'',
                custSettleId:'',
                amount:'',
            },
            ruleValidate:{
                category:[{required: true,message:'认领类目不能为空',trigger:'change'}],
                projId:[{required: true,type:'number',message:'项目不能为空',trigger:'change'}],
            },
            isSubmit:false,
            claimCategoryArr:[],
            claimTypeArr:[],
            data:[],
            columnsA:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"对方当事人",
                    key:"caseExtend",
                    render:(h,params)=>{
                        let domArr = [];
                        let idArr = params.row.caseExtend.litigantIds?params.row.caseExtend.litigantIds.split(",") : [];
                        let categoryArr = params.row.caseExtend.litigantCategories?params.row.caseExtend.litigantCategories.split(",") : [];
                        let nameArr = params.row.caseExtend.litigantNames?params.row.caseExtend.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title: '赔偿款',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title: '诉讼退费',
                    key: 'otherAmount',
                    render:(h,params)=>{
                        let otherAmount = this.common.formateNumber(params.row.otherAmount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:otherAmount
                            },
                        },otherAmount)
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            columnsB:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"对方当事人",
                    key:"caseExtend",
                    render:(h,params)=>{
                        let domArr = [];
                        let idArr = params.row.caseExtend.litigantIds?params.row.caseExtend.litigantIds.split(",") : [];
                        let categoryArr = params.row.caseExtend.litigantCategories?params.row.caseExtend.litigantCategories.split(",") : [];
                        let nameArr = params.row.caseExtend.litigantNames?params.row.caseExtend.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title: '认领金额',
                    key: 'amount',
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
                                    this.data[params.index].amount = Number(data);
                                    this.reCalculate();
                                }
                            }
                        })
                        let FormItemDom = h('FormItem',{
                            props:{
                                label:'',
                                labelWidth:0,
                                prop:'amount',
                                rules:[{validator:this.amountValid,trigger:'blur'}]
                            }
                        },[inputDom]);
                        return FormItemDom;
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            addCaseModal:false,
            defaultCaseList:[],
            caseList:[]
        }
    },
    props: ['incomeId'],
    computed:{
        addCaseCtrl(){
            let bool = true;
            switch (true){
                case (this.formData.category=='A' && (!!this.formData.claimType) && (!!this.formData.projId)):
                    bool = false;
                    break;
                case ((!!this.formData.category) && (!!this.formData.projId)):
                    bool = false;
                    break;
                default:
                    bool = true;
                    break;
            }
            return bool;
        }
    },
    methods: {
        //选择所属项目
        getProjectId(data){
            if(this.formData.projId!=data.id){
                this.defaultCaseList = [];
                this.data = [];
            }
            this.formData.projId = data.id;
        },
        getCustSettleId(data){
            this.formData.custSettleId = data.id;
            this.formData.amount = Math.min(this.incomeDetail.pendingClaimAmount,data.remainReturnAmount)
        },
        // 总金额
        getInputValue(data){
            this.formData.amount = data;
        },
        // 切换类目
        getCategory(data){
            if(data!='A'){
                this.formData.amount = '';
                this.formData.claimType = '';
            }else{
                this.reCalculate();
                this.formData.claimType = 'A';
                this.$refs.formData.validateField('amount');
            }
            this.defaultCaseList = [];
            this.data = [];
        },
        option(index,name){
            switch (name) {
                case 'delete': 
                    this.data.splice(index,1);
                    this.defaultCaseList = this.data;
                    this.reCalculate();
                    break;
            }
        },
        // 重新计算总价
        reCalculate(){
            this.formData.amount = this.data.reduce(function(total,item){
                return total + Number(item.amount) +Number(item.otherAmount)
            },0)
        },
        //获取指派团队
        getIdList(data){
            this.caseList = data;
        },
        // 确定
        confirm(){
            this.addCaseModal = false;
            this.defaultCaseList = this.caseList;
            this.data = this.caseList;
            this.reCalculate();
        },
        //取消
        cancel(){
            this.addCaseModal = false;
            this.caseList = this.defaultCaseList;
        },
        // 提交
        submitClaim(){
            let url = '/settlement/finance/claim';
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    let financeClaimList = [] ;
                    if(this.formData.category=='A'||this.formData.category=='J'){
                        if(this.formData.claimType=='B'){
                            financeClaimList = [{
                                incomeId:this.incomeId,
                                category:this.formData.category,
                                claimType:this.formData.claimType,
                                projId:this.formData.projId,
                                custSettleId:this.formData.custSettleId,
                                amount:this.formData.amount
                            }]
                        }else{
                            financeClaimList = this.data.map(item=>{
                                let json = {
                                    caseId:item.caseId,
                                    amount:item.amount,
                                    caseSettlePayId:item.caseSettlePayId,
                                    otherAmount:item.otherAmount,
                                    incomeId:this.incomeId,
                                    category:this.formData.category,
                                    claimType:this.formData.claimType,
                                    projId:this.formData.projId,
                                }
                                return json;
                            })
                        }
                    }else{
                        if(this.data && this.data.length!=0){
                            financeClaimList = this.data.map(item=>{
                                let json = {
                                    caseId:item.caseId,
                                    amount:item.amount,
                                    incomeId:this.incomeId,
                                    category:this.formData.category,
                                    projId:this.formData.projId,
                                }
                                return json;
                            })
                        }else{
                            financeClaimList = [{
                                incomeId:this.incomeId,
                                category:this.formData.category,
                                projId:this.formData.projId,
                                amount:this.formData.amount
                            }]
                        }
                    }
                    console.log(financeClaimList)
                    this.isSubmit = true;
                    this.$post(url,financeClaimList).then(res=>{
                        this.isSubmit = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.$emit('changeCtrl',true)
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        getIncomeDetail(){
            let url = '/settlement/finance/income/'+this.incomeId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.incomeDetail = res.data;
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.claimCategoryArr = await this.common.getDictionaryItems('claim_category');
            this.claimTypeArr = await this.common.getDictionaryItems('claim_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        this.getIncomeDetail();
    },
    updated(){},
    components: {addCaseComponent},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
 .row-form{
     padding:10px 0 0 20px;
 }
 .row-btn{
     margin-bottom:20px;
 }
 .row-total{
     margin:20px 0 20px 0;
     span{
         font-size: 14px;
        font-weight: 600;
        color:$warningColor;
     }
 }
</style>
