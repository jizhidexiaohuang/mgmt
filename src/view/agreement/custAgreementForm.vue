<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>线索信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="协议名称" prop="name">
                    <Input v-model.trim="formData.name" type="text" placeholder="请输入协议名称"></Input>
                </FormItem>
                <FormItem label="客户名称" prop="custId">
                    <mySelect ref="customerSelect"
                        :path="'/base/customers'"
                        :placeholder="'请选择客户'"
                        :params="{type:'G'}"
                        :keyName="'name'"
                        :inputKey="'name'"
                        :pagingMode="true"
                        :defaultObj="defaultCust"
                        @getValue="getCustomerId"></mySelect>
                </FormItem>
                <FormItem label="产品名称" prop="productId">
                    <mySelect ref="productSelect"
                        :path="'/base/products'"
                        :placeholder="'请选择产品'"
                        :keyName="'name'"
                        :pagingMode="true"
                        :defaultObj="defaultProduct"
                        @getValue="getProductId"></mySelect>
                </FormItem>
                <FormItem label="描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写描述"></Input>
                </FormItem>
                <FormItem label="有效期" prop="startDate">
                    <DatePicker 
                        type="daterange"
                        split-panels 
                        style="width:100%"
                        @on-change="getTime"
                        :value="timeRange"
                        placeholder="请选择有效期"></DatePicker>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>结算规则</span>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">成本费用</Row>
                    <Row class="block-content">
                        <FormItem label="成本费用" prop="costType">
                            <RadioGroup v-model="formData.costType">
                                <Radio label="F">固定成本</Radio>
                                <Radio label="A">实际成本</Radio>
                                <Radio label="N">无成本</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="固定金额" prop="fixedAmount" v-if="formData.costType=='F'"
                            :rules="{required: true,validator:this.validateMoney,trigger:'blur'}">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.fixedAmount"
                                :toFixed="2"
                                @getValue="getInputValue($event,'fixedAmount')"
                            ></my-input>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">分成比例</Row>
                    <Row class="block-content">
                        <FormItem label="分成比例" prop="ratioType">
                            <RadioGroup v-model="formData.ratioType">
                                <Radio label="P">累进比例</Radio>
                                <Radio label="F">固定比例</Radio>
                            </RadioGroup>
                        </FormItem>
                       <Row>
                            <settlementGradientTable ref="refSettlementGradient"
                                @getSettlementList="getSettlementList" 
                                :list="defaultSettlementList"></settlementGradientTable>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">客户终止报酬</Row>
                    <Row class="block-content">
                        <FormItem label="客户终止报酬" prop="type">
                            <RadioGroup v-model="formData.type">
                                <Radio label="2">分段收费</Radio>
                                <Radio label="1">固定金额</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="固定金额" prop="terminationFixedAmount" v-if="formData.type=='1'"
                            :rules="{required: true,validator:this.validateMoney,trigger:'blur'}">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.terminationFixedAmount"
                                :toFixed="2"
                                @getValue="getInputValue($event,'terminationFixedAmount')"
                            ></my-input>
                        </FormItem>
                        <Row class="fee-full-list fee-label-list" v-if="formData.type=='2'">
                            <FormItem label="未起诉" prop="terminationNotSuedFixAmount" :label-width="60"
                                :rules="{required: true,validator:this.validateMoney,trigger:'blur'}">
                                <my-input v-if="detailsCtrl"
                                    appendText="￥" 
                                    :defaultData="formData.terminationNotSuedFixAmount"
                                    :toFixed="2"
                                    @getValue="getInputValue($event,'terminationNotSuedFixAmount')"
                                ></my-input>
                            </FormItem>
                        </Row>
                        <Row class="fee-full-list fee-label-list" v-if="formData.type=='2'">
                            <FormItem label="已起诉" prop="terminationSuedFixedAmount" :label-width="60"
                                :rules="{required: true,validator:this.validateRules,trigger:'blur'}">
                                <Row>
                                    <Col :span="17">
                                        <my-input v-if="detailsCtrl"
                                            :disabled="Boolean(formData.terminationSuedRatio)"
                                            :defaultData="formData.terminationSuedFixedAmount"
                                            appendText="￥"
                                            tips="请选择其中一种补偿填写"
                                            :toFixed="2"
                                            @getValue="getInputValue($event,'terminationSuedFixedAmount')"
                                        ></my-input>
                                    </Col>
                                    <Col :span="6" :offset="1">
                                        <my-input v-if="detailsCtrl"
                                            :disabled="Boolean(formData.terminationSuedFixedAmount)"
                                            :defaultData="formData.terminationSuedRatio"
                                            appendText="%"
                                            tips="请选择其中一种补偿方式填写"
                                            @getValue="getInputValue($event,'terminationSuedRatio')"
                                        ></my-input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">诉讼退费归属</Row>
                    <Row class="block-content">
                        <FormItem label="诉讼退费归属" prop="litigationRefundOwner">
                            <RadioGroup v-model="formData.litigationRefundOwner">
                                <Radio label="A">安盾</Radio>
                                <Radio label="C">客户</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-btn-box">
                    <Button @click="submitNewSettlement('D')" :disabled="isSubmit">存为草稿</Button>
                    <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewSettlement('E')">发布</Button>
                    <Button @click="$emit('changeEditCtrl',false)">取消</Button>
                </Row>
            </Row>
        </Form>
    </div>
</template>
<script>
import settlementGradientTable from '@/components/common/settlementGradientTable/index.vue'
export default {
    data () {
        const validateRules = (rule, value, callback) => {
            if (!this.formData.terminationSuedFixedAmount&&!this.formData.terminationSuedRatio) {
                return callback(new Error('至少填写一种赔偿方式'));
            }
            if(Number(this.formData.terminationSuedFixedAmount)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            if(Number(this.formData.terminationSuedRatio)>100){
                return callback(new Error('比例不能超过100'));
            }
            callback()
        };
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
            detailsCtrl:false,
            validateRules:validateRules,
            validateMoney:validateMoney,
            isSubmit:false,
            timeRange:[],
            defaultCust:{},
            defaultProduct:{},
            defaultSettlementList:[],
            formData:{
                name:"",
                custId:"",
                productId:'',
                remark:"",
                startDate:'',
                endDate:'',
                costType:'F',
                fixedAmount:"", //成本费用--固定金额
                ratioType:'P',
                type:'2',
                terminationFixedAmount:"", //固定金额--固定金额
                terminationNotSuedFixAmount:"", //未起诉--固定赔偿
                terminationSuedFixedAmount:'',//已起诉--固定金额
                terminationSuedRatio:"", //已起诉--按比例赔偿
                litigationRefundOwner:'A',
                agreementPriceRatioCustList:[],
            },
            ruleValidate:{
                name:[
                    {required: true,message:'协议名称不能为空',trigger:'blur'}
                ],
                custId:[
                    {required: true,type:'number',message:'客户名称不能为空',trigger:'blur'}
                ],
                productId:[
                    {required: true, type:'number',message:'产品名称不能为空',trigger:'blur'}
                ],
                startDate:[
                    {required: true,message:'有效期不能为空',trigger:'blur'}
                ],
                ratioType:[
                    {required: true,message:'分成比例不能为空',trigger:'change'}
                ],
                type:[
                    {required: true,message:'请选择客户终止报酬方式',trigger:'change'}
                ],
                litigationRefundOwner:[
                    {required: true,message:'诉讼退费归属不能为空',trigger:'change'}
                ],
            }
        }
    },
    props: ['custAgreementDetail','iscopy'],
    methods: {
        submitNewSettlement(state){
            let flag = true;
            this.$refs.refSettlementGradient.submitValid();
            if(this.formData.agreementPriceRatioCustList.length==0){
                flag = false;
            }
            let url = '/settlement/agreement';
            let ajaxData = {};
            for(let key in this.formData){
                if(key=='type'){
                    ajaxData['terminationIsFixedAmount'] = this.formData.type=='1'?true:false;
                }else{
                    ajaxData[key] = this.formData[key];
                }
            }
            if(ajaxData.costType!=='F'){
                ajaxData.fixedAmount = '';
            }
            if(!ajaxData.terminationIsFixedAmount){
                ajaxData.terminationFixedAmount = '';
            }else{
                ajaxData.terminationNotSuedFixAmount = '';
                ajaxData.terminationSuedFixedAmount = '';
                ajaxData.terminationSuedRatio = "";
            }
            ajaxData.state = state;
            console.log(this.formData)
            this.$refs['formData'].validate((valid) => {
                if(valid&&flag){
                    console.log(ajaxData)
                    this.isSubmit = true;
                    if(this.custAgreementDetail&&(!this.iscopy)){
                        url = '/settlement/agreement/'+this.custAgreementDetail.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                            }
                            this.isSubmit = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                            }
                            this.isSubmit = false;
                        })
                    }
                }
            })
        },
        //获取委托人
        getCustomerId(data){
            this.formData.custId = Number(data.id);
        },
        //获取委托人
        getProductId(data){
            this.formData.productId = Number(data.id);
        },
        getTime(date){
            this.formData.startDate = date[0];
            this.formData.endDate = date[1];
        },
        getInputValue(data,name){
            this.formData[name] = data;
        },
        getSettlementList(data){
            this.formData.agreementPriceRatioCustList = data;
        },
        //赋值
        getCustomerDetail(data){
            for(let key in this.formData){
                this.formData[key] = data[key];
            }
            this.formData.type = data.terminationIsFixedAmount?'1':'2';
            this.timeRange = [data.startDate,data.endDate];
            this.defaultSettlementList = data.agreementPriceRatioCustList;
            this.defaultCust = {
                name:data.customerName,
                id:data.custId
            }
            this.defaultProduct = {
                name:data.productName,
                id:data.productId
            }
            this.$nextTick(function(){
                this.$refs.productSelect.voluation();
                this.$refs.customerSelect.voluation();
                this.$refs.refSettlementGradient.voluation();
            })
            this.detailsCtrl = true;
        },
    },
    created(){},
    beforeMount(){
        
    },
    mounted(){
        if(this.custAgreementDetail){
            this.getCustomerDetail(this.custAgreementDetail);
        }else{
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {settlementGradientTable},
    watch: {
        
    }
}
</script>
<style scoped lang="scss">
 .mobile-error{
    color: #ff5555;
    position: absolute;
    bottom: -18px;
    left: 0px;
    width: auto;
    line-height: 1;
 }
 .fee-label-list{
    .ivu-form-item{
        margin-bottom: 0;
    }
}
</style>
<style lang="sass">
@import './lawyerAgreementForm.scss';
</style>
