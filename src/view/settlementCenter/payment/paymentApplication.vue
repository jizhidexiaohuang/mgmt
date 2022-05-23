<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Dropdown transfer trigger="click" placement="bottom-start" @on-click="openApply">
                            <Button type="primary">
                                付款申请
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem v-for="(item,index) in filterPaymentArr" :name="item.value" :key="index">{{item.nameZh}}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="付款单号/收款人" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    项目名称
                                </Col>
                                <Col span="18">
                                    <mySelect ref="projectSelect"
                                        :path="'/business/projects'"
                                        :placeholder="'请选择项目'"
                                        :placeholderInput="'请输入项目'"
                                        :keyName="'name'"
                                        @getValue="getProjectId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    申请日期
                                </Col>
                                <Col span="18">
                                    <DatePicker type="daterange" v-model="applyDate"
                                    @on-change="getApplyDate" placement="bottom-end" placeholder="请选择申请日期" style="width:100%"></DatePicker>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    支出类目
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.category" clearable>
                                        <Option v-for="item in paymentCategoryArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state">
                                        <Option v-for="item in financePaymentStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                    <Table :columns="columns" :data="data"
                        :loading="tableLoading">
                        <template slot-scope="{ row, index }" slot="action">
                            <Dropdown v-if="row.state=='P'||row.state=='R'" @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="del">删除</DropdownItem>
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
        </div>

        <!-- 付款确认 -->
        <Modal
            v-model="confirmCtrl"
            :width="300"
            title="提示"
            :footer-hide="true">
            <Row style="font-size:14px;margin-bottom:10px;">请问是否确认该付款单已付款？</Row>
            <Row style="text-align:center;">
                <Button type="primary">确认</Button>
                <Button @click="confirmCtrl=false">取消</Button>
            </Row>
        </Modal>

        <!-- 驳回确认 -->
        <Modal
            v-model="delCtrl"
            :width="300"
            title="提示"
            :footer-hide="true">
            <Row style="font-size:14px;margin-bottom:10px;">请问是否删除该付款单？</Row>
            <Row style="text-align:center;">
                <Button type="primary" @click="confirmDel">确认</Button>
                <Button @click="delCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 付款申请 -->
        <Drawer 
            v-model="paymentCtrl"
            width="600"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span v-if="!isInfo">付款申请</span>
                <span v-else>付款明细</span>
            </div>
            <payment-apply-form v-if="!isInfo&&paymentCtrl" :categoryObj="categoryObj" @closeModal="closeModal"></payment-apply-form>
            <payment-detail v-if="isInfo&&paymentCtrl" :defaultData="defaultData"></payment-detail>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import paymentApplyForm from './paymentApplyForm.vue';
import paymentDetail from './paymentDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            paymentCtrl:false,
            delCtrl:false,
            searchForm:{
                keyword:"",
                projectId:"",
                paymentDateStart:"",
                paymentDateEnd:"",
                category:"",
                state:""
            },
            paymentCategoryArr:[],
            financePaymentStateArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            infoCtrl:false,
            columns:[
                {
                    title:"付款单号",
                    key:"code",
                    width:130,
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
                    title:"申请人",
                    key:"applyUser"
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1));
                    }
                },
                {
                    title:"所属项目",
                    key:"projectName",
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
                    title:"支出类目",
                    key:"categoryName"
                },
                {
                    title:"收款人",
                    key:"bankUser"
                },
                {
                    title:"支出金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.amount));
                    }
                },
                {
                    title:"付款状态",
                    key:"state",
                    render:(h,params)=>{
                        let color;
                        let text = "待付款";
                        switch (params.row.state){
                            case 'P': color = 'warningColor';text='待付款'; break;
                            case 'S': color = 'successColor';text='已付款'; break;
                            case 'R': color = 'errorColor';text='已驳回'; break;
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
                    title:"备注",
                    key:"remark",
                    render:(h,params)=>{
                        return h("span",{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            },
                        },params.row.remark)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            printCtrl:false,
            defaultData:"",
            confirmCtrl:false,
            applyDate:[],
            categoryObj:{
                value:"",
                name:""
            },
            isInfo:false
        }
    },
    props: [''],
    computed:{
        filterPaymentArr(){
            let arr = [];
            let filterArr = ["A","B","C","E","F"];
            this.paymentCategoryArr.forEach((item,index)=>{
                if(filterArr.indexOf(item.value) == -1){
                    arr.push(item);
                }
            })
            return arr
        }
    },
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance-payments';
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
        getDetail(){
            let url = `/settlement/finance-payment/${this.id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                    this.isInfo = true;
                    this.paymentCtrl = true;
                }
            })
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        //获取申请时间
        getApplyDate(data){
            this.searchForm.paymentDateStart = data[0];
            this.searchForm.paymentDateEnd = data[1];
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
        confirmDel(){
            let url = `/settlement/finance-payment/${this.id}/remove`;
            this.$del(url).then(res=>{
                if(res.code==0){
                    this.delCtrl = false;
                    this.$Message.success("操作成功!");
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.applyDate = [];
            this.$refs.projectSelect.clearSelected();
            this.reloadTable();
        },
        openApply(value){
            this.categoryObj.value = value;
            this.filterPaymentArr.forEach((item,index)=>{
                if(value==item.value){
                    this.categoryObj.name = item.nameZh;
                    return
                }
            })
            this.isInfo = false;
            this.paymentCtrl = true;
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            this.isBatch = false;
            switch(name){
                case "del":
                    this.delCtrl = true;
                    break;
            }
        },
        closeModal(reload){
            this.paymentCtrl = false;
            if(reload){
                this.reloadTable();
            }
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.paymentCategoryArr = await this.common.getDictionaryItems('payment_category');
            this.financePaymentStateArr = await this.common.getDictionaryItems('finance_payment_state');
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
        paymentApplyForm,
        paymentDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
</style>