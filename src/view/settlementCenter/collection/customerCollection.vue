<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;"></Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="收款编号/付款人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                收款时间
                            </Col>
                            <Col span="18">
                                <DatePicker :value="receivedDate" 
                                    style="width:190px;"
                                    @on-change="getDate" 
                                    type="daterange" placement="bottom-end" 
                                    placeholder="请选择时间"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                冲抵状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.offsetState" placeholder="请选择冲抵状态" style="width:190px">
                                    <Option value="N">待冲抵</Option>
                                    <Option value="Y">已冲抵</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                收款客户
                            </Col>
                            <Col span="18">
                                <mySelect ref="custSelect"
                                    style="width:190px;"
                                    :path="'/base/customers'"
                                    :placeholder="'请选择客户'"
                                    :keyName="'name'"
                                    :inputKey="'name'"
                                    @getValue="getCustomerId">
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
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row,$event)" v-if="row.confirmState=='P' || (row.confirmState=='N'&&row.isWithdraw)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="confirm" v-if="row.confirmState=='P'">确认</DropdownItem>
                                <DropdownItem name="withdraw" v-if="row.confirmState=='N'&&row.isWithdraw">撤回</DropdownItem>
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
        <!-- 确认/撤回 -->
        <Modal
            v-model="confirmCtrl"
            :title="type=='confirm'?'收款确认':'撤回确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">{{type=='confirm'?'请问是否确认此条客户收款记录？':'请问是否撤回客户收款记录，如有对应代收记录，一并撤回？'}}</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="comfirmSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import collectionForm from './collectionForm.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                receivedDateStart:'',
                receivedDateEnd:'',
                custId:'',
                offsetState:'',
            },
            receivedDate:[],
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
                    title:"收款编号",
                    key:"code",
                    width:120,
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"收款日期",
                    key:"custReceivedDate",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.custReceivedDate))
                    }
                },
                {
                    title: '收款客户',
                    key: 'customerName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.customerName
                            },
                        },params.row.customerName)
                    }
                },
                {
                    title: '项目名称',
                    key: 'prjectName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.prjectName
                            },
                        },params.row.prjectName)
                    }
                },
                {
                    title: '赔偿金额',
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
                    title: '其他金额',
                    key: 'otherAmount',
                    render:(h,params)=>{
                        let otherAmount = this.common.formateNumber(params.row.otherAmount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:otherAmount
                            },
                        },otherAmount)
                    }
                },
                {
                    title: '案件编号',
                    key: 'caseCode',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.caseCode
                            },
                        },params.row.caseCode)
                    }
                },
                {
                    title:"冲抵状态",
                    key:"offsetState",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.offsetState){
                            case "N": color = "warningColor"; break;
                            case "Y": color = "successColor"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            style:{
                                borderRadius:'11px'
                            },
                            attrs:{ color:styles[color] }
                        },params.row.offsetStateName)
                    }
                },
                {
                    title:"确认状态",
                    key:"confirmState",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.confirmState){
                            case "P": color = "warningColor"; break;
                            case "N": color = "successColor"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            style:{
                                borderRadius:'11px'
                            },
                            attrs:{ color:styles[color] }
                        },params.row.confirmStateName)
                    }
                },
                {
                    title: '备注',
                    key: 'remark',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            },
                        },params.row.remark)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                },
            ],
            type:'',
            confirmCtrl:false,
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance-cust-incomes';
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
                this.searchForm[key] = '';
            }
            this.receivedDate = [];
            this.$refs.custSelect.clearSelected();
            this.reloadTable();
        },
        //获取委托人
        getCustomerId(data){
            this.searchForm.custId = data.id;
        },
        getDate(data){
            this.searchForm.receivedDateStart = data[0];
            this.searchForm.receivedDateEnd = data[1];
        },
        comfirmSubmit(){
            let url;
            if(this.type=='confirm'){
                url = `/settlement/finance-cust-income/${this.id}/confirm`;
            }else{
                url = `/settlement/finance-cust-income/${this.id}/withdraw `;
            }
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.confirmCtrl = false;
                    this.$Message.success('操作成功！');
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
            this.confirmCtrl = true;
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
        },
    },
    created(){},
    activated(){
        this.getData();
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        
    },
    updated(){},
    components: {
        collectionForm
    },
    watch: {}
}
</script>
<style scoped lang="scss">

</style>