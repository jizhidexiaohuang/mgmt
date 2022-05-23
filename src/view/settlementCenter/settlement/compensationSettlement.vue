<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Button type="primary" @click="newSettlement">新建结算</Button>
                        <Button type="primary" :disabled="idList.length==0" @click="batchApply">批量付款</Button>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="结算单号/案件编号" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    确认状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.confirmState" clearable placeholder="请选择确认状态">
                                        <Option value="P">待确认</Option>
                                        <Option value="E">已确认</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    结算状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payState" clearable placeholder="请选择结算状态">
                                        <Option v-for="item in settllementStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款方
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payeeType" clearable placeholder="请选择付款方">
                                        <Option v-for="item in payeeTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    项目
                                </Col>
                                <Col span="18">
                                    <mySelect ref="projectSelect"
                                        :path="'/business/projects/list'"
                                        :placeholder="'请选择项目'"
                                        :placeholderInput="'请输入项目'"
                                        :keyName="'name'"
                                        @getValue="getProjectId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                                <Button type="primary" size="small" @click="reloadTable">确定</Button>
                                <Button size="small" @click="clearConditions">清空</Button>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <!-- 表格 -->
                <Row style="border:1px solid #dcdee2;border-bottom:0;">
                    <checkbox-table :columns="columns" :data="data"
                        ref="checkboxTable"
                        :tableLoading="tableLoading" @refreshList="getIdList($event)">
                        <template slot-scope="{ row, index }" slot="more-actions">
                            <Dropdown v-if="row.confirmState!='E' || ((row.confirmState=='E'&&row.payeeType=='A'&&row.payState!='E'&&row.payState!='S'))" @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-if="row.confirmState!='E'" name="confirm">确认</DropdownItem>
                                    <DropdownItem v-if="row.confirmState!='E'" name="edit">修改</DropdownItem>
                                    <DropdownItem v-if="row.confirmState!='E'" name="del">删除</DropdownItem>
                                    <DropdownItem v-if="(row.confirmState=='E'&&row.payeeType=='A'&&row.payState!='E'&&row.payState!='S')" name="applyPay">申请付款</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </checkbox-table>
                </Row>
                <Row style="margin-top:30px;text-align:center;">
                    <Page :total="table.totalRecords" show-total
                        size="small"
                        :current="table.pageNum"
                        :page-size-opts="config.pageSizeOpts"
                        :page-size="config.pageSize"
                        prev-text="上一页" next-text="下一页"
                        @on-change="changePage"
                        @on-page-size-change="changeSize"
                        show-sizer show-elevator />
                </Row>
            </div>
            
            <!-- 查看订单详情 -->
            <cust-settlement-form ref="custSettlementForm" v-if="infoCtrl" :isInfo="isInfo" :defaultData="settlementData" @changeEditCtrl="closeModal">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem v-if="!isInfo" name="add">生成结算单</DropdownItem>
                            <DropdownItem v-if="isInfo&&settlementData.confirmState!='E'" name="edit">修改</DropdownItem>
                            <DropdownItem v-if="isInfo&&settlementData.confirmState=='E'" name="print">打印结算单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="infoCtrl=false" type="md-close"/>
                </div>
            </cust-settlement-form>
        </div>

        
        <!-- 删除modal -->
        <Modal
            v-model="delCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除该结算单？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="delSubmit">确认</Button>
                <Button @click="delCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 付款确认 -->
        <Modal
            v-model="confirmCtrl"
            :width="300"
            title="提示"
            :footer-hide="true">
            <Row style="font-size:14px;margin-bottom:10px;">请问是否确认该结算单信息及结算金额正确？</Row>
            <Row style="text-align:center;">
                <Button type="primary" @click="confirmSubmit">确认</Button>
                <Button @click="confirmCtrl=false">取消</Button>
            </Row>
        </Modal>

        <!-- 新建申请付款 -->
        <Drawer 
            v-model="settlementCtrl"
            width="600"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span v-if="type=='applyPay'">申请付款</span>
            </div>
            <cust-apply-pay-form v-if="settlementCtrl" :idObjList="payObjList" @changeEditCtrl="closeModal"></cust-apply-pay-form>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import custSettlementForm from './custSettlementForm';
import custApplyPayForm from './custApplyPayForm.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            idList:[],
            idObjList:[],
            settlementCtrl:false,
            searchForm:{
                keyword:'',
                payState:"",
                payeeType:"",
                projectId:""
            },
            payeeTypeArr:[],
            payStateArr:[],
            returnStateArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            infoCtrl:false,
            type:'',
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"结算单号",
                    key:"code",
                    width:130,
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.id = params.row.id;
                                    this.isInfo = true;
                                    this.getDetail();
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1));
                    }
                },
                {
                    title:"项目名称",
                    key:"serviceAmount",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNumber"
                },
                {
                    title:"付款方",
                    key:"payeeTypeName"
                },
                {
                    title:"客户名称",
                    key:"customerName"
                },
                {
                    title:"结算金额",
                    key:"actualPay",
                    render:(h,params)=>{
                        let num = params.row.actualPay || 0;
                        // 如果付款方是客户，则取结算金额的绝对值展示
                        if(params.row.payeeType == "C"){ 
                            num = Math.abs(params.row.actualPay || 0) 
                        }
                        if(params.row.state=="PI"){
                            // 如果状态时回款中,则展示已回款金额
                            return this.initTootip(h,params);
                        }else{
                            return h("span",{
                                attrs:{
                                    title:this.common.formateNumber(num)
                                }
                            },this.common.formateNumber(num))
                        }
                    }
                },
                {
                    title:"结算状态",
                    key:"state",
                    render:(h,params)=>{
                        let color;
                        switch (params.row.state){
                            // P:待申请 E:已申请 R:已驳回 S:已付款 PP:待回款 PI 回款中 PR:已回款
                            case 'P': color = 'warningColor'; break;
                            case 'PP': color = 'warningColor'; break;
                            case 'E': color = 'infoColor'; break;
                            case 'PI': color = 'infoColor'; break;
                            case 'S': color = 'successColor'; break;
                            case 'PR': color = 'successColor'; break;
                            case 'R': color = 'errorColor'; break;
                        }
                        return h('Tag',{
                            attrs:{ 
                                color:styles[color]
                            },
                            style:{ borderRadius:'11px' }
                        },params.row.stateName)
                    }
                },
                {
                    title:"确认状态",
                    key:"confirmState",
                    render:(h,params)=>{
                        let color;
                        let text = "待付款";
                        switch (params.row.confirmState){
                            case 'P':color = 'orange';break;
                            case 'E':color = 'green';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:color
                            },
                        },params.row.confirmStateName)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            printCtrl:false,
            sumData:{
                yearAmout:0,
                monthAmout:0
            },
            refundData:[],
            defaultData:"",
            confirmCtrl:false,
            payTime:[],
            infoCtrl:false,
            settlementData:"",
            isInfo:true,
            payObjList:[],
            delCtrl:false
        }
    },
    props: [''],
    computed:{
        settllementStateArr(){
            let arr = this.payStateArr.concat(this.returnStateArr);
            return arr
        }
    },
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance-cust-settlements';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.data.forEach((item,index)=>{
                        if(item.confirmState!='E' || item.payeeType!='A' || item.payState=='E' || item.state=='S'){
                            item._disabled = true;
                        }
                    })
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        getDetail(){
            let url = `/settlement/finance-cust-settlement/${this.id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.settlementData = res.data || "";
                    this.infoCtrl = true;
                }
            })
        },
        initTootip(h,params){
            let actualPay = params.row.actualPay || 0;    //结算金额
            // 如果付款方是客户，则取结算金额的绝对值展示
            if(params.row.payeeType == "C"){ 
                actualPay = Math.abs(params.row.actualPay || 0);
            }
            let actualPayText = this.common.formateNumber(actualPay);
            let actualPayTextDom = h("span",{ attrs:{ title:actualPayText } },actualPayText);
            let lastNum = this.common.formateNumber(actualPay - params.row.returnPay); //待回款金额
            let returnPay = this.common.formateNumber(params.row.returnPay || 0); //已回款金额
            let iconDom = h("Icon",{
                props:{
                    type:"ios-information-circle",
                    color:styles.globalMainColor,
                    size:16
                }
            })
            let contentDom = h("div",{slot:"content"},[
                h("p",`待回款:${lastNum}`),
                h("P",{style:{ color:styles.successColor } },`已回款:${returnPay}`)
            ]);
            let toolTip = h("Tooltip",{ props:{ theme:"light" } },[iconDom,contentDom]);
            return h("div",{ class:"textover" },[ toolTip,actualPayTextDom] )
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        getIdList(list){
            this.idObjList = [];
            this.idList = list.map(item=>{
                this.idObjList.push(item);
                return item.id
            })
        },
        //获取收款时间
        getPayTime(data){
            this.searchForm.applyDateStart = data[0];
            this.searchForm.applyDateStart = data[1];
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.payTime = [];
            this.reloadTable();
        },
        newSettlement(){
            this.settlementData = "";
            this.isInfo = false;
            this.infoCtrl = true;
        },
        batchApply(){
            this.payObjList = this.idObjList;
            this.settlementCtrl = true;
        },
        confirmSubmit(){
            let url = `/settlement/finance-cust-settlement/${this.id}/confirm`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功!");
                    this.confirmCtrl = false;
                    this.reloadTable();
                }
            })
        },
        delSubmit(){
            let url = `/settlement/finance-cust-settlement/${this.id}/delete`;
            this.$del(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功!");
                    this.delCtrl = false;
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            this.payObjList = [row];
            switch(name){
                case "confirm":
                    this.confirmCtrl = true;
                    break;
                case "edit":
                    this.isInfo = false;
                    if(!this.infoCtrl){
                        this.getDetail();
                    }
                    break;
                case "applyPay":
                    this.settlementCtrl = true;
                    break;
                case "add":
                    this.$refs.custSettlementForm.handlePreview();
                    break;
                case "del":
                    this.delCtrl = true;
                    break;
                case "print":
                    this.$refs.custSettlementForm.openPreview();
                    break;
            }
        },
        closeModal(reload){
            this.infoCtrl = false;
            this.settlementCtrl = false;
            if(reload){
                this.reloadTable();
            }
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.payeeTypeArr = await this.common.getDictionaryItems('payee_type');
            this.payStateArr = await this.common.getDictionaryItems('pay_state');
            this.returnStateArr = await this.common.getDictionaryItems('return_state');
        }
    },
    created(){},
    activated(){
        this.getData();
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {
        custSettlementForm,
        custApplyPayForm
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.operate-box{
    position: absolute;
    right:15px;
    top:3px;
    font-size:20px;
    cursor: pointer;
    .close-icon{
        margin-left: 10px;
    }
}
</style>