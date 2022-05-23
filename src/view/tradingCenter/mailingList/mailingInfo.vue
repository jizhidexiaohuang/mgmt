<template>
    <div>
        <Row v-if="!infoCtrl">
            <Row class="absolute-icon">
                <slot name='close-icon'></slot>
            </Row>
            <Row class="header-common-right-box" style="margin-right:25px">
                <Col style="float:left;">
                    <Row class="detail-header" style="background:#fff">
                        <span>邮寄信息详情</span>
                    </Row>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="联系人/公司/电话/邮箱" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                邮寄状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in mailingStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                                <DropdownItem name="edit" v-if="row.mailingState!='S'">修改</DropdownItem>
                                <DropdownItem name="printList">打印清单</DropdownItem>
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

        <mailing-detail-case v-else :mailingId="id">
            <Icon type="md-close" slot="close-icon" @click="infoCtrl=false" />
        </mailing-detail-case>

        <!-- 打印邮寄清单 -->
        <Modal
            v-model="printCtrl"
            width="90%"
            :styles="{padding:0}"
            :closable="false"
            :footer-hide="true">
            <print-mailing :defaultData="defaultData" @closeModal="printCtrl=false"></print-mailing>
        </Modal>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>

        <!-- 修改邮寄信息 -->
        <Modal
            v-model="editCtrl"
            title="修改邮寄信息"
            width="550"
            :footer-hide="true">
            <mailing-form @closeModal="closeModal" v-if="editCtrl" :defaultData="defaultData" :caseList="defaultData.saleOrderMailingDetailList" :receiveId="defaultData.receiverInfoId"></mailing-form>
        </Modal>
    </div>
</template>
<script>
import styles from './../../../assets/globalStyle.scss';
import mailingDetailCase from "./mailingDetailCase.vue";
import printMailing from "./printMailing.vue";
import mailingForm from "./mailingForm.vue";
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                state:""
            },
            searchBoxCtrl:false,
            mailingStateArr:[],
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"邮寄类型",
                    key:"type",
                    render:(h,params)=>{
                        let str = params.row.type=="M"?"快递邮寄":"当面交易";
                        let spanDom = h('span',str);
                        return spanDom
                    }
                },
                {
                    title:"快递公司",
                    key:"companyName"
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
                {
                    title:"邮寄时间",
                    key:"postDate",
                },
                {
                    title:"邮件状态",
                    key:"mailingState"
                },
                {
                    title:"签收人",
                    key:"receiverName"
                },
                {
                    title:"签收时间",
                    key:"receiverTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.receiverTime,1))
                    }
                },
                {
                    title:"签收凭证",
                    key:"attachmentList",
                    render:(h,params)=>{
                        if(params.row.attachmentList.length==0){
                            return h("span","-")
                        }else{
                            return h("span","查看")
                        }
                    }
                },
                {
                    title:"案件数量",
                    key:"saleOrderMailingDetailList",
                    align:"center",
                    render:(h, params) => {
                        let str = params.row.saleOrderMailingDetailList?params.row.saleOrderMailingDetailList.length:0;
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
                                    this.id = params.row.id;
                                    this.infoCtrl = true;
                                }
                            }
                        },str+"件");
                        return dom
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
            editCtrl:false
        }
    },
    props: ['receiveId'],
    methods: {
        getData(){
            let url = '/settlement/order-mailing';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
                receiverInfoId:this.receiveId
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
            this.type = name;
            this.defaultData = row;
            switch (name) {
                case 'edit':
                    this.editCtrl = true;
                    break;
                case 'printList': 
                    this.printCtrl = true;
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.state = "";
            this.reloadTable();
        },
        closeModal(reload){
            this.editCtrl = false;
            if(reload){
                this.reloadTable();
            }
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
            this.mailingStateArr = await this.common.getDictionaryItems('mailing_state');
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
        mailingDetailCase,
        printMailing,
        mailingForm
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
