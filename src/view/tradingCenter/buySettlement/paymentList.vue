<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <span class="sum-text">
                            今年累计付款金额<span class="bg-num">{{common.formateNumber(sumData.yearAmout,'')}}</span>元，本月累计付款<span class="bg-num">{{common.formateNumber(sumData.monthAmout,'')}}</span>元
                        </span>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="付款单号" style="width: 250px;" 
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
                                    <Select v-model="searchForm.payState" placeholder="请选择付款状态">
                                        <Option value="P">待付款</Option>
                                        <Option value="S">已付款</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款时间
                                </Col>
                                <Col span="18">
                                    <DatePicker type="daterange" v-model="payTime"
                                        @on-change="getPayTime" placement="bottom-end" placeholder="请选择付款时间" style="width:100%"></DatePicker>
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
                    <Table :columns="columns" :data="data" :loading="tableLoading">
                        <template slot-scope="{ row, index }" slot="action">
                            <Dropdown @on-click="option(row,$event)" v-if="row.state=='P'">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="confirmPay">已付款</DropdownItem>
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
            <div v-if="infoCtrl">
                <payment-detail :defaultData="defaultData" :settlementData="settlementData" :refundData="refundData">
                    <div class="operate-box" slot="operate-box">
                        <Dropdown @on-click="option('',$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="print">打印付款单</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Icon class="close-icon" @click="infoCtrl=false;" type="md-close"/>
                    </div>
                </payment-detail>
            </div>
        </div>

        <!-- 打印退款单 -->
        <Modal
            v-model="printCtrl"
            width="90%"
            :closable="false"
            :footer-hide="true">
            <payment-print :defaultData="defaultData" @closeModal="printCtrl=false"></payment-print>
        </Modal>

        <!-- 付款确认 -->
        <Modal
            v-model="confirmCtrl"
            :width="300"
            title="提示"
            :footer-hide="true">
            <Row style="font-size:14px;margin-bottom:10px;">请问是否确认该付款单已付款？</Row>
            <Row style="text-align:center;">
                <Button type="primary" @click="changePayState">确认</Button>
                <Button @click="confirmCtrl=false">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import paymentDetail from "./paymentDetail.vue";
import paymentPrint from "./plugin/paymentPrint.vue";
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                startPayDate:"",
                endPayDate:"",
                payState:""
            },
            caseStateArr:[],
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
                    title:"付款单号",
                    key:"code",
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.id = params.row.id;
                                    this.getDetail();
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"公证费",
                    key:"evidAmount",
                    render:(h,params)=>{
                        let receiptSpan = `${this.common.formateNumber(params.row.evidAmount || 0,'')}元`;
                        let refundSpan = `${this.common.formateNumber(params.row.refundEvidAmount || 0,'')}元`;
                        let receiptDom = h("span",{
                            style:{
                                color:styles.errorColor
                            }
                        },`+${receiptSpan}`)
                        let refundDom = h("span",{
                            style:{
                                color:styles.successColor
                            }
                        },`-${refundSpan}`)
                        let contentDom = h("div",{slot:"content"},[
                            h("p",`付款金额：${receiptSpan}`),
                            h("p",`退费金额：${refundSpan}`),
                        ])
                        let toolTip = h("Tooltip",{
                            props:{ theme:"light" }
                        },[receiptDom,h("span"," / "),refundDom,contentDom])
                        return toolTip
                    }
                },
                {
                    title:"服务费",
                    key:"serviceAmount",
                    render:(h,params)=>{
                        let receiptSpan = `${this.common.formateNumber(params.row.serviceAmount || 0,'')}元`;
                        let refundSpan = `${this.common.formateNumber(params.row.refundServiceAmount || 0,'')}元`;
                        let receiptDom = h("span",{
                            style:{
                                color:styles.errorColor
                            }
                        },`+${receiptSpan}`)
                        let refundDom = h("span",{
                            style:{
                                color:styles.successColor
                            }
                        },`-${refundSpan}`)
                        let tipsDom = h("div",{slot:"content"},[
                            h("p",`付款金额：${receiptSpan}`),
                            h("p",`退费金额：${refundSpan}`),
                        ])
                        let toolTip = h("Tooltip",{
                            props:{ theme:"light" }
                        },[receiptDom,h("span"," / "),refundDom,tipsDom])
                        return toolTip
                    }
                },
                {
                    title:"总付款金额",
                    key:"payAmount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.payAmount || 0))
                    }
                },
                {
                    title:"付款状态",
                    key:"state",
                    render:(h,params)=>{
                        let color;
                        let text = "";
                        switch (params.row.state){
                            case 'P':
                                color = 'warningColor';
                                text = "待付款";
                                break;
                            case 'S':
                                color = 'successColor';
                                text = "已付款";
                                break;
                        }
                        return h('Tag',{
                            attrs:{ 
                                color:styles[color]
                            },
                            style:{ borderRadius:'11px' }
                        },text)
                    }
                },
                {
                    title:"付款日期",
                    key:"confirmTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.confirmTime,1))
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
            settlementData:[],
            refundData:[],
            defaultData:"",
            confirmCtrl:false,
            payTime:[]
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/trade/purchase/purchase-payment';
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
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        getSumData(){
            let url = '/settlement/trade/purchase/mgmt/purchase-payment-sum';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.sumData = res.data || {};
                }
            })
        },
        //获取收款时间
        getPayTime(data){
            this.searchForm.startPayDate = data[0];
            this.searchForm.endPayDate = data[1];
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
            this.idList = [];
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
        changePayState(){
            let url = `/settlement/trade/purchase/purchase-payment/${this.id}`;
            let ajaxData = {
                id:this.id
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.confirmCtrl = false;
                    this.$Message.success("操作成功!");
                    this.reloadTable();
                }
            })
        },
        getDetail(){
            let url = `/settlement/trade/purchase/purchase-payment/${this.id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                    this.settlementData = res.data.purchaseStatementVOList || [];
                    this.refundData = res.data.purchaseRefundInfoVOList || [];
                    this.infoCtrl = true;
                }
            })
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch(name){
                case "confirmPay":
                    this.confirmCtrl = true;
                    break;
                case "print":
                    this.printCtrl = true;
                    break;
            }
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.caseStateArr = await this.common.getDictionaryItems('case_progress');
        }
    },
    created(){},
    activated(){
        this.getSumData();
        this.getData();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {
        paymentDetail,
        paymentPrint
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.sum-text{
    font-size: 14px;
    margin-left: 5px;
    vertical-align: middle;
}
.bg-num{
    color:$warningColor;
    font-size:16px;
    font-weight: 500;
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
</style>