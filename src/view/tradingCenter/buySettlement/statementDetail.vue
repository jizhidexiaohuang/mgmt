<template>
    <div class="statement-detail">
        <slot name='close-icon'></slot>
        <div class="statement-title">
            结算单详情
            <slot name='operate-box'></slot>
        </div>
        <div class="statement-main">
            <Spin size="large" fix v-if="detailLoading"></Spin>
            <Row class="detail-header">
                <span>结算单信息</span>
                <span class="result-title-option" v-if="data.state === 'E'">
                    <Dropdown @on-click="option(data,$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="printSettlement">打印结算单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
            </Row>
            <div class="info-main">
                <Row class="row-border">
                    <Col span="5" class="tr-header">结算单编号:</Col>
                    <Col span="19">{{data.code}}</Col>
                </Row>
                <Row class="row-border">
                    <Col span="5" class="tr-header">公证费账户信息:</Col>
                    <Col span="19">
                        <span>{{data.bankUserCertificate}}-{{data.bankNameCertificate}}-{{data.cardNumberCertificate}}</span>
                    </Col>
                </Row>
                <Row class="row-border">
                    <Col span="5" class="tr-header">服务费账户信息:</Col>
                    <Col span="19">
                        <span>{{data.bankUserService}}-{{data.bankNameService}}-{{data.cardNumberService}}</span>
                    </Col>
                </Row>
                <Row class="row-border">
                    <Col span="5" class="tr-header">申请团队:</Col>
                    <Col span="3">{{data.teamName}}</Col>
                    <Col span="5" class="tr-header">案件数量:</Col>
                    <Col span="3">{{data.caseNum}}</Col>
                    <Col span="5" class="tr-header">申请时间:</Col>
                    <Col span="3">{{ data.createTime && data.createTime.split('T')[0]}}</Col>
                </Row>
                <Row class="row-border" style="border-bottom:1px solid #eee;">
                    <Col span="5" class="tr-header">公证费用总计:</Col>
                    <Col span="3" class="money-styles">{{common.formateNumber(data.totalEvidAmount)}}</Col>
                    <Col span="5" class="tr-header">服务费用总计:</Col>
                    <Col span="3" class="money-styles">{{common.formateNumber(data.totalServiceAmount)}}</Col>
                    <Col span="5" class="tr-header">总费用:</Col>
                    <Col span="3" class="money-styles">{{common.formateNumber(data.totalAmount)}}</Col>
                </Row>
            </div>
            <Row class="detail-header">
                <Checkbox :indeterminate="onlineCheckObj.onlineIndeterminate" v-model="onlineCheckObj.onlineCheck" @on-change="checkAll($event,'online')"></Checkbox>
                <span>线上案件信息</span>
                <span class="result-title-option" v-if="data.state === 'P'">
                    <Dropdown transfer @on-click="option(data,$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="rejectedCase" :disabled="ids.length == 0">批量驳回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
            </Row>
            <!-- 线上表格 -->
            <ul class="list">
                <li v-for="(item,index) in data.onlinePurchaseStatementDetailList" :key="index" class="li-box">
                    <div class="list-header">
                        <span @click="getListContent(item)" style="cursor:pointer">
                            <Icon v-if="!item.listContentState" type="ios-arrow-dropright-circle" size="16" :color="styles.globalMainColor"/>
                            <Icon v-else type="ios-arrow-dropdown-circle" size="16" :color="styles.globalMainColor"/>
                        </span>
                        <span v-if="data.state == 'P'" @click="caseCheck(item)">
                            <Checkbox v-model="item.checkoption"></Checkbox>
                        </span>
                        <span class="result-code" @click="getCaseDetail(item.caseId)">[案件编号：{{item.casePurchaseStatementDetailExtend.caseCode}}]</span>
                        <span class="result-projectname">{{item.casePurchaseStatementDetailExtend.projectName}}</span>
                        <span class="notarial-code textover" :title="item.casePurchaseStatementDetailExtend.certificateNo">
                            <span class="tr-notarial">
                                公证书号：{{item.casePurchaseStatementDetailExtend.certificateNo}}
                            </span>
                        </span>
                        <span class="result-title-option" v-if="data.state === 'P'">
                            <Dropdown transfer @on-click="option(item,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="rejectedCaseOne">驳回</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </span>
                    </div>
                    <div :class="[item.listContentState?'list-content-box':'hidden']">
                        <Row>
                            <Col span="6">
                                <span>店铺名称：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.storeName}}</span>
                            </Col>
                            <Col span="6">
                                <span>侵权方式：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.tortTypeName || '-'}}</span>
                            </Col>
                            <Col span="12">
                                <span>渠道：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.channelTypeZh || '-'}}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6">
                                <span>销售商：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.tortSubject || '-'}}</span>
                            </Col>
                            <Col span="18">
                                <span>生产商：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.manufacturerName || '-'}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="list-basic-box">
                        <div>
                            <span>基本服务费：</span>
                            <span>{{item.baseFee}}元</span>
                        </div>
                        <div>
                            <span>其它公证奖励(已包含在基础服务费)</span>
                            <span>{{item.otherCertificateFee}}元</span>
                        </div>
                        <div>
                            <span>超过100元购物费：</span>
                            <span>{{item.shoppingFee}}元</span>
                        </div>
                        <div>
                            <span>侵权目标是生产商且首次报备：</span>
                            <span>{{item.firstReportManufactureFee}}元</span>
                        </div>
                        <div>
                            <span>销量超10w奖励：</span>
                            <span>{{item.salesVolumeExceed10Fee}}元</span>
                        </div>
                        <div>
                            <span>销量超30w奖励：</span>
                            <span>{{item.salesVolumeExceed30Fee}}元</span>
                        </div>
                        <div>
                            <span>销售额奖励：</span>
                            <span>{{item.salesRewardFee}}元</span>
                        </div>
                        <div>
                            <span>取证及时奖励：</span>
                            <span>{{item.evidTimelyFee}}元</span>
                        </div>
                        <div>
                            <span>出书及时奖励：</span>
                            <span>{{item.notarialTimelyFee}}元</span>
                        </div>
                        <div>
                            <span>披露及时奖励：</span>
                            <span>{{item.disclosureTimelyFee}}元</span>
                        </div>
                        <div style="display:flex;">
                            <span>含多款侵权产品：</span>
                            <span>{{item.infringProductFee}}元</span>
                        </div>
                        <div>
                            <span>总服务费：</span>
                            <span>{{item.totalServiceAmount}}元</span>
                        </div>
                        <div>
                            <span>公证费：</span>
                            <span>{{item.totalEvidAmount}}元</span>
                        </div>
                        <div>
                            <span>总费用合计：</span>
                            <span class="money-styles">{{item.totalAmount}}元</span>
                        </div>
                    </div>
                </li>
                <!-- <li v-if="data.onlinePurchaseStatementDetailList.length==0" class="no-data-tips">暂无数据</li> -->
            </ul>
            <Row class="detail-header">
                <Checkbox :indeterminate="offlineCheckObj.offlineIndeterminate" v-model="offlineCheckObj.offlineCheck" @on-change="checkAll($event,'offline')"></Checkbox>
                <span>线下案件信息</span>
                <span class="result-title-option" v-if="data.state === 'P'">
                    <Dropdown transfer @on-click="option(data,$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="rejectedCase" :disabled="ids.length == 0">批量驳回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
            </Row>
            <!-- 线下表格 -->
            <ul class="list">
                <li v-for="(item,index) in data.offlinePurchaseStatementDetailList" :key="index" class="li-box">
                    <div class="list-header">
                        <span @click="getListContent(item)" style="cursor:pointer">
                            <Icon v-if="!item.listContentState" type="ios-arrow-dropright-circle" size="16" :color="styles.globalMainColor"/>
                            <Icon v-else type="ios-arrow-dropdown-circle" size="16" :color="styles.globalMainColor"/>
                        </span>
                        <span @click="caseCheck(item)">
                            <Checkbox v-model="item.checkoption"></Checkbox>
                        </span>
                        <span class="result-code"  @click="getCaseDetail(item.caseId)">[案件编号：{{item.casePurchaseStatementDetailExtend.caseCode}}]</span>
                        <span class="result-projectname">{{item.casePurchaseStatementDetailExtend.projectName}}</span>
                        <span class="notarial-code" :title="item.casePurchaseStatementDetailExtend.certificateNo" @click="getCaseDetail(item.caseId)">
                            <span class="tr-notarial">
                                公证书号：{{item.casePurchaseStatementDetailExtend.certificateNo || '-'}}
                            </span>
                        </span>
                        <span class="result-title-option" v-if="data.state === 'P'">
                            <Dropdown transfer @on-click="option(item,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="rejectedCaseOne">驳回</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </span>
                    </div>
                    <div :class="[item.listContentState?'list-content-box':'hidden']">
                        <Row>
                            <Col span="6">
                                <span>店铺名称：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.storeName}}</span>
                            </Col>
                            <Col span="6">
                                <span>侵权方式：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.tortTypeName || '-'}}</span>
                            </Col>
                            <Col span="12">
                                <span>渠道：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.channelTypeZh || '-'}}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6">
                                <span>销售商：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.tortSubject || '-'}}</span>
                            </Col>
                            <Col span="18">
                                <span>生产商：</span>
                                <span>{{item.casePurchaseStatementDetailExtend.manufacturerName || '-'}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="list-basic-box">
                        <div>
                            <span>基本服务费: </span>
                            <span>{{item.baseFee}}元</span>
                        </div>
                        <div>
                            <span>其它公证奖励(已包含在基础服务费)</span>
                            <span>{{item.otherCertificateFee}}元</span>
                        </div>
                        <div style="display:flex;">
                            <span>超过100元购物费：</span>
                            <span>{{item.shoppingFee}}元</span>
                        </div>
                        <div>
                            <span>侵权目标是生产商且首次报备：</span>
                            <span>{{item.firstReportManufactureFee}}元</span>
                        </div>
                        <div style="display:flex;">
                            <span>侵权目标注册资本超过500万的(多个侵权主体不重复计提)：</span>
                            <span>{{item.capitalExcessFee}}元</span>
                        </div>
                        <div style="display:flex;">
                            <span>含多款侵权产品：</span>
                            <span>{{item.infringProductFee}}元</span>
                        </div>
                        <div>
                            <span>总服务费：</span>
                            <span>{{item.totalServiceAmount}}元</span>
                        </div>
                        <div>
                            <span>公证费：</span>
                            <span>{{item.totalEvidAmount}}元</span>
                        </div>
                        <div>
                            <span>总费用合计：</span>
                            <span class="money-styles">{{item.totalAmount}}元</span>
                        </div>
                    </div>
                </li>
                <!-- <li v-if="data.offlinePurchaseStatementDetailList.length==0" class="no-data-tips">暂无数据</li> -->
            </ul>
            <Row class="detail-header">
                <span>备注</span>
            </Row>
            <div class="remarks">
                <div class="remarks-box">{{data.remark}}</div>
            </div>
        </div>
        <Modal title="提示" v-model="rejectCtrl" class-name="vertical-center-modal" :footer-hide="true" width="400">
            <!-- <p style="font-size:14px;margin-bottom:10px;">是否驳回选中案件？</p> -->
            <Form ref="formValidate" v-if="rejectCtrl" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                <FormItem label="驳回原因" prop="desc">
                    <Input v-model.trim="formValidate.desc" type="textarea" :autosize="{minRows: 5,maxRows: 7}" placeholder="驳回原因"></Input>
                </FormItem>
            </Form>
            <div style="text-align:center;margin-top:20px;">
                <Button type="primary" @click="caseRemove('formValidate')">确认</Button>
                <Button @click="rejectCtrl=false">取消</Button>
            </div>
        </Modal>
        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="800"
            title="案件详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <case-info v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-info>
        </Drawer>
        <Modal v-model="printCtrl" class-name="vertical-center-modal" :footer-hide="true" fullscreen>
            <settlement-print v-if="printCtrl" :settlementDetail="data"></settlement-print>
        </Modal>
    </div>
</template>

<script>
import styles from '@/assets/globalStyle.scss';
import caseInfo from '../buyBack/caseInfo.vue';
import settlementPrint from './plugin/settlementPrint'
export default {
    data () {
        return {
            styles:styles,
            single: '',
            model1: '0',
            id:'',
            ids: [], //要驳回的案件id
            rejectedRemark: '',//要驳回的案件原因
            searchForm:{},
            data:[], //所有数据
            tableData:[],
            removeCtrl:false, //删除弹窗
            remarksData: '', // 备注
            type:'',
            caseInfoCtrl:false, //案件详情
            caseDetail: [], // 案件详情数据
            rejectCtrl:false, //驳回
            batchCtrl:false, //是否批量
            printCtrl:false, //打印结算单弹窗
            formValidate:{
                desc:''
            },
            ruleValidate: {
                desc: [
                    { required: true, message: '请输入驳回理由', trigger: 'blur' }
                ]
            },
            detailLoading:true,
        }
    },
    props: ['statementDetailId'],
    computed:{
        onlineCheckObj(){
            let onlineArr = this.data.onlinePurchaseStatementDetailList || [];
            let obj = {
                onlineIndeterminate:false,
                onlineCheck:false,
            }
            let onlineCount = 0;
            onlineArr.forEach((item,index)=>{ 
                if(item.checkoption){ onlineCount++ } 
            })
            if(onlineCount==onlineArr.length && onlineCount!=0){
                obj.onlineIndeterminate = false;
                obj.onlineCheck = true;
            }else if(onlineCount!=onlineArr.length && onlineCount!=0){
                obj.onlineIndeterminate = true;
                obj.onlineCheck = false;
            }
            return obj
        },
        offlineCheckObj(){
            let offlineArr = this.data.offlinePurchaseStatementDetailList || [];
            let obj = {
                offlineIndeterminate:false,
                offineCheck:false,
            }
            let offlineCount = 0;
            offlineArr.forEach((item,index)=>{ 
                if(item.checkoption){ offlineCount++ } 
            })
            if(offlineCount==offlineArr.length && offlineCount!=0){
                obj.onlineIndeterminate = false;
                obj.onlineCheck = true;
            }else if(offlineCount!=offlineArr.length && offlineCount!=0){
                obj.offlineIndeterminate = true;
                obj.offineCheck = false;
            }
            return obj
        }
    },
    methods: {
        getData(){
            let url = `/settlement/trade/purchase/statement/${this.statementDetailId}`;
            this.$get(url).then(res=>{
                if (res.code==0) {
                    this.data = res.data
                    this.data.onlinePurchaseStatementDetailList.map(item => {
                        this.$set(item, 'listContentState', false)
                        this.$set(item, 'checkoption', false)
                    })
                    this.data.offlinePurchaseStatementDetailList.map(item => {
                        this.$set(item, 'listContentState', false)
                        this.$set(item, 'checkoption', false)
                    })
                    this.remarksData = res.data.remark
                }
                this.detailLoading = false;
            })
        },
        //展开当前案件详情
        getListContent(data){
            data.listContentState = !data.listContentState
        },
        //选择案件
        caseCheck(data){
            data.checkoption = !data.checkoption
            let index = this.ids.indexOf(data.id)
            if(index == -1){
                this.ids.push(data.id)
            }else{
                this.ids.splice(index, 1);
            }
        },
        checkAll(isCheck,type){
            let key = "";
            switch(type){
                case "online":
                    key = "onlinePurchaseStatementDetailList";
                    break
                case "offline":
                    key = "offlinePurchaseStatementDetailList";
                    break
            }
            this.data[key].forEach((item,index)=>{
                item.checkoption = isCheck;
                let keyIndex = this.ids.indexOf(item.id);
                if(isCheck && keyIndex==-1){
                    this.ids.push(item.id)
                }
                if(!isCheck && keyIndex!=-1){
                    this.ids.splice(keyIndex, 1);
                }
            })
        },
        option(row, data){
            switch (data) {
                case 'rejectedCaseOne':
                    this.batchCtrl = false;
                    this.formValidate.desc = "";
                    this.rejectCtrl=true;
                    this.id = row.id
                    break;
                case 'rejectedCase':
                    this.batchCtrl = true;
                    this.formValidate.desc = ''
                    this.rejectCtrl=true;
                    break;
                case 'printSettlement':
                    this.printCtrl = true;
                    break;
                default:
                    break;
            }
        },
        //删除案件
        caseRemove(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let url = `/settlement/mgmt/purchase-statement-detail/rejected`;
                    let ajaxData = {};
                    if(this.batchCtrl){
                        if((this.onlineCheckObj.onlineCheck || this.data.onlinePurchaseStatementDetailList.length === 0 ) && 
                            (this.offlineCheckObj.offineCheck || this.data.offlinePurchaseStatementDetailList.length === 0)) {
                            this.$Message.warning({
                                content: '请进行结算单整单驳回操作',
                                duration: 3
                            })
                            return
                        }
                        ajaxData = {
                            ids: this.ids,
                            remark: this.formValidate.desc
                        }
                    }else{
                        let len = this.data.onlinePurchaseStatementDetailList.length + this.data.offlinePurchaseStatementDetailList.length
                        if (len === 1) {
                            this.$Message.warning({
                                content: '请进行结算单整单驳回操作',
                                duration: 3
                            })
                            return
                        }
                        ajaxData = {
                            ids: [this.id],
                            remark: this.formValidate.desc
                        } 
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.rejectCtrl = false;
                            // 重新获取数据
                            this.getData();
                            this.$Message.success('操作成功!');
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        //关闭侧边栏
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.type = '';
        },
        // 查看案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    activated(){
        this.getData();
        this.caseInfoCtrl = false;
    },
    mounted(){
        this.getData();
    },
    updated(){},
    components: {
        caseInfo,
        settlementPrint
    },
    watch: {}
}
</script>

<style lang="scss" scoped>
@import './statementDetail.scss';
</style>