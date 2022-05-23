<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-header">
                <span>调查协议信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="所属项目" prop="projectId">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects/list'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目名称 / 客户名称'"
                        :defaultObj="defaultProject"
                        :keyName="'name'"
                        @getValue="getProjectId">
                    </mySelect>
                </FormItem>
                <FormItem label="调查配置" prop="priceConfigId">
                    <mySelect ref="configSelect"
                        :path="'/settlement/agreementPriceInvestigatorConfigs'"
                        :placeholder="'请选择调查协议配置'"
                        :placeholderInput="'请输入调查协议配置'"
                        :defaultObj="defaultConfig"
                        :keyName="'name'"
                        @getValue="getConfigId">
                    </mySelect>
                </FormItem>
                <FormItem label="协议名称" prop="name">
                    <Input v-model.trim="formData.name" type="text" placeholder="请输入协议名称"></Input>
                </FormItem>
                <FormItem label="生效日期" prop="beginDate">
                    <DatePicker type="date" :options="dateOption" :value="formData.beginDate" format="yyyy-MM-dd" @on-change="getStartDate" placeholder="请选择任务生效日期" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem label="描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写描述"></Input>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>证据回购费用（线上）</span>
            </Row>
            <Row class="detail-content" style="margin-top:0px"  v-if="configInfo">
                <Row class="detail-form-block">
                    <Row class="detail-form-item">
                        <Row class="block-header">公证取证费</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">公证取证费：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.obtainEvidenceFee)}}</Col></Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">非公证取证费</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.timeStamp)}}</Col></Row>
                            <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.notarizationCloud)}}</Col></Row>
                            <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.ip360)}}</Col></Row>
                            <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.multimedia)}}</Col></Row>
                            <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">{{common.formateNumber(configInfo.configOnline.otherElectronicEvidence)}}</Col></Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">附加奖励费</Row>
                        <Row class="block-content">
                            <FormItem label="" :label-width=0>
                                <CheckboxGroup v-model="bonusOnline">
                                    <Checkbox style="width:100%;" :label="'firstReportManufacture'">
                                        <span class="checkbox-label">侵权目标是生产商且首次报备奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.firstReportManufacture)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'salesVolumeExceed10'">
                                        <span class="checkbox-label">销量超过10万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.salesVolumeExceed10)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'salesVolumeExceed30'">
                                        <span class="checkbox-label">销售量超过30万（不与10万叠加）奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.salesVolumeExceed30)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'oneNotarialDeedStep'">
                                        <span class="checkbox-label">同本公证书（包含多款产品），每增加一款奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.oneNotarialDeedStep)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'salesVolumeEncourage'">
                                        <span class="checkbox-label">销售额100万内每增加10万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.salesVolumeEncourage)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'salesVolumeMoreEncourage'">
                                        <span class="checkbox-label">销售额超100万每增加100万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.salesVolumeMoreEncourage)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'evidencePromptly'">
                                        <span class="checkbox-label">转案日起7日内标记“取证中”奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.evidencePromptly)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'notarialPromptly'">
                                        <span class="checkbox-label">标记“取证中”日起20日内出书奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.notarialPromptly)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'litigantPromptly'">
                                        <span class="checkbox-label">标记“取证中”日起30日内完成主体披露：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOnline.litigantPromptly)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'shoppingFee'">
                                        <span class="checkbox-label">购物费：</span>
                                        <span class="checkbox-text">{{configInfo.configOnline.shoppingFee?'超100的部分':'无'}}</span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>证据回购费用（线下）</span>
            </Row>
            <Row class="detail-content" style="margin-top:0px"  v-if="configInfo">
                <Row class="detail-form-block" style="padding-bottom:0">
                    <Row class="detail-form-item" style="margin-bottom:0">
                        <Row class="block-header">公证取证费</Row>
                        <FormItem label="" prop="gradeConfigId" :label-width=0>
                        <RadioGroup v-model="formData.gradeConfigId" vertical style="width:100%" @on-change="getGradeConfigId">
                            <Row class="block-content" v-for="(item,index) in configInfo.configOffline.gradeConfigList" :key="index">
                                <Row class="block-content-radio">
                                    <Radio :label="item.id"><span>{{item.grade}}等级</span></Radio>
                                </Row>
                                <Row class="block-content-grey">
                                    <Row><Col span="5" class="left-label">发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(item.subList[0].amount)}}</Col></Row>
                                    <Row><Col span="5" class="left-label">欠发达地区：</Col><Col span="16" class="right-content">{{common.formateNumber(item.subList[1].amount)}}</Col></Row>
                                </Row>
                            </Row>
                        </RadioGroup>
                        </FormItem>
                    </Row>
                </Row>
                <Row class="detail-form-block">
                    <Row class="detail-form-item">
                        <Row class="block-header">非公证取证费</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">时间戳：</Col><Col span="16" class="right-content">￥{{configInfo.configOffline.timeStamp}}</Col></Row>
                            <Row><Col span="5" class="left-label">公证云：</Col><Col span="16" class="right-content">￥{{configInfo.configOffline.notarizationCloud}}</Col></Row>
                            <Row><Col span="5" class="left-label">IP360：</Col><Col span="16" class="right-content">￥{{configInfo.configOffline.ip360}}</Col></Row>
                            <Row><Col span="5" class="left-label">拍照/录像：</Col><Col span="16" class="right-content">￥{{configInfo.configOffline.multimedia}}</Col></Row>
                            <Row><Col span="5" class="left-label">其他电子证据：</Col><Col span="16" class="right-content">￥{{configInfo.configOffline.otherElectronicEvidence}}</Col></Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">附加奖励费</Row>
                        <Row class="block-content">
                            <FormItem label="" :label-width=0>
                                <CheckboxGroup v-model="bonusOffline">
                                    <Checkbox style="width:100%;" :label="'firstReportManufactureOffline'">
                                        <span class="checkbox-label">侵权目标是生产商且首次报备奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOffline.firstReportManufacture)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'registeredCapitalExceed500Offline'">
                                        <span class="checkbox-label">侵权目标注册资本超过500万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOffline.registeredCapitalExceed500)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'oneNotarialDeedStepOffline'">
                                        <span class="checkbox-label">同本公证书（包含多款产品），每增加一款奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOffline.oneNotarialDeedStep)}}</span>
                                    </Checkbox>
                                    <!-- <Checkbox style="width:100%;" :label="'salesVolumeEncourageOffline'">
                                        <span class="checkbox-label">销售额100万内每增加10万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOffline.salesVolumeEncourage)}}</span>
                                    </Checkbox>
                                    <Checkbox style="width:100%;" :label="'salesVolumeMoreEncourageOffline'">
                                        <span class="checkbox-label">销售额超100万每增加100万奖励：</span>
                                        <span class="checkbox-text">{{common.formateNumber(configInfo.configOffline.salesVolumeMoreEncourage)}}</span>
                                    </Checkbox> -->
                                    <Checkbox style="width:100%;" :label="'shoppingFeeOffline'">
                                        <span class="checkbox-label">购物费：</span>
                                        <span class="checkbox-text">{{configInfo.configOffline.shoppingFee?'超100的部分':'无'}}</span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </Row>
                    </Row>
                </Row>
            </Row>
            <Row class="detail-btn-box">
                <!-- 新增 -->
                <span v-show="!detail">
                    <Button type="primary" style="margin-right:10px;" @click="submitNewSettlement('D')" :disabled="isSubmit">存为草稿</Button>
                    <Button type="primary" style="margin-right:10px;" v-permission="['agreement:investigator:audit-']" :disabled="isSubmit" @click="submitNewSettlement('E')">发布</Button>
                    <Button type="primary"  v-permission="['agreement:investigator:audit-',false]" :disabled="isSubmit" @click="submitNewSettlement('P')">发布</Button>
                </span>
                <!-- 编辑/复制 -->
                <span v-show="detail">
                    <Button v-show="detail.state!=='R'" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewSettlement('')">保存</Button>
                    <Button v-show="detail.state!=='E'" type="primary" style="margin-right:10px;" v-permission="['agreement:investigator:audit-']" :disabled="isSubmit" @click="submitNewSettlement('E')">发布</Button>
                    <Button v-show="detail.state!=='E'" type="primary"  v-permission="['agreement:investigator:audit-',false]" :disabled="isSubmit" @click="submitNewSettlement('P')">发布</Button>
                </span>
                <Button @click="$emit('changeEditCtrl',false)">取消</Button>

                <!-- <Button v-if="getState()" type="primary" style="margin-right:10px;" @click="submitNewSettlement('D')" :disabled="isSubmit">
                    {{detail&&detail.state==='D'?'保存':'存为草稿'}}
                </Button>
                <Button v-if="getState()" type="primary" style="margin-right:10px;" v-permission="['agreement:investigator:audit-']" :disabled="isSubmit" @click="submitNewSettlement('E')">发布</Button>
                <Button v-if="getState()" type="primary"  :disabled="isSubmit" v-permission="['agreement:investigator:audit-',false]" @click="submitNewSettlement('P')">发布</Button>
                <Button v-if="!getState()" type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewSettlement('P')">保存</Button> -->
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
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
            detailsCtrl:false,
            isSubmit:false,
            defaultProject:{},
            defaultConfig:{},//调查配置数据
            bonusOnline:[],
            bonusOffline:[],
            bonusOnlineList:[
                "firstReportManufacture",
                "salesVolumeExceed10",
                "salesVolumeExceed30",
                "oneNotarialDeedStep",
                "salesVolumeEncourage",
                "salesVolumeMoreEncourage",
                "evidencePromptly",
                "notarialPromptly",
                "litigantPromptly",
                "shoppingFee"
            ],
            bonusOfflineList:[
                "firstReportManufacture",
                "registeredCapitalExceed500",
                "oneNotarialDeedStep",
                // "salesVolumeEncourage",
                // "salesVolumeMoreEncourage",
                "shoppingFee"
            ],
            formData:{
                projectId:'',
                priceConfigId:'',// 调查配置id
                name:"",
                beginDate:'',
                remark:"",
                obtainEvidenceFee:"",
                timeStamp:"",
                notarizationCloud:'',
                ip360:"",
                multimedia:'',
                otherElectronicEvidence:'',
                // firstReportManufacture:'',
                // salesVolumeExceed10:"", 
                // salesVolumeExceed30:'',
                // oneNotarialDeedStep:'',
                // shoppingFee:"", 
                gradeConfigId:1,
                timeStampOffline:"", 
                notarizationCloudOffline:'',
                ip360Offline:"", 
                multimediaOffline:'',
                otherElectronicEvidenceOffline:'',
                // firstReportManufactureOffline:'',
                // registeredCapitalExceed500Offline:'',
                // oneNotarialDeedStepOffline:'',
                // shoppingFeeOffline:'',
            },
            ruleValidate:{
                projectId:[
                    {required: true,type:'number',message:'项目名称不能为空',trigger:'blur'}
                ],
                priceConfigId:[
                    {required: true,type:'number',message:'调查配置不能为空',trigger:'blur'}
                ],
                name:[
                    {required: true,message:'协议名称不能为空',trigger:'blur'},
                    {max:32,message:'不能超过32个字符',trigger:'blur'}
                ],
                beginDate:[
                    {required: true,validator:beginDatevalid,trigger:'change'}
                ],
                remark:[
                    {max:512,message:'不能超过512个字符',trigger:'blur'}
                ],
                gradeConfigId:[
                    {required: true,type:'number',message:'线下公证取证费不能为空',trigger:'blur'}
                ]
            },
            configInfo:'',
            dateOption:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
        }
    },
    props: ['detail','iscopy'],
    methods: {
        getState(){
            let bool;
            if(this.detail){
                if(this.detail.state==='D'||this.iscopy){
                    bool = true;
                }else{
                    bool = false;
                }
            }else{
                bool = true;
            }
            return bool;
        },
        submitNewSettlement(state){
            let url = '/settlement/agreement-price-investigator';
            let ajaxData = {
                online:{},
                offline:{}
            };
            this.bonusOnline.forEach(item=>{
                this.formData[item] = this.configInfo.configOnline[item];
            })
            this.bonusOffline.forEach(item=>{
                let key = item.slice(0,-7)
                this.formData[item] = this.configInfo.configOffline[key];
            })
            for(let key in this.formData){
                if(key==='gradeConfigId'){
                    ajaxData.offline[key] = this.formData[key];
                }else if(key.indexOf('Offline')!=-1){
                    let keyOffline = key.slice(0,-7);
                    ajaxData.offline[keyOffline] = this.formData[key];
                }else{
                    if(key=='projectId'||key==='name'||key==='remark'||key=='beginDate'||key=='priceConfigId'){
                        ajaxData[key] = this.formData[key]
                    }else{
                        ajaxData.online[key] = this.formData[key];
                    }
                }
            }
            // 编辑区域等级数据
            this.configInfo.configOffline.gradeConfigList.forEach(item => {
                if(this.formData.gradeConfigId == item.id){
                    ajaxData.offline.gradeConfig = Object.assign({},item)
                }
            })
            ajaxData.state = state?state:this.detail.state;
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.detail&&(!this.iscopy)){
                        url = '/settlement/agreement-price-investigator/'+this.detail.id;
                        ajaxData.offline.id = this.detail.offline.id;
                        ajaxData.online.id = this.detail.online.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.isSubmit = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$emit('changeEditCtrl',true);
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.isSubmit = false;
                        })
                    }
                }
            })
        },
        //获取项目id
        getProjectId(data){
            this.formData.projectId = data.id;
            this.$refs.formData.validateField('projectId');
        },
        //获取调查协议配置id
        getConfigId(data){
            this.formData.priceConfigId = data.id;
            this.getInvestConfigInfo(data.id)
            this.$refs.formData.validateField('priceConfigId');
        },
        //获取生效时间
        getStartDate(value){
            this.formData.beginDate = value;
        },
        //获取等级
        getGradeConfigId(data){
            this.formData.gradeConfigId = data;
        },
        //赋值
        getDetail(data, projectId){
            for(let key in this.formData){
                if(key.indexOf('Offline')!=-1){
                    let keyOffline = key.slice(0,-7);
                    this.formData[key] = data.configOffline[keyOffline];
                }else{
                    if(key!=='gradeConfigId'){
                        this.formData[key] = data.configOnline[key];
                    }else {
                        // 区域等级默认选择第一个
                        this.formData[key] = this.configInfo.configOffline.gradeConfigList[0].id
                    }
                    if(key=='beginDate'){
                        this.formData.beginDate = this.common.formatTime(new Date())
                    }
                    if(key=='projectId'){
                        this.formData.projectId = projectId
                    }
                }
            }
            if(this.detail){
                this.formData.projectId = this.detail.projectId;
                this.formData.priceConfigId = this.detail.priceConfigId;
                this.formData.name = this.detail.name;
                this.formData.beginDate = this.detail.beginDate;
                this.formData.remark = this.detail.remark;
                this.defaultProject = {
                    name:this.detail.projectName,
                    id:this.detail.projectId
                }
                this.defaultConfig = {
                    name:this.detail.configName,
                    id:this.detail.priceConfigId
                }
                this.$nextTick(function(){
                    this.$refs.projectSelect.voluation();
                    this.$refs.configSelect.voluation();
                })
                this.formData.gradeConfigId = this.detail.offline.gradeConfigId;
                //给奖励项赋值
                for(let i = 0; i < this.bonusOnlineList.length; i++){
                    let key = this.bonusOnlineList[i];
                    if(this.detail.online[key]){
                        this.bonusOnline.push(key)
                    }
                }
                for(let i = 0; i < this.bonusOfflineList.length; i++){
                    let key = this.bonusOfflineList[i];
                    if(this.detail.offline[key]){
                        this.bonusOffline.push(key+'Offline')
                    }
                }
            }
        },
        getInvestConfigInfo(id){
            let url = '/settlement/agreementPriceInvestigatorConfig/' + id;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.configInfo = res.data;
                    this.getDetail(res.data, this.formData.projectId);
                    this.detailsCtrl = true;
                }
            })
        }
    },
    created(){
        if(this.detail) {
            this.defaultProject = {
                name:this.detail.projectName,
                id:this.detail.projectId
            }
            this.defaultConfig = {
                name:this.detail.configName,
                id:this.detail.priceConfigId
            }
            this.$nextTick(function(){
                this.$refs.projectSelect.voluation();
                this.$refs.configSelect.voluation();
            })
            this.getInvestConfigInfo(this.detail.priceConfigId);
        }
    },
    beforeMount(){
        
    },
    mounted(){
        // this.getInvestConfigInfo();
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
.block-content .ivu-form-item-content .ivu-checkbox-group .ivu-checkbox-wrapper span.ivu-checkbox{
    float: left;
}
</style>
<style lang="sass">
@import './lawyerAgreementForm.scss';
</style>
