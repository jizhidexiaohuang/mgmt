<template>
    <div class="have-drawer-style">
        <Row v-if="!infoCtrl">
            <Row>
                <Row class="inside-close-icon">
                    <slot name='close-icon'></slot>
                </Row>
                <Row class="detail-header">
                    <span>邮寄批次内案件详情</span>
                </Row>
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
                                <DropdownItem name="see">查看</DropdownItem>
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

        <Row v-if="infoCtrl" :style="blockStyle">
            <!-- 案件详情 -->
            <case-detail :caseDetail="caseDetail" :style="{top:'0px'}" :optionsCtrl="false">
                <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
            </case-detail>
        </Row> 


        <!-- 物流信息 -->
        <Modal
            v-model="caseCtrl"
            title="案件流转信息"
            width="550"
            :footer-hide="true">
            <Table :columns="tableColumns" :data="tableData"></Table>
        </Modal>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>
    </div>
</template>
<script>
import styles from './../../../assets/globalStyle.scss';
import caseDetail from './../../case/caseDetail.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                state:""
            },
            searchBoxCtrl:false,
            tableLoading:false,
            logisticsCtrl:false,
            caseCtrl:false,
            infoCtrl:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:125,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.globalMainColor
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseDetail(params.row.caseId)
                                }
                            }
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"对方当事人",
                    key:"litigantNames"
                },
                {
                    title:"项目名称",
                    key:"projectName",
                },
                {
                    title:"公证书",
                    key:"certificateNo",
                },
                {
                    title:"购买时间",
                    key:"purchaseTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.purchaseTime,1))
                    }
                },
                {
                    title:"是否邮寄公证物",
                    key:"notary",
                    render:(h,params)=>{
                        let str = params.row.notary?"是":"否";
                        return h("span",str)
                    }
                },
                {
                    title:"是否邮寄公证书",
                    key:"certificate",
                    render:(h,params)=>{
                        let str = params.row.certificate?"是":"否";
                        return h("span",str)
                    }
                },
                {
                    title:"是否邮寄公证发票",
                    key:"notaryInvoice",
                    render:(h,params)=>{
                        if(!params.row.invoice){
                            return h("span","无发票")
                        }
                        
                        let str = params.row.notaryInvoice?"是":"否";
                        return h("span",str)
                    }
                },
                {
                    title:"操作",
                    key: 'action',
                    width:160,
                    slot:'action'
                },
            ],
            tableColumns:[
                {
                    title:"收件人",
                    key:"receiverName"
                },
                {
                    title:"寄件人",
                    key:"sendName"
                },
                {
                    title:"邮寄时间",
                    key:"postDate"
                },
                {
                    title:"快递单号",
                    key:"courierNumber",
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover"],
                            style:{ color:styles.globalMainColor },
                            attrs:{ title:params.row.courierNumber },
                            on:{
                                "click":()=>{
                                   this.expressNo = params.row.courierNumber;
                                   this.company = params.row.courierCompany;
                                   this.logisticsCtrl = true;
                                }
                            }
                        },params.row.courierNumber);
                        return dom
                    }
                },
            ],
            tableData:[],
            id:"",
            type:"",
            expressNo:"",
            company:"",
            caseDetail:"",
            blockStyle:{
                "min-height":"",
                "margin":"-16px"
            }
        }
    },
    props: ['mailingId'],
    methods: {
        getData(){
            let url = '/settlement/order-mailing-detail/list';
            let ajaxData = {
                mailingId:this.mailingId
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data;
            })
        },
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.infoCtrl = true;
                }
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
            this.type = name;
            switch (name) {
                case 'see':
                    this.getRelativeMail()
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.state = "";
            this.reloadTable();
        },
        /************操作************/
        getRelativeMail(){
            let url = `/settlement/order-mailing/${this.id}`;
            this.$get(url).then(res=>{
                this.tableData = res.data || [];
                this.caseCtrl = true;
            })
        }
    },
    created(){},
    beforeMount(){
        this.blockStyle["min-height"] = (document.body.clientHeight - 47 - 50) + "px";
    },
    mounted(){
        this.getData();
    },
    activated(){},
    updated(){},
    components: {
        caseDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
.inside-close-icon{
    float: right;
    font-size: 20px;
    margin-bottom: 5px;
    cursor: pointer;
}
.detail-header{
    float: left;
    background: #fff;
}
</style>
