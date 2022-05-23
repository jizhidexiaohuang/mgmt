<template>
    <div>
        <Row class="detail-header">
            <span>结算单信息</span>
            <slot name='operate-box'></slot>
        </Row>
        <div class="table-box">
            <table class="subject-noheader-table subject-table">
                <tbody>
                    <tr>
                        <td class="subject-table-color">结算单号</td>
                        <td class="tl" colspan="3">{{defaultData.code || ""}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">所属项目</td>
                        <td class="tl">
                            <Form v-if="!isInfo" :model="formData" ref="formData" :rules="ruleValidate" :label-width="0">
                                <FormItem label="" prop="projId">
                                    <mySelect ref="projectSelect"
                                        :path="'/business/projects/list'"
                                        :placeholder="'请选择项目'"
                                        :placeholderInput="'请输入项目'"
                                        :keyName="'name'"
                                        :defaultObj="defaultObj"
                                        @getValue="getProjectId">
                                    </mySelect>
                                </FormItem>
                            </Form>
                            <span v-else>{{defaultData.projectName || ""}}</span>
                        </td>
                        <td class="subject-table-color" v-if="settlementData.actualPay<0">合计结算金额(甲方支付)</td>
                        <td class="subject-table-color" v-if="settlementData.actualPay>0">合计结算金额(乙方支付)</td>
                        <td class="subject-table-color" v-if="!settlementData.actualPay">合计结算金额</td>
                        <td class="tl">
                            <span>{{common.formateNumber(Math.abs(settlementData.actualPay || 0))}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Row class="detail-header spec-header">
                <span>案件信息</span>
                <div class="operate-box">
                    <Dropdown v-if="!isInfo" @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="addCase">选择案件</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Row>
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <checkbox-table :columns="tableColumns" :data="formData.custSettlementDetailList" :showSummary="true" :handleSummary="common.handleSummary" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <span class="icon-down-01" title="删除案件" @click="validIsDetele(row)"></span>
                    </template>
                </checkbox-table>
            </Row>
            <Row class="detail-header spec-header">
                <span>备注</span>
            </Row>
            <div class="remarks">
                <Input v-if="!isInfo" v-model="formData.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"></Input>
                <div v-else class="remarks-box">{{defaultData.remark}}</div>
            </div>
        </div>

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="900"
            title="案件详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <case-detail style="top:0;" v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-detail>
        </Drawer>

        <!-- 选择案件 -->
        <Modal
            v-model="selectCaseCtrl"
            title="选择案件"
            :width="800"
            :footer-hide="true">
            <select-case ref="selectCase" :params="{projectId:formData.projId}" mainKey="id" path="/settlement/finance-cust-settlement/case-detail" v-if="selectCaseCtrl" 
                :objArr="formData.custSettlementDetailList" :defaultData="formData.caseIdList"></select-case>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="getSelectedCase">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 预览结算单 -->
        <Modal
            v-model="previewCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <cust-settlement-print :defaultData="settlementData" :isInfo="isInfo" v-if="previewCtrl" @closeModal="closeModal"></cust-settlement-print>
            <Row v-if="!defaultData || !isInfo" style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="sumbit">生成</Button>
                <Button @click="previewCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseDetail from "./../../case/caseDetail.vue";
import selectCase from "./../../tradingCenter/buySettlement/plugin/selectCase.vue";
import custSettlementPrint from "./plugin/custSettlementPrint.vue";
export default {
    data () {
        return {
            styles:styles,
            tableLoading:false,
            selectCaseCtrl:false,
            refundreasonArr:[],
            caseDetail:"",
            defaultObj:{},
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:125,
                    render:(h,params)=>{
                        let icon = h('Tooltip',{
                            props: {placement: 'bottom',trigger:"hover",theme:"light"},
                            style:{
                                fontSize:'16px',
                                cursor: 'pointer',
                                color:styles.errorColor,
                                float:'left',
                                lineHeight:'42px',
                                marginRight:'4px'
                            }
                        },[
                            h('Icon',{
                                attrs:{
                                    type:'ios-information-circle',
                                    title:params.row.abnormalStateName
                                },
                                style:{
                                    fontSize:'16px',
                                    cursor: 'pointer',
                                    verticalAlign: 'text-bottom'
                                }
                            }),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },params.row.abnormalStateName)
                        ])
                        let aDom = h("a",{
                            style:{
                                width:"calc(100% - 20px)",
                                float:'left',
                                lineHeight:'42px'
                            },
                            attrs:{
                                title:params.row.caseCode,
                            },
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode)
                        if(params.row.abnormalState){
                            return [icon,aDom];
                        }
                        return aDom;
                    }
                },
                {
                    title:"案号",
                    key:"caseNo"
                },
                {
                    title:"赔偿款",
                    key:"compensateAmount",
                    render:(h,params)=>{
                        let compensateAmount = this.common.formateNumber(params.row.compensateAmount || 0);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:compensateAmount
                            },
                        },compensateAmount)
                    }
                },
                {
                    title:'诉讼退费',
                    key:'returnAmount',
                    render:(h,params)=>{
                        let returnAmount = this.common.formateNumber(params.row.returnAmount || 0);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:returnAmount
                            },
                        },returnAmount)
                    }
                },
                {
                    title:"收款人",
                    key:"payee"
                },
                {
                    title:"案件成本",
                    key:"showCostAmount",
                    render:(h,params)=>{
                        let showCostAmount = this.common.formateNumber(params.row.showCostAmount || 0);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:showCostAmount
                            },
                        },showCostAmount)
                    }
                },
                {
                    title: '风险代理费（含成本）',
                    key: 'agent',
                    render:(h,params)=>{
                        let agent = this.common.formateNumber(params.row.agent || 0);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:agent
                            },
                        },agent)
                    }
                },
                {
                    title: '客户授权费',
                    key: 'authFee',
                    render:(h,params)=>{
                        let authFee = this.common.formateNumber(params.row.authFee || 0);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:authFee
                            },
                        },authFee)
                    }
                },
                {
                    title: '计算公式',
                    key: 'settlementFormula'
                }
            ],
            tableColumns:[],
            idList:[],
            data:[],
            formData:{
                projId:"",
                caseIdList:[],
                custSettlementDetailList:[],
                remark:""
            },
            ruleValidate:{
                projId:[{ required: true,type:"number", message: '项目不能为空', trigger: 'blur' }]
            },
            caseInfoCtrl:false,
            previewCtrl:false,
            settlementData:""
        }       
    },
    props: ['defaultData','isInfo'],
    computed:{},
    methods: {
        changeColumns(bool){
            let selectObj = { type: 'selection',width: 30,align: 'center'};
            let operateObj = {title:"操作",slot: 'action'};
            if(bool){
                this.tableColumns = this.columns;
            }else{
                this.tableColumns = [...this.columns,operateObj];
            }
        },
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        },
        validIsDetele(row){
            // 如果是编辑则需要判断是否该案件能否删除
            if(this.defaultData){
                let url = `/business/finance-cust-settlement/${row.settlementId}/check-case/${row.caseId}`;
                this.$get(url).then(res=>{
                    if(res.code==0){
                        if(res.data){
                            this.$Message.error("该案件存在多次客户结算，请按申请时间倒序删除!");
                            return
                        }else{
                            this.deleteCase(row);
                        }
                    }
                })
            }else{
                this.deleteCase(row);
            }
        },
        option(row,name){
            switch(name){
                case "addCase":
                    this.openSelectCase();
                    break;
                case "remove":
                    this.batchDeleteCase();
                    break;
            }
        },
        getIdList(list){
            this.idList = [];
            list.forEach((item,index)=>{
                this.idList.push(item.caseId)
            })
        },
        //选择所属项目
        getProjectId(data){
            if(this.formData.projId!=data.id){
                this.formData.custSettlementDetailList = [];
                this.formData.caseIdList = [];
                this.$refs.checkboxTable.clearSelected();
            }
            this.formData.projId = data.id;
        },
        openSelectCase(){
            this.$refs.formData.validateField('projId')
            if(this.formData.projId){
                this.selectCaseCtrl = true;
            }
        },
        deleteCase(row){
            this.formData.custSettlementDetailList.splice(row._index,1);
            if(this.formData.custSettlementDetailList.length==0){
                this.formData.caseIdList = [];
            }else{
                this.formData.caseIdList = this.formData.custSettlementDetailList.map(item=>{
                    return item.id;
                })
            }
            this.getGenerate();
        },
        batchDeleteCase(){
            let newArr = this.formData.custSettlementDetailList.filter((item) => {
                return !this.idList.some((ele)=>{
                    return ele===item.caseId
                })
            });
            this.formData.custSettlementDetailList = newArr;
            this.$refs.checkboxTable.clearSelected();
        },
        getSelectedCase(){
            this.formData.custSettlementDetailList = this.$refs.selectCase.idObjList;
            this.formData.caseIdList = this.$refs.selectCase.idList;
            this.selectCaseCtrl = false;
            this.getGenerate();
        },
        getGenerate(){
            let url = '/settlement/finance-cust-settlement/generate';
            let ajaxData = {
                projId:this.formData.projId,
                custSettlementDetailList:this.formData.custSettlementDetailList,
                remark:this.formData.remark,
            }
            if(this.formData.custSettlementDetailList.length==0){
                this.$Message.error("请选择案件");
                return
            }
            this.$refs["formData"].validate((valid) => {
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.settlementData = res.data || "";
                            this.formData.custSettlementDetailList = res.data.custSettlementDetailList;
                        }else{
                            this.$Message.error(res.message)
                        }
                    })
                }
            })
        },
        //取消
        cancel(){
            this.selectCaseCtrl = false;
        },
        openPreview(){
            this.settlementData = this.defaultData;
            this.previewCtrl = true;
        },
        handlePreview(){
            this.$refs["formData"].validate((valid) => {
                if(valid){
                    if(this.formData.custSettlementDetailList.length==0){
                        this.$Message.error("请选择案件");
                        return
                    }
                    this.previewCtrl = true; 
                }
            })
        },
        sumbit(){
            let url = '/settlement/finance-cust-settlement';
            let ajaxData = this.settlementData;
            if(this.defaultData){
                ajaxData.id = this.defaultData.id;
                this.$patch(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.closeModal(true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }else{
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.closeModal(true);
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }
        },
        closeModal(reload){
            this.previewCtrl = false;
            if(reload){
                this.$emit("changeEditCtrl",true);
            }
        },
        //赋默认值
        giveDefaultData(){
            this.settlementData = this.defaultData;
            this.formData.projId = this.defaultData.projId;
            this.formData.caseIdList = [];
            this.formData.custSettlementDetailList = this.defaultData.custSettlementDetailList;
            this.formData.remark = this.defaultData.remark;
            this.defaultObj = {
                id:this.defaultData.projId,
                name:this.defaultData.projectName
            }
            this.defaultData.custSettlementDetailList.forEach((item,index)=>{
                this.formData.caseIdList.push(item.id);
            })
            this.$nextTick(()=>{
                if(this.$refs.projectSelect){
                    this.$refs.projectSelect.voluation();
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.refundreasonArr = await this.common.getDictionaryItems('purchase_state');
        }
    },
    created(){},
    beforeMount(){
        this.changeColumns(this.isInfo);
        if(this.defaultData){
            this.giveDefaultData();
        }
    },
    mounted(){},
    updated(){},
    components: {
        selectCase,
        custSettlementPrint,
        caseDetail
    },
    watch: {
        isInfo(newVal,oldVal){
            this.changeColumns(newVal);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./../../tradingCenter/buySettlement/refundDetail.scss";
.subject-noheader-table .subject-table-color{
    width:auto;
}
.money-td{
    font-weight: 600;
    color:$warningColor;
}
.text-r{
    text-align: right;
}
.text-l{
    text-align: left;
}
.ivu-form-item{
    margin-bottom: 5px;
}
.spec-header{
    margin:15px 0 10px 0;
}
</style>
