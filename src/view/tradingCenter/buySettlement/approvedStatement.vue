<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <div v-if="!paymentCtrl">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <!-- <Button type="primary" :disabled="idObjList.length==0" @on-click="batchPay">批量付款</Button> -->
                        <Dropdown @on-click="exportOption">
                            <Button style="padding:0 15px" type="primary">
                                导出
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="all">全部导出</DropdownItem>
                                <DropdownItem :disabled="idList.length==0" name="part">勾选导出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="结算单编号/案件编号" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payState" placeholder="请选择结算状态">
                                        <Option v-for="item in payStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    申请团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="teamSelect"
                                        :path="'/base/teams'"
                                        :placeholder="'请选择申请团队'"
                                        :placeholderInput="'请输入团队名称'"
                                        :keyName="'team'"
                                        :params="{teamType:'I'}"
                                        @getValue="getTeamId">
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
                    <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
                        <template slot-scope="{ row, index }" slot="more-actions" v-if="row.payState === 'P'">
                            <Dropdown @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="apply">申请付款</DropdownItem>
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
            <payment-detail ref="paymentDetail" v-if="paymentCtrl" :defaultData="''" :settlementData="idObjList" :refundData="idRefundObjList" @closeDetail="closeCtrl">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option('',$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="add">生成付款单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="paymentCtrl=false;" type="md-close"/>
                </div>
            </payment-detail>
        </div>
        <!-- 结算单详情 -->
        <statement-detail v-if="infoCtrl" :statementDetailId="id">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
        </statement-detail>

        <!-- 退款单 -->
        <Modal v-model="refundCtrl" title="选择退款单" class-name="vertical-center-modal" :footer-hide="true" width="600">
            <checkbox-table :columns="refundColumns" :data="refundData" ref="checkboxRefundTable"
                :tableLoading="tableLoading" @refreshList="getRefundIdList($event)">
                </checkbox-table>
            <div class="do-sn-div">
                <Button type="primary" class="do-div-btn" @click="refundChoose">确认</Button>
                <Button class="do-div-btn" @click="refundCtrl=false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import statementDetail from './statementDetail.vue';
import paymentDetail from './paymentDetail.vue';
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            searchForm:{ //搜索
                keyword:'',
                paystate:'',
                teamId:'',
            },
            projectStateArr:[],//筛选条件
            idList:[],
            idObjList:[],
            data:[],
            id:'',//结算单id
            idRefundList:[],
            idRefundObjList:[],
            refundData:[],
            tableLoading:false,
            infoCtrl:false,
            refundCtrl:false,
            paymentCtrl:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            addDrawerCtrl:false,
            searchBoxCtrl:false,
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"结算单号",
                    key:"code",
                    tree:true,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{ "textover":true },
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.getStatementDetail(params.row.id);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:'申请日期',
                    key:'createTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1))
                    }
                },
                {
                    title:'审核通过时间',
                    key:'auditTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.auditTime,1)|| '-')
                    }
                },
                {
                    title:'案件数量',
                    key:'caseNum'
                },
                {
                    title:'申请团队',
                    key:'teamName'
                },
                {
                    title:"结算金额",
                    key:"totalAmount",
                    render:(h,params)=>{
                       return h('span',this.common.formateNumber(params.row.totalAmount))
                    }
                },
                {
                    title:"审核状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待审核";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "审核通过";
                                break;
                            case 'R':
                                color = 'errorColor';
                                text = "审核驳回";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text)
                    }
                },
                {
                    title:"付款状态",
                    key:"payState",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.payState;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待申请";
                                break;
                            case 'S':
                                color = 'successColor';
                                text = "已付款";
                                break;
                            case 'E':
                                color = 'errorColor';
                                text = "已申请";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            refundColumns:[ // 退款列表
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title: '退款单号',
                    key:'code',
                },
                {
                    title: '服务费退款金额',
                    key:'totalServiceAmount',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalServiceAmount));
                    }
                },
                {
                    title: '公证费退款金额',
                    key:'totalEvidAmount',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalEvidAmount));
                    }
                },
            ],
            payStateArr:[]
        }
    },
    props: [''],
    methods: {
        // 导出
        exportOption(name){
            console.log(name);
        },
        getData(){
            let url = '/settlement/trade/purchase/mgmt/statement-pass'
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            if(this.$refs.checkboxTable){
                this.$refs.checkboxTable.clearSelected();
            }
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.teamSelect.clearSelected();
            this.reloadTable();
        },
        /*--------------------start---------------------*/
        getIdList(list){
            this.idObjList = [];
            this.idList = list.map(item=>{
                this.idObjList.push(item);
                return item.id
            });
        },
        //获取申请团队id
        getTeamId(data){
            this.searchForm.teamId = data.teamId
        },
        getRefundIdList(list){
            this.idRefundObjList = [];
            this.idRefundList = list.map(item=>{
                this.idRefundObjList.push(item);
                return item.id
            })
        },
        /*--------------------end---------------------*/
        getRepeatRefundList(row){
            this.$refs.checkboxRefundTable.clearSelected();
            let url = `/settlement/trade/purchase/refund/mgmt`;
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                teamId:row.teamId,
                payState:"P",
                state:"E"
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    if(res.data.records.length!=0){
                        this.refundData = res.data.records;
                        this.refundCtrl = true;
                    }else{
                        this.paymentCtrl = true;
                    }
                }
            })
        },
        // 退款单选择
        refundChoose(){
            this.refundCtrl = false;
            this.paymentCtrl = true;
        },
        closeCtrl(){
            this.paymentCtrl = false;
            this.reloadTable();
        },
        option(row,name){
            switch (name) {
                case 'apply':
                    this.idObjList = [row];
                    this.getRepeatRefundList(row);
                    break;
                case 'add':
                    this.$refs.paymentDetail.handleSumbit();
                    break;
                default:
                    break;
            }
        },
        batchPay(){
            this.getRepeatRefundList(row);
        },
        //获取字典数据接口
        async getDictionary(){
            this.payStateArr = await this.common.getDictionaryItems('purchase_pay_state');
        },
        getStatementDetail(detailId){
            this.infoCtrl = true;
            this.id = detailId
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    activated(){
        this.reloadTable();
    },
    updated(){},
    components: {
        statementDetail,
        paymentDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
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
