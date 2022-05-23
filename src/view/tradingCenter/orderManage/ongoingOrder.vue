<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl && !bagInfoCtrl && !billingCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <ul class="case-tabs" style="float:left;margin-right:10px">
                            <li @click="getData('tabs-1','WO')" :class="isSelected==='tabs-1'?'active':''">待确认收款订单</li>
                            <li @click="getData('tabs-2','OP')" :class="isSelected==='tabs-2'?'active':''">逾期付款订单</li>
                            <li @click="getData('tabs-3','CO')" :class="isSelected==='tabs-3'?'active':''">可支付订单</li>
                            <li @click="getData('tabs-4','EC')" :class="isSelected==='tabs-4'?'active':''">异常案件订单</li>
                            <li @click="getData('tabs-5','RC')" :class="isSelected==='tabs-5'?'active':''">退案申请订单</li>
                            <li @click="getData('tabs-6','AO')" :class="isSelected==='tabs-6'?'active':''">全部订单</li>
                        </ul>
                        <Col style="float:left"><Button @click="exportOrder">导出</Button></Col>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="案件编号/线索任务/购买团队" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    出售状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.saleState" placeholder="请选择出售状态" clearable>
                                        <Option v-for="item in saleStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    开票状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.invoiceState" placeholder="请选择开票状态" clearable>
                                        <Option v-for="item in invoiceStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    预约时间
                                </Col>
                                <Col span="18">
                                    <Col span="18">
                                        <DatePicker type="daterange" v-model="appointmentTime" @on-change="getTime" split-panels placeholder="请选择预约时间" style="width: 190px"></DatePicker>
                                    </Col>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    购买团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="teamSelect"
                                        :path="'/base/teams'"
                                        :placeholder="'请选择购买团队'"
                                        :placeholderInput="'请输入团队名称'"
                                        :keyName="'team'"
                                        :params="{teamType:'L'}"
                                        @getValue="getLawyerTeam">
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
                    <Table :columns="columns" :data="data" :tableLoading="tableLoading">
                        <template slot-scope="{ row }" slot="action">
                            <Dropdown @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="billingInfo" v-if="row.invoiceState!=='N'">开票信息</DropdownItem>
                                    <DropdownItem name="openManageFee" v-if="!row.manageState">启用管理费收取</DropdownItem>
                                    <DropdownItem name="closeManageFee" v-if="row.manageState">取消管理费收取</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </Table>
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
            <order-detail ref="refundDetail" v-if="infoCtrl" :orderId="id" :batchId="batchId" @closeDetail="closeCtrl">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option(orderDetail,$event)" v-if="false">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="billingInfo" v-if="orderDetail.invoiceState!=='N'">开票信息</DropdownItem>
                            <!-- <DropdownItem name="return">退回审核</DropdownItem> -->
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="infoCtrl=false" type="md-close"/>
                </div>
            </order-detail>

            <!-- 案件包详情 -->
            <package-detail v-if="bagInfoCtrl" :defaultData="bagDetail">
                <div class="operate-box" slot="operate-box">
                    <Icon class="close-icon" @click="bagInfoCtrl=false"  type="md-close"/>
                </div>
            </package-detail>

            <!-- 查看开票信息列表 -->
            <billing-List v-if="billingCtrl" :orderId="id">
                <div class="close-icon" slot="close-icon">
                    <Icon type="md-close" @click="billingCtrl=false" />
                </div>
            </billing-List>
        </div>

        <!-- 管理费收取确认 -->
        <Modal
            v-model="manageCtrl"
            title="管理费收取确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{type=="openManageFee"?"启用":"取消"}}管理费收取？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="manageSubmit">确认</Button>
                <Button @click="manageCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import expandRow from './expandRow.vue';
import orderDetail from "./orderDetail.vue";
import packageDetail from './../sell/packageDetail.vue';
import billingList from './billing/billingList.vue';
export default {
    data () {
        return {
            styles:styles,
            isSelected:'tabs-1',
            id:'',
            searchForm:{
                keyword:'',
                saleState:'',
                invoiceState:'',
                purchaseTeamId:'',
                beginDate:'',
                endDate:''
            },
            saleStateArr:[],
            invoiceStateArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns: [
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row.paymentInfoList
                            },
                            on:{
                                'checkOrderInfo':(batchId)=>{
                                    this.batchId = batchId;
                                    this.id = '';
                                    this.infoCtrl = true;
                                },
                                'reloadList':()=>{
                                    this.reloadTable();
                                }
                            }
                        })
                    }
                },
                {
                    title:"创建时间",
                    key:"createTime",
                    render:(h,params)=>{
                        let str = params.row.createTime && params.row.createTime.slice(0,10)
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:str
                            },
                        },str)
                    }
                },
                {
                    title:"订单编号",
                    key:"orderNo",
                    width:130,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{
                                "textover":true
                            },
                            style:{
                                color:styles.globalMainColor
                            },
                            attrs:{
                                title:params.row.orderNo
                            },
                            on:{
                                "click":()=>{
                                    this.id = params.row.orderId;
                                    this.batchId = '';
                                    this.infoCtrl = true;
                                }
                            }
                        },params.row.orderNo);
                        return dom
                    }
                },
                {
                    title:"案件包编号",
                    key:"saleBagNo",
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{
                                "textover":true
                            },
                            style:{
                                color:styles.globalMainColor
                            },
                            attrs:{
                                title:params.row.saleBagNo
                            },
                            on:{
                                "click":()=>{
                                    this.getBagDetail(params.row.saleBagId,'info')
                                }
                            }
                        },params.row.saleBagNo);
                        return dom
                    }
                },
                {
                    title:"购买团队",
                    key:"teamName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.teamName
                            },
                        },params.row.teamName)
                    }
                },
                {
                    title: '总价',
                    key: 'saleFee',
                    render:(h,params)=>{
                        let saleFee = this.common.formateNumber(params.row.saleFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:saleFee
                            },
                        },saleFee)
                    }
                },
                {
                    title: '已支付',
                    key: 'paidFee',
                    render:(h,params)=>{
                        let paidFee = this.common.formateNumber(params.row.paidFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:paidFee
                            },
                        },paidFee)
                    }
                },
                {
                    title: '出售状态',
                    key: 'saleState',
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.saleState){
                            case "PR": color = "warningColor"; break;
                            case "S": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.saleStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.saleStateName)
                    }
                },
                {
                    title:"开票状态",
                    key:"invoiceState", // A已申请 I已开票 N未开票
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.invoiceState){
                            case "A": color = "warningColor"; break;
                            case "N": color = "expireColor"; break;
                            case "I": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.invoiceStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.invoiceStateName)
                    }
                },
                {
                    title: '签收状态',
                    key: 'signState',
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.signState){
                            case "WS": color = "warningColor"; break;
                            case "SD": color = "successColor"; break;
                        }
                        if(!params.row.signState){
                            return h('span','')
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.signStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.signStateName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                },
            ],
            name:'全部项目',
            isSelected:'tabs-1',
            infoCtrl:false,
            isEdit:false,
            bagInfoCtrl:false,
            bagDetail:'',
            billingCtrl:false,
            batchId:'',
            manageCtrl:false,
            type:"",
            appointmentTime:[]
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(type,queryType){
            this.isSelected = type || this.isSelected;
            this.searchForm.queryType = queryType || this.searchForm.queryType;
            let url = '/settlement/orders/running';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        exportOrder(){
            let url = '/settlement/orders/export';
            this.$exportGet(url,this.searchForm).then(res=>{})
        },
        // 预约时间
        getTime(value){
            this.searchForm.beginDate = value[0];
            this.searchForm.endDate = value[1];
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
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                if(key!="queryType"){
                    this.searchForm[key] = '';
                }
            }
            this.appointmentTime = [];
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.orderId;
            this.type = name;
            switch (name) {
                case 'billingInfo': 
                    this.billingCtrl = true;
                    break;
                case 'openManageFee':
                    this.manageCtrl = true;
                    break;
                case 'closeManageFee':
                    this.manageCtrl = true;
                    break;
            }
        },
        getLawyerTeam(data){
            this.searchForm.purchaseTeamId = data.teamId;
        },
        getBagDetail(id){
            let url = '/settlement/trade/sale/bag/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.bagDetail = res.data;
                    this.bagInfoCtrl = true;
                }
            })
        },
        /*------------操作End-------------*/
        //关闭弹框
        closeCtrl(reload){
            if(reload){
                this.reloadTable();
            }
        },
        //搜索条件省市区接口
        getCity(data){
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
            }
        },
        manageSubmit(){
            let url = '/settlement/order/manage/config/';
            if(this.type=="openManageFee"){
                url += `enable/${this.id}`;
            }else if(this.type=="closeManageFee"){
                url += `disable/${this.id}`;
            }
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功!");
                    this.manageCtrl = false;
                    this.reloadTable();
                }else{ 
                    this.$Message.error(res.message);
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.saleStateArr = await this.common.getDictionaryItems('purchase_state');
            this.invoiceStateArr = await this.common.getDictionaryItems('order_invoice_state');
        },
    },
    created(){},
    activated(){
        this.getData('tabs-1','WO');
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        
    },
    updated(){},
    components: {
        orderDetail,
        packageDetail,
        billingList
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
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
.close-icon{
    font-size: 20px;
    cursor: pointer;
}
@import '../../case/case.scss';
</style>