<template>
    <!-- 新增调查协议配置表单 -->
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>调查协议配置</span>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">调查配置名称</Row>
                    <Row class="block-content">
                        <FormItem label="调查配置名称" prop="configName">
                            <Input v-model="formData.configName" placeholder="请填写调查配置名称"></Input>
                        </FormItem>
                    </Row>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>证据回购费用（线上）</span>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content">
                        <FormItem label="公证取证费" prop="obtainEvidenceFee" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.obtainEvidenceFee"
                                :toFixed="2"
                                @getValue="getInputValue($event,'obtainEvidenceFee')"
                            ></my-input>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <FormItem label="时间戳" prop="timeStamp" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.timeStamp"
                                :toFixed="2"
                                @getValue="getInputValue($event,'timeStamp')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="公证云" prop="notarizationCloud" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.notarizationCloud"
                                :toFixed="2"
                                @getValue="getInputValue($event,'notarizationCloud')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="IP360" prop="ip360" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.ip360"
                                :toFixed="2"
                                @getValue="getInputValue($event,'ip360')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="拍照/录像" prop="multimedia" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.multimedia"
                                :toFixed="2"
                                @getValue="getInputValue($event,'multimedia')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="其他电子证据" prop="otherElectronicEvidence" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.otherElectronicEvidence"
                                :toFixed="2"
                                @getValue="getInputValue($event,'otherElectronicEvidence')"
                            ></my-input>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <FormItem label="生产商首次报备" prop="firstReportManufacture" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'侵权目标是生产商且首次报备奖励'"
                                appendText="￥" 
                                :defaultData="formData.firstReportManufacture"
                                :toFixed="2"
                                @getValue="getInputValue($event,'firstReportManufacture')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="销量超10万奖励" prop="salesVolumeExceed10" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销量超过10万奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeExceed10"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeExceed10')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="销量超30万奖励" prop="salesVolumeExceed30" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销量超过30万（不与10万叠加）奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeExceed30"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeExceed30')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="公证书含多款产品" prop="oneNotarialDeedStep" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'同本公证书（包含多款产品），每增加一款奖励'"
                                appendText="￥" 
                                :defaultData="formData.oneNotarialDeedStep"
                                :toFixed="2"
                                @getValue="getInputValue($event,'oneNotarialDeedStep')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="销售额百万内每十万" prop="salesVolumeEncourage" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销售额100万内每增加10万奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeEncourage"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeEncourage')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="销售额超百万每百万" prop="salesVolumeMoreEncourage" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销售额超100万每增加100万奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeMoreEncourage"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeMoreEncourage')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="转案7日内取证" prop="evidencePromptly" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'转案日起7日内标记“取证中”奖励'"
                                appendText="￥" 
                                :defaultData="formData.evidencePromptly"
                                :toFixed="2"
                                @getValue="getInputValue($event,'evidencePromptly')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="取证20日内出书" prop="notarialPromptly" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'标记“取证中”日起20日内出书奖励'"
                                appendText="￥" 
                                :defaultData="formData.notarialPromptly"
                                :toFixed="2"
                                @getValue="getInputValue($event,'notarialPromptly')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="取证30日内披露主体" prop="litigantPromptly" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'标记“取证中”日起30日内完成主体披露'"
                                appendText="￥" 
                                :defaultData="formData.litigantPromptly"
                                :toFixed="2"
                                @getValue="getInputValue($event,'litigantPromptly')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="购物费" prop="shoppingFee">
                            <span>超100的部分</span>
                        </FormItem>
                    </Row>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>证据回购费用（线下）</span>
            </Row>
            <Row class="detail-form-block">
                <Row class="detail-form-item">
                    <Row class="block-header">公证取证费</Row>
                    <Row class="block-content" v-for="(item,index) in formData.gradeConfigList" :key="index">
                        <Row class="block-content-title">
                            <span>{{item.grade}}等级</span>
                        </Row>
                        <Row class="block-content-grey">
                            <FormItem label="发达地区"
                                :prop="'gradeConfigList.' + index+'.DRamount'"
                                :rules="ruleValidate.subject">
                                <my-input v-if="detailsCtrl"
                                    appendText="￥" 
                                    :defaultData="item.DRamount"
                                    :toFixed="2"
                                    @getValue="getInputValue($event,'gradeConfigList','DRamount',index)"
                                ></my-input>
                            </FormItem>
                            <FormItem label="欠发达地区" 
                                :prop="'gradeConfigList.' + index+'.LAamount'"
                                :rules="ruleValidate.subject">
                                <my-input v-if="detailsCtrl"
                                    appendText="￥" 
                                    :defaultData="item.LAamount"
                                    :toFixed="2"
                                    @getValue="getInputValue($event,'gradeConfigList','LAamount',index)"
                                ></my-input>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">非公证取证费</Row>
                    <Row class="block-content">
                        <FormItem label="时间戳" prop="timeStampOffline">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.timeStampOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'timeStampOffline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="公证云" prop="notarizationCloudOffline">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.notarizationCloudOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'notarizationCloudOffline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="IP360" prop="ip360Offline">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.ip360Offline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'ip360Offline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="拍照/录像" prop="multimediaOffline">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.multimediaOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'multimediaOffline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="其他电子证据" prop="otherElectronicEvidenceOffline">
                            <my-input v-if="detailsCtrl"
                                appendText="￥" 
                                :defaultData="formData.otherElectronicEvidenceOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'otherElectronicEvidenceOffline')"
                            ></my-input>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-form-item">
                    <Row class="block-header">附加奖励费</Row>
                    <Row class="block-content">
                        <FormItem label="生产商首次报备" prop="firstReportManufactureOffline" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'侵权目标是生产商且首次报备奖励'"
                                appendText="￥" 
                                :defaultData="formData.firstReportManufactureOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'firstReportManufactureOffline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label=" 注册资本超500万" prop="registeredCapitalExceed500Offline" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'侵权目标注册资本超过500万奖励'"
                                appendText="￥" 
                                :defaultData="formData.registeredCapitalExceed500Offline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'registeredCapitalExceed500Offline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="公证书含多款产品" prop="oneNotarialDeedStepOffline" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'同本公证书（包含多款产品），每增加一款奖励'"
                                appendText="￥" 
                                :defaultData="formData.oneNotarialDeedStepOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'oneNotarialDeedStepOffline')"
                            ></my-input>
                        </FormItem>
                        <!-- <FormItem label="销售额百万内每十万" prop="salesVolumeEncourageOffline" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销售额100万内每增加10万奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeEncourageOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeEncourageOffline')"
                            ></my-input>
                        </FormItem>
                        <FormItem label="超百万增百万" prop="salesVolumeMoreEncourageOffline" :rules="isValid">
                            <my-input v-if="detailsCtrl"
                                :placeholder="'销售额超100万每增加100万奖励'"
                                appendText="￥" 
                                :defaultData="formData.salesVolumeMoreEncourageOffline"
                                :toFixed="2"
                                @getValue="getInputValue($event,'salesVolumeMoreEncourageOffline')"
                            ></my-input>
                        </FormItem> -->
                        <FormItem label="购物费" prop="shoppingFeeOffline">
                            <span>超100的部分</span>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-btn-box">
                    <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="confirmCtrl=true">提交</Button>
                    <Button @click="$emit('changeEditCtrl',false)">取消</Button>
                </Row>
            </Row>
        </Form>
        <!-- 二次确认 -->
        <Modal
            v-model="confirmCtrl"
            title="操作确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认提交？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="submitNewSettlement('formData')">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
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
        const isFillIn = (rule,value,callback) => {
            let arr = rule.fullField.split(".");
            let key = arr[0];
            let index = arr[1];
            let label = arr[2];
            if(!this.formData[key][index][label]){
                return callback(new Error('请输入金额'));
            }
            if(this.formData[key][index][label]&&Number(this.formData[key][index][label])==0){
                return callback(new Error('金额上限不能为0'));
            }if(this.formData[key][index][label]&&Number(this.formData[key][index][label])>100000000){
                return callback(new Error('金额上限不能超过一亿'));
            }
            callback()
        }
        return {
            confirmCtrl:false,
            detailsCtrl:false,
            validateMoney:validateMoney,
            isSubmit:false,
            formData:{
                configName:"", // 协议配置名称
                obtainEvidenceFee:"",
                timeStamp:"",
                notarizationCloud:'',
                ip360:"",
                multimedia:'',
                otherElectronicEvidence:'',
                firstReportManufacture:'',
                salesVolumeExceed10:"", 
                salesVolumeExceed30:'',
                oneNotarialDeedStep:'',
                salesVolumeEncourage:'',
                salesVolumeMoreEncourage:'',
                evidencePromptly:'',
                notarialPromptly:'',
                litigantPromptly:'',
                shoppingFee:"100.00", 
                gradeConfigList:[
                    {
                        grade:'',
                        DRamount:'',
                        LAamount:''
                    }
                ],
                timeStampOffline:"", 
                notarizationCloudOffline:'',
                ip360Offline:"", 
                multimediaOffline:'',
                otherElectronicEvidenceOffline:'',
                firstReportManufactureOffline:'',
                registeredCapitalExceed500Offline:'',
                oneNotarialDeedStepOffline:'',
                salesVolumeEncourageOffline:'',
                salesVolumeMoreEncourageOffline:'',
                shoppingFeeOffline:'100.00',
            },
            gradeConfigData:[], // 区域等级数据
            isValid: [{required: true,validator:validateMoney,trigger:'blur'}],
            ruleValidate:{
                configName:[
                    {required: true,message: '请输入调查协议配置名称',trigger:'blur'}
                ],
                shoppingFee:[
                    {required: true,type:'string',trigger:'blur'}
                ],
                subject:[{required: true,validator:isFillIn}],
                shoppingFeeOffline:[
                    {required: true,type:'string',trigger:'blur'}
                ]
            },
        }
    },
    props: ['configDetail'],
    methods: {
        submitNewSettlement(name){
            let url = '/settlement/agreementPriceInvestigatorConfig';
            let ajaxData = {
                configOffline:{},
                configOnline:{},
                name:this.formData.configName
            };
            for(let key in this.formData){
                if(key==='gradeConfigList'){
                    ajaxData.configOffline.gradeConfigList = this.formData.gradeConfigList.map(item=>{
                        return {
                            id:item.id,
                            grade: item.grade,
                            subList:[
                                {id:item.DRId,amount:item.DRamount,grade:item.DRgrade,sort:item.sort1},
                                {id:item.LAId,amount:item.LAamount,grade:item.LAgrade,sort:item.sort2}
                            ]
                        }
                    })
                }else if(key.indexOf('Offline')!=-1){
                    let keyOffline = key.slice(0,-7);
                    ajaxData.configOffline[keyOffline] = this.formData[key];
                }else{
                    ajaxData.configOnline[key] = this.formData[key];
                }
            }
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$emit('changeNewCtrl',true);
                        }
                        this.confirmCtrl = false;
                        this.isSubmit = false;
                    })
                }
            })
        },
        getInputValue(data,typeName,name,index){
            if(name){
                this.$set(this.formData[typeName][index],name,data);
            }else{
                this.formData[typeName] = data;
            }
        },
        // 获取区域等级数据
        getAgreementGrade(){
            let url = '/settlement/agreementPriceInvestigatorConfig/grade'
            this.$get(url).then(res=>{
                if(res.code === 0) {
                    this.gradeConfigData = res.data
                    this.getCustomerDetail(this.configDetail);
                }
            })
        },
        //赋值
        getCustomerDetail(data){
            for(let key in this.formData){
                if(key==='gradeConfigList'){
                    this.formData.gradeConfigList = this.gradeConfigData.map(item=>{
                        return {
                            grade:item.grade,
                            id:item.id,
                            sort1:item.subList[0].sort,
                            sort2:item.subList[1].sort,
                            DRId:item.subList[0].id,
                            LAId:item.subList[1].id,
                            DRgrade:item.subList[0].grade,
                            LAgrade:item.subList[1].grade,
                            DRamount:item.subList[0].amount,
                            LAamount:item.subList[1].amount
                        }
                    })
                }
            }
            this.formData.shoppingFee = '100.00';
            this.formData.shoppingFeeOffline = '100.00';
            this.detailsCtrl = true;
        },
    },
    created(){
        this.getAgreementGrade()
    },
    beforeMount(){
        
    },
    mounted(){
        // this.getCustomerDetail(this.configDetail);
        // this.detailsCtrl = true;
    },
    updated(){},
    components: {},
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
