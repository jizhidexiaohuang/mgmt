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
                                <DatePicker :value="collectionDate" 
                                    style="width:190px;"
                                    @on-change="getDate($event,'income')" 
                                    type="daterange" placement="bottom-end" 
                                    placeholder="请选择时间"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                创建时间
                            </Col>
                            <Col span="18">
                                <DatePicker :value="createDate" 
                                    style="width:190px;"
                                    @on-change="getDate($event,'create')" 
                                    type="daterange" placement="bottom-end" 
                                    placeholder="请选择时间"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                认领状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.claimStatus" placeholder="请选择认领状态" style="width:190px">
                                    <Option v-for="item in claimStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="claim" v-if="row.claimStatus!='PD'">认领</DropdownItem>
                                <DropdownItem name="info" v-if="row.claimStatus!='TB'">认领明细</DropdownItem>
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
        <!-- 新增认领 -->
        <Drawer 
            width="600" 
            v-model="infoCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>款项认领</span>
                <Dropdown transfer @on-click="option(collectionDetail)" class="edit-icon" v-if="false">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="info">认领明细</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <collection-claim-form v-if="infoCtrl" @changeCtrl="changeCtrl" :incomeId="id"></collection-claim-form>
        </Drawer>
        <!-- 认领明细 -->
        <Modal 
            v-model="claimDetailCtrl" 
            :width="800"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">认领明细</div>
            <claim-detail v-if="claimDetailCtrl" :incomeId="id"></claim-detail>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import collectionClaimForm from './collectionClaimForm.vue';
import claimDetail from './plugin/claimDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                incomeStartDate:'',
                incomeEndDate:'',
                createStartDate:'',
                createEndDate:'',
                claimStatus:'',
            },
            collectionDate:[],
            createDate:[],
            claimStatusArr:[],
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
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.code
                            },
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"创建日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.createTime))
                    }
                },
                {
                    title: '付款人',
                    key: 'payer',
                },
                {
                    title: '付款金额',
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
                    title: '待认领金额',
                    key: 'pendingClaimAmount',
                    render:(h,params)=>{
                        let pendingClaimAmount = this.common.formateNumber(params.row.pendingClaimAmount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:pendingClaimAmount
                            },
                        },pendingClaimAmount)
                    }
                },
                {
                    title:"认领状态",
                    key:"claimStatus",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.claimStatus){
                            case "TB": color = "expireColor"; break;
                            case "PR": color = "warningColor"; break;
                            case "PD": color = "successColor"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            style:{
                                borderRadius:'11px'
                            },
                            attrs:{ color:styles[color] }
                        },params.row.claimStatusName)
                    }
                },
                {
                    title:"收款日期",
                    key:"incomeDate",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.incomeDate))
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
            infoCtrl:false,
            claimDetailCtrl:false
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance/claim';
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
            this.collectionDate = [];
            this.createDate = [];
            this.reloadTable();
        },
        getDate(data,name){
            this.searchForm[name+'StartDate'] = data[0];
            this.searchForm[name+'EndDate'] = data[1];
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch (name) {
                case 'claim': 
                    this.infoCtrl = true;
                    break;
                case 'info': 
                    this.claimDetailCtrl = true;
                    break;
            }
        },
        changeCtrl(data){
            if(data){
                this.reloadTable()
            }
            this.infoCtrl = false;
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.claimStatusArr = await this.common.getDictionaryItems('claim_status');
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
        collectionClaimForm,
        claimDetail
    },
    watch: {}
}
</script>
<style scoped lang="scss">

</style>