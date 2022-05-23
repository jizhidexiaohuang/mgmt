<template>
    <div>
        <Row v-if="!infoCtrl">
            <Row class="absolute-icon">
                <slot name='close-icon'></slot>
            </Row>
            <Row class="header-common-right-box" style="margin-right:25px">
                <Col style="float:left;">
                    <Row class="detail-header" style="background:#fff">
                        <span>开票信息详情</span>
                    </Row>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="案件编号" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                开票状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in invoiceStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
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
                        <Dropdown @on-click="option($event,row)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit" v-if="row.state!='Y'">修改</DropdownItem>
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
        </Row>

        <!-- 修改开票信息 -->
        <Modal
            v-model="billingCtrl"
            :title="operate=='info'?'开票信息':'修改开票信息'"
            width="900"
            :footer-hide="true">
            <billing-form v-if="billingCtrl" :invoiceId="id" :operate="operate" @reloadList="editFinish"></billing-form>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import billingForm from './billingForm.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                state:""
            },
            searchBoxCtrl:false,
            invoiceStateArr:[],
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"申请时间",
                    key:"modifyTime",
                    render:(h,params)=>{
                        let modifyTime = this.common.formatTime(params.row.modifyTime)
                        return h('span',{
                            class:{
                                "textover":true
                            },
                            style:{
                                color:styles.globalMainColor,
                                cursor:'pointer'
                            },
                            attrs:{
                                title:modifyTime
                            },
                            on:{
                                "click":()=>{
                                    this.id = params.row.id;
                                    this.operate = 'info';
                                    this.billingCtrl = true;
                                }
                            }
                        },modifyTime)
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNum"
                },
                {
                    title: '总金额',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title: '代理费',
                    key: 'amountAgent',
                    render:(h,params)=>{
                        let amountAgent = this.common.formateNumber(params.row.amountAgent);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amountAgent
                            },
                        },amountAgent)
                    }
                },
                {
                    title: '公证费',
                    key: 'amountCert',
                    render:(h,params)=>{
                        let amountCert = this.common.formateNumber(params.row.amountCert);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amountCert
                            },
                        },amountCert)
                    }
                },
                {
                    title: '开票状态',
                    key: 'state',//N 已申请 Y已开票
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.state){
                            case "N": color = "warningColor"; break;
                            case "Y": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.stateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    key: 'action',
                    width:160,
                    slot:'action'
                },
            ],
            id:"",
            type:"",
            infoCtrl:false,
            printCtrl:false,
            logisticsCtrl:false,
            defaultData:"",
            expressNo:"",
            company:"",
            billingCtrl:false,
            operate:'info'
        }
    },
    props: ['orderId'],
    methods: {
        getData(){
            let url = '/settlement/trade/sale/order/invoice';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
                orderId:this.orderId
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        /***********操作************/
        option(name,row){
            this.id = row.id;
            switch (name) {
                case 'edit':
                    this.billingCtrl = true;
                    this.operate = 'edit';
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.state = "";
            this.reloadTable();
        },
        editFinish(data){
            if(data){
                this.reloadTable();
            }
            this.billingCtrl = false;
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
            this.invoiceStateArr = await this.common.getDictionaryItems('invoice_state');
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
        this.getData();
    },
    updated(){},
    components: {
        billingForm
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
.absolute-icon{
    position: absolute;
    right: 0;
    top: -2px;
}
</style>