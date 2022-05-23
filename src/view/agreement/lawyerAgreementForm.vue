<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="90">
            <Row class="detail-header">
                <span>律师协议信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="所属项目" prop="projectId">
                    <mySelect ref="projectSelect"
                        v-if="isBool"
                        :path="'/business/projects/list'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目名称 / 客户名称'"
                        :defaultObj="defaultProject"
                        :keyName="'name'"
                        @getValue="getProjectId">
                    </mySelect>
                </FormItem>
                <FormItem label="协议名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入协议名称"></Input>
                </FormItem>
                <FormItem label="生效日期" prop="beginDate">
                    <DatePicker type="date" :options="dateOption" :value="formData.beginDate" format="yyyy-MM-dd" @on-change="getStartDate" placeholder="请选择任务生效日期" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem label="描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" placeholder="请输入协议描述"></Input>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>结算规则</span>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">代理费</Row>
                    <Row class="block-content">
                        <FormItem label="代理费" prop="hasAgentFee">
                            <RadioGroup v-model="formData.hasAgentFee" @on-change="resetAgentFee">
                                <Radio :label="1">有代理费</Radio>
                                <Radio :label="0">无代理费</Radio>
                            </RadioGroup>
                        </FormItem>
                        <Row class="fee-full-list fee-label-list" v-if="formData.hasAgentFee==1">
                            <FormItem label="代理费金额" prop="agentFee" :rules="formData.hasAgentFee==1?[{required:true,message:'请输入代理费金额',trigger:'blur'},{validator:isOverMoney, trigger: 'blur'}]:{}">
                                <my-input
                                    v-if="isBool"
                                    :defaultData="formData.agentFee"
                                    appendText="￥" 
                                    :toFixed="2"
                                    @getValue="getInputValue($event,'agentFee')"
                                ></my-input>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">分成比例</Row>
                    <Row class="block-content">
                        <Row>
                            <settlementGradientTable ref="refSettlementGradient"
                                @getSettlementList="getSettlementList" 
                                :list="defaultSettlementList"></settlementGradientTable>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">奖励费用</Row>
                    <Row class="block-content">
                        <Row class="block-content-title">
                            <Row>
                                <div class="title-select">条件</div>
                                <div class="title-select-fee">奖励</div>
                            </Row>
                            <div>
                                <span class="icon-increase-01 add-icon" @click="addLoopFee('rewardFee')"></span>
                            </div>
                        </Row>
                        <Row class="fee-loop-list" v-for="(item,index) in formData.rewardFee" v-if="item.status==1" :key="index" >
                            <div class="require-tips">*</div>
                            <Row class="fee-loop-content">
                                <div class="fee-loop-select">
                                    <FormItem :label-width="0" :prop="'rewardFee.' + index +'.feeItemId'" :rules="ruleValidate.subject">
                                        <Select v-model="item.feeItemId" placeholder="请选择">
                                            <Option v-for="itemFee in rewardFeeList" :disabled="rewardFeeIdArr.indexOf(itemFee.id)!=-1" :value="itemFee.id" :key="itemFee.id">{{itemFee.name}}</Option>
                                        </Select>
                                    </FormItem>
                                </div>
                                <Row style="width:40%">
                                    <FormItem :label-width="0" :prop="'rewardFee.' + index +'.ratio'" :rules="ruleValidate.subject">
                                        <Row>
                                            <div class="fee-loop-select-prencent">
                                                <my-input
                                                    v-if="isBool"
                                                    :defaultData="item.ratio"
                                                    :disabled="item.fixedAmount!=''"
                                                    appendText="%"
                                                    :max="100"
                                                    :toFixed="2"
                                                    tips="请选择其中一种奖励方式填写"
                                                    @getValue="getInputValue($event,'rewardFee','ratio',index)"
                                                ></my-input>
                                            </div>
                                            <div class="fee-loop-select-amount">
                                                <my-input
                                                    v-if="isBool"
                                                    :defaultData="item.fixedAmount"
                                                    :disabled="item.ratio!=''"
                                                    appendText="￥" 
                                                    :toFixed="2"
                                                    tips="请选择其中一种奖励方式填写"
                                                    @getValue="getInputValue($event,'rewardFee','fixedAmount',index)"
                                                ></my-input>
                                            </div>
                                        </Row>
                                    </FormItem>
                                </Row>
                            </Row>
                            <div class="fee-loop-icon" v-if="index!=0">
                                <span class="icon-down-01 remove-icon" @click="removeLoopFee('rewardFee',index)"></span>
                            </div>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加管理费</Row>
                    <Row class="block-content">
                        <Row class="block-content-title">
                            <Row>
                                <div class="title-select">条件</div>
                                <div class="title-select-fee">附加费</div>
                            </Row>
                            <div>
                                <span class="icon-increase-01 add-icon" @click="addLoopFee('additionalFee')"></span>
                            </div>
                        </Row>
                        <Row class="fee-loop-list" v-for="(item,index) in formData.additionalFee" v-if="item.status==1" :key="index">
                            <div class="require-tips">*</div>
                            <Row class="fee-loop-content">
                                <div class="fee-loop-select float-div">
                                    <FormItem :label-width="0" :prop="'additionalFee.' + index +'.feeItemId'" :rules="ruleValidate.subject">
                                        <Select v-model="item.feeItemId" placeholder="请选择">
                                            <Option v-for="itemFee in additionalFeeList" :disabled="additionalFeeIdArr.indexOf(itemFee.id)!=-1" :value="itemFee.id" :key="itemFee.id">{{itemFee.name}}</Option>
                                        </Select>
                                    </FormItem>
                                </div>
                                <Row style="width:40%">
                                    <FormItem :label-width="0" :prop="'additionalFee.' + index +'.ratio'" :rules="ruleValidate.subject">
                                        <Row>
                                            <div class="fee-loop-select-prencent">
                                                <my-input
                                                    v-if="isBool"
                                                    :defaultData="item.ratio"
                                                    :disabled="item.fixedAmount!=''"
                                                    appendText="%"
                                                    :max="100"
                                                    :toFixed="2"
                                                    tips="请选择其中一种方式填写"
                                                    @getValue="getInputValue($event,'additionalFee','ratio',index)"
                                                ></my-input>
                                            </div>
                                            <div class="fee-loop-select-amount">
                                                <my-input
                                                    v-if="isBool"
                                                    :defaultData="item.fixedAmount"
                                                    :disabled="item.ratio!=''"
                                                    appendText="￥" 
                                                    :toFixed="2"
                                                    tips="请选择其中一种方式填写"
                                                    @getValue="getInputValue($event,'additionalFee','fixedAmount',index)"
                                                ></my-input>
                                            </div>
                                        </Row>
                                    </FormItem>
                                </Row>
                            </Row>
                            <div class="fee-loop-icon" v-if="index!=0">
                                <span class="icon-down-01 remove-icon" @click="removeLoopFee('additionalFee',index)"></span>
                            </div>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">安盾终止补偿</Row>
                    <Row class="block-content">
                        <Row class="fee-full-list fee-label-list">
                            <FormItem label="立案前" :label-width="60" prop="terminationCaseBeforeAmount">
                                <my-input
                                    v-if="isBool"
                                    :defaultData="formData.terminationCaseBeforeAmount"
                                    appendText="￥" 
                                    :toFixed="2"
                                    @getValue="getInputValue($event,'terminationCaseBeforeAmount')"
                                ></my-input>
                            </FormItem>
                        </Row>
                        <Row class="fee-full-list fee-label-list">
                            <FormItem label="立案后" :label-width="60" prop="terminationCaseAfterFixedAmount">
                                <Row>
                                    <Col :span="17">
                                        <my-input
                                            v-if="isBool"
                                            :defaultData="formData.terminationCaseAfterFixedAmount"
                                            :disabled="formData.terminationCaseAfterRatio!=''"
                                            appendText="￥"
                                            tips="请选择其中一种补偿填写"
                                            :toFixed="2"
                                            @getValue="getInputValue($event,'terminationCaseAfterFixedAmount')"
                                        ></my-input>
                                    </Col>
                                    <Col :span="6" :offset="1">
                                        <my-input
                                            v-if="isBool"
                                            :defaultData="formData.terminationCaseAfterRatio"
                                            :disabled="formData.terminationCaseAfterFixedAmount!=''"
                                            appendText="%"
                                            :max="100"
                                            tips="请选择其中一种补偿方式填写"
                                            @getValue="getInputValue($event,'terminationCaseAfterRatio')"
                                        ></my-input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-btn-box">
                    <!-- 新增 -->
                    <span v-show="!agreementDetail">
                        <Button type="primary" style="margin-right:10px;" @click="submitAgreement('D')" :disabled="isSubmit">存为草稿</Button>
                        <Button type="primary" style="margin-right:10px;" v-permission="['agreement:lawyer:audit-']" :disabled="isSubmit" @click="submitAgreement('E')">发布</Button>
                        <Button type="primary"  v-permission="['agreement:lawyer:audit-',false]" :disabled="isSubmit" @click="submitAgreement('P')">发布</Button>
                    </span>
                    <!-- 编辑/复制 -->
                    <span v-show="agreementDetail">
                        <Button v-show="agreementDetail.state!=='R'" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitAgreement('')">保存</Button>
                        <Button v-show="agreementDetail.state!=='E'" type="primary" style="margin-right:10px;" v-permission="['agreement:lawyer:audit-']" :disabled="isSubmit" @click="submitAgreement('E')">发布</Button>
                        <Button v-show="agreementDetail.state!=='E'" type="primary"  v-permission="['agreement:lawyer:audit-',false]" :disabled="isSubmit" @click="submitAgreement('P')">发布</Button>
                    </span>
                    <Button @click="$emit('changeEditCtrl',false)">取消</Button>

                    <!-- <Button v-if="getState()" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitAgreement('D')">
                        {{agreementDetail&&agreementDetail.state==='D'?'保存':'存为草稿'}}
                    </Button>
                    <Button v-if="getState()" type="primary" style="margin-right:10px;" v-permission="['agreement:lawyer:audit-']" :disabled="isSubmit" @click="submitAgreement('E')">发布</Button>
                    <Button v-if="getState()"  type="primary" v-permission="['agreement:lawyer:audit-',false]" :disabled="isSubmit" @click="submitAgreement('P')">发布</Button>
                    <Button v-if="!getState()" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitAgreement('P')">保存</Button> -->
                </Row>
            </Row>
        </Form>
    </div>
</template>
<script>
import settlementGradientTable from '@/components/common/settlementGradientTable/index.vue'
import { valid } from 'semver';
export default {
    data () {
        const isOverMoney = (rule, value, callback) => {
            let key = rule.fullField;
            if(this.formData[key]&&Number(this.formData[key])>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            if(this.formData[key]&&Number(this.formData[key])<0){
                return callback(new Error('金额不能小于0'));
            }
            callback();
        };
        const isHaveTermination = (rule, value, callback) => {
            if(this.formData.terminationCaseAfterFixedAmount == "" && this.formData.terminationCaseAfterRatio == ""){
                return callback(new Error('请填写其中一种补偿费用方式'));
            }
            if(this.formData.terminationCaseAfterFixedAmount&&Number(this.formData.terminationCaseAfterFixedAmount)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            if(this.formData.terminationCaseAfterFixedAmount&&Number(this.formData.terminationCaseAfterFixedAmount)<0){
                return callback(new Error('金额不能小于0'));
            }
            if(this.formData.terminationCaseAfterRatio&&Number(this.formData.terminationCaseAfterRatio)>100){
                return callback(new Error('比例不能超过100'));
            }
            if(this.formData.terminationCaseAfterRatio&&Number(this.formData.terminationCaseAfterRatio)<0){
                return callback(new Error('比例不能小于0'));
            }
            callback();
        };
        const isFillIn = (rule, value, callback) => {
            let arr = rule.fullField.split(".");
            let fillKey = arr[0];
            let fillIndex = arr[1];
            let fillValidKey = arr[2];
            if(fillValidKey=="feeItemId"){
                if(this.formData[fillKey][fillIndex][fillValidKey] == ""){
                    return callback(new Error('请选择条件'));
                }
            }else{
                if(this.formData[fillKey][fillIndex].ratio == "" && this.formData[fillKey][fillIndex].fixedAmount == ""){
                    return callback(new Error('请填写其中一种方式'));
                }
                if(this.formData[fillKey][fillIndex].fixedAmount&&Number(this.formData[fillKey][fillIndex].fixedAmount)<=0){
                    return callback(new Error('金额必须大于0'));
                }
                if(this.formData[fillKey][fillIndex].fixedAmount&&Number(this.formData[fillKey][fillIndex].fixedAmount)>100000000){
                    return callback(new Error('金额不能超过一亿'));
                }
                if(this.formData[fillKey][fillIndex].ratio&&Number(this.formData[fillKey][fillIndex].ratio)<=0){
                    return callback(new Error('比例必须大于0'));
                }
                if(this.formData[fillKey][fillIndex].ratio&&Number(this.formData[fillKey][fillIndex].ratio)>100){
                    return callback(new Error('比例不能超过100'));
                }
            }
            callback();
        };
        const beginDatevalid = (rule, value, callback) => {
            if(!value){
                return callback(new Error('生效时间不能为空'))
            }
            if(value && new Date(value) < Date.now() - 86400000){
                return callback(new Error('生效时间不能早于今天'))
            }
            callback()
        }
        return {
            isBool:false,
            isSubmit:false,
            defaultProject:{
                id:"",
                name:""
            },
            formData:{
                name:"",
                beginDate:this.common.formatTime(new Date()),
                remark:"",
                hasAgentFee:1,
                projectId:"",
                agentFee:"",
                rewardFee:[
                    {
                        feeItemId:"",
                        fixedAmount:"",
                        ratio:"",
                        index:1,
                        status:1,
                        feeType:"R"
                    }
                ],
                additionalFee:[{
                    feeItemId:"",
                    ratio:"",
                    fixedAmount:"",
                    index:1,
                    status:1,
                    feeType:"S"
                }],
                terminationCaseBeforeAmount:"",
                terminationCaseAfterFixedAmount:"",
                terminationCaseAfterRatio:"",
                ratioList:[]
            },
            isOverMoney:isOverMoney,
            ruleValidate:{
                projectId:[{required:true,type:'number',message:"请选择项目",trigger:"blur"}],
                name:[
                    {required:true,message:"请输入协议名称",trigger:"blur"},
                    {max:32,message:'不能超过32个字符',trigger:'blur'}
                ],
                beginDate:[{required: true,validator:beginDatevalid,trigger:'change'}],
                terminationCaseBeforeAmount:[{required:true,message:"请输入补偿费用",trigger:"blur"},{validator:isOverMoney, trigger: 'blur'}],
                terminationCaseAfterFixedAmount:[{required:true,validator:isHaveTermination, trigger: 'blur'}],
                subject:[{validator:isFillIn}],
                ratioList:[
                    {required: true,type:'array',message:'比例规则不能为空',trigger:'change'}
                ],
                remark:[
                    {max:512,message:'不能超过512个字符',trigger:'blur'}
                ],
            },
            rewardFeeIndex:1,
            additionalFeeIndex:1,
            rewardFeeList:[],
            additionalFeeList:[],
            defaultSettlementList:[],
            dateOption:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
        }
    },
    props: ['agreementDetail','iscopy'],
    methods: {
        getState(){
            let bool;
            if(this.agreementDetail){
                if(this.agreementDetail.state==='D'||this.iscopy){
                    bool = true;
                }else{
                    bool = false;
                }
            }else{
                bool = true;
            }
            return bool;
        },
        getProjectId(data){
            this.formData.projectId = data.id;
        },
        //获取生效时间
        getStartDate(value){
            console.log(value)
            this.formData.beginDate = value;
        },
        // 查询费用科目
        getAgreementItems(type){
            let url = '/settlement/agreement-price-items?feeType='+type;
            this.$get(url).then(res=>{
                if(type=="R"){  
                    this.rewardFeeList = res.data;
                }else if(type="S"){
                    this.additionalFeeList = res.data;
                }
            });
        },
        addLoopFee(name){
            let obj = { feeItemId:"",fixedAmount:"",ratio:"",status:1 };
            if(name == "rewardFee"){
                this.rewardFeeIndex++;
                obj.index = this.rewardFeeIndex;
                obj.feeType = "R";
                this.formData.rewardFee.push(obj)
            }else if(name == "additionalFee"){
                this.additionalFeeIndex++;
                obj.index = this.additionalFeeIndex;
                obj.feeType = "S";
                this.formData.additionalFee.push(obj)
            }
        },
        removeLoopFee(name,index){
            this.$set(this.formData[name][index],"status",0);
        },
        // myInput赋值
        getInputValue(data,typeName,name,index){
            if(name){
                this.$set(this.formData[typeName][index],name,data);
            }else{
                this.formData[typeName] = data;
            }
        },
        getSettlementList(data){
            this.formData.ratioList = data;
        },
        resetAgentFee(data){
            this.formData.agentFee = "";
        },
        // 编辑赋默认值
        giveDefaultData(){
            this.isBool = false;
            this.defaultProject.id = this.agreementDetail.projectId || "";
            this.defaultProject.name = this.agreementDetail.projectName || "";
            this.formData.projectId = this.agreementDetail.projectId;
            this.formData.name = this.agreementDetail.name;
            this.formData.beginDate = this.agreementDetail.beginDate;
            this.formData.remark = this.agreementDetail.remark;
            this.formData.hasAgentFee = this.agreementDetail.agentFee?1:0;
            this.formData.agentFee = this.agreementDetail.agentFee || "";
            this.formData.terminationCaseBeforeAmount = this.agreementDetail.terminationCaseBeforeAmount || "";
            this.formData.terminationCaseAfterFixedAmount = this.agreementDetail.terminationCaseAfterFixedAmount || "";
            this.formData.terminationCaseAfterRatio = this.agreementDetail.terminationCaseAfterRatio || "";
            this.formData.ratioList = this.agreementDetail.ratioList || [];
            this.defaultSettlementList = this.agreementDetail.ratioList;

            let rIndex = 0;
            let aIndex = 0;
            this.agreementDetail.additionalFeeList.forEach((item,index)=>{
                let obj = {
                    feeType:item.feeType,
                    feeItemId:item.feeItemId,
                    fixedAmount:item.fixedAmount || "",
                    ratio:item.ratio || "",
                    index:1,
                    status:1,
                }
                if(item.feeType=="R"){
                    rIndex++;
                    obj.index = rIndex;
                    this.$set(this.formData.rewardFee,rIndex-1,obj);
                }else if(item.feeType=="S"){
                    aIndex++;
                    obj.index = aIndex;
                    this.$set(this.formData.additionalFee,aIndex-1,obj);
                }
            })

            this.$nextTick(function(){
                this.$refs.refSettlementGradient.voluation();
                this.$refs.projectSelect.voluation();
            })

            this.isBool = true;
        },
        // 组装数据
        assemableData(){
            let arr = this.formData;
            let obj = { additionalFeeList:[] };
            for(let key in arr){
                if(key != "rewardFee" && key != "additionalFee"){
                    obj[key] = arr[key];
                }else{
                    arr[key].forEach((item,index)=>{
                        if(item.status==1){
                            obj.additionalFeeList.push({
                                feeItemId:item.feeItemId,
                                feeType:item.feeType,
                                ratio:item.ratio,
                                fixedAmount:item.fixedAmount
                            })
                        }
                    })
                }
            }
            return obj
        },
        // 提交数据
        submitAgreement(state){
            let url;
            let isGoOn = true;
            let ajaxData = this.assemableData();
            ajaxData.state = state?state:this.agreementDetail.state;
            this.$refs.refSettlementGradient.submitValid();
            if(this.formData.ratioList.length==0){
                isGoOn = false;
            }
            this.$refs['formData'].validate((valid) => {
                if(valid&&isGoOn){
                    if(this.agreementDetail&&(!this.iscopy)){
                        ajaxData.id = this.agreementDetail.id;
                        url = '/settlement/agreement-price-lawyers/'+this.agreementDetail.id;
                        this.isSubmit = true;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        });
                    }else{
                        this.isSubmit = true;
                        url = '/settlement/agreement-price-lawyer';
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        });
                    }
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getAgreementItems("R");
        this.getAgreementItems("S");
    },
    mounted(){
        if(this.agreementDetail){
            this.giveDefaultData();
        }else{
            this.isBool = true;
        }
    },
    updated(){},
    computed:{
        rewardFeeIdArr(){
            let arr = [];
            this.formData.rewardFee.forEach((item,index)=>{
                if(item.status==1&&item.feeItemId){
                    arr.push(item.feeItemId);
                }
            })
            return arr
        },
        additionalFeeIdArr(){
            let arr = [];
            this.formData.additionalFee.forEach((item,index)=>{
                if(item.status==1&&item.feeItemId){
                    arr.push(item.feeItemId);
                }
            })
            return arr
        }
    },
    components: {
        settlementGradientTable
    },
    watch: {}
}
</script>
<style lang="scss">
.fee-loop-list{
    .ivu-input-group-prepend, .ivu-input-group-append{
        background: #fff;
    }
}
.fee-label-list,.fee-loop-list{
    .ivu-form-item{
        margin-bottom: 0;
    }
}
</style>
<style lang="scss">
@import "./lawyerAgreementForm.scss";
</style>
