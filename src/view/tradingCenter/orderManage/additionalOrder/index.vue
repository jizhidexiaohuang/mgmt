<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-if="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left"><Button type="primary" @click="additionalCtrl=true">附加订单录入</Button></Col>
                    <!-- 筛选框 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="订单编号/案件编号" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click.stop="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    律师团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="lawyerSelect"
                                        :path="'/base/lawyer-teams'"
                                        :keyName="'name'"
                                        :width="190"
                                        placeholder="请选择律师团队"
                                        @getValue="getLawyerTeamsId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    类型
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.type" style="width:190px;" clearable>
                                        <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    支付状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state" style="width:190px;" clearable>
                                        <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                            <Dropdown @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="delete" v-if="row.state=='W'">删除</DropdownItem>
                                    <DropdownItem name="refund" v-if="row.state=='P'">退款</DropdownItem>
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
                    show-elevator show-sizer />
                </Row>
            </div>
        </div>

        <!-- 编辑抽屉 -->
        <Drawer 
            width="600" 
            v-model="additionalCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">附加订单录入</div>
            <additional-form v-if="additionalCtrl" @closeDrawer="changeCtrl"></additional-form>
        </Drawer>
        
        <!-- 删除/退款 -->
        <Modal
            v-model="deleteModal"
            :title="type=='delete'?'删除确认':'退款确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">{{type=='delete'?'请问是否删除此附加订单？':'请问是否对此订单进行退款？'}}</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="comfirmSubmit">确认</Button>
                <Button @click="deleteModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 案件详情 -->
        <case-detail v-if="infoCtrl" :caseDetail="caseDetail" :optionsCtrl="false">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
        </case-detail>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import additionalForm from './additionalForm.vue';
import caseDetail from '../../../case/caseDetail.vue';
export default {
    data () {
        return {
            searchBoxCtrl:false,
            tableLoading:false,
            table:{
                recordsTotal:100,
                pageNum:1,
                pageSize:this.config.pageSize
            },
            searchForm:{
                keyword:'',
                state:"",
                type:"",
                teamId:'',
            },
            typeArr:[],
            stateArr:[],
            columns: [
                {
                    title: '补建订单编号',
                    key: 'code',
                    width:130,
                    render:(h, params) => {
                        let dom = h("span",{
                            class:["textover"],
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
                    title: '律师团队',
                    key: 'teamName',
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
                    title: '案件编号',
                    key: 'caseCode',
                    width:120,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title: '金额',
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
                    title: '类型',
                    key: 'typeName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.typeName
                            },
                        },params.row.typeName)
                    }
                },
                {
                    title: '录入日期',
                    key: 'createTime',
                    render:(h,params)=>{
                        let createTime = this.common.formatTime(params.row.createTime);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:createTime
                            },
                        },createTime)
                    }
                },
                {
                    title: '备注',
                    key: 'remark',
                },
                {
                    title: '支付状态',
                    key: 'state',
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='W':color = 'warningColor';break;
                            case state=='P':color = 'successColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
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
                    title: '支付日期',
                    key: 'payTime',
                    render:(h,params)=>{
                        let payTime = this.common.formatTime(params.row.payTime);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:payTime
                            },
                        },payTime)
                    }
                },
                {
                    title: '操作',
                    width:160,
                    slot:'action',
                }
            ],
            data: [],
            additionalCtrl:false,
            additionalDetail:'',
            deleteModal:false,
            id:'',
            infoCtrl:false,
            caseDetail:'',
            type:''
        }
    },
    props: [''],
    methods: {
        getData(){
            this.tableLoading = true;
            let url = "/settlement/trade/sale/order/additional/mgmt";
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize
            };
            Object.assign(ajaxData,this.searchForm);
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code===0){
                    this.data = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }else{
                    this.$Message.error(res.message); 
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
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.lawyerSelect.clearSelected();
            this.reloadTable();
        },
        //筛选律师团队
        getLawyerTeamsId(data){
            this.searchForm.teamId = data.id;
        },
        option(row,name){
            this.id = row.id;
            this.type = name;
            this.deleteModal = true;
        },
        // 删除
        comfirmSubmit(){
            if(this.type=='delete'){
                let url = '/settlement/trade/sale/order/additional/'+this.id;
                this.$del(url).then(res=>{
                    if(res.code==0){
                        this.deleteModal = false;
                        this.$Message.success('操作成功！');
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else if(this.type=='refund'){
                let url = '/settlement/case-sale-refund/order-additional/'+this.id;
                this.$patch(url).then(res=>{
                    if(res.code==0){
                        this.deleteModal = false;
                        this.$Message.success('操作成功！');
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        // 退款
        refundMoney(){

        },
        // 获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.infoCtrl = true;
                }
            })
        },
        changeCtrl(data){
            if(data){
                this.reloadTable();
            }
            this.additionalCtrl = false;
        },
        // 获取字典数据接口
        async getDictionary(){
            this.typeArr = await this.common.getDictionaryItems('order_additional_type');
            this.stateArr = await this.common.getDictionaryItems('order_additional_state');
        },
    },
    created(){

    },
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    updated(){

    },
    activated(){
        this.getData();
    },
    components: {
        additionalForm,
        caseDetail
    },
    watch: {}
}
</script>
