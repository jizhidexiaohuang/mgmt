<template>
    <div>
        <Row class="detail-header">
            <span>{{defaultData?"退款单信息":"新建退款单"}}</span>
            <slot name='operate-box'></slot>
        </Row>
        <div class="table-box">
            <table class="subject-noheader-table subject-table">
                <tbody>
                    <tr>
                        <td class="subject-table-color">退款单编号</td>
                        <td class="tl" colspan="3">{{this.defaultData?this.defaultData.code:""}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">申请团队</td>
                        <td class="tl">
                            <div style="max-width:320px;" v-if="(defaultData&&editable) || !defaultData">
                                <mySelect ref="teamsSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择申请团队'"
                                    :params="{teamType:'I'}"
                                    :keyName="'team'"
                                    :defaultObj="teamObj"
                                    @getValue="getTeamId">
                                </mySelect>
                            </div>
                            <span v-else>{{defaultData.teamName || ""}}</span>
                        </td>
                        <td class="subject-table-color">案件数量</td>
                        <td class="tl">{{data.length}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">服务费退款合计</td>
                        <td class="tl">{{common.formateNumber(totalServiceAmount)}}</td>
                        <td class="subject-table-color">公证费退款合计</td>
                        <td class="tl">{{common.formateNumber(totalEvidAmount)}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color ">退款原因</td>
                        <td class="tl" colspan="5">
                            <Select v-model="formData.reason" v-if="(defaultData&&editable) || !defaultData" style="max-width:320px">
                                <Option v-for="(item,index) in refundreasonArr" :value="item.value" :key="index">{{ item.nameZh }}</Option>
                            </Select>
                            <span v-else>{{defaultData.reasonName || ""}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Row class="detail-header" style="margin:15px 0 10px 0">
                <span>案件信息</span>
                <div class="operate-box">
                    <Dropdown @on-click="option" v-if="defaultData.state!='E'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="addCase">添加案件</DropdownItem>
                            <DropdownItem v-if="(defaultData&&!editable)" name="changePrice">修改价格</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Row>
            <Table :columns="columns" :data="data" :tableLoading="tableLoading">
                <template slot-scope="{ row, index }" slot="action">
                    <span class="icon-down-01" title="删除案件" @click="deleteCase(row)"></span>
                </template>
            </Table>
        </div>

        <!-- 选择案件 -->
        <Modal
            v-model="selectCaseCtrl"
            title="选择案件"
            :width="800"
            :footer-hide="true">
            <select-case ref="selectCase" :params="{teamId:formData.teamId}" path="/settlement/trade/purchase/mgmt/case-refund" v-if="selectCaseCtrl" 
                :objArr="data" :defaultData="defaultSelectData"></select-case>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="getSelectedCase">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
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
    </div>
</template>
<script>
import selectCase from "./plugin/selectCase.vue";
import caseInfo from "./../buyBack/caseInfo.vue";
export default {
    data () {
        return {
            tableLoading:false,
            selectCaseCtrl:false,
            refundreasonArr:[],
            caseDetail:"",
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode)
                        return aDom
                    }
                },
                {
                    title:"服务费金额",
                    key:"totalServiceAmount",
                    render:(h,params)=>{
                        let editDom = this.editCell(h,params,"totalServiceAmount");
                        let spanDom = h("span",this.common.formateNumber(params.row.totalServiceAmount || 0));
                        if(!this.defaultData || (this.defaultData&&this.editable)){
                            return editDom
                        }else{
                            return spanDom
                        }
                    }
                },
                {
                    title:"公证费金额",
                    key:"totalEvidAmount",
                    render:(h,params)=>{
                        let editDom = this.editCell(h,params,"totalEvidAmount");
                        let spanDom = h("span",this.common.formateNumber(params.row.totalEvidAmount || 0));
                        if(!this.defaultData || (this.defaultData&&this.editable)){
                            return editDom
                        }else{
                            return spanDom
                        }
                    }
                },
                {
                    title:"项目名称",
                    key:"projectName"
                },
                {
                    title:"对方当事人",
                    key:"litigantNames"
                },
                {
                    title:"案件区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        let str = (params.row.provinceName|| '')+(params.row.cityName||'')+(params.row.areaName||'');
                        return h('span',{
                            class:'textover',
                            attrs:{ title:str }
                        },str)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                }
            ],
            idList:[],
            defaultSelectData:[],
            data:[],
            teamObj:{},
            formData:{
                reason:"",
                teamId:""
            },
            caseInfoCtrl:false,
            editable:false,
        }       
    },
    props: ['defaultData','isEdit'],
    computed:{
        totalServiceAmount(){
            let count = 0;
            this.data.forEach((item,index)=>{
                count += item.totalServiceAmount
            })
            return count
        },
        totalEvidAmount(){
            let count = 0;
            this.data.forEach((item,index)=>{
                count += item.totalEvidAmount
            })
            return count
        }
    },
    methods: {
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
        // 填写份数dom
        editCell(h,params,key){
            let InputDom = h("InputNumber",{
                props: {
                    value:params.row[key],
                    max:100000000,
                    min:0,
                    size:"small"
                },
                on: {
                    'on-change': (val) => {
                        params.row[key] = val;
                        params.row.totalAmount = (params.row.totalServiceAmount || 0) + (params.row.totalEvidAmount || 0)
                        this.$set(this.data,params.row._index,params.row);
                    },
                }
            })
            return InputDom
        },
        option(type){
            switch(type){
                case "create":
                    this.handleSumbit();
                    break;
                case "print":
                    this.printCtrl = true;
                    break;
                case "addCase":
                    if(!this.formData.teamId){ 
                        this.$Message.error("请先选择申请团队");
                        return
                    }
                    this.selectCaseCtrl = true;
                    break;
                case "changePrice":
                    this.editable = true;
                    this.$emit("changeEdit");
                    this.$nextTick(()=>{
                        this.$refs.teamsSelect.voluation();
                    })
                    break;
            }
        },
        handleSumbit(){
            let url = `/settlement/trade/purchase/mgmt/purchase-refund`;
            let ajaxData = {
                casePurchaseRefundDetailList:this.data,
                totalAmount:this.totalEvidAmount + this.totalServiceAmount,
                totalServiceAmount:this.totalServiceAmount,
                totalEvidAmount:this.totalEvidAmount
            };
            Object.assign(ajaxData,this.formData);
            if(!this.data || this.data.length==0){
                this.$Message.error("请选择退款案件");
                return
            }
            if(!this.formData.reason){
                this.$Message.error("请选择退款原因");
                return
            }
            if(!this.formData.teamId){
                this.$Message.error("请选择退款团队");
                return
            }
            if(this.defaultData){
                ajaxData.id = this.defaultData.id;
                this.$patch(url,ajaxData).then(res=>{
                    this.$Message.success("操作成功!");
                    this.$emit("closeDetail",true);
                })
            }else{
                this.$post(url,ajaxData).then(res=>{
                    this.$Message.success("操作成功!");
                    this.$emit("closeDetail",true);
                })
            }
        },
        deleteCase(row){
            this.data.splice(row._index,1);
            this.defaultSelectData = this.data.map(item=>{
                return item.caseId;
            })
        },
        getSelectedCase(){
            this.selectCaseCtrl = false;
            this.$refs.selectCase.getAssignTeam();
            this.data = this.$refs.selectCase.selectedArr;
            this.defaultSelectData = this.$refs.selectCase.idList;
        },
        giveDefaultData(){
            this.data = this.defaultData.casePurchaseRefundDetailList;
            this.formData.reason = this.defaultData.reason;
            this.formData.teamId = this.defaultData.teamId;
            this.teamObj = {
                id:this.defaultData.teamId,
                name:this.defaultData.teamName
            }
            if(this.editable){
                this.$nextTick(()=>{
                    this.$refs.teamsSelect.voluation();
                })
            }
        },
        //取消
        cancel(){
            this.selectCaseCtrl = false;
            this.$refs.selectCase.cancel();
        },
        //选择团队
        getTeamId(data){
            this.formData.teamId = data.teamId;
        },
        //获取字典数据接口
        async getDictionary(){
            this.refundreasonArr = await this.common.getDictionaryItems('pur_refund_reason');
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.editable = this.isEdit;
        if(this.defaultData){
            this.columns.splice(this.columns.length-1,1);
            this.giveDefaultData();
        }
    },
    mounted(){},
    updated(){},
    components: {
        selectCase,
        caseInfo
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./refundDetail.scss";
</style>
